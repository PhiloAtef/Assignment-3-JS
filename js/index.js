const nameRegex = /^\w{3,}$/;
const siteRegex = /^(https:\/\/)?(www\.)?\w+\.\w{2,}\/?(:\d{2,5})?(\/\w+)*$/;
var body = document.getElementById("body");
var modal = new bootstrap.Modal(document.getElementById("regexModalWarning"), {});
var bookmarkNameInput = document.getElementById("bookmarkNameInput");
var bookmarkSiteInput = document.getElementById("bookmarkSiteInput");

var bookmarks = [];
if (localStorage.getItem("bookmarks") != null)
  bookmarks = JSON.parse(localStorage.getItem("bookmarks"));

displayBookmarks();

function submitBookmark() {
  
  var isNameAndSiteMatching =
    checkRegex(bookmarkNameInput.value, nameRegex) &&
    checkRegex(bookmarkSiteInput.value, siteRegex);


  if (!isNameAndSiteMatching) {
    modal.show();
    return;
  }

  var savedBookmark = {
    name: bookmarkNameInput.value,
    site: bookmarkSiteInput.value,
  };

  bookmarks.push(savedBookmark);
  refreshBookmarks();
  clearForm();
}

function displayBookmarks() {
  trs = "";

  for (let i = 0; i < bookmarks.length; i++) {
    const element = bookmarks[i];
    trs += `<tr>
    <td>${i + 1}</td>
    <td>${element.name}</td>
    <td>
        <button onclick="visitWebsite(\'${
          element.site
        }\')" class="btn btn-visit">
            <i class="fa-solid fa-eye"></i>
            Visit
        </button>
    </td>
    <td>
        <button onclick="deleteBookmark(${i})" class="btn btn-delete">
            <i class="fa-solid fa-eye"></i>
            Delete
        </button>
    </td>
</tr>
    `;
  }

  document.getElementById("tableContent").innerHTML = trs;
}

function deleteBookmark(index) {
  bookmarks.splice(index, 1);
  refreshBookmarks();
}

/* something is happening here related to https and http, probably browser security protocols */
function visitWebsite(url) {
  var hasHttpsRegex = /^https?:\/\//i;
  if (!url.match(hasHttpsRegex)) {
        url = 'http://' + url;
    }

  open(url);
}


function refreshBookmarks() {
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  displayBookmarks();
}

function clearForm() {
  bookmarkNameInput.value = "";
  bookmarkSiteInput.value = "";

  [bookmarkNameInput, bookmarkSiteInput].forEach(element => {
    element.classList.remove("regexMatch");
    element.classList.remove("regexNotMatch");
  });
}

/* regex is a mess */
function checkRegex(text, regex) {
  return regex.test(text);
}

function addRegexClassesToElement(htmlElement, isMatching) {
  if (isMatching) {
    htmlElement.classList.add("regexMatch");
    htmlElement.classList.remove("regexNotMatch");
  } else {
    htmlElement.classList.add("regexNotMatch");
    htmlElement.classList.remove("regexMatch");
  }
}

function checkInputValidity(element, regex) {
  var isRegexValid = checkRegex(element.value, regex);
  addRegexClassesToElement(element, isRegexValid);
}
