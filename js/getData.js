function getData() {
  fetch('./courses.json')
  .then(response => console.log(response.json()))
  .then(json => console.log(json))
}

getData();