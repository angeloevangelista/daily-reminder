FROM node:16.13.1-alpine as builder

WORKDIR /app-build

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:16.13.1-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile

COPY --from=builder /app-build/dist/ /app

ENV PORT=3333
ENV DAILY_TIME=00:00
ENV DAILY_INVITE_LINK=
ENV GOOGLE_CHAT_WEBHOOK_LINK=

EXPOSE $PORT

CMD ["node", "/app/index.js"]

