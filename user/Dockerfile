FROM node

WORKDIR /app/user

COPY package.json .

RUN npm install

RUN npm update @odd_common/common

COPY . .

EXPOSE 4001



CMD ["yarn","start"]