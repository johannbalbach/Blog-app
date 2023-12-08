import {updatePostsUI} from "../postCreate.js";

const submitFilter = document.getElementById('filterForm');
const pageSizer = document.getElementById('pageSize');
const pagination = document.getElementById('pagination');
const leftPage = document.getElementById('leftPage');
const rightPage = document.getElementById('rightPage');
const firstPage = document.getElementById('firstPage');
const secondPage = document.getElementById('secondPage');
const thirdPage = document.getElementById('thirdPage');

let maxPages = 1;

document.addEventListener("DOMContentLoaded", async function () {
    const { page, pageSize } = getUrlParams();
    await GetTags();

    setFilters(getFiltersFromURL());

    pageSizer.value = pageSize;
    
    await fetchPosts(getFilters(page, pageSize))

    if (parseInt(page) % 3 === 0){
        updatePagination(page - 2);
        updateActivePage(page);
    }
    if (parseInt(page) % 3 === 1){
        updatePagination(parseInt(page));
        updateActivePage(page);
    }
    if (parseInt(page) % 3 === 2){
        updatePagination(parseInt(page) - 1);
        updateActivePage(page);
    }

    updateWritePostBtn();
});

submitFilter.addEventListener('submit', async function(event) {
    const { page, pageSize } = getUrlParams();

    event.preventDefault();
    event.stopPropagation();

    fetchPosts(getFilters(page, pageSize));
    updatePage(page, pageSize);
})

pageSizer.addEventListener('change', async function(event) {
    const { page } = getUrlParams();
    updateUrlParams(page, event.target.value);

    fetchPosts(getFilters(page, event.target.value));
})

leftPage.addEventListener('click', function (event) {
    const { page, pageSize } = getUrlParams();
    let currentPage = page;
    if (currentPage > 1) {
        updatePage(--currentPage, pageSize)
    }
});

rightPage.addEventListener('click', function (event) {
    const { page, pageSize } = getUrlParams();
    let currentPage = page;

    //сделать проверку на макс число постов
    updatePage(++currentPage, pageSize)
});

firstPage.addEventListener('click', function (event) {
    const { page, pageSize } = getUrlParams();
    let currentPage = page;
    let difference = parseInt(currentPage) - parseInt(this.innerHTML);
    if (difference > 0) {
        currentPage = parseInt(currentPage) - difference;
        
        updatePage(currentPage, pageSize)
    }
});

secondPage.addEventListener('click', function (event) {
    const { page, pageSize } = getUrlParams();
    let currentPage = page;
    let difference = parseInt(this.innerHTML) - parseInt(currentPage);

    currentPage = parseInt(currentPage) + difference;

    updatePage(currentPage, pageSize)
});

thirdPage.addEventListener('click', function (event) {
    const { page, pageSize } = getUrlParams();
    let currentPage = page;
    let difference = parseInt(this.innerHTML) - parseInt(currentPage);

    if (difference > 0) {
        currentPage = parseInt(currentPage) + difference;

        updatePage(currentPage, pageSize)
    }
});

