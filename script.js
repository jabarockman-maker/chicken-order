function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
    const params = e.parameter;

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const nextRow = sheet.getLastRow() + 1;
    const row = [];

    headers.forEach(h => {
      row.push(params[h] || '');
    });

    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);

    return ContentService.createTextOutput(
      JSON.stringify({ result: 'success', row: nextRow })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
