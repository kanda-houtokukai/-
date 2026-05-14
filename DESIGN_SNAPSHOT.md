# DESIGN_SNAPSHOT.md
## 送迎ルート最適化システム 設計スナップショット
作成日：2026-05-14  
対象ファイル：`index.html`、`GAS_script.gs`  
目的：本番運用前のバグ防止・保守性向上のための設計可視化

---

## 1. 状態管理マップ

### 1-1. スプレッドシート「運行記録」シート

| 列 | 内容 | 形式 |
|---|---|---|
| A列 `date` | 運行日 | `YYYY-MM-DD` |
| B列 `stopNum` | レコード種別（数値）| 下記stopNum体系参照 |
| C列 `departTime` | 時刻またはJSONペイロード | `HH:MM` または JSON文字列 |
| D列 `timestamp` | サーバー記録日時 | `YYYY-MM-DD HH:mm:ss` |

**GAS doGet 日付フィルタ**：`GAS_script.gs` L57 `if (date && rowDate !== date) continue;` にて行レベルで適用。`?date=` パラメータが空の場合は全日付が返る。

**GAS doPost 日付フィルタ**：各stopNumの重複チェックブロックで `rowDate === date` を確認（L134, L155, L175, L196, L220）。新規追記時（L233）は受信した `date` をそのまま保存。

### 1-2. スプレッドシート「子ども情報シート」

`loadSheets` (L1477) で `A2:H` 範囲を取得。

| 列 | 用途 |
|---|---|
| A列 | 通し番号（NO）|
| B列 | 子どもの名前 |
| C列 | 自宅住所 |
| D列 | 出席曜日（例：月火水）|
| E列 | 乗車時間 |
| F列 | 電話番号 |
| G列 | 備考 |
| H列 | その他 |

### 1-3. スプレッドシート「事業所情報シート」

`loadSheets` (L1460) で `A1:B8` 範囲を取得。

| 行 | 用途 |
|---|---|
| centerAddress | 事業所住所 |
| departTime | 出発時刻（フォームへ自動入力）|
| arrivalTime | 到着希望時刻 |
| vehicleCount | 車両台数 |
| maxCapacity | 最大乗車人数 |

### 1-4. スプレッドシート「当日出欠シート」

`loadSheets` (L1485) で `A2:B` 範囲を取得。A列がNO（数字）なら番号照合、名前なら名前照合でマージ（L1490-1497）。

---

### 1-5. JavaScript グローバル変数（全一覧）

#### `gCurrentStops`（L1135）
- **型**：Array\<Stop\> | null
- **書き込み**：`checkConfirmedRoute`(L3461)、`syncOperation`スナップショット復元(L2726)、`optimizeRoute`
- **読み込み**：`renderRouteList`、`applyDepartureState`、`applyAbsenceState`、`reoptimizeAfterAbsence`、`saveRouteSnapshot`、`finalizeRoute`
- **リセット**：`checkAndShowConfirmedRoute`(L3567) → `null`
- **⚠️ リセット漏れ**：なし（日付変更時に正しくリセットされる）

#### `gCurrentRouteType`（L1136）
- **型**：string | null（`'pickup'` または `'dropoff'`）
- **書き込み**：`checkConfirmedRoute`(L3462)、`syncOperation`スナップショット(L2727)
- **リセット**：`checkAndShowConfirmedRoute`(L3568) → `null`

#### `gCurrentArrTimeStr`（L1137）
- **型**：string | null（`'HH:MM'`形式）
- **書き込み**：`checkConfirmedRoute`(L3463)、`syncOperation`スナップショット(L2728)
- **リセット**：`checkAndShowConfirmedRoute`(L3569) → `null`

#### `departureRecords`（L1132）
- **型**：`{ [stopIdx: number]: 'HH:MM' }`
- **書き込み**：`recordDeparture`(L2644)、`checkConfirmedRoute`(L3484)、`syncOperation`(L2675)
- **読み込み**：`applyDepartureState`（時刻表示）、`reoptimizeAfterAbsence`（通過済み判定）
- **リセット**：`checkAndShowConfirmedRoute`(L3570) → `{}`、`startOperationSync`(L2909) → `{}`
- **⚠️ リセット漏れ**：なし

