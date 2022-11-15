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
          let col = [];
          for (let i = 0; i < data.commit.length; i++) {
            for (let key in myBooks[i]) {
              if (col.indexOf(key) === -1) {
                col.push(key);
              }
            }
          }
          const table = document.createElement("table");
          // Create table header row using the extracted headers above.
          let tr = table.insertRow(-1); // table row.
          for (let i = 0; i < col.length; i++) {
            let th = document.createElement("th"); // table header.
            th.innerHTML = col[i];
            tr.appendChild(th);
          }

          // add json data to the table as rows.
          for (let i = 0; i < data.commit.length; i++) {
            tr = table.insertRow(-1);
            for (let j = 0; j < col.length; j++) {
              let tabCell = tr.insertCell(-1);
              tabCell.innerHTML = data.commit[i][col[j]];
            }
          }
          commits.innerHTML = "";
          commits.appendChild(table);
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
