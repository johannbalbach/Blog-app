const requestURL = 'https://blog.kreosoft.space/api/account/login'

function sendRequest(method, url, body = null) {
  const headers = {
    'Content-Type': 'application/json'
  }

  return fetch(url, {
    method: method,
    body: JSON.stringify(body),
    headers: headers
  }).then(response => {
    if (response.ok) {
      return response.json()
    }

    return response.json().then(error => {
      const e = new Error('Что-то пошло не так')
      e.data = error
      throw e
    })
  })
}

const body = {
  email: 'abc@example.com',
  password: 'string1'
}

sendRequest('POST', requestURL, body)
  .then(data => console.log(data))
  .catch(err => console.log(err))
