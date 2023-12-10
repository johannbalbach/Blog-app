import {updatePostUI} from "../postCreate.js";

document.addEventListener("DOMContentLoaded", async function () {
    await updateUI();

    if (GetUserId() == false){
        document.getElementById('userComment').classList.add('d-none');
    }
});

async function updateUI(){
    const postID = await getUrlParams();
    const postinfo = await getPost(postID);

    document.getElementById('postsContainer').innerHTML = '';
    await updatePostUI(postinfo, document.getElementById('postsContainer'), true);

    await updateCommentsUI(postinfo.comments, document.getElementById('commentContainer'), false);
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

async function updateCommentsUI(commentsArray, commentContainer, isitChildComments) {
    commentsArray.forEach(async comment => {
        commentContainer.innerHTML = '';
        const commentElement = await createCommentElement(comment, isitChildComments);
        commentContainer.appendChild(commentElement);
    });
}

// Функция для создания элемента комментария
async function createCommentElement(comment, isitChildComments) {
    const commentElement = document.createElement('div');
    commentElement.className = "row mt-3 ms-2 me-2"

    const headerElement = document.createElement('div');
    headerElement.className = "d-flex align-items-start flex-grow-1";

    const authorContent = document.createElement('div');
    authorContent.className = "text-dark text-wrap fs-7 mt-1 mb-1";
    authorContent.textContent = `${comment.author}`;
    headerElement.appendChild(authorContent);

    const editForm = document.createElement('form');
    editForm.className = "mt-3 d-flex d-none";

    const editTextArea = document.createElement('textarea');
    editTextArea.className = "form-control mb-2";
    editTextArea.placeholder = 'Оставьте комментарий...';
    editTextArea.rows = "1";

    const submitEditBtn = document.createElement('button');
    submitEditBtn.className = "btn btn-warning justify-self-end ms-5 mb-auto"
    submitEditBtn.textContent = 'Отправить';  
    submitEditBtn.addEventListener('click', (event) => {
        const body = {
            content: editTextArea.value
        };
        sendRequestPUT(body, comment.id);
    });

    editForm.appendChild(editTextArea);
    editForm.appendChild(submitEditBtn);

    const actionButtons = document.createElement('div');
    actionButtons.className = 'fs-7 mt-1 mb-1';

    const editButton = document.createElement('i');
    editButton.className = "fa-solid fa-pen ms-2";
    editButton.style = "color: gold;";
    editButton.addEventListener('click', () => {
        if (editForm.classList.contains('d-none')){
            editForm.classList.remove('d-none');
            commentContent.classList.add('d-none');
        }
        else{
            editForm.classList.add('d-none');
            commentContent.classList.remove('d-none');
        }
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
    commentContent.className= "text-dark text-break text-wrap mt-1 mb-1 d-flex"
    commentContent.textContent = comment.content;
    
    if (comment.modifiedDate) {
        const modificationInfo = document.createElement('div');
        modificationInfo.className = "text-wrap fs-7 ms-2"
        modificationInfo.style = "color: grey;"
        modificationInfo.textContent = `(изменен)`;
        commentContent.appendChild(modificationInfo);

        modificationInfo.dataset.bsToggle = "tooltip";
        modificationInfo.dataset.bsPlacement = "top";
        modificationInfo.title = await formatDateTime(comment.modifiedDate);

        commentContent.appendChild(modificationInfo);
    }
    if (comment.deleteDate) {
        commentContent.textContent = "[Комментарий удалён]";
        authorContent.textContent = "[Комментарий удалён]";

        commentContent.dataset.bsToggle = "tooltip";
        commentContent.dataset.bsPlacement = "top";
        commentContent.title = await formatDateTime(comment.deleteDate);
        authorContent.dataset.bsToggle = "tooltip";
        authorContent.dataset.bsPlacement = "top";
        authorContent.title = await formatDateTime(comment.deleteDate);
    } 

    

    commentElement.appendChild(headerElement);
    commentElement.appendChild(editForm);
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
    submitReplayBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        const postID = await getUrlParams();
        const text = replyTextArea.value;
    
        const body = {
            content: text,
            parentId: comment.id
        }
    
        await commentPost(postID, body);
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
    if (GetUserId() == false){
        replyBtn.classList.add('d-none');
    }
    undertextElement.appendChild(replyBtn);
    flexcolumn.appendChild(undertextElement);

    commentElement.appendChild(flexcolumn);
    commentElement.appendChild(replyForm);

    if (comment.subComments > 0 && !isitChildComments) {
        const showRepliesButton = document.createElement('button');
        showRepliesButton.className = 'btn btn-link mb-1 fs-7 text-start';
        showRepliesButton.textContent = 'Раскрыть ответы';

        const childComments = await getCommentTree(comment.id);
        const childCommentsContainer = document.createElement('div');
        childCommentsContainer.className = "border-start border-info border-3 rounded-1 ms-2 d-none";

        commentElement.appendChild(childCommentsContainer);
        await updateCommentsUI(childComments, childCommentsContainer, true);

        showRepliesButton.addEventListener('click', async () => {
            if (childCommentsContainer.classList.contains('d-none')){
                childCommentsContainer.classList.remove('d-none');
                showRepliesButton.textContent = 'Скрыть ответы';
            }
            else{
                childCommentsContainer.classList.add('d-none');
                showRepliesButton.textContent = 'Раскрыть ответы';
            }
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
async function getCommentTree(id) {
    try {
        const response = await fetch(`https://blog.kreosoft.space/api/comment/${id}/tree`, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        }
        });

        if (response.ok) {
            const result = await response.json()

            return result;
        } else {

        }
    } catch (error) {
        console.error('Ошибка сети:', error);
    }
}
