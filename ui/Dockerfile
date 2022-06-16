FROM node:16-alpine

ENV PORT 4173

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# Installing dependencies
COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install
COPY . .
RUN npm run build


EXPOSE 5000

CMD ["npm", "run", "preview"]