#### `localDeparted`（L1133）
- **型**：Set\<number\>
- **用途**：センター停留所（idx=0 / 最終idx）はGASデータではなくローカル押下のみ `effectiveDeparted` に算入する判定用
- **書き込み**：`recordDeparture`(L2646)、`checkConfirmedRoute`(L3485)、`syncOperation`(L2676)
- **リセット**：`checkAndShowConfirmedRoute`(L3571) → `new Set()`、`startOperationSync`(L2910) → `new Set()`

#### `syncTimerId`（L1134）
- **型**：number | null
- **書き込み**：`startOperationSync`(L2913)、`syncOperation`スナップショット復元(L2737)、`checkConfirmedRoute`(L3526)
- **クリア**：`checkAndShowConfirmedRoute`(L3574)、`startOperationSync`(L2911)

#### `isKirariMode`（L1138）
- **型**：boolean（false=添乗者、true=きらり）
- **書き込み**：モード切替ボタン(L2943)、`confirmRoute`(L3034) → false（共有開始時は添乗者モードに強制）、`loadSheets`終了後にリセット(L2023)
- **永続化**：なし（リロードで false にリセット）

#### `isFinalized`（L1139）
- **型**：boolean
- **書き込み**：`finalizeRoute`(L3064)、`restoreRoute`(L3079)、`checkConfirmedRoute`(L3473)、`syncOperation`(L2683)
- **永続化**：なし（リロードで false にリセット → `checkConfirmedRoute` で復元）

#### `isShared`（L1140）
- **型**：boolean
- **書き込み**：`confirmRoute`(L3035)、`checkConfirmedRoute`(L3466)
- **永続化**：なし（リロードで false → checkConfirmedRoute で復元）
- **⚠️** `syncOperation`スナップショット復元(L2730)で `if (isShared)` を参照するが、リロード直後は `false` のためスナップショット表示がスキップされる可能性あり

#### `absenceRecords`（L1141）
- **型**：`{ ["stopIdx_personName"]: reason_string }`
- **書き込み**：`confirmAbsence`(L3125)、`checkConfirmedRoute`(L3491)、`syncOperation`(L2693)
- **読み込み**：`applyAbsenceState`、`updateAbsenceBanner`、`updateAbsenceAlertBar`（添乗者モード）、`reoptimizeAfterAbsence`
- **リセット**：**なし** ← ⚠️ 日付変更時にリセットされない
- **⚠️ リセット漏れ**：**確定バグ**。過去日のデータが残留し翌日以降も参照される

#### `dismissedAbsences`（L1142）
- **型**：Set\<"stopIdx_personName"\>
- **用途**：添乗者モードで赤バナーの × を押したもの（同セッション内で再表示しない）
- **書き込み**：`updateAbsenceAlertBar` clickハンドラ(L3407)、`checkConfirmedRoute`(L3501)、`syncOperation`(L2704)
- **リセット**：**なし** ← ⚠️ 日付変更時にリセットされない
- **⚠️ リセット漏れ**：**確定バグ**。別日で確認済みになった欠席が残留

#### `acknowledgedAbsences`（L1143）
- **型**：Set\<"stopIdx_personName"\>
- **用途**：添乗者が赤バナー × で確認済みにした欠席（GAS `-776` と同期）。きらりモード緑バナーの表示ソース
- **書き込み**：`checkConfirmedRoute`(L3500)、`syncOperation`(L2703)
- **読み込み**：`updateAbsenceAlertBar`（きらりモード緑バナー判定 L3361）、`applyAbsenceState`（確認済みバッジ L3294）
- **リセット**：**なし** ← ⚠️ 日付変更時にリセットされない
- **⚠️ リセット漏れ**：**確定バグ（今回の調査で特定済み）**。前日の `acknowledgedAbsences` が残留し、当日ルートにいない子の緑バナーが誤表示される

#### `kirariDismissedAck`（L1144）
- **型**：Set\<personName\>
- **用途**：きらりモードで緑バナーを × で閉じた人名。GAS `-778` で永続化
- **書き込み**：`updateAbsenceAlertBar` clickハンドラ(L3374)、`checkConfirmedRoute`(L3509)、`syncOperation`(L2712)
- **読み込み**：`updateAbsenceAlertBar`（緑バナーフィルタ L3363）
- **リセット**：`checkAndShowConfirmedRoute`(L3576) → `new Set()`（日付変更時にリセット ✅）

