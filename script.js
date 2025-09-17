// ✅ Google Apps Script Web App URL
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyrA_MVNiHvIlQ0nI-Dh1_ta3LlaDaqg5hLl23qXuQgT3fszsaPpyILSItrmceJ5tT3/exec";

// ✅ 主餐 / 點心 / 飲料 / 套餐
const mainDishes = [
  { name: "脆皮雞排", price: 85 },
  { name: "無骨雞塊", price: 70 },
  { name: "無骨雞腿排", price: 85 },
  { name: "鮮魷-白", price: 70 },
  { name: "無敵雞塊(大)", price: 120 }
];
const sides = [
  { name: "柳葉魚", price: 39 }, { name: "脆皮七里香", price: 30 },
  { name: "脆皮雞心", price: 30 }, { name: "脆皮雞翅", price: 30 },
  { name: "脆薯(大份)", price: 50 }, { name: "脆薯(小份)", price: 30 },
  { name: "貢丸", price: 30 }, { name: "噴波起司球", price: 30 },
  { name: "美式洋蔥圈", price: 30 }, { name: "包心小湯圓", price: 30 },
  { name: "甜不辣(大份)", price: 50 }, { name: "甜不辣(小份)", price: 20 },
  { name: "QQ地瓜球", price: 20 }, { name: "QQ芋球", price: 20 },
  { name: "銀絲卷", price: 20 }, { name: "煉乳銀絲卷", price: 25 },
  { name: "梅子地瓜(大)", price: 50 }, { name: "梅子地瓜(小)", price: 20 },
  { name: "米腸", price: 20 }, { name: "花枝丸(大份)", price: 50 },
  { name: "花枝丸(小份)", price: 20 }, { name: "米血糕", price: 20 },
  { name: "百頁豆腐", price: 20 }, { name: "蘿蔔糕", price: 20 },
  { name: "芋頭餅", price: 20 }, { name: "四季豆", price: 30 },
  { name: "杏包菇", price: 30 }, { name: "花椰菜", price: 30 },
  { name: "鮮香菇", price: 30 }, { name: "玉米筍", price: 30 },
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
const flavors = ["不選","原味","胡椒","辣味","梅粉","綜合","特調","咖哩","海苔","起司"];

// ✅ render 主餐
const mainDiv = document.getElementById("mainDish");
mainDishes.forEach(d => {
  mainDiv.innerHTML += `<label>
    <input type="radio" name="mainDish" value="${d.name}" data-price="${d.price}">${d.name} ($${d.price})
    <select class="flavor">${flavors.map(f => `<option>${f}</option>`).join("")}</select>
  </label><br>`;
});
// ✅ render 點心
const sideDiv = document.getElementById("sides");
sides.forEach(s => {
  sideDiv.innerHTML += `<label>
    <input type="checkbox" value="${s.name}" data-price="${s.price}">${s.name} ($${s.price})
    <select class="flavor">${flavors.map(f => `<option>${f}</option>`).join("")}</select>
  </label>`;
});
// ✅ render 飲料
const drinkDiv = document.getElementById("drinks");
drinks.forEach(d => {
  drinkDiv.innerHTML += `<label>
    <input type="checkbox" value="${d.name}" data-price="${d.price}">${d.name} ($${d.price})
  </label>`;
});
// ✅ render 套餐
const setDiv = document.getElementById("sets");
sets.forEach(s => {
  setDiv.innerHTML += `<label>
    <input type="radio" name="set" value="${s.name}" data-price="${s.price}">${s.name} ($${s.price})
    <select class="flavor">${flavors.map(f => `<option>${f}</option>`).join("")}</select>
    <select class="setDrink"><option value="">請選擇飲料</option>${drinks.map(d => `<option>${d.name}</option>`).join("")}</select>
  </label><br>`;
});

// ✅ Radio 可反選
function enableToggleRadios(groupName) {
  document.querySelectorAll(`input[name="${groupName}"]`).forEach(radio => {
    radio.addEventListener("click", function () {
      if (this.previousChecked) {
        this.checked = false;
      }
      this.previousChecked = this.checked;
    });
  });
}
enableToggleRadios("mainDish");
enableToggleRadios("set");

// ✅ 計算金額
function calculateTotal() {
  let total = 0;
  const main = document.querySelector("input[name='mainDish']:checked");
  if (main) total += Number(main.dataset.price);
  document.querySelectorAll("#sides input:checked").forEach(s => total += Number(s.dataset.price));
  document.querySelectorAll("#drinks input:checked").forEach(d => total += Number(d.dataset.price));
  const set = document.querySelector("input[name='set']:checked");
  if (set) total += Number(set.dataset.price);
  document.getElementById("total").innerText = `總金額：${total} 元`;
  return total;
}
document.querySelectorAll("input, select").forEach(el => el.addEventListener("change", calculateTotal));

// ✅ 送出訂單
document.getElementById("orderForm").addEventListener("submit", async e => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  if (!name) { alert("請輸入姓名"); return; }

  const main = document.querySelector("input[name='mainDish']:checked");
  const mainFlavor = main ? main.parentElement.querySelector("select.flavor").value : "";

  let sideList = [];
  document.querySelectorAll("#sides input:checked").forEach(s => {
    const flavor = s.parentElement.querySelector("select.flavor").value;
    sideList.push(`${s.value}(${flavor})`);
  });

  let drinkList = [];
  document.querySelectorAll("#drinks input:checked").forEach(d => drinkList.push(d.value));
  const sugar = document.getElementById("sugar").value;
  const ice = document.getElementById("ice").value;

  const set = document.querySelector("input[name='set']:checked");
  const setName = set ? set.value : "";
  const setFlavor = set ? set.parentElement.querySelector("select.flavor").value : "";
  const setDrink = set ? set.parentElement.querySelector("select.setDrink").value : "";

  const total = calculateTotal();
  const payMethod = document.getElementById("payMethod").value;
  const paid = Number(document.getElementById("paid").value);
  const change = paid - total;
  document.getElementById("change").value = change >= 0 ? change : 0;

  const now = new Date();
  const payTime = payMethod !== "未付款" ? now.toLocaleString() : "";
  const changeTime = document.getElementById("changeDone").checked ? now.toLocaleString() : "";
  let status = "未付款";
  if (paid >= total && change >= 0) {
    status = document.getElementById("changeDone").checked ? "已付款並找零完成" : "已付款未找零";
  }

  const row = {
    姓名: name,
    主餐: main ? main.value : "",
    主餐口味: mainFlavor,
    "點心+口味": sideList.join(", "),
    飲料: drinkList.join(", "),
    甜度: sugar,
    冰塊: ice,
    套餐: setName,
    套餐口味: setFlavor,
    套餐飲料: setDrink,
    金額: total,
    付款方式: payMethod,
    已付金額: paid,
    找零金額: change >= 0 ? change : 0,
    付款時間: payTime,
    找零時間: changeTime,
    狀態: status
  };

  // 本地顯示
  const tbody = document.querySelector("#orderTable tbody");
  const tr = document.createElement("tr");
  Object.values(row).forEach(val => {
    const td = document.createElement("td");
    td.innerText = val;
    tr.appendChild(td);
  });
  tbody.appendChild(tr);

  // 更新總計
  const grandTotalEl = document.getElementById("grandTotal");
  grandTotalEl.innerText = Number(grandTotalEl.innerText) + total;

  // 寫入 Google Sheet
  await fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: "POST",
    body: new URLSearchParams(row)
  });

  // 清空表單
  document.getElementById("orderForm").reset();
  document.getElementById("total").innerText = "總金額：0 元";
});
