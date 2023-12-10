import {updatePostsUI} from "../postCreate.js";
import { GetTags } from "../Tags.js";
import {updatePage} from "../pagination.js";
import {updateActivePage} from "../pagination.js";
import {updatePagination} from "../pagination.js";
import {getFiltersFromURL} from "../pagination.js";
import { getUrlParams } from "../pagination.js";

const submitFilter = document.getElementById('filterForm');
const pageSizer = document.getElementById('pageSize');


let maxPages = 1;

document.addEventListener("DOMContentLoaded", async function () {
    const { page, pageSize } = await getUrlParams();
    await GetTags();

    setFilters(await getFiltersFromURL());

    pageSizer.value = pageSize;
    
    await fetchPosts(await getFilters(page, pageSize))

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

    await updateWritePostBtn();
});

submitFilter.addEventListener('submit', async function(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.checkValidity()) {
        event.stopPropagation();
    } else { 
    const { pageSize } = await getUrlParams();

    await updatePosts(1, pageSize);
    }

    this.classList.add('was-validated');
})

export async function updatePosts(currentPage, pageSize){
    const filters = await getFilters(currentPage, pageSize);
    await updatePage(currentPage, pageSize,  filters, maxPages);
    await fetchPosts(filters);
}

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


async function updateWritePostBtn(){
    if (GetUserId()){
        document.getElementById('PostBtn').classList.remove("d-none");
    }
    document.getElementById('PostBtn').addEventListener('click', async function (event) {
        window.location.href = "/post/create";
    })
}

async function GetUserId()
{
    try {
        const token = localStorage.getItem('token');
        const response = await fetch("https://blog.kreosoft.space/api/account/profile", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const data = await response.json();

            return data.id;
        } 
        else {
            return false;
        }
    } catch (error) {
        console.error('Ошибка при выполнении GET-запроса:', error);
    }
}

function generateApiUrl(filters) {
    const baseUrl = "https://blog.kreosoft.space/api/post";
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

async function getFilters(pageNumber, pageSize)
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
    document.getElementById('onlyMyCommunities').value = filters.onlyMyCommunities;
    document.getElementById('sorting').value = filters.sorting;
}
