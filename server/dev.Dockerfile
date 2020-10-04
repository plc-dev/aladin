FROM node:12.18.4-buster

RUN mkdir /cache
WORKDIR /cache

COPY package*.json ./

# RUN npm update
RUN npm install
# has to be explicitly installed for whatever reason ¯\_(ツ)_/¯
RUN npm i sqlite
# RUN npm audit fix

RUN mkdir /server
WORKDIR /server