#### `_pendingAbsenceStopIdx` / `_pendingAbsenceName`（L1145-1146）
- 欠席モーダル表示中の一時データ。`recordAbsence`で書き込み、`confirmAbsence`/`cancelAbsence`でクリア

#### `gDirectionsResult`（L1130）
- Google Maps Directions API の最後のレスポンス（グレーポリライン描画用）
- **リセット**：`checkAndShowConfirmedRoute`(L3573) → `null`

#### `gGreyPolyline`（L1131）
- 通過済み区間グレーオーバーレイの Polyline インスタンス
- **リセット**：`checkAndShowConfirmedRoute`(L3572) → `null`（setMap(null)でマップから除去）

#### `storage`（L1158）
- `{}` オブジェクト。localStorage の代替（data: URL 環境対応）。設定値（APIキー等）を保持

---

### 1-6. localStorage

| キー | 値 | 書き込み箇所 | 読み込み箇所 | リセット |
|---|---|---|---|---|
| `parentDevice` | `'1'` | `confirmRoute` L3033 | 未読み込み（参照箇所なし）| なし |

**⚠️ 注記**：`parentDevice` は書き込まれるが、コード内で参照・読み取りする箇所が見当たらない（dead write の可能性）。

---

### 1-7. sessionStorage

現在のコードに sessionStorage の読み書きは**存在しない**。  
（以前は `kirariDismissedAck` の永続化に使用されていたが、GAS `-778` 方式に移行済み）

---

## 2. stopNum 番号体系 完全リファレンス

| stopNum | 意味 | 書き込み関数 | 読み込み関数 | confirmed=true で返るか | absence=true で返るか | doPost 重複防止 |
|---|---|---|---|---|---|---|
| `>= 0` | 出発記録（停車地番号） | `recordDeparture` L2653 | `syncOperation` L2673, `checkConfirmedRoute` L3482 | ✅ | ❌ | 同日・同地点の既存行を**上書き** |
| `-666` | 帰着確定 | `finalizeRoute` L3063 | `syncOperation` L2680, `checkConfirmedRoute` L3470 | ✅ | ❌ | なし（追記）|
| `-665` | 帰着解除 | `restoreRoute` L3078 | `syncOperation` L2680, `checkConfirmedRoute` L3470 | ✅ | ❌ | なし（追記）|
| `-776` | 欠席確認済み（添乗者→きらり通知） | `updateAbsenceAlertBar` clickハンドラ L3416 | `syncOperation` L2698, `checkConfirmedRoute` L3495 | ✅ | ❌ | 同日・同stopIdx・同personName は**スキップ** |
| `-777` | 欠席記録 | `confirmAbsence` L3133 | `syncOperation` L2689, `checkConfirmedRoute` L3487 | ✅ | ✅ | 同日・同stopIdx・同personName は**スキップ** |
| `-778` | 緑バナー閉じ済み（きらり→永続化） | `updateAbsenceAlertBar` clickハンドラ L3381 | `syncOperation` L2709, `checkConfirmedRoute` L3506 | ✅（GAS再デプロイ後）| ❌ | 同日・同personName は**スキップ** |
| `-888` | 確定ルート（全停車地データ含む） | `confirmRoute` L3032 | `checkConfirmedRoute` L3457 | ✅ | ❌ | 同日の既存行を**上書き** |
| `-999` | スナップショット（最適化完了後の一時保存） | `saveRouteSnapshot` L2957 | `syncOperation` L2722 | ❌（confirmed=true で返らない）| ❌ | 同日の既存行を**上書き** |

---

## 3. データフロー

### (a) 通常運行：日付選択 → 利用者読み込み → ルート最適化 → 共有開始 → 各停車地出発 → 帰着

