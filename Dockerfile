# Этап 1: Сборка React фронтенда
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Этап 2: Сборка Go бэкенда
FROM golang:1.24-alpine AS backend-builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
# Компилируем статический бинарник
RUN CGO_ENABLED=0 GOOS=linux go build -o yaml-server ./cmd/server/main.go

# Этап 3: Финальный сверхлегкий образ
FROM alpine:latest
WORKDIR /app

# Забираем собранный бинарник Go
COPY --from=backend-builder /app/yaml-server .
# Забираем собранный React
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 8080
CMD ["./yaml-server"]