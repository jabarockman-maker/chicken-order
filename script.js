function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
    const params = e.parameter;
    const action = params.action || "add";

    if (action === "add") {
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const row = [];
      headers.forEach(h => row.push(params[h] || ""));
      sheet.appendRow(row);
      return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "update") {
      const name = params["姓名"];
      if (!name) throw new Error("缺少姓名");
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const colMap = {};
      headers.forEach((h, i) => colMap[h] = i);

      for (let r = data.length - 1; r >= 1; r--) {
        if (data[r][colMap["姓名"]] === name) {
          Object.keys(params).forEach(k => {
            if (colMap[k] !== undefined) {
              sheet.getRange(r + 1, colMap[k] + 1).setValue(params[k]);
            }
          });
          return ContentService.createTextOutput(JSON.stringify({ result: "updated" }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: "invalid action" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
