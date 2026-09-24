#!/bin/bash
# ============================================================
# TRAJEKTIA — Script de sauvegarde automatisée
# Version  : 1.0.0
# Date     : 2026-04-28
# Cron     : 0 2 * * * /opt/trajektia/scripts/backup.sh
#            (Tous les jours à 2h00 UTC)
#
# Prérequis :
#   - rclone configuré avec un remote OVH Object Storage (rclone.conf)
#   - Variables d'environnement chargées (.env)
#   - docker compose up (les conteneurs doivent être en marche)
# ============================================================

set -euo pipefail

# ── Configuration ────────────────────────────────────────────
BACKUP_DIR="/opt/trajektia/backups"
DATE=$(date +"%Y%m%d_%H%M%S")
RETENTION_DAYS=30
RCLONE_REMOTE="ovh-object-storage:trajektia-backups"

# Charger les variables d'environnement
source /opt/trajektia/.env

# ── Répertoire de sauvegarde ──────────────────────────────────
mkdir -p "${BACKUP_DIR}/${DATE}"
BACKUP_PATH="${BACKUP_DIR}/${DATE}"

echo "======================================================"
echo "TRAJEKTIA Backup — $(date)"
echo "======================================================"

# ── 1. Sauvegarde PostgreSQL ──────────────────────────────────
echo "[1/3] Sauvegarde PostgreSQL..."
docker exec trajektia_postgres pg_dumpall \
    -U postgres \
    --clean \
    --if-exists \
    | gzip > "${BACKUP_PATH}/postgres_full_${DATE}.sql.gz"

echo "      ✅ PostgreSQL : $(du -sh ${BACKUP_PATH}/postgres_full_${DATE}.sql.gz | cut -f1)"

# ── 2. Sauvegarde Neo4j ───────────────────────────────────────
echo "[2/3] Sauvegarde Neo4j (MemMachine CKG)..."
docker exec trajektia_neo4j neo4j-admin database dump \
    --database=neo4j \
    --to-path=/tmp/neo4j_backup_${DATE}.dump

docker cp trajektia_neo4j:/tmp/neo4j_backup_${DATE}.dump \
    "${BACKUP_PATH}/"

gzip "${BACKUP_PATH}/neo4j_backup_${DATE}.dump"
echo "      ✅ Neo4j : $(du -sh ${BACKUP_PATH}/neo4j_backup_${DATE}.dump.gz | cut -f1)"

# ── 3. Sauvegarde uploads Directus (Archivé - actif si volume présent) ────────
if docker volume inspect trajektia_directus_uploads >/dev/null 2>&1; then
    echo "[3/3] Sauvegarde uploads Directus..."
    docker run --rm \
        -v trajektia_directus_uploads:/data \
        -v "${BACKUP_PATH}":/backup \
        alpine:3.19 \
        tar czf /backup/directus_uploads_${DATE}.tar.gz -C /data .
    echo "      ✅ Directus uploads : $(du -sh ${BACKUP_PATH}/directus_uploads_${DATE}.tar.gz | cut -f1)"
fi

# ── 4. Synchronisation vers OVH Object Storage ───────────────
echo "[4/4] Synchronisation vers OVH Object Storage..."
rclone copy "${BACKUP_PATH}" "${RCLONE_REMOTE}/${DATE}/" \
    --progress \
    --log-level INFO

echo "      ✅ Synchronisé vers : ${RCLONE_REMOTE}/${DATE}/"

# ── 5. Nettoyage des sauvegardes locales anciennes ───────────
echo "[5/5] Nettoyage des sauvegardes locales > ${RETENTION_DAYS} jours..."
find "${BACKUP_DIR}" -maxdepth 1 -type d -mtime +${RETENTION_DAYS} -exec rm -rf {} \; 2>/dev/null || true
echo "      ✅ Nettoyage terminé"

# ── Rapport final ─────────────────────────────────────────────
TOTAL_SIZE=$(du -sh "${BACKUP_PATH}" | cut -f1)
echo ""
echo "======================================================"
echo "✅ Sauvegarde terminée — $(date)"
echo "   Taille totale : ${TOTAL_SIZE}"
echo "   Stockage OVH  : ${RCLONE_REMOTE}/${DATE}/"
echo "======================================================"
