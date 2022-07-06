FROM node:16-alpine
WORKDIR /app
COPY . .
RUN npm ci
RUN npm audit fix
EXPOSE 3001
CMD [ "npm", "start" ]