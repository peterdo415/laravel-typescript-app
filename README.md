# Laravel + TypeScript/Next.js/React 学習用MVP 要件定義書  

---

## 1. 目的・前提  
PHP/Zend Framework と JavaScript/jQuery の基礎はあるが **Laravel / TypeScript / Next.js / React** は未経験の開発者が、  
**実際に動く Web アプリを作りながら基礎を体系的に身に付ける** ことをゴールとする。  
学習コストを抑えるため、最小実用機能 (MVP) に絞る。  

---

## 2. 採用技術（すべて LTS 版）  

| レイヤ       | 技術                | バージョン / LTS サポート期間                                                              | 参考 |
|-------------|---------------------|------------------------------------------------------------------------------------------|------|
| 言語        | PHP                 | 8.3.x / アクティブサポート：2025‑12、セキュリティサポート：2026‑12                        |      |
|             | TypeScript          | 5.8.x / 最新GA                                                                            |      |
| ライブラリ   | React               | 19.1 / 最新安定版                                                                         |      |
| フレームワーク | Laravel             | 12.x / バグ修正：2026‑08、セキュリティ修正：2027‑02                                        |      |
|             | Next.js             | 15.x / Active LTS：2024‑10〜2026‑10、Maintenance LTS：2026‑10〜2028‑10                     |      |
| ランタイム   | Node.js             | 20.x “Iron” / Active LTS：2023‑10〜2025‑10、Maintenance LTS：2025‑10〜2026‑04               |      |
| DB          | MySQL               | 8.0.x / Active Support：2026‑04                                                           |      |
| テスト      | PHPUnit 11 / Pest   | 最新安定版を利用                                                                         |      |
|             | Jest + React Testing Library | 最新安定版を利用                                                              |      |
| インフラ    | Docker Compose      | 最新安定版を利用                                                                         |      |
|             | GitHub Actions      | 常に最新を利用                                                                           |      |
|             | Vercel (Next.js)    | 常に最新を利用                                                                           |      |
|             | Fly.io / Laravel Forge | 常に最新を利用                                                                      |      |


### 2.1 Docker 関連ディレクトリ構造

project-root/
├─ docker/
│  ├─ docker-compose.yml          # 全サービス共通 (PHP, Node.js, MySQL, Test)
│  ├─ volumes/                    # named volumes 定義ファイル群
│  │  └─ volumes.env
│  ├─ networks/                   # ネットワーク定義（必要時）
│  │  └─ networks.env
│  ├─ laravel/                    # Laravel API 用コンテナ
│  │  ├─ Dockerfile               # PHP 8.3.x LTS + Laravel 12.x LTS ベース
│  │  └─ .dockerignore            # 不要ファイル除外
│  ├─ nextjs/                     # Next.js フロントエンド用コンテナ
│  │  ├─ Dockerfile               # Node.js 20.x LTS + Next.js 15.x ベース
│  │  └─ .dockerignore            # ビルド時除外設定
│  ├─ mysql/                      # MySQL コンテナ用 (image: mysql:8.0)
│  │  ├─ Dockerfile               # カスタム設定があれば
│  │  ├─ init/                    # 初期化 SQL スクリプト配置
│  │  │  └─ schema.sql
│  │  └─ .env                     # DB 環境変数オーバーライド用
│  └─ tests/                      # テスト実行用コンテナ
│     ├─ Dockerfile               # PHPUnit, Pest, Jest + RTL 用
│     └─ .dockerignore            # 不要ファイル除外
├─ backend/                       # Laravel アプリケーション本体 (Laravel 12.x LTS)
│  ├─ app/
│  ├─ config/
│  └─ ...
├─ frontend/                      # Next.js アプリケーション本体 (Next.js 15.x / React 19.1)
│  ├─ app/
│  ├─ pages/
│  └─ ...
└─ ...                            # その他ドキュメント等

## 2.2 Frontend 依存関係（バージョン固定）
| パッケージ       | バージョン指定      | 用途            |
|------------------|---------------------|-----------------|
| react            | ^19.1.0             | UI ライブラリ   |
| typescript       | ^5.8.0              | 静的型付け      |
| next             | ^15.2.0             | フレームワーク  |

```json
// frontend/package.json より抜粋
{
  "dependencies": {
    "react": "^19.1.0",
    "next": "^15.2.0"
  },
  "devDependencies": {
    "typescript": "^5.8.0"
  }
}
```
---

## 3. システム全体要件  

### 3.1 機能一覧 (MVP)  

