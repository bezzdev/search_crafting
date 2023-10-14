let api = {
  get: function (path) {
    return this.makeRequest('GET', path, null);
  },
  post: function (path, data) {
    return this.makeRequest('POST', path, JSON.stringify(data));
  },
  upload: function (path, file) {
    let formData = new FormData();
    formData.append('files', file)
    return this.makeRequest('UPLOAD', path, formData);
  },
  makeRequest(method, path, data) {
    return new Promise((resolve, reject) => {
      let url = process.env.VUE_APP_SERVER_URL + path;
      let myRequest = null;

      if (method === 'GET') {
        const myHeaders = new Headers();
        myRequest = new Request(url, {
          method: 'GET',
          headers: myHeaders,
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'include',
        });
      } else if (method === 'POST') {
        myRequest = new Request(url, {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: data
        });
      } else if (method === 'UPLOAD') {
        myRequest = new Request(url, {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'include',
          body: data
        });
      }

      fetch(myRequest)
      .then(function(response) {
          if (!response.ok) {
            reject(response.statusText);
          } else {
            resolve(response.json());
          }
        }).then(function(response) {
          resolve(response.json());
        }).catch(function(error) {
          reject(error);
        });
    })
  }
};

export const Api = api;