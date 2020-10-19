FROM node:12.18.4-buster

RUN mkdir /cache
WORKDIR /cache

COPY package*.json ./

# RUN npm update
RUN npm install
# has to be explicitly installed for whatever reason ¯\_(ツ)_/¯
RUN npm i sqlite
# RUN npm audit fix

WORKDIR /
RUN mkdir /server
RUN mv /cache/node_modules /server
WORKDIR /server

#RUN ls 
#RUN chmod 777 entrypoint.sh
