FROM node

WORKDIR /app/backend

COPY package.json .

RUN npm install yarn 

RUN yarn install

COPY . .

