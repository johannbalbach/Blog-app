export async function getAddress(id){
    const info = getAddressChain(id);

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
    // const strings = object.split(' ');

    // if (object.Level != "Building"){
    //     return strings[0]+strings.map.join()
    // }
    switch (object.objectLevel) {
      case "Region":
        return `Томская область, ${object.text}`;
      case "City":
        return `г. Томск, ${object.text}`;
      case "ElementOfRoadNetwork":
        return `пер. Мостовой, ${object.text}`;
      case "Building":
        return `д. ${object.text}`;
      default:
        return object.text;
    }
  }