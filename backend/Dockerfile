FROM node:18

COPY backend /app

WORKDIR /app

RUN npm install

# RUN sleep(5)
# RUN npm run build
# RUN npx prisma generate
# RUN npx prisma db push
RUN chmod 777 prisma_script.sh

# CMD [ "npm", "run", "start:dev" ]

# CMD [ "./prisma_script.sh" ]
ENTRYPOINT [ "./prisma_script.sh" ]