FROM node:18-alpine3.14
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN npm install -g npm@8.9.0
COPY . /usr/src/app
EXPOSE 5000
CMD ["npm","start"]