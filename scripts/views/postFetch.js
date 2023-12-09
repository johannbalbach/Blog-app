import {updatePostUI} from "../postCreate.js";

document.addEventListener("DOMContentLoaded", async function () {
    await updateUI();
});

async function updateUI(){
    const postID = await getUrlParams();
    const postinfo = await getPost(postID);

    document.getElementById('postsContainer').innerHTML = '';
    await updatePostUI(postinfo, document.getElementById('postsContainer'), true);

    await updateCommentsUI(postinfo.comments);
}

document.getElementById("saveBtn").addEventListener('click', async function(event) {
    event.preventDefault();
    const postID = await getUrlParams();
    const text = document.querySelector("#mainText").value;

    const body = {
        content: text
    }

    await commentPost(postID, body);
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
async function commentPost(id, body) {
    let URL = `https://blog.kreosoft.space/api/post/${id}/comment`;
    const token = localStorage.getItem('token');
    console.log(body);
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
            await updateUI();
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

async function updateCommentsUI(commentsArray) {
    console.log(commentsArray);
    
    commentsArray.forEach(async comment => {
        const commentContainer = document.getElementById('commentContainer');
        commentContainer.innerHTML = '';
        const commentElement = await createCommentElement(comment);
        commentContainer.appendChild(commentElement);
    });
}

// Функция для создания элемента комментария
async function createCommentElement(comment) {
    const commentElement = document.createElement('div');
    commentElement.className = "row mt-3 ms-2 me-2"

    const headerElement = document.createElement('div');
    headerElement.className = "d-flex align-items-start flex-grow-1";

    const authorContent = document.createElement('div');
    authorContent.className = "text-dark text-wrap fs-7 mt-1 mb-1";
    authorContent.textContent = `${comment.author}`;
    headerElement.appendChild(authorContent);

    const actionButtons = document.createElement('div');
    actionButtons.className = 'fs-7 mt-1 mb-1';

    const editButton = document.createElement('i');
    editButton.className = "fa-solid fa-pen ms-2";
    editButton.style = "color: gold;";
    editButton.addEventListener('click', () => {
    // Логика для редактирования комментария
    });

    const deleteButton = document.createElement('i');
    deleteButton.className = "fa-solid fa-trash ms-2";
    deleteButton.style = "color: red;";
    deleteButton.addEventListener('click', async () => {
        await sendRequestDelete(comment.id);
    });

    actionButtons.appendChild(editButton);
    actionButtons.appendChild(deleteButton);

    if (comment.authorId == await GetUserId()){
        headerElement.appendChild(actionButtons);
    }
    

    const commentContent = document.createElement('div');
    commentContent.className= "text-dark text-wrap mt-1 mb-1 d-flex"
    commentContent.textContent = comment.content;
    
    // Добавляем пометку об изменении, если комментарий был изменен
    if (comment.modifiedDate) {
        const modificationInfo = document.createElement('div');
        modificationInfo.className = "text-wrap fs-7 ms-2"
        modificationInfo.style = "color: grey;"
        modificationInfo.textContent = `(изменен)`;
        commentContent.appendChild(modificationInfo);
    }
    if (comment.deleteDate) {
        commentContent.textContent = "[Комментарий удалён]";
        authorContent.textContent = "[Комментарий удалён]";
    } 

    

    commentElement.appendChild(headerElement);
    commentElement.appendChild(commentContent);

    const flexcolumn = document.createElement('div');
    flexcolumn.className = "text-dark text-wrap mt-1 d-flex flex-column";

    const undertextElement = document.createElement('div');
    undertextElement.className = "d-flex align-items-start flex-grow-1";

    const createDateContent = document.createElement('div');
    createDateContent.className = "text-dark text-wrap mt-2 mb-auto fs-7";
    createDateContent.textContent = `${await formatDateTime(comment.createTime)}`;
    undertextElement.appendChild(createDateContent);    

    const replyForm = document.createElement('form');
    replyForm.className = "mt-3 d-flex d-none";

    const replyTextArea = document.createElement('textarea');
    replyTextArea.className = "form-control mb-2";
    replyTextArea.placeholder = 'Оставьте комментарий...';
    replyTextArea.rows = "1";

    const submitReplayBtn = document.createElement('button');
    submitReplayBtn.className = "btn btn-primary justify-self-end ms-5 mb-auto"
    submitReplayBtn.textContent = 'Отправить';  
    submitReplayBtn.addEventListener('click', (event) => {
        event.preventDefault();
        // Логика для отправки ответ
    });

    replyForm.appendChild(replyTextArea);
    replyForm.appendChild(submitReplayBtn);
    
    const replyBtn = document.createElement('button');
    replyBtn.className = 'btn btn-link mb-auto fs-7';
    replyBtn.textContent = 'Ответить';
    replyBtn.addEventListener("click", () => {
        if (replyForm.classList.contains('d-none')){
            replyForm.classList.remove('d-none');
        }
        else{
            replyForm.classList.add('d-none');
        }
        
    });
    undertextElement.appendChild(replyBtn);
    flexcolumn.appendChild(undertextElement);
    commentElement.appendChild(flexcolumn);
    commentElement.appendChild(replyForm);

    if (comment.subComments > 0) {
        const showRepliesButton = document.createElement('button');
        showRepliesButton.className = 'btn btn-link mb-1 fs-7 text-start';
        showRepliesButton.textContent = 'Раскрыть ответы';
        showRepliesButton.addEventListener('click', () => {
            // Логика для отображения вложенных комментариев
        });

        commentElement.appendChild(showRepliesButton);
    }

    return commentElement;
}

async function formatDateTime(dateTimeString) {
    const options = { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };
    const dateTime = new Date(dateTimeString);
    const formattedDateTime = dateTime.toLocaleString('en-US', options).replace(/\//g, '.');

    return formattedDateTime;
}

async function GetUserId()
{
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(ProfileURL, {
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
        }
    } catch (error) {
        console.error('Ошибка при выполнении GET-запроса:', error);
    }
}
async function sendRequestDelete(id)
{
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://blog.kreosoft.space/api/comment/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            await updateUI();
        } 
        else {
        }
    } catch (error) {
        console.error('Ошибка при выполнении GET-запроса:', error);
    }
}
async function sendRequestPUT(body, id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://blog.kreosoft.space/api/comment/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
        });

        if (response.ok) {
            await updateUI();
        } else {

        }
    } catch (error) {
        console.error('Ошибка сети:', error);
    }
}
