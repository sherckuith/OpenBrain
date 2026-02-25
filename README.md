# 🧠 OpenBrain

**Tu Cerebro Digital para OpenClaw.**

OpenBrain es una aplicación web local diseñada para gestionar conocimiento, tareas y conversaciones de forma centralizada y segura. Combina la flexibilidad de **Obsidian** (Markdown) con la gestión de tareas de **Linear**, integrándose profundamente con **OpenClaw** para capturar tus chats y uso de IA en tiempo real.

## 🚀 Características

*   **Dashboard Unificado:** Vista rápida de tareas pendientes, chats recientes y consumo de tokens.
*   **Gestión de Tareas (Linear Style):** Tablero Kanban con estados (Todo, In Progress, Done) y prioridades.
*   **Gestor de Documentos (Obsidian Style):** Renderizado de Markdown local con soporte para código (Syntax Highlighting).
*   **Integración OpenClaw:** Parser en tiempo real que lee logs de sesiones (`~/.openclaw/sessions/`) y pueble la base de datos automáticamente.
*   **Seguridad Primero:** Base de datos SQLite local (`dev.db`). Datos sensibles nunca salen de tu red.

## 🛠️ Stack Tecnológico

*   **Frontend:** Next.js 14 (App Router), Tailwind CSS, Framer Motion.
*   **Backend:** Next.js API Routes, Socket.io (Real-time).
*   **Base de Datos:** SQLite + Prisma ORM.
*   **Watcher:** Chokidar (File System Monitoring).

## 📦 Instalación y Uso

### Prerrequisitos
*   Node.js 18+
*   OpenClaw (opcional, para integración de chats)

### 1. Instalación
```bash
git clone https://github.com/sherckuith/OpenBrain.git
cd OpenBrain
npm install
```

### 2. Configuración
Crea un archivo `.env` (opcional) o ajusta `scripts/brain-daemon.ts` para apuntar a tus carpetas reales de OpenClaw.

### 3. Iniciar (Modo Desarrollo)
```bash
./start.sh
```
Esto iniciará:
1.  Servidor Next.js en `http://localhost:3000`
2.  Parser de Logs (Background)
3.  Watcher de Documentos (Background)

## 🔒 Privacidad y Datos

*   Los chats se leen localmente de `~/.openclaw/sessions/`.
*   La base de datos `dev.db` está excluida de git (`.gitignore`).
*   Ningún dato personal se sube a la nube.

## 🤝 Contribución

Este proyecto es Open Source. ¡Siéntete libre de abrir Issues o PRs!

---
Desarrollado con ❤️ por **OpenBrain** y **Angel Yaguana**.
