// Billing page JavaScript
// Page behaviors and field checks

var cart = JSON.parse(localStorage.getItem('cart'));
if (!Array.isArray(cart)) {
    cart = [];
}


var okToGenerate = false;

window.addEventListener('DOMContentLoaded', function () {
    showCartItems();
    setupBillingForm();
    setYearInFooter();
});

// Show cart items on the page
function showCartItems() {
    var itemsForm = document.getElementById('items-form');
    if (!itemsForm) {
        return;
    }

    itemsForm.innerHTML = "";

    if (cart.length === 0) {
        var emptyMessage = document.createElement('p');
        emptyMessage.textContent = "Your cart is empty.";
        itemsForm.appendChild(emptyMessage);
        return;
    }

    var itemsTotal = 0;

    for (var i = 0; i < cart.length; i++) {
        var item = document.createElement('div');
        var name = cart[i].name;
        var qty = Number(cart[i].qty);
        var price = Number(cart[i].price);

        item.textContent = name + " x " + qty + " $" + price.toFixed(2);
        itemsForm.appendChild(item);

        itemsTotal = itemsTotal + (price * qty);
    }

    var total = document.createElement('span');
    total.textContent = "Total: $" + itemsTotal.toFixed(2);
    itemsForm.appendChild(total);
}

// Set current year in the footer
function setYearInFooter() {
    var yearSpan = document.getElementById('year');
    if (yearSpan) {
        var today = new Date();
        yearSpan.textContent = today.getFullYear();
    }
}

// Billing form behavior
function setupBillingForm() {
    var billingForm = document.getElementById('billing-form');
    if (!billingForm) {
        return;
    }

    billingForm.addEventListener('submit', function (event) {
        event.preventDefault();

        var isValid = validateBillingForm();

        if (isValid) {
            okToGenerate = true;
            generateOrderNumber();
            okToGenerate = false;

            billingForm.reset();
            localStorage.removeItem('cart');
            cart = [];
            showCartItems();
        }
    });
}

// Validate billing fields
function validateBillingForm() {
    var firstName = document.getElementById('billing-first-name');
    var lastName = document.getElementById('billing-last-name');
    var address = document.getElementById('billing-address');
    var phone = document.getElementById('billing-phone');
    var email = document.getElementById('billing-email');
    var cardDigits = document.getElementById('billing-card-digits');
    var cardCvv = document.getElementById('billing-card-cvv');

    var messages = [];

    if (!firstName || firstName.value.trim() === "") {
        messages.push("First name is required.");
    }

    if (!lastName || lastName.value.trim() === "") {
        messages.push("Last name is required.");
    }

    if (!address || address.value.trim() === "") {
        messages.push("Address is required.");
    }

    if (!phone || phone.value.trim() === "") {
        messages.push("Phone number is required.");
    } else if (phone.value.trim().length < 7) {
        messages.push("Phone number looks too short.");
    }

    if (!email || email.value.trim() === "") {
        messages.push("Email address is required.");
    } else if (email.value.indexOf("@") === -1 || email.value.indexOf(".") === -1) {
        messages.push("Please enter a valid email address.");
    }

    if (!cardDigits || cardDigits.value.trim() === "") {
        messages.push("Card digits are required.");
    } else if (cardDigits.value.trim().length < 12) {
        messages.push("Card digits look too short.");
    }

    if (!cardCvv || cardCvv.value.trim() === "") {
        messages.push("CVV is required.");
    } else if (cardCvv.value.trim().length < 3 || cardCvv.value.trim().length > 4) {
        messages.push("CVV should be 3 or 4 numbers.");
    }

    if (messages.length > 0) {
        alert(messages.join("\n"));
        return false;
    }

    return true;
}

// Order number functions
function saveOrderInfo(orderNumber) {
    $.ajax({
        url: 'http://localhost:8000/api/orders',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({orderNumber: orderNumber, cart: cart}),
        success: function (response) {
            console.log('Order saved Successfully');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error saving order: ' + textStatus, errorThrown);
        }
        }

    );
}

function generateOrderNumber() {
    if (!okToGenerate) {
        return;
    }

    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var result = "";
    var charactersLength = characters.length;

    for (var i = 0; i < 7; i++) {
        var randomIndex = Math.floor(Math.random() * charactersLength);
        result = result + characters.charAt(randomIndex);
    }

    

    associateOrderWithNumber(result);
    alert("Order Number: " + result);
}

// Save order info for returns
function associateOrderWithNumber(orderNumber) {
    if (!orderNumber) {
        return;
    }

    var firstName = document.getElementById('billing-first-name');
    var lastName = document.getElementById('billing-last-name');
    var address = document.getElementById('billing-address');
    var phone = document.getElementById('billing-phone');
    var email = document.getElementById('billing-email');
    var specialDetails = document.getElementById('special-details');

    var orderInformation = {
        orderNumber: orderNumber,
        cart: cart,
        firstName: firstName ? firstName.value.trim() : "",
        lastName: lastName ? lastName.value.trim() : "",
        address: address ? address.value.trim() : "",
        phone: phone ? phone.value.trim() : "",
        email: email ? email.value.trim() : "",
        specialDetails: specialDetails ? specialDetails.value.trim() : ""
    };

    localStorage.setItem(orderNumber, JSON.stringify(orderInformation));
    saveOrderInfo(orderNumber);
    localStorage.setItem("lastOrderNumber", orderNumber);    
}

