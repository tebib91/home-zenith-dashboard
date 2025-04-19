# Home Zenith Dashboard Backend

This is the backend server for the Home Zenith Dashboard application. It provides system monitoring capabilities for Debian or Raspberry Pi systems, storing metrics in PostgreSQL and exposing them through a REST API.

## Features

- Real-time system metrics collection (CPU, memory, disk usage)
- Network monitoring (download/upload speeds, connected devices)
- Docker container monitoring
- Historical data storage and retrieval
- Authentication and authorization
- WebSocket support for real-time dashboard updates

## Prerequisites

- Node.js 18 or higher
- PostgreSQL 13 or higher
- Debian-based Linux or Raspberry Pi OS

## Installation

### 1. Clone the repository

If you haven't already cloned the main repository:

```bash
git clone <your-repository-url>
cd home-zenith-dashboard/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up PostgreSQL

Install PostgreSQL if not already installed:

```bash
# For Debian/Ubuntu
sudo apt update
sudo apt install postgresql postgresql-contrib

# For Raspberry Pi OS
sudo apt update
sudo apt install postgresql
```

Create a database and user:

```bash
sudo -u postgres psql
```

In the PostgreSQL prompt:

```sql
CREATE DATABASE homezenith;
CREATE USER homezenith WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE homezenith TO homezenith;
\q
```

### 4. Configure environment variables

Create a `.env` file in the backend directory:

```
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=homezenith
DB_USER=homezenith
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

# Monitoring settings
SYSTEM_METRICS_INTERVAL=5000
NETWORK_METRICS_INTERVAL=10000
DOCKER_METRICS_INTERVAL=15000
```

### 5. Initialize the database

The application will automatically create the necessary tables on first run.

## Running the Server

### Development mode

```bash
npm run dev
```

### Production mode

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login`: User login
- `POST /api/auth/register`: User registration

### System Metrics
- `GET /api/metrics/system`: Get latest system metrics
- `GET /api/metrics/system/history`: Get historical system metrics

### Network Metrics
- `GET /api/metrics/network`: Get latest network metrics
- `GET /api/metrics/network/history`: Get historical network metrics

### Docker Metrics
- `GET /api/metrics/docker`: Get all container metrics
- `GET /api/metrics/docker/:containerId`: Get metrics for a specific container

## Integration with Frontend

The frontend components in the Home Zenith Dashboard are already designed to display system metrics. You'll need to update the following components to fetch data from the backend API instead of using mock data:

- `src/components/dashboard/SystemStats.tsx`
- `src/components/widgets/CpuRamWidget.tsx`
- `src/components/widgets/NetworkWidget.tsx`
- `src/components/widgets/DockerWidget.tsx`

## Deployment

### Systemd Service (Recommended for Debian/Raspberry Pi)

Create a systemd service file:

```bash
sudo nano /etc/systemd/system/homezenith.service
```

Add the following content:

```
[Unit]
Description=Home Zenith Dashboard Backend
After=network.target postgresql.service

[Service]
Type=simple
User=your_username
WorkingDirectory=/path/to/home-zenith-dashboard/backend
ExecStart=/usr/bin/npm start
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl enable homezenith
sudo systemctl start homezenith
```

## Security Considerations

- All API endpoints are protected with JWT authentication
- Database credentials are stored as environment variables
- Use HTTPS in production environments
- Regularly update dependencies to patch security vulnerabilities

## License

MIT
