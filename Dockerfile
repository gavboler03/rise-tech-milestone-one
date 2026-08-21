FROM public.ecr.aws/lambda/nodejs:22

COPY package.json ${LAMBDA_TASK_ROOT}/

RUN npm install --omit=dev

COPY helpers/handler.cjs ${LAMBDA_TASK_ROOT}/

CMD ["handler.handler"]