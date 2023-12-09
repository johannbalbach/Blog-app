const requestURL = 'https://blog.kreosoft.space/api/account/login'
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtnMain');

async function enterBlog(Token) {
  localStorage.setItem('token', Token);

  window.location.href = '/homepage';
}

async function sendRequest(method, url, body = null) {
  try {
    const response = await fetch(url, {
      method: method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const responseData = await response.json();
      const token = responseData.token;
      await enterBlog(token);
    } else {
      // неправильный email или пароль
      loginBtn.classList.add('error-animation');
      loginBtn.style.backgroundColor = 'red';
      loginBtn.style.borderColor = 'red'
      setTimeout(() => {
        loginBtn.classList.remove('error-animation');
        loginBtn.style.backgroundColor = '';
        loginBtn.style.borderColor = ''
      }, 1000);
    }
  } catch (error) {
    console.error('Ошибка сети:', error);
  }
}

loginForm.addEventListener('submit', async function(event) {
  event.preventDefault(); // предотвращает перезагрузку страницы при отправке формы
  if (!this.checkValidity()) {
    event.stopPropagation();
  } else { //функция логина(потом вернуть/подумать)
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
  
    const body = {
      email: email,
      password: password
    }
    await sendRequest('POST', requestURL, body);
  }

  this.classList.add('was-validated');
});