document.addEventListener("DOMContentLoaded", function () {
    
    displayPosts(1, 5, {});
    document.getElementById('onlyMyCommunities').addEventListener('change', applyFilters);
    document.getElementById('sorting').addEventListener('change', applyFilters);
});

async function displayPosts(pageNumber, pageSize, filters) {
    const apiUrl = "https://blog.kreosoft.space/api/getPosts";
    
    try {
        const response = await fetch(`${apiUrl}?page=${pageNumber}&pageSize=${pageSize}`, {
            method: "POST",
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

function applyFilters() {
    const pageNumber = 1; // Reset to the first page when filters are applied
    const pageSize = 5;
    const tags = document.getElementById('tags').value;
    const authorName = document.getElementById('authorName').value;
    const readingTimeFrom = document.getElementById('readingTimeFrom').value;
    const readingTimeTo = document.getElementById('readingTimeTo').value;
    const onlyMyCommunities = document.getElementById('onlyMyCommunities').checked;
    const sorting = document.getElementById('sorting').value;

    const filters = {
        tags,
        authorName,
        readingTimeFrom,
        readingTimeTo,
        onlyMyCommunities,
        sorting,
    };

    displayPosts(pageNumber, pageSize, filters);
}