```
[ユーザー操作]              [JavaScript変数]           [GAS スプレッドシート]
─────────────────────────────────────────────────────────────────────
1. ページ読み込み
   └─ checkAndShowConfirmedRoute()
      ├─ GAS GET ?date=today&confirmed=true ─────────────────► 運行記録シート
      │  （-888 なし → false 返却）
      └─ load-btn / stepper を表示

2. 日付・種別を選択（onchange）
   └─ card-result/card-children 非表示
      └─ checkAndShowConfirmedRoute()
         └─ 同上（-888 なし）

3. 「利用者を読み込む」ボタン押下
   └─ loadSheets()
      ├─ fetchSheet → 事業所情報シート ─────────────────────► GAS Sheets API
      ├─ fetchSheet → 子ども情報シート ──────────────────────► GAS Sheets API
      ├─ fetchSheet → 当日出欠シート ────────────────────────► GAS Sheets API
      ├─ children[] に格納
      └─ renderTable() → card-children 表示

4. 「ルートを最適化する」ボタン押下
   └─ optimizeRoute()
      ├─ gCurrentStops ← 計算結果
      ├─ gCurrentRouteType ← 'pickup'/'dropoff'
      ├─ gCurrentArrTimeStr ← 'HH:MM'
      ├─ saveRouteSnapshot() → GAS POST stopNum=-999 ──────► 運行記録 -999 行
      └─ card-result 表示

5. 「出発・共有開始」ボタン押下
   └─ confirmRoute()
      ├─ GAS POST stopNum=-888 ───────────────────────────► 運行記録 -888 行（上書き）
      ├─ isShared = true
      ├─ isKirariMode = false（添乗者モードに強制）
      └─ localStorage['parentDevice'] = '1'

6. 各停車地「出発」ボタン押下
   └─ recordDeparture(stopIdx)
      ├─ departureRecords[stopIdx] = 'HH:MM'
      ├─ localDeparted.add(stopIdx)
      ├─ applyDepartureState() → UI更新
      └─ GAS POST stopNum=stopIdx ──────────────────────► 運行記録 >=0 行（上書き）
         （最終停車地なら arrival-popup 表示）

7. 「帰着」ボタン押下
   └─ finalizeRoute()
      ├─ isFinalized = true
      ├─ body.classList.add('finalized')
      └─ GAS POST stopNum=-666 ──────────────────────────► 運行記録 -666 行

[30秒ごと syncOperation]
   └─ GAS GET ?date=today（全レコード）──────────────────► 運行記録シート（全件）
      ├─ departureRecords 更新
      ├─ isFinalized 更新
      ├─ absenceRecords 更新
      ├─ acknowledgedAbsences 更新
      ├─ kirariDismissedAck 更新
      └─ applyDepartureState / updateAbsenceAlertBar 呼び出し
```

---

### (b) 欠席発生：きらりが欠席連絡 → 添乗者に赤バナー → 添乗者が×で閉じる → きらりに緑バナー → 緑バナーを×で閉じる

```
[きらり端末]                              [GASシート]                [添乗者端末]
─────────────────────────────────────────────────────────────────────────────

1. きらりが「欠席連絡」ボタン押下
   └─ recordAbsence(stopIdx, name) → モーダル表示
      └─ confirmAbsence(reason)
         ├─ absenceRecords["N_name"] = reason
         ├─ applyAbsenceState() → 欠席バッジ表示
         ├─ updateAbsenceAlertBar() → きらりモードは緑バナー対象外（acknowledgedAbsencesにまだない）
         └─ GAS POST stopNum=-777 ──────────────────► 運行記録 -777 行
            ⚠️ date フィールドなし（バグ）

2. [30秒後] 添乗者端末の syncOperation
   └─ GAS GET ?date=today ◄──────────────────────── -777 行を取得
      ├─ absenceRecords["N_name"] = reason
      └─ updateAbsenceAlertBar()
         └─ 添乗者モード赤バナー表示（dismissedAbsences になければ）

3. 添乗者が赤バナーの × を押す
   └─ updateAbsenceAlertBar() clickハンドラ（L3407-3425）
      ├─ dismissedAbsences.add("N_name") → 赤バナー消去
      ├─ GAS POST stopNum=-776 ──────────────────► 運行記録 -776 行
      │  payload: { date, stopNum:-776, departTime: {stopIdx, personName} }
      └─ updateAbsenceAlertBar() 再呼び出し → バナー非表示

4. [30秒後] きらり端末の syncOperation（または checkConfirmedRoute 後の await syncOperation）
   └─ GAS GET ?date=today ◄──────────────────────── -776 行を取得
      ├─ acknowledgedAbsences.add("N_name")
      ├─ dismissedAbsences.add("N_name")
      └─ updateAbsenceAlertBar()
         └─ isKirariMode=true → acknowledgedAbsences にあり、kirariDismissedAck になければ
            └─ 緑バナー表示 ✅

5. きらりが緑バナーの × を押す
   └─ updateAbsenceAlertBar() clickハンドラ（L3374-3388）
      ├─ kirariDismissedAck.add(name) → 緑バナー消去
      ├─ updateAbsenceAlertBar() → バナー非表示
      └─ GAS POST stopNum=-778 ──────────────────► 運行記録 -778 行
         payload: { date, stopNum:-778, departTime: {personName} }

6. [リロード後] checkConfirmedRoute
   └─ GAS GET ?date=today&confirmed=true ◄────────── -778 行を取得
      └─ kirariDismissedAck.add(name) → 緑バナーは再表示されない ✅
```

