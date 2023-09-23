#!/bin/bash

# sleep(20)
# RUN npm run build
npx prisma generate
npx prisma db push

npm run start:dev
