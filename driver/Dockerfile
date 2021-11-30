FROM node

WORKDIR /app/driver

COPY package.json .

RUN npm install

COPY . .



EXPOSE 4003

CMD ["yarn","start"]