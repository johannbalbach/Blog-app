export async function getAddress(id){
    const info = await getAddressChain(id);
    
    const result = info.map(getObjectText).join(', ');

    return result;
}

async function getAddressChain(id) {
    let URL = `https://blog.kreosoft.space/api/address/chain?objectGuid=${id}`;
    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
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

function getObjectText(object) {
    const strings = object.text.    split(' ');

    if (object.Level != "Building"){
        let temp = strings[0] + '. ';
        strings.shift();
        temp = temp + strings.join(' ');
        return temp;
    }
  }

  async function getAddressSearch(id, query) {
    let URL = `https://blog.kreosoft.space/api/address/search?parentObjectId=${id}&query=${query}`;
    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
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