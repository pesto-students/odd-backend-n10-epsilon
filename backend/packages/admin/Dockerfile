FROM node

WORKDIR /app/backend/packages/admin

COPY package.json .

RUN yarn

COPY . .

EXPOSE 4002

CMD ["yarn","start"]