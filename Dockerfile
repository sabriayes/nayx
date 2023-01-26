# Building stage
FROM node:16-alpine AS BUILD
# ARG API_ROOT - Import process.env.API_ROOT
WORKDIR /usr/src/app
EXPOSE 80
COPY package*.json ./
RUN npm install --force --loglevel=error
COPY . .
RUN npm run build

# Serving stage
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/app/ usr/share/nginx/html
