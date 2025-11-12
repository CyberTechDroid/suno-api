# syntax=docker/dockerfile:1 
                                                                                                                                                                                                    
FROM node:lts-bookworm AS builder                                                                                       
WORKDIR /src

# Install pnpm
RUN npm install -g pnpm@10.15.0

COPY package.json pnpm-lock.yaml ./                                                                                                   
RUN pnpm install                                                                                                         
COPY . .                                                                                                               
RUN pnpm run build                                                                                                       
                                                                                                                    
FROM node:lts-bookworm                                                                                                  
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.15.0

COPY package.json pnpm-lock.yaml ./                                                                                                   
                                                                                                                    
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y libnss3 \                                       
    libdbus-1-3 libatk1.0-0 libatk-bridge2.0-0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 \                       
    libgbm1 libxkbcommon0 libasound2 libcups2 xvfb                                                                      
                                                                                                                    
ARG SUNO_COOKIE             
RUN if [ -z "$SUNO_COOKIE" ]; then echo "Warning: SUNO_COOKIE is not set. You will have to set the cookies in the Cookie header of your requests."; fi                                           
ENV SUNO_COOKIE=${SUNO_COOKIE}
# Disable GPU acceleration, as with it suno-api won't work in a Docker environment
ENV BROWSER_DISABLE_GPU=true
ENV BROWSER_HEADLESS=true

RUN pnpm install --prod --frozen-lockfile
                                                                                                                    
# The app uses @playwright/browser-chromium which includes the browser
# No separate installation needed - browser is bundled with the package                                                                                     
                                                                                                                    
COPY --from=builder /src/.next ./.next
COPY --from=builder /src/public ./public
COPY --from=builder /src/next.config.mjs ./next.config.mjs
                                                                                                                    
EXPOSE 3000
# Use standalone server instead of "next start" when output: 'standalone' is configured
CMD ["node", ".next/standalone/server.js"]