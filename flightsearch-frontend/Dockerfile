# frontend/Dockerfile
FROM node:alpine3.19
WORKDIR /flightsearch-frontend
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]