# AGENTS.md

This document provides guidance for AI coding agents and contributors working
on the [Kanvas Docker Extension][repo-url] repository.

## Repository Overview

The Kanvas Docker Extension integrates Kanvas (formerly Meshery Design Canvas)
into Docker Desktop. The project consists of:

- **Backend / VM Service**: A Go-based service (`vm/`) that runs inside the
  extension container, interacting with the Docker engine and host.
- **Frontend UI**: A React-based single-page application located strictly in
  the `ui/` directory, built with Material-UI (MUI) and the Layer5 Sistent
  Design System.
- **Docker Extension Packaging**: Configuration files at the repository root
  (`Dockerfile`, `docker-compose.yaml`, `metadata.json`) defining the
  extension metadata and container structure.

## Development Runbook

The project provides root-level `Makefile` targets for common development and
build workflows:

### Backend & Extension Commands

- **Build VM binary**:

  ```bash
  make bin
  ```

  Compiles the Go service binary into `bin/service`.

- **Build extension image**:

  ```bash
  make extension-build
  ```

  Builds the Docker extension container image.

- **Full local extension development cycle**:

  ```bash
  make build-dev
  ```

  Removes any existing extension installation, builds the container image,
  installs it into Docker Desktop, and enables extension debugging.

### UI Development Commands

The UI code and its `package.json` are located in the `ui/` directory:

- **Run UI locally (via Make)**:

  ```bash
  make ui
  ```

  Starts the local React development server (runs on `http://localhost:3000`).

- **Build UI production bundle (via Make)**:

  ```bash
  make ui-build
  ```

  Installs dependencies and builds the production UI bundle into `ui/build`.

- **Direct UI npm commands**:
  When running npm commands directly, execute them from the `ui/` directory
  (where `ui/package.json` resides):

  ```bash
  cd ui
  npm install
  npm start        # Start dev server on port 3000
  npm run build    # Build production bundle
  npm test         # Run test suite
  ```

  Alternatively, from the repository root:

  ```bash
  npm --prefix ui install
  npm --prefix ui start        # Start dev server on port 3000
  npm --prefix ui run build    # Build production bundle
  npm --prefix ui test         # Run test suite
  ```

- **Debug UI inside Docker Desktop**:

  ```bash
  make extension-link
  ```

  Configures Docker Desktop to load the extension UI live from
  `http://localhost:3000` while debugging.

## UI / Sistent Guidance

Guidance in this section applies **strictly to the `ui/` directory**. Backend
Go code (`vm/`), Docker configurations, and root scripts are out of scope for
Sistent.

- **Component Reuse:** Prefer existing `@sistent/sistent` UI primitives before creating custom components.
- **Design Tokens:** Prefer existing Sistent theme/token values over hardcoded brand colors.
- **Design Guidance Reference:** Consult the canonical Sistent design contract at [layer5io/sistent DESIGN.md](https://github.com/layer5io/sistent/blob/v0.15.12/DESIGN.md). Do not create or maintain a separate `DESIGN.md` in this repository.
- **Version Compatibility:** The `ui/` directory pins `@sistent/sistent@0.15.12`. Because the upstream `DESIGN.md` reflects modern Sistent releases (v0.21.2+), always verify tokens, components, and exported APIs against the locally installed `0.15.12` package before adopting newer patterns.

## Contribution Guidelines

- **Developer Certificate of Origin (DCO)**:
  All commits must be signed off to signify agreement with the DCO. Use the
  `-s` / `--signoff` flag:

  ```bash
  git commit -s -m "feat: add feature description"
  ```

- **Commit Messages**:
  Follow Conventional Commits format (`feat:`, `fix:`, `docs:`, `chore:`).
- **Contributing Guide**:
  For detailed guidelines on branching and pull requests, refer to
  [CONTRIBUTING.md](./CONTRIBUTING.md) and
  [CONTRIBUTING-gitflow.md](./CONTRIBUTING-gitflow.md).

[repo-url]: https://github.com/layer5io/kanvas-docker-extension
