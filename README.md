# MeisterUp

**MeisterUp** is a professional, AI-native adaptive learning platform designed for software engineers. It provides an interactive code comprehension experience featuring an intuitive swiping-deck UI, specifically built to help developers master new programming languages, explore system design, and elevate their overall technical skills.

## 🌟 Core Features

- **Personalized Curriculum:** Models your existing knowledge to identify exact skill gaps and tailors a learning path specifically for you.
- **Interactive Swiping UI:** Learn efficiently with a fast, engaging interface for code reviews and comprehension exercises.
- **Extensive Topic Support:** Master everything from advanced Rust and Go to System Design and Prompt Engineering.
- **Real-time Analytics:** Track your learning progress and streaks with beautiful, data-driven visualizations.

## 🚀 Tech Stack

MeisterUp is built with a modern, high-performance web stack for a seamless developer and user experience:

- **Framework & Routing:** [React 19](https://react.dev/), [TanStack Start](https://tanstack.com/start) (SSR-enabled), and [TanStack Router](https://tanstack.com/router)
- **Language & Runtime:** TypeScript 5, [Bun](https://bun.sh/)
- **Styling & UI:** Tailwind CSS v4, [Radix UI](https://www.radix-ui.com/), and shadcn/ui (Premium Dark Mode native)
- **Animations:** [Framer Motion](https://www.framer-motion.com/) for fluid swipe and drag gestures
- **Data & State Management:** [TanStack Query](https://tanstack.com/query) for asynchronous server state
- **Backend & Auth:** Serverless PostgreSQL via [Neon](https://neon.tech/), BetterAuth, and the Nitro Server Engine
- **Tooling:** [Vite 8](https://vite.dev/)

## 🛠️ Getting Started

Follow these instructions to get a local development environment up and running.

### Prerequisites

Make sure you have [Bun](https://bun.sh/) installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/meisterup-frontend.git
   cd meisterup-frontend
   ```

2. Install the project dependencies:

   ```bash
   bun install
   ```

3. Set up your environment variables. Create a `.env.local` file in the root directory and add your required secrets (e.g., your Neon Database connection string and BetterAuth secret).

### Running the Development Server

Start the application locally:

```bash
bun run dev
```

The application will be available at `http://localhost:3000`. Routing is fully type-safe and file-based; TanStack Router will automatically manage the route tree as you develop.

### Building for Production

To create a production-ready build:

```bash
bun run build
```

To preview the built production app locally:

```bash
bun run preview
```

## 🤝 Contributing

Contributions, issues, and feature requests are always welcome! Feel free to check the [issues page](https://github.com/your-username/meisterup-frontend/issues) if you want to contribute.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
