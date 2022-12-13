### STAGE 1:BUILD ###
# Defining a node image to be used as giving it an alias of "build"
# Which version of Node image to use depends on project dependencies 
# This is needed to build and compile our code 
# while generating the docker image

FROM tiangolo/node-frontend:10 as build-1
WORKDIR /app
COPY ./src /app/src/
COPY *.* /app/

### STAGE 2:RUN ###
RUN npm install && npm run build --prod


# Defining nginx image to be used
FROM nginx

# Copying compiled code and nginx config to different folder
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/f-sigebi /usr/share/nginx/html

# Expose port 80
EXPOSE 80

#ENV FILES
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]

