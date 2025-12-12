# AWS Aurora PostgreSQL Movies Demo

This demo uses AWS Aurora PostgreSQL with Next.js to fetch movies from the database. It is able to securely connect to Aurora PostgreSQL without using hardcoded access tokens through Vercel's [OIDC Federation](https://vercel.com/docs/security/secure-backend-access/oidc) and RDS IAM authentication.

[![This is an alt text.](/public/Vercel-AWS-GitHub-apg.png)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Faws-aurora-postgresql-demo&project-name=aws-aurora-postgresql-demo&repository-name=aws-aurora-postgresql-demo&products=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22aws%22%2C%22productSlug%22%3A%22aws-apg%22%2C%22protocol%22%3A%22storage%22%7D%5D)

**Demo:**
[View Demo](https://aws-aurora-postgresql-demo.labs.vercel.dev)

**Getting Started:**
Click the "Deploy" button to clone this repo, create a new Vercel project, setup the AWS integration, and provision a new Aurora PostgreSQL database:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Faws-aurora-postgresql-demo&project-name=aws-aurora-postgresql-demo&repository-name=aws-aurora-postgresql-demo&products=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22aws%22%2C%22productSlug%22%3A%22aws-apg%22%2C%22protocol%22%3A%22storage%22%7D%5D)

Once the process is complete, you can clone the newly created GitHub repository and start making changes locally.

## Requirements

- Installed Aurora PostgreSQL. You can do that via [Vercel Marketplace](https://vercel.com/marketplace/aws)

## Local Setup

1. Pull vercel environment variables locally

```bash
vercel env pull
```

2. Install dependencies:

```bash
pnpm install
```

3. Run migrations to create tables:

```bash
pnpm run db:migrate
```

4. Seed the database with movie data:

```bash
pnpm run db:seed
```

5. Start the development server:

```bash
pnpm run dev
```

6. View development server:
   <http://localhost:3000>

## Load Testing

### Requirements

1. Get access to the Vercel Labs team, ask for request via Lumos if needed
2. Install all dependencies with `pnpm install`
3. Run K6 locally with `brew install k6`
4. Run `vercel link` and connect to project `aws-aurora-postgresql-demo`
5. Fetch environment variables with `vercel env pull`

### Next

1. Start the development server with

```bash
pnpm run dev
```

2. Once the development server is up

```bash
pnpm load-test
```
