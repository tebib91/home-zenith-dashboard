# Server Monitoring Backend Architecture

## Overview
This document outlines the architecture for the server monitoring backend that will support the Home Zenith Dashboard. The backend will collect system metrics from the server, store them in PostgreSQL, and provide API endpoints for the frontend to consume.

## Technology Stack

### Core Technologies
- **Node.js**: Runtime environment for the backend server
- **Express.js**: Web framework for creating API endpoints
- **PostgreSQL**: Database for storing monitoring data
- **TypeScript**: For type safety and better developer experience
- **Prisma**: ORM for database access
- **Socket.IO**: For real-time updates to the dashboard

### Monitoring Libraries
- **systeminformation**: Node.js library to collect system metrics
- **node-cron**: For scheduling periodic data collection
- **jsonwebtoken**: For API authentication

## Database Schema

```sql
-- Users table for authentication
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System metrics table
CREATE TABLE system_metrics (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  cpu_usage FLOAT NOT NULL,
  memory_used FLOAT NOT NULL,
  memory_total FLOAT NOT NULL,
  disk_used FLOAT NOT NULL,
  disk_total FLOAT NOT NULL,
  temperature FLOAT,
  uptime BIGINT NOT NULL
);

-- Network metrics table
CREATE TABLE network_metrics (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  interface_name VARCHAR(50) NOT NULL,
  download_speed FLOAT NOT NULL,
  upload_speed FLOAT NOT NULL,
  connected_devices INTEGER
);

-- Docker container metrics
CREATE TABLE docker_metrics (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  container_id VARCHAR(100) NOT NULL,
  container_name VARCHAR(100) NOT NULL,
  cpu_usage FLOAT NOT NULL,
  memory_usage FLOAT NOT NULL,
  status VARCHAR(20) NOT NULL
);
```

## API Endpoints

### Authentication
- `POST /api/auth/login`: User login
- `POST /api/auth/register`: User registration
- `POST /api/auth/refresh`: Refresh authentication token

### System Metrics
- `GET /api/metrics/system`: Get latest system metrics
- `GET /api/metrics/system/history`: Get historical system metrics with filtering options

### Network Metrics
- `GET /api/metrics/network`: Get latest network metrics
- `GET /api/metrics/network/history`: Get historical network metrics

### Docker Metrics
- `GET /api/metrics/docker`: Get all container metrics
- `GET /api/metrics/docker/:containerId`: Get metrics for a specific container

### Server Control
- `POST /api/server/reboot`: Reboot the server (requires admin privileges)
- `POST /api/server/shutdown`: Shutdown the server (requires admin privileges)

## Real-time Updates
The backend will use Socket.IO to push real-time updates to the frontend whenever new metrics are collected. This will allow the dashboard to display live data without constant polling.

## Data Collection Service

A background service will run on the server to collect metrics at regular intervals:

1. **System Metrics**: Collected every 5 seconds
2. **Network Metrics**: Collected every 10 seconds
3. **Docker Metrics**: Collected every 15 seconds

Older metrics will be aggregated over time to prevent database bloat:
- Data less than 24 hours old: Full resolution
- Data 1-7 days old: Aggregated to 1-minute intervals
- Data older than 7 days: Aggregated to 15-minute intervals
- Data older than 30 days: Aggregated to hourly intervals

## Deployment

### Requirements
- Debian or Raspberry Pi OS
- Node.js 18+ installed
- PostgreSQL 13+ installed
- Docker (optional, for containerized deployment)

### Installation Steps
1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables
4. Initialize the database with `npx prisma migrate dev`
5. Start the server with `npm start`

### Environment Variables
```
DATABASE_URL=postgresql://username:password@localhost:5432/homezenith
JWT_SECRET=your_jwt_secret_key
PORT=3000
NODE_ENV=production
```

## Security Considerations
- All API endpoints will be protected with JWT authentication
- Sensitive operations will require additional verification
- Database credentials will be stored as environment variables
- HTTPS will be used for all API communications
- Rate limiting will be implemented to prevent abuse

## Integration with Frontend
The existing React frontend will need to be updated to fetch data from the new backend API endpoints. The current mock data in components like `SystemStats.tsx`, `CpuRamWidget.tsx`, and `NetworkWidget.tsx` will be replaced with real data from the API.

## Next Steps
1. Set up the basic Express.js server with TypeScript
2. Configure PostgreSQL and Prisma
3. Implement authentication system
4. Create data collection services
5. Develop API endpoints
6. Implement real-time updates with Socket.IO
7. Update frontend components to use the new API
8. Deploy and test on target hardware
