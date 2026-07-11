const form = document.getElementById('expense-form');
const list = document.getElementById('expense-list');
const totalEl = document.getElementById('total');
const categoryTotalsEl = document.getElementById('category-totals');
const exportBtn = document.getElementById('export-btn');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

function save() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function render() {
  list.innerHTML = '';
  let total = 0;
  const categoryTotals = {};

  expenses.forEach((exp, index) => {
    total += exp.amount;
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${exp.date}</td>
      <td><span class="category-tag ${exp.category}">${exp.category}</span></td>
      <td>${exp.note || '-'}</td>
      <td>$${exp.amount.toFixed(2)}</td>
      <td><button class="delete-btn" data-index="${index}">✕</button></td>
    `;
    list.appendChild(row);
  });

  totalEl.textContent = `$${total.toFixed(2)}`;

  categoryTotalsEl.innerHTML = Object.entries(categoryTotals)
    .map(([cat, amt]) => `<span class="category-tag ${cat}">${cat}: $${amt.toFixed(2)}</span>`)
    .join(' ');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;
  const note = document.getElementById('note').value;

  expenses.push({ amount, category, date, note });
  save();
  render();
  form.reset();
});

list.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const index = e.target.dataset.index;
    expenses.splice(index, 1);
    save();
    render();
  }
});

exportBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(expenses, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'expenses.json';
  a.click();
  URL.revokeObjectURL(url);
});

render();
