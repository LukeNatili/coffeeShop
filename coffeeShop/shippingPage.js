var shipChoice = document.createElement('div');

var totalCost = document.createElement('div');	

var cart = [];
var itemSubtotal = 0;

var shipCost = 0;
var carrierChoiceDiv = document.createElement('div');

function loadCartFromServer() {
	url: 'http://localhost:8000/api/cart',
	method: 'GET',
	dataType: 'json',
	success: function(data) {
		cart = data || [];
		initializePage();
	}
}

function initializePage() {
	var itemsContainer = document.getElementById('itemTotal');
	itemsContainer.innerHTML = '';
	itemSubtotal = 0;

	if (cart.length === 0) {
		itemsContainer.innerHTML = '<div>Your cart is empty.</div>';
	}
	else {
		for (let i = 0; i < cart.length; i++) {
			let itemTotal = cart[i].price * cart[i].qty;
			itemSubtotal += itemTotal;

			let itemDiv = document.createElement('div');
			itemDiv.innerHTML = `${cart[i].name} x ${cart[i].qty} @ $${cart[i].price.toFixed(2)} = **$${itemTotal.toFixed(2)}**`;
			itemsContainer.appendChild(itemDiv);
		}
	}

	var carrierDisplay = document.getElementById('carrierChoice');
	if (carrierDisplay) {
		carrierDisplay.appendChild(carrierChoiceDiv);
	}
	updateCarrier('UPS');
	updateShipping(5.99);
	updateTotal();	
}


function updateCarrier(carrier) {
	carrierChoiceDiv.innerHTML = carrier;
	updateTotal();
}

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
