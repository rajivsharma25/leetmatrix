document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-btn");
  const usernameInput = document.getElementById("user-input");
  const statsContainer = document.querySelector(".stats-container");

  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");

  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");

  const cardStatsContainer = document.querySelector(".stats-card");

  // return true or false based on regex
  function validateUserName(username) {
    if (username.trim() == "") {
      alert("Please enter a username");
      return false;
    }
    // Regular Expression for Leetcode username
    const regex = /^[a-zA-Z0-9_-]{1,15}$/; 
    const isMatching = regex.test(username);

    if (!isMatching) {
      alert("Please enter a valid username");
    }
    return isMatching;
  }

  function updateProgress(solved, total, circle, label) {
    const progressDegree = (solved / total) * 100;
    console.log(progressDegree);
    circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    label.textContent = `${solved}/${total}`;
  }

  function displayUserData(userData) {
    const totalHardQues = userData.totalHard;
    const totalMediumQues = userData.totalMedium;
    const totalEasyQues = userData.totalEasy;

    const totalSolvedQuestions = userData.totalSolved;
    const totalSolvedEasyQues = userData.easySolved;
    const totalSolvedMediumQues = userData.mediumSolved;
    const totalSolvedHardQues = userData.hardSolved;

    const ranking = userData.ranking;
    const contributionPoints = userData.contributionPoints;

    // Easy Progress Circle
    updateProgress(
      totalSolvedEasyQues,
      totalEasyQues,
      easyProgressCircle,
      easyLabel
    );
    // Medium Progress Circle
    updateProgress(
      totalSolvedMediumQues,
      totalMediumQues,
      mediumProgressCircle,
      mediumLabel
    );
    // Hard Progress Circle
    updateProgress(
      totalSolvedHardQues,
      totalHardQues,
      hardProgressCircle,
      hardLabel
    );

    const cardData = [
      { label: "Ranking", value: ranking },
      { label: "Total Submisions", value: totalSolvedQuestions },
      { label: "Contribution Points", value: contributionPoints },
    ];

    // Stats Container
    cardStatsContainer.innerHTML = cardData.map((card) => {
      return `
        <div class="card">
          <h3>${card.value}</h3>
          <p>${card.label}</p>
        </div>
      `;
    }).join("");

  }

  async function fetchUserData(username) {
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.json();
      console.log(userData);
      displayUserData(userData);
    } catch (error) {
      statsContainer.innerHTML = `<p>No Data Found</p>`;
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
    }
  }

  searchButton.addEventListener("click", function () {
    const username = usernameInput.value;
    console.log("Username:", username);
    if (validateUserName(username)) {
      fetchUserData(username);
    }
  });
});
