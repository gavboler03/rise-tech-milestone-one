FROM public.ecr.aws/lambda/nodejs:22

WORKDIR ${LAMBDA_TASK_ROOT}

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx playwright install chromium

RUN npx tsc

CMD ["dist/lambda.handler"]