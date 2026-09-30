FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY src/ src/
COPY .eleventy.js tailwind.config.js postcss.config.js ./
# Production by default; the staging compose file passes ELEVENTY_ENV=development
# so staging emits Disallow-all robots.txt, noindex meta and staging canonicals.
ARG ELEVENTY_ENV=production
ENV ELEVENTY_ENV=$ELEVENTY_ENV
RUN npm run build

FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/static.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/_site/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
