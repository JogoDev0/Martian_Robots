FROM node:12.18.2-alpine

EXPOSE 3000

RUN apk add --no-cache tini

WORKDIR /app

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . .

ENTRYPOINT ["tini", "--"]

CMD ["node", "./bin/www"]