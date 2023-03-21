FROM registry.ci.openshift.org/stolostron/builder:nodejs14-linux AS build

ADD . /usr/src/app
WORKDIR /usr/src/app
RUN yarn install && yarn build

FROM docker.io/library/nginx:stable

RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
USER 1001
