/***** Google Apps Script Web App URL *****/
const googleScriptURL =
  "https://script.google.com/macros/s/AKfycbwej-lW5ZQc7DFXJ-rEUqTnvLS-qYKgmVLLFZZ04OAMODkKhMZI93mWo_WXsxfy3EnL/exec";

/***** 菜單與價格 *****/
const mainDishList = [
  { name: "脆皮雞排", price: 85 },
  { name: "無骨雞塊", price: 70 },
  { name: "無骨雞腿排", price: 85 },
  { name: "鮮魷+白飯", price: 70 },
  { name: "無敵雞塊(大)", price: 120 }
];

const flavorList = [
  "（不選）","原味","胡椒","辣味","梅粉","綜合","特調","咖哩","海苔","起司"
];

const snackList = [
  { name: "柳葉魚", price: 39 },{ name: "脆皮七里香", price: 30 },{ name: "脆皮雞心", price: 30 },
  { name: "脆皮雞翅", price: 30 },{ name: "脆薯（大份）", price: 50 },{ name: "脆薯（小份）", price: 30 },
  { name: "貢丸", price: 30 },{ name: "噗波起司球", price: 30 },{ name: "起司條（2入）", price: 30 },
  { name: "美式洋蔥圈", price: 30 },{ name: "包心小湯圓", price: 30 },{ name: "甜不辣（大份）", price: 50 },
  { name: "甜不辣（小份）", price: 20 },{ name: "QQ地瓜球", price: 20 },{ name: "QQ芋球", price: 20 },
  { name: "銀絲卷", price: 20 },{ name: "燻乳銀絲卷", price: 25 },{ name: "梅子地瓜（大）", price: 50 },
  { name: "梅子地瓜（小）", price: 20 },{ name: "米腸", price: 20 },{ name: "花枝丸（大份）", price: 50 },
  { name: "花枝丸（小份）", price: 20 },{ name: "米血糕", price: 20 },{ name: "百頁豆腐", price: 20 },
  { name: "蘿蔔糕", price: 20 },{ name: "芋頭餅", price: 20 },{ name: "四季豆", price: 30 },
  { name: "杏包菇", price: 30 },{ name: "花椰菜", price: 30 },{ name: "鮮香菇", price: 30 },
  { name: "玉米筍", price: 30 },{ name: "炸茄子", price: 30 }
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
const loadOrders = () => JSON.parse(localStorage.getItem("orders") || "[]");
const saveOrders = (orders) => localStorage.setItem("orders", JSON.stringify(orders));

/***** UI產生 *****/
function genRadio(list, containerId, groupName, withFlavor = false) {
  const host = document.getElementById(containerId);
  host.innerHTML = "";
  list.forEach((item, i) => {
    const label = document.createElement("label");
    const input = Object.assign(document.createElement("input"), {
      type: "radio", name: groupName, value: String(i)
    });
    label.append(input, `${item.name}（$${item.price}）`);
    if (withFlavor) {
      const sel = buildFlavorSelect(`${groupName}Flavor-${i}`);
      sel.disabled = true;
      input.addEventListener("change", () => {
        document.querySelectorAll(`#${containerId} select`).forEach(s => s.disabled = true);
        sel.disabled = false;
      });
      label.appendChild(sel);
    }
    host.appendChild(label);
  });
}

function buildFlavorSelect(id) {
  const sel = document.createElement("select");
  sel.id = id;
  flavorList.forEach((f, idx) => {
    const opt = document.createElement("option");
    opt.value = f; opt.textContent = f;
    sel.appendChild(opt);
  });
  return sel;
}

function genCheckboxSnacks() {
  const host = document.getElementById("snacks");
  host.innerHTML = "";
  snackList.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "snack-item";
    const cb = Object.assign(document.createElement("input"), {
      type: "checkbox", name: "snacks", value: String(i)
    });
    const label = document.createElement("label");
    label.textContent = `${item.name}（$${item.price}）`;
    const sel = buildFlavorSelect(`snackFlavor-${i}`);
    sel.disabled = true;
    cb.addEventListener("change", () => sel.disabled = !cb.checked);
    div.append(cb, label, sel);
    host.appendChild(div);
  });
}

