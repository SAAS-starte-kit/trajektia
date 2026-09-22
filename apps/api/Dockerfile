# ============================================================
# TRAJEKTIA — Dockerfile FastAPI (apps/api)
# Version  : 1.0.0
# ============================================================

FROM python:3.12-slim

WORKDIR /app

# Dépendances système minimales
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Code source de l'API
COPY . .

# Exposition du port
EXPOSE 8000

# Lancement
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
