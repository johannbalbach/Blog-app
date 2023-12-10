const requestURL = 'https://blog.kreosoft.space/api/account/register'
const registerForm = document.getElementById('registerForm');
const registerBtn = document.getElementById('registerBtn');



document.addEventListener("DOMContentLoaded", function (e) {
  const birthDate = document.querySelector('#dob');
  const currentDate = new Date().toISOString().split('T')[0];

  birthDate.max = currentDate;
});

async function enterBlog(Token) {
    localStorage.setItem('token', Token);
    window.location.href = '/';
}

async function sendRequest(body = null) {
  try {
    const response = await fetch(requestURL, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
        const responseData = await response.json();
        const token = responseData.token;
        await enterBlog(token);
    } else {
        // неправильный email или пароль
        registerBtn.classList.add('error-animation');
        registerBtn.style.backgroundColor = 'red';
        registerBtn.style.borderColor = 'red'
        setTimeout(() => {
            registerBtn.classList.remove('error-animation');
            registerBtn.style.backgroundColor = '';
            registerBtn.style.borderColor = ''
        }, 1000);
    }
  } catch (error) {
    console.error('Ошибка сети:', error);
  }
}


registerForm.addEventListener('submit', async function(event) {
  event.preventDefault(); // предотвращает перезагрузку страницы при отправке формы
  if (!this.checkValidity()) {
    event.stopPropagation();
  } else { 
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const fullName = document.querySelector('#fullName').value;
    const birthDate = document.querySelector('#dob').value;
    const gender = document.querySelector('#gender').value;
    const phoneNumber = document.querySelector('#phoneNumber').value;
  
    const body = {
        fullName: fullName,
        password: password,
        email: email,
        birthDate: birthDate,
        gender: gender,
        phoneNumber: phoneNumber
    }
    await sendRequest(body);
  }

  this.classList.add('was-validated');
});