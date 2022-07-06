FROM node:alpine
WORKDIR /app
COPY . .
RUN yum install python
RUN npm ci
RUN npm audit fix
EXPOSE 3001
CMD [ "npm", "start" ]