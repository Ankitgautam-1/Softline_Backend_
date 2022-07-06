FROM node:alpine
WORKDIR /app
COPY . .
RUN apk add python3 nodejs
RUN npm install node-gyp
RUN npm i
RUN npm audit fix
EXPOSE 3001
CMD [ "npm", "start" ]