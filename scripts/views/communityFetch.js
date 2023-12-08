//import {updatePostUI} from "../postCreate.js";
import { GetTags } from "../Tags.js";

document.addEventListener("DOMContentLoaded", async function () {
    GetTags();
    const {communityId,  page, pageSize} = await getUrlParams();
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

async function getUrlParams() {
    const url = new URL(window.location);
    const communityId = url.pathname.split('/')[2];
    const page = url.searchParams.get('page') || 1;
    const pageSize = url.searchParams.get('pageSize') || 5;
    
    return {communityId, page, pageSize};
}
