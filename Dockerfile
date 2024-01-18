# syntax=docker/dockerfile:1

FROM node:14

WORKDIR /app

COPY ./client ./client

COPY ./server ./server

COPY ./start.sh .

RUN cd ./client; npm install

RUN cd ./server; npm install

CMD ./start.sh 2

EXPOSE 3001
EXPOSE 5173