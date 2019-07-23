const listOfCourses = document.getElementById("courses-list");
const cartBody = document.querySelector("#cart-content tbody");
const clearCartButton = document.querySelector("#clear-cart");

class CourseHandler {
  constructor(e) {
    this.event = e;
    this.itemQuantity = document.querySelector(".cart-items");
    this.totalCost = document.querySelector(".price-sum");
  }

  handleCourse() {
    this.event.preventDefault();
    if (this.event.target.classList.contains("add-to-cart")) {
      const courseCard = this.event.target.parentElement.parentElement;
      this.getCourseInfo(courseCard);
    }
  }

  getCourseInfo(card) {
    const courseInfo = {
      image: card.querySelector("img").src,
      title: card.querySelector("h4").textContent,
      price: card.querySelector(".current-price").textContent,
      id: card.querySelector("a").getAttribute("data-id")
    }
    this.addToCart(courseInfo);
  }

  async addToCart(courseObj) {
    this.checkIfCourseExists(courseObj.id);
    await this.createTableData(courseObj);
    cartBody.append(courseObj);
    this.addCourseToStorage(courseObj);
  }

  createTableData(obj) {
    const cartData = document.createElement("tr");
    cartData.innerHTML = `
      <td>
        <img src="${obj.image}" alt="img" width="100px">
      </td>
      <td>${obj.title}</td>
      <td>${obj.price}</td>
      <td>
        <a href="#" class="remove" data-id=${obj.id}>X</a>
      </td>
    `;
    cartBody.append(cartData);
  }

  removeCoursefromCart() {
    let course = this.event.target.parentElement.parentElement,
        courseId;
    if (this.event.target.classList.value === "remove") {
      course.remove();
      courseId = course.querySelector("a").getAttribute("data-id");
      this.removeCourseFromLocalStorage(courseId);
    } else if (this.event.target.getAttribute("id") === "clear-cart") {
      console.log(this.event.target.getAttribute("id"));
      while (cartBody.firstChild) {
        cartBody.firstChild.remove(cartBody.firstChild);
      }
      localStorage.clear();
    }
  }

  checkIfCourseExists(id) {
    const courses = this.getCoursesFromStorage();
    if (courses.length !== 0) {
      courses.forEach(course => {
        if (course.id === id) {
          alert("this course is already added to the cart"); 
        }
      });
    }
  }

  removeCourseFromLocalStorage(id) {
    let courses = this.getCoursesFromStorage();
    courses.forEach((course, index) => {
      if (course.id === id) {
        courses.splice(index, 1);
      }
    });
    this.showTotalCost(courses);
    localStorage.setItem("courses", JSON.stringify(courses));
    this.showItemQuantity(courses.length);
  }

  addCourseToStorage(courseObj) {
    let courses = this.getCoursesFromStorage();
    courses.push(courseObj);
    this.showTotalCost(courses);
    localStorage.setItem("courses", JSON.stringify(courses));
    this.showItemQuantity(courses.length);
  }

  showItemQuantity(arrLength) {
    let quantityNumber = 0;
    if (quantityNumber === arrLength) {
      this.itemQuantity.classList.remove("items-number");
      this.itemQuantity.textContent = quantityNumber;
      return quantityNumber;
    } else if (quantityNumber < arrLength) {
      quantityNumber = arrLength;
      this.itemQuantity.classList.add("items-number");
      this.itemQuantity.textContent = quantityNumber;
      return quantityNumber;
    }
  }

  showTotalCost(arrOfCourses) {
    let price = 0;
    if (arrOfCourses.length === 0) {
      this.totalCost.textContent = "";
      return price;
    } else if (arrOfCourses.length > 0) {
      arrOfCourses.forEach(course => {
        price += (+course.price.slice(1, course.price.length));
      });
      this.totalCost.textContent = price;
      return price;
    }
  }

  getCoursesFromStorage() {
    let cartData;
    if (localStorage.getItem("courses") === null) {
      cartData = [];
    } else {
      cartData = JSON.parse(localStorage.getItem("courses"));
      this.showTotalCost(cartData);
    }
    this.showItemQuantity(cartData.length);
    return cartData;
  }

  handleLocalStorageCourses() {
    const listOfCourses = this.getCoursesFromStorage();
    listOfCourses.forEach(course => {
      this.createTableData(course);
    });
  }
}

cartBody.addEventListener("click", handleNewCourse);
listOfCourses.addEventListener("click", handleNewCourse);
clearCartButton.addEventListener("click", handleNewCourse);
document.addEventListener("DOMContentLoaded", printToCart);



function handleNewCourse(e) {
  const newCourse = new CourseHandler(e);
  newCourse.handleCourse();
  newCourse.removeCoursefromCart();
}

function printToCart() {
  const courseList = new CourseHandler();
  courseList.handleLocalStorageCourses();
}