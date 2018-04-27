# client build
FROM node as client-build
WORKDIR /app
COPY ./client ./
RUN npm install --silent
RUN npm run build

# server build
FROM node
WORKDIR /app
COPY . ./
RUN npm install --silent
RUN npm run build
RUN mkdir ./build/client
COPY --from=client-build /app/build ./build/client/

# production environment
ENV PATH /app/node_modules/.bin:$PATH
ENV NODE_ENV=production
ENV PORT=80
EXPOSE 80
ENTRYPOINT ["node","./build/server.js"]
