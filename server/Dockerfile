# FROM node:22

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# EXPOSE 8080

# CMD ["node", "index.js"]

FROM node:22

RUN apt-get update && \
    apt-get install -y python3 python3-pip ffmpeg

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN pip3 install --break-system-packages yt-dlp

EXPOSE 8080

CMD ["node", "index.js"]