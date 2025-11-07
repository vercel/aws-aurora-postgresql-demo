[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Faws-dsql-movies-demo)

# AWS Aurora PostgreSQL Movies Demo

This demo uses AWS Aurora PostgreSQL with Next.js to fetch movies from the database. It is able to securely connect to Aurora PostgreSQL without using hardcoded access tokens through Vercel's [OIDC Federation](https://vercel.com/docs/security/secure-backend-access/oidc) and RDS IAM authentication.

**Demo:** TK

## Requirements

- Aurora PostgreSQL cluster with IAM authentication enabled
- Database user with `rds-db-connect` permission
- AWS IAM role configured for RDS access

## Setup

1. Create `.env.local` file with required environment variables:
```
AWS_ROLE_ARN=arn:aws:iam::YOUR_ACCOUNT:role/YOUR_ROLE
DB_CLUSTER_ENDPOINT=your-cluster.cluster-xxxxx.region.rds.amazonaws.com
DB_USERNAME=postgres
DB_NAME=postgres
DB_PASSWORD=your-password
AWS_REGION=us-east-1
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
