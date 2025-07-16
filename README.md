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

## 🚀 Getting Started

### 1. **Clone the repo**

```bash
git clone https://github.com/dyan-dev/dyan.git
cd dyan
````

### 2. **Install dependencies**

Make sure you have [pnpm](https://pnpm.io/) installed.

```bash
pnpm install
```

### 3. **Set up your environment**

Copy and edit the environment files:

```bash
cp .env.example apps/backend/.env
```

To skip email sending in development, you can enable mock mode:

```env
EMAIL_MOCK=true
```

### 4. **Run backend and frontend**

In the root folder, run:

```bash
# Start the frontend (localhost:5173)
pnpm --filter frontend dev

# Start the backend (localhost:3000)
pnpm --filter backend exec prisma generate
pnpm --filter backend exec prisma migrate deploy
pnpm --filter backend dev
```

That's it! 🚀 Now visit [http://localhost:5173](http://localhost:5173) to start building your APIs.

---

## 📦 Architecture

* **Frontend**: React + Tailwind CSS
* **Backend**: NestJS (TypeScript)
* **Sandbox Runtime**: Secure execution via [`vm2`](https://github.com/patriksimek/vm2)
* **Database**: Local SQLite (PostgreSQL/MySQL support planned)

---

## 💡 Example Use Cases

* Build and test REST APIs visually — no backend required
* Quickly prototype business logic for internal tools
* Share and collaborate on API logic
* Host a lightweight backend API layer in seconds

---

## 🧪 Project Status

This is an early-stage project in active development.

* ✅ Supports: GET, POST, PUT, DELETE
* ✨ JavaScript logic + runtime
* 🧪 Input/output testing panel
* ⏳ Python support coming soon
* 💬 Community contributions welcome!

---

## 🤝 Contributing

We welcome issues, feature ideas, and PRs from the community.

Start with [`good first issue`](https://github.com/dyan-dev/dyan/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) tags or join our [Discord](https://discord.gg/ZQ4pKRA7) to chat and collaborate.

---

## 📄 License

MIT © [Dyan Dev](https://github.com/dyan-dev)
