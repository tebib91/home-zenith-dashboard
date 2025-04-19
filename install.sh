#!/bin/bash

# ZenithOS Installation Script
# This script installs and configures the Home Zenith Dashboard system

# Set error handling
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Temp directory for downloads
TEMP_DIR="/tmp/zenith-install"

# Log file
LOG_FILE="/tmp/zenith-install.log"

# Minimum system requirements
MIN_MEMORY=1024 # 1GB in MB
MIN_DISK=5120   # 5GB in MB

# Function to log messages
log_message() {
  local level=$1
  local message=$2
  echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $message" | tee -a "$LOG_FILE"
}

# Function to check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Function to check architecture
Check_Arch() {
  log_message "INFO" "${BLUE}Checking system architecture...${NC}"

  ARCH=$(uname -m)
  case "$ARCH" in
    x86_64|amd64)
      log_message "INFO" "${GREEN}Architecture: x86_64/amd64 - Supported${NC}"
      ;;
    aarch64|arm64)
      log_message "INFO" "${GREEN}Architecture: ARM64 - Supported${NC}"
      ;;
    armv7l)
      log_message "INFO" "${YELLOW}Architecture: ARMv7 - Limited support${NC}"
      ;;
    *)
      log_message "ERROR" "${RED}Unsupported architecture: $ARCH${NC}"
      exit 1
      ;;
  esac
}

# Function to check OS
Check_OS() {
  log_message "INFO" "${BLUE}Checking operating system...${NC}"

  OS=$(uname -s)
  case "$OS" in
    Linux)
      log_message "INFO" "${GREEN}Operating System: Linux - Supported${NC}"
      ;;
    Darwin)
      log_message "INFO" "${YELLOW}Operating System: macOS - Limited support${NC}"
      log_message "WARNING" "${YELLOW}Some features may not work correctly on macOS${NC}"
      ;;
    *)
      log_message "ERROR" "${RED}Unsupported operating system: $OS${NC}"
      exit 1
      ;;
  esac
}

# Function to check Linux distribution
Check_Distribution() {
  log_message "INFO" "${BLUE}Checking Linux distribution...${NC}"

  if [ "$(uname -s)" != "Linux" ]; then
    log_message "INFO" "${YELLOW}Not a Linux system, skipping distribution check${NC}"
    return 0
  fi

  if [ -f /etc/os-release ]; then
    . /etc/os-release
    DISTRO=$ID
    VERSION=$VERSION_ID

    case "$DISTRO" in
      debian|ubuntu|raspbian)
        log_message "INFO" "${GREEN}Distribution: $PRETTY_NAME - Supported${NC}"
        ;;
      fedora|centos|rhel)
        log_message "INFO" "${YELLOW}Distribution: $PRETTY_NAME - Limited support${NC}"
        ;;
      *)
        log_message "WARNING" "${YELLOW}Distribution: $PRETTY_NAME - Untested${NC}"
        read -p "Continue with installation? (y/n): " -n 1 -r REPLY
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
          log_message "ERROR" "${RED}Installation aborted by user${NC}"
          exit 1
        fi
        ;;
    esac
  else
    log_message "WARNING" "${YELLOW}Could not determine Linux distribution${NC}"
    read -p "Continue with installation? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      log_message "ERROR" "${RED}Installation aborted by user${NC}"
      exit 1
    fi
  fi
}

# Function to check memory
Check_Memory() {
  log_message "INFO" "${BLUE}Checking system memory...${NC}"

  if [ "$(uname -s)" = "Linux" ]; then
    TOTAL_MEM=$(free -m | awk '/^Mem:/{print $2}')
  elif [ "$(uname -s)" = "Darwin" ]; then
    TOTAL_MEM=$(sysctl -n hw.memsize | awk '{print $0/1024/1024}')
  else
    log_message "WARNING" "${YELLOW}Could not determine system memory${NC}"
    return 0
  fi

  if [ -z "$TOTAL_MEM" ] || [ "$TOTAL_MEM" -lt "$MIN_MEMORY" ]; then
    log_message "ERROR" "${RED}Insufficient memory: ${TOTAL_MEM:-Unknown}MB (Minimum: ${MIN_MEMORY}MB)${NC}"
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      log_message "ERROR" "${RED}Installation aborted due to insufficient memory${NC}"
      exit 1
    fi
  else
    log_message "INFO" "${GREEN}Memory: ${TOTAL_MEM}MB - Sufficient${NC}"
  fi
}

