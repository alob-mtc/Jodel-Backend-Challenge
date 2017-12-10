
FROM node:8-alpine

RUN mkdir /app
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn 

ENTRYPOINT ["npm"]
CMD ["start"]
EXPOSE 3000