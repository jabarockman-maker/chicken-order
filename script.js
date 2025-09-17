const scriptURL = "你的 Apps Script /exec URL";
const form = document.getElementById("orderForm");
const orderTable = document.querySelector("#orderTable tbody");
const totalDisplay = document.getElementById("total");
const paidAmount = document.getElementById("paidAmount");
const changeAmount = document.getElementById("changeAmount");
const statusDisplay = document.getElementById("status");

let orders = JSON.parse(localStorage.getItem("orders") || "[]");

function renderOrders() {
  orderTable.innerHTML = "";
  orders.forEach(order => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${order.name}</td>
      <td>${order.mainDish}</td>
      <td>${order.snacks}</td>
      <td>${order.drinks}</td>
      <td>${order.setMeal}</td>
      <td>${order.total}</td>
      <td>
        <button onclick="updateStatus('${order.name}', '已付款')">已付款</button>
        <button onclick="updateStatus('${order.name}', '未付款')">未付款</button>
      </td>
    `;
    orderTable.appendChild(row);
  });
}
renderOrders();

function updateStatus(name, status) {
  const order = orders.find(o => o.name === name);
  if (order) {
    order.status = status;
    localStorage.setItem("orders", JSON.stringify(orders));
    renderOrders();
    // 回傳到 Google Sheet
    fetch(scriptURL, {
      method: "POST",
      body: new URLSearchParams(order)
    });
  }
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  let total = 0;
  let mainDish = "";
  let snacks = "";
  let drinks = "";
  let setMeal = "";

  // 主餐
  document.querySelectorAll("input[name='mainDish']").forEach(r => {
    if (r.checked) {
      const qty = r.parentElement.querySelector("input.qty").value;
      total += r.dataset.price * qty;
      mainDish = `${r.value} ×${qty}`;
    }
  });

  // 點心
  document.querySelectorAll(".snack-list input[type='checkbox']").forEach(c => {
    if (c.checked) {
      const qty = c.parentElement.querySelector("input.qty").value;
      const flavor = c.parentElement.querySelector("select").value;
      total += c.dataset.price * qty;
      snacks += `${c.value} ×${qty}（${flavor}）, `;
    }
  });

  // 飲料
  document.querySelectorAll("input[type='checkbox'][value*='茶'],input[value='可樂'],input[value='雪碧']").forEach(c => {
    if (c.checked) {
      const qty = c.parentElement.querySelector("input.qty").value;
      const sweet = c.parentElement.querySelector("select:nth-of-type(1)").value;
      const ice = c.parentElement.querySelector("select:nth-of-type(2)").value;
      total += c.dataset.price * qty;
      drinks += `${c.value} ×${qty}（${sweet}${ice}）, `;
    }
  });

  // 套餐
  document.querySelectorAll("input[name='setMeal']").forEach(r => {
    if (r.checked) {
      total += 120;
      const drink = r.parentElement.querySelector("select").value;
      setMeal = `${r.value}（${drink}）`;
    }
  });

  totalDisplay.textContent = total;

  const order = { name, mainDish, snacks, drinks, setMeal, total, status: "未付款" };
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
  renderOrders();

  // 傳到 Google Sheet
  fetch(scriptURL, {
    method: "POST",
    body: new URLSearchParams(order)
  });

  form.reset();
});

// 找零自動算
paidAmount.addEventListener("input", () => {
  const total = parseInt(totalDisplay.textContent) || 0;
  const paid = parseInt(paidAmount.value) || 0;
  const change = paid - total;
  changeAmount.value = change > 0 ? change : 0;
  statusDisplay.textContent = change === 0 ? "已付款" : change > 0 ? "待找零" : "未付款";
});
