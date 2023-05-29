FROM registry.access.redhat.com/ubi8/nodejs-18:latest AS build
USER root

RUN npm install -g corepack
RUN corepack enable yarn
ADD . /usr/src/app
WORKDIR /usr/src/app
RUN yarn install --frozen-lockfile && yarn build

FROM docker.io/library/nginx:stable

RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
USER 1001
