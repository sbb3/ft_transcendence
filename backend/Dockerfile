FROM node:18

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN chmod 777 prisma_script.sh

CMD [ "bash", "/app/prisma_script.sh" ]
