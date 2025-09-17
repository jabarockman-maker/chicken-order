/***** 你的 Google Apps Script Web App URL *****/
const googleScriptURL = 'https://script.google.com/macros/s/AKfycbwej-lW5ZQc7DFXJ-rEUqTnvLS-qYKgmVLLFZZ04OAMODkKhMZI93mWo_WXsxfy3EnL/exec';

/***** 菜單（省略部分，跟你原本的一樣） *****/
const mainDishList = [
  { name: "脆皮雞排", price: 85 },
  { name: "無骨雞塊", price: 70 },
  { name: "無骨雞腿排", price: 85 },
  { name: "鮮魷+白飯", price: 70 },
  { name: "無敵雞塊(大)", price: 120 }
];

/* ... 這裡保留 flavorList, snackList, drinksList, comboList ... */

/***** Google Sheet 送出 *****/
function sendToGoogleSheet(order) {
  const payload = new URLSearchParams(order);
  return fetch(googleScriptURL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: payload.toString()
  });
}

/***** 訂單送出 *****/
document.getElementById('orderForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  if (!name) return alert('請輸入姓名');

  // 主餐
  const mainIdx = document.querySelector('input[name="mainDish"]:checked')?.value;
  const mainName = mainIdx !== undefined ? mainDishList[mainIdx].name : '';
  const mainFlavor = document.getElementById('mainFlavor') ?
    document.getElementById('mainFlavor').selectedOptions[0].textContent : '';

  // 點心
  const snackChecks = [...document.querySelectorAll('input[name="snacks"]:checked')];
  const snackFlavorPairs = snackChecks.map(cb => {
    const sel = document.getElementById(`snackFlavor-${cb.value}`);
    return `${cb.dataset.name}（${sel.selectedOptions[0].textContent}）`;
  });

  // 飲料
  const drinkChecks = [...document.querySelectorAll('input[name="drinks"]:checked')];
  const drinks = drinkChecks.map(cb => cb.dataset.name);
  const sweetness = document.getElementById('sweetness').value;
  const ice = document.getElementById('ice').value;

  // 套餐
  const comboIdx = document.querySelector('input[name="combo"]:checked')?.value;
  const comboName = comboIdx !== undefined ? comboList[comboIdx].name : '';
  const comboFlavor = document.getElementById('comboFlavor') ?
    document.getElementById('comboFlavor').selectedOptions[0].textContent : '';

  // 計算金額
  let price = 0;
  if (mainIdx !== undefined) price += mainDishList[mainIdx].price;
  snackChecks.forEach(cb => price += snackList[cb.value].price);
  drinkChecks.forEach(cb => price += drinksList[cb.value].price);
  if (comboIdx !== undefined) price += comboList[comboIdx].price;

  // 付款
  const paymentMethod = document.getElementById('paymentMethod').value;
  const paidAmount = Number(document.getElementById('paidAmount').value || 0);
  const changeAmount = paidAmount - price;
  const status = changeAmount >= 0 ? '已付款' : '待找零';
  const payTime = new Date().toLocaleString();

  const order = {
    timestamp: new Date().toISOString(),
    姓名: name,
    主餐: mainName,
    主餐口味: mainFlavor,
    '點心+口味': snackFlavorPairs.join(', '),
    飲料: drinks.join(', '),
    甜度: sweetness,
    冰塊: ice,
    套餐: comboName,
    套餐口味: comboFlavor,
    金額: price,
    付款方式: paymentMethod,
    已付金額: paidAmount,
    找零金額: changeAmount,
    狀態: status,
    付款時間: payTime
  };

  await sendToGoogleSheet(order);
  alert('訂單已送出！');
});
