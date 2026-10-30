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
# Public EdgeX form key, supplied by compose from the server's .env file.
ARG EDGEX_API_KEY=
ENV EDGEX_API_KEY=$EDGEX_API_KEY
RUN npm run build

FROM nginx:alpine
# static.conf is an nginx template: the image's entrypoint fills in ${OTP_UPSTREAM} (compose overrides it per environment).
ENV OTP_UPSTREAM=http://otp:3000
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/static.conf /etc/nginx/templates/default.conf.template
COPY --from=builder /app/_site/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
