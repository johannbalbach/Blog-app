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

async function checkSubscribe(id) {
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
async function handleSubscribe(id, IsItSubscribe) {
    let subscribeURL = '';
    let method = '';
    const token = localStorage.getItem('token');

    if (IsItSubscribe){
        subscribeURL = `https://blog.kreosoft.space/api/community/${id}/subscribe`;
        method = 'POST';
    }
    else{
        subscribeURL = `https://blog.kreosoft.space/api/community/${id}/unsubscribe`;
        method = 'DELETE';
    }
    try {
        const response = await fetch(subscribeURL, {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const answer = await response.json();

            return true;
        } else {
            console.error('Ошибка получения данных роли:', response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Ошибка при выполнении GET-запроса:', error);
        return false;
    }
}

async function updateCommunitiesUI(communities) {
    const communitiesContainer = document.getElementById("communitiesContainer");

    communitiesContainer.innerHTML = '';

    communities.forEach(community => {
        const communityElement = document.createElement("div");
        communityElement.className = "container-md col-auto bg-light border border-2 mb-4";

        const communityBody = document.createElement("div");
        communityBody.className = "row mt-2";
        communityBody.innerHTML = `
            <div class="col-md-6 mt-3 mb-3">
                <h4 class="text-dart">${community.name}</h4>
            </div>
        `;

        const subscribeBtn = createSubscribeButton(community.id, community.isSubscribed);
        
        const subscribeBtnContainer = document.createElement("div");
        subscribeBtnContainer.className = "col-md-6 mt-3 mb-3";
        subscribeBtnContainer.appendChild(subscribeBtn);

        communityBody.appendChild(subscribeBtnContainer);
        communityElement.appendChild(communityBody);
        communitiesContainer.appendChild(communityElement);
    });
}

function createSubscribeButton(communityId, isSubscribed) {
    const subscribeBtn = document.createElement("button");
    subscribeBtn.type = "button";
    subscribeBtn.className = isSubscribed ? "btn btn-danger" : "btn btn-primary";
    subscribeBtn.textContent = isSubscribed ? "Отписаться" : "Подписаться";
    
    subscribeBtn.addEventListener("click", async () => {
        const success = await handleSubscribe(communityId, !isSubscribed);

        if (success) {
            updateCommunitiesUI(communities);
        }
    });

    return subscribeBtn;
}

document.addEventListener("DOMContentLoaded", async function (e) {
    await fetchCommunities();
});