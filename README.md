[![](apps/web/app/opengraph-image.png)](https://www.getinboxzero.com)

<p align="center">
  <a href="https://www.getinboxzero.com">
    <h1 align="center">EmailChef - AI Email Assistant</h1>
  </a>
  <p align="center">
    Open source email automation and subscription tracking via emails.
    <br />
    <a href="#">Website</a>
    ·
    <a href="#">Discord</a>
    ·
    <a href="#">Issues</a>
  </p>
</p>

## About

There are two parts to EmailChef:

1. An AI email assistant that helps you automate your email.
2. Open source email subscription tracker tool (builds a timeline of your paid subscriptions).

Deploy with a single click.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Felie222%2Finbox-zero&env=UNIPILE_API_TOKEN,UNIPILE_DSN,UNIPILE_NOTIFY_URL,UNIPILE_SUCCESS_REDIRECT_URL,CONVEX_DEPLOYMENT,NEXT_PUBLIC_CONVEX_URL)

## Features

- **AI Personal Assistant:** Manages your email for you based on a plain text prompts. It can take any action a human assistant can take on your behalf (Label, Reply).
- **Smart Categories:** Categorize your emails.
- **Cold Email Blocker:** Automatically block (trash) cold emails.
- **Email Analytics:** Track your email activity with daily, weekly, and monthly stats.

## Demo Video

[![Email Chef demo](/video-thumbnail.png)](#)

## Built with

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Convex chef](https://www.prisma.io/)
- [Convex](https://convex.dev/)
- [Convex Workflows](https://www.convex.dev/components/workflow)

### Contributing to the project

I am not accepting contributions at this moment.

[ARCHITECTURE.md](./ARCHITECTURE.md) explains the architecture of the project (LLM generated).

### Requirements

- [Node.js](https://nodejs.org/en/) >= 18.0.0
- [pnpm](https://pnpm.io/) >= 8.6.12

### Setup

The external services that are required are:

- [Unipile](https://unipile.com)

You also need to set an LLM, but you can use a local one too:

- [OpenAI](https://platform.openai.com/api-keys)
- Google Gemini
- Ollama (local)

We use Convex for the database.

### Environment variables

Set the environment variables in the newly created `.env`. You can see a list of required variables in: `apps/web/env.ts`.

The required environment variables:

- `UNIPILE_API_TOKEN` -- can be copied from the Unipile dashboard.
- `UNIPILE_DSN` -- Can be copied from the Unipile dashboard and it is in the form of `apixxx.xxxx.xxx` [here]()
- `UNIPILE_NOTIFY_URL` -- Unipile hosted auth webhook. More info [here]()
- `UNIPILE_SUCCESS_REDIRECT_URL` -- Unipile hosted auth on success redirect callback.
- `NEXT_PUBLIC_CONVEX_URL` -- Can be copied from the Convex dashboard
- `CONVEX_DEPLOYMENT`
- `CONVEX_DEPLOY_KEY`

To sync your functions to convex:

```bash
pnpm convex dev
```

To run the app locally for development:

```bash
pnpm run dev
```

### Overview of Architecture
