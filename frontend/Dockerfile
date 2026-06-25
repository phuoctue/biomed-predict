FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.cjs ./
COPY postcss.config.cjs ./
COPY eslint.config.js ./
COPY .prettierrc ./
COPY .prettierignore ./
RUN npm install

COPY src ./src
COPY index.html ./

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

