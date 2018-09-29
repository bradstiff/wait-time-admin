# client build
FROM node as client-build
WORKDIR /app

# if package.json doesn't change, this will be pulled from cache
COPY ./client/package.json .
RUN npm install --silent

COPY ./client ./
RUN npm run build

# server build 
FROM node
WORKDIR /home/node/app

# if package.json doesn't change, this will be pulled from cache
COPY package.json .
RUN npm install --silent

COPY . ./
RUN npm run build

RUN mkdir ./build/client
COPY --from=client-build /app/build ./build/client/

# production environment
ENV PATH /home/node/app/node_modules/.bin:$PATH
ENV NODE_ENV=production
ENV PORT=80
EXPOSE 80

# don't run as root
# RUN chown -R node:node ./build
# USER node

ENTRYPOINT ["node","./build/server.js"]
