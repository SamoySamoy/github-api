const form = document.getElementById("search-form");
const searchButton = document.getElementById("api-button-release");
const input = document.getElementById("searchText");
const commits = document.getElementById("showData");
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
  if (base > head) {
    let temp = base;
    base = head;
    head = temp;
  }
  return Promise.resolve(
    fetch(
      `https://api.github.com/repos/${ownerAndRepo[0]}/${ownerAndRepo[1]}/compare/${base}...${head}?per_page=100`
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
          let content = data.commits.filter(
            (commit) => commit.commit.committer.name !== "GitHub"
          );
          // Extract value from table header.
          let col = ["#", "Log", "Committer", "Date"];

          // Create a table.
          const table = document.createElement("table");

          // Create table header row using the extracted headers above.
          let tr = table.insertRow(-1); // table row.

          for (let i = 0; i < col.length; i++) {
            let th = document.createElement("th"); // table header.
            th.innerHTML = col[i];
            tr.appendChild(th);
          }
          // add json data to the table as rows.
          for (let i = 0; i < content.length; i++) {
            tr = table.insertRow(-1);
            let id = tr.insertCell(-1);
            id.innerHTML = `${i + 1}`;
            let log = tr.insertCell(-1);
            log.innerHTML = content[i].commit.message;
            let committer = tr.insertCell(-1);
            committer.innerHTML = content[i].commit.committer.name;
            let date = tr.insertCell(-1);
            date.innerHTML = content[i].commit.committer.date;
          }

          commits.innerHTML = "";
          commits.appendChild(table);
        }
      });
  }
});
