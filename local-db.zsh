CONTAINER_NAME="dev-postgres"
DB_USERNAME="postgres"
DB_NAME="hostel_dev"

# Get the current date and time in a format like "YYYYMMDDHHMMSS"
# TIMESTAMP=$(date +\%Y\%m\%d\%H\%M\%S)

# Define the paths for the backup inside the container and a temporary path on the host
CONTAINER_BACKUP_PATH="/tmp/db_backup.sql"
TEMP_HOST_BACKUP_PATH="/Users/kowalski/Code/webapps/freelance/event-management-app/backend/db_.zip"

# Backup the PostgreSQL database inside the container
docker exec -t $CONTAINER_NAME pg_dump -U $DB_USERNAME -d $DB_NAME | gzip > $TEMP_HOST_BACKUP_PATH
echo "Backup completed and copied to $TEMP_HOST_BACKUP_PATH"
