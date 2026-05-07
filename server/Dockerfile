FROM node:22

RUN apt-get update && \
    apt-get install -y python3 python3-pip ffmpeg

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN pip3 install yt-dlp

EXPOSE 5000

CMD ["node", "index.js"]