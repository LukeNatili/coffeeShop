function addProduct() {
	const newRow = document.createElement('tr');
	const cell1 = document.createElement('td');
	cell1.textContent = document.getElementById("product-id").value;
	const cell2 = document.createElement('td');
	cell2.textContent = document.getElementById("product-name").value;
	const cell3 = document.createElement('td');
	cell3.textContent = document.getElementById("product-price").value;
	const cell4 = document.createElement('td');
	cell4.textContent = document.getElementById("product-description").value;
	const cell5 = document.createElement('td');
	cell5.textContent = document.getElementById("product-category").value;
	const cell6 = document.createElement('td');
	cell6.textContent = document.getElementById("product-size").value;
	const cell7 = document.createElement('btn');
	cell7.textContent = "Delete";
	
	newRow.appendChild(cell1);
	newRow.appendChild(cell2);
	newRow.appendChild(cell3);
	newRow.appendChild(cell4);
	newRow.appendChild(cell5);
	newRow.appendChild(cell6);
	newRow.appendChild(cell7);
	
	document.getElementById("product-list").appendChild(newRow);
	console.log("all done")
}