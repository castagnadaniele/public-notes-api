FROM node:16-alpine as base
WORKDIR /app
COPY package*.json ./

FROM base as test
RUN npm ci
COPY /src ./src
COPY /spec ./spec
RUN npm test

FROM base as prod
RUN npm ci --production
COPY /src ./src
COPY /bin ./bin
CMD ["npm", "start"]