async function fetchPosts(filters) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(generateApiUrl(filters), {
            method: "GET", 
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const posts = await response.json();

            updatePostsUI(posts.posts);
            maxPages = posts.pagination.count;
        } else {
            console.error("Ошибка получения данных постов:", response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error("Error:", error);
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
            UpdateTags(tags);
        } else {
            console.error("Ошибка получения данных постов:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function UpdateTags(tags){
    const tagMenu = document.getElementById('tags');
    tagMenu.innerHTML = '';

    tags.forEach((tag) => {
        const optionElement = document.createElement("option");
        optionElement.value = tag.id;
        optionElement.textContent = tag.name;
        tagMenu.appendChild(optionElement);
    });
}

function updateWritePostBtn(){
    email = document.querySelector('#navbarDropdown').textContent || '';

    console.log(email);
    if (email != ''){
        document.getElementById('PostBtn').classList.remove("d-none");
    }
}


function generateApiUrl(filters) {
    const baseUrl = "https://blog.kreosoft.space/api/post";
    const queryParams = [];
  
    if (filters.tags) {
      filters.tags.forEach(tag => {
        queryParams.push(`tags=${tag}`);
      });
    }
    if (filters.authorName !== "") {
      queryParams.push(`author=${filters.authorName}`);
    }
    if (filters.readingTimeFrom !== "") {
      queryParams.push(`min=${filters.readingTimeFrom}`);
    }
    if (filters.readingTimeTo !== "") {
      queryParams.push(`max=${filters.readingTimeTo}`);
    }
    if (filters.sorting !== "" && filters.sorting != "0") {
      queryParams.push(`sorting=${filters.sorting}`);
    }   
    if (filters.onlyMyCommunities) {
      queryParams.push(`onlyMyCommunities=${filters.onlyMyCommunities}`);
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

function getFilters(pageNumber = 1, pageSize = getUrlParams().pageSize)
{
    const tags = Array.from(document.getElementById('tags').selectedOptions).map(option => option.value);
    const authorName = document.getElementById('authorName').value;
    const readingTimeFrom = document.getElementById('readingTimeFrom').value;
    const readingTimeTo = document.getElementById('readingTimeTo').value;
    const onlyMyCommunities = document.getElementById('onlyMyCommunities').checked;
    const sorting = document.getElementById('sorting').value;

    const filters = {
        pageNumber,
        pageSize,
        tags,
        authorName,
        readingTimeFrom,
        readingTimeTo,
        onlyMyCommunities,
        sorting,
    };
    return filters;
}

function setFilters(filters)
{
    const tagsSelect = document.getElementById('tags');
    for (let i = 0; i < tagsSelect.options.length; i++) {
        if (filters.tags.includes(tagsSelect.options[i].value)) {
            tagsSelect.options[i].selected = true;
        }
    }
    document.getElementById('authorName').value = filters.authorName;
    document.getElementById('readingTimeFrom').value = filters.readingTimeFrom;
    document.getElementById('readingTimeTo').value = filters.readingTimeTo;
    document.getElementById('onlyMyCommunities').checked = filters.onlyMyCommunities;
    document.getElementById('sorting').value = filters.sorting;
}

function updateUrlParams(page, pageSize) {
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    url.searchParams.set('pageSize', pageSize);
    const filters = getFilters(page, pageSize);

    if (filters.tags) {
        const existingTags = url.searchParams.getAll('tags');
        const uniqueTagsSet = new Set([...existingTags, ...filters.tags]);//распыление
        const uniqueTagsArray = Array.from(uniqueTagsSet);

        url.searchParams.delete('tags');
        
        uniqueTagsArray.forEach(tag => {
            url.searchParams.append('tags', tag);
        });
    }
    if (filters.authorName !== "") {
    url.searchParams.set('author', filters.authorName)
    }
    if (filters.readingTimeFrom !== "") {
    url.searchParams.set('readingTimeFrom', filters.readingTimeFrom)
    }
    if (filters.readingTimeTo !== "") {
    url.searchParams.set('readingTimeTo', filters.readingTimeTo)
    }
    if (filters.sorting !== "" && filters.sorting != "0") {
    url.searchParams.set('sorting', filters.sorting)
    }   
    if (filters.onlyMyCommunities) {
    url.searchParams.set('OnlyMyCommunities', filters.onlyMyCommunities)
    }
    
    window.history.pushState({}, '', url);
}
  
function getUrlParams() {
    const url = new URL(window.location);
    const page = url.searchParams.get('page') || 1;
    const pageSize = url.searchParams.get('pageSize') || 5;
    return { page, pageSize };
}

function getFiltersFromURL(){
    const url = new URL(window.location);
    const tags = url.searchParams.getAll('tags');
    const authorName = url.searchParams.get('author');
    const readingTimeFrom = url.searchParams.get('readingTimeFrom') || '';
    const readingTimeTo = url.searchParams.get('readingTimeTo') || '';
    const onlyMyCommunities = url.searchParams.get('OnlyMyCommunities');
    const sorting = url.searchParams.get('sorting') || '0';

    const filters = {
        tags,
        authorName,
        readingTimeFrom,
        readingTimeTo,
        onlyMyCommunities,
        sorting,
    };

    return filters;
}

function updatePagination(currentPage) {
    if (parseInt(currentPage) > parseInt(thirdPage.innerHTML)){
        firstPage.innerHTML = currentPage;
        secondPage.innerHTML = parseInt(currentPage) + 1;
        thirdPage.innerHTML = parseInt(currentPage) + 2;
    }
    else if (parseInt(currentPage) < parseInt(firstPage.innerHTML)){
        firstPage.innerHTML = parseInt(currentPage) - 2;
        secondPage.innerHTML = parseInt(currentPage) - 1;
        thirdPage.innerHTML = currentPage;
    }
}

function updateActivePage(currentPage){
    if (currentPage == firstPage.innerHTML){
        firstPage.parentElement.className = 'page-item active';
        secondPage.parentElement.className = 'page-item';
        thirdPage.parentElement.className = 'page-item';
    }   
    else if (currentPage == secondPage.innerHTML){
        secondPage.parentElement.className = 'page-item active';
        firstPage.parentElement.className = 'page-item';
        thirdPage.parentElement.className = 'page-item';
    }
    else if (currentPage == thirdPage.innerHTML){
        thirdPage.parentElement.className = 'page-item active';
        secondPage.parentElement.className = 'page-item';
        firstPage.parentElement.className = 'page-item';
    }

    if (maxPages == firstPage.innerHTML){
        firstPage.parentElement.className = firstPage.parentElement.className + ' disabled';
    }
    if (maxPages == secondPage.innerHTML){
        secondPage.parentElement.className = secondPage.parentElement.className + ' disabled';
    }
    if (maxPages == thirdPage.innerHTML){
        thirdPage.parentElement.className = thirdPage.parentElement.className + ' disabled';
    }

    if (currentPage == 1) {
        leftPage.parentElement.classList.add('disabled');
    } else {
        leftPage.parentElement.classList.remove('disabled');
    }
    if (currentPage == maxPages - 1) {
        rightPage.parentElement.classList.add('disabled');
    } else {
        rightPage.parentElement.classList.remove('disabled');
    }
}

function updatePage(currentPage, currentSize){
    updateUrlParams(currentPage, currentSize);
    updatePagination(currentPage);
    updateActivePage(currentPage);
    fetchPosts(getFilters(currentPage, currentSize));
}

  