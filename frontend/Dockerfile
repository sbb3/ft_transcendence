FROM node:lts AS build-stage

WORKDIR /app

COPY package*.json .

RUN npm i -g vite

RUN npm i

COPY . .

ENV NODE_OPTIONS=--max_old_space_size=4096

RUN npm run build

FROM node:lts AS production-stage

WORKDIR /app

RUN npm i -g serve

COPY --from=build-stage /app/dist .

EXPOSE 80

CMD ["serve", "-s", "-L", ".", "-p", "80"]
