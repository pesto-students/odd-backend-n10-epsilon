FROM node

WORKDIR /app/admin

COPY package.json .

RUN npm install

RUN npm update @odd_common/common

COPY . .



EXPOSE 4002

CMD ["yarn","start"]