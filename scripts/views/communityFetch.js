import {updatePostsUI} from "../postCreate.js";
import { GetTags } from "../Tags.js";
import {updatePage} from "../pagination.js";
import {updateActivePage} from "../pagination.js";
import {updatePagination} from "../pagination.js";
import {getFiltersFromURL} from "../pagination.js";
import { getUrlParams } from "../pagination.js";
import { handleUnsubscribe } from "../subscribeHandler.js";
import { handleSubscribe } from "../subscribeHandler.js";

const pageSizer = document.getElementById('pageSize');
const leftPage = document.getElementById('leftPage');
const rightPage = document.getElementById('rightPage');
const firstPage = document.getElementById('firstPage');
const secondPage = document.getElementById('secondPage');
const thirdPage = document.getElementById('thirdPage');
const subscribeBtn = document.getElementById('subscribeBtn');
const unsubscribeBtn = document.getElementById('unsubscribeBtn');

let maxPages = 1;

document.addEventListener("DOMContentLoaded", async function () {
    await GetTags();
    const {communityId,  page, pageSize} = await getUrlParams();

    setFilters(await getFiltersFromURL());

    const communityPosts = await getCommunityPosts(getFilters(communityId, page, pageSize));
    if (communityPosts){
        await updatePostsUI(communityPosts.posts);
    }

    const communityInfo = await getConcreteCommunity(communityId);
    await updateCommunityUI(communityInfo, communityId);

    if (parseInt(page) % 3 === 0){
        await updatePagination(page - 2);
        await updateActivePage(page, maxPages);
    }
    if (parseInt(page) % 3 === 1){
        await updatePagination(parseInt(page));
        await updateActivePage(page, maxPages);
    }
    if (parseInt(page) % 3 === 2){
        await updatePagination(parseInt(page) - 1);
        await updateActivePage(page), maxPages;
    }
});

async function getCommunityPosts(filters) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(generateApiUrl(filters), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const info = await response.json();
            maxPages = info.pagination.count;

            return info;
        } else {
            console.error('Ошибка получения поста:', response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Ошибка при выполнении GET-запроса:', error);
        return false;
    }
}

async function getConcreteCommunity(id){
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`https://blog.kreosoft.space/api/community/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const info = await response.json();

            return info;
        } else {
            console.error('Ошибка получения группы:', response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Ошибка при выполнении GET-запроса:', error);
        return false;
    }
}

async function updateCommunityUI(info, id){
    document.getElementById('communityName').innerHTML = `Группа "${info.name}"`;

    await showButton(await getRoleInCommunity(id));
    
    document.getElementById('communitySubscribers').innerHTML = `${info.subscribersCount} подписчиков`;
    document.getElementById('communityType').innerHTML = `Тип сообщества: ${info.isClosed ? "закрытая" : "открытая"}`;
    createAdmins(info.administrators);
}
async function createAdmins(admins) {
    const adminsList = document.getElementById('communityAdminsContainer');

    admins.forEach(async (admin, index, array) => {
        const adminRow = document.createElement("div");
        adminRow.className = "row mb-3 ms-3";
        if (index != array.length - 1) {
            adminRow.classList.add("border-bottom", "border-3")
        }

        adminRow.addEventListener('click', async (e) => {
            console.log("OK");
            window.location.href = `/?author=${admin.fullName}&page=1&size=5`;
        })

        const avatarCol = document.createElement("div");
        avatarCol.classList.add("col-sm-2", "col-xxl-1", "col-xl-1", "justify-content-center");

        const avatarImg = document.createElement("img");
        if (admin.gender == "Male"){
            avatarImg.src = "http://127.0.0.1:5500/views/images/manicon.jpg";
            avatarImg.alt = "Male Avatar";
        }
        else{
            avatarImg.src = "http://127.0.0.1:5500/views/images/member-dafault-w.jpeg";
            avatarImg.alt = "Female Avatar";
        }
       
        avatarImg.classList.add("img", "rounded-circle", "border", "border-2", "flex-d", "h-auto", "mb-2", "mt-2");
        avatarImg.width = 75;
        avatarImg.height = 75;
        
        avatarCol.appendChild(avatarImg);

        const detailsCol = document.createElement("div");
        detailsCol.classList.add("col-sm-10", "col-xxl-11", "col-xl-11");

        const nameCol = document.createElement("div");
        nameCol.classList.add("col-8", "d-flex", "align-items-center", "ms-3");

        const nameElement = document.createElement("div");  
        nameElement.classList.add("fw-bold", "fs-5", "text-dark");
        nameElement.textContent = admin.fullName;

        nameCol.appendChild(nameElement);

        detailsCol.appendChild(nameCol);

        adminRow.appendChild(avatarCol);
        adminRow.appendChild(detailsCol);
        
        adminsList.appendChild(adminRow);
    });
}

async function showButton(role){
    if (role == "Administrator"){
        const writepostBtn = document.getElementById("writepostBtn");
        writepostBtn.classList.remove("d-none");
        writepostBtn.parentElement.parentElement.className = "col-5";
        writepostBtn.addEventListener('click', async (event) =>{
            const { communityId } = await getUrlParams();
            localStorage.setItem('communityId', communityId);

            window.location.href = '/post/create';
        })

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

function getFilters(id, pageNumber, pageSize)
{
    const tags = Array.from(document.getElementById('tags').selectedOptions).map(option => option.value);
    const sorting = document.getElementById('sorting').value;

    const filters = {
        pageNumber,
        pageSize,
        tags,
        sorting,
        id
    };
    return filters;
}

function generateApiUrl(filters) {
    const baseUrl = `https://blog.kreosoft.space/api/community/${filters.id}/post`;
    const queryParams = [];

  
    if (filters.tags) {
        if (filters.tags.length == 1 && filters.tags[0] == ''){
            
        }
        else{
            filters.tags.forEach(tag => {
                if (tag != ''){
                    queryParams.push(`tags=${tag}`);
                }
            });
        }
    }
    if (filters.sorting !== "" && filters.sorting != "0") {
        queryParams.push(`sorting=${filters.sorting}`);
    }   

    if (filters.pageNumber !== "") {
        queryParams.push(`page=${filters.pageNumber}`);
    }
    if (filters.pageSize !== "") {
        queryParams.push(`size=${filters.pageSize}`);
    }

    const apiUrl = `${baseUrl}?${queryParams.join("&")}`;

    return apiUrl;
  }

