// Google Apps Script Web App URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyrA_MVNiHvIlQ0nI-Dh1_ta3LlaDaqg5hLl23qXuQgT3fszsaPpyILSItrmceJ5tT3/exec";

// 菜單資料
const mains = [
  { name: "脆皮雞排", price: 85 },
  { name: "無骨雞塊", price: 70 },
  { name: "無骨雞腿排", price: 85 },
  { name: "鮮魷+白", price: 70 },
  { name: "無敵雞塊(大)", price: 120 }
];

const sides = [
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
  { name: "銀絲卷", price: 20 },
  { name: "煉乳銀絲卷", price: 25 },
  { name: "梅子地瓜(大)", price: 50 },
  { name: "梅子地瓜(小)", price: 20 },
  { name: "米腸", price: 20 },
  { name: "花枝丸(大份)", price: 50 },
  { name: "花枝丸(小份)", price: 20 },
  { name: "米血糕", price: 20 },
  { name: "百頁豆腐", price: 20 },
  { name: "薯薯條", price: 20 },
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

const sets = [
  { name: "1號套餐：雞排+薯條+飲料", price: 120 },
  { name: "3號套餐：腿排+薯條+飲料", price: 120 }
];

// 口味選項
const flavors = ["不選", "原味", "胡椒", "辣味", "梅粉", "綜合", "特調", "咖哩", "海苔", "起司"];

// 渲染
function renderOptions() {
  const mainsDiv = document.getElementById("mains");
  mains.forEach((item, idx) => {
    mainsDiv.innerHTML += `
      <div>
        <label>
          <input type="radio" name="main" value="${item.name}" data-price="${item.price}">
          ${item.name} ($${item.price})
        </label>
        <select name="mainFlavor-${idx}">
          ${flavors.map(f => `<option value="${f}">${f}</option>`).join("")}
        </select>
      </div>
    `;
  });

  const sidesDiv = document.getElementById("sides");
  sides.forEach((item, idx) => {
    sidesDiv.innerHTML += `
      <div>
        <label>
          <input type="checkbox" name="side" value="${item.name}" data-price="${item.price}">
          ${item.name} ($${item.price})
        </label>
        <select name="sideFlavor-${idx}">
          ${flavors.map(f => `<option value="${f}">${f}</option>`).join("")}
        </select>
      </div>
    `;
  });

  const drinksDiv = document.getElementById("drinks");
  drinks.forEach(item => {
    drinksDiv.innerHTML += `
      <div>
        <label>
          <input type="checkbox" name="drink" value="${item.name}" data-price="${item.price}">
          ${item.name} ($${item.price})
        </label>
      </div>
    `;
  });

  const setsDiv = document.getElementById("sets");
  sets.forEach((item, idx) => {
    setsDiv.innerHTML += `
      <div>
        <label>
          <input type="radio" name="set" value="${item.name}" data-price="${item.price}">
          ${item.name} ($${item.price})
        </label>
        <select name="setDrink-${idx}">
          <option value="">請選飲料</option>
          ${drinks.map(d => `<option value="${d.name}">${d.name}</option>`).join("")}
        </select>
      </div>
    `;
  });
}

// 計算金額
function calcTotal() {
  let total = 0;
  document.querySelectorAll("input[type=radio]:checked, input[type=checkbox]:checked")
    .forEach(el => total += parseInt(el.dataset.price));
  document.getElementById("total").innerText = total;
  return total;
}

// 收集訂單
function collectOrder() {
  const name = document.getElementById("name").value.trim();
  if (!name) {
    alert("請輸入姓名！");
    return null;
  }

  let main = "", mainFlavor = "";
  document.querySelectorAll("input[name=main]").forEach((el, idx) => {
    if (el.checked) {
      main = el.value;
      mainFlavor = document.querySelector(`select[name=mainFlavor-${idx}]`).value;
    }
  });

  let sidesArr = [];
  document.querySelectorAll("input[name=side]").forEach((el, idx) => {
    if (el.checked) {
      const flavor = document.querySelector(`select[name=sideFlavor-${idx}]`).value;
      sidesArr.push(`${el.value} (${flavor})`);
    }
  });

  let drinksArr = [];
  document.querySelectorAll("input[name=drink]").forEach(el => {
    if (el.checked) drinksArr.push(el.value);
  });

  const sugar = document.getElementById("sugar").value;
  const ice = document.getElementById("ice").value;

  let set = "", setDrink = "";
  document.querySelectorAll("input[name=set]").forEach((el, idx) => {
    if (el.checked) {
      set = el.value;
      setDrink = document.querySelector(`select[name=setDrink-${idx}]`).value;
      if (!setDrink) {
        alert("套餐必須選飲料！");
        set = "";
      }
    }
  });

  const total = calcTotal();

  return {
    name, main, mainFlavor,
    sides: sidesArr.join(", "),
    drinks: drinksArr.join(", "),
    sugar, ice, set, setDrink, total
  };
}

// 顯示表格
function appendOrderRow(order) {
  const tbody = document.querySelector("#orderTable tbody");
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${order.name}</td>
    <td>${order.main}</td>
    <td>${order.mainFlavor}</td>
    <td>${order.sides}</td>
    <td>${order.drinks}</td>
    <td>${order.sugar}</td>
    <td>${order.ice}</td>
    <td>${order.set}</td>
    <td>${order.setDrink}</td>
    <td>${order.total}</td>
  `;
  tbody.appendChild(tr);
}

// 寫入 Google Sheet
function sendToSheet(order) {
  const data = {
    timestamp: new Date().toLocaleString("zh-TW"),
    姓名: order.name,
    主餐: order.main,
    主餐口味: order.mainFlavor,
    "點心+口味": order.sides,
    飲料: order.drinks,
    甜度: order.sugar,
    冰塊: order.ice,
    套餐: order.set,
    套餐口味: order.setDrink,
    金額: order.total,
    付款方式: "",
    已付金額: "",
    找零金額: "",
    付款時間: "",
    找零時間: "",
    狀態: ""
  };

  fetch(SCRIPT_URL, {
    method: "POST",
    body: new URLSearchParams(data)
  })
    .then(res => res.json())
    .then(res => console.log("✅ 成功寫入表單", res))
    .catch(err => console.error("❌ 寫入失敗", err));
}

// 事件
document.addEventListener("change", calcTotal);
document.getElementById("submitOrder").addEventListener("click", () => {
  const order = collectOrder();
  if (!order) return;
  appendOrderRow(order);
  sendToSheet(order);
});

renderOptions();
