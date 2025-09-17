/***** 你的 Google Apps Script Web App URL *****/
const googleScriptURL =
  'https://script.google.com/macros/s/AKfycbwej-lW5ZQc7DFXJ-rEUqTnvLS-qYKgmVLLFZZ04OAMODkKhMZI93mWo_WXsxfy3EnL/exec';

/***** 菜單設定 *****/
const mainDishList = [
  { name: "脆皮雞排", price: 85 },
  { name: "無骨雞塊", price: 70 },
  { name: "無骨雞腿排", price: 85 },
  { name: "鮮魷+白飯", price: 70 },
  { name: "無敵雞塊(大)", price: 120 }
];

const flavorList = [
  { name: "（不選）", price: 0 },
  { name: "原味", price: 0 },
  { name: "胡椒", price: 0 },
  { name: "辣味", price: 0 },
  { name: "梅粉", price: 0 },
  { name: "綜合", price: 0 },
  { name: "特調", price: 0 },
  { name: "咖哩", price: 0 },
  { name: "海苔", price: 0 },
  { name: "起司", price: 0 }
];

const snackList = [
  { name: "柳葉魚", price: 39 }, { name: "脆皮七里香", price: 30 }, { name: "脆皮雞心", price: 30 },
  { name: "脆皮雞翅", price: 30 }, { name: "脆薯（大份）", price: 50 }, { name: "脆薯（小份）", price: 30 },
  { name: "貢丸", price: 30 }, { name: "噗波起司球", price: 30 }, { name: "起司條（2入）", price: 30 },
  { name: "美式洋蔥圈", price: 30 }, { name: "包心小湯圓", price: 30 }, { name: "甜不辣（大份）", price: 50 },
  { name: "甜不辣（小份）", price: 20 }, { name: "QQ地瓜球", price: 20 }, { name: "QQ芋球", price: 20 },
  { name: "銀絲卷", price: 20 }, { name: "燻乳銀絲卷", price: 25 }, { name: "梅子地瓜（大）", price: 50 },
  { name: "梅子地瓜（小）", price: 20 }, { name: "米腸", price: 20 }, { name: "花枝丸（大份）", price: 50 },
  { name: "花枝丸（小份）", price: 20 }, { name: "米血糕", price: 20 }, { name: "百頁豆腐", price: 20 },
  { name: "蘿蔔糕", price: 20 }, { name: "芋頭餅", price: 20 }, { name: "四季豆", price: 30 },
  { name: "杏包菇", price: 30 }, { name: "花椰菜", price: 30 }, { name: "鮮香菇", price: 30 },
  { name: "玉米筍", price: 30 }, { name: "炸茄子", price: 30 }
];

const drinksList = [
  { name: "冬瓜紅茶", price: 10 },
  { name: "泡沫綠茶", price: 10 },
  { name: "可樂", price: 20 },
  { name: "雪碧", price: 20 }
];

const comboList = [
  { name: "1號套餐：雞排 + 薯條 + 飲料", price: 120 },
  { name: "3號套餐：腿排 + 薯條 + 飲料", price: 120 }
];

/***** 本機紀錄 *****/
const loadOrders = () => JSON.parse(localStorage.getItem('orders') || '[]');
const saveOrders = (orders) => localStorage.setItem('orders', JSON.stringify(orders));

/***** Google Sheet API *****/
function sendToGoogleSheet(order) {
  const payload = new URLSearchParams(order);
  return fetch(googleScriptURL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: payload.toString()
  });
}

/***** UI *****/
function genRadio(list, containerId, groupName, onChange) {
  const host = document.getElementById(containerId);
  host.innerHTML = '';
  list.forEach((item, i) => {
    const label = document.createElement('label');
    label.className = 'inline';
    const input = Object.assign(document.createElement('input'), {
      type: 'radio', name: groupName, value: String(i)
    });
    if (onChange) input.addEventListener('change', onChange);
    label.append(input, `${item.name}（$${item.price}）`);
    host.appendChild(label);
  });
}

function buildFlavorSelect(id) {
  const sel = document.createElement('select');
  sel.id = id; sel.className = 'flavor-select';
  flavorList.forEach((f, idx) => {
    const opt = document.createElement('option');
    opt.value = String(idx);
    opt.textContent = f.name;
    sel.appendChild(opt);
  });
  return sel;
}

function genCheckboxSnacks() {
  const host = document.getElementById('snacks');
  host.innerHTML = '';
  snackList.forEach((item, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'snack-item';
    const cb = Object.assign(document.createElement('input'), {
      type: 'checkbox', name: 'snacks', value: String(i)
    });
    const label = document.createElement('label');
    label.textContent = `${item.name}（$${item.price}）`;
    const flavor = buildFlavorSelect(`snackFlavor-${i}`);
    flavor.disabled = true;
    cb.addEventListener('change', () => {
      flavor.disabled = !cb.checked;
    });
    wrap.append(cb, label, flavor);
    host.appendChild(wrap);
  });
}

