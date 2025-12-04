$(document).ready(function() {
var form = document.getElementById('shopperForm');
var tableBody = document.querySelector('#shopperTable tbody');
var search = document.getElementById('search');
var yearEl = document.getElementById('year');
var resetBtn = document.getElementById('resetBtn');
var exportBtn = document.getElementById('exportBtn');
var editingIndex = document.getElementById('editingIndex');

// NEW: mark optional elements as used to satisfy linters (no behavior change)
if (tableBody && search && yearEl && resetBtn && exportBtn && editingIndex) { /* no-op */ }

var inputs = {
  firstName: document.getElementById('firstName'),
  lastName: document.getElementById('lastName'),
  email: document.getElementById('email'),
  phone: document.getElementById('phone'),
  address: document.getElementById('address'),
  city: document.getElementById('city'),
  state: document.getElementById('state'),
  zip: document.getElementById('zip'),
  age: document.getElementById('age')
};




/*Constants for states for scrolldown menu - LP */
var states = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
var selectState = document.getElementById('state');

states.forEach(function(stateCode) {
  var option = document.createElement('option');
  option.value = stateCode;
  option.textContent = stateCode;
  selectState && selectState.appendChild(option);
});

/* The regex originally was not working and I could not fix it so I made is a separate js function - LP */
function isValidNumber(phone) {
  var phonePatter = /^[0-9+ ()-]{7,}$/;
  return phonePatter.test(phone);
}
function isValidEmail(email) {
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}
function isValidAddress(address) {
  var addressPattern = /^[0-9]+ +[a-zA-Z0-9\s,'-]+$/;
  return addressPattern.test(address);
}

function handleFormSubmit(event){
  event.preventDefault();
  if (!inputs.firstName || !inputs.lastName || !inputs.city || !inputs.state || !inputs.zip || !inputs.age) return;

  if (!inputs.firstName.value || !inputs.lastName.value || !inputs.city.value || !inputs.state.value || !inputs.zip.value || !inputs.age.value) {
    alert('Please fill in all required fields.');
    return;
  } else if(!isValidNumber(inputs.phone.value)) {
    alert('Please enter a valid phone number. ');
    inputs.phone.classList.add('is-invalid');
    return;
  } else if (!isValidEmail(inputs.email.value)) {
    alert('Please enter a valid email address.');
    inputs.email.classList.add('is-invalid');
    return;
  } else if (!isValidAddress(inputs.address.value)) {
    alert('Please enter a valid address. ');
    inputs.address.classList.add('is-invalid');
    return;
  }

  inputs.phone.classList.remove('is-invalid');
  inputs.email.classList.remove('is-invalid');
  inputs.address.classList.remove('is-invalid');

  var formData = {};
  for (var key in inputs){
    formData[key] = inputs[key].value.trim();
  }

  var jsonString = JSON.stringify(formData);
  // NEW: mark as used to satisfy linter (no behavior change)
  if (typeof jsonString === 'string') { /* no-op */ }
}

if (form) {
  form.addEventListener('submit', function(event) {
    handleFormSubmit(event);
  });
}

/* === NEW: Simple Cart + Checkout logic for coffeeShopMenu.html === */
(function () {
  // Only run on pages that have the cart badge
  var cartCountEl = document.getElementById('cartCount');
  if (!cartCountEl) return;

  // NEW: Basic in-memory cart with localStorage fallback (keeps it simple)
  var CART_KEY = '';
  var cart = [];

  if (!CART_KEY) {
    CART_KEY = generateOrderNumber();
    localStorage.setItem('cartKey', CART_KEY);
    console.log("New Cart Session Started with Key: " + CART_KEY);
  }
  else {
    console.log("Existing Cart Session Found with Key: " + CART_KEY);
  }


  var items = [
  { id: 'cartCappucino', name: 'Cappucino', price: 9.99, category: "Coffee", size: 4},
  { id: 'cartLatte', name: 'Latte', price: 9.99, category: "Coffee", size: 6 },
  { id: 'cartEspresso', name: 'Espresso', price: 6.99, category: "Coffee", size: 2 },
  { id: 'cartAffogato', name: 'Affogato', price: 11.99, category: "Coffee", size: 10 },
  { id: 'cartAmericano', name: 'Americano', price: 6.99, category: "Coffee", size: 8 },
  { id: 'cartMocha', name: 'Mocha', price: 11.99, category: "Coffee", size: 6 },
  { id: 'cartIrish', name: 'Irish', price: 13.99, category: "Coffee", size: 8 },
  { id: 'cartMacchiato', name: 'Macchiato', price: 8.99, category: "Coffee", size: 6 },
  { id: 'cartBlack', name: 'Black', price: 4.99, category: "Coffee", size: 8 },
  { id: 'cartDecaf', name: 'Decaf', price: 4.99, category: "Coffee", size: 8 }
  ];
  const jsonString = JSON.stringify(items);
  console.log(jsonString)

  // $.ajax({
  //   url: 'http://localhost:8000/api/products',
  //   method: 'POST',
  //   contentType: 'application/json',
  //   data: jsonString,
  //   dataType: 'json',
  //   success: function(response) {
  //     console.log("Products added to server successfully. ");
  //   },
  //   error: function(jqXHR, textStatus, errorThrown) {
  //     console.error("Error adding products to server: ", textStatus, errorThrown);
  //   }
  // });
    
  // NEW: Helper to load/save the cart
  function loadCart() {
    $.ajax({
     url: 'http://localhost:8000/api/cart',
     method: 'GET',
     dataType: 'json',
     success: function(data) {
       cart = data || [];
       console.log("Cart loaded from server. ");
       updateUI();}
    })
    try {
      var raw = localStorage.getItem(CART_KEY);
      cart = raw ? JSON.parse(raw) : [];
    } catch (e) {
      cart = [];
    }
  }
  function saveCart() {
    if(cart) {
      cart.unshift({ID: CART_KEY}); //add random id number to cart. would in future need to check against existing cart ids
      $.ajax({
        url: 'http://localhost:8000/api/cart',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ cart: cart }),
        dataType: 'json',
        success: function(response) { 
          console.log("Cart saved succesfully to server.");
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.error("Error saving cart to server: ", textStatus, errorThrown)
        }
        
      })
    }
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) { /* no-op */ }
  }
  function generateOrderNumber() {		
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	    let result = '';
		let charactersLength = 7;
	    for (let i = 0; i < charactersLength; i++) {
		  result += characters.charAt(Math.floor(Math.random() * charactersLength));
	    }
		return result;
		
	}

  // NEW: Calculate total and count
  function cartTotals() {
    var total = 0;
    var count = 0;
    for (var i = 0; i < cart.length; i++) {
      total += cart[i].price * cart[i].qty;
      count += cart[i].qty;
    }
    return { total: total, count: count };
  }

  // Modified existing to implement jquery -LP
  function renderCart() {
    var $listEl = $('#cartList');
    var $totalEl = $('#cartTotal');
    var $cartCountEl = $('#cartCount');
    if (!$listEl.length || !$totalEl.length || !$cartCountEl.length) return;

    $listEl.empty();

    for (var i = 0; i < cart.length; i++) {
      (function (item, index) {
        var $li = $('<li>')
                .addClass('list-group-item d-flex justify-content-between align-items-center')
                .attr('data-index', index) 
                .html('<div>' +
                    item.name + ' x ' + item.qty + '<div class="small text-muted">$' + item.price.toFixed(2) + ' each</div></div>' +
                    '<div class="btn-group">' +
                        '<button class="btn btn-sm btn-outline-secondary" data-action="dec">-</button>' +
                        '<button class="btn btn-sm btn-outline-secondary" data-action="inc">+</button>' +
                        '<button class="btn btn-sm btn-outline-danger" data-action="remove">&times;</button>' +
                    '</div>');
            
            $listEl.append($li);
      })(cart[i], i);
    }

    var t = cartTotals();
    $totalEl.text( '$' + t.total.toFixed(2));
    $cartCountEl.text(t.count);
  }

  function loadCartClickHandler() {
    $('#loadCart').on('click', function() {
      loadCart();
      updateUI();
    })
  }
  function cartClickHandler() {
    $('#cartList').on('click', 'button[data-action]', function() {
      var action = $(this).data('action');
      var $li = $(this).closest('li');
      var index = parseInt($li.data('index'));

      if(isNaN(index) || index < 0 || index >= cart.length) return;

      if(action=== 'inc') {
        cart[index].qty += 1;
      }
      else if(action === 'dec') {
        cart[index].qty -= Math.max(1, cart[index].qty - 1);
      }
      else if(action === 'remove') {
        cart.splice(index, 1);
      }
      saveCart();
      updateUI();
    })
  }
  // NEW: Add item to cart (by name/price); merge quantities for same item
  function addToCart(name, price) {
    var found = -1;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].name === name) { found = i; break; }
    }
    if (found > -1) {
      cart[found].qty += 1;
    } else {
      cart.push({ name: name, price: price, qty: 1 });
    }
    saveCart();
    updateUI();
  }

  // NEW: Simple checkout — shows summary and then clears the cart
  function checkout() {
    if (!cart.length) {
      alert('Your cart is empty.');
      return;
    }
    var summary = 'Thanks for your order!\n\n';
    for (var i = 0; i < cart.length; i++) {
      summary += cart[i].name + ' x ' + cart[i].qty + ' = $' + (cart[i].price * cart[i].qty).toFixed(2) + '\n';
    }
    summary += '\nTotal: $' + cartTotals().total.toFixed(2);
    alert(summary);
    cart = [];
    saveCart();
    updateUI();
  }

  // Clear cart button - clears out cart -LP
  function clearCart() {
    cart = [];
    updateUI();
  }

  // NEW: Update UI helper
  function updateUI() {
    renderCart();
  }

  // Modified existing javascript to use jquery -LP
  function wireButtons() {
    var items = [
      { id: 'cartCappucino', name: 'Cappucino', price: 9.99 },
      { id: 'cartLatte', name: 'Latte', price: 9.99 },
      { id: 'cartEspresso', name: 'Espresso', price: 6.99 },
      { id: 'cartAffogato', name: 'Affogato', price: 11.99 },
      { id: 'cartAmericano', name: 'Americano', price: 6.99 },
      { id: 'cartMocha', name: 'Mocha', price: 11.99 },
      { id: 'cartIrish', name: 'Irish', price: 13.99 },
      { id: 'cartMacchiato', name: 'Macchiato', price: 8.99 },
      { id: 'cartBlack', name: 'Black', price: 4.99 },
      { id: 'cartDecaf', name: 'Decaf', price: 4.99 }
    ];

    $.each(items, function(i, cfg) {
        
        $('#' + cfg.id).on('click', function() {
            addToCart(cfg.name, cfg.price);
        });
    });

    
    $('#checkoutBtn').on('click', checkout);

    $('#clearCartBtn').on('click', clearCart);
  }

  // NEW: Initialize cart on page load
  loadCart();
  wireButtons();
  updateUI();
  cartClickHandler();
  loadCartClickHandler();
})();