# Function to check disk space
Check_Disk() {
  log_message "INFO" "${BLUE}Checking disk space...${NC}"

  INSTALL_DIR="$(pwd)"
  if [ "$(uname -s)" = "Linux" ]; then
    AVAIL_DISK=$(df -m "$INSTALL_DIR" | awk 'NR==2 {print $4}')
  elif [ "$(uname -s)" = "Darwin" ]; then
    AVAIL_DISK=$(df -m "$INSTALL_DIR" | awk 'NR==2 {print $4}')
  else
    log_message "WARNING" "${YELLOW}Could not determine available disk space${NC}"
    return 0
  fi

  if [ -z "$AVAIL_DISK" ] || [ "$AVAIL_DISK" -lt "$MIN_DISK" ]; then
    log_message "ERROR" "${RED}Insufficient disk space: ${AVAIL_DISK:-Unknown}MB (Minimum: ${MIN_DISK}MB)${NC}"
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      log_message "ERROR" "${RED}Installation aborted due to insufficient disk space${NC}"
      exit 1
    fi
  else
    log_message "INFO" "${GREEN}Disk space: ${AVAIL_DISK}MB - Sufficient${NC}"
  fi
}

# Function to update package resources
Update_Package_Resource() {
  log_message "INFO" "${BLUE}Updating package resources...${NC}"

  if [ "$(uname -s)" != "Linux" ]; then
    log_message "INFO" "${YELLOW}Not a Linux system, skipping package update${NC}"
    return 0
  fi

  if command_exists apt-get; then
    log_message "INFO" "Updating apt repositories..."
    apt-get update -y >> "$LOG_FILE" 2>&1 || {
      log_message "ERROR" "${RED}Failed to update apt repositories${NC}"
      exit 1
    }
  elif command_exists dnf; then
    log_message "INFO" "Updating dnf repositories..."
    dnf check-update >> "$LOG_FILE" 2>&1 || true
  elif command_exists yum; then
    log_message "INFO" "Updating yum repositories..."
    yum check-update >> "$LOG_FILE" 2>&1 || true
  else
    log_message "WARNING" "${YELLOW}Unknown package manager, skipping update${NC}"
  fi

  log_message "INFO" "${GREEN}Package resources updated successfully${NC}"
}

# Function to install dependencies
Install_Depends() {
  log_message "INFO" "${BLUE}Installing dependencies...${NC}"

  if [ "$(uname -s)" != "Linux" ]; then
    log_message "INFO" "${YELLOW}Not a Linux system, skipping dependency installation${NC}"
    return 0
  fi

  DEPS="curl wget git nodejs npm"

  if command_exists apt-get; then
    log_message "INFO" "Installing dependencies with apt..."
    apt-get install -y $DEPS >> "$LOG_FILE" 2>&1 || {
      log_message "ERROR" "${RED}Failed to install dependencies with apt${NC}"
      exit 1
    }
  elif command_exists dnf; then
    log_message "INFO" "Installing dependencies with dnf..."
    dnf install -y $DEPS >> "$LOG_FILE" 2>&1 || {
      log_message "ERROR" "${RED}Failed to install dependencies with dnf${NC}"
      exit 1
    }
  elif command_exists yum; then
    log_message "INFO" "Installing dependencies with yum..."
    yum install -y $DEPS >> "$LOG_FILE" 2>&1 || {
      log_message "ERROR" "${RED}Failed to install dependencies with yum${NC}"
      exit 1
    }
  else
    log_message "ERROR" "${RED}No supported package manager found${NC}"
    exit 1
  fi

  log_message "INFO" "${GREEN}Dependencies installed successfully${NC}"
}