| ID | 機能 | 学習対象 | 概要 |
|----|------|----------|------|
| F‑01 | ユーザー登録/認証 | Laravel Breeze + API ルート / NextAuth.js | email + パスワードによる認証、CSRF 対策を含む |
| F‑02 | チュートリアル閲覧 | Laravel Eloquent / React ルーティング | Laravel 側で教材（章・節）管理、Next.js App Router で表示 |
| F‑03 | 進捗トラッキング | Laravel API Resource / React state & hooks | 既読・達成率をユーザー単位で保存・表示 |
| F‑04 | 双方向コードプレイグラウンド | REST + fetch / React useState | エディタに入力 → Laravel でコード検証 → 結果を即返却 |
| F‑05 | FAQ&コメント | Laravel Policy / React Server Components | 初歩的な CRUD を通じて MVC・フォーム処理を習得 |
| F‑06 | テスト自動化 | PHPUnit / Jest | CI 上でバックエンド・フロントエンド双方の単体テスト実行 |
| F‑07 | CI/CD & デプロイ | GitHub Actions, Docker‑Compose | main ブランチ push でステージングに自動デプロイ |

### 3.2 非機能要件  

* **パフォーマンス**: API 応答 < 200 ms（ローカル Docker 環境）  
* **セキュリティ**: OWASP Top 10 を満たす、HTTPS 必須、.env で機密管理  
* **可観測性**: Laravel Telescope / Next.js Logger、Grafana Cloud で Metrics 収集  
* **国際化**: ja-JP を既定、i18n 対応のため JSON 翻訳ファイルを構造化  

### 3.3 推奨インフラ構成（補足）  

1. **ローカル**: Docker Compose（nginx + php‑fpm + mysql + node）。  
2. **CI**: GitHub Actions で `build‑test‑deploy.yml`。  
3. **ステージング**:  
   * Laravel API → Fly.io (PostgreSQL アドオン付き)  
   * Next.js → Vercel (環境変数は Encrypt Secrets)  
4. **本番**:  
   * Web/API → AWS Lightsail or ECS Fargate (Blue/Green)  
   * DB → Amazon RDS MySQL 8.3 Multi‑AZ  
   * 監視 → Amazon CloudWatch + Grafana Cloud  
5. **CDN**: Cloudflare Pages（Next.js 静的出力キャッシュ）  

---

## 4. 機能別要件定義  

### F‑01 ユーザー登録 / 認証  
| 項目 | 内容 |
|------|------|
| エンドポイント | `POST /api/register`, `POST /api/login`, `POST /api/logout` |
| バリデーション | email 必須・一意、パスワード 8 文字以上 |
| 成功基準 | ① トークン/セッションが発行される ② 失敗時 JSON エラー返却 |
| 学習ポイント | Laravel Breeze, Sanctum, NextAuth.js Adapter, React form   |

### F‑02 チュートリアル閲覧  
| 項目 | 内容 |
|------|------|
| エンドポイント | `GET /api/chapters/{id}` |
| UI | Next.js App Router, React Markdown で本文表示 |
| 学習ポイント | Eloquent Model, App Router, Dynamic Routes, Suspense |

### F‑03 進捗トラッキング  
| 項目 | 内容 |
|------|------|
| エンドポイント | `PATCH /api/progress/{chapter_id}` |
| データ | user_id, chapter_id, percentage |
| 学習ポイント | useState/useEffect → React 19 の Server Actions に書き換え |

### F‑04 双方向コードプレイグラウンド  
| 項目 | 内容 |
|------|------|
| エンドポイント | `POST /api/sandbox/run` |
| 仕様 | Laravel で PHP コードを `eval` せず sandbox 実行 (e.g. php‑sandbox) |
| 学習ポイント | fetch, useTransition, Web Worker (if heavy) |

### F‑05 FAQ & コメント  
| 項目 | 内容 |
|------|------|
| 概要 | 各教材ページに質問と回答を CRUD できる |
| 権限制御 | 質問は認証ユーザー、回答は管理者のみ可 |
| 学習ポイント | Laravel Policy / Gates, React Optimistic UI |

### F‑06 テスト自動化  
| 項目 | 内容 |
|------|------|
| バックエンド | PHPUnit 11 / Pest → モデル・コントローラ単体テスト |
| フロント | Jest + React Testing Library → コンポーネントレンダリング確認 |
| パイプライン | GitHub Actions job: `npm ci && npm run test`, `composer install && php artisan test` |

### F‑07 CI/CD & デプロイ  
| 項目 | 内容 |
|------|------|
| ブランチ運用 | GitHub Flow (main, feature/*) |
| 自動化 | main にマージ → lint → test → docker build → push → deploy |
| ロールバック | Fly.io / Vercel 共に Instant Rollback で 1 クリック復旧 |

---

## 5. 今後の拡張余地  
* GraphQL 化 (Laravel Lighthouse + Apollo)  
* OAuth2 / SSO 連携  
* Terraform で IaC  
* e2e テスト (Playwright)  
* 学習バッジ・実績システム  

---

この要件定義をベースに進めることで、**環境構築 → バックエンド API → フロント実装 → テスト → デプロイ** までを一周体験でき、Laravel と Next.js/React/TypeScript の基礎が自然に身に付きます。  