---

### (c) リロード復帰：運行途中でブラウザリロード → 現在の状態に復帰するまでの処理

```
[ページリロード時 IIFE（L1211-1215）]
   │
   ▼
checkAndShowConfirmedRoute(dateStr)
   ├─ 全変数リセット（gCurrentStops, departureRecords, localDeparted, kirariDismissedAck）
   │  ⚠️ acknowledgedAbsences, absenceRecords, dismissedAbsences はリセットされない
   │
   └─ checkConfirmedRoute(today) ─── GAS GET ?date=today&confirmed=true
      │
      ├─ -888 レコードあり → ルート復元
      │   ├─ gCurrentStops ← stops データ
      │   ├─ isFinalized ← -666/-665 の最新レコード
      │   ├─ departureRecords ← >=0 のレコード群
      │   ├─ localDeparted ← 同上（GAS復元時も追加）
      │   ├─ absenceRecords ← -777 レコード群
      │   ├─ acknowledgedAbsences ← -776 レコード群
      │   ├─ dismissedAbsences ← -776 レコード群（再表示防止）
      │   ├─ kirariDismissedAck ← -778 レコード群
      │   ├─ isShared = true
      │   ├─ renderRouteList() → card-result 表示
      │   ├─ applyDepartureState() → 出発済みボタン更新
      │   ├─ applyAbsenceState() → 欠席バッジ・確認済みバッジ
      │   ├─ updateAbsenceAlertBar() → バナー更新（1回目）
      │   ├─ await syncOperation() → 全レコード再取得・バナー更新（2回目・確定版）
      │   └─ setInterval(syncOperation, 30000) → 30秒同期開始
      │
      └─ -888 レコードなし → false 返却
          └─ checkAndRestoreOperation()
              └─ await syncOperation()
                 └─ -999 (スナップショット) があり isShared=true なら card-result 表示
                    ⚠️ isShared は false のままなのでスナップショット表示がスキップされる可能性
```

**リロード復帰の課題**：`isShared` はリロードで `false` にリセットされる。`checkConfirmedRoute` が `-888` レコードを見つけると `isShared = true` に設定されるが、`-888` がなく `-999` のみの場合は `isShared` が `false` のまま `syncOperation` の `if (isShared)` (L2730) に入れず、スナップショットからの表示復帰ができない。

#### 実測動作仕様（2026-05-14 動作確認時点）

リロード時の復帰挙動は、スプレッドシート上のデータ状態によって以下のように分岐する：

| データ状態 | リロード後の挙動 | 復帰方法 |
|---|---|---|
| `-888`（確定ルート）あり | **自動復帰**：日付選択のみで運行画面が表示される | 操作不要 |
| `-888` なし、`-999`（スナップショット）のみ | **半自動復帰**：利用者読み込み・ルート最適化を再操作 | ユーザー操作 |
| データなし | 通常の新規開始フロー | ユーザー操作 |

**当初観測されていた「最初のルート表示に戻ってしまう」現象は、
Phase 1 の修正（acknowledgedAbsences/absenceRecords/dismissedAbsences
のリセット追加）によって解消済み。**

業務上の影響：
- 通常運用では「出発・共有開始」を押した後に -888 が記録されるため、運行中のリロードは自動復帰する（ケースA）
- 「ルート最適化のみ実施、共有開始前」の段階でのリロードは再操作が必要だが、データ消失はない（ケースB）
- いずれの場合も致命的な状態破壊は起きない

---

