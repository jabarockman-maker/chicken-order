document.addEventListener("DOMContentLoaded", () => {
  const orderForm = document.getElementById("orderForm");
  const orderTable = document.getElementById("orderTable").querySelector("tbody");
  const totalDisplay = document.getElementById("totalPrice");

  // 這是你 Apps Script 部署後的 URL
  const googleScriptURL = "https://script.google.com/macros/s/AKfycbyrA_MVNiHvIlQ0nI-Dh1_ta3LlaDaqg5hLl23qXuQgT3fszsaPpyILSItrmceJ5tT3/exec";

  // === 送出訂單事件 ===
  orderForm.addEventListener("submit", function(e) {
    e.preventDefault();

    // 抓資料
    const name = document.getElementById("name").value.trim();
    if (!name) {
      alert("請輸入姓名");
      return;
    }

    // 主餐
    const main = document.querySelector("input[name='main']:checked");
    const mainName = main ? main.dataset.name : "";
    const mainPrice = main ? parseInt(main.value) : 0;
    const mainFlavor = main ? document.getElementById(`flavor-${main.id}`).value : "";

    // 點心
    const snacks = [];
    document.querySelectorAll("input[name='snack']:checked").forEach(cb => {
      const flavor = document.getElementById(`flavor-${cb.id}`).value;
      snacks.push(`${cb.dataset.name}（${flavor}）`);
    });

    // 飲料
    const drinks = [];
    document.querySelectorAll("input[name='drink']:checked").forEach(cb => drinks.push(cb.dataset.name));
    const sweetness = document.getElementById("sweetness")?.value || "";
    const ice = document.getElementById("ice")?.value || "";

    // 套餐
    const combo = document.querySelector("input[name='combo']:checked");
    const comboName = combo ? combo.dataset.name : "";
    const comboPrice = combo ? parseInt(combo.value) : 0;
    const comboFlavor = combo ? document.getElementById(`flavor-${combo.id}`).value : "";

    // 金額
    const totalPrice = (mainPrice + comboPrice +
      Array.from(document.querySelectorAll("input[name='snack']:checked")).reduce((t, cb) => t + parseInt(cb.value), 0) +
      Array.from(document.querySelectorAll("input[name='drink']:checked")).reduce((t, cb) => t + parseInt(cb.value), 0)
    );

    // 付款
    const payMethod = document.getElementById("payMethod")?.value || "未付款";
    const paidAmount = document.getElementById("paidAmount")?.value || "";
    const changeAmount = document.getElementById("changeAmount")?.value || "";

    // 本地顯示
    const newRow = orderTable.insertRow();
    newRow.innerHTML = `
      <td>${name}</td>
      <td>${mainName}</td>
      <td>${mainFlavor}</td>
      <td>${snacks.join(", ")}</td>
      <td>${drinks.join(", ")}</td>
      <td>${sweetness}</td>
      <td>${ice}</td>
      <td>${comboName}</td>
      <td>${comboFlavor}</td>
      <td>${totalPrice}</td>
      <td>${payMethod}</td>
      <td>${paidAmount}</td>
      <td>${changeAmount}</td>
    `;
    totalDisplay.textContent = totalPrice;

    // === 寫進 Google Sheets ===
    const payload = new URLSearchParams();
    payload.set("timestamp", new Date().toISOString());
    payload.set("姓名", name);
    payload.set("主餐", mainName);
    payload.set("主餐口味", mainFlavor);
    payload.set("點心+口味", snacks.join(", "));
    payload.set("飲料", drinks.join(", "));
    payload.set("甜度", sweetness);
    payload.set("冰塊", ice);
    payload.set("套餐", comboName);
    payload.set("套餐口味", comboFlavor);
    payload.set("金額", totalPrice);
    payload.set("付款方式", payMethod);
    payload.set("已付金額", paidAmount);
    payload.set("找零金額", changeAmount);
    payload.set("付款時間", "");
    payload.set("找零時間", "");
    payload.set("狀態", "");

    fetch(googleScriptURL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
      body: payload.toString()
    }).then(() => {
      console.log("✅ 已寫入 Google Sheets");
    }).catch(err => {
      console.error("❌ 送出失敗", err);
    });
  });
});
