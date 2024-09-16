## NextJS

### Prerequisites

Node version 20.x

### Cloning the repository

    git clone https://github.com/anilsoylu/slack-clone.git

### Install packages

    npm i

### Setup .env file

    DATABASE_URL=


    Note: This project is open source. Users should set the AUTH_SECRET value using `pnpm dlx auth secret`, `bunx auth secret`, or `npx auth secret` commands.
    AUTH_SECRET=
    GITHUB_CLIENT_ID=
    GITHUB_CLIENT_SECRET=
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=

### Setup Prisma

    npx prisma generate
    npx prisma db push

### Start the app

    npm run dev

### Available commands

Running commands with npm `npm run [command]`

| command | description                              |
| ------- | ---------------------------------------- |
| `dev`   | Starts a development instance of the app |
|         |
