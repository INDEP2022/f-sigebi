### STAGE 1:BUILD ###
# Defining a node image to be used as giving it an alias of "build"
# Which version of Node image to use depends on project dependencies 
# This is needed to build and compile our code 
# while generating the docker image

FROM node:14.16.0-alpine3.12

WORKDIR /src

COPY package*.json ./

# Update Alpine & Install Libs
RUN apk add --no-cache --virtual .build-deps git bzip2 && \
  npm install -g @angular/cli@latest && \
  npm install --silent && \
  npm cache clean --force && \
  npm rebuild node-sass

# Copy app source code
COPY . .
RUN npm install
RUN npm run build --prod


### STAGE 2:RUN ###
# Defining nginx image to be used
FROM nginx

# Copying compiled code and nginx config to different folder
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/f-sigebi /usr/share/nginx/html

# Expose port 80
EXPOSE 80