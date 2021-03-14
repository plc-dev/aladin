FROM node:12.19-buster

# install npm dependencies
RUN npm i -g ts-node typescript rabbitmq-rpc-wrapper amqplib @types/amqplib
RUN npm i ts-node typescript rabbitmq-rpc-wrapper amqplib @types/amqplib
COPY package.json package.json 
COPY tsconfig.json tsconfig.json
RUN npm i

RUN apt-get update && apt-get install -y wget
RUN apt-get install -y vim
RUN apt-get install -y openjdk-8-jre-headless
RUN apt install -y postgresql postgresql-contrib

WORKDIR /worker

RUN wget https://jdbc.postgresql.org/download/postgresql-42.2.18.jar
RUN wget https://github.com/schemaspy/schemaspy/releases/download/v6.1.0/schemaspy-6.1.0.jar

CMD tail -f /dev/null