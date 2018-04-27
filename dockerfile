# client build
FROM node as client-builder
ENV CLIENT_APP=/client/app
ENV PATH $CLIENT_APP/node_modules/.bin:$PATH
WORKDIR $CLIENT_APP
COPY ./client ./
RUN npm install --silent
RUN npm run build

# production environment
FROM node
ENV APP=/app
WORKDIR $APP
COPY . ./
RUN npm install --silent
COPY --from=client-builder $CLIENT_APP/build /client/build
EXPOSE 80
CMD ["nodemon", "./server.js", "--exec babel-node"]