function setFilters(filters)
{
    const tagsSelect = document.getElementById('tags');
    for (let i = 0; i < tagsSelect.options.length; i++) {
        if (filters.tags.includes(tagsSelect.options[i].value)) {
            tagsSelect.options[i].selected = true;
        }
    }
    document.getElementById('sorting').value = filters.sorting;
}

export async function updatePosts(id, currentPage, pageSize){
    const filters = await getFilters(id, currentPage, pageSize);
    await updatePage(currentPage, pageSize,  filters, maxPages);
    const communityPosts =await getCommunityPosts(filters);
    if (communityPosts){
        await updatePostsUI(communityPosts.posts);
    }
}

document.getElementById("filterForm").addEventListener('submit', async function(event) {
    const { communityId, page, pageSize } = await getUrlParams();

    event.preventDefault();
    event.stopPropagation();

    await updatePosts(communityId, 1, pageSize);
})


pageSizer.addEventListener('change', async function(event) {
    const {communityId, page } = await getUrlParams();

    await updatePosts(communityId, page, event.target.value);
})

leftPage.addEventListener('click', async function (event) {
    const {communityId, page, pageSize } = await getUrlParams();
    let currentPage = page;
    if (currentPage > 1) {
        await updatePosts(communityId, --currentPage, pageSize);
    }
});

rightPage.addEventListener('click', async function (event) {
    const {communityId, page, pageSize } = await getUrlParams();
    let currentPage = page;

    await updatePosts(communityId, ++currentPage, pageSize);
});

firstPage.addEventListener('click', async function (event) {
    const {communityId, page, pageSize } = await getUrlParams();
    let currentPage = page;
    let difference = parseInt(currentPage) - parseInt(this.innerHTML);
    if (difference > 0) {
        currentPage = parseInt(currentPage) - difference;
        
        await updatePosts(communityId, currentPage, pageSize);
    }
});

secondPage.addEventListener('click', async function (event) {
    const {communityId, page, pageSize } = await getUrlParams();
    let currentPage = page;
    let difference = parseInt(this.innerHTML) - parseInt(currentPage);

    currentPage = parseInt(currentPage) + difference;

    await updatePosts(communityId, currentPage, pageSize);
});

thirdPage.addEventListener('click', async function (event) {
    const {communityId, page, pageSize } = await getUrlParams();
    let currentPage = page;
    let difference = parseInt(this.innerHTML) - parseInt(currentPage);

    if (difference > 0) {
        currentPage = parseInt(currentPage) + difference;

        await updatePosts(communityId, currentPage, pageSize)
    }
});

subscribeBtn.addEventListener("click", async () => {
    unsubscribeBtn.className = "btn btn-danger ms-5";
    subscribeBtn.className = "btn btn-primary ms-5 d-none";

    const {communityId} = await getUrlParams();

    await handleSubscribe(communityId);
});

unsubscribeBtn.addEventListener("click", async () => {
    subscribeBtn.className = "btn btn-primary ms-5";
    unsubscribeBtn.className = "btn btn-danger ms-5 d-none";

    const {communityId} = await getUrlParams();

    await handleUnsubscribe(communityId);
});