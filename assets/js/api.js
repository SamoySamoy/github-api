const form = document.getElementById("search-form");
const searchButton = document.getElementsByClassName("main-button");
const input = document.getElementsByClassName("searchText");
const repoReleaseList = document.getElementsById("repoData");

// fetch repo releases
function requestRepoReleases(repo) {
  // create a variable to hold the `Promise` returned from `fetch`
  // accepted repo url sample: https://github.com/facebook/create-react-app
  const ownerAndRepo = repo.slice(19).split("/");
  return Promise.resolve(
    fetch(
      `https://api.github.com/repos/${ownerAndRepo[0]}/${ownerAndRepo[1]}/releases?per_page=100`
    )
  );
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const repoLink = input.value;
  requestRepoReleases(repoLink)
    .then((result) => result.json())
    .then((data) => {
      if (data.message === "Not Found") {
        let li = document.createElement("li");
        li.innerHTML = `Repo not found, please check your link again`;
        repoReleaseList.appendChild(li);
      } else {
        for (let index in data) {
          let li = document.createElement("li");
          let content = `
          <p><strong>Release:</strong> ${data[index].name}</p>
          <p><strong>Published:</strong> ${data[index].published_at}</p>
          <p><strong>URL:</strong> <a href="${data[index].html_url}">${data[index].html_url}</a></p>
      `;
          li.innerHTML = content;
          repoReleaseList.appendChild(li);
        }
      }
    });
});
