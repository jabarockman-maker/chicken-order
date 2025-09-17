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
/***** 你的 Google Apps Script Web App URL（/exec） *****/
const googleScriptURL =
  'https://script.google.com/macros/s/AKfycbyrA_MVNiHvIlQ0nI-Dh1_ta3LlaDaqg5hLl23qXuQgT3fszsaPpyILSItrmceJ5tT3/exec';

/***** 菜單與價格（口味皆不加價，含海苔、起司） *****/
const mainDishList = [
  { name: "脆皮雞排", price: 85 },
  { name: "無骨雞塊", price: 70 },
  { name: "無骨雞腿排", price: 85 },
  { name: "鮮蝦+白飯", price: 70 },
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

/***** 本機紀錄（讓頁面可看歷史） *****/
const loadOrders = () => JSON.parse(localStorage.getItem('orders') || '[]');
const saveOrders = (orders) => localStorage.setItem('orders', JSON.stringify(orders));

/***** UI 產生 *****/
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
    opt.textContent = f.name; // 不顯示加價
    sel.appendChild(opt);
  });
  sel.addEventListener('change', updateTotal);
  return sel;
}

function showMainFlavor() {
  const host = document.getElementById('mainFlavorHost');
  host.innerHTML = '';
  const selected = document.querySelector('input[name="mainDish"]:checked');
  if (!selected) return; // 口味可不選
  const box = document.createElement('div');
  box.className = 'inline';
  const label = document.createElement('label');
  label.textContent = '主餐口味：';
  const sel = buildFlavorSelect('mainFlavor');
  box.append(label, sel);
  host.appendChild(box);
  sel.focus();
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
      updateTotal();
      if (!flavor.disabled) flavor.focus();
    });
    wrap.append(cb, label, flavor);
    host.appendChild(wrap);
  });
}

/***** 計價（口味 0 元，不影響總額） *****/
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
const updateTotal = () => document.getElementById('totalPrice').textContent = calcTotal();

/***** 訂單表格渲染 *****/
function renderOrders() {
  const orders = loadOrders();
  const tbody = document.querySelector('#orderTable tbody');
  const tfoot = document.querySelector('#orderTable tfoot');
  tbody.innerHTML = '';
  let sum = 0;
  orders.forEach(o => {
    sum += o.price;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${o.name}</td>
      <td>${o.main}</td>
      <td>${o.mainFlavor || ''}</td>
      <td>${o.snacksWithFlavors || ''}</td>
      <td>${o.drinks || ''}</td>
      <td>${o.combo || ''}</td>
      <td>${o.price}</td>
    `;
    tbody.appendChild(tr);
  });
  tfoot.innerHTML = `<tr><td colspan="6" style="text-align:right;">總金額合計：</td><td>${sum}</td></tr>`;
}

/***** 初始化 *****/
document.addEventListener('DOMContentLoaded', () => {
  genRadio(mainDishList, 'mainDish', 'mainDish', () => { showMainFlavor(); updateTotal(); });

  const drinksHost = document.getElementById('drinks');
  drinksList.forEach((d, i) => {
    const label = document.createElement('label');
    const cb = Object.assign(document.createElement('input'), { type:'checkbox', name:'drinks', value:String(i) });
    cb.addEventListener('change', updateTotal);
    label.append(cb, `${d.name}（$${d.price}）`);
    drinksHost.appendChild(label);
  });

  genCheckboxSnacks();
  genRadio(comboList, 'combo', 'combo', updateTotal);

  renderOrders();
  updateTotal();

  document.getElementById('clearOrders').addEventListener('click', () => {
    if (confirm('確定清除本機訂單列表？（不會刪 Google Sheet）')) {
      localStorage.removeItem('orders');
      renderOrders();
    }
  });

  document.getElementById('orderForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('submitBtn');
    btn.disabled = true; btn.textContent = '送出中…';

    const name = document.getElementById('name').value.trim();
    if (!name) { alert('請輸入姓名'); btn.disabled=false; btn.textContent='送出訂單'; return; }

    const mainIdx = document.querySelector('input[name="mainDish"]:checked')?.value;
    const mainName = mainIdx !== undefined ? mainDishList[Number(mainIdx)].name : '';

    const mainFlavorSel = document.getElementById('mainFlavor');
    const mainFlavor = mainFlavorSel ? flavorList[Number(mainFlavorSel.value)].name : '';

    const snackChecks = Array.from(document.querySelectorAll('input[name="snacks"]:checked'));
    const snackFlavorPairs = snackChecks.map(cb => {
      const i = Number(cb.value);
      const sel = document.getElementById(`snackFlavor-${i}`);
      const flv = sel ? flavorList[Number(sel.value)].name : '';
      return flv ? `${snackList[i].name}（${flv}）` : snackList[i].name;
    });

    const drinkNames = Array.from(document.querySelectorAll('input[name="drinks"]:checked'))
      .map(cb => drinksList[Number(cb.value)].name);

    const comboIdx = document.querySelector('input[name="combo"]:checked')?.value;
    const comboName = comboIdx !== undefined ? comboList[Number(comboIdx)].name : '';

    const price = calcTotal();

    // —— 本機顯示 —— 
    const orders = loadOrders();
    orders.push({
      name,
      main: mainName,
      mainFlavor,
      snacksWithFlavors: snackFlavorPairs.join('、'),
      drinks: drinkNames.join('、'),
      combo: comboName,
      price
    });
    saveOrders(orders);
    renderOrders();

    // —— 寫入 Google Sheet（URL-encoded） —— 
    const payload = new URLSearchParams();
    payload.set('timestamp', new Date().toISOString());
    payload.set('姓名', name || '');
    payload.set('主餐', mainName || '');
    payload.set('口味', mainFlavor || '');
    payload.set('點心', (snackFlavorPairs.join(', ') || ''));
    payload.set('飲料', (drinkNames.join(', ') || ''));
    payload.set('套餐', comboName || '');
    payload.set('金額', String(price || 0));

    try {
      await fetch(googleScriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: payload.toString()
      });
      // alert('已記錄到 Google Sheet！');
    } catch (err) {
      console.error('送 Sheets 失敗：', err);
      // alert('寫入失敗，請稍後再試');
    }

    // 重設表單
    e.target.reset();
    document.getElementById('mainFlavorHost').innerHTML = '';
    updateTotal();

    btn.disabled = false; btn.textContent = '送出訂單';
  });
});

