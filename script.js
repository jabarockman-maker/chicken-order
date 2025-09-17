// Google Apps Script Web App URL
const GOOGLE_APPS_SCRIPT_URL = "你的 Web App URL/exec";

// 菜單資料
const mainDishes = [
  { name: "脆皮雞排", price: 85 },
  { name: "無骨雞塊", price: 70 },
  { name: "無骨雞腿排", price: 85 },
  { name: "鮮魷-白", price: 70 },
  { name: "無敵雞塊(大)", price: 120 }
];

const snacks = [
  { name: "柳葉魚", price: 39 },
  { name: "脆皮七里香", price: 30 },
  { name: "脆皮雞心", price: 30 },
  { name: "脆皮雞翅", price: 30 },
  { name: "脆薯(大份)", price: 50 },
  { name: "脆薯(小份)", price: 30 },
  { name: "貢丸", price: 30 },
  { name: "噴波起司球", price: 30 },
  { name: "起司條(2入)", price: 30 },
  { name: "美式洋蔥圈", price: 30 },
  { name: "包心小湯圓", price: 30 },
  { name: "甜不辣(大份)", price: 50 },
  { name: "甜不辣(小份)", price: 20 },
  { name: "QQ地瓜球", price: 20 },
  { name: "QQ芋球", price: 20 },
  { name: "銀絲卷", price: 20 },
  { name: "煉乳銀絲卷", price: 25 },
  { name: "梅子地瓜(大)", price: 50 },
  { name: "梅子地瓜(小)", price: 20 },
  { name: "米腸", price: 20 },
  { name: "花枝丸(大份)", price: 50 },
  { name: "花枝丸(小份)", price: 20 },
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

const drinks = [
  { name: "冬瓜紅茶", price: 10 },
  { name: "泡沫綠茶", price: 10 },
  { name: "可樂", price: 20 },
  { name: "雪碧", price: 20 }
];

const combos = [
  { name: "1號套餐：雞排+薯條+飲料", price: 120 },
  { name: "3號套餐：腿排+薯條+飲料", price: 120 }
];

const flavors = ["不選", "原味", "胡椒", "辣味", "梅粉", "綜合", "特調", "咖哩", "海苔", "起司"];

// 動態生成菜單
function renderMenu() {
  const mainDiv = document.getElementById("mainDishes");
  mainDishes.forEach((item, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <label>
        <input type="radio" name="mainDish" value="${item.name}" data-price="${item.price}">
        ${item.name} ($${item.price})
        <select class="flavorSelect" data-type="main">
          ${flavors.map(f => `<option value="${f}">${f}</option>`).join("")}
        </select>
      </label>
    `;
    mainDiv.appendChild(div);
  });

  const snackDiv = document.getElementById("snacks");
  snacks.forEach(item => {
    const div = document.createElement("div");
    div.innerHTML = `
      <label>
        <input type="checkbox" name="snack" value="${item.name}" data-price="${item.price}">
        ${item.name} ($${item.price})
        <select class="flavorSelect" data-type="snack">
          ${flavors.map(f => `<option value="${f}">${f}</option>`).join("")}
        </select>
      </label>
    `;
    snackDiv.appendChild(div);
  });

  const drinkDiv = document.getElementById("drinks");
  drinks.forEach(item => {
    const div = document.createElement("div");
    div.innerHTML = `
      <label>
        <input type="checkbox" name="drink" value="${item.name}" data-price="${item.price}">
        ${item.name} ($${item.price})
      </label>
    `;
    drinkDiv.appendChild(div);
  });

  const comboDiv = document.getElementById("combos");
  combos.forEach(item => {
    const div = document.createElement("div");
    div.innerHTML = `
      <label>
        <input type="radio" name="combo" value="${item.name}" data-price="${item.price}">
        ${item.name} ($${item.price})
        <select class="flavorSelect" data-type="combo">
          ${flavors.map(f => `<option value="${f}">${f}</option>`).join("")}
        </select>
        <select class="comboDrinkSelect">
          <option value="">請選擇飲料</option>
          ${drinks.map(d => `<option value="${d.name}">${d.name}</option>`).join("")}
        </select>
      </label>
    `;
    comboDiv.appendChild(div);
  });
}

renderMenu();

// 金額計算 + 提交
document.getElementById("submitBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value.trim();
  if (!name) return alert("請輸入姓名");

  let total = 0;
  let mainDish = "", mainFlavor = "";
  const selectedMain = document.querySelector("input[name='mainDish']:checked");
  if (selectedMain) {
    mainDish = selectedMain.value;
    mainFlavor = selectedMain.parentNode.querySelector(".flavorSelect").value;
    total += parseInt(selectedMain.dataset.price);
  }

  let snackList = [];
  document.querySelectorAll("input[name='snack']:checked").forEach(chk => {
    const flavor = chk.parentNode.querySelector(".flavorSelect").value;
    snackList.push(`${chk.value} (${flavor})`);
    total += parseInt(chk.dataset.price);
  });

  let drinkList = [];
  document.querySelectorAll("input[name='drink']:checked").forEach(chk => {
    drinkList.push(chk.value);
    total += parseInt(chk.dataset.price);
  });

  const sweetness = document.getElementById("sweetness").value;
  const ice = document.getElementById("ice").value;

  let combo = "", comboFlavor = "", comboDrink = "";
  const selectedCombo = document.querySelector("input[name='combo']:checked");
  if (selectedCombo) {
    combo = selectedCombo.value;
    comboFlavor = selectedCombo.parentNode.querySelector(".flavorSelect").value;
    comboDrink = selectedCombo.parentNode.querySelector(".comboDrinkSelect").value;
    if (!comboDrink) return alert("請選擇套餐飲料！");
    total += parseInt(selectedCombo.dataset.price);
  }

  const payMethod = document.getElementById("payMethod").value;
  const paid = parseInt(document.getElementById("paid").value) || 0;
  const change = paid - total;
  document.getElementById("change").value = change >= 0 ? change : 0;

  const now = new Date();
  const payTime = payMethod !== "未付款" ? now.toLocaleString() : "";
  const changeTime = document.getElementById("changeDone").checked ? now.toLocaleString() : "";
  const status = change >= 0 ? "完成" : "待付款";

  // 新增到表格
  const tbody = document.querySelector("#orderTable tbody");
  const row = tbody.insertRow();
  row.innerHTML = `
    <td>${name}</td>
    <td>${mainDish}</td>
    <td>${mainFlavor}</td>
    <td>${snackList.join(",")}</td>
    <td>${drinkList.join(",")}</td>
    <td>${sweetness}</td>
    <td>${ice}</td>
    <td>${combo}</td>
    <td>${comboFlavor} ${comboDrink}</td>
    <td>${total}</td>
    <td>${payMethod}</td>
    <td>${paid}</td>
    <td>${change >= 0 ? change : "不足"}</td>
    <td>${payTime}</td>
    <td>${changeTime}</td>
    <td>${status}</td>
  `;

  // 寫入 Google Sheet
  await fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: "POST",
    body: new URLSearchParams({
      name, mainDish, mainFlavor,
      snacks: snackList.join(","),
      drinks: drinkList.join(","),
      sweetness, ice, combo, comboFlavor, comboDrink,
      total, payMethod, paid, change, payTime, changeTime, status
    })
  });
});