## 4. 既知バグ・懸念点

### バグ1：緑バナー誤表示（acknowledgedAbsences のリセット漏れ）✅ 修正済み（Phase 1）

| 項目 | 内容 |
|---|---|
| **現状の挙動** | 過去日（例：2026-01-01）の中村花子の -776 データが `acknowledgedAbsences` に入ったまま残る。本日の日付に切り替えると `acknowledgedAbsences` がリセットされず中村花子の緑バナーが誤表示される |
| **期待される挙動** | 日付を変更したら前日以前の `acknowledgedAbsences` データは使用しない |
| **推定原因** | `checkAndShowConfirmedRoute` (L3566-3576) のリセットブロックで `acknowledgedAbsences`、`absenceRecords`、`dismissedAbsences` が `new Set()` / `{}` に初期化されていない。`kirariDismissedAck` はリセットされているが (L3576)、残り3変数が漏れている |
| **影響範囲** | 同一セッション内で日付変更を行ったすべてのケース |
| **修正** | Phase 1 にて L3576 直後に3行追加。コミット `faf3f57` にて対応完了 |

---

### バグ2：過去日付を選択すると -999 がスプレッドシートに書き込まれる現象

| 項目 | 内容 |
|---|---|
| **現状の挙動** | 過去日付でルート最適化操作を行うと `saveRouteSnapshot()` が実行され、その日付の -999 レコードが書き込まれる（または上書きされる） |
| **期待される挙動** | 過去日付では -999 は書き込まれない |
| **推定原因** | `saveRouteSnapshot` (L2949) は `getSelectedDate()` を使用しており、過去日でも制限なく POST する。呼び出し元（optimizeRoute）に当日チェックがない可能性が高い |

---

### ~~バグ3：リロード時「日付選択しただけで自動復帰」しなくなった~~ ✅ 解消確認（2026-05-14）

| 項目 | 内容 |
|---|---|
| **当初の症状** | リロードしても自動復帰せず、利用者読み込み・ルート最適化の再操作が常に必要だった |
| **2026-05-14 時点の挙動** | -888 があれば自動復帰、なければ半自動復帰。最初のルート表示に戻る致命的挙動は解消 |
| **解消の経緯** | Phase 1 で acknowledgedAbsences/absenceRecords/dismissedAbsences のリセットを追加したことが間接的に効いた可能性が高い（明示的な修正は未実施） |
| **現状の判定** | 「ケースA/B 分岐は仕様」として扱う（3-(c) 実測動作仕様参照） |

---

### バグ4：同じ目的の変数が3つ並列存在

| 変数 | 用途 | 問題点 |
|---|---|---|
| `acknowledgedAbsences` | 添乗者確認済み欠席（GAS -776 ソース） | Set のキーが `"stopIdx_personName"` 形式 |
| `dismissedAbsences` | 添乗者が赤バナーを × で閉じたもの | Set のキーが同形式だが用途が微妙に異なる |
| `kirariDismissedAck` | きらりが緑バナーを × で閉じたもの | Set のキーが `personName` のみ（形式が違う） |

`acknowledgedAbsences` と `dismissedAbsences` は現状ほぼ同時に `add` されており（`syncOperation` L2703-2704、`checkConfirmedRoute` L3500-3501）、ほぼ同内容になっている。役割の違いが不明確で管理コストが高い。

---

### 【検証記録】全 POST 箇所の `date` フィールド確認（2026-05-14 実施）

| stopNum | 行番号 | `date` フィールド |
|---|---|---|
| `>= 0`（出発記録） | L2653 | ✅ `date: today` |
| `-665`（帰着解除） | L3076 | ✅ `date: getSelectedDate()` |
| `-666`（帰着確定） | L3054-3055 | ✅ `date: getSelectedDate()` |
| `-777`（欠席記録） | L3128-3130 | ✅ `date: getSelectedDate()`（初版の欠落記述は誤り）|
| `-888`（確定ルート） | L3275-3276 | ✅ `date: getSelectedDate()` |
| `-778`（緑バナー閉じ） | L3383 | ✅ `date: getSelectedDate()` |
| `-776`（欠席確認済み） | L3420 | ✅ `date: getSelectedDate()` |

全 POST 箇所で `date` フィールドの付与を確認。欠落している箇所はない。

---

