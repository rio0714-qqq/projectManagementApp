# ProjectManagementApp

<img src="projectManagementAppImage.gif" alt="ProjectManagementApp" width="240">

## 概要
### *案件情報管理アプリ(iOS・Android)*
案件情報および各案件におけるユーザのアサイン情報を一元管理できるアプリ。<br>
ユーザには管理者ユーザ(admin権限)と一般ユーザ(user権限)の2種類の権限があり、権限によって利用できる機能が制限される。

### *機能*
#### **1. 主要機能**
- **ログイン機能**<br>
    登録したユーザでアプリにログインできる。
    <br>

- **ログアウト機能**<br>
    ログインユーザをアプリからログアウトできる。
    <br>

- **新規登録機能**<br>
    未ログイン時に一般ユーザの新規登録ができる。
    <br>

- **パスワード再設定機能**<br>
    メールアドレスからパスワードの再設定ができる。
    <br>

- **案件情報表示機能**<br>
    案件情報の一覧表示および詳細表示が可能。
    <br>

- **ユーザ情報表示機能(管理者ユーザのみ)**<br>
    管理者ユーザログイン時にユーザ情報の一覧表示および詳細表示が可能。
    <br>

#### **2. 案件情報管理機能**
- **案件情報登録機能(管理者ユーザのみ)**<br>
    管理者ユーザログイン時に案件情報の新規登録ができる。<br>
    案件名、顧客企業、利用言語、案件詳細、案件稼働ステータス、アサインメンバー(ユーザ)の登録が可能。
    <br>

- **案件情報削除機能(管理者ユーザのみ)**<br>
    管理者ユーザログイン時に案件情報を削除できる。
    <br>

- **案件情報変更機能**<br>
    ログイン時に案件情報の新規登録ができる。<br>
    管理者ユーザは、案件名、顧客企業、利用言語、案件詳細、案件稼働ステータス、アサインメンバー(ユーザ)の変更が可能。<br>
    一般ユーザは、案件稼働ステータスのみ変更可能。
    <br>

#### **3. ユーザ情報管理機能**
- **ユーザ情報登録機能(管理者ユーザのみ)**<br>
    管理者ユーザログイン時にユーザ情報の新規登録およびユーザ権限指定ができる。
    <br>

- **ユーザ情報削除機能(管理者ユーザのみ)**<br>
    管理者ユーザログイン時にユーザ情報を削除できる。
    <br>
    
- **ユーザ情報変更機能(管理者ユーザのみ)**<br>
    管理者ユーザログイン時にユーザ情報を変更できる。
    <br>


## 実行方法
### 1. バックエンド
1. バックエンドのルートディレクトリに移動

    ``` 
    cd trainingApiMaster-backend
    ```

2. Docker

- Docker起動

    ``` 
    docker-compose up -d
    ```
- Docker停止

    ``` 
    docker-compose stop
    ```

3. DB確認

    http://localhost:8082/db/test/
    

### 2. フロントエンド
1. フロントエンドのルートディレクトリに移動

    ``` 
    cd projectManagement-frontend
    ```

2. Metro Bundlerを起動

   ``` 
   npx react-native start
   ```

3. アプリの起動実行

- Androidアプリ

   ``` 
   npx react-native run-android
   ```
- iOSアプリ

   ``` 
   npx react-native run-ios
   ```
   <br>


## 使用言語
JavaScript(ReactNative)


## 開発環境
- VisualStudioCode
- ReactNative
- Node.js
- Docker
- Express.js
- MongoDB
- Postman
- Talend API Tester
- Android Emulator
- iOS Emulator
- macOS Sonoma


## その他事項
- 開発期間
  - 2024.08 ~ 2024.09(20日程度)

- 開発規模
  - 1人(個人開発)