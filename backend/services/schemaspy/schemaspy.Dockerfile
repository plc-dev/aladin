FROM node:12.19-buster

# install npm dependencies
# RUN npm i -g ts-node typescript rabbitmq-rpc-wrapper amqplib @types/amqplib
# RUN npm i ts-node typescript rabbitmq-rpc-wrapper amqplib @types/amqplib
# COPY package.json package.json 
# COPY tsconfig.json tsconfig.json
# RUN npm i

RUN apt-get update 
RUN apt-get install -y wget
RUN apt-get install -y vim
RUN apt-get install -y openjdk-11-jre
RUN apt-get install -y postgresql postgresql-contrib

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD tail -f /dev/null