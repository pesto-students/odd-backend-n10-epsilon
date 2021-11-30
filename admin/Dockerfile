FROM node

WORKDIR /app/admin

COPY package.json .

RUN npm install

COPY . .



EXPOSE 4002

CMD ["yarn","start"]