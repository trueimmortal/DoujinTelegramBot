FROM frolvlad/alpine-glibc:alpine-3.11_glibc-2.31

RUN apk update && apk add curl

RUN curl -fsSL https://deno.land/x/install/install.sh | sh && mv /root/.deno/bin/deno /bin/deno 

WORKDIR /app
COPY src/ /app/

ENV API_KEY=$API_KEY
ENV TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN
ENV API_BASE_URL=$API_BASE_URL

ENTRYPOINT ["deno"]

CMD ["run", "--allow-all", "main.ts"]