# Function to check dependency installation
Check_Dependency_Installation() {
  log_message "INFO" "${BLUE}Verifying dependencies...${NC}"

  MISSING_DEPS=""
  for dep in curl wget git nodejs npm; do
    if ! command_exists "$dep"; then
      MISSING_DEPS="$MISSING_DEPS $dep"
    fi
  done

  if [ -n "$MISSING_DEPS" ]; then
    log_message "WARNING" "${YELLOW}Some dependencies are still missing:${MISSING_DEPS}${NC}"
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      log_message "ERROR" "${RED}Installation aborted due to missing dependencies${NC}"
      exit 1
    fi
  else
    log_message "INFO" "${GREEN}All dependencies are installed${NC}"
  fi
}

# Function to check and install Docker
Check_Docker_Install() {
  log_message "INFO" "${BLUE}Checking Docker installation...${NC}"

  if command_exists docker; then
    DOCKER_VERSION=$(docker --version | cut -d ' ' -f3 | cut -d ',' -f1)
    log_message "INFO" "${GREEN}Docker is already installed (version: $DOCKER_VERSION)${NC}"
    return 0
  fi

  log_message "INFO" "Docker not found, installing..."

  if [ "$(uname -s)" != "Linux" ]; then
    log_message "WARNING" "${YELLOW}Automatic Docker installation is only supported on Linux${NC}"
    log_message "INFO" "Please install Docker manually from https://docs.docker.com/get-docker/"
    read -p "Continue after installing Docker manually? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      log_message "ERROR" "${RED}Installation aborted${NC}"
      exit 1
    fi
    return 0
  fi

  # Install Docker using the convenience script
  curl -fsSL https://get.docker.com -o get-docker.sh >> "$LOG_FILE" 2>&1
  sh get-docker.sh >> "$LOG_FILE" 2>&1
  rm get-docker.sh

  # Install Docker Compose
  if ! command_exists docker-compose; then
    log_message "INFO" "Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/download/v2.20.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose >> "$LOG_FILE" 2>&1
    chmod +x /usr/local/bin/docker-compose >> "$LOG_FILE" 2>&1
  fi

  # Add current user to docker group to avoid using sudo
  if [ -z "${SUDO_USER}" ]; then
    CURRENT_USER="$USER"
  else
    CURRENT_USER="$SUDO_USER"
  fi

  if [ -n "$CURRENT_USER" ]; then
    usermod -aG docker "$CURRENT_USER" >> "$LOG_FILE" 2>&1 || true
    log_message "INFO" "${YELLOW}Added user $CURRENT_USER to the docker group. You may need to log out and back in for this to take effect.${NC}"
  fi

  # Verify Docker installation
  if command_exists docker; then
    DOCKER_VERSION=$(docker --version | cut -d ' ' -f3 | cut -d ',' -f1)
    log_message "INFO" "${GREEN}Docker installed successfully (version: $DOCKER_VERSION)${NC}"
  else
    log_message "ERROR" "${RED}Docker installation failed${NC}"
    exit 1
  fi
}

# Function to check if ZenithOS already exists
Check_Exist() {
  log_message "INFO" "${BLUE}Checking for existing ZenithOS installation...${NC}"

  if [ -d "home-zenith-dashboard" ]; then
    log_message "WARNING" "${YELLOW}ZenithOS installation directory already exists${NC}"
    read -p "Overwrite existing installation? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      log_message "ERROR" "${RED}Installation aborted by user${NC}"
      exit 1
    fi
    log_message "INFO" "Removing existing installation..."
    rm -rf home-zenith-dashboard
  fi

  # Create temp directory for downloads
  mkdir -p "$TEMP_DIR"
}

# Function to download ZenithOS
Download_zenithOs() {
  log_message "INFO" "${BLUE}Downloading ZenithOS...${NC}"

  # Clone the repository
  git clone https://github.com/tebib91/home-zenith-dashboard.git >> "$LOG_FILE" 2>&1 || {
    log_message "ERROR" "${RED}Failed to download ZenithOS${NC}"
    exit 1
  }

  log_message "INFO" "${GREEN}ZenithOS downloaded successfully${NC}"
}

