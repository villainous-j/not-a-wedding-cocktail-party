const selectors = {
  main: "main",
  header: "header",
  section: "section",
  frontArticle: ".front article",
  backArticle: ".back article",
};

const main = document.querySelector(selectors.main);
const headerEls = document.querySelectorAll(selectors.header);
const section = document.querySelector(selectors.section);
const frontArticleEls = document.querySelectorAll(selectors.frontArticle);
console.log('frontArticleEls -- ', frontArticleEls);
// const backArticleEls = document.querySelectorAll(selectors.backArticle);
// let rainbowHues = [0, 40, 80, 120, 160, 200, 240, 280, 320];

section.style.setProperty("--hue", getRandomIntInclusive(0, 359));

frontArticleEls.forEach((article) => {
  // const articleBefore = article.querySelector('::before')
  console.log(window.getComputedStyle(article,':before').backgroundColor)
})

// backArticleEls.forEach((article) => {
//   article.style.setProperty("--hue", getRandomRainbowColor(rainbowHues));
// });

headerEls.forEach((header) => {
  header.addEventListener("click", () => {
    main.toggleAttribute("flipped");
  });
});

// function getRandomRainbowColor(arr) {
//   const selectedColorIndex = Math.floor(arr.length * Math.random())
//   const selectedColor = arr[selectedColorIndex];
//   arr.splice(selectedColorIndex,1)
//   return selectedColor;
// }

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}
