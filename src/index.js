import "bootstrap/scss/bootstrap.scss";
import http from "./http.js";

// render 1 post lên ui
const renderPost = (post) => {
  const { id, title, description } = post;
  const listNode = document.querySelector("#list");
  const newCard = document.createElement("div");
  newCard.className = `mb-3 p-2 card d-flex flex-row justify-content-between aligh-items-center`;
  newCard.innerHTML = `<div>
 <p><strong>${title}</strong></p>
  <p>${description}</p>
</div>
<div>
  <button class="btn btn-info btn-start-edit" data-id = "${id}">Edit</button>
  <button class="btn btn-danger btn-remove" data-id = "${id}">Remove</button>
</div>`;
  listNode.appendChild(newCard);
};

// hàm Render All post
const renderAllPost = () => {
  return http.readPosts().then((postList) => {
    postList.forEach((post) => {
      renderPost(post);
    });
  });
};
// hàm alertMsg thông báo
const alertMsg = (msg, type = "success") => {
  const newAlert = document.createElement("div");
  newAlert.className = `alert alert-${type}`;
  newAlert.innerHTML = msg;
  document.querySelector("#notification").appendChild(newAlert);
  setTimeout(() => {
    newAlert.remove();
  }, 2000);
};
// clearForm
const clearForm = () => {
  document.querySelector("#title").value = "";
  document.querySelector("#description").value = "";
  document.querySelector("#list").innerHTML = "";
  return renderAllPost();
};
// add
const add = (post) => {
  http
    .createPost(post)
    .then((res) => {
      return clearForm();
    })
    .then((res) => {
      {
        alertMsg("Thêm mới thành công");
      }
    });
};
// editStart
const editStart = (id) => {
  http.readPost(id).then((post) => {
    const { id, title, description } = post;
    document.querySelector("#title").value = title;
    document.querySelector("#description").value = description;
    // hiển thị
    document.querySelector("#btn-group").classList.remove("d-none");
    document.querySelector("#btn-add").classList.add("d-none");
    document.querySelector("#btn-edit").dataset.id = id;
  });
};
// editEnd
const editEnd = (id, post) => {
  http
    .updatePost(id, post)
    .then(() => {
      return clearForm();
    })
    .then(() => {
      alertMsg("Đã cập nhật thành công");
    });
};
// remove
const remove = (id) => {
  http
    .deletePost(id)
    .then(() => {
      return clearForm();
    })
    .then(() => {
      alertMsg("Đã xóa 1 bài viết", "warning");
    });
};
// function inital
// main
const innitPost = () => {
  renderAllPost();
  // add
  document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.querySelector("#title").value;
    const description = document.querySelector("#description").value;
    add({ title, description });
  });
  // edit start
  document.querySelector("#list").addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-start-edit")) {
      editStart(event.target.dataset.id);
    }
  });
  // btn back
  document.querySelector("#btn-back").addEventListener("click", (event) => {
    event.preventDefault();
    clearForm();
    document.querySelector("#btn-group").classList.add("d-none");
    document.querySelector("#btn-add").classList.remove("d-none");
  });
  // edit end
  document.querySelector("#btn-edit").addEventListener("click", (event) => {
    event.preventDefault();
    const title = document.querySelector("#title").value;
    const description = document.querySelector("#description").value;
    const id = event.target.dataset.id;
    editEnd(id, { title, description });
    document.querySelector("#btn-group").classList.add("d-none");
    document.querySelector("#btn-add").classList.remove("d-none");
  });
  // remove
  document.querySelector("#list").addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-remove")) {
      remove(event.target.dataset.id);
    }
  });
};

window.addEventListener("DOMContentLoaded", innitPost);
