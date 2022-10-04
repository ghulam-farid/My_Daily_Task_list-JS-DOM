let task = document.querySelector("#task-input");
let task_form = document.querySelector("#task-form");
let filter = document.querySelector("#filter-task");
let task_list = document.querySelector("#task-list");
let clear_btn = document.querySelector(".clear-tasks");
let form_btn = document.querySelector(".form-btn");

loadEventListeners();

function loadEventListeners() {
  document.addEventListener("DOMContentLoaded", getTasks);

  task_form.addEventListener("submit", addTask);

  task_list.addEventListener("click", editTask);

  task_list.addEventListener("click", removeTask);

  filter.addEventListener("keyup", filterTasks);

  clear_btn.addEventListener("click", clearTasks);
}

function addTaskToLocalStorage(task) {
  let tasks_arr = [];
  if (localStorage.getItem("tasks") === null) {
    tasks_arr.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks_arr));
  } else {
    tasks_arr = JSON.parse(localStorage.getItem("tasks"));
    tasks_arr.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks_arr));
  }
}

function addTask(e) {
  if (task.value === "") {
    alert("Add a task");
  } else {
    let li = document.createElement("li");
    li.className = "collection-item";
    li.appendChild(document.createTextNode(task.value));

    let edit_link = document.createElement("a");
    edit_link.className = "edit-item secondary-content";
    edit_link.title = "Edit Task";
    edit_link.innerHTML = `<i class="fa fa-pencil"></i>`;
    li.appendChild(edit_link);

    let delete_link = document.createElement("a");
    delete_link.className = "delete-item secondary-content";
    delete_link.title = "Delete Task";
    delete_link.innerHTML = `<i class="fa fa-remove"></i>`;
    li.appendChild(delete_link);

    task_list.appendChild(li);
    addTaskToLocalStorage(task.value);
    task.value = "";
  }
  e.preventDefault();
}

function editTask(e) {
  if (e.target.parentElement.classList.contains("edit-item")) {
   
   edit_link.style.visibility = "hidden";
    delete_link.style.visibility = "hidden";
    let edit_task_text =
      e.target.parentElement.parentElement.firstChild.textContent;
    task.value = edit_task_text;
    task.focus();

    task_form.removeEventListener("submit", addTask);
    form_btn.value = "Update Task";
    form_btn.classList.add("update-task", "teal", "lighten-2");

    task_form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (task.value === "") {
        alert("Add a task");
      } else {
        document
          .querySelectorAll(".collection-item")
          .forEach(function (task_item) {
            if (task_item.firstChild.textContent === edit_task_text) {
              task_item.firstChild.textContent = task.value;
              task.value = "";
              form_btn.value = "Add Task";
              form_btn.classList.remove("update-task", "teal", "lighten-2");
              task_form.addEventListener("submit", addTask);
            }
          });
        let updated_tasks = Array.from(
          document.querySelectorAll(".collection-item")
        );
        localStorage.setItem(
          "tasks",
          JSON.stringify(
            updated_tasks.map((task_item) => task_item.firstChild.textContent)
          )
        );

        document.querySelector(".cancel-btn").remove();
        edit_link.style.visibility = "visible";
        delete_link.style.visibility = "visible";
      }
    });

    let cancel_btn = document.createElement("input");
    cancel_btn.type = "button";
    cancel_btn.value = "Cancel";
    cancel_btn.className = "btn inline grey lighten-5 black-text cancel-btn";
    task_form.appendChild(cancel_btn);

    cancel_btn.addEventListener("click", function () {
      task.value = "";
      form_btn.value = "Add Task";
      form_btn.classList.remove("update-task");
      cancel_btn.remove();
    });
  }
}

function removeFromLocalStorage(task_item) {
  let tasks_arr = JSON.parse(localStorage.getItem("tasks"));
  tasks_arr.forEach(function (task, index) {
    if (task_item.textContent === task) {
      tasks_arr.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks_arr));
    }
  });
}

function removeTask(e) {
  if (e.target.parentElement.classList.contains("delete-item")) {
    let delete_option = confirm("Are you sure you want to delete?");
    delete_option && e.target.parentElement.parentElement.remove();
    delete_option &&
      removeFromLocalStorage(e.target.parentElement.parentElement);
  }
}

function filterTasks(e) {
  let filter_text = e.target.value.toLowerCase();
  if (filter_text !== "") {
    document.querySelectorAll(".collection-item").forEach(function (task) {
      let task_item = task.firstChild.textContent;
      if (task_item.toLowerCase().indexOf(filter_text) != -1) {
        task.style.display = "block";
      } else {
        task.style.display = "none";
      }
    });
  }
}

function clearFromLocalStorage() {
  localStorage.clear();
}

function clearTasks(e) {
  if (confirm("Are you sure you want to clear all tasks?")) {
    while (task_list.firstChild) {
      task_list.removeChild(task_list.firstChild);
    }
    clearFromLocalStorage();
  }
}

function getTasks() {
  if (localStorage.getItem("tasks") !== null) {
    let tasks_arr = JSON.parse(localStorage.getItem("tasks"));
    tasks_arr.forEach(function (task) {
      let li = document.createElement("li");
      li.className = "collection-item";
      li.appendChild(document.createTextNode(task));

      let edit_link = document.createElement("a");
      edit_link.className = "edit-item secondary-content";
      edit_link.title = "Edit Task";
      edit_link.innerHTML = `<i class="fa fa-pencil"></i>`;
      li.appendChild(edit_link);

      let link = document.createElement("a");
      link.className = "delete-item secondary-content";
      link.innerHTML = `<i class="fa fa-remove"></i>`;
      li.appendChild(link);

      task_list.appendChild(li);
    });
  }
}
