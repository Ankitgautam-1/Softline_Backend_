FROM node:lts
WORKDIR /app
COPY . .
RUN npm i
RUN npm audit fix
EXPOSE 3001
CMD [ "npm", "start" ]
