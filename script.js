const mainDishes = [
  { name: "脆皮雞排", price: 85 },
  { name: "無骨雞塊", price: 70 },
  { name: "無骨雞腿排", price: 85 },
  { name: "鮮魷-白", price: 70 },
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

const flavors = ["不選","原味","胡椒","辣味","梅粉","綜合","特調","咖哩","海苔","起司"];

// render 主餐
const mainDishDiv = document.getElementById("mainDish");
mainDishes.forEach(d => {
  const label = document.createElement("label");
  label.innerHTML = `<input type="radio" name="mainDish" value="${d.name}" data-price="${d.price}">${d.name} ($${d.price}) 
    <select class="flavor">${flavors.map(f => `<option>${f}</option>`).join("")}</select>`;
  mainDishDiv.appendChild(label);
});

// render 點心
const sidesDiv = document.getElementById("sides");
sides.forEach(s => {
  const label = document.createElement("label");
  label.innerHTML = `<input type="checkbox" value="${s.name}" data-price="${s.price}">${s.name} ($${s.price}) 
    <select class="flavor">${flavors.map(f => `<option>${f}</option>`).join("")}</select>`;
  sidesDiv.appendChild(label);
});

// render 飲料
const drinksDiv = document.getElementById("drinks");
drinks.forEach(d => {
  const label = document.createElement("label");
  label.innerHTML = `<input type="checkbox" value="${d.name}" data-price="${d.price}">${d.name} ($${d.price})`;
  drinksDiv.appendChild(label);
});

// render 套餐
const setsDiv = document.getElementById("sets");
sets.forEach(s => {
  const label = document.createElement("label");
  label.innerHTML = `<input type="radio" name="set" value="${s.name}" data-price="${s.price}">${s.name} ($${s.price}) 
    <select class="flavor">${flavors.map(f => `<option>${f}</option>`).join("")}</select>
    <select class="setDrink"><option>請選擇飲料</option>${drinks.map(d => `<option>${d.name}</option>`).join("")}</select>`;
  setsDiv.appendChild(label);
});

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

document.getElementById("submit").addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  if (!name) { alert("請輸入姓名"); return; }

  const main = document.querySelector("input[name='mainDish']:checked");
  const mainFlavor = main ? main.parentElement.querySelector("select.flavor").value : "";

  let sidesList = [];
  document.querySelectorAll("#sides input:checked").forEach(s => {
    const flavor = s.parentElement.querySelector("select.flavor").value;
    sidesList.push(`${s.value}（${flavor}）`);
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
  const paid = document.getElementById("paid").value;
  const change = document.getElementById("change").value;
  const changeDone = document.getElementById("changeDone").checked ? "已找零" : "未找零";

  const now = new Date();
  const payTime = payMethod !== "未付款" ? now.toLocaleString() : "";
  const changeTime = changeDone === "已找零" ? now.toLocaleString() : "";

  const row = {
    姓名: name,
    主餐: main ? main.value : "",
    主餐口味: mainFlavor,
    "點心+口味": sidesList.join(", "),
    飲料: drinkList.join(", "),
    甜度: sugar,
    冰塊: ice,
    套餐: setName,
    套餐口味: setFlavor,
    套餐飲料: setDrink,
    金額: total,
    付款方式: payMethod,
    已付金額: paid,
    找零金額: change,
    付款時間: payTime,
    找零時間: changeTime,
    狀態: changeDone
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

  // 寫入 Google Sheet
  fetch("https://script.google.com/macros/s/AKfycbyrA_MVNiHvIlQ0nI-Dh1_ta3LlaDaqg5hLl23qXuQgT3fszsaPpyILSItrmceJ5tT3/exec", {
    method: "POST",
    body: new URLSearchParams(row)
  })
  .then(res => res.json())
  .then(data => console.log("寫入成功", data))
  .catch(err => console.error("寫入失敗", err));
});
