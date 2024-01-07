FROM node:15 AS ui-build
WORKDIR /usr/src/app
COPY client/ ./client/
# RUN cd client && npm --no-optional install && npm install -g quasar-cli && quasar build

FROM node:15 AS server-build
WORKDIR /root/
COPY --from=ui-build /usr/src/app/client/dist/spa ./client/dist/spa
COPY server/package*.json ./server/
RUN cd server && npm install
COPY server/app.js ./server/

EXPOSE 3000

CMD ["node", "./server/app.js"]