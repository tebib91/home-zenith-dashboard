#!/bin/bash

# ZenithOS Uninstallation Script
# This script removes the Home Zenith Dashboard system and all its components

# Set error handling
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Log file
LOG_FILE="/tmp/zenith-uninstall.log"

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

# Function to confirm uninstallation
Confirm_Uninstall() {
  log_message "WARNING" "⚠️  This will completely remove ZenithOS from your system!"
  log_message "WARNING" "⚠️  All data and configurations will be lost."

  echo -n "❓ Are you sure you want to uninstall ZenithOS? (y/n): "
  read answer

  if [[ ! "$answer" =~ ^[Yy]$ ]]; then
    log_message "INFO" "❌ Uninstallation cancelled by user"
    exit 0
  fi

  log_message "INFO" "✅ Proceeding with uninstallation..."
  # uninstall logic here...
}

# Function to stop ZenithOS services
Stop_ZenithOs() {
  log_message "INFO" "${BLUE}Stopping ZenithOS services...${NC}"

  # Check if running in Docker
  if command_exists docker && [ -f "home-zenith-dashboard/docker-compose.yml" ]; then
    log_message "INFO" "Stopping Docker containers..."
    cd home-zenith-dashboard || {
      log_message "WARNING" "${YELLOW}ZenithOS directory not found, skipping Docker container shutdown${NC}"
      return 0
    }
    docker-compose down >> "$LOG_FILE" 2>&1 || {
      log_message "WARNING" "${YELLOW}Failed to stop Docker containers${NC}"
    }
    cd ..
  fi

  # Check if running as a systemd service
  if [ "$(uname -s)" = "Linux" ] && [ -f "/etc/systemd/system/zenith.service" ]; then
    log_message "INFO" "Stopping systemd service..."
    systemctl stop zenith.service >> "$LOG_FILE" 2>&1 || {
      log_message "WARNING" "${YELLOW}Failed to stop zenith service${NC}"
    }
    systemctl disable zenith.service >> "$LOG_FILE" 2>&1 || {
      log_message "WARNING" "${YELLOW}Failed to disable zenith service${NC}"
    }
  fi

  log_message "INFO" "${GREEN}ZenithOS services stopped${NC}"
}

# Function to remove service files
Remove_Service_Files() {
  log_message "INFO" "${BLUE}Removing service files...${NC}"

  if [ "$(uname -s)" = "Linux" ] && [ -f "/etc/systemd/system/zenith.service" ]; then
    log_message "INFO" "Removing systemd service file..."
    rm -f /etc/systemd/system/zenith.service >> "$LOG_FILE" 2>&1 || {
      log_message "WARNING" "${YELLOW}Failed to remove service file${NC}"
    }
    systemctl daemon-reload >> "$LOG_FILE" 2>&1 || {
      log_message "WARNING" "${YELLOW}Failed to reload systemd${NC}"
    }
  fi

  log_message "INFO" "${GREEN}Service files removed${NC}"
}

# Function to remove Docker images
Remove_Docker_Images() {
  log_message "INFO" "${BLUE}Removing Docker images...${NC}"

  if command_exists docker; then
    # Get list of ZenithOS related Docker images
    ZENITH_IMAGES=$(docker images | grep -i zenith | awk '{print $3}') || true

    if [ -n "$ZENITH_IMAGES" ]; then
      log_message "INFO" "Removing ZenithOS Docker images..."
      echo "$ZENITH_IMAGES" | xargs docker rmi -f >> "$LOG_FILE" 2>&1 || {
        log_message "WARNING" "${YELLOW}Failed to remove some Docker images${NC}"
      }
    else
      log_message "INFO" "No ZenithOS Docker images found"
    fi
  else
    log_message "INFO" "Docker not installed, skipping image removal"
  fi

  log_message "INFO" "${GREEN}Docker images removed${NC}"
}

# Function to remove ZenithOS files
Remove_ZenithOs_Files() {
  log_message "INFO" "${BLUE}Removing ZenithOS files...${NC}"

  if [ -d "home-zenith-dashboard" ]; then
    log_message "INFO" "Removing ZenithOS directory..."
    rm -rf home-zenith-dashboard >> "$LOG_FILE" 2>&1 || {
      log_message "ERROR" "${RED}Failed to remove ZenithOS directory${NC}"
      exit 1
    }
  else
    log_message "INFO" "ZenithOS directory not found, nothing to remove"
  fi

  log_message "INFO" "${GREEN}ZenithOS files removed${NC}"
}

# Function to clean environment variables
Clean_Environment() {
  log_message "INFO" "${BLUE}Cleaning environment...${NC}"

  # Remove temporary files
  rm -rf /tmp/zenith-install >> "$LOG_FILE" 2>&1 || true

  # Remove log files (keep uninstall log)
  rm -f /tmp/zenith-install.log >> "$LOG_FILE" 2>&1 || true

  log_message "INFO" "${GREEN}Environment cleaned${NC}"
}

# Function to display farewell message
Farewell_Message() {
  echo -e "\n${GREEN}ZenithOS has been successfully uninstalled from your system!${NC}\n"
  echo -e "${YELLOW}Thank you for trying ZenithOS. We hope to see you again soon!${NC}\n"
}

# Main uninstallation process
main() {
  # Create log file
  touch "$LOG_FILE"

  log_message "INFO" "${GREEN}Starting ZenithOS uninstallation...${NC}"

  # Step 1: Confirm uninstallation
  Confirm_Uninstall

  # Step 2: Stop ZenithOS services
  Stop_ZenithOs

  # Step 3: Remove service files
  Remove_Service_Files

  # Step 4: Remove Docker images
  Remove_Docker_Images

  # Step 5: Remove ZenithOS files
  Remove_ZenithOs_Files

  # Step 6: Clean environment
  Clean_Environment

  # Step 7: Farewell message
  Farewell_Message

  log_message "INFO" "${GREEN}ZenithOS uninstallation completed successfully${NC}"
}

# Run the main function
main

#-----------------------------------------------------------------------------------
exit 0
#-------------------------------------------------------------
