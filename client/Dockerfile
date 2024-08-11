FROM --platform=linux/amd64 node:20.14.0-alpine3.20 AS builder

WORKDIR /app

COPY ../package*.json .
COPY client/package*.json client/
COPY server/package*.json server/

RUN npm ci

COPY . .

WORKDIR /app/client

RUN npm run build

FROM nginx:1.27.0-alpine3.19 AS nginx

RUN rm /usr/share/nginx/html/* -rf

COPY --from=builder /app/client/dist /usr/share/nginx/html

ENV NGINX_ENVSUBST_OUTPUT_DIR '/etc/nginx/conf.d'

COPY client/nginx/default.conf.template /etc/nginx/templates/default.conf.template

RUN envsubst '$API_PROXY_PASS' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
