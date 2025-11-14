var shipChoice = document.createElement('div');

var totalCost = document.createElement('div');	

var cart = JSON.parse(localStorage.getItem('cart'));

var shipCost = 0;

window.onload = function() {
	var items = document.getElementById('itemTotal');
	
	
	console.log(cart[0].name + " $" + cart[0].price);
	
	for (let i = 0; i < cart.length; i++) {
		console.log(cart[i].name + " $" + cart[i].price);
		let item = document.createElement('div');
		item.innerHTML = cart[i].name + " x " + cart[i].qty + " $" + cart[i].price;
		items.appendChild(item);
	}
	
	var carrierDisplay = document.getElementById('carrierChoice');	
	var carrierChoice = document.createElement('div');
	carrierDisplay.appendChild(carrierChoice);
	
	var shipDisplay = document.getElementById('shippingTotal');
//	var shipChoice = document.createElement('div'); for some reason claims to be undefined here
	shipDisplay.appendChild(shipChoice);
	
	var totalDisplay = document.getElementById('orderTotal');
//	var totalCost = document.createElement('div');	same for this
	totalDisplay.appendChild(totalCost);

};

function updateCarrier(carrier) {
	carrierChoice.innerHTML = carrier;
};

function updateShipping(shippingMethod) {
	shipChoice.innerHTML = "$" + shippingMethod;
	shipCost = parseFloat(shippingMethod);
};

function updateTotal() {
	var total = 0;
	
	for (i = 0; i < cart.length; i++) {
		total = total + cart[i].price;
	}
	total = total + shipCost;
	totalCost.innerHTML = "$" + total;

}
