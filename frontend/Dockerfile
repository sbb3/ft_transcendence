FROM node:20



WORKDIR /app

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ .

# RUN npm install -g create-vite
# RUN npm install -g vite
EXPOSE 5173

# COPY . .
# RUN sleep(5)
# RUN npm run build
# RUN npx prisma generate
# RUN npx prisma db push
# RUN chmod 777 prisma_script.sh

CMD [ "npm", "run", "start" ]

# CMD [ "npm", "start" ]
# ENTRYPOINT [ "./prisma_script.sh" ]




# FROM node:14

# # COPY frontend/ /app

# WORKDIR /app

# COPY frontend/package*.json ./

# RUN npm install

# COPY frontend .

# # COPY . .
# EXPOSE 3000
# # RUN sleep(5)
# # RUN npm run build
# # RUN npx prisma generate
# # RUN npx prisma db push
# # RUN chmod 777 prisma_script.sh

# CMD [ "npm", "run", "watch" ]

# # CMD [ "npm", "start" ]
# # ENTRYPOINT [ "./prisma_script.sh" ]
