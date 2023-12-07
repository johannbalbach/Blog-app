import { getAddress } from "./Address.js";

export function updatePostsUI(posts) {
    const postsContainer = document.getElementById("postsContainer");

    postsContainer.innerHTML = '';

    posts.forEach(async post => {
        await updatePostUI(post, postsContainer, false);
    });
}

export async function updatePostUI(post, postsContainer, IsthereAddress){
    const postElement = document.createElement("div");
    postElement.className = "container-md col-auto border border-2 mb-4 rounded-2";
    const headerElement = document.createElement("div");
    headerElement.className = "row-cols-auto border-bottom border-2 mt-2";
    const authorElement = document.createElement("div");
    authorElement.className = "row mt-auto mb-3";

    const authorText = document.createElement("div");
    authorText.className = "col-md-12 text-start";
    if (post.communityName){
        authorText.innerHTML = `<div class="text-dark">${post.author} - ${new Date(post.createTime).toLocaleString()} в сообществе "${post.communityName}"</div>`;
    }
    else{
        authorText.innerHTML = `<div class="text-dark">${post.author} - ${new Date(post.createTime).toLocaleString()}</div>`;
    }
    
    authorElement.appendChild(authorText);


    const titleElement = document.createElement("div");
    titleElement.className = "row mb-2";
    const titleText = document.createElement("div");
    titleText.className = "col-md-12 text-start";
    titleText.innerHTML = `<h5 class="text-dark h-75">${post.title}</h5>`;
    titleElement.appendChild(titleText);

    headerElement.appendChild(authorElement);
    headerElement.appendChild(titleElement);
    
    const descriptionElement = document.createElement("div");
    descriptionElement.className = "row mb-2";

    if (post.image != null)
    {
        const imageElement = document.createElement("img");
        imageElement.className = "col-md-auto";
        imageElement.src = post.image;
        imageElement.alt = "post image";
        imageElement.style.maxWidth = "100%";
        imageElement.style.height = "auto";
        descriptionElement.appendChild(imageElement);
    }

    const descriptionText = document.createElement("div");
    descriptionText.className = "row mt-2 col-md-auto text-start text-break"; // Добавлен класс text-wrap
    const truncatedDescription = post.description.length > 200
        ? post.description.slice(0, 200) + "..."
        : post.description;
    
    descriptionText.innerHTML = `<div class="text-dark text-break">${truncatedDescription}</div>`;
    
    const readMoreElement = document.createElement("div");
    readMoreElement.className = "row mt-auto justify-content-start";
    
    if (post.description.length > 200) {
        const showMoreButton = document.createElement("button");
        showMoreButton.className = "btn btn-link text-start";
        showMoreButton.textContent = "Показать полностью";
        showMoreButton.addEventListener("click", () => {
            descriptionText.innerHTML = `<div class="text-dark text-break">${post.description}</div>`;
            readMoreElement.style.display = "none";
        });
        readMoreElement.appendChild(showMoreButton);
    }
    
    descriptionText.appendChild(readMoreElement);
    descriptionElement.appendChild(descriptionText);
    


    const tagsElement = document.createElement("div");
    tagsElement.className = "row mb-1";
    const tagsText = document.createElement("div");
    tagsText.className = "col-md-auto";
    tagsText.innerHTML = `<div class="col-md-12 text-start"><div class="text-dark">#${post.tags.map(tag => tag.name).join(' #')}</div></div>`;
    tagsElement.appendChild(tagsText);

    const readingTimeElement = document.createElement("div");
    readingTimeElement.className = "row mb-1";
    const readingTimeText = document.createElement("div");
    readingTimeText.className = "col-md-auto";
    readingTimeText.innerHTML = `<div class="col-md-12 text-start"><div class="text-dark">Время чтения: ${post.readingTime} мин. </div></div>`;
    readingTimeElement.appendChild(readingTimeText);

    if(IsthereAddress){
        if (post.addressId != null){
            const address = await getAddress(post.addressId);

            const addressElement = document.createElement("div");
            addressElement.className = "row mb-1";
            const addressTextElement = document.createElement("div");
            addressTextElement.className = "col-md-auto";
            readingTimeText.innerHTML = `<div class="col-md-12 text-start d-flex">
            <i class="fa-solid fa-location-dot"></i>
            <div class="text-dark ms-1">${address}</div>
            </div>`;

            addressElement.appendChild(addressTextElement);
            postElement.appendChild(addressElement);
        }
    }

    const statsElement = document.createElement("div");
    statsElement.className = "row bg-light border-top border-2 mt-2";

    const commentContainer = document.createElement("div");
    commentContainer.className = "col-6 mt-1 mb-1 d-flex justify-content-start";
    const commentElement = document.createElement("i");
    commentElement.className = "fa-regular fa-comment";
    commentElement.innerHTML = `  ${post.commentsCount}`;

    commentElement.addEventListener('click', async (event) =>{
        await goToPost();
    });
    commentContainer.appendChild(commentElement);

    const likeContainer = document.createElement("div");
    likeContainer.className = "col-6 mt-1 mb-1 d-flex justify-content-end";
    const likeElement = document.createElement("i");
    likeElement.className = "fa-regular fa-heart d-none";
    likeElement.innerHTML =  `  ${post.likes}`;

    const likeElementSolid = document.createElement("i");
    likeElementSolid.className = "fa-solid fa-heart d-none";
    likeElementSolid.style.color = 'red';
    likeElementSolid.innerHTML =  `  ${post.likes + 1}`;

    likeElement.addEventListener('click', async (event) =>{
        if (await handleLike(post.id, true, likeElement)){
            likeElementSolid.classList.remove("d-none");
            likeElement.classList.add("d-none");
        }
    });

    likeElementSolid.addEventListener('click', async (event) =>{
        if (await handleLike(post.id, false, likeElementSolid)){
            likeElement.classList.remove("d-none");
            likeElementSolid.classList.add("d-none");
        }
    });

    if (post.hasLike){
        likeElementSolid.classList.remove("d-none");
    }
    else{
        likeElement.classList.remove("d-none");
    }
    likeContainer.appendChild(likeElement);
    likeContainer.appendChild(likeElementSolid);

    statsElement.appendChild(commentContainer);
    statsElement.appendChild(likeContainer);
    
    postElement.appendChild(headerElement);
    postElement.appendChild(descriptionElement);
    postElement.appendChild(tagsElement);
    postElement.appendChild(readingTimeElement);
    postElement.appendChild(statsElement);

    postsContainer.appendChild(postElement);
}