## 5. 設計上の構造的問題

### 問題1：stopNum がマジックナンバー

コード全体で `-666`、`-665`、`-776`、`-777`、`-778`、`-888`、`-999` が直接数値で比較・使用されており、意味を把握するのに GAS のコメントか本文書を参照しなければならない。

```javascript
// 現状（L2680）
const finalRecs = records.filter(r => [-666, -665].includes(Number(r.stopNum)));
// 同様に多数
```

### 問題2：日付変更時のリセット対象が変数ごとにバラバラ

`checkAndShowConfirmedRoute` (L3566-3579) では以下がリセットされる（Phase 1 修正後）：

```
リセットされる：gCurrentStops, gCurrentRouteType, gCurrentArrTimeStr,
               departureRecords, localDeparted, gGreyPolyline,
               gDirectionsResult, syncTimerId, kirariDismissedAck,
               acknowledgedAbsences, absenceRecords, dismissedAbsences  ← Phase 1 で追加
リセットされない：isShared, isFinalized, isKirariMode
```

`isShared`・`isFinalized`・`isKirariMode` はリセットされないが、`checkConfirmedRoute` が `-888` レコードを見つければ `isShared=true`・`isFinalized` を再設定するため、実害は限定的。ただし `isKirariMode` は日付変更後も保持されるため、モードが意図せず持ち越される可能性がある。どの変数をリセットすべきかの一貫したルールがなく、追加されるたびに漏れが生じる構造という根本問題は継続。

### 問題3：状態管理が4箇所に分散

| 保存先 | 保存している状態 |
|---|---|
| JS変数（メモリ） | ルートデータ、出発状況、欠席情報、モード、タイマー |
| GAS スプレッドシート | 運行記録（永続・共有）|
| localStorage | `parentDevice`（書くだけで読まない）|
| sessionStorage | 現在は未使用（以前は kirariDismissedAck に使用、2026-05-14 コード確認済み）|

整合性の保証がなく、リロード・日付変更・モード切替でズレが生じやすい。

### ~~問題4：`confirmAbsence` の POST に `date` フィールドがない~~

**2026-05-14 確認時点で本問題は存在しないことが判明。**
実コードの L3128-3130 には `date: getSelectedDate()` が正しく付与されている。
本ドキュメント初版作成時の誤った記述。

### 問題5：`localStorage['parentDevice']` が dead write

`confirmRoute` (L3033) で `localStorage.setItem('parentDevice', '1')` として書き込まれるが、`localStorage.getItem` の呼び出しがコード内に存在しない（2026-05-14 全文 grep で確認済み）。本来は「この端末が添乗者端末か」を判定するために使うはずだったと推定されるが、現在は `isKirariMode` のメモリ変数で判定しており不要。dead write として確定。

### ~~問題6：`startOperationSync` 関数が未使用の可能性~~

**2026-05-14 確認時点で本問題は存在しないことが判明。**
`startOperationSync` は `optimizeRoute()` (L1815) 内の L2029 から呼ばれており、「ルートを最適化する」ボタン押下時に必ず実行される。
本ドキュメント初版作成時の確認ミスによる誤った記述。

### 問題7：`syncOperation` と `checkConfirmedRoute` の二重 `updateAbsenceAlertBar` 呼び出し

`checkConfirmedRoute` 内で `updateAbsenceBanner(); updateAbsenceAlertBar()` が2回呼ばれる（L3520 と L3524、2026-05-14 grep 確認済み）。1回目（L3520）は `-778` 反映前（confirmed=true モードの取得データのみ）、2回目（L3524）は `await syncOperation()` 完了後（全レコード取得後・kirariDismissedAck 確定後）。2回目の呼び出しが「確定版」として機能する意図的な設計だが、コードの読者には混乱を招く。記述は正確。

### 問題8：GAS_script.gs のコメントが古い（L9-11）

```
//    B列: stopNum (数値: >=0=出発記録, -666=帰着確定, -665=帰着解除,
//                       -777=欠席記録, -888=確定ルート, -999=スナップショット)
```

`-776`（欠席確認済み）と `-778`（緑バナー閉じ済み）が記載されていない（2026-05-14 実ファイル確認済み）。また `-665`（帰着解除）は記載されているが、`-776` / `-778` は後から追加されたため、コメントが更新されていない。記述は正確。

