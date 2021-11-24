FROM node

WORKDIR /app/backend/packages/user

COPY package.json .

COPY . .

EXPOSE 4001

RUN yarn

CMD ["yarn","start"]