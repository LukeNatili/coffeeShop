
const form = document.getElementById('shopperForm');
const tableBody = document.querySelector('#shopperTable tbody');
const search = document.getElementById('search');
const yearEl = document.getElementById('year');
const resetBtn = document.getElementById('resetBtn');
const exportBtn = document.getElementById('exportBtn');
const editingIndex = document.getElementById('editingIndex');


const inputs = {
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
const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];
const selectState = document.getElementById('state');
console.log('Select Element Found:', selectState);
states.forEach(stateCode => {
    const option = document.createElement('option');
    option.value = stateCode;
    option.textContent = stateCode;

    selectState.appendChild(option);
});

/* The regex originally was not working and I could not fix it so I made is a separate js function - LP */
function isValidNumber(phone) {
    const phonePatter = /^[0-9+ ()-]{7,}$/;
    return phonePatter.test(phone);
}

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function isValidAddress(address) {
    const addressPattern = /^[0-9]+ +[a-zA-Z0-9\s,'-]+$/;
    return addressPattern.test(address);
}



function handleFormSubmit(event){
    event.preventDefault();
    if (!inputs.firstName.value || !inputs.lastName.value || !inputs.city.value || !inputs.state.value || !inputs.zip.value || !inputs.age.value) {
        alert('Please fill in all required fields.');
        return;}

    else if(!isValidNumber(inputs.phone.value)) {
        alert('Please enter a valid phone number. ');
        inputs.phone.classList.add('is-invalid');
        return;
    }
    else if (!isValidEmail(inputs.email.value)) {
        alert('Please enter a valid email address.');
        inputs.email.classList.add('is-invalid');
        return;
    }
    else if (!isValidAddress(inputs.address.value)) {
        alert('Please enter a valid address. ');
        inputs.address.classList.add('is-invalid');
        return;
    }
    

    inputs.phone.classList.remove('is-invalid');
    inputs.email.classList.remove('is-invalid');
    inputs.address.classList.remove('is-invalid');

    const formData = {};
    for (const key in inputs){
        formData[key] = inputs[key].value.trim();
    }
    console.log(formData);

    const jsonString = JSON.stringify(formData);
    console.log(jsonString);
}


form.addEventListener('submit', function(event) {
    handleFormSubmit(event);});