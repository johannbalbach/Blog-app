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

    if (true)//сделать проверку на валидность токена => если токен валиден, сделать кнопку написать пост видимым
    {
        document.getElementById('PostBtn').className = 'btn btn-primary';
    }
    
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

async function handleLike(postId, IsitAdd) {
    const apiUrl = `https://blog.kreosoft.space/api/${postId}/like`;
    const method = IsitAdd ? 'POST': 'DELETE';
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(apiUrl, {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        //Добавить визуально, что вы должны быть авторизованы, если хотите поставить лайк
        if (response.status = '401')
        {

        }
        else if (!response.ok) {
            console.error("Ошибка обработки лайка:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function showFullPost(postId) {

}

function goToPost(postId) {

}

function updatePostsUI(posts) {
    const postsContainer = document.getElementById("postsContainer");

    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.className = "container-md col-auto border border-2 mb-4";
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
    
        
        const descriptionElement = document.createElement("div");
        descriptionElement.className = "row mb-2";

        const descriptionText = document.createElement("div");
        descriptionText.className = "row mt-2 col-md-auto text-start";

        const truncatedDescription = post.description.length > 200
            ? post.description.slice(0, 200) + "..."
            : post.description;

        descriptionText.innerHTML = `<div class="text-dark">${truncatedDescription}</div>`;

        const readMoreElement = document.createElement("div");
        readMoreElement.className = "row mt-auto justify-content-start";

        if (post.description.length > 200) {
            const showMoreButton = document.createElement("button");
            showMoreButton.className = "btn btn-link text-start";
            showMoreButton.textContent = "Показать полностью";
            showMoreButton.addEventListener("click", () => {
                descriptionText.innerHTML = `<div class="text-dark">${post.description}</div>`;
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
    
        const statsElement = document.createElement("div");
        statsElement.className = "row bg-light border-top border-2 mt-2";
        statsElement.innerHTML = `
            <div class="col-md-auto mt-1 mb-1">
                <i class="fa-regular fa-comment"> ${post.commentsCount}</i>
            </div>
            <div class="col-md-auto mt-1 mb-1">
                <i class="fa-regular fa-heart"> ${post.likes}</i>
            </div>
        `;
    
        postElement.appendChild(headerElement);
        headerElement.appendChild(authorElement);
        headerElement.appendChild(titleElement);
        postElement.appendChild(descriptionElement);
        postElement.appendChild(tagsElement);
        postElement.appendChild(readingTimeElement);
        postElement.appendChild(statsElement);
    
        postsContainer.appendChild(postElement);
    });
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

  