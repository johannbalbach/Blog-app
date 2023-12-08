//import {updatePostUI} from "../postCreate.js";
import { GetTags } from "../Tags.js";
import {updatePage} from "../pagination.js";
import {updateActivePage} from "../pagination.js";
import {updatePagination} from "../pagination.js";
import {getFiltersFromURL} from "../pagination.js";
import { getUrlParams } from "../pagination.js";
const pageSizer = document.getElementById('pageSize');
const leftPage = document.getElementById('leftPage');
const rightPage = document.getElementById('rightPage');
const firstPage = document.getElementById('firstPage');
const secondPage = document.getElementById('secondPage');
const thirdPage = document.getElementById('thirdPage');


let maxPages = 1;

document.addEventListener("DOMContentLoaded", async function () {
    await GetTags();
    const {communityId,  page, pageSize} = await getUrlParams();

    setFilters(await getFiltersFromURL());

    const communityPosts = await getCommunityPosts(getFilters(communityId, page, pageSize));
    //await updatePostUI(communityPosts, document.getElementById('postsContainer'), true);

    const communityInfo = await getConcreteCommunity(communityId);
    console.log(communityInfo);
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

async function updateWritePostBtn(){
    

    console.log(email);
    if (email != ''){
        document.getElementById('PostBtn').classList.remove("d-none");
    }
}


async function updateCommunityUI(info, id){
    console.log(info);

    document.getElementById('communityName').innerHTML = `Группа "${info.name}"`;

    await showButton(await getRoleInCommunity(id), subscribeBtn, unsubscribeBtn);
    
    document.getElementById('communitySubscribers').innerHTML = `${info.subscribersCount} подписчиков`;
    document.getElementById('communityType').innerHTML = info.isClosed ? "закрытая" : "открытая";

    //document.getElementById('communityAdminsContainer').classList.add("d-none");
}

async function showButton(role, subscribeBtn, unsubscribeBtn){
    if (role == "Administrator"){
        console.log("OK");
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
      filters.tags.forEach(tag => {
        queryParams.push(`tags=${tag}`);
      });
    }
    if (filters.sorting !== "" && filters.sorting != "0") {
      queryParams.push(`sorting=${filters.sorting}`);
    }   
    const apiUrl = `${baseUrl}?${queryParams.join("&")}`;
    console.log(apiUrl);
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

pageSizer.addEventListener('change', async function(event) {
    const { page } = await getUrlParams();

    await updatePosts(page, event.target.value);
})

leftPage.addEventListener('click', async function (event) {
    const { page, pageSize } = await getUrlParams();
    let currentPage = page;
    if (currentPage > 1) {
        await updatePosts(--currentPage, pageSize);
    }
});

rightPage.addEventListener('click', async function (event) {
    const { page, pageSize } = await getUrlParams();
    let currentPage = page;

    await updatePosts(++currentPage, pageSize);
});

firstPage.addEventListener('click', async function (event) {
    const { page, pageSize } = await getUrlParams();
    let currentPage = page;
    let difference = parseInt(currentPage) - parseInt(this.innerHTML);
    if (difference > 0) {
        currentPage = parseInt(currentPage) - difference;
        
        await updatePosts(currentPage, pageSize);
    }
});

secondPage.addEventListener('click', async function (event) {
    const { page, pageSize } = await getUrlParams();
    let currentPage = page;
    let difference = parseInt(this.innerHTML) - parseInt(currentPage);

    currentPage = parseInt(currentPage) + difference;

    await updatePosts(currentPage, pageSize);
});

thirdPage.addEventListener('click', async function (event) {
    const { page, pageSize } = await getUrlParams();
    let currentPage = page;
    let difference = parseInt(this.innerHTML) - parseInt(currentPage);

    if (difference > 0) {
        currentPage = parseInt(currentPage) + difference;

        await updatePosts(currentPage, pageSize)
    }
});

export async function updatePosts(currentPage, pageSize){
    const filters = await getFilters(currentPage, pageSize);
    await updatePage(currentPage, pageSize,  filters, maxPages);
    await getCommunityPosts(filters);
}