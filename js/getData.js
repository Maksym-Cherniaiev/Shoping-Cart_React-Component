function getData() {
  fetch('http://myjson.com/1ex2zx')
  .then(response => console.log(response.json()))
  .then(json => console.log(json))
}

getData();