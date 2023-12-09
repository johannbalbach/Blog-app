import { getUrlParams } from "./pagination.js";
import { updatePosts } from "./views/homepage.js";

const pageSizer = document.getElementById('pageSize');
const leftPage = document.getElementById('leftPage');
const rightPage = document.getElementById('rightPage');
const firstPage = document.getElementById('firstPage');
const secondPage = document.getElementById('secondPage');
const thirdPage = document.getElementById('thirdPage');

pageSizer.addEventListener('change', async function(event) {
    const { page } = await getUrlParams();

    await updatePosts(page, event.target.value);
})

leftPage.addEventListener('click', async function (event) {
    const { page, pageSize } = await getUrlParams();
    let currentPage = page;
    if (currentPage > 1) {
        await updatePosts(--currentPage, pageSize);
    }
});

rightPage.addEventListener('click', async function (event) {
    const { page, pageSize } = await getUrlParams();
    let currentPage = page;

    await updatePosts(++currentPage, pageSize);
});

firstPage.addEventListener('click', async function (event) {
    const { page, pageSize } = await getUrlParams();
    let currentPage = page;
    let difference = parseInt(currentPage) - parseInt(this.innerHTML);
    if (difference > 0) {
        currentPage = parseInt(currentPage) - difference;
        
        await updatePosts(currentPage, pageSize);
    }
});

secondPage.addEventListener('click', async function (event) {
    const { page, pageSize } = await getUrlParams();
    let currentPage = page;
    let difference = parseInt(this.innerHTML) - parseInt(currentPage);

    currentPage = parseInt(currentPage) + difference;

    await updatePosts(currentPage, pageSize);
});

thirdPage.addEventListener('click', async function (event) {
    const { page, pageSize } = await getUrlParams();
    let currentPage = page;
    let difference = parseInt(this.innerHTML) - parseInt(currentPage);

    if (difference > 0) {
        currentPage = parseInt(currentPage) + difference;

        await updatePosts(currentPage, pageSize)
    }
});