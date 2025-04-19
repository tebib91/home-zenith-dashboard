# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/6085e1a7-0fc7-4db9-b65c-1049ea35bff4

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/6085e1a7-0fc7-4db9-b65c-1049ea35bff4) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/6085e1a7-0fc7-4db9-b65c-1049ea35bff4) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Installation with install.sh

ZenithOS provides an automated installation script to simplify setup. This script will check your system, install dependencies, and configure everything for you.

### Prerequisites
- Supported OS: Linux (full support), macOS (limited support)
- Minimum: 1GB RAM, 5GB disk space
- Required: curl, wget, git, nodejs, npm, Docker, Docker Compose (the script will attempt to install these on Linux)

### Usage
1. Download or clone this repository.
2. Open a terminal in the project directory.
3. Make the script executable (if needed):
   ```sh
   chmod +x install.sh
   ```
4. Run the installer:
   ```sh
   ./install.sh
   ```

The script will:
- Check your system architecture, OS, and resources
- Install required dependencies (Linux only)
- Install or verify Docker and Docker Compose
- Download the latest ZenithOS code
- Install frontend and backend dependencies
- Configure environment variables
- Build the project
- Set up and start the service (systemd on Linux, Docker Compose otherwise)

Follow any prompts during installation. At the end, you will see access URLs for the dashboard and API.

### Troubleshooting
- For macOS, some features may be limited and you may need to install dependencies manually.
- Check `/tmp/zenith-install.log` for detailed logs if you encounter issues.

For uninstallation, see `uninstall.sh`.
