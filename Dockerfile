FROM alekzonder/puppeteer:latest


RUN && mkdir /home/ibox \
    && cd /home/ibox/ \ 
    && apt-get update \
    && apt-get install git -y \
    && git clone https://github.com/sing1ee/puppeteer-scripts.git \
    && cd puppeteer-scripts \
    && npm i
ENTRYPOINT ["node", "index.js"]