FROM node:18 AS build-stage

WORKDIR /app

COPY package*.json .

RUN npm i

COPY . .

ENV NODE_OPTIONS=--max_old_space_size=4096

RUN npm run build

FROM node:18 AS production-stage

WORKDIR /app

COPY --from=build-stage /app/dist .

EXPOSE 3000

RUN chmod 777 prisma_script.sh

CMD [ "bash", "/app/prisma_script.sh" ]