from pydantic import BaseModel
from datetime import date
import cv2
import os

"""
    Primeiro defini as classes com pydantic, porque depois já fica no formato
    que o FastAPI espera. Defini as classes abaixo e criei a função getMetadata
    para puxar os dados iniciais que vão ser utilizados na função da Fase 1, com
    base no fluxograma do Obsidian.
"""
class JobInfo(BaseModel):
    job_id: int
    status: str
    stage: str
    created_at: date
    started_at: date | None = None
    finished_at: date | None = None
    duration_ms: int

class ErrorInfo(BaseModel):
    code: str
    message: str
    stage: str
    details: str | None = None
    retryable: bool

class InputSummary(BaseModel):
    video_path: str
    height_mm: int
    rotated: bool
    window_L: int
    fps: float
    duration_ms: int

class QualityInfo(BaseModel):
    frames_total: int
    frames_without_detection: int
    warnings: list[str]

class ResultV1(BaseModel):
    result_version: str
    job: JobInfo
    error: ErrorInfo | None = None
    input_summary: InputSummary
    quality: QualityInfo

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

def fase1():
    pass

def fase2():
    pass

def fase3():
    pass

def run_pipeline(video_path, height_mm, window_L):
    try{
        
    }
    except{

    }
    
    return result_v1
