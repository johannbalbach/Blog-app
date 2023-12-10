const LogOutURL = 'https://blog.kreosoft.space/api/account/logout'
const ProfileURL = 'https://blog.kreosoft.space/api/account/profile'

async function GetUserName()
{
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(ProfileURL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();

            updateUI(data.email);
        } 
        else {
            
        }
    } catch (error) {
        console.error('Ошибка при выполнении GET-запроса:', error);
    }
}

async function sendRequestLogout()
{
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(LogOutURL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        } else {
            console.error('Ошибка получения данных профиля:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Ошибка при выполнении GET-запроса:', error);
    }
}

async function updateUI(email){
    document.querySelector('#navbarDropdown').textContent = email || '';

    document.getElementById('profileLink').classList.remove("d-none");
    document.getElementById('homepageLink').classList.remove("d-none");
    document.getElementById('writepostLink').classList.remove("d-none");
    document.getElementById('communitiesLink').classList.remove("d-none");
    document.getElementById('authorLink').classList.remove("d-none");
    document.getElementById('loginBtn').classList.add("d-none");
}

document.getElementById('logoutBtn').addEventListener('click', async function() {
    await sendRequestLogout();
});

document.addEventListener('DOMContentLoaded', async function(event) {
    await GetUserName();
});
