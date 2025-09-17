/***** Google Apps Script Web App URL *****/
const googleScriptURL =
  'https://script.google.com/macros/s/AKfycbwej-lW5ZQc7DFXJ-rEUqTnvLS-qYKgmVLLFZZ04OAMODkKhMZI93mWo_WXsxfy3EnL/exec';

/***** 菜單與價格 *****/
const mainDishList = [
  { name: "脆皮雞排", price: 85 },
  { name: "無骨雞塊", price: 70 },
  { name: "無骨雞腿排", price: 85 },
  { name: "鮮蝦+白飯", price: 70 },
  { name: "無敵雞塊(大)", price: 120 }
];

const flavorList = ["（不選）","原味","胡椒","辣味","梅粉","綜合","特調","咖哩","海苔","起司"];

const snackList = [
  { name: "柳葉魚", price: 39 }, { name: "脆皮七里香", price: 30 },
  { name: "脆皮雞心", price: 30 }, { name: "脆皮雞翅", price: 30 },
  { name: "脆薯（大份）", price: 50 }, { name: "脆薯（小份）", price: 30 },
  { name: "貢丸", price: 30 }, { name: "噗波起司球", price: 30 }
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

/***** UI 建立 *****/
function genRadio(list, containerId, groupName, withFlavor) {
  const host = document.getElementById(containerId);
  host.innerHTML = '';
  list.forEach((item, i) => {
    const label = document.createElement('label');
    const input = Object.assign(document.createElement('input'), {
      type: 'radio', name: groupName, value: String(i)
    });
    label.append(input, `${item.name}（$${item.price}）`);
    host.appendChild(label);

    if (withFlavor) {
      const sel = buildFlavorSelect(`${groupName}Flavor-${i}`);
      sel.disabled = true;
      input.addEventListener('change', () => {
        document.querySelectorAll(`#${containerId} select`).forEach(s => s.disabled = true);
        sel.disabled = false;
      });
      host.appendChild(sel);
    }
  });
}

function buildFlavorSelect(id) {
  const sel = document.createElement('select');
  sel.id = id;
  flavorList.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f;
    opt.textContent = f;
    sel.appendChild(opt);
  });
  return sel;
}

function genCheckboxSnacks() {
  const host = document.getElementById('snacks');
  host.innerHTML = '';
  snackList.forEach((item, i) => {
    const wrap = document.createElement('div');
    const cb = Object.assign(document.createElement('input'), {
      type: 'checkbox', name: 'snacks', value: String(i)
    });
    const label = document.createElement('label');
    label.textContent = `${item.name}（$${item.price}）`;
    const flavor = buildFlavorSelect(`snackFlavor-${i}`);
    flavor.disabled = true;
    cb.addEventListener('change', () => flavor.disabled = !cb.checked);
    wrap.append(cb, label, flavor);
    host.appendChild(wrap);
  });
}

/***** 計價 *****/
function calcTotal() {
  let total = 0;
  const main = document.querySelector('input[name="mainDish"]:checked');
  if (main) total += mainDishList[Number(main.value)].price;

  document.querySelectorAll('input[name="snacks"]:checked').forEach(cb => {
    total += snackList[Number(cb.value)].price;
  });

  document.querySelectorAll('input[name="drinks"]:checked').forEach(cb => {
    total += drinksList[Number(cb.value)].price;
  });

  const combo = document.querySelector('input[name="combo"]:checked');
  if (combo) total += comboList[Number(combo.value)].price;

  return total;
}
const updateTotal = () => document.getElementById('totalPrice').textContent = calcTotal();

/***** Google Sheet 送出 *****/
function sendToGoogleSheet(order) {
  const payload = new URLSearchParams();
  payload.set('timestamp', new Date().toISOString());
  Object.entries(order).forEach(([k,v]) => payload.set(k,v));
  return fetch(googleScriptURL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: payload.toString()
  });
}

