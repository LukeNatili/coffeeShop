window.onload = function loadXML() {
	const xhttp = new XMLHttpRequest();
	xhttp.onload = function() {loadProducts(this);};
	xhttp.open('GET', 'products.xml');
	xhttp.send();

}
function loadProducts(xml) {
	const xmlDoc = xml.responseXML;
	const x = xmlDoc.getElementsByTagName('PRODUCT');
	
	for (let i = 0; i < x.length; i++) {
		let div1 = document.createElement('div');
		div1.setAttribute('class', 'col-12 col-lg-3');
		
		let div2 = document.createElement('div');
		div2.setAttribute('class', 'card shadow-lg border-0 panel-elegant');
		div2.setAttribute('id', x[i].getElementsByTagName('NAME')[0].childNodes[0].nodeValue.toLowerCase);
		
		let div3 = document.createElement('div');
		div3.setAttribute('class', 'menu-card-item p-4');
		
		let header = document.createElement('h2');
		header.innerHTML = x[i].getElementsByTagName('NAME')[0].childNodes.nodeValue + ' - ' + x[i].getElementsByTagName('Price')[0].childNodes[0].nodeValue;
		
		let div4 = document.createElement('div');
		div4.setAttribute('class', 'menu-card-button');
		
		let btn = document.createElement('button');
		btn.setAttribute('class', 'btn btn-amber-elegant fw-semibold');
		btn.setAttribute('id', 'cart' + x[i].getElementsByTagName('NAME')[0].childNodes.nodeValue);
		btn.innerHTML = 'Add to cart';
		
		div1.appendChild(div2);
		div2.appendChild(div3);
		div3.appendChild(header);
		div3.appendChild(div4);
		div4.appendChild(btn);
		
		let targetDiv = document.getElementById('productContainer');
		targetDiv.appendChild(div1);
	}
}
