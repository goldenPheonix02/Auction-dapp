# using node alpine as base image
FROM node:18.16.0-alpine
# 
# RUN echo "Asia/Kolkata" > /etc/timezone
# RUN  dpkg-reconfigure -f noninteractive tzdata
# working dir ./app
WORKDIR /app

COPY ./package.json .
# Install the prerequisites to install the web3 and other ethereum npm packages
# RUN apk add --update py-pip krb5 krb5-libs gcc make g++ krb5-dev

# RUN git config --global url."https://".insteadOf git://

RUN apk update && apk upgrade && apk add bash git openssh && npm install
# Copy the package.json

# Install the dependencies

# Copy the server and ethereum module
COPY . .

# set the default command
CMD ["npm","start"]