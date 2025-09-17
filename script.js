// 你的 Google Apps Script Web App /exec
const googleScriptURL =
  'https://script.google.com/macros/s/AKfycbyrA_MVNiHvIlQ0nI-Dh1_ta3LlaDaqg5hLl23qXuQgT3fszsaPpyILSItrmceJ5tT3/exec';

// 在 submit 事件裡，算好變數後用這段送出：
// name, mainName, mainFlavor, snackFlavorPairs (陣列), drinkNames (陣列), comboName, price
const payload = new URLSearchParams();
payload.set('timestamp', new Date().toISOString());
payload.set('姓名', name || '');
payload.set('主餐', mainName || '');
payload.set('口味', mainFlavor || '');                        // 主餐口味（可不選）
payload.set('點心', (snackFlavorPairs.join(', ') || ''));     // 例：柳葉魚（原味）, 花枝丸（原味）
payload.set('飲料', (drinkNames.join(', ') || ''));
payload.set('套餐', comboName || '');
payload.set('金額', String(price || 0));

fetch(googleScriptURL, {
  method: 'POST',
  mode: 'no-cors',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  body: payload.toString()
})
  .then(() => console.log('Google Sheet 已寫入（URL-encoded）'))
  .catch(err => console.error('送 Sheets 失敗：', err));
