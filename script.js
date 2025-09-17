const scriptURL = "https://script.google.com/macros/s/你的ID/exec"; // 換成你的 Web App 連結

// 主餐 / 點心 / 飲料 / 套餐
const mains = [
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

const combos = [
  { name: "1號套餐：雞排+薯條+飲料", price: 120 },
  { name: "3號套餐：腿排+薯條+飲料", price: 120 }
];

// 預設口味
const flavors = ["不選", "原味", "胡椒", "辣味", "梅粉", "綜合", "特調", "咖哩", "海苔", "起司"];

function renderMenu() {
  const mainDiv = document.getElementById("mains");
  mains.forEach(item => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="radio" name="主餐" value="${item.name}" data-price="${item.price}">${item.name} ($${item.price})
      <select name="主餐口味">${flavors.map(f => `<option>${f}</option>`).join("")}</select>`;
    mainDiv.appendChild(label);
  });

  const sideDiv = document.getElementById("sides");
  sides.forEach(item => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" name="點心" value="${item.name}" data-price="${item.price}">${item.name} ($${item.price})
      <select>${flavors.map(f => `<option>${f}</option>`).join("")}</select>`;
    sideDiv.appendChild(label);
  });

  const drinkDiv = document.getElementById("drinks");
  drinks.forEach(item => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" name="飲料" value="${item.name}" data-price="${item.price}">${item.name} ($${item.price})`;
    drinkDiv.appendChild(label);
  });

  const comboDiv = document.getElementById("combos");
  combos.forEach(item => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="radio" name="套餐" value="${item.name}" data-price="${item.price}">${item.name} ($${item.price})
      <select>${flavors.map(f => `<option>${f}</option>`).join("")}</select>`;
    comboDiv.appendChild(label);
  });
}

renderMenu();

document.getElementById("orderForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const form = new FormData(e.target);
  let order = {};
  form.forEach((v, k) => order[k] = v);

  let total = 0;
  document.querySelectorAll("input[name='主餐']:checked").forEach(i => total += +i.dataset.price);
  document.querySelectorAll("input[name='點心']:checked").forEach(i => total += +i.dataset.price);
  document.querySelectorAll("input[name='飲料']:checked").forEach(i => total += +i.dataset.price);
  document.querySelectorAll("input[name='套餐']:checked").forEach(i => total += +i.dataset.price);
  order["金額"] = total;

  const paid = +document.getElementById("paidAmount").value || 0;
  const change = paid - total;
  document.getElementById("changeAmount").value = change > 0 ? change : 0;
  order["找零金額"] = change > 0 ? change : 0;

  submitOrder(order);
});
