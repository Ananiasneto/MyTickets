FROM node:17

WORKDIR /usr/src

COPY . .

RUN npm install

RUN npm run build

CMD ["npm", "start"]