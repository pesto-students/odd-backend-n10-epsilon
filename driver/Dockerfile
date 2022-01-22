FROM node

WORKDIR /app/driver

COPY package.json .



RUN npm install

RUN npm update @odd_common/common

COPY . .



EXPOSE 4003

CMD ["yarn","start"]