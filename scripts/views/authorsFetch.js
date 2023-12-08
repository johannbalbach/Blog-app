document.addEventListener("DOMContentLoaded", async function () {
    const authorsData = await fetchAuthors(); 

    createAuthorRow(authorsData);
});

async function fetchAuthors() {
    try {
        const response = await fetch('https://blog.kreosoft.space/api/author/list', {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const authors = await response.json();

            return authors
        } else {
            console.error("Ошибка получения данных постов:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}


async function createAuthorRow(authors) {
    const authorsList = document.getElementById('authorsContainer');

    const topAuthors = authors.map(author => ({
        ...author,
        popularityP: author.posts,
        popularityL: author.likes
    })).sort((a, b) =>{
        let posts = b.popularityP - a.popularityP;
        if (posts == 0){
            let likes = b.popularityL - a.popularityL;
            return likes;
        }
        return posts;
    } ).slice(0, 3);

    authors.forEach(async author => {
        const authorRow = document.createElement("div");
        authorRow.className = "row mb-3 border-bottom border-3";

        authorRow.addEventListener('click', async (e) => {
            window.location.href = `/homepage?author=${author.fullName}&page=1&size=5`;
        })

        const avatarCol = document.createElement("div");
        avatarCol.classList.add("col-sm-2", "col-xxl-1", "col-xl-1", "justify-content-center");

        const avatarImg = document.createElement("img");
        if (author.gender == "Male"){
            avatarImg.src = "http://127.0.0.1:5500/views/images/manicon.jpg";
            avatarImg.alt = "Male Avatar";
        }
        else{
            avatarImg.src = "http://127.0.0.1:5500/views/images/member-dafault-w.jpeg";
            avatarImg.alt = "Female Avatar";
        }
       
        avatarImg.classList.add("img", "rounded-circle", "border", "border-2", "flex-d", "h-auto", "mb-2", "mt-2");
        avatarImg.width = 75;
        avatarImg.height = 75;

        if (topAuthors.some(topAuthor => topAuthor.fullName === author.fullName && topAuthor.birthDate === author.birthDate)) {
            const crown = document.createElement("i");
            crown.className = "fa-solid fa-crown";
            avatarCol.appendChild(crown);
        }
        

        avatarCol.appendChild(avatarImg);

        const detailsCol = document.createElement("div");
        detailsCol.classList.add("col-sm-10", "col-xxl-11", "col-xl-11");

        const nameDateRow = document.createElement("div");
        nameDateRow.classList.add("row", "mt-2", "mb-2");

        const nameCol = document.createElement("div");
        nameCol.classList.add("col-8", "d-flex", "align-items-center");

        const nameElement = document.createElement("div");
        nameElement.classList.add("fw-bold", "fs-5", "text-dark");
        nameElement.textContent = author.fullName;

        const createdateElement = document.createElement("div");
        createdateElement.classList.add("fs-6", "fst-italic", "ms-2", "me-auto");
        createdateElement.style.color = "gray";
        createdateElement.textContent = `Создан: ${await formatDate(author.created)}`;

        nameCol.appendChild(nameElement);
        nameCol.appendChild(createdateElement);

        const badgesCol = document.createElement("div");
        badgesCol.classList.add("col-4", "d-flex", "justify-content-end", "align-items-end", "ms-auto", "me-auto");

        const postsBadge = document.createElement("div");
        postsBadge.classList.add("badge", "bg-primary");
        postsBadge.textContent = `Постов: ${author.posts}`;

        const likesBadge = document.createElement("div");
        likesBadge.classList.add("badge", "bg-primary", "ms-2");
        likesBadge.textContent = `Лайков: ${author.likes}`;

        badgesCol.appendChild(postsBadge);
        badgesCol.appendChild(likesBadge);

        nameDateRow.appendChild(nameCol);
        nameDateRow.appendChild(badgesCol);

        const birthDateRow = document.createElement("div");
        birthDateRow.classList.add("row", "mt-2", "mb-2");

        const birthDateCol = document.createElement("div");
        birthDateCol.classList.add("d-flex");

        const labelElement = document.createElement("div");
        labelElement.classList.add("fs-6", "fw-bold", "mt-auto", "mb-auto", "mb-1");
        labelElement.style.color = "gray";
        labelElement.textContent = "Дата рождения: ";

        const dateElement = document.createElement("div");
        dateElement.classList.add("fs-6", "ms-1");
        dateElement.textContent = await formatDate(author.birthDate);

        birthDateCol.appendChild(labelElement);
        birthDateCol.appendChild(dateElement);

        birthDateRow.appendChild(birthDateCol);

        detailsCol.appendChild(nameDateRow);
        detailsCol.appendChild(await createPostsLikesRow());
        detailsCol.appendChild(birthDateRow);

        authorRow.appendChild(avatarCol);
        authorRow.appendChild(detailsCol);
        
        authorsList.appendChild(authorRow);
    });
}

async function createPostsLikesRow() {
    const postsLikesRow = document.createElement("div");
    postsLikesRow.classList.add("row", "mt-2", "mb-2");

    return postsLikesRow;
}

async function formatDate(dateString) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-US", options);
}

async function findTop3(){

}