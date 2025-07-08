# Contributing to Dyan

Thanks for your interest in contributing to **Dyan**, a self-hosted API builder! 🚀

This is the main monorepo that powers the core Dyan backend, frontend, sandbox execution, authentication, and codegen system.

---

## 🧰 Tech Stack

- **Backend**: NestJS (TypeScript)
- **Frontend**: React + Tailwind CSS
- **Database**: Prisma + SQLite (can support others)
- **Sandbox**: vm2 for isolated JavaScript logic
- **Codegen**: Generates Rust Axum code (WIP)

---

## 🧑‍💻 Getting Started

```bash
git clone https://github.com/dyan-dev/dyan.git
cd dyan
pnpm install
pnpm dev
````

This starts both frontend (`localhost:5173`) and backend (`localhost:3000`) in dev mode.

---

## 🧩 Development Guidelines

* Use `pnpm` with workspace support.
* Backend code is in `apps/backend`
* Frontend code is in `apps/frontend`
* All shared types or utils go in `packages/`

---

## 💡 How You Can Contribute

* Add support for `PUT`, `DELETE`, `PATCH`, etc.
* Improve endpoint testing experience
* Polish UI/UX for the API builder
* Add inline documentation for internal runtime
* Expand code generation support (e.g., Python, Express, etc.)

---

## 📬 Issues & Discussions

* Check open [issues](https://github.com/dyan-dev/dyan/issues)
* Propose features via [discussions](https://github.com/dyan-dev/dyan/discussions)

Please open an issue before starting work on large features.

---

## 🙏 Thanks!

Your contributions help make Dyan better for everyone 💙