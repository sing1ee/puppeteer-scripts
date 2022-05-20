FROM alekzonder/puppeteer:latest


RUN mkdir -p /home/puppeteer/ \
    && apt-get update \
    && apt-get install curl -y

ENTRYPOINT ["astar-collator", "--chain", "astar", "--parachain-id", "2006", "--base-path", "/home/astar/data", "--prometheus-port", "30334", "--port", "30333", "--ws-port", "9933", "--rpc-port", "9012", "--rpc-cors", "all", "--execution", "wasm", "--state-cache-size", "0"]