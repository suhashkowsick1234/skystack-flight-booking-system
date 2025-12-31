FROM node:14.11.0-stretch

WORKDIR /var/app/current

COPY package.json .

RUN npm install

COPY . .

ENV NODE_ENV "test"

CMD ["npm","start"]

EXPOSE 8081