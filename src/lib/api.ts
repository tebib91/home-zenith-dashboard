/**
 * API client for the Home Zenith Dashboard backend
 */

// Base URL for the backend API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Types for system metrics
export interface SystemMetric {
  timestamp: string;
  cpu_usage: number;
  memory_used: number;
  memory_total: number;
  disk_used: number;
  disk_total: number;
  temperature: number | null;
  uptime: number;
}

// Types for network metrics
export interface NetworkMetric {
  timestamp: string;
  interface_name: string;
  download_speed: number;
  upload_speed: number;
  connected_devices: number;
}

// Types for docker container metrics
export interface DockerMetric {
  timestamp: string;
  container_id: string;
  container_name: string;
  cpu_usage: number;
  memory_usage: number;
  status: string;
}

/**
 * Fetch the latest system metrics
 */
export async function getSystemMetrics(): Promise<SystemMetric> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/metrics/system`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching system metrics:', error);
    // Return mock data if the API is not available
    return {
      timestamp: new Date().toISOString(),
      cpu_usage: 23,
      memory_used: 3.7,
      memory_total: 16,
      disk_used: 128,
      disk_total: 512,
      temperature: 45,
      uptime: 86400
    };
  }
}

/**
 * Fetch historical system metrics
 * @param hours Number of hours of history to fetch
 */
export async function getSystemMetricsHistory(hours: number = 24): Promise<SystemMetric[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/metrics/system/history?hours=${hours}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching system metrics history:', error);
    return [];
  }
}

/**
 * Fetch the latest network metrics
 */
export async function getNetworkMetrics(): Promise<NetworkMetric> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/metrics/network`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching network metrics:', error);
    // Return mock data if the API is not available
    return {
      timestamp: new Date().toISOString(),
      interface_name: 'eth0',
      download_speed: 5.4,
      upload_speed: 1.2,
      connected_devices: 8
    };
  }
}

/**
 * Fetch historical network metrics
 * @param hours Number of hours of history to fetch
 */
export async function getNetworkMetricsHistory(hours: number = 24): Promise<NetworkMetric[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/metrics/network/history?hours=${hours}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching network metrics history:', error);
    return [];
  }
}

/**
 * Setup a WebSocket connection for real-time updates
 * @param onSystemMetrics Callback for system metrics updates
 * @param onNetworkMetrics Callback for network metrics updates
 */
export function setupWebSocket(
  onSystemMetrics: (data: SystemMetric) => void,
  onNetworkMetrics: (data: NetworkMetric) => void
): () => void {
  // This is a placeholder for actual WebSocket implementation
  // In a real implementation, you would use socket.io-client or a similar library
  console.log('WebSocket connection would be established here');

  // Mock periodic updates for development
  const systemInterval = setInterval(() => {
    onSystemMetrics({
      timestamp: new Date().toISOString(),
      cpu_usage: Math.floor(Math.random() * 60) + 10,
      memory_used: Math.floor(Math.random() * 8) + 2,
      memory_total: 16,
      disk_used: Math.floor(Math.random() * 200) + 100,
      disk_total: 512,
      temperature: Math.floor(Math.random() * 20) + 40,
      uptime: 86400 + Math.floor(Math.random() * 3600)
    });
  }, 5000);

  const networkInterval = setInterval(() => {
    onNetworkMetrics({
      timestamp: new Date().toISOString(),
      interface_name: 'eth0',
      download_speed: parseFloat((Math.random() * 8 + 2).toFixed(1)),
      upload_speed: parseFloat((Math.random() * 2 + 0.5).toFixed(1)),
      connected_devices: Math.floor(Math.random() * 5) + 5
    });
  }, 10000);

  // Return a cleanup function
  return () => {
    clearInterval(systemInterval);
    clearInterval(networkInterval);
    console.log('WebSocket connection would be closed here');
  };
}
