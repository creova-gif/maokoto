# Pesa Plan

**A personal finance and budgeting app — wallet, savings, investing, and an AI assistant to help track spending and reach goals.**

![Status](https://img.shields.io/badge/status-active_development-yellow)
![License](https://img.shields.io/badge/license-proprietary-red)
![Stack](https://img.shields.io/badge/stack-React_%2F_Vite%2C_mobile_companion-blue)

## What this is

Pesa Plan ("pesa" — Swahili for money) is a personal-finance app with wallet, budgeting, savings, and light investing views, an AI assistant for transaction tracking and financial guidance, goal-setting, transaction history, notifications, and an app-lock security feature. There's both a web dashboard and a separate mobile app directory.

[ADD SCREENSHOT HERE]

## Status: In active development

Core budgeting/wallet/savings screens exist across both a web and a mobile codebase, but the two aren't obviously unified yet (worth confirming whether the mobile app and web app share a data model), and there's no backend/persistence layer wired up.

### Roadmap
- Reconcile the web and mobile codebases into one data model
- Backend/persistence layer
- Security review of the app-lock feature before handling real financial data

## Quickstart

```bash
npm i
npm run dev
```

## Folder overview

- `src/app/components/dashboard/` — web dashboard (budget, transactions, AI assistant)
- `components/`, `lib/`, `mobile/` — mobile-side app and shared logic

## Contributing

See the [org-wide CONTRIBUTING.md](https://github.com/creova-gif/.github/blob/main/CONTRIBUTING.md) for guidelines, including our AI-assisted contribution policy.

## License

Proprietary — © CREOVA. All rights reserved.
