# Self-Hosting

LLMs Forge is open source and can be self-hosted.

---

## Prerequisites

- :material-nodejs: Node.js 18+
- :material-package: pnpm (recommended) or npm

---

## Installation

```bash
# Clone the repository
git clone https://github.com/nirholas/lyra-tool-discovery.git
cd lyra-tool-discovery/llms-forge

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

!!! success "Ready"
    The app will be available at `http://localhost:3001`.

---

## Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

---

## Deployment Options

=== "Vercel"

    The easiest way to deploy is with Vercel:

    1. Fork the repository
    2. Connect to Vercel
    3. Set root directory to `llms-forge`
    4. Deploy

    !!! info "No environment variables required"

=== "Railway"

    ```bash
    # Install Railway CLI
    npm install -g @railway/cli

    # Login and deploy
    railway login
    railway init
    railway up
    ```

=== "Docker"

    Create a `Dockerfile`:

    ```dockerfile
    FROM node:18-alpine

    WORKDIR /app

    RUN npm install -g pnpm

    COPY package.json pnpm-lock.yaml ./
    RUN pnpm install --frozen-lockfile

    COPY . .
    RUN pnpm build

    EXPOSE 3001
    CMD ["pnpm", "start"]
    ```

    Build and run:

    ```bash
    docker build -t llms-forge .
    docker run -p 3001:3001 llms-forge
    ```

---

## Configuration

!!! tip "Zero Config"
    LLMs Forge works out of the box with no configuration required. The port can be changed in `package.json` scripts.
