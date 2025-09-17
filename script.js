const sheetUrl = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

// 訂單紀錄 localStorage
let orders = JSON.parse(localStorage.getItem("orders")) || [];

// 即時計算金額 & 找零
function calculateTotal() {
  let total = 0;

  // 主餐
  const mainDish = document.querySelector("input[name='mainDish']:checked");
  if (mainDish) {
    const qty = parseInt(document.getElementById("mainQty").value) || 0;
    const price = parseInt(mainDish.value.match(/\d+/)[0]);
    total += qty * price;
  }

  // 點心
  document.querySelectorAll(".snack:checked").forEach((snack, i) => {
    const qty = parseInt(document.querySelectorAll(".snack-qty")[i].value) || 0;
    const price = parseInt(snack.value.match(/\d+/)[0]);
    total += qty * price;
  });

  // 飲料
  document.querySelectorAll(".drink:checked").forEach((drink, i) => {
    const qty = parseInt(document.querySelectorAll(".drink-qty")[i].value) || 0;
    const price = parseInt(drink.value.match(/\d+/)[0]);
    total += qty * price;
  });

  // 套餐
  const setMeal = document.querySelector("input[name='setMeal']:checked");
  if (setMeal) {
    const price = parseInt(setMeal.value.match(/\d+/)[0]);
    total += price;
  }

  document.getElementById("totalAmount").textContent = total;

  // 找零
  const paid = parseInt(document.getElementById("paidAmount").value) || 0;
  document.getElementById("changeAmount").value = paid - total >= 0 ? paid - total : 0;
}
document.querySelectorAll("input, select").forEach(el => {
  el.addEventListener("change", calculateTotal);
});

// 送出訂單
document.getElementById("orderForm").addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const total = document.getElementById("totalAmount").textContent;
  const paid = document.getElementById("paidAmount").value;
  const change = document.getElementById("changeAmount").value;
  const method = document.getElementById("paymentMethod").value;

  const order = { name, total, paid, change, method, status: method };
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  renderOrders();

  // 發送到 Google Sheet
  fetch(sheetUrl, {
    method: "POST",
    body: JSON.stringify(order)
  });
});

// 渲染訂單總覽
function renderOrders() {
  const tbody = document.querySelector("#orderTable tbody");
  tbody.innerHTML = "";
  orders.forEach((o, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${o.name}</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>${o.total}</td>
      <td>${o.method}</td>
      <td>${o.paid}</td>
      <td>${o.change}</td>
      <td>${o.status}</td>
      <td><button onclick="markPaid(${i})">已付款</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function markPaid(i) {
  orders[i].status = "已付款";
  localStorage.setItem("orders", JSON.stringify(orders));
  renderOrders();
}

// 頁面載入恢復
renderOrders();