# Function to install addons
Install_Addons() {
  log_message "INFO" "${BLUE}Installing addons...${NC}"

  cd home-zenith-dashboard || {
    log_message "ERROR" "${RED}ZenithOS directory not found${NC}"
    exit 1
  }

  # Install frontend dependencies
  log_message "INFO" "Installing frontend dependencies..."
  npm install >> "$LOG_FILE" 2>&1 || {
    log_message "ERROR" "${RED}Failed to install frontend dependencies${NC}"
    exit 1
  }

  # Install backend dependencies
  log_message "INFO" "Installing backend dependencies..."
  cd backend || {
    log_message "ERROR" "${RED}Backend directory not found${NC}"
    exit 1
  }
  npm install >> "$LOG_FILE" 2>&1 || {
    log_message "ERROR" "${RED}Failed to install backend dependencies${NC}"
    exit 1
  }

  cd ..

  log_message "INFO" "${GREEN}Addons installed successfully${NC}"
}

# Function to configure addons
Configuration_Addons() {
  log_message "INFO" "${BLUE}Configuring addons...${NC}"

  cd home-zenith-dashboard || {
    log_message "ERROR" "${RED}ZenithOS directory not found${NC}"
    exit 1
  }

  # Configure backend environment
  cd backend || {
    log_message "ERROR" "${RED}Backend directory not found${NC}"
    exit 1
  }

  if [ -f ".env.example" ] && [ ! -f ".env" ]; then
    log_message "INFO" "Creating .env file from template..."
    cp .env.example .env

    # Generate random password and JWT secret
    DB_PASSWORD=$(tr -dc 'a-zA-Z0-9' < /dev/urandom | fold -w 16 | head -n 1)
    JWT_SECRET=$(tr -dc 'a-zA-Z0-9' < /dev/urandom | fold -w 32 | head -n 1)

    # Update .env file with secure values
    sed -i.bak "s/your_password_here/$DB_PASSWORD/g" .env
    sed -i.bak "s/your_jwt_secret_key_here/$JWT_SECRET/g" .env
    rm -f .env.bak

    log_message "INFO" "${GREEN}Environment configuration created${NC}"
  else
    log_message "INFO" "${YELLOW}Environment file already exists or template not found${NC}"
  fi

  cd ..

  log_message "INFO" "${GREEN}Addons configured successfully${NC}"
}

# Function to install ZenithOS
Install_ZenithOs() {
  log_message "INFO" "${BLUE}Installing ZenithOS...${NC}"

  cd home-zenith-dashboard || {
    log_message "ERROR" "${RED}ZenithOS directory not found${NC}"
    exit 1
  }

  # Build frontend
  log_message "INFO" "Building frontend..."
  npm run build >> "$LOG_FILE" 2>&1 || {
    log_message "ERROR" "${RED}Failed to build frontend${NC}"
    exit 1
  }

  # Build backend
  cd backend || {
    log_message "ERROR" "${RED}Backend directory not found${NC}"
    exit 1
  }
  npm run build >> "$LOG_FILE" 2>&1 || {
    log_message "ERROR" "${RED}Failed to build backend${NC}"
    exit 1
  }

  cd ..

  log_message "INFO" "${GREEN}ZenithOS installed successfully${NC}"
}

# Function to generate service files
Generate_Service() {
  log_message "INFO" "${BLUE}Generating service files...${NC}"

  if [ "$(uname -s)" != "Linux" ]; then
    log_message "INFO" "${YELLOW}Service generation is only supported on Linux${NC}"
    return 0
  fi

  cd home-zenith-dashboard/backend || {
    log_message "ERROR" "${RED}Backend directory not found${NC}"
    exit 1
  }

  # Create systemd service file
  SERVICE_FILE="/etc/systemd/system/zenith.service"
  INSTALL_DIR="$(pwd)"

  cat > "$SERVICE_FILE" << EOL
[Unit]
Description=Home Zenith Dashboard
After=network.target

[Service]
Type=simple
User=$CURRENT_USER
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=zenith
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOL

  log_message "INFO" "${GREEN}Service files generated successfully${NC}"
}

