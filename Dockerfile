FROM node:15
WORKDIR /server
COPY package.json .
RUN yarn 
COPY . ./
EXPOSE 4000
CMD ["yarn", "dev"]