require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cron = require('node-cron');
const si = require('systeminformation');
const { Sequelize, DataTypes } = require('sequelize');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'homezenith',
  username: process.env.DB_USER || 'homezenith',
  password: process.env.DB_PASSWORD || 'password',
  logging: false
});

// Define models
const SystemMetric = sequelize.define('SystemMetric', {
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  cpu_usage: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  memory_used: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  memory_total: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  disk_used: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  disk_total: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  temperature: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  uptime: {
    type: DataTypes.BIGINT,
    allowNull: false
  }
});

const NetworkMetric = sequelize.define('NetworkMetric', {
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  interface_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  download_speed: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  upload_speed: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  connected_devices: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
});

// System metrics collection function
async function collectSystemMetrics() {
  try {
    // Get CPU usage
    const cpuData = await si.currentLoad();
    const cpuUsage = cpuData.currentLoad;

    // Get memory usage
    const memData = await si.mem();
    const memoryUsed = Math.round(memData.used / (1024 * 1024 * 1024) * 10) / 10; // GB
    const memoryTotal = Math.round(memData.total / (1024 * 1024 * 1024) * 10) / 10; // GB

    // Get disk usage
    const diskData = await si.fsSize();
    const mainDisk = diskData[0]; // Using the first disk
    const diskUsed = Math.round(mainDisk.used / (1024 * 1024 * 1024) * 10) / 10; // GB
    const diskTotal = Math.round(mainDisk.size / (1024 * 1024 * 1024) * 10) / 10; // GB

    // Get temperature (may not be available on all systems)
    let temperature = null;
    try {
      const tempData = await si.cpuTemperature();
      temperature = tempData.main;
    } catch (error) {
      console.log('Temperature data not available');
    }

    // Get uptime
    const uptimeData = await si.time();
    const uptime = uptimeData.uptime;

    // Save to database
    const systemMetric = await SystemMetric.create({
      cpu_usage: cpuUsage,
      memory_used: memoryUsed,
      memory_total: memoryTotal,
      disk_used: diskUsed,
      disk_total: diskTotal,
      temperature,
      uptime
    });

    // Emit to connected clients
    io.emit('system-metrics', {
      timestamp: systemMetric.timestamp,
      cpu_usage: cpuUsage,
      memory_used: memoryUsed,
      memory_total: memoryTotal,
      disk_used: diskUsed,
      disk_total: diskTotal,
      temperature,
      uptime
    });

    console.log('System metrics collected');
  } catch (error) {
    console.error('Error collecting system metrics:', error);
  }
}

// Network metrics collection function
async function collectNetworkMetrics() {
  try {
    // Get network stats
    const networkStats = await si.networkStats();
    const mainInterface = networkStats[0]; // Using the first interface

    // Calculate speeds in MB/s
    const downloadSpeed = Math.round(mainInterface.rx_sec / (1024 * 1024) * 10) / 10;
    const uploadSpeed = Math.round(mainInterface.tx_sec / (1024 * 1024) * 10) / 10;

    // Get connected devices (this is a placeholder - actual implementation would depend on your network setup)
    // For example, you might use arp-scan or similar tools
    const connectedDevices = Math.floor(Math.random() * 5) + 5; // Mock data for now

    // Save to database
    const networkMetric = await NetworkMetric.create({
      interface_name: mainInterface.iface,
      download_speed: downloadSpeed,
      upload_speed: uploadSpeed,
      connected_devices: connectedDevices
    });

    // Emit to connected clients
    io.emit('network-metrics', {
      timestamp: networkMetric.timestamp,
      interface_name: mainInterface.iface,
      download_speed: downloadSpeed,
      upload_speed: uploadSpeed,
      connected_devices: connectedDevices
    });

    console.log('Network metrics collected');
  } catch (error) {
    console.error('Error collecting network metrics:', error);
  }
}

// API routes
app.get('/', (req, res) => {
  res.send('Home Zenith Dashboard Backend API');
});

// System metrics endpoints
app.get('/api/metrics/system', async (req, res) => {
  try {
    const latestMetric = await SystemMetric.findOne({
      order: [['timestamp', 'DESC']]
    });
    res.json(latestMetric || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/metrics/system/history', async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const metrics = await SystemMetric.findAll({
      where: {
        timestamp: {
          [Sequelize.Op.gte]: since
        }
      },
      order: [['timestamp', 'ASC']]
    });

    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Network metrics endpoints
app.get('/api/metrics/network', async (req, res) => {
  try {
    const latestMetric = await NetworkMetric.findOne({
      order: [['timestamp', 'DESC']]
    });
    res.json(latestMetric || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/metrics/network/history', async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const metrics = await NetworkMetric.findAll({
      where: {
        timestamp: {
          [Sequelize.Op.gte]: since
        }
      },
      order: [['timestamp', 'ASC']]
    });

    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Initialize database and start server
async function startServer() {
  try {
    // Sync database models
    await sequelize.sync();
    console.log('Database synchronized');

    // Start metrics collection
    const systemInterval = process.env.SYSTEM_METRICS_INTERVAL || 5000;
    const networkInterval = process.env.NETWORK_METRICS_INTERVAL || 10000;

    // Collect metrics immediately on startup
    collectSystemMetrics();
    collectNetworkMetrics();

    // Schedule regular collection
    setInterval(collectSystemMetrics, systemInterval);
    setInterval(collectNetworkMetrics, networkInterval);

    // Start server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();
