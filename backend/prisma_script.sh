#!/bin/bash
npx prisma generate
npx prisma db push
node /app/dist/main.js
npx prisma studio
