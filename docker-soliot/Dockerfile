# build with:
# docker build -t registry.gitlab.cc-asp.fraunhofer.de:4567/sbader/soliot .
#
# start with (Windows blocks 1883 for docker, so using 7883):
# docker run -p 8443:8443 -p 5683:5683 -p 7883:1883 registry.gitlab.cc-asp.fraunhofer.de:4567/sbader/soliot

FROM node:10-alpine

RUN apk add --no-cache openssl

ARG SOLID_SERVER_VERSION=latest
#RUN npm install -g solid-server@${SOLID_SERVER_VERSION}

# image configuration
ENV SOLID_HOME=/opt/solid
ENV PROCESS_USER=node
ENV TEMPORARY_CERT_NAME=solid-temporary

WORKDIR ${SOLID_HOME}
#COPY ./entrypoint.sh ./entrypoint.sh
#COPY ./checks.sh ./checks.sh
#COPY ./create-temporary-cert.sh ./create-temporary-cert.sh
RUN chown --recursive ${PROCESS_USER}:${PROCESS_USER} ${SOLID_HOME}

USER ${PROCESS_USER}

# solid configuration
ENV SOLID_ROOT=${SOLID_HOME}/data
ENV SOLID_SSL_KEY=${SOLID_HOME}/${TEMPORARY_CERT_NAME}.key
ENV SOLID_SSL_CERT=${SOLID_HOME}/${TEMPORARY_CERT_NAME}.crt
ENV SOLID_PORT=8443
ENV SOLID_CORS_PROXY=/xss
#ENV DEBUG=solid:*
ENV DEBUG=soliot:*

#VOLUME $SOLID_HOME
COPY node-solid-server $SOLID_HOME

#ENTRYPOINT ["./entrypoint.sh"]
RUN npm install
RUN openssl req -x509 -nodes -subj '/CN=sebastianrbader/O=SOLIOT/C=DE'  -days 365 -newkey rsa:2048 -keyout solid-temporary.key -out solid-temporary.crt

# HTTPS
EXPOSE 8443

# CoAP
EXPOSE 5683 

# MQTT
EXPOSE 1883

CMD ["node", "bin/solid", "start", "--no-reject-unauthorized"]
