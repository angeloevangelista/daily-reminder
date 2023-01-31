## How to

```bash
docker build ./ --tag daily-reminder:latest
```

```bash
PORT=3333

docker run -it \
  --name daily-reminder \
  -e PORT=$PORT \
  --env-file ./.env \
  -p $PORT:$PORT \
  -d daily-reminder:latest
```
