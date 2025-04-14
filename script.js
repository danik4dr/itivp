const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const amountInput = document.getElementById('amount');
const form = document.getElementById('converter-form');
const resultDiv = document.getElementById('result');
const loadingDiv = document.getElementById('loading');
const progressText = document.getElementById('progress-text');
const progressFill = document.getElementById('progress-fill');

const currencyList = ["USD", "EUR", "GBP", "JPY", "CNY", "BYN"];

currencyList.forEach(currency => {
  const option1 = document.createElement('option');
  option1.value = currency;
  option1.textContent = currency;
  fromCurrency.appendChild(option1);

  const option2 = document.createElement('option');
  option2.value = currency;
  option2.textContent = currency;
  toCurrency.appendChild(option2);
});

fromCurrency.value = "BYN";
toCurrency.value = "USD";

function simulateLoadingProgress(callback) {
  let progress = 0;
  loadingDiv.style.display = 'block';
  progressFill.style.width = '0%';
  progressText.textContent = 'Загрузка: 0%';

  const interval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      callback(); 
    }
    progressText.textContent = `Загрузка: ${Math.floor(progress)}%`;
    progressFill.style.width = `${progress}%`;
  }, 100);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('Form submitted');

  const from = fromCurrency.value;
  const to = toCurrency.value;
  const amount = parseFloat(amountInput.value);
  console.log(`Fetching: from=${from}, to=${to}, amount=${amount}`);

  if (!amount || amount <= 0) {
    alert('Пожалуйста, введите действительное число');
    return;
  }

  resultDiv.textContent = '';
  simulateLoadingProgress(async () => {
    try {
      const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
      const data = await response.json();
      console.log('API Response:', data);

      if (data.result === "error") {
        resultDiv.textContent = `API Error: ${data['error-type']}`;
        return;
      }

      const rate = data.rates[to];
      if (!rate) {
        resultDiv.textContent = 'Коэффициент конверсии не найден.';
        return;
      }

      const converted = amount * rate;
      resultDiv.textContent = `Итого: ${converted.toFixed(2)} ${to}`;
    } catch (error) {
      console.error('Ошибка извлечения:', error);
      resultDiv.textContent = 'Ошибка извлечения данных.';
    } finally {
      loadingDiv.style.display = 'none';
      progressFill.style.width = '0%';
      progressText.textContent = '';
    }
  });
});
