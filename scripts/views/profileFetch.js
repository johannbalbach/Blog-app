const requestURL = 'https://blog.kreosoft.space/api/account/profile'
const ProfileForm = document.getElementById('profileForm');
const SaveBtn = document.getElementById('saveBtn');

async function sendRequestPUT(body = null) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(requestURL, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {

    } else {
        // неправильный email или пароль
        SaveBtn.classList.add('error-animation');
        SaveBtn.style.backgroundColor = 'red';
        SaveBtn.style.borderColor = 'red'
        setTimeout(() => {
            SaveBtn.classList.remove('error-animation');
            SaveBtn.style.backgroundColor = '';
            SaveBtn.style.borderColor = ''
        }, 1000);
    }
  } catch (error) {
    console.error('Ошибка сети:', error);
  }
}
async function sendRequestGET(token) {
    // Отправка GET-запроса для получения данных
    try {
        const response = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            
            document.querySelector('#email').value = data.email || '';
            document.querySelector('#fullName').value = data.fullName || '';
            document.querySelector('#dob').value = data.birthDate.toString().split('T')[0] || '';
            document.querySelector('#gender').value = data.gender || '';
            document.querySelector('#phoneNumber').value = data.phoneNumber || '';
            return true;
        } else {
            console.error('Ошибка получения данных профиля:', response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Ошибка при выполнении GET-запроса:', error);
        return false;
    }
  }

ProfileForm.addEventListener('submit', async function(event) {
  event.preventDefault(); // предотвращает перезагрузку страницы при отправке формы
  if (!this.checkValidity()) {
    event.stopPropagation();
  } else { 
    const email = document.querySelector('#email').value;
    const fullName = document.querySelector('#fullName').value;
    const birthDate = document.querySelector('#dob').value;
    const gender = document.querySelector('#gender').value;
    const phoneNumber = document.querySelector('#phoneNumber').value;
  
    const body = {
      email: email,
      fullName: fullName,
      birthDate: birthDate,
      gender: gender,
      phoneNumber: phoneNumber
    }
    await sendRequestPUT(body);
  }

  this.classList.add('was-validated');
});

document.addEventListener('DOMContentLoaded', async function(event) {
    const token = localStorage.getItem('token');

    if (!sendRequestGET(token)) {
        window.location.href = 'http://localhost/login';
    }
    const birthDate = document.querySelector('#dob');
    const currentDate = new Date().toISOString().split('T')[0];
  
    birthDate.max = currentDate;
});