/***** 計價 *****/
function calcTotal() {
  let total = 0;
  const mainIdx = document.querySelector('input[name="mainDish"]:checked')?.value;
  if (mainIdx !== undefined) total += mainDishList[Number(mainIdx)].price;

  document.querySelectorAll('input[name="snacks"]:checked').forEach(cb => {
    total += snackList[Number(cb.value)].price;
  });

  document.querySelectorAll('input[name="drinks"]:checked').forEach(cb => {
    total += drinksList[Number(cb.value)].price;
  });

  const combo = document.querySelector('input[name="combo"]:checked')?.value;
  if (combo !== undefined) total += comboList[Number(combo)].price;

  return total;
}

/***** 訂單渲染 *****/
function renderOrders() {
  const orders = loadOrders();
  const tbody = document.querySelector('#orderTable tbody');
  const tfoot = document.querySelector('#orderTable tfoot');
  tbody.innerHTML = '';
  let sum = 0;
  orders.forEach(o => {
    sum += Number(o.price);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${o.name}</td>
      <td>${o.main}</td>
      <td>${o.mainFlavor}</td>
      <td>${o.snacks}</td>
      <td>${o.drinks}</td>
      <td>${o.sugar}</td>
      <td>${o.ice}</td>
      <td>${o.combo}</td>
      <td>${o.comboFlavor}</td>
      <td>${o.price}</td>
      <td>${o.payMethod}</td>
      <td>${o.paid}</td>
      <td>${o.change}</td>
      <td>${o.paymentDone ? '✔' : ''}</td>
    `;
    tbody.appendChild(tr);
  });
  tfoot.innerHTML = `<tr><td colspan="9" style="text-align:right;">總金額合計：</td><td>${sum}</td><td colspan="4"></td></tr>`;
}

/***** 初始化 *****/
document.addEventListener('DOMContentLoaded', () => {
  genRadio(mainDishList, 'mainDish', 'mainDish', () => {});
  genCheckboxSnacks();
  genRadio(comboList, 'combo', 'combo', () => {});
  renderOrders();

  document.getElementById('orderForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.disabled = true; btn.textContent = '送出中…';

    const name = document.getElementById('name').value.trim();
    const mainIdx = document.querySelector('input[name="mainDish"]:checked')?.value;
    const mainName = mainIdx !== undefined ? mainDishList[Number(mainIdx)].name : '';
    const mainFlavorSel = document.getElementById('mainFlavor');
    const mainFlavor = mainFlavorSel ? flavorList[Number(mainFlavorSel.value)].name : '';

    const snackChecks = Array.from(document.querySelectorAll('input[name="snacks"]:checked'));
    const snackFlavorPairs = snackChecks.map(cb => {
      const i = Number(cb.value);
      const sel = document.getElementById(`snackFlavor-${i}`);
      const flv = sel ? flavorList[Number(sel.value)].name : '';
      return `${snackList[i].name}（${flv}）`;
    });

    const drinkNames = Array.from(document.querySelectorAll('input[name="drinks"]:checked'))
      .map(cb => drinksList[Number(cb.value)].name);
    const sugar = document.getElementById('drinkSugar').value;
    const ice = document.getElementById('drinkIce').value;

    const comboIdx = document.querySelector('input[name="combo"]:checked')?.value;
    const comboName = comboIdx !== undefined ? comboList[Number(comboIdx)].name : '';
    const comboFlavorSel = document.getElementById('comboFlavor');
    const comboFlavor = comboFlavorSel ? flavorList[Number(comboFlavorSel.value)].name : '';

    const price = calcTotal();
    const payMethod = document.getElementById('payMethod').value;
    const paid = document.getElementById('paidAmount').value || '';
    const change = document.getElementById('changeAmount').value || '';
    const paymentDone = document.getElementById('paymentDone').checked;

    const order = {
      timestamp: new Date().toISOString(),
      姓名: name,
      主餐: mainName,
      主餐口味: mainFlavor,
      點心: snackFlavorPairs.join('、'),
      飲料: drinkNames.join('、'),
      甜度: sugar,
      冰塊: ice,
      套餐: comboName,
      套餐口味: comboFlavor,
      金額: price,
      付款方式: payMethod,
      已付金額: paid,
      找零金額: change,
      狀態: paymentDone ? '完成' : '待找零'
    };

    const orders = loadOrders();
    orders.push({
      name, main: mainName, mainFlavor, snacks: snackFlavorPairs.join('、'),
      drinks: drinkNames.join('、'), sugar, ice, combo: comboName, comboFlavor,
      price, payMethod, paid, change, paymentDone
    });
    saveOrders(orders);
    renderOrders();

    await sendToGoogleSheet(order);

    e.target.reset();
    btn.disabled = false; btn.textContent = '送出訂單';
  });

  document.getElementById('clearOrders').addEventListener('click', () => {
    if (confirm('確定清除本機訂單？（不影響 Google Sheet）')) {
      localStorage.removeItem('orders');
      renderOrders();
    }
  });
});