# Function to start ZenithOS
Start_ZenithOs() {
  log_message "INFO" "${BLUE}Starting ZenithOS...${NC}"

  cd home-zenith-dashboard/backend || {
    log_message "ERROR" "${RED}Backend directory not found${NC}"
    exit 1
  }

  if [ "$(uname -s)" = "Linux" ] && [ -f "/etc/systemd/system/zenith.service" ]; then
    # Enable and start the service
    systemctl daemon-reload >> "$LOG_FILE" 2>&1
    systemctl enable zenith.service >> "$LOG_FILE" 2>&1
    systemctl start zenith.service >> "$LOG_FILE" 2>&1

    # Check if service started successfully
    if systemctl is-active --quiet zenith.service; then
      log_message "INFO" "${GREEN}ZenithOS service started successfully${NC}"
    else
      log_message "ERROR" "${RED}Failed to start ZenithOS service${NC}"
      log_message "INFO" "You can check the service status with: systemctl status zenith.service"
    fi
  else
    # Start using Docker Compose
    log_message "INFO" "Starting ZenithOS using Docker Compose..."
    docker-compose up -d >> "$LOG_FILE" 2>&1 || {
      log_message "ERROR" "${RED}Failed to start ZenithOS with Docker Compose${NC}"
      exit 1
    }
    log_message "INFO" "${GREEN}ZenithOS started successfully with Docker Compose${NC}"
  fi
}

# Function to clean temporary files
Clean_Temp_Files() {
  log_message "INFO" "${BLUE}Cleaning temporary files...${NC}"

  rm -rf "$TEMP_DIR"

  log_message "INFO" "${GREEN}Temporary files cleaned successfully${NC}"
}

# Function to clear terminal
Clear_Term() {
  clear
}

# Function to display welcome banner
Welcome_Banner() {
  cat << "EOF"
  _    _                       _______          _ _   _      ____   _____
 | |  | |                     |___  / |        (_) | | |    / __ \ / ____|
 | |__| | ___  _ __ ___   ___    / /| |__   ___ _| |_| |__ | |  | | (___
 |  __  |/ _ \| '_ ` _ \ / _ \  / / | '_ \ / _ \ | __| '_ \| |  | |\___ \
 | |  | | (_) | | | | | |  __/ / /__| | | |  __/ | |_| | | | |__| |____) |
 |_|  |_|\___/|_| |_| |_|\___/_____|_| |_|\___|_|\__|_| |_|\____/|_____/

EOF

  echo -e "\n${GREEN}ZenithOS has been successfully installed!${NC}\n"

  # Display access information
  if [ "$(uname -s)" = "Linux" ] && [ -f "/etc/systemd/system/zenith.service" ]; then
    echo -e "${BLUE}Service Status:${NC} systemctl status zenith.service"
  else
    echo -e "${BLUE}Docker Status:${NC} docker-compose ps"
  fi

  echo -e "${BLUE}Dashboard URL:${NC} http://localhost:3000"
  echo -e "${BLUE}API URL:${NC} http://localhost:3000/api"
  echo -e "\n${YELLOW}For more information, please refer to the documentation.${NC}\n"
}

# Main installation process
main() {
  # Create log file
  touch "$LOG_FILE"

  log_message "INFO" "${GREEN}Starting ZenithOS installation...${NC}"

  # Step 1: Check ARCH
  Check_Arch

  # Step 2: Check OS
  Check_OS

  # Step 3: Check Distribution
  Check_Distribution

  # Step 4: Check System Required
  Check_Memory
  Check_Disk

  # Step 5: Install Depends
  Update_Package_Resource
  Install_Depends
  Check_Dependency_Installation

  # Step 6: Check And Install Docker
  Check_Docker_Install

  # Step 7: Download ZenithOs
  Check_Exist
  Download_zenithOs

  # Step 8: Install Addon
  Install_Addons

  # Step 8.1: Configuration Addon
  Configuration_Addons

  # Step 9: Install zenithOS
  Install_ZenithOs

  # Step 10: Generate_Service
  Generate_Service

  # Step 11: Start zenith
  Start_ZenithOs
  Clean_Temp_Files

  # Step 12: Welcome
  Clear_Term
  Welcome_Banner

  log_message "INFO" "${GREEN}ZenithOS installation completed successfully${NC}"
}

# Run the main function
main

#-----------------------------------------------------------------------------------
exit 0
#-------------------------------------------------------------
