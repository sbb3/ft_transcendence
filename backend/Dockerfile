# FROM node:18 AS build-stage

# WORKDIR /app

# COPY package*.json .

# RUN npm i

# COPY . .

# ENV NODE_OPTIONS=--max_old_space_size=4096

# RUN npm run build

# COPY prisma ./dist/prisma/

# COPY package.json ./dist

# COPY prisma_script.sh ./dist

# COPY .env ./dist

# FROM node:18 AS production-stage

# WORKDIR /app

# COPY --from=build-stage /app/dist .

# COPY  --from=build-stage /app/node_modules/ /app/node_modules

# # EXPOSE 3000

# RUN chmod 777 prisma_script.sh

# # CMD ["tail", "-f"]
# CMD [ "bash", "/app/prisma_script.sh" ]


# Base image
FROM node:18

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

RUN chmod 777 ./prisma_script.sh
# Start the server using the production build
# CMD ["tail", "-f"]

CMD [ "bash", "/app/prisma_script.sh" ]
