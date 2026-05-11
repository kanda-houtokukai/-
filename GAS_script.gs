// =====================================================
//  送迎ルート最適化 - Google Apps Script
//  GASデプロイ用スクリプト（Webアプリとして公開）
// =====================================================
//
//  スプレッドシート構成:
//    シート名: "運行記録"
//    A列: date       (YYYY-MM-DD)
//    B列: stopNum    (数値: >=0=出発記録, -666=帰着確定, -665=帰着解除,
//                          -777=欠席記録, -888=確定ルート, -999=スナップショット)
//    C列: departTime (文字列: HH:MM または JSON文字列)
//    D列: timestamp  (記録日時)
//

var SHEET_NAME = '運行記録';

// ─────────────────────────────────────────────────────
//  doGet: レコード取得
//  ?date=YYYY-MM-DD                    → 全レコード返却
//  ?date=YYYY-MM-DD&confirmed=true     → 確定ルート(-888)＋帰着確定(-666,-665)＋欠席(-777)＋出発(>=0)を返却
//  ?date=YYYY-MM-DD&absence=true       → 欠席記録(-777)のみ返却
// ─────────────────────────────────────────────────────
function doGet(e) {
  var params     = e.parameter;
  var date       = params.date       || '';
  var confirmed  = params.confirmed  === 'true';
  var absenceOnly = params.absence   === 'true';

  try {
    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    // シートが存在しない場合は作成
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['date', 'stopNum', 'departTime', 'timestamp']);
    }

    var lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return buildJsonResponse([]);
    }

    var data = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
    var tz   = ss.getSpreadsheetTimeZone();

    var records = [];
    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      // A列: date
      var rowDate = '';
      if (row[0] instanceof Date) {
        rowDate = Utilities.formatDate(row[0], tz, 'yyyy-MM-dd');
      } else {
        rowDate = String(row[0]).trim();
      }

      if (date && rowDate !== date) continue;

      var stopNum    = Number(row[1]);
      var departTime = String(row[2] || '');
      var ts         = '';
      if (row[3] instanceof Date) {
        ts = Utilities.formatDate(row[3], tz, 'yyyy-MM-dd HH:mm:ss');
      } else {
        ts = String(row[3] || '');
      }

      // absenceOnly モード: -777 のみ
      if (absenceOnly) {
        if (stopNum === -777) {
          records.push({ date: rowDate, stopNum: stopNum, departTime: departTime, timestamp: ts });
        }
        continue;
      }

      // confirmed モード: -888, -666, -665, -777, >=0 を返す
      if (confirmed) {
        if (stopNum === -888 || stopNum === -666 || stopNum === -665 || stopNum === -777 || stopNum >= 0) {
          records.push({ date: rowDate, stopNum: stopNum, departTime: departTime, timestamp: ts });
        }
        continue;
      }

      // 通常モード: 全レコード返却
      records.push({ date: rowDate, stopNum: stopNum, departTime: departTime, timestamp: ts });
    }

    return buildJsonResponse(records);

  } catch (err) {
    return buildJsonResponse({ error: err.message });
  }
}

// ─────────────────────────────────────────────────────
//  doPost: レコード保存
//  Body (JSON): { date, stopNum, departTime }
//
//  stopNum の意味:
//    >= 0   : 出発記録（地点番号）
//    -666   : 帰着確定
//    -665   : 帰着解除
//    -777   : 欠席記録 (departTime は JSON { stopIdx, personName })
//    -888   : 確定ルート (departTime は JSON { routeType, arrTimeStr, stops })
//    -999   : スナップショット (departTime は JSON { routeType, arrTimeStr, stops })
// ─────────────────────────────────────────────────────
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var date       = body.date       || '';
    var stopNum    = Number(body.stopNum);
    var departTime = String(body.departTime || '');

    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    // シートが存在しない場合は作成
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['date', 'stopNum', 'departTime', 'timestamp']);
    }

    var tz = ss.getSpreadsheetTimeZone();
    var now = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm:ss');

    // 確定ルート (-888) とスナップショット (-999) は同日の既存レコードを上書き
    if (stopNum === -888 || stopNum === -999) {
      var lastRow = sheet.getLastRow();
      if (lastRow >= 2) {
        var data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
        for (var i = 0; i < data.length; i++) {
          var rowDate = '';
          if (data[i][0] instanceof Date) {
            rowDate = Utilities.formatDate(data[i][0], tz, 'yyyy-MM-dd');
          } else {
            rowDate = String(data[i][0]).trim();
          }
          if (rowDate === date && Number(data[i][1]) === stopNum) {
            // 既存行を上書き
            var rowIdx = i + 2; // 1-based, ヘッダー行分+1
            sheet.getRange(rowIdx, 3).setValue(departTime);
            sheet.getRange(rowIdx, 4).setValue(now);
            return buildJsonResponse({ status: 'updated', row: rowIdx });
          }
        }
      }
    }

    // 出発記録 (>= 0) は同日・同地点の既存レコードを上書き
    if (stopNum >= 0) {
      var lastRow2 = sheet.getLastRow();
      if (lastRow2 >= 2) {
        var data2 = sheet.getRange(2, 1, lastRow2 - 1, 2).getValues();
        for (var j = 0; j < data2.length; j++) {
          var rowDate2 = '';
          if (data2[j][0] instanceof Date) {
            rowDate2 = Utilities.formatDate(data2[j][0], tz, 'yyyy-MM-dd');
          } else {
            rowDate2 = String(data2[j][0]).trim();
          }
          if (rowDate2 === date && Number(data2[j][1]) === stopNum) {
            var rowIdx2 = j + 2;
            sheet.getRange(rowIdx2, 3).setValue(departTime);
            sheet.getRange(rowIdx2, 4).setValue(now);
            return buildJsonResponse({ status: 'updated', row: rowIdx2 });
          }
        }
      }
    }

    // 欠席記録 (-777) は同日・同人物の重複を防ぐ
    if (stopNum === -777) {
      var lastRow3 = sheet.getLastRow();
      if (lastRow3 >= 2) {
        var data3 = sheet.getRange(2, 1, lastRow3 - 1, 3).getValues();
        for (var k = 0; k < data3.length; k++) {
          var rowDate3 = '';
          if (data3[k][0] instanceof Date) {
            rowDate3 = Utilities.formatDate(data3[k][0], tz, 'yyyy-MM-dd');
          } else {
            rowDate3 = String(data3[k][0]).trim();
          }
          if (rowDate3 === date && Number(data3[k][1]) === -777) {
            // 同日の欠席記録と一致するか確認
            try {
              var existing = JSON.parse(String(data3[k][2]));
              var incoming = JSON.parse(departTime);
              if (existing.stopIdx === incoming.stopIdx && existing.personName === incoming.personName) {
                // 重複 → 何もしない
                return buildJsonResponse({ status: 'duplicate', skipped: true });
              }
            } catch (parseErr) {
              // パース失敗は無視して追記
            }
          }
        }
      }
    }

    // 新規追記
    sheet.appendRow([date, stopNum, departTime, now]);
    return buildJsonResponse({ status: 'ok' });

  } catch (err) {
    return buildJsonResponse({ error: err.message });
  }
}

// ─────────────────────────────────────────────────────
//  ヘルパー: JSON レスポンス生成（CORS対応）
// ─────────────────────────────────────────────────────
function buildJsonResponse(data) {
  var output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}
