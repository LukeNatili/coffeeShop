
/* Data bindings */
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
favorite: document.getElementById('favorite'),
loyalty: document.getElementById('loyalty'),
perks: document.getElementById('perksSelect'),
notes: document.getElementById('notes')
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