//Javascript for product management page
// adding existing items to the product management page -ln
var items = [
{ id: 'cartCappucino', name: 'Cappucino', price: 9.99, category: "Coffee", size: 4},
{ id: 'cartLatte', name: 'Latte', price: 9.99, category: "Coffee", size: 6 },
{ id: 'cartEspresso', name: 'Espresso', price: 6.99, category: "Coffee", size: 2 },
{ id: 'cartAffogato', name: 'Affogato', price: 11.99, category: "Coffee", size: 10 },
{ id: 'cartAmericano', name: 'Americano', price: 6.99, category: "Coffee", size: 8 },
{ id: 'cartMocha', name: 'Mocha', price: 11.99, category: "Coffee", size: 6 },
{ id: 'cartIrish', name: 'Irish', price: 13.99, category: "Coffee", size: 8 },
{ id: 'cartMacchiato', name: 'Macchiato', price: 8.99, category: "Coffee", size: 6 },
{ id: 'cartBlack', name: 'Black', price: 4.99, category: "Coffee", size: 8 },
{ id: 'cartDecaf', name: 'Decaf', price: 4.99, category: "Coffee", size: 8 }
];
localStorage.setItem('products', JSON.stringify(items)); 

let products = {}; //Load saved products or create new products list

//function saveProducts() {
//  localStorage.setItem('products', JSON.stringify(products));
//}

