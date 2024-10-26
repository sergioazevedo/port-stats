FROM node:23-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .

ENV TZ="Europe/Copenhagen"
CMD [ "yarn", "start"]