document.addEventListener("DOMContentLoaded", () => {
  const orderForm = document.getElementById("orderForm");
  const orderTable = document.getElementById("orderTable").querySelector("tbody");
  const totalDisplay = document.getElementById("totalPrice");

  // 你的 Apps Script URL
  const googleScriptURL = "https://script.google.com/macros/s/AKfycbyrA_MVNiHvIlQ0nI-Dh1_ta3LlaDaqg5hLl23qXuQgT3fszsaPpyILSItrmceJ5tT3/exec";

  // 預設口味選項
  const flavors = ["原味","胡椒","辣味","梅粉","綜合","特調","咖哩","海苔","起司"];
  const sweetLevels = ["正常","少糖","半糖","微糖","無糖"];
  const iceLevels = ["正常","少冰","去冰","常溫","熱"];

  // 初始化下拉
  function fillOptions(select, arr) {
    arr.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v; opt.textContent = v;
      select.appendChild(opt);
    });
  }
  document.querySelectorAll("select[id^='flavor-']").forEach(sel => fillOptions(sel, flavors));
  document.querySelectorAll("select[id^='sweet-']").forEach(sel => fillOptions(sel, sweetLevels));
  document.querySelectorAll("select[id^='ice-']").forEach(sel => fillOptions(sel, iceLevels));

  // 送出
  orderForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    if (!name) { alert("請輸入姓名"); return; }

    const main = document.querySelector("input[name='main']:checked");
    const mainName = main ? main.dataset.name : "";
    const mainPrice = main ? parseInt(main.value) : 0;
    const mainFlavor = main ? document.getElementById(`flavor-${main.id}`).value : "";

    const snacks = [];
    let snackTotal = 0;
    document.querySelectorAll("input[name='snack']:checked").forEach(cb => {
      const flavor = document.getElementById(`flavor-${cb.id}`).value;
      snacks.push(`${cb.dataset.name}（${flavor}）`);
      snackTotal += parseInt(cb.value);
    });

    const drinks = [];
    let drinkTotal = 0;
    document.querySelectorAll("input[name='drink']:checked").forEach(cb => {
      const sweet = document.getElementById(`sweet-${cb.id}`).value;
      const ice = document.getElementById(`ice-${cb.id}`).value;
      drinks.push(`${cb.dataset.name}（${sweet}/${ice}）`);
      drinkTotal += parseInt(cb.value);
    });

    const combo = document.querySelector("input[name='combo']:checked");
    const comboName = combo ? combo.dataset.name : "";
    const comboPrice = combo ? parseInt(combo.value) : 0;
    const comboFlavor = combo ? document.getElementById(`flavor-${combo.id}`).value : "";
    const friesFlavor = combo ? document.getElementById(`fries-${combo.id}`).value : "";
    const comboDrink = combo ? document.getElementById(`drink-${combo.id}`).value : "";
    const comboSweet = combo ? document.getElementById(`sweet-${combo.id}`).value : "";
    const comboIce = combo ? document.getElementById(`ice-${combo.id}`).value : "";

    const totalPrice = mainPrice + snackTotal + drinkTotal + comboPrice;
    totalDisplay.textContent = totalPrice;

    // 新增到表格
    const row = orderTable.insertRow();
    row.innerHTML = `
      <td>${name}</td><td>${mainName}</td><td>${mainFlavor}</td>
      <td>${snacks.join(", ")}</td>
      <td>${drinks.join(", ")}</td>
      <td></td><td></td>
      <td>${comboName}</td><td>${comboFlavor}+薯條(${friesFlavor})</td>
      <td>${comboDrink}</td><td>${comboSweet}</td><td>${comboIce}</td>
      <td>${totalPrice}</td>
    `;

    // 傳到 Google Sheets
    const payload = new URLSearchParams();
    payload.set("timestamp", new Date().toISOString());
    payload.set("姓名", name);
    payload.set("主餐", mainName);
    payload.set("主餐口味", mainFlavor);
    payload.set("點心+口味", snacks.join(", "));
    payload.set("飲料", drinks.join(", "));
    payload.set("套餐", comboName);
    payload.set("套餐口味", `${comboFlavor}+薯條(${friesFlavor})`);
    payload.set("套餐飲料", comboDrink);
    payload.set("套餐甜度", comboSweet);
    payload.set("套餐冰塊", comboIce);
    payload.set("金額", totalPrice);
    payload.set("付款方式", "未付款");
    payload.set("已付金額", "");
    payload.set("找零金額", "");
    payload.set("狀態", "");

    fetch(googleScriptURL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload.toString()
    }).then(() => console.log("✅ 已寫入 Sheets"))
      .catch(err => console.error("❌ 失敗", err));
  });
});
