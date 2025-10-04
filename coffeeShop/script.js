
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


/* Utilities */
yearEl.textContent = new Date().getFullYear();
const storageKey = 'bb_shoppers_v1';
const load = () => { try { return JSON.parse(localStorage.getItem(storageKey)) || []; } catch { return []; } };
const save = list => localStorage.setItem(storageKey, JSON.stringify(list));
const toObj = () => Object.fromEntries(Object.entries(inputs).map(([k,el])=>[k, el.type==='range'? Number(el.value): el.value.trim()]));
const clearForm = () => { form.reset(); editingIndex.value=''; form.classList.remove('was-validated'); };
const fullName = s => `${s.firstName} ${s.lastName}`.trim();

/* Render table rows (filtered by search) */
function render(list){
const q = search.value.trim().toLowerCase();
tableBody.innerHTML = '';
list.filter(s => !q || fullName(s).toLowerCase().includes(q) || s.email.toLowerCase().includes(q))
    .forEach((s,i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${fullName(s)}</td>
        <td>${s.email}</td>
        <td>${s.favorite}</td>
        <td>${s.perks}</td>
        <td class="text-end">
            <button class="btn btn-sm btn-dark me-2" type="button" data-action="edit" data-index="${i}">Edit</button>
            <button class="btn btn-sm btn-outline-danger" type="button" data-action="delete" data-index="${i}">Delete</button>
        </td>`;
        tableBody.appendChild(tr);
    });
}

/* Create or update a shopper; uses hidden input to track edit index */
function upsert(e){
e.preventDefault();
e.stopPropagation();
if(!form.checkValidity()){ form.classList.add('was-validated'); return; }
const list = load();
const obj = toObj();
const idx = editingIndex.value === '' ? -1 : Number(editingIndex.value);
if(idx >= 0){ list[idx] = obj; } else { list.push(obj); }
save(list);
clearForm();
render(list);
}

/* Table actions: Edit fills the form; Delete removes the record */
function handleTable(e){
const btn = e.target.closest('button');
if(!btn) return;
const idx = Number(btn.dataset.index);
const list = load();
if(btn.dataset.action === 'edit'){
    const s = list[idx];
    Object.entries(inputs).forEach(([k,el]) => { el.value = (k==='sweetness') ? s[k] : s[k] ?? ''; });
    editingIndex.value = String(idx);
    window.scrollTo({top: document.getElementById('new').offsetTop - 80, behavior: 'smooth'});
} else if(btn.dataset.action === 'delete'){
    list.splice(idx,1);
    save(list);
    render(list);
}
}

/* Export all shoppers as pretty-printed JSON */
function exportJSON(){
const data = JSON.stringify(load(), null, 2);
const blob = new Blob([data], {type:'application/json'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url; a.download = 'shoppers.json';
document.body.appendChild(a); a.click(); a.remove();
URL.revokeObjectURL(url);
}

/* Wiring */
search.addEventListener('input', ()=>render(load()));
tableBody.addEventListener('click', handleTable);
form.addEventListener('submit', upsert);
resetBtn.addEventListener('click', clearForm);
exportBtn.addEventListener('click', exportJSON);
document.addEventListener('DOMContentLoaded', ()=>render(load()));
  