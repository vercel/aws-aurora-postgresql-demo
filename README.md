
# AWS Aurora PostgreSQL Movies Demo

This demo uses AWS Aurora PostgreSQL with Next.js to fetch movies from the database. It is able to securely connect to Aurora PostgreSQL without using hardcoded access tokens through Vercel's [OIDC Federation](https://vercel.com/docs/security/secure-backend-access/oidc) and RDS IAM authentication.

[![This is an alt text.](/public/Vercel-AWS-GitHub-apg.png)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Funcurated-tests%2Faws-aurora-postgresql-demo)

**Demo:** TK

**Getting Started:** 
* Click the "Deploy" button to clone this repo, create a new Vercel project, setup the AWS integration, and provision a new Aurora PostgreSQL database:
* [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Funcurated-tests%2Faws-aurora-postgresql-demo)

* Once the process is complete, you can clone the newly created GitHub repository and start making changes locally.

## Requirements

- Installed Aurora PostgreSQL. You can do that via [![Vercel Marketplace](https://vercel.com/marketplace/aws)]  


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
