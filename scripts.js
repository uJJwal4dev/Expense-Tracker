const API_KEY = '203acfc684a78de99be2639b';
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let exchangeRates = {};

const expenseForm = document.getElementById('add-expense-form');
const expensesList = document.getElementById('expenses');
const converterForm = document.getElementById('convert-currency-form');
const conversionResult = document.getElementById('conversion-result');
const spendingChart = document.getElementById('spending-chart');

function generateCurrencyOptions(selector, defaultCurrency = 'USD') {
    const currencies = {
        'USD': 'US Dollar',
        'EUR': 'Euro',
        'GBP': 'British Pound',
        'INR': 'Indian Rupee',
        'JPY': 'Japanese Yen',
        'AUD': 'Australian Dollar',
        'CAD': 'Canadian Dollar',
        'CHF': 'Swiss Franc',
        'CNY': 'Chinese Yuan',
        'AED': 'UAE Dirham'
    };

    const select = document.getElementById(selector);
    select.innerHTML = '';

    Object.entries(currencies).forEach(([code, name]) => {
        const option = document.createElement('option');
        option.value = code;
        option.selected = code === defaultCurrency;
        option.textContent = `${code} - ${name}`;
        select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
        updateSelectFlag(select);
    });

    updateSelectFlag(select);
}

function updateSelectFlag(select) {
    const code = select.value;
    const flagUrl = getCurrencyFlag(code);
    select.style.backgroundImage = `url(${flagUrl})`;
}

// Updated fetchExchangeRates function
async function fetchExchangeRates() {
    try {
        const response = await fetch(`${BASE_URL}/latest/USD`);
        const data = await response.json();
        
        if (data.result === "success") {
            exchangeRates = data.conversion_rates;
            console.log('Exchange rates loaded:', exchangeRates);
        } else {
            throw new Error('Failed to fetch rates');
        }
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
    }
}

function getCurrencyFlag(currencyCode) {
    const countryCode = currencyCode.slice(0, 2).toLowerCase();
    return `https://flagcdn.com/24x18/${countryCode}.png`;
}

function sortExpenses(expenses, sortBy) {
    const sortedExpenses = [...expenses];
    
    switch(sortBy) {
        case 'date-new':
            sortedExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'date-old':
            sortedExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'amount-high':
            sortedExpenses.sort((a, b) => b.amount - a.amount);
            break;
        case 'amount-low':
            sortedExpenses.sort((a, b) => a.amount - b.amount);
            break;
        case 'name':
            sortedExpenses.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'category':
            sortedExpenses.sort((a, b) => a.category.localeCompare(b.category));
            break;
    }
    
    return sortedExpenses;
}

function capitalizeWords(str) {
    return str.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

expenseForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let nameInput = document.querySelector('#expense-name');
    let amountInput = document.querySelector('#expense-amount');
    let categoryInput = document.querySelector('#expense-category');
    let currencyInput = document.querySelector('#expense-currency');
    
    const expense = {
        id: Date.now(),
        name: capitalizeWords(nameInput.value),
        amount: parseFloat(amountInput.value),
        category: capitalizeWords(categoryInput.value),
        currency: currencyInput.value,
        date: new Date().toISOString()
    };
    
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    
    nameInput.value = '';
    amountInput.value = '';
    categoryInput.selectedIndex = 0;
    currencyInput.value = 'INR';
    
    renderExpenses();
    updateChart();
    
    window.alert('Expense added successfully!');
});

function renderExpenses() {
    const sortBy = document.getElementById('sort-by').value;
    const sortedExpenses = sortExpenses(expenses, sortBy);
    
    expensesList.innerHTML = '';
    sortedExpenses.forEach(expense => {
        const li = document.createElement('li');
        li.className = 'expense-item';
        const date = new Date(expense.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        li.innerHTML = `
            <span>
                ${expense.name} - ${expense.amount} ${expense.currency} (${capitalizeFirstLetter(expense.category)}) - ${date}
            </span>
            <button onclick="deleteExpense(${expense.id})">Delete</button>
        `;
        expensesList.appendChild(li);
    });
}

function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderExpenses();
    updateChart();
}

converterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('convert-amount').value);
    const fromCurrency = document.getElementById('convert-from').value;
    const toCurrency = document.getElementById('convert-to').value;
    
    try {
        conversionResult.textContent = 'Converting...';
        
        if (fromCurrency === toCurrency) {
            conversionResult.textContent = `${amount} ${fromCurrency} = ${amount.toFixed(2)} ${toCurrency}`;
            return;
        }

        const response = await fetch(`${BASE_URL}/pair/${fromCurrency}/${toCurrency}/${amount}`);
        const data = await response.json();

        if (data.result === "success") {
            const convertedAmount = data.conversion_result;
            conversionResult.innerHTML = `
                <img src="${getCurrencyFlag(fromCurrency)}" alt="${fromCurrency} flag" class="currency-flag">
                ${amount} ${fromCurrency} = 
                <img src="${getCurrencyFlag(toCurrency)}" alt="${toCurrency} flag" class="currency-flag">
                ${convertedAmount.toFixed(2)} ${toCurrency}
            `;
        } else {
            throw new Error('Conversion failed');
        }

    } catch (error) {
        console.error('Conversion error:', error);
        conversionResult.textContent = 'Error: Unable to perform conversion. Please try again.';
    }
});

let expenseChart = null;

function updateExpenseStats() {
    // Convert highest expense to INR
    const highestExpense = expenses.reduce((max, expense) => {
        const amountInINR = expense.currency === 'INR' 
            ? expense.amount 
            : (expense.amount * (exchangeRates['INR'] / exchangeRates[expense.currency]));
        return amountInINR > max.amount ? {amount: amountInINR, currency: 'INR'} : max;
    }, { amount: 0, currency: 'INR' });
    
    const categoryCount = {};
    expenses.forEach(expense => {
        categoryCount[expense.category] = (categoryCount[expense.category] || 0) + 1;
    });
    const mostCommonCategory = Object.entries(categoryCount)
        .reduce((max, [category, count]) => 
            count > max.count ? {category, count} : max, 
            {category: 'none', count: 0}
        );

    const currentMonth = new Date().getMonth();
    const thisMonthTotal = expenses
        .filter(expense => new Date(expense.date).getMonth() === currentMonth)
        .reduce((sum, expense) => {
            const amountInINR = expense.currency === 'INR'
                ? expense.amount
                : (expense.amount * (exchangeRates['INR'] / exchangeRates[expense.currency]));
            return sum + amountInINR;
        }, 0);

    document.getElementById('highest-expense').textContent = 
        `₹${highestExpense.amount.toFixed(2)}`;
    document.getElementById('common-category').textContent = 
        mostCommonCategory.category.charAt(0).toUpperCase() + 
        mostCommonCategory.category.slice(1);
    document.getElementById('month-total').textContent = 
        `₹${thisMonthTotal.toFixed(2)}`;
}

function updateChart() {
    const categoryTotals = {};
    expenses.forEach(expense => {
        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += expense.amount;
    });

    if (expenseChart) expenseChart.destroy();

    expenseChart = createExpenseChart(categoryTotals);
    
    updateExpenseStats();
}

async function showDefaultConversion() {
    const fromCurrency = document.getElementById('convert-from').value;
    const toCurrency = document.getElementById('convert-to').value;
    
    try {
        const response = await fetch(`${BASE_URL}/pair/${fromCurrency}/${toCurrency}/1`);
        const data = await response.json();

        if (data.result === "success") {
            const convertedAmount = data.conversion_result;
            conversionResult.innerHTML = `
                <img src="${getCurrencyFlag(fromCurrency)}" alt="${fromCurrency} flag" class="currency-flag">
                1 ${fromCurrency} = 
                <img src="${getCurrencyFlag(toCurrency)}" alt="${toCurrency} flag" class="currency-flag">
                ${convertedAmount.toFixed(2)} ${toCurrency}
            `;
        }
    } catch (error) {
        console.error('Error showing default conversion:', error);
        conversionResult.textContent = 'Unable to load default conversion rate.';
    }
}

async function init() {
    await fetchExchangeRates();
    generateCurrencyOptions('convert-from', 'USD');
    generateCurrencyOptions('convert-to', 'EUR');
    generateCurrencyOptions('expense-currency', 'INR');
    renderExpenses();
    updateChart();
    showDefaultConversion();
}

document.getElementById('convert-from').addEventListener('change', showDefaultConversion);
document.getElementById('convert-to').addEventListener('change', showDefaultConversion);

document.getElementById('sort-by').addEventListener('change', renderExpenses);

init();

