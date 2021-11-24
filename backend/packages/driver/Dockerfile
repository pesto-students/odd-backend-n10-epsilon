FROM node

WORKDIR /app/backend/packages/driver

COPY package.json .

RUN yarn

COPY . .

EXPOSE 4003

CMD ["yarn","start"]