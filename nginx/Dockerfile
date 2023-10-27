FROM  alpine:3.16

RUN apk add --no-cache nginx

COPY ./config/nginx.conf /etc/nginx/http.d/

WORKDIR /app

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

