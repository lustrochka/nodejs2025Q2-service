FROM node:22-alpine
WORKDIR /usr/local/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start:prod"]