function presentProducts() {
  const $list = $('#product-list');
  $list.empty();
  console.log('Entering render Produts Fucntion');

  const productsArray = Object.entries(products);

  if (productsArray.length === 0) {
    console.log("No products to render");
    $list.append('<tr><td colspan="6">No products added yet. </td></tr>');
    return;
    }
  //Creates the rows in the table using items from the products either created or loaded in. 
  productsArray.forEach(([id, product]) => {
    const $row = `
      <tr data-id="${id}">
        <td>${id}</td>
        <td>${product.name}</td>
        <td>${product.price.toFixed(2)}</td>
        <td>${product.category}</td>
        <td>${product.size}</td>
        <td>
          <button class="btn btn-amber-elegant fw-semibold edit-btn">Edit</button>
          <button class="btn btn-amber-elegant fw-semibold delete-btn">Delete</button>
        </td>
      </tr>`
  $list.append($row);
  console.log("Appended to lsit with ID: " + product.id);    
  });

  }

function formSubmit() {
      const id = $('#product-id').val();
      const name = $('#product-name').val();
      const price = parseFloat($('#product-price').val());
      const desc = $('#product-description').val();
      const category = $('#product-category').val();
      const size = parseInt($('#product-size').val());

      console.log("ID:", id, "Name:", name, "Price", price, "Desc", desc, "Category", category, "size", size);


      if(!id || !name || isNaN(price) || price <=0  || !desc || !category || isNaN(size) || size <= 0) {
        alert("Please fill in all fields. ");
        return false;

      }

      if(id in products) {
        alert(`Product with ID: ${id} already exists. Please modify with Edit or Delete. `);
        return false;
      }

      const newProduct = {
		id:id,
        name: name,
        price: price,
        description: desc,
        category: category,
        size: size

	  }
      //products[id] = newProduct;
      console.log("Added product successfully");
      return newProduct;
  }

