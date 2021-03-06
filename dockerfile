# SERVER BUILD
FROM node as server-build
WORKDIR /app

# install Dev dependencies needed for build, e.g., Babel
# if package.json doesn't change, this will be pulled from cache
COPY ./server/package.json .
RUN npm install --dev --silent

COPY ./server ./
RUN npm run build

# CLIENT BUILD
FROM node as client-build
WORKDIR /app

# if package.json doesn't change, this will be pulled from cache
COPY ./client/package.json .
RUN npm install --silent

COPY ./client ./
RUN npm run build

# COMBINED BUILD
FROM node 
WORKDIR /home/node/app

# install prod dependencies only to reduce image size
COPY ./server/package.json .
RUN npm install --prod --silent

COPY --from=server-build /app/build .

# copy React app to public, corresponding to Express static config
RUN mkdir ./public
COPY --from=client-build /app/build ./public/

# production environment
COPY .env .
ENV PATH /home/node/app/node_modules/.bin:$PATH
ENV NODE_ENV=production
ENV PORT=80
EXPOSE 80

# don't run as root
# RUN chown -R node:node ./build
# USER node

ENTRYPOINT ["node","./index.js"]
