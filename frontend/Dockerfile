FROM node:18

COPY frontend/ /app

WORKDIR /app

RUN npm install 
# COPY . .
EXPOSE 3000
# RUN sleep(5)
# RUN npm run build
# RUN npx prisma generate
# RUN npx prisma db push
# RUN chmod 777 prisma_script.sh

# CMD [ "npm", "run", "start:dev" ]

CMD [ "npm", "start" ]
# ENTRYPOINT [ "./prisma_script.sh" ]