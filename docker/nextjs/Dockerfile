FROM node:20-alpine

# 必要なパッケージをインストール
RUN apk add --no-cache \
    libc6-compat \
    tini

# npmの設定を更新
RUN npm config set legacy-peer-deps true

# アプリケーションディレクトリとnode_modulesを作成し、権限を設定
RUN mkdir -p /app/node_modules && \
    chown -R node:node /app && \
    chmod -R 755 /app

# 作業ディレクトリを設定
WORKDIR /app

# npmキャッシュディレクトリを作成し、権限を設定
RUN mkdir -p /home/node/.npm && \
    chown -R node:node /home/node/.npm

# 初期化スクリプトをコピーして権限を設定
COPY nextjs/init.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/init.sh

# package.jsonとpackage-lock.jsonをコピー（存在する場合）
COPY --chown=node:node package*.json ./

# ユーザーを設定
USER node

# ポートを公開
EXPOSE 3000

# ヘルスチェックを設定
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# tiniをエントリーポイントとして使用
ENTRYPOINT ["/sbin/tini", "--"]

# init.shを実行
CMD ["/usr/local/bin/init.sh"] 