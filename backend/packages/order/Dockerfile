FROM node

WORKDIR /app/backend/packages/order

COPY package.json .

RUN yarn

COPY . .

EXPOSE 4004

CMD ["yarn","start"]