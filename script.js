// Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = "你的 Web App /exec URL";

// 主餐、點心、飲料、套餐資料
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
  { name: "起司條(2人)", price: 30 },
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

// 動態產生表單選項
function renderOptions() {
  const mainDiv = document.getElementById("mainDishes");
  mainDishes.forEach(d => {
    const div = document.createElement("div");
    div.innerHTML = `<label><input type="radio" name="mainDish" value="${d.name}">${d.name} ($${d.price})</label>
                     <select class="flavorSelect" data-for="${d.name}">
                       <option value="">不選</option>
                       <option value="原味">原味</option>
                       <option value="胡椒">胡椒</option>
                       <option value="辣味">辣味</option>
                       <option value="梅粉">梅粉</option>
                       <option value="綜合">綜合</option>
                       <option value="特調">特調</option>
                       <option value="咖哩">咖哩</option>
                       <option value="海苔">海苔</option>
                       <option value="起司">起司</option>
                     </select>`;
    mainDiv.appendChild(div);
  });

  const snackDiv = document.getElementById("snacks");
  snacks.forEach(s => {
    const div = document.createElement("div");
    div.innerHTML = `<label><input type="checkbox" name="snack" value="${s.name}">${s.name} ($${s.price})</label>
                     <select class="flavorSelect" data-for="${s.name}">
                       <option value="">不選</option>
                       <option value="原味">原味</option>
                       <option value="胡椒">胡椒</option>
                       <option value="辣味">辣味</option>
                       <option value="梅粉">梅粉</option>
                       <option value="綜合">綜合</option>
                       <option value="特調">特調</option>
                       <option value="咖哩">咖哩</option>
                       <option value="海苔">海苔</option>
                       <option value="起司">起司</option>
                     </select>`;
    snackDiv.appendChild(div);
  });

  const drinkDiv = document.getElementById("drinks");
  drinks.forEach(dr => {
    const div = document.createElement("div");
    div.innerHTML = `<label><input type="checkbox" name="drink" value="${dr.name}">${dr.name} ($${dr.price})</label>`;
    drinkDiv.appendChild(div);
  });

  const comboDiv = document.getElementById("combos");
  combos.forEach(c => {
    const div = document.createElement("div");
    div.innerHTML = `<label><input type="radio" name="combo" value="${c.name}">${c.name} ($${c.price})</label>
                     <select class="comboDrink">
                       <option value="">請選擇飲料</option>
                       ${drinks.map(dr => `<option value="${dr.name}">${dr.name}</option>`).join("")}
                     </select>`;
    comboDiv.appendChild(div);
  });
}
renderOptions();