/***** 訂單渲染 *****/
function renderOrders() {
  const orders = loadOrders();
  const tbody = document.querySelector('#orderTable tbody');
  const tfoot = document.querySelector('#orderTable tfoot');
  tbody.innerHTML = '';
  let sum = 0;

  orders.forEach((o, idx) => {
    sum += Number(o['金額']);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${o['姓名']}</td>
      <td>${o['主餐']}</td>
      <td>${o['主餐口味']}</td>
      <td>${o['點心+口味']}</td>
      <td>${o['飲料']}</td>
      <td>${o['甜度']}</td>
      <td>${o['冰塊']}</td>
      <td>${o['套餐']}</td>
      <td>${o['套餐口味']}</td>
      <td>${o['金額']}</td>
      <td><input type="checkbox" ${o.paid ? 'checked' : ''} 
        onchange="togglePaid(${idx}, this.checked)" /></td>`;
    tbody.appendChild(tr);
  });
  tfoot.innerHTML = `<tr><td colspan="9" style="text-align:right;">總金額合計：</td><td>${sum}</td><td></td></tr>`;
}

function togglePaid(idx, checked) {
  const orders = loadOrders();
  orders[idx].paid = checked;
  orders[idx].paidTime = checked ? new Date().toLocaleString() : '';
  saveOrders(orders);
  renderOrders();
}

/***** 初始化 *****/
document.addEventListener('DOMContentLoaded', () => {
  genRadio(mainDishList, 'mainDish', 'mainDish', true);
  genCheckboxSnacks();
  genRadio(comboList, 'combo', 'combo', true);

  const drinksHost = document.getElementById('drinks');
  drinksList.forEach((d, i) => {
    const label = document.createElement('label');
    const cb = Object.assign(document.createElement('input'), {
      type:'checkbox', name:'drinks', value:String(i)
    });
    cb.addEventListener('change', updateTotal);
    label.append(cb, `${d.name}（$${d.price}）`);
    drinksHost.appendChild(label);
  });

  renderOrders();
  updateTotal();

  document.getElementById('clearOrders').addEventListener('click', () => {
    if (confirm('確定清除？')) {
      localStorage.removeItem('orders');
      renderOrders();
    }
  });

  document.getElementById('orderForm').addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    if (!name) return alert('請輸入姓名');

    const mainIdx = document.querySelector('input[name="mainDish"]:checked')?.value;
    const mainName = mainIdx ? mainDishList[mainIdx].name : '';
    const mainFlavorSel = document.querySelector(`#mainDishFlavor-${mainIdx}`);
    const mainFlavor = mainFlavorSel ? mainFlavorSel.value : '';

    const snacks = Array.from(document.querySelectorAll('input[name="snacks"]:checked')).map(cb => {
      const sel = document.getElementById(`snackFlavor-${cb.value}`);
      return snackList[cb.value].name + (sel ? `（${sel.value}）` : '');
    });

    const drinks = Array.from(document.querySelectorAll('input[name="drinks"]:checked')).map(cb => drinksList[cb.value].name);
    const sugar = document.getElementById('sugarLevel').value;
    const ice = document.getElementById('iceLevel').value;

    const comboIdx = document.querySelector('input[name="combo"]:checked')?.value;
    const comboName = comboIdx ? comboList[comboIdx].name : '';
    const comboFlavorSel = document.querySelector(`#comboFlavor-${comboIdx}`);
    const comboFlavor = comboFlavorSel ? comboFlavorSel.value : '';

    const price = calcTotal();

    const order = {
      '姓名': name,
      '主餐': mainName,
      '主餐口味': mainFlavor,
      '點心+口味': snacks.join('、'),
      '飲料': drinks.join('、'),
      '甜度': sugar,
      '冰塊': ice,
      '套餐': comboName,
      '套餐口味': comboFlavor,
      '金額': price
    };

    const orders = loadOrders();
    orders.push(order);
    saveOrders(orders);
    renderOrders();

    await sendToGoogleSheet(order);

    e.target.reset();
    updateTotal();
  });
});
