// -----------------------------
// Handle Returns page JavaScript
// 
// -----------------------------

// 
// Everything is wrapped in DOMContentLoaded so it runs only
// after the page has finished loading.
window.addEventListener('DOMContentLoaded', function () {
  
    // The code only runs if the elements are found.
    var returnForm = document.getElementById('return-form');
    var orderInput = document.getElementById('return-order-number');
    var messageBox = document.getElementById('return-message');
    var itemsBox = document.getElementById('return-items');

    if (!returnForm || !orderInput) {
        // If the ids do not exist yet the script will quietly exit.
        return;
    }

    returnForm.addEventListener('submit', function (event) {
        event.preventDefault();

        var orderNumber = orderInput.value.trim();

        if (orderNumber === "") {
            showMessage("Please enter your order number.", messageBox);
            clearItems(itemsBox);
            return;
        }

        var storedOrder = localStorage.getItem(orderNumber);

        if (!storedOrder) {
            showMessage("Order number not found. Please check the number and try again.", messageBox);
            clearItems(itemsBox);
            return;
        }

        var orderData = JSON.parse(storedOrder);

        showMessage("Order found for " + (orderData.firstName || "customer") + ".", messageBox);
        showItems(orderData.cart, itemsBox);
    });
});

// Helper function to show a message either in a box on the page
// or with a simple alert if no message box exists.
function showMessage(text, messageBox) {
    if (messageBox) {
        messageBox.textContent = text;
    } else {
        alert(text);
    }
}

// Clear any items that were shown before
function clearItems(itemsBox) {
    if (itemsBox) {
        itemsBox.innerHTML = "";
    }
}

// Show each item from the cart on the page so the shopper can choose
// which ones to return (this part is kept very simple on purpose).
function showItems(cartItems, itemsBox) {
    if (!itemsBox) {
        return;
    }

    itemsBox.innerHTML = "";

    if (!cartItems || cartItems.length === 0) {
        itemsBox.textContent = "No items were saved with this order.";
        return;
    }

    for (var i = 0; i < cartItems.length; i++) {
        var item = cartItems[i];

        var line = document.createElement('div');
        line.textContent = item.name + " x " + item.qty + " $" + Number(item.price).toFixed(2);

        itemsBox.appendChild(line);
    }
}

// Extra behavior for the Return form
window.addEventListener('DOMContentLoaded', function () {
    var submitReturnBtn = document.getElementById('submit-return');
    var orderInput = document.getElementById('return-order-number');
    var cardDigitsInput = document.getElementById('return-card-digits');
    var cardCvvInput = document.getElementById('return-card-cvv');
    var reasonSelect = document.getElementById('return-reason');
    var commentsArea = document.getElementById('return-comments');

    if (!submitReturnBtn) {
        return;
    }

    submitReturnBtn.addEventListener('click', function () {
        var messages = [];

        if (!orderInput || orderInput.value.trim() === "") {
            messages.push("Order number is required.");
        }

        if (!cardDigitsInput || cardDigitsInput.value.trim() === "") {
            messages.push("Card digits are required.");
        } else if (cardDigitsInput.value.trim().length < 4) {
            messages.push("Please enter at least the last 4 card digits.");
        }

        if (!cardCvvInput || cardCvvInput.value.trim() === "") {
            messages.push("CVV is required.");
        } else if (
            cardCvvInput.value.trim().length < 3 ||
            cardCvvInput.value.trim().length > 4
        ) {
            messages.push("CVV should be 3 or 4 numbers.");
        }

        if (!reasonSelect || !reasonSelect.value) {
            messages.push("Please choose a reason for the return.");
        }

        if (messages.length > 0) {
            alert(messages.join("\n"));
            return;
        }

        alert("Your return request has been submitted. Thank you.");

        if (commentsArea) {
            commentsArea.value = "";
        }
        if (reasonSelect) {
            reasonSelect.selectedIndex = 0;
        }
    });
});
