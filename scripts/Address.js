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
    let URL = `https://blog.kreosoft.space/api/address/search?`;
    if (query == undefined){
        URL = URL + `parentObjectId=${id}`;
    }
    else{
        URL = URL + `parentObjectId=${id}&query=${query}`;
    }
    console.log(query);
    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const info = await response.json();
            console.log(info);

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

export async function createAddressElement(id, textContent, AddressContainer) {
    console.log(textContent);
    console.log(AddressContainer);
    const Addresses = await getAddressSearch(id);
   
    console.log(Addresses);

    const newAddressElement = document.createElement('div');
    newAddressElement.className = 'col-12 mb-2';

    const label = document.createElement('label');
    label.htmlFor = 'dynamic-select';
    label.className = 'form-label';
    label.textContent = 'Динамический субъект РФ';

    const select = document.createElement('select');
    select.className = 'form-control dynamic-select';
    select.id = 'dynamic-select';

    Addresses.forEach(address => {
        const option = document.createElement('option');
        option.value = address.objectId;
        option.text = address.text;

        select.appendChild(option);
    });

    newAddressElement.appendChild(label);
    newAddressElement.appendChild(select);


    AddressContainer.appendChild(newAddressElement);

    $(newAddressElement).find('.dynamic-select').select2();
  }