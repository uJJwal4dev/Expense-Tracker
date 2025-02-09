# Personal Budget and Expense Tracker 💰

Hey there! 👋 This is my cool expense tracker project that I made to help manage money and track expenses. It's built using HTML, CSS, and JavaScript.

## 🌟 Features

- **Add Expenses** ✏️
  - Enter expense name
  - Add amount
  - Choose category (Food, Transport, etc.)
  - Select currency

- **Currency Converter** 🔄
  - Convert between different currencies
  - See real-time exchange rates
  - Includes currency flags
  - Shows default conversion rate

- **Expense Overview** 📊
  - Nice donut chart showing expenses by category
  - Sort expenses by:
    - Date (newest/oldest)
    - Amount (highest/lowest)
    - Name (A-Z)
    - Category

- **Cool Stats** 📈
  - See your highest expense
  - Most used category
  - This month's total spending

## 🚀 How to Use

1. **Visit the Live Site**
   - Go to: [Personal Budget Tracker](https://ujjwal4dev.github.io/Expense-Tracker/)
   - No installation needed - works right in your browser!

2. **Start Managing Your Expenses**
   - Click "Add Expense" to record new spending
   - Enter the name, amount, and category
   - Choose your preferred currency
   - Your expense will appear in the list

3. **Use the Currency Converter**
   - Enter any amount
   - Select currencies to convert between
   - Get instant conversion rates
   - Includes flags for easy currency identification

4. **Track Your Spending**
   - View the donut chart for spending breakdown
   - Sort expenses by date, amount, or category
   - See your highest expense
   - Monitor monthly totals
   - All amounts are shown in INR for easy comparison

5. **Save Your Data**
   - All expenses are automatically saved
   - Data persists even after closing the browser
   - Works offline once loaded

**Note**: Internet connection required for currency conversion features.

## 🔧 Technologies Used

- HTML - for the webpage structure
- CSS - to make it look pretty
- JavaScript - to make it work
  - Async/Await for API calls
  - localStorage for data persistence
  - Modern ES6+ features
- ApexCharts - for the cool donut chart
- Exchange Rate API - for currency conversion

## 💡 What I Learned

- How to use APIs with async/await
  - Better handling of asynchronous operations
  - Cleaner code than using Promises or callbacks
  - Error handling with try/catch
  - Making multiple API calls
- Working with charts
- Managing data in localStorage
- Currency conversion
- Sorting and filtering data
- Making responsive designs
- localStorage use for data persistence
- Extensive use of Async/Await over promises and callbacks

## 🎯 Future Improvements

Things I want to add later:
- Export expenses to Excel
- Add more charts
- Make it work offline
- Add budget limits
- Add expense categories

## 👋 Credits

Made with ❤️ as a learning project in college.
Exchange rates provided by exchangerate-api.com
Charts powered by ApexCharts

## 📝 Note

Make sure you have an internet connection for the currency conversion to work!

## 📝 Code Examples

```javascript
// Using async/await instead of Promises
async function fetchExchangeRates() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Old Promise way
function fetchExchangeRates() {
    return fetch(API_URL)
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error:', error));
}

// Even older callback way
function fetchExchangeRates(callback) {
    fetch(API_URL)
        .then(function(response) {
            response.json().then(function(data) {
                callback(null, data);
            });
        })
        .catch(function(error) {
            callback(error);
        });
}
