import { createAddressElement } from "../Address.js";

const PostForm = document.getElementById('newpostForm');

$(document).ready(async function() {
    await GetTags();
    const communities = await getMyCommunities();
    const capableCommunities = [];
    
    communities.forEach(community => {
        if (community.role == "Administrator"){
            capableCommunities.push(community)
        }
    });

    if (capableCommunities.length > 0){
        await updateCommunitiesUI(capableCommunities);
    }

    const communityId = localStorage.getItem('communityId');
    if (communityId) {
        const communitiesSelect = document.getElementById('communities');
    
        const optionToSelect = Array.from(communitiesSelect.options).find(option => option.value == communityId);
        if (optionToSelect) {
          optionToSelect.selected = true;
        }
    
        localStorage.removeItem('communityId');
    }

    // $('#region').select2();

    // $('#region').on('change', async function(e) {
    //     console.log("Change event fired");
    //     const AddressContainer = document.getElementById('AddressContainer');

    //     await createAddressElement(this.selectedOptions[0].value, null, AddressContainer);
    // });

});




PostForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // предотвращает перезагрузку страницы при отправке формы
    if (!this.checkValidity()) {
      event.stopPropagation();
    } else { 
        const tags = Array.from(document.getElementById('tags').selectedOptions).map(option => option.value);
        const postName = document.querySelector('#postName').value;
        const readingTime = document.querySelector('#readingTime').value || 0;
        const communities = document.querySelector('#communities').value;
        const mainText = document.querySelector('#mainText').value;
        const image = document.querySelector('#image').value || '';

        const body = {
            title: postName,
            description: mainText,
            readingTime: readingTime,
            image: image,
            tags: tags
        }

        if (image == ""){
            delete body.image;
        }

        console.log(body, image);
        await createPost(body, communities);
    }
  
    this.classList.add('was-validated');
  });

async function getMyCommunities() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`https://blog.kreosoft.space/api/community/my`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const communities = await response.json();

            return communities;
        } else {
            console.error('Ошибка получения данных роли:', response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Ошибка при выполнении GET-запроса:', error);
        return false;
    }
}

async function createPost(body, id) {
    let URL = `https://blog.kreosoft.space/api/post`;
    if (id != 0){
        URL = `https://blog.kreosoft.space/api/community/${id}/post`
    }
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            location.reload();
        } else {
            console.error('Ошибка создания поста:', response.status, response.statusText);

            const saveBtn = document.getElementById("saveBtn");
            // неправильный email или пароль
            saveBtn.classList.add('error-animation');
            saveBtn.style.backgroundColor = 'red';
            saveBtn.style.borderColor = 'red'
            setTimeout(() => {
                saveBtn.classList.remove('error-animation');
                saveBtn.style.backgroundColor = '';
                saveBtn.style.borderColor = ''
            }, 1000);
        }
    } catch (error) {
        console.error('Ошибка при выполнении GET-запроса:', error);
    }
}

async function getConcreteCommunities(id) {
    try {
        const response = await fetch(`https://blog.kreosoft.space/api/community/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const info = await response.json();

            return info;
        } else {
            console.error('Ошибка получения данных роли:', response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Ошибка при выполнении GET-запроса:', error);
        return false;
    }
}


async function GetTags() {
    const tagURL = 'https://blog.kreosoft.space/api/tag'
    try {
        const response = await fetch(tagURL, {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const tags = await response.json();
            await UpdateTags(tags);
        } else {
            console.error("Ошибка получения данных постов:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function UpdateTags(tags){
    const tagMenu = document.getElementById('tags');
    tagMenu.innerHTML = '';

    tags.forEach((tag) => {
        const optionElement = document.createElement("option");
        optionElement.value = tag.id;
        optionElement.textContent = tag.name;
        tagMenu.appendChild(optionElement);
    });
}

async function updateCommunitiesUI(communitiesList){
    const communities = document.getElementById('communities');
    const tags = document.getElementById('tags');

    tags.parentElement.classList.remove('col-md-12');
    tags.parentElement.classList.add('col-md-6');
    communities.parentElement.classList.remove('d-none');

    communities.innerHTML = '<option value="0" selected>---</option>';
    for (const community of communitiesList) {
        const optionElement = document.createElement("option");
        optionElement.value = community.communityId;
        optionElement.textContent = (await getConcreteCommunities(community.communityId)).name;
        communities.appendChild(optionElement);
      }
}

