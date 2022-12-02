function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
var csrftoken = getCookie("csrftoken");
var activeItem = null;
var todo_snapshot = [];

// create todos
function createTodos() {
  var wrapper = document.getElementById("todo-wrapper");
  var emptyFeed = document.getElementById("empty_feed");
  wrapper.innerHTML = "";
  emptyFeed.innerHTML = "";

  var url = "http://127.0.0.1:1234/api/todos";

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      var todo = data;

      if (todo.length) {
        for (var i in todo) {
          var options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          };
          var created_at = new Date(todo[i].updated_time_stamp);

          var list = `
          <div class="col-md-4">
              <div class="card">
              <div class="card-body">
                  <h2>
                  ${todo[i].title}
                  <span class="card-link delete">
                     <img id="delete" src="static/images/delete.svg" class="img-fluid" alt="icon_" />
                  </span>
                  </h2>
                  <p>
                      <img id="icon" src="static/images/calander.svg" class="img-fluid" alt="icon" />
                      ${created_at.toLocaleDateString("en-US", options)}
                  </p>
  
                  <div id="actions">
                      <a href="#pageTop" class="card-link edit">
                          <img id="icon__" src="static/images/edit.svg" class="img-fluid" alt="icon__" />
                          Edit task
                      </a>
                  </div>
                  <!-- End actions-->
              </div>
              <!-- End card-body-->
              </div>
              <!-- End card-->
          </div><!-- End col-->
          `;
          wrapper.innerHTML += list;
        }
      } else {
        let empty = `
        <div class="img_container">
          <center>
          <img
            id="sad_boy_img"
            src="static/images/sad_boy.png"
            class="img-fluid"
            alt="sad_boy_img"
          />
          </center>
          <h6>Start creating your personal <span>TODO's</span></h6>
        </div>
        `;
        emptyFeed.innerHTML += empty;
        // End img_container
      }

      for (var i in todo) {
        var eventBtn = document.getElementsByClassName("edit")[i];
        var deleteBtn = document.getElementsByClassName("delete")[i];

        eventBtn.addEventListener(
          "click",
          (function (todo) {
            return function () {
              return editTodo(todo);
            };
          })(todo[i])
        );

        deleteBtn.addEventListener(
          "click",
          (function (todo) {
            return function () {
              deleteTodo(todo);
            };
          })(todo[i])
        );
      }
    });
}
createTodos();

var form = document.getElementById("form_wrapper");
form.addEventListener("submit", function (e) {
  e.preventDefault();

  var url = "http://127.0.0.1:1234/api/create-todo";

  if (activeItem != null) {
    var url = `http://127.0.0.1:1234/api/update-todo/${activeItem.id}`;
    activeItem = null;
  }

  var title = document.getElementById("title").value;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({ title: title }),
  }).then((res) => {
    createTodos();
    document.getElementById("form").reset();
  });
});

function editTodo(todo) {
  activeItem = todo;
  document.getElementById("title").value = activeItem.title;
}

function deleteTodo(todo) {
  console.log(`${todo.title} deleted successfully!`);
  fetch(`http://127.0.0.1:1234/api/delete-todo/${todo.id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  }).then((response) => {
    createTodos();
  });
}

// Smooth Scrolling ==========================================================-->
$(document).ready(function () {
  // Add smooth scrolling to all links
  $("a").on("click", function (event) {
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $("html, body").animate(
        {
          scrollTop: $(hash).offset().top,
        },
        800,
        function () {
          // Add hash (#) to URL when done scrolling (default click behavior)
          window.location.hash = hash;
        }
      );
    } // End if
  });
});
// Select all links with hashes
$('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function (event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, "") ==
        this.pathname.replace(/^\//, "") &&
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $("html, body").animate(
          {
            scrollTop: target.offset().top,
          },
          1000,
          function () {
            // Callback after animation
            // Must change focus!
            var $target = $(target);
            $target.focus();
            if ($target.is(":focus")) {
              // Checking if the target was focused
              return false;
            } else {
              $target.attr("tabindex", "-1"); // Adding tabindex for elements not focusable
              $target.focus(); // Set focus again
            }
          }
        );
      }
    }
  });
