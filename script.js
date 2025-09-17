// Google Apps Script Web App URL
const googleScriptURL =
  'https://script.google.com/macros/s/AKfycbyrA_MVNiHvIlQ0nI-Dh1_ta3LlaDaqg5hLl23qXuQgT3fszsaPpyILSItrmceJ5tT3/exec';

// 菜單
const mainDishList = [
  { name: "脆皮雞排", price: 85 },
  { name: "無骨雞塊", price: 70 },
  { name: "無骨雞腿排", price: 85 },
  { name: "鮮蝦+白飯", price: 70 },
  { name: "無敵雞塊(大)", price: 120 }
];

const flavorList = ["（不選）","原味","胡椒","辣味","梅粉","綜合","特調","咖哩","海苔","起司"];

const snackList = [
  { name: "柳葉魚", price: 39 },
  { name: "脆皮七里香", price: 30 },
  { name: "脆皮雞心", price: 30 },
  { name: "脆皮雞翅", price: 30 },
  { name: "脆薯（大份）", price: 50 },
  { name: "脆薯（小份）", price: 30 },
  { name: "貢丸", price: 30 },
  { name: "噗波起司球", price: 30 },
  { name: "起司條（2入）", price: 30 },
  { name: "美式洋蔥圈", price: 30 },
  { name: "包心小湯圓", price: 30 },
  { name: "甜不辣（大份）", price: 50 },
  { name: "甜不辣（小份）", price: 20 },
  { name: "QQ地瓜球", price: 20 },
  { name: "QQ芋球", price: 20 },
  { name: "銀絲卷", price: 20 },
  { name: "燻乳銀絲卷", price: 25 },
  { name: "梅子地瓜（大）", price: 50 },
  { name: "梅子地瓜（小）", price: 20 },
  { name: "米腸", price: 20 },
  { name: "花枝丸（大份）", price: 50 },
  { name: "花枝丸（小份）", price: 20 },
  { name: "米血糕", price: 20 },
  { name: "百頁豆腐", price: 20 },
  { name: "蘿蔔糕", price: 20 },
  { name: "芋頭餅", price: 20 },
  { name: "四季豆", price: 30 },
  { name: "杏包菇", price: 30 },
  { name: "花椰菜", price: 30 },
  { name: "鮮香菇", price: 30 },
  { name: "玉米筍", price: 30 },
  { name: "炸茄子", price: 30 }
];

const drinksList = [
  { name: "冬瓜紅茶", price: 10 },
  { name: "泡沫綠茶", price: 10 },
  { name: "可樂", price: 20 },
  { name: "雪碧", price: 20 }
];

const comboList = [
  { name: "1號套餐：雞排+薯條+飲料", price: 120 },
  { name: "3號套餐：腿排+薯條+飲料", price: 120 }
];

// 本機存取
const loadOrders = () => JSON.parse(localStorage.getItem('orders') || '[]');
const saveOrders = (orders) => localStorage.setItem('orders', JSON.stringify(orders));

// 生成 UI
function genRadio(list, containerId, groupName) {
  const host = document.getElementById(containerId);
  host.innerHTML = '';
  list.forEach((item, i) => {
    const label = document.createElement('label');
    const input = Object.assign(document.createElement('input'), {
      type: 'radio', name: groupName, value: i
    });
    input.addEventListener('change', updateTotal);
    label.append(input, `${item.name} ($${item.price})`);
    host.appendChild(label);
  });
}

function genCheckbox(list, containerId, groupName, withFlavor=false) {
  const host = document.getElementById(containerId);
  host.innerHTML = '';
  list.forEach((item, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'snack-item';
    const cb = Object.assign(document.createElement('input'), {
      type: 'checkbox', name: groupName, value: i
    });
    const label = document.createElement('label');
    label.textContent = `${item.name} ($${item.price})`;
    wrap.append(cb, label);
    if (withFlavor) {
      const sel = document.createElement('select');
      flavorList.forEach(f => {
        const opt = document.createElement('option');
        opt.textContent = f; opt.value = f;
        sel.appendChild(opt);
      });
      sel.disabled = true;
      cb.addEventListener('change', ()=>{ sel.disabled = !cb.checked; updateTotal(); });
      wrap.appendChild(sel);
    }
    host.appendChild(wrap);
  });
}

