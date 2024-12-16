# 使用 Node.js 镜像
FROM node:18-alpine

# 工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制项目文件
COPY . .

# 生成 Prisma 客户端
RUN npx prisma generate

# 构建项目
RUN pnpm run build

# 暴露端口
EXPOSE 3000

# 启动项目
CMD ["pnpm", "start"]