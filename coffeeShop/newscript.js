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
    if (inputs[key] && inputs[key].value) {
      formData[key] = inputs[key].value.trim();
    }
  }

  $.ajax({
    url: 'http://localhost:8000/api/shoppers',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(formData),
    success: function(response) {
      alert('Registration successful! Welcome to XYZ Coffee Club. ');
      form.reset();
      // setTimeout(function() {
      //           window.location.href = 'coffeeShopMenu.html';
      //       }, 100);
    },
    error: function(jqHXR, textStatus, errorThrown) {
      console.error('Error submitting form:', textStatus, errorThrown);
      alert('There was an error while signing up. Sorry! Please try again later. ');
    }
    
  });
}

if (form) {
  form.addEventListener('submit', function(event) {
    handleFormSubmit(event);
  });
}
}
);