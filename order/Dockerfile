FROM node

WORKDIR /app/order

COPY package.json .

RUN npm install

RUN npm update @odd_common/common

COPY . .

EXPOSE 4004

CMD ["yarn","start"]