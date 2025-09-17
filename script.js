const scriptURL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";
let orders = JSON.parse(localStorage.getItem("orders") || "[]");

function renderOrders() {
  const tbody = document.querySelector("#orderTable tbody");
  tbody.innerHTML = "";
  orders.forEach((o, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${o.name}</td><td>${o.mainDish}</td><td>${o.mainDishFlavor}</td><td>${o.snacks}</td>
      <td>${o.drinks}</td><td>${o.sugar}</td><td>${o.ice}</td><td>${o.set}</td><td>${o.setFlavor}</td><td>${o.setDrink}</td>
      <td>${o.total}</td><td>${o.method}</td><td>${o.paid}</td><td>${o.change}</td>
      <td>${o.payTime}</td><td>${o.changeTime}</td><td>${o.status}</td>
      <td>
        <button onclick="updateStatus(${i}, '已付款')">已付款</button>
        <button onclick="updateStatus(${i}, '未付款')">未付款</button>
      </td>`;
    tbody.appendChild(tr);
  });
}
renderOrders();

function updateStatus(i, status) {
  orders[i].status = status;
  orders[i].payTime = status === "已付款" ? new Date().toLocaleString() : "";
  localStorage.setItem("orders", JSON.stringify(orders));
  renderOrders();
  fetch(scriptURL, { method: "POST", body: JSON.stringify({ action: "updateStatus", row: orders[i].row, status }) });
}

document.getElementById("orderForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const mainDish = document.querySelector("input[name='mainDish']:checked")?.value || "";
  const mainFlavor = document.getElementById("mainFlavor").value;
  const snacks = Array.from(document.querySelectorAll(".snack:checked")).map((s, i) => `${s.value} ×${document.querySelectorAll(".snackQty")[i].value}（${document.querySelectorAll(".snackFlavor")[i].value}）`).join(", ");
  const drinks = Array.from(document.querySelectorAll(".drink:checked")).map((d, i) => `${d.value} ×${document.querySelectorAll(".drinkQty")[i].value}`).join(", ");
  const sugar = document.querySelector(".drinkSugar")?.value || "";
  const ice = document.querySelector(".drinkIce")?.value || "";
  const set = document.querySelector("input[name='set']:checked")?.value || "";
  const setDrink = document.querySelector(".setDrink")?.value || "";
  const setFlavor = ""; // 可擴充

  const total = parseInt(document.getElementById("totalAmount").textContent) || 0;
  const method = document.getElementById("paymentMethod").value;
  const paid = parseInt(document.getElementById("paidAmount").value) || 0;
  const change = parseInt(document.getElementById("changeAmount").value) || 0;
  const status = paid === total ? "已付款" : paid > 0 ? "待找零" : "未付款";

  const order = { name, mainDish, mainDishFlavor: mainFlavor, snacks, drinks, sugar, ice, set, setFlavor, setDrink, total, method, paid, change, payTime: "", changeTime: "", status };

  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
  renderOrders();

  fetch(scriptURL, { method: "POST", body: JSON.stringify(order) });

  e.target.reset();
});
