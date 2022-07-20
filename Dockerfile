FROM node
WORKDIR '/app'
COPY package.json .
RUN npm install 
COPY . .
ENV PORT=8100
EXPOSE 8100
CMD ["npm","start"]