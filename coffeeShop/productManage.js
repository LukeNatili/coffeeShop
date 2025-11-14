// fetches the cart items	
var cart = JSON.parse(localStorage.getItem('cart'));

// automatically displays the cart items and their totals
window.onload = function() {
	var items = document.getElementById('items-form');
	var itemsTotal = 0;
		for (let i = 0; i < cart.length; i++) {
		console.log(cart[i].name + " $" + cart[i].price);
		let item = document.createElement('div');
		item.innerHTML = cart[i].name + " x " + cart[i].qty + " $" + cart[i].price;
		items.appendChild(item);
		itemsTotal = itemsTotal + (cart[i].price * cart[i].qty);
	}
	let total = document.createElement('span');
	total.innerHTML = "Total: $" + itemsTotal;
	items.appendChild(total);
	
}
// Creates a random number to associate with the order
function generateOrderNumber() {		
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	    let result = '';
		let charactersLength = 7;
	    for (let i = 0; i < charactersLength; i++) {
		  result += characters.charAt(Math.floor(Math.random() * charactersLength));
	    }
		console.log(result);
		associateOrderWithNumber(result);
		window.alert("Order Number: " + result);
		
	}
// Trying to tie the order number with the cart items for return purposes
function associateOrderWithNumber() {
	localStorage.setItem(result, JSON.stringify(cart));
	console.log(JSON.parse(localStorage.getItem(result)));