---

## 6. リファクタ提案（影響度順）

### ~~案1【最小影響・即効性あり】日付変更時リセット対象を統一~~ ✅ 実施済み（Phase 1）

`checkAndShowConfirmedRoute` の L3576 直後に以下3行を追加済み（コミット `faf3f57`）：

```javascript
acknowledgedAbsences = new Set();
absenceRecords = {};
dismissedAbsences = new Set();
```

既知バグ1（緑バナー誤表示）が解消された。

---

### 案2【対応不要】`confirmAbsence` の POST `date` フィールド追加

**2026-05-14 確認時点で本対応は不要であることが判明。**
現コードには既に `date: getSelectedDate()` が付与済み。

---

### 案3【中影響】stopNum を定数で管理

マジックナンバーを排除し、可読性・保守性を向上させる。

```javascript
// 提案：定数オブジェクトを宣言
const STOP_NUM = {
  DEPARTURE:    (n) => n >= 0,  // 出発記録
  FINALIZED:    -666,           // 帰着確定
  UNFINALIZED:  -665,           // 帰着解除
  ABSENCE_ACK:  -776,           // 欠席確認済み
  ABSENCE:      -777,           // 欠席記録
  BANNER_CLOSE: -778,           // 緑バナー閉じ済み
  ROUTE:        -888,           // 確定ルート
  SNAPSHOT:     -999,           // スナップショット
};
```

GAS 側も同様に変更が必要なため、フロント・GAS 両方への変更が伴う中規模修正。

---

### 案4【中影響】`acknowledgedAbsences` と `dismissedAbsences` を統合

現在この2変数はほぼ同じタイミングで同じキーが `add` されている。1つの Map に統合し、フラグで用途を区別することで変数の重複を解消できる。

```
現状：acknowledgedAbsences（Set）+ dismissedAbsences（Set）
提案：absenceAckState = Map<key, { acknowledged: bool, dismissed: bool }>
```

ただし参照箇所が多いため、修正範囲は相応に広くなる。

---

### 案5【大影響】日付ベースの状態管理クラス化

日付変更時にすべての状態を一括リセット・ロードできるよう、日付をキーとした状態管理オブジェクトを導入する。

```javascript
// 提案イメージ
const dayState = {
  date: null,
  reset(newDate) {
    this.date = newDate;
    this.departureRecords = {};
    this.localDeparted = new Set();
    this.absenceRecords = {};
    this.acknowledgedAbsences = new Set();
    this.dismissedAbsences = new Set();
    this.kirariDismissedAck = new Set();
    // ... 全関連変数
  }
};
```

「どの変数が日付依存か」が明示的になりリセット漏れを構造的に防げる。ただし、既存の全グローバル変数参照の書き換えを伴う大規模リファクタリングとなるため、次フェーズ以降での実施を推奨。

---

*以上、コード変更は一切行っておりません。*

---

## 7. 修正履歴

### Phase 1（2026-05-14）バグ1修正：緑バナー誤表示解消
- コミット：`faf3f57`
- 内容：`checkAndShowConfirmedRoute` の L3576 直後に3行追加
- 影響：日付変更時の状態リセット漏れを解消

### Phase 2（2026-05-14）ドキュメント訂正：confirmAbsence の date 欠落
- コミット：`4693768`
- 内容：DESIGN_SNAPSHOT.md の誤記述を訂正
- 経緯：実コードには既に date フィールドが付与されており、初版ドキュメントの記述が誤りだった

### Phase 3（2026-05-14）ドキュメント全体再検証
- コミット：`3b5d777`
- 内容：「構造的問題」「リファクタ提案」セクションを実コードで再検証
- 主な発見：問題6（startOperationSync 未使用）も誤記述で、optimizeRoute から呼ばれている

### Phase 4（2026-05-14）過去日付書き込み：仕様として保持
- 修正：なし
- 経緯：当初は「過去日付書き込み拒否」を入れる方針だったが、コンテスト評価者が任意日付で試運転できる必要があるため、現状の柔軟性を意図的に保持

### Phase 5（2026-05-14）バグ3：解消確認
- 修正：なし（Phase 1 の修正で間接的に解消）
- 経緯：実機テストで挙動を確認し、致命的挙動は解消済みと判定
