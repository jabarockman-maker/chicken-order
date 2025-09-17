const scriptURL = "你的Google Apps Script Web App URL";

// 計算總金額
function calculateTotal() {
  let total = 0;

  // 主餐
  document.querySelectorAll("#main-dishes input[type=radio]:checked").forEach(r => {
    total += Number(r.dataset.price);
  });

  // 點心
  document.querySelectorAll("#snacks input[type=checkbox]:checked").forEach(c => {
    total += Number(c.dataset.price);
  });

  // 飲料
  document.querySelectorAll("input[type=checkbox][value^=冬瓜], input[type=checkbox][value^=泡沫], input[type=checkbox][value^=可樂], input[type=checkbox][value^=雪碧]").forEach(d => {
    if (d.checked) total += Number(d.dataset.price);
  });

  // 套餐
  document.querySelectorAll("input[name=set]:checked").forEach(s => {
    total += Number(s.dataset.price);
  });

  document.getElementById("total").textContent = total;
  return total;
}

document.querySelectorAll("input, select").forEach(el => {
  el.addEventListener("change", calculateTotal);
});

document.getElementById("submitBtn").addEventListener("click", () => {
  const name = document.getElementById("name").value;
  const method = document.getElementById("method").value;
  const paid = document.getElementById("paid").value;
  const change = document.getElementById("change").value;
  const status = document.getElementById("status").textContent;
  const total = calculateTotal();

  const timestamp = new Date().toLocaleString();

  const row = [
    timestamp, name,
    "-", "-", "-", "-", "-", "-", "-", "-", "-", total, method, paid, change, "", "", status
  ];

  // 新增到表格
  const tbody = document.querySelector("#orderTable tbody");
  const tr = document.createElement("tr");
  row.forEach(v => {
    const td = document.createElement("td");
    td.textContent = v;
    tr.appendChild(td);
  });
  tbody.appendChild(tr);

  // 傳到 Google Sheet
  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify({
      name, total, method, paid, change, status
    })
  }).then(r => console.log("已送出到 Google Sheet"));
});

document.getElementById("clearBtn").addEventListener("click", () => {
  location.reload();
});
