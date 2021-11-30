FROM node

WORKDIR /app/order

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4004

CMD ["yarn","start"]