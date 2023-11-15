FROM node:18

WORKDIR /usr/app

COPY . .

RUN npm i

EXPOSE 5000

# CMD [ "npm", "i" ]

CMD [ "npm", "run", "start-local" ]
