from pydantic import BaseModel
from datetime import date, datetime, timezone
import time
import cv2
import os
from uuid import uuid4
import logging

"""
    Usei logging ao invés de print para mostrar o que está acontencendo,
    preferência minha.
"""
logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s | %(name)s | [%(levelname)s] %(message)s",
                    datefmt="%Y-%m-%d %H:%M:%S")
logger = logging.getLogger("Pipeline")

logger.debug("Alocando GPU")
from gait_engine import GaitAnalysisEngine
ia_engine = GaitAnalysisEngine()
logger.debug("Modelo carregado")

"""
    Primeiro defini as classes com pydantic, porque depois já fica no formato
    que o FastAPI espera. Defini as classes abaixo e criei a função getMetadata
    para puxar os dados iniciais que vão ser utilizados na função da Fase 1, com
    base no fluxograma do Obsidian.
"""
class JobInfo(BaseModel):
    _job_id: str
    _status: str
    _stage: str
    _created_at: datetime
    _started_at: datetime | None = None
    _finished_at: datetime | None = None
    _duration_ms: int

class ErrorInfo(BaseModel):
    _code: str
    _message: str
    _stage: str
    _details: str | None = None
    _retryable: bool

class InputSummary(BaseModel):
    _video_path: str
    _height_mm: int
    _rotated: bool
    _window_L: int
    _fps: float
    _duration_ms: int

class QualityInfo(BaseModel):
    _frames_total: int
    _frames_without_detection: int
    _warnings: list[str]

class BiomechanicalData(BaseModel):
    _events: list
    _kinematics: list
    _pose3d_url: list | None = None

class ResultV1(BaseModel):
    _result_version: str
    _job: JobInfo
    _error: ErrorInfo | None = None
    _input_summary: InputSummary | None = None
    _quality_info: QualityInfo | None = None
    _data: BiomechanicalData | None = None

"""
    Essa é a função que puxa os dados iniciais, ela usa OpenCV
    para abrir o vídeo e extrair suas propriedades apenas, 
    tem como parâmetro o caminho para o vídeo que será feito
    upload e retorna um dict com os resultados. Dentro dela há
    tratamento de erros e warnings com base nos resultados.
    Os warnings eu defini com base na minha intuição apenas,
    não tem um motivo específico dos valores definidos.
"""
def getMetadata(file_path):
    if os.path.isfile(file_path): # Se o path realmente existe
        cap = cv2.VideoCapture(file_path) # Abre o vídeo com o OpenCV

        if cap.isOpened(): # Se o vídeo abriu
            warnings = [] # Cria uma lista pros warnings dessa função

            fps = cap.get(cv2.CAP_PROP_FPS) # Usa OpenCV para extrair o FPS
            if fps<=0: # Tratamento de erros caso o FPS for inválido
                cap.release()
                raise ValueError("ERROR_101_FPS_INVALID")
            elif fps<30: # Warning se o FPS for muito baixo
                warnings.append("WARNING_101_LOW_FPS")

            width = int(cap.get(cv2.CAP_PROP_WIDTH)) # Extrai a resolução com OpenCV
            height = int(cap.get(cv2.CAP_PROP_HEIGHT))
            if width < 400 or height < 400: # Warning se a resolução for muito baixa
                warnings.append("WARNING_103_LOW_RES")

            frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) # Extrai o número de frames
            duration_s = frame_count / fps; # Calcula a duração em segundos
            if duration_s <= 0: # Tratamento de erros para duração inválida
                cap.release()
                raise ValueError("ERROR_102_VIDEO_DURATION")
            elif duration_s < 2: # Warning se o vídeo for muito curto
                warnings.append("WARNING_102_VIDEO_SHORT")
            duration_ms = int(duration_s * 1000); # Converto a duração para ms

            if height > width: # Descubro se o vídeo ta em pé ou deitado
                rotated = True
            else:
                rotated = False

        else:
            cap.release()
            raise ValueError("ERROR_103_VIDEO_OPEN") # Tratamento de erros se o vídeo não abrir

    else:
        cap.release()
        raise ValueError("ERROR_104_PATH") # Tratamento de erros pro caminho do vídeo errado

    cap.release()
    return { # dict de retorno com os resultados
        "is_valid": True,
        "warnings": warnings,
        "fps": fps,
        "width": width,
        "height": height,
        "frame_count": frame_count,
        "duration_ms": duration_ms,
        "rotated": rotated
    }

def run_pipeline(video_path, height_mm, window_L):
    logger.info("Iniciando pipeline")
    logger.debug("Criando job")

    job = JobInfo(
        _job_id = str(uuid4()),
        _status = "running",
        _stage = "ingest",
        _created_at = datetime.now(timezone.utc),
        _started_at = datetime.now(timezone.utc),
        _finished_at = 0,
        _duration_ms = 0
    )

    logger.debug("Job criado, entrando no try")

    try:
        logger.info("Extraindo metadados")

        video_data = getMetadata(video_path) # Extrai todos os metadados dos vídeos

        logger.info("Metadados extraídos, instanciando classes")

        input_summary = InputSummary( # Com base nos metadados, preenche o InputSummary
            _video_path = video_path,
            _height_mm = height_mm,
            _window_L = window_L,
            _rotated = video_data["rotated"],
            _fps = video_data["fps"],
            _duration_ms = video_data["duration_ms" ]
        )

        logger.debug("InputSummary foi")

        quality_info = QualityInfo( # Aqui, com base nos metadados também, são preenchidos os dados da qualidade dos frames
            _frames_total = video_data["frame_count"],
            _frames_without_detection = 0,
            _warnings = video_data["warnings"]
        )

        logger.debug("QualityInfo foi")

        if video_data["is_valid"]:
            job._status = "processing"
            job._stage = "fase_1"

            logger.info("Video validado, começando Fase 1")

            raw_data = ia_engine._process_video( # Aqui chama a função que vai processar o vídeo
                video_path = video_path,
                window_L = window_L
            )

            logger.info("Vídeo processado com sucesso")

            job._status("completed")
            job._stage("finished")
            job._finished_at = datetime.now(timezone.utc)
            job._duration_ms = int((job._finished_at - job._started_at).total_seconds() * 1000) # Calculei o momento final - inicial para ter a duração exata, a função total_seconds converte para segundos, que multiplicados por 1000 ficam em ms

            return ResultV1(
                _result_version = "1.0",
                _job = job,
                _input_summary = input_summary,
                _quality_info = quality_info
            )

        else:
            logger.error("Video inválido")

            error_info = ErrorInfo(
                _code = "ERROR_VIDEO_INVALID",
                _message = "O vídeo enviado não pôde ser aberto ou não atende aos requisitos básicos",
                _stage = job._stage,
                _retryable = False,
                _details = str(video_data["warnings"])
            )

            job._status = "failed"

            return ResultV1(
                _result_version = "1.0",
                _job = job,
                _error = error_info,
                _input_summary = input_summary,
                _quality_info = quality_info
            )

    except ValueError as e:
        error_code = str(e)

        error_info = ErrorInfo(
            _code = error_code,
            _message = "O vídeo falhou na validação inicial do OpenCV",
            _stage = "ingest",
            _retryable = False
        )

        job._status = "failed"

        return ResultV1(
            _result_version = "1.0",
            _job = job,
            _error = error_info,
            # Aqui o restante dos atributos fica automaticamente como None
        )