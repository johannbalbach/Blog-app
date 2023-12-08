import {updatePostUI} from "../postCreate.js";

document.addEventListener("DOMContentLoaded", async function () {
    const postID = await getUrlParams();
    const postinfo = await getPost(postID);

    await updatePostUI(postinfo, document.getElementById('postsContainer'), true);
});

async function getPost(id) {
    let URL = `https://blog.kreosoft.space/api/post/${id}`;
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(URL, {
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

async function getUrlParams() {
    const url = new URL(window.location);
    const postID = url.pathname.split('/')[2];
    
    return postID;
}
