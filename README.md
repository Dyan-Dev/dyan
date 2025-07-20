<p align="center">
  <img src="https://dyan.live/banner.png" alt="Dyan Logo" width="100"/>
</p>

<h1 align="center">Dyan</h1>

<p align="center">
  <b>Visually build, test, and deploy REST APIs without backend boilerplate</b><br />
  <a href="https://dyan.live">🌐 dyan.live</a>
</p>

<p align="center">
  <a href="https://github.com/dyan-dev/dyan/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" /></a>
  <img src="https://img.shields.io/badge/version-0.1.0-yellow.svg" />
  <a href="https://discord.gg/ZQ4pKRA7"><img src="https://img.shields.io/discord/1393842142740349069?label=Discord&logo=discord&style=flat" /></a>
</p>

---

## 🔥 Key Features

- 🧱 Visual REST API builder
- ⚙️ Supports GET, POST, PUT, DELETE
- ✍️ Write endpoint logic in JavaScript (Python support coming soon)
- ⚡ Instant test mode with live input/output
- 🧪 Validate logic before execution
- 💻 Self-hosted & open-source

---

## 🎥 Demo Video

[![Watch the demo](https://img.youtube.com/vi/SBEPacMgpvk/maxresdefault.jpg)](https://www.youtube.com/watch?v=SBEPacMgpvk)

> Watch how Dyan lets you build, test, and run APIs in seconds with no backend boilerplate.

---

## 📦 Architecture

- **Frontend**: React + Tailwind CSS
- **Backend**: NestJS (TypeScript)
- **Sandbox Runtime**: Secure execution via [`vm2`](https://github.com/patriksimek/vm2)
- **Database**: Local SQLite (PostgreSQL/MySQL support planned)

---

# 🚀 Getting Started 



## 🐳 Docker & Production Deployment

Dyan ships with a production-ready Docker Compose setup that runs the backend, frontend, and SQLite database with a single command.

### 1. Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/) installed

### 2. Environment Variables

Create a `.env` file in the project root (same directory as `docker-compose.yml`) with the following content:

```env
# .env
JWT_SECRET=your_super_secret_jwt_key
VITE_API_URL=http://backend:3000
```

- `JWT_SECRET` is required for backend authentication.
- `VITE_API_URL` should point to the backend service as seen by the frontend container (use `http://backend:3000` for Docker Compose).

You can also refer to `apps/backend/example.env` and `apps/frontend/example.env` for more details.

### 3. Build & Run

From the project root, run:

```bash
docker compose up --build
```

- The backend will be available at [http://localhost:3000](http://localhost:3000)
- The frontend will be available at [http://localhost:5173](http://localhost:5173)

### 4. Data Persistence

- The SQLite database is persisted in a Docker volume (`sqlite-data`), so your data survives container restarts.

### 5. Customization

- To change ports or add environment variables, edit `docker-compose.yml`.
- For production, consider setting up HTTPS and using a production-grade database.

### 6. Stopping & Cleaning Up

To stop the services:

```bash
docker compose down
```

To remove all data (including the SQLite database):

```bash
docker compose down -v
```



## 💡 Example Use Cases

- Build and test REST APIs visually — no backend required
- Quickly prototype business logic for internal tools
- Share and collaborate on API logic
- Host a lightweight backend API layer in seconds

---

## 🧪 Project Status

This is an early-stage project in active development.

- ✅ Supports: GET, POST, PUT, DELETE
- ✨ JavaScript logic + runtime
- 🧪 Input/output testing panel
- ⏳ Python support coming soon
- 💬 Community contributions welcome!

---

## 🤝 Contributing

We welcome issues, feature ideas, and PRs from the community.

Start with [`good first issue`](https://github.com/dyan-dev/dyan/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) tags or join our [Discord](https://discord.gg/ZQ4pKRA7) to chat and collaborate.

---

## 📄 License

MIT © [Dyan Dev](https://github.com/dyan-dev)
