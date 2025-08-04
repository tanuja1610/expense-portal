document.getElementById('expenseForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  formData.set('is_multi_day', form.is_multi_day.checked ? 'true' : 'false');

  try {
    const res = await fetch('http://localhost:3000/api/expenses', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    alert(data.message || 'Expense submitted!');
    form.reset();
  } catch (err) {
    console.error(err);
    alert('Submission failed.');
  }
});


async function loadSubmittedExpenses() {
  const userId = 1; // Replace with logged-in user's ID
  try {
    const res = await fetch(`http://localhost:3000/api/bdm/expenses?user_id=${userId}`);
    const expenses = await res.json();

    const tbody = document.querySelector('#expensesTable tbody');
    tbody.innerHTML = '';

    expenses.forEach(exp => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${exp.id}</td>
        <td>${new Date(exp.expense_date).toLocaleDateString()}</td>
        <td>₹${exp.amount}</td>
        <td>${exp.status || 'Pending'}</td>
        <td>${exp.category_id}</td>
        <td>
          ${exp.bills
            ? exp.bills.split(',').map(file =>
                `<a href="http://localhost:3000/uploads/${file}" target="_blank">View</a>`
              ).join(', ')
            : '—'}
        </td>
      `;

      tbody.appendChild(row);
    });
  } catch (err) {
    console.error('Error loading expenses:', err);
  }
}


loadSubmittedExpenses();
