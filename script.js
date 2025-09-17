const scriptURL = "你的 Google Apps Script exec 連結";

// 載入 localStorage 訂單
window.onload = () => {
  const savedOrders = localStorage.getItem("orders");
  if (savedOrders) {
    document.querySelector("#orderTable tbody").innerHTML = savedOrders;
  }
};

// 計算金額
function calcTotal() {
  let total = 0;
  document.querySelectorAll("input[type=radio][name=mainDish]").forEach(r => {
    if (r.checked) {
      if (r.value === "脆皮雞排") total += 85;
      if (r.value === "無骨雞塊") total += 70;
      if (r.value === "無骨雞腿排") total += 85;
      if (r.value === "鮮魷白") total += 70;
      if (r.value === "無敵雞塊(大)") total += 120;
    }
  });
  document.querySelectorAll(".snacks input[type=checkbox]").forEach((c, i) => {
    if (c.checked) {
      if (c.value === "柳葉魚") total += 39;
      if (c.value === "杏鮑菇") total += 30;
      // 其他點心依價目加上
    }
  });
  document.querySelectorAll("input[type=checkbox][value]").forEach(c => {
    if (c.checked && ["冬瓜紅茶","泡沫綠茶"].includes(c.value)) total += 10;
    if (c.checked && ["可樂","雪碧"].includes(c.value)) total += 20;
  });
  if (document.querySelector("input[name=setMeal]:checked")) total += 120;
  document.getElementById("total").innerText = total;
  return total;
}
document.querySelectorAll("input, select").forEach(el => el.addEventListener("change", calcTotal));

// 送出訂單
document.getElementById("submitOrder").addEventListener("click", () => {
  const name = document.getElementById("name").value;
  const mainDish = document.querySelector("input[name=mainDish]:checked")?.value || "";
  const mainFlavor = document.getElementById("mainDishFlavor").value;
  const snacks = Array.from(document.querySelectorAll(".snacks input:checked"))
    .map((c,i)=> c.value+"("+c.parentElement.nextElementSibling.value+")").join(", ");
  const drinks = Array.from(document.querySelectorAll("input[type=checkbox][value]:checked"))
    .map(c => c.value).join(", ");
  const sugar = document.getElementById("sugar").value;
  const ice = document.getElementById("ice").value;
  const setMeal = document.querySelector("input[name=setMeal]:checked")?.value || "";
  const setMealDrink = setMeal==="1號餐" ? document.getElementById("setMealDrink").value :
                       setMeal==="3號餐" ? document.getElementById("setMealDrink2").value : "";
  const total = calcTotal();
  const paymentMethod = document.getElementById("paymentMethod").value;
  const paid = document.getElementById("paidAmount").value;
  const change = document.getElementById("changeAmount").value;
  const status = document.getElementById("changeDone").checked ? "已找零" : "未找零";

  const row = `<tr>
    <td>${name}</td><td>${mainDish}</td><td>${mainFlavor}</td>
    <td>${snacks}</td><td>${drinks}</td><td>${drinks? sugar:""}</td><td>${drinks? ice:""}</td>
    <td>${setMeal}</td><td>${setMealDrink}</td><td>${total}</td>
    <td>${paymentMethod}</td><td>${paid}</td><td>${change}</td><td>${status}</td>
  </tr>`;

  document.querySelector("#orderTable tbody").innerHTML += row;
  localStorage.setItem("orders", document.querySelector("#orderTable tbody").innerHTML);

  // POST to Google Sheet
  fetch(scriptURL, { method: "POST", body: new FormData(document.createElement("form")) });
});

// 清除
document.getElementById("clearOrder").addEventListener("click", ()=>{
  document.querySelector("#orderTable tbody").innerHTML="";
  localStorage.removeItem("orders");
});
