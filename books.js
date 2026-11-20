cript>
function showBill() {
    let table = document.querySelector("table");
    let total = 0;
    let result = "";

    for (let i = 1; i < table.rows.length; i++) {
        let row = table.rows[i];

        let name = row.cells[1].innerText;
        let price = parseInt(row.cells[2].innerText);
        let checkbox = row.cells[3].querySelector("input");
        let qty = row.cells[4].querySelector("input").value;

        if (checkbox.checked && qty > 0) {
            let amount = price * qty;
            total += amount;
            result += name + " × " + qty + " = ₹" + amount + "<br>";
        }
    }

    result += "<br><b>Total = ₹" + total + "</b>";

    document.getElementById("output").innerHTML = result;
}
</script>