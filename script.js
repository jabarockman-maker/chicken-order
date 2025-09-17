// 你的 Google Apps Script Web App URL
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/你的ID/exec";

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

// 動態產生選項
function renderMenu() {
  const mainDiv = document.getElementById("mainDishes");
  mainDishes.forEach(d => {
    mainDiv.innerHTML += `
      <label>
        <input type="radio" name="mainDish" value="${d.name}" data-price="${d.price}">
        ${d.name} ($${d.price})
        <select class="flavorSelect" data-type="main">
          ${flavors.map(f => `<option>${f}</option>`).join("")}
        </select>
      </label><br>
    `;
  });

  const snackDiv = document.getElementById("snacks");
  snacks.forEach(s => {
    snackDiv.innerHTML += `
      <label>
        <input type="checkbox" name="snack" value="${s.name}" data-price="${s.price}">
        ${s.name} ($${s.price})
        <select class="flavorSelect" data-type="snack">
          ${flavors.map(f => `<option>${f}</option>`).join("")}
        </select>
      </label>
    `;
  });

  const drinkDiv = document.getElementById("drinks");
  drinks.forEach(dr => {
    drinkDiv.innerHTML += `
      <label>
        <input type="checkbox" name="drink" value="${dr.name}" data-price="${dr.price}">
        ${dr.name} ($${dr.price})
      </label>
    `;
  });

  const comboDiv = document.getElementById("combos");
  combos.forEach(c => {
    comboDiv.innerHTML += `
      <label>
        <input type="radio" name="combo" value="${c.name}" data-price="${c.price}">
        ${c.name} ($${c.price})
        <select class="comboFlavor">
          ${flavors.map(f => `<option>${f}</option>`).join("")}
        </select>
        <select class="comboDrink">
          <option value="">請選飲料</option>
          ${drinks.map(dr => `<option value="${dr.name}">${dr.name}</option>`).join("")}
        </select>
      </label><br>
    `;
  });
}
renderMenu();

// 訂單送出
document.getElementById("submitBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value.trim();
  if (!name) return alert("請輸入姓名！");

  let total = 0;
  let mainDish = "", mainFlavor = "";
  const selMain = document.querySelector("input[name='mainDish']:checked");
  if (selMain) {
    mainDish = selMain.value;
    mainFlavor = selMain.parentNode.querySelector(".flavorSelect").value;
    total += parseInt(selMain.dataset.price);
  }

  let snackList = [];
  document.querySelectorAll("input[name='snack']:checked").forEach(chk => {
    const flavor = chk.parentNode.querySelector(".flavorSelect").value;
    snackList.push(`${chk.value}(${flavor})`);
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
  const selCombo = document.querySelector("input[name='combo']:checked");
  if (selCombo) {
    combo = selCombo.value;
    comboFlavor = selCombo.parentNode.querySelector(".comboFlavor").value;
    comboDrink = selCombo.parentNode.querySelector(".comboDrink").value;
    if (!comboDrink) return alert("請選套餐飲料！");
    total += parseInt(selCombo.dataset.price);
  }

  const payMethod = document.getElementById("payMethod").value;
  const paid = parseInt(document.getElementById("paid").value) || 0;
  const change = paid - total;
  document.getElementById("change").value = change >= 0 ? change : 0;

  const now = new Date().toLocaleString();
  const payTime = payMethod !== "未付款" ? now : "";
  const changeTime = document.getElementById("changeDone").checked ? now : "";
  let status = "未付款";
  if (paid >= total && change >= 0) {
    status = document.getElementById("changeDone").checked ? "已付款並找零完成" : "已付款未找零";
  }

  // 本地表格新增一列
  const tbody = document.querySelector("#orderTable tbody");
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${name}</td>
    <td>${mainDish}</td>
    <td>${mainFlavor}</td>
    <td>${snackList.join(",")}</td>
    <td>${drinkList.join(",")}</td>
    <td>${sweetness}</td>
    <td>${ice}</td>
    <td>${combo}</td>
    <td>${comboFlavor}</td>
    <td>${comboDrink}</td>
    <td>${total}</td>
    <td>${payMethod}</td>
    <td>${paid}</td>
    <td>${change >= 0 ? change : "不足"}</td>
    <td>${payTime}</td>
    <td>${changeTime}</td>
    <td>${status}</td>
  `;
  tbody.appendChild(tr);

  // 傳到 Google Sheet (對應表頭)
  const data = {
    姓名: name,
    主餐: mainDish,
    主餐口味: mainFlavor,
    "點心+口味": snackList.join(","),
    飲料: drinkList.join(","),
    甜度: sweetness,
    冰塊: ice,
    套餐: combo,
    套餐口味: comboFlavor,
    套餐飲料: comboDrink,
    金額: total,
    付款方式: payMethod,
    已付金額: paid,
    找零金額: change >= 0 ? change : 0,
    付款時間: payTime,
    找零時間: changeTime,
    狀態: status
  };

  await fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: "POST",
    body: new URLSearchParams(data)
  });
});