/***** 計價 *****/
function calcTotal() {
  let total = 0;
  const mainIdx = document.querySelector("input[name='mainDish']:checked")?.value;
  if (mainIdx !== undefined) total += mainDishList[Number(mainIdx)].price;

  document.querySelectorAll("input[name='snacks']:checked").forEach(cb => {
    total += snackList[Number(cb.value)].price;
  });

  document.querySelectorAll("input[name='drinks']:checked").forEach(cb => {
    total += drinksList[Number(cb.value)].price;
  });

  const comboIdx = document.querySelector("input[name='combo']:checked")?.value;
  if (comboIdx !== undefined) total += comboList[Number(comboIdx)].price;

  return total;
}
const updateTotal = () => document.getElementById("totalPrice").textContent = calcTotal();

/***** 寫入 Google Sheet *****/
function sendToGoogleSheet(order) {
  const payload = new URLSearchParams(order);
  return fetch(googleScriptURL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: payload.toString()
  });
}

/***** 初始化 *****/
document.addEventListener("DOMContentLoaded", () => {
  genRadio(mainDishList, "mainDish", "mainDish", true);
  genCheckboxSnacks();

  const drinksHost = document.getElementById("drinks");
  drinksList.forEach((d, i) => {
    const label = document.createElement("label");
    const cb = Object.assign(document.createElement("input"), { type: "checkbox", name: "drinks", value: String(i) });
    label.append(cb, `${d.name}（$${d.price}）`);
    drinksHost.appendChild(label);
  });

  genRadio(comboList, "combo", "combo", true);
  updateTotal();

  document.querySelectorAll("input,select").forEach(el => el.addEventListener("change", updateTotal));

  document.getElementById("orderForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    if (!name) return alert("請輸入姓名");

    const mainIdx = document.querySelector("input[name='mainDish']:checked")?.value;
    const mainName = mainIdx !== undefined ? mainDishList[Number(mainIdx)].name : "";
    const mainFlavor = mainIdx !== undefined ? document.getElementById(`mainDishFlavor-${mainIdx}`).value : "";

    const snacks = Array.from(document.querySelectorAll("input[name='snacks']:checked")).map(cb => {
      const sel = document.getElementById(`snackFlavor-${cb.value}`);
      return `${snackList[cb.value].name}（${sel.value}）`;
    });

    const drinks = Array.from(document.querySelectorAll("input[name='drinks']:checked")).map(cb => drinksList[cb.value].name);
    const sweetness = document.getElementById("sweetness").value;
    const ice = document.getElementById("ice").value;

    const comboIdx = document.querySelector("input[name='combo']:checked")?.value;
    const comboName = comboIdx !== undefined ? comboList[Number(comboIdx)].name : "";
    const comboFlavor = comboIdx !== undefined ? document.getElementById(`comboFlavor-${comboIdx}`).value : "";

    const price = calcTotal();
    const payMethod = document.getElementById("payMethod").value;
    const paidAmount = document.getElementById("paidAmount").value;
    const changeAmount = document.getElementById("changeAmount").value;
    const changeDone = document.getElementById("changeDone").checked ? "完成" : "未完成";

    const order = {
      timestamp: new Date().toLocaleString(),
      姓名: name,
      主餐: mainName,
      主餐口味: mainFlavor,
      "點心+口味": snacks.join("、"),
      飲料: drinks.join("、"),
      甜度: sweetness,
      冰塊: ice,
      套餐: comboName,
      套餐口味: comboFlavor,
      金額: price,
      付款方式: payMethod,
      已付: paidAmount,
      找零: changeAmount,
      付款狀態: changeDone
    };

    const orders = loadOrders();
    orders.push(order);
    saveOrders(orders);

    await sendToGoogleSheet(order);
    renderOrders();
    e.target.reset();
    updateTotal();
  });

  document.getElementById("clearOrders").addEventListener("click", () => {
    localStorage.removeItem("orders");
    renderOrders();
  });

  renderOrders();
});

function renderOrders() {
  const tbody = document.querySelector("#orderTable tbody");
  const tfoot = document.querySelector("#orderTable tfoot");
  tbody.innerHTML = "";
  let sum = 0;
  loadOrders().forEach(o => {
    sum += Number(o.金額);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${o.姓名}</td><td>${o.主餐}</td><td>${o.主餐口味}</td>
      <td>${o["點心+口味"]}</td><td>${o.飲料}</td><td>${o.甜度}</td>
      <td>${o.冰塊}</td><td>${o.套餐}</td><td>${o.套餐口味}</td>
      <td>${o.金額}</td><td>${o.付款方式}</td><td>${o.已付}</td>
      <td>${o.找零}</td><td>${o.付款狀態}</td>`;
    tbody.appendChild(tr);
  });
  tfoot.innerHTML = `<tr><td colspan="9">總金額合計</td><td>${sum}</td><td colspan="4"></td></tr>`;
}
