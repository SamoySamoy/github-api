const form = document.getElementById("search-form");
const searchButton = document.getElementById("api-button-release");
const input = document.getElementById("searchText");
const commits = document.getElementById("comparedCommit");
const releaseSelect1 = document.getElementById("release1");
const releaseSelect2 = document.getElementById("release2");

// fetch repo releases
// accepted repo url sample: https://github.com/facebook/create-react-app
function requestRepoReleases(repoUrl) {
  // create a variable to hold the `Promise` returned from `fetch`
  const ownerAndRepo = repoUrl.slice(19).split("/");
  console.log("Fetching releases...");
  return Promise.resolve(
    fetch(
      `https://api.github.com/repos/${ownerAndRepo[0]}/${ownerAndRepo[1]}/releases?per_page=100`
    )
  );
}

// fetch commits between 2 releases
function requestCommits(repoUrl, base, head) {
  // create a variable to hold the `Promise` returned from `fetch`
  const ownerAndRepo = repoUrl.slice(19).split("/");
  console.log("Fetching commits between two selected releases...");
  return Promise.resolve(
    fetch(
      `https://api.github.com/repos/${ownerAndRepo[0]}/${ownerAndRepo[1]}/compare/${base}...${head}`
    )
  );
}

// dislay data when click button
form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("click event success!!!");
  const repoLink = input.value;
  if (releaseSelect1.childElementCount === 0) {
    // fetch releases from github api
    requestRepoReleases(repoLink)
      .then((result) => result.json())
      .then((data) => {
        if (data.message === "Not Found") {
          console.log("Fetching failed???");
          alert("Your repo's URL is incorrect, please check again!");
        } else {
          console.log("Fetching success!!!");
          const options = data.map((tag) => `<option>${tag.tag_name}</option>`);
          releaseSelect1.innerHTML = options;
          releaseSelect2.innerHTML = options;
        }
      });
  } else {
    // fetch commits between two releases
    requestCommits(repoLink, releaseSelect1.value, releaseSelect2.value)
      .then((result) => result.json())
      .then((data) => {
        if (data.message === "Not Found") {
          console.log("Fetching failed???");
          alert("Maybe you choose same releases, please check again!");
        } else {
          let id = 0;
          const thead = `<thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Log</th>
            <th scope="col">Commiter</th>
          </tr>
        </thead>`;
          let row = [];
          row.push(thead);
          const commitsRaw = data.commits;
          let content = commitsRaw
            .filter((commit) => commit.commit.committer.name !== "GitHub")
            .map(
              (commit) =>
                `
              <tr>
                  <th scope="row">${id++}</th>
                  <td>${commit.commit.message}</td>
                  <td>${commit.commit.committer.name}</td>
              </tr>
          `
            );
          let tbody = `<tbody>${content}</tbody>`;
          row.push(tbody);
          commits.innerHTML = row.join("");
        }
      });
  }
});
