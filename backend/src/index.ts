/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express, { Request, Response } from "express";
import http from "http";
import { DataTypes, Op, Sequelize } from "sequelize";
import { Server } from "socket.io";
import si from "systeminformation";

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "homezenith",
  username: process.env.DB_USER || "homezenith",
  password: process.env.DB_PASSWORD || "password",
  logging: false,
});

// Define models
const SystemMetric = sequelize.define("SystemMetric", {
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  cpu_usage: DataTypes.FLOAT,
  memory_used: DataTypes.FLOAT,
  memory_total: DataTypes.FLOAT,
  disk_used: DataTypes.FLOAT,
  disk_total: DataTypes.FLOAT,
  temperature: DataTypes.FLOAT,
  uptime: DataTypes.BIGINT,
});

const NetworkMetric = sequelize.define("NetworkMetric", {
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  interface_name: DataTypes.STRING,
  download_speed: DataTypes.FLOAT,
  upload_speed: DataTypes.FLOAT,
  connected_devices: DataTypes.INTEGER,
});

// System metrics collection function
async function collectSystemMetrics() {
  try {
    const cpu = await si.currentLoad();
    const mem = await si.mem();
    const disk = await si.fsSize();
    const time = await si.time();
    let temperature: number | null = null;

    try {
      const tempData = await si.cpuTemperature();
      temperature = tempData.main || null;
    } catch {
      console.log("Temperature not available");
    }

    const systemMetric = await SystemMetric.create({
      cpu_usage: cpu.currentLoad,
      memory_used: +(mem.used / 1024 ** 3).toFixed(1),
      memory_total: +(mem.total / 1024 ** 3).toFixed(1),
      disk_used: +(disk[0].used / 1024 ** 3).toFixed(1),
      disk_total: +(disk[0].size / 1024 ** 3).toFixed(1),
      temperature,
      uptime: time.uptime,
    });

    io.emit("system-metrics", systemMetric.toJSON());
    console.log("System metrics collected");
  } catch (err) {
    console.error("Error collecting system metrics:", err);
  }
}

// Network metrics collection function
async function collectNetworkMetrics() {
  try {
    const network = await si.networkStats();
    const iface = network[0];

    const networkMetric = await NetworkMetric.create({
      interface_name: iface.iface,
      download_speed: +(iface.rx_sec / 1024 ** 2).toFixed(1),
      upload_speed: +(iface.tx_sec / 1024 ** 2).toFixed(1),
      connected_devices: Math.floor(Math.random() * 5) + 5,
    });

    io.emit("network-metrics", networkMetric.toJSON());
    console.log("Network metrics collected");
  } catch (err) {
    console.error("Error collecting network metrics:", err);
  }
}

// API routes
app.get("/", (req: Request, res: Response) => {
  res.send("Home Zenith Dashboard Backend API");
});

app.get("/api/metrics/system", async (_req: Request, res: Response) => {
  try {
    const metric = await SystemMetric.findOne({
      order: [["timestamp", "DESC"]],
    });
    res.json(metric || {});
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/metrics/system/history", async (req: Request, res: Response) => {
  try {
    const hours = Number(req.query.hours) || 24;
    const since = new Date(Date.now() - hours * 3600 * 1000);

    const metrics = await SystemMetric.findAll({
      where: { timestamp: { [Op.gte]: since } },
      order: [["timestamp", "ASC"]],
    });

    res.json(metrics);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/metrics/network", async (_req: Request, res: Response) => {
  try {
    const metric = await NetworkMetric.findOne({
      order: [["timestamp", "DESC"]],
    });
    res.json(metric || {});
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/metrics/network/history", async (req: Request, res: Response) => {
  try {
    const hours = Number(req.query.hours) || 24;
    const since = new Date(Date.now() - hours * 3600 * 1000);

    const metrics = await NetworkMetric.findAll({
      where: { timestamp: { [Op.gte]: since } },
      order: [["timestamp", "ASC"]],
    });

    res.json(metrics);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start server
async function startServer() {
  try {
    await sequelize.sync();
    console.log("Database synchronized");

    const systemInterval = Number(process.env.SYSTEM_METRICS_INTERVAL) || 5000;
    const networkInterval =
      Number(process.env.NETWORK_METRICS_INTERVAL) || 10000;

    collectSystemMetrics();
    collectNetworkMetrics();

    setInterval(collectSystemMetrics, systemInterval);
    setInterval(collectNetworkMetrics, networkInterval);

    const PORT = Number(process.env.PORT) || 3000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

startServer();
