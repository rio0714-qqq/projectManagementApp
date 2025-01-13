FROM node:16.17.0

RUN mkdir /app

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 3000

# CMD ["yarn", "dev"]
CMD bash -c "npm install && npm run dev"
