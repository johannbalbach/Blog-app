const leftPage = document.getElementById('leftPage');
const rightPage = document.getElementById('rightPage');
const firstPage = document.getElementById('firstPage');
const secondPage = document.getElementById('secondPage');
const thirdPage = document.getElementById('thirdPage');

async function updateUrlParams(page, pageSize, filters) {
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    url.searchParams.set('pageSize', pageSize);

    if (filters.tags) {
        const existingTags = url.searchParams.getAll('tags');
        const uniqueTagsSet = new Set([...existingTags, ...filters.tags]);//распыление
        const uniqueTagsArray = Array.from(uniqueTagsSet);

        url.searchParams.delete('tags');
        
        uniqueTagsArray.forEach(tag => {
            url.searchParams.append('tags', tag);
        });
    }
    url.searchParams.set('author', filters.authorName)
    url.searchParams.set('readingTimeFrom', filters.readingTimeFrom)
    url.searchParams.set('readingTimeTo', filters.readingTimeTo)
    url.searchParams.set('sorting', filters.sorting)
    if (filters.onlyMyCommunities) {
        url.searchParams.set('OnlyMyCommunities', filters.onlyMyCommunities)
    }
    else{
        url.searchParams.set('OnlyMyCommunities', false)
    }
    
    window.history.pushState({}, '', url);
}
  
export async function getUrlParams() {
    const url = new URL(window.location);
    const communityId = url.pathname.split('/')[2];
    const page = url.searchParams.get('page') || 1;
    const pageSize = url.searchParams.get('pageSize') || 5;
    return { page, pageSize, communityId };
}

export async function getFiltersFromURL(){
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
export async function updatePagination(currentPage) {
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

export async function updateActivePage(currentPage, maxPages){
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

    if (maxPages < firstPage.innerHTML){
        firstPage.parentElement.className = firstPage.parentElement.className + ' disabled';
    }
    if (maxPages < secondPage.innerHTML){
        secondPage.parentElement.className = secondPage.parentElement.className + ' disabled';
    }
    if (maxPages < thirdPage.innerHTML){
        thirdPage.parentElement.className = thirdPage.parentElement.className + ' disabled';
    }

    if (currentPage == 1) {
        leftPage.parentElement.classList.add('disabled');
    } else {
        leftPage.parentElement.classList.remove('disabled');
    }
    if (currentPage >= maxPages) {
        rightPage.parentElement.classList.add('disabled');
    } else {
        rightPage.parentElement.classList.remove('disabled');
    }
}

export async function updatePage(currentPage, currentSize, filters, maxPages){
    await updateUrlParams(currentPage, currentSize, filters);
    await updatePagination(currentPage);
    await updateActivePage(currentPage, maxPages);
}

