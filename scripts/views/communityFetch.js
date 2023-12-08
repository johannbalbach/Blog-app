//import {updatePostUI} from "../postCreate.js";
import { GetTags } from "../Tags.js";
import {updatePage} from "../pagination.js";
import {updateActivePage} from "../pagination.js";
import {updatePagination} from "../pagination.js";
import {getFiltersFromURL} from "../pagination.js";
import { getUrlParams } from "../pagination.js";

document.addEventListener("DOMContentLoaded", async function () {
    GetTags();
    const {communityId,  page, pageSize} = await getUrlParams();
    console.log(communityId);
    const communityPosts = await getCommunityPost(getFilters(communityId, page, pageSize));
    //await updatePostUI(communityPosts, document.getElementById('postsContainer'), true);
});

async function getCommunityPost(filters) {
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