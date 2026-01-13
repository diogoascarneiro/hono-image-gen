# Hono Image Gen

An experiment building an AI image generation app using [Hono](https://hono.dev/) and [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/).

This project demonstrates how to build a full-stack image generation application that runs entirely on Cloudflare's edge network, leveraging:
- **Hono** - A fast, lightweight web framework for building APIs
- **Cloudflare Workers AI** - Serverless AI inference at the edge
- **React + Vite** - Modern frontend with hot module replacement

## Features

- 🎨 AI-powered image generation using Cloudflare Workers AI
- ⚡ Edge-deployed backend for low latency worldwide
- 🎛️ Advanced options including negative prompts, dimensions, guidance, and seed control
- 🔥 Hot Module Replacement for rapid development
- 📦 TypeScript throughout

## Getting Started

To start a new project with this template, run:

```bash
npm create cloudflare@latest -- --template=cloudflare/templates/vite-react-template
```

A live deployment of this template is available at:
[https://react-vite-template.templates.workers.dev](https://react-vite-template.templates.workers.dev)

## Development

Install dependencies:

```bash
npm install
```

Start the development server with:

```bash
npm run dev
```

Your application will be available at [http://localhost:5173](http://localhost:5173).

## Production

Build your project for production:

```bash
npm run build
```

Preview your build locally:

```bash
npm run preview
```

Deploy your project to Cloudflare Workers:

```bash
npm run build && npm run deploy
```

Monitor your workers:

```bash
npx wrangler tail
```

## Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://reactjs.org/)
- [Hono Documentation](https://hono.dev/)
