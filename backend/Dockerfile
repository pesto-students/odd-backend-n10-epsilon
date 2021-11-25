FROM node

WORKDIR /app/backend

COPY package.json .

RUN npm install yarn 

RUN yarn 

RUN  lerna bootstrap
# COPY . .