function calcTotal() {
  let total = 0;
  const main = document.querySelector('input[name="mainDish"]:checked');
  if (main) total += mainDishList[main.value].price;

  document.querySelectorAll('#snacks input[type="checkbox"]:checked').forEach(cb=>{
    total += snackList[cb.value].price;
  });

  document.querySelectorAll('#drinks input[type="checkbox"]:checked').forEach(cb=>{
    total += drinksList[cb.value].price;
  });

  const combo = document.querySelector('input[name="combo"]:checked');
  if (combo) total += comboList[combo.value].price;

  return total;
}
function updateTotal(){ document.getElementById('totalPrice').textContent = calcTotal(); }

function renderOrders() {
  const tbody = document.querySelector('#orderTable tbody');
  const tfoot = document.querySelector('#orderTable tfoot');
  tbody.innerHTML = '';
  let sum=0;
  loadOrders().forEach(o=>{
    sum+=o.price;
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${o.name}</td><td>${o.main}</td><td>${o.mainFlavor}</td>
      <td>${o.snacks}</td><td>${o.drinks}</td><td>${o.combo}</td><td>${o.price}</td>`;
    tbody.appendChild(tr);
  });
  tfoot.innerHTML=`<tr><td colspan="6" style="text-align:right;">總金額合計：</td><td>${sum}</td></tr>`;
}

// 初始化
document.addEventListener('DOMContentLoaded', ()=>{
  genRadio(mainDishList,'mainDish','mainDish');
  genCheckbox(snackList,'snacks','snacks',true);
  genCheckbox(drinksList,'drinks','drinks');
  genRadio(comboList,'combo','combo');
  updateTotal(); renderOrders();

  document.getElementById('orderForm').addEventListener('submit',async e=>{
    e.preventDefault();
    const btn=document.getElementById('submitBtn');
    btn.disabled=true; btn.textContent='送出中…';

    const name=document.getElementById('name').value.trim();
    if(!name){ alert('請輸入姓名'); btn.disabled=false; btn.textContent='送出訂單'; return; }

    const main=document.querySelector('input[name="mainDish"]:checked');
    const mainName=main?mainDishList[main.value].name:'';
    let mainFlavor='';
    if(main){
      const sel=document.querySelector('#mainDish select');
      if(sel) mainFlavor=sel.value;
    }

    const snacks=Array.from(document.querySelectorAll('#snacks input[type="checkbox"]:checked'))
      .map(cb=>{
        const sel=cb.parentNode.querySelector('select');
        return sel?`${snackList[cb.value].name}（${sel.value}）`:snackList[cb.value].name;
      });

    const drinks=Array.from(document.querySelectorAll('#drinks input[type="checkbox"]:checked'))
      .map(cb=>drinksList[cb.value].name);

    const combo=document.querySelector('input[name="combo"]:checked');
    const comboName=combo?comboList[combo.value].name:'';

    const price=calcTotal();

    // 存本機
    const orders=loadOrders();
    orders.push({name,main:mainName,mainFlavor,snacks:snacks.join('、'),
                 drinks:drinks.join('、'),combo:comboName,price});
    saveOrders(orders); renderOrders();

    // 存 Google Sheet
    const payload=new URLSearchParams();
    payload.set('timestamp',new Date().toISOString());
    payload.set('姓名',name);
    payload.set('主餐',mainName);
    payload.set('口味',mainFlavor);
    payload.set('點心',snacks.join(', '));
    payload.set('飲料',drinks.join(', '));
    payload.set('套餐',comboName);
    payload.set('金額',String(price));

    try{
      await fetch(googleScriptURL,{method:'POST',mode:'no-cors',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},body:payload.toString()});
    }catch(err){ console.error(err); }

    e.target.reset(); updateTotal();
    btn.disabled=false; btn.textContent='送出訂單';
  });

  document.getElementById('clearOrders').addEventListener('click',()=>{
    localStorage.removeItem('orders'); renderOrders();
  });
});
