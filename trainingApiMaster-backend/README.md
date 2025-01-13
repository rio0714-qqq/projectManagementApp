# トレーニング用: 案件管理 API

案件情報とその担当者を管理する API です。

- Web サーバー: Express.js
- データベース: mongoDB

## 起動と Seeding

`config/`ディレクトリ内の
`config.env.example`ファイルを同一ディレクトリにコピーし、
ファイル名を`config.env`に変更してください。

```
$ docker-compose up -d
$ docker-compose exec web bash

# データのインポート
$ npm run seed -- -i

# DBデータの全削除
$ npm run seed -- -d
```

## DB 確認

`docker-compose up`及び Seeding 後に以下 URL をブラウザで開いてください。

http://localhost:8082/db/test/

## API Doc

Postman にて生成...🚀

以下の URL にアクセスしてください。

https://documenter.getpostman.com/view/13673629/TWDWKd4U

## 機能

### 権限

ユーザーには以下の権限のうちいずれかを設定できます。

- `user`: 一般ユーザー
- `admin`: 他ユーザーの追加や削除、変更ができます。

### 新規登録 / ログイン

```
api/v1/auth/register
api/v1/auth/login
```

- 登録・ログイン成功時に JWT を返却

### Email でのパスワードリセット

```
api/v1/auth/forgotpassword
api/v1/auth/resetpassword/:resetToken
```

- リセット用トークン付のエンドポイントをメールで送信する
- 練習用なので、`api/v1/auth/forgotpassword`のレスポンスにもエンドポイントを含めています

### 自身の情報取得

```
api/v1/auth/me
```

- Bearer Token が必要

### 案件管理

```
api/v1/projects
```

- Bearer Token が必要
- 登録 / 編集 / 削除 / 一覧
- 各種 URL クエリパラメータによる絞込（`gt|gte|lt|lte|in`）

**ステータスについて**

ステータスは以下のうちいずれかが設定できるものとする。

"新規" | "提案中" | "発注待ち" | "受注済" | "失注" | "継続" | "確認中"

### ユーザー管理

```
api/v1/users
```

- `admin`権限ユーザーのみ実行可能
- Bearer Token が必要
- 登録 / 編集 /削除 / 一覧
- 各種 URL クエリパラメータによる絞込（`gt|gte|lt|lte|in`）

## セキュリティ

- NoSQL Injection 対策
- Security Headers の設定
- XSS 攻撃対策
- HPP 攻撃対策
- レート制限
