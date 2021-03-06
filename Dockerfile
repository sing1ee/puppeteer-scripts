FROM alekzonder/puppeteer:latest


RUN cd /app \ 
    && apt-get update \
    && apt-get install git -y \
    && git clone https://github.com/sing1ee/puppeteer-scripts.git \
    && cd puppeteer-scripts \
    && npm i
ENTRYPOINT ["node", "index.js"]