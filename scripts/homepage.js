const SubmitFilter = document.getElementById('filterForm');

const defaultPageSize = 5;

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('token');

    if (fetchPosts(getFilters(), token))//сделать проверку на валидность токена => если токен валиден, сделать кнопку написать пост видимым
    {
        document.getElementById('PostBtn').className = 'btn btn-primary';
    }
    GetTags();
});

async function fetchPosts(filters, token = null) {
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
            console.log(posts);
            updatePostsUI(posts.posts);
            return true;
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
    // Display the full text of the post
    // Update the UI to hide the "Show more" button
}

function goToPost(postId) {
    // Redirect to the individual post page using the postId
}

function scrollToComments() {
    // Scroll to the comments section
}

function updatePostsUI(posts) {
    const postsContainer = document.getElementById("postsContainer");

    postsContainer.innerHTML = '';

    posts.forEach(post => {
      const postElement = document.createElement("div");
      postElement.className = "container-md col-auto border border-2 mb-4";
  
      postElement.innerHTML = `
      <div class="row-cols-auto border-bottom border-2 mt-2">
        <div class="row mt-auto mb-3">
            <div class="col-md-12 text-start">
                <div class="text-dark">${post.author} - ${new Date(post.createTime).toLocaleString()} в сообществе "${post.communityName || 'Без сообщества'}"</div>
            </div>
        </div>
        <div class="row mb-2">
            <div class="col-md-12 text-start">
                <h5 class="text-dark h-75">${post.title}</h5>
            </div>
        </div>
        <div class="row mb-3">
            <div class="row mt-2 col-md-auto text-start">
                <div class="text-dark">${post.description}</div>
                <div class="row mt-auto text-start">
                    <a class="d-none">Читать полностью</a>
                </div>
            </div>
        </div>
        <div class="row mb-1">
            <div class="col-md-auto">
                <div class="col-md-12 text-start">
                    <div class="text-dark">#${post.tags.map(tag => tag.name).join(' #')}</div>
                </div>
            </div>
        </div>
        <div class="row mb-1">
            <div class="col-md-auto">
                <div class="col-md-12 text-start">
                    <div class="text-dark">Время чтения: ${post.readingTime} мин. </div>
                </div>
            </div>
        </div>
        <div class="row bg-light border-top border-2 mt-2">
            <div class="col-md-auto">
                <i class="fa-regular fa-comment"> ${post.commentsCount}</i>
            </div>
            <div class="col-md-auto">
                <i class="fa-regular fa-heart"> ${post.likes}</i>
            </div>
        </div>
        </div>
      `;
  
      postsContainer.appendChild(postElement);
});
}

function UpdateTags(tags){
    console.log(tags);
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
    if (filters.authorName) {
      queryParams.push(`author=${filters.authorName}`);
    }
    if (filters.readingTimeFrom !== undefined) {
      queryParams.push(`min=${filters.readingTimeFrom}`);
    }
    if (filters.readingTimeTo !== undefined) {
      queryParams.push(`max=${filters.readingTimeTo}`);
    }
    if (filters.sorting) {
      queryParams.push(`sorting=${filters.sorting - 1}`);
    }
    if (filters.onlyMyCommunities !== undefined) {
      queryParams.push(`onlyMyCommunities=${filters.onlyMyCommunities}`);
    }
    if (filters.pageNumber !== undefined) {
      queryParams.push(`page=${filters.pageNumber}`);
    }
    if (filters.pageSize !== undefined) {
      queryParams.push(`size=${filters.pageSize}`);
    }
    const apiUrl = `${baseUrl}?${queryParams.join("&")}`;
  
    console.log(apiUrl);
    return apiUrl;
  }

function getFilters(pageNumber = 1, pageSize = defaultPageSize)
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

SubmitFilter.addEventListener('submit', async function(event) {
    event.preventDefault();
    event.stopPropagation();

    const token = localStorage.getItem('token');

    fetchPosts(getFilters(), token);
})
