FROM node:18-alpine3.14
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
COPY . /usr/src/app
EXPOSE 5000
CMD ["npm","start"]