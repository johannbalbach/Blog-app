const requestURL = 'https://blog.kreosoft.space/api/community'

async function fetchCommunities() {
    try {
        const response = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const communities = await response.json();

            updateCommunitiesUI(communities);
        } else {
            console.error('Ошибка получения данных групп:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Ошибка при выполнении GET-запроса:', error);
    }
}

async function getRoleInCommunity(id) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`https://blog.kreosoft.space/api/community/${id}/role`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const role = await response.json();

            return role;
        } else {
            console.error('Ошибка получения данных роли:', response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Ошибка при выполнении GET-запроса:', error);
        return false;
    }
}

async function handleSubscribe(id) {
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

async function handleUnsubscribe(id) {
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


async function updateCommunitiesUI(communities) {
    const communitiesContainer = document.getElementById("communitiesContainer");

    communitiesContainer.innerHTML = '';

    communities.forEach(async community => {
        const communityElement = document.createElement("div");
        communityElement.className = "container-md col-auto rounded-3 bg-light border border-2 mb-4";

        communityElement.addEventListener('click', async (e) =>{
            window.location.href = `/communities/${community.id}`;
        })

        const communityBody = document.createElement("div");
        communityBody.className = "row mt-2";
        communityBody.innerHTML = `
            <div class="container-md col-8 mt-3 mb-3 justify-content-start">
                <div class="text-dark ms-3 fs-4">${community.name}</div>
            </div>
        `;

        const subscribeBtnContainer = document.createElement("div");
        subscribeBtnContainer.className = "container-md col-2 mt-3 mb-3 me-3 d-flex justify-content-end";

        const subscribeBtn = document.createElement("button");
        subscribeBtn.type = "button";
        subscribeBtn.className = "btn btn-primary ms-5 d-none";
        subscribeBtn.textContent = "Подписаться";

        const unsubscribeBtn = document.createElement("button");
        unsubscribeBtn.type = "button";
        unsubscribeBtn.className = "btn btn-danger ms-5 d-none";
        unsubscribeBtn.textContent = "Отписаться";

        subscribeBtn.addEventListener("click", async () => {
            unsubscribeBtn.className = "btn btn-danger ms-5";
            subscribeBtn.className = "btn btn-primary ms-5 d-none";

            await handleSubscribe(community.id);
        });

        unsubscribeBtn.addEventListener("click", async () => {
            subscribeBtn.className = "btn btn-primary ms-5";
            unsubscribeBtn.className = "btn btn-danger ms-5 d-none";

            await handleUnsubscribe(community.id);
        });

        subscribeBtnContainer.appendChild(subscribeBtn);
        subscribeBtnContainer.appendChild(unsubscribeBtn);

        await showButton(await getRoleInCommunity(community.id), subscribeBtn, unsubscribeBtn);
        
        communityBody.appendChild(subscribeBtnContainer);
        communityElement.appendChild(communityBody);
        communitiesContainer.appendChild(communityElement);
    });
}

async function showButton(role, subscribeBtn, unsubscribeBtn){
    if (role == "Administrator"){
        return;
    }
    if (role == "Subscriber"){
        unsubscribeBtn.className = "btn btn-danger ms-5";
        return;
    }
    if (role == null){
        subscribeBtn.className = "btn btn-primary ms-5";
        return;
    }
}

document.addEventListener("DOMContentLoaded", async function (e) {
    await fetchCommunities();
});