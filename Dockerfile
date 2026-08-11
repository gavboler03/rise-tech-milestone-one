FROM mcr.microsoft.com/playwright:v1.61.1-noble

WORKDIR /app

RUN apt-get update && \
    apt-get install -y \
    cmake \
    g++ \
    make \
    xz-utils && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx tsc

ENTRYPOINT ["/app/node_modules/.bin/aws-lambda-ric"]

CMD ["dist/lambda.handler"]