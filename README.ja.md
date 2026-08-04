# Canvas Relay

[English](README.md) | [繁體中文](README.zh-TW.md) | 日本語

Canvas Relay は、人と MCP 対応の AI アシスタントが共同で操作できる、ローカル環境向けの永続化ホワイトボードです。人はデスクトップブラウザーで描画し、AI アシスタントは同じシーンを読み取り、構造化された要素を追加し、作成者情報を保ちながら後の会話で作業を続けられます。

このプロジェクトは意図的に小さく保たれています。Node.js の組み込みモジュールとプレーンな HTML、CSS、JavaScript のみを使用し、実行時の外部依存関係はありません。

## 機能

- パン、ズーム、選択、描画、テキスト、付箋、フレーム、消去に対応したブラウザーホワイトボード。
- 標準入出力を使用する MCP サーバー。
- JSON によるシーンと操作履歴の永続化。
- 各要素と編集に対する人または AI の作成者情報。
- 元データを変更しない更新および消去エフェクトと、元に戻す/やり直す機能。
- 人が作成した要素と AI が作成した要素の個別表示フィルター。
- SVG と JSON の書き出し。
- 繁体字中国語、英語、日本語のインターフェース。
- ローカル専用 HTTP サーバー、同一オリジン検証、制限されたコンテンツセキュリティポリシー。

## インストール

Node.js 20 以降とデスクトップブラウザーが必要です。

```powershell
node --version
git clone https://github.com/rncchen/canvas-relay.git
Set-Location canvas-relay
```

外部の実行時パッケージはないため、`npm install` は不要です。設定後は MCP クライアントが `mcp.mjs` を起動し、ブラウザーサーバーも [http://127.0.0.1:4173](http://127.0.0.1:4173) で自動的に起動します。

通常は `npm start` を別途実行する必要はありません。MCP クライアントなしでブラウザーキャンバスだけを使う場合、または自動起動の問題を調査する場合にのみ使用します。

## Codex に MCP サーバーを追加

実際の絶対パスに置き換えて、リポジトリのルートで実行します。

```powershell
codex mcp add canvas-relay -- node "C:\absolute\path\to\canvas-relay\mcp.mjs"
codex mcp list
```

追加後は Codex を再起動するか、新しいセッションを開始します。

## Claude Code に MCP サーバーを追加

```powershell
claude mcp add --transport stdio --scope user canvas-relay -- node 'C:\absolute\path\to\canvas-relay\mcp.mjs'
claude mcp list
```

新しい Claude Code セッションで `/mcp` を実行して接続を確認します。プロジェクト固有のスキルは `.claude/skills/use-canvas-relay/SKILL.md` にあります。詳細は [Claude Code MCP 公式ドキュメント](https://code.claude.com/docs/en/mcp) と [Skills 公式ドキュメント](https://code.claude.com/docs/en/slash-commands) を参照してください。

## Claude Desktop に MCP サーバーを追加

**Settings → Developer → Edit Config** を開きます。Windows では `%APPDATA%\Claude\claude_desktop_config.json` に次の設定を追加します。

```json
{
  "mcpServers": {
    "canvas-relay": {
      "type": "stdio",
      "command": "node",
      "args": [
        "C:\\absolute\\path\\to\\canvas-relay\\mcp.mjs"
      ]
    }
  }
}
```

保存後、Claude Desktop を完全に終了して再起動します。

設定画面とパスの詳細は [MCP 公式 Claude Desktop チュートリアル](https://modelcontextprotocol.io/docs/develop/connect-local-servers) を参照してください。

リポジトリ直下の `.mcp.json` には環境固有の絶対パスが含まれるため、Git の対象外です。

## スキルとブラウザー検証

リポジトリには Codex 用の `.agents/skills/use-canvas-relay/SKILL.md` と Claude Code 用の `.claude/skills/use-canvas-relay/SKILL.md` が含まれます。表示されない場合はクライアントを再起動してください。

スキルは会話ごとに固有の `canvasId` を使い、完成後に `http://127.0.0.1:4173/?canvas=<canvasId>` をブラウザーで開いて確認します。ローカルページを実際に検証するには、ChatGPT / Codex の Browser 設定で組み込み Browser プラグインを有効にします。

## セッションと作成者ラベル

会話ごとに異なる `canvasId` を使い、同じ会話内のすべての MCP ツール呼び出しでは同じ値を維持します。ブラウザー URL の `canvas` パラメーターにも同じ値を指定します。

作成者ラベルは既定で非表示です。必要な場合は左上の「作成者ラベル」を有効にします。MCP でラベルのないプレビューを取得する場合は、`canvas_get_view` に `includeAuthors: false` を指定します。

## 推奨されるエージェントの操作手順

1. 会話ごとに固有の `canvasId` を決め、すべてのツール呼び出しで再利用します。
2. キャンバスを変更する前に `canvas_get_scene` を呼び出します。
3. レイアウト、重なり、視覚密度、手描き内容を確認するときは `canvas_get_view` を呼び出します。
4. 要素の追加や更新は可能な限りまとめて実行します。
5. ユーザーが明示的に依頼しない限り、既存の内容を保持し、消去や全消去を行いません。
6. キャンバス操作を取り消す必要がある場合は `canvas_undo` を使用します。
7. 完成前に対応するブラウザー URL を開き、作成者ラベルを隠して実際のレイアウトを確認します。

## MCP ツール

| ツール | 用途 |
| --- | --- |
| `canvas_get_scene` | 元の要素、エフェクト、作成者情報、レイヤー、アクティビティ、現在の合成シーンを取得します。 |
| `canvas_get_view` | 現在の合成シーンを SVG として描画します。 |
| `canvas_add_elements` | テキスト、付箋、長方形、楕円、線、矢印、フリーハンド、フレームを追加します。 |
| `canvas_update_elements` | 元データを変更せずに、移動、サイズ、テキスト、スタイルの変更を追加します。 |
| `canvas_delete_elements` | 指定した要素に取り消し可能な消去エフェクトを追加します。 |
| `canvas_undo` | 直前の人または AI の操作前のシーンへ戻します。 |
| `canvas_redo` | 直前に取り消した操作を再適用します。 |
| `canvas_clear` | 表示中の全要素を取り消し可能な形で消去します。ユーザーの明示的な確認後のみ使用します。 |

MCP サーバーは次のリソースも公開します。

- `canvas://scene/current`
- `canvas://view/current.svg`

## データと設定

識別子を指定しない既定のキャンバスは `data/scene.json` と `data/history.json` に保存されます。名前付きセッションは `data/canvases/<canvasId>/scene.json` と `history.json` に保存されます。すべて Git の対象外です。

| 環境変数 | 既定値 | 用途 |
| --- | --- | --- |
| `PORT` | `4173` | ブラウザーアプリケーションの HTTP ポート。 |
| `CANVAS_RELAY_DATA_DIR` | `<repository>/data` | シーン、履歴、ロックファイルを保存する代替ディレクトリ。 |

HTTP サーバーは `127.0.0.1` のみにバインドされます。このツールはローカル利用を前提としており、認証機能はありません。ネットワークへ直接公開しないでください。

## テスト

```powershell
npm test
```

テストは、MCP ネゴシエーション、シーンの永続化、作成者情報、非破壊エフェクト、レイヤー合成、元に戻す/やり直す操作を対象としています。

## 関連ドキュメント

- [アーキテクチャ](docs/ARCHITECTURE.md)
- [開発ガイド](docs/DEVELOPMENT.md)
- [調査メモ](docs/RESEARCH.md)