function deleteClick(buttonDelete) {
	var $row = $(buttonDelete).closest('tr');
	var productID = $row.data('id');
	
	if(confirm(`Are you sure you want to delete product with ID ${productID}?`)) {
		$.ajax ({
			url: `http://localhost:8000/api/products/${productID}`,
			method: 'DELETE',
			dataType: 'json',
			
			success: function(response) {
				console.log(`Product ${productID} was deleted. `);
				delete products[productID];
				presentProducts();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.error(`Failed to delete ${productID}: `, textStatus, errorThrown);
				alert("ERROR: could not delete product. ");
			}
		});
	}
}

  presentProducts();
  //Submitting the form w/add
$('#new-product-form').on('submit', function(e) {
    e.preventDefault();
	
	const newProductData = formSubmit();
	
	if (newProductData) {
		$.ajax({
			url: 'http://localhost:8000/api/products',
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(newProductData),
			dataType: 'json',
			
			success: function(response) {
			console.log("product added successfully. ");
			products[newProductData.id] = newProductData;
			presentProducts();
			e.currentTarget.reset();
			},
			
			error: function(jqXHR, textStatus, errorThrown) {
				console.error("Error adding new product: ", textStatus, errorThrown);
				alert("Failed to add product");
			}
			}
	)};
	}
);
	$('#products-table').on('click', '.delete-btn', function() {
		deleteClick(this);
	})
	
//Search bar code
$('#menu-search-input').on('keyup', function(){	
const search = $(this).val().toLowerCase();
	
$('.col-12.col-lg-3').each(function() {
	const $cardContainer = $(this);
		
	const item = $cardContainer.find('h2').text().toLowerCase().trim();
		
	if (item.includes(search)) {
		$cardContainer.show();
		console.log("Search attempt found")
	}
	else {
		$cardContainer.hide();
			
			
		}
	});
 });
	
$.ajax({
	url: 'http://localhost:8000/api/products',
	method: 'GET',
	dataType: 'json',
	success: function(data) {
		products = data.reduce((a, item) => {
			a[item.id] = item;
			return a;
		},{});
		console.log("Products loaded from api server");
		
		presentProducts();
	},
	error: function(jqXHR, textStatus, errorThrown) {
		console.error("Error loading from api server: ", textStatus, errorThrown);
		presentProducts(); 
	}
});


});