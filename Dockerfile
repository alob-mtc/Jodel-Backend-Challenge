
FROM node:8-alpine

RUN mkdir /app
WORKDIR /app

RUN apk add --no-cache git

COPY package.json yarn.lock ./
RUN yarn 

COPY . /app

CMD ["npm start"]
EXPOSE 3000