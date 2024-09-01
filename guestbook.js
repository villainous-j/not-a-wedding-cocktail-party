const selectors = {
  article: "[js-article]",
  content: "[js-content]",
  author: "[js-author]",
  colour: "[js-colour]",
  editLink: "[js-button-edit]",
};

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://guestbook.dnswrsrx.com/", {
    headers: { Authorization: "Basic 844f30425b73ca1a6b80d0b483b758a5" },
  })
    .then((resp) => resp.json())
    .then((payload) => {
      const posts = localStorage.getItem("posts") || [];
      const template = document.getElementById("article-template");

      payload.forEach((data) => {
        const templateInstance = template.cloneNode(true).content;

        const article = templateInstance.querySelector(selectors.article);
        const content = templateInstance.querySelector(selectors.content);
        const author = templateInstance.querySelector(selectors.author);
        const colour = templateInstance.querySelector(selectors.colour);
        const editLink = templateInstance.querySelector(selectors.editLink);

        // modify template
        article.style.setProperty(
          "--color-text",
          _calculateTextColour(data.colour)
        );
        article.style.setProperty("--color-background", `${data.colour}`);
        article.dataset.id = data.id;
        content.innerHTML = data.text;
        author.innerHTML = data.author;
        colour.innerHTML = `${data.colour}`;

        if (posts.includes(data.id)) {
          editLink.id = data.id;
        } else {
          editLink.remove();
        }

        document.querySelector("section").appendChild(templateInstance);
      });

      _initEditButtons();
    })
    .catch((e) => console.log(e));
});

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(e.target);

  fetch("https://guestbook.dnswrsrx.com/", {
    headers: { Authorization: "Basic 844f30425b73ca1a6b80d0b483b758a5" },
    method: "POST",
    body: data,
  })
    .then((resp) => resp.text())
    .then((id) => {
      localStorage.setItem("posts", id);
      location.assign(location.href);
    });
});

const form = document.querySelector("form");
const formArticle = form.querySelector("article");
const formContent = form.querySelector(".content");
const formColorLabel = form.querySelector(".color-label");

formContent.addEventListener("click", () => {
  form.setAttribute("data-form-state", "edit");
  form.text.focus();
});

form.querySelector("#color-picker").addEventListener("input", (e) => {
  _updateFormColour(e.target.value);
});

function _updateFormColour(colourHex) {
  formArticle.style.setProperty(
    "--color-text",
    _calculateTextColour(colourHex)
  );
  formArticle.style.setProperty("--color-background", colourHex);
  formColorLabel.innerText = colourHex;
}

function _hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function _calculateLuminance(rgb) {
  const result = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
  return result;
}

function _calculateTextColour(colourHex) {
  const colourRGB = _hexToRgb(colourHex);
  const luminance = _calculateLuminance(colourRGB);
  return luminance < 120 ? "#ffffff" : "#000000";
}

function _initEditButtons() {
  const editButtons = document.querySelectorAll("[js-button-edit]");

  editButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const parentArticle = e.target.closest("article");
      const content = parentArticle.querySelector(selectors.content);
      const author = parentArticle.querySelector(selectors.author);
      const colour = parentArticle.querySelector(selectors.colour);

      form.setAttribute("data-form-state", "edit");
      form.text.focus();
      form.text.value = content.innerText;
      form.author.value = author.innerText;
      form.id.value = parentArticle.dataset.id;
      form.colour.value = colour.innerText;
      _updateFormColour(colour.innerText);
    });
  });
}
