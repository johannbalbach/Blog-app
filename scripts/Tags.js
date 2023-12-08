export async function GetTags() {
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
            console.error("Ошибка получения данных тэгов:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
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