const postRequestURL = 'https://blog.kreosoft.space/api/post'
const tagRequestURL = 'https://blog.kreosoft.space/api/tag'
const submitFilterBtn = document.getElementById(SubmitFilterBtn);

const pageSize = 5;

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('token');

    if (displayPosts(1, 0, pageSize, {}, token))//сделать проверку на валидность токена => если токен валиден, сделать кнопку написать пост видимым
    {
        document.getElementById('postBtn').className = 'btn btn-primary';
    }
    
    
});

async function displayPosts(filters, token = null) {
    try {
        const response = await fetch(generateApiUrl(filters), {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(filters),
        });

        if (response.ok) {
            const posts = await response.json();
            updatePostsUI(posts);
        } else {
            console.error("Failed to fetch posts");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function updatePostsUI(posts) {
    const postsContainer = document.getElementById('postsContainer');
    // Update the HTML dynamically with the fetched posts
    // (Create elements, set innerHTML, or use a template engine)
}

async function handleLike(postId) {
    const apiUrl = `https://blog.kreosoft.space/api/likePost/${postId}`;
    
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // Additional parameters if needed
        });

        if (!response.ok) {
            console.error("Failed to like/unlike the post");
        }
        // Update the UI to reflect the change in like status
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

SubmitFilterBtn.addEventListener('submit', async function(e) {
    const pageNumber = 1;
    const pageSize = pageSize;
    const tags = document.getElementById('tags').value;
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

    displayPosts(filters);
})

function generateApiUrl(filters) {
    const baseUrl = "https://blog.kreosoft.space/api/post";
    const queryParams = [];
  
    if (filters.tags) {
      filters.tags.forEach(tag => {
        queryParams.push(`tags=${tag}`);
      });
    }
  
    if (filters.authorName) {
      queryParams.push(`author=${encodeURIComponent(filters.authorName)}`);
    }
  
    if (filters.readingTimeFrom !== undefined) {
      queryParams.push(`min=${filters.readingTimeFrom}`);
    }
  
    if (filters.readingTimeTo !== undefined) {
      queryParams.push(`max=${filters.readingTimeTo}`);
    }
  
    if (filters.sorting) {
      queryParams.push(`sorting=${filters.sorting}`);
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
  
    return apiUrl;
  }