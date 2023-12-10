export async function handleUnsubscribe(id) {
    const token = localStorage.getItem('token');
    const subscribeURL = `https://blog.kreosoft.space/api/community/${id}/unsubscribe`;

    try {
        const response = await fetch(subscribeURL, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            
        } else {
            console.error('Ошибка получения данных роли:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
    }
}

export async function handleSubscribe(id) {
    const token = localStorage.getItem('token');
    const subscribeURL = `https://blog.kreosoft.space/api/community/${id}/subscribe`;

    try {
        const response = await fetch(subscribeURL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            
        } else {
            console.error('Ошибка получения данных роли:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
    }
}