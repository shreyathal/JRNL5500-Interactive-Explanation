const API_URL = "https://api.jsonbin.io/v3/b/67b3bdbfe41b4d34e491dfda/latest";
const API_KEY = "$2a$10$uFZKlfYKEgALY5Td/trR6.Nx8osS9/WYUewAQy0DNi50G58E890Pm";

// 🎯 Function to load poll results from JSONBin
async function loadPollResults() {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "X-Master-Key": API_KEY,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to load poll results");
        }

        const data = await response.json();
        return data.record; // Access the stored poll data
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function submitVote() {
    const selectedOption = document.querySelector('input[name="vote"]:checked');
    if (!selectedOption) {
        alert("Please select an option before voting!");
        return;
    }

    let results = await loadPollResults();
    if (!results) {
        alert("Error fetching poll data. Please try again.");
        return;
    }

    results[selectedOption.value] += 1; // Increment vote count

    // 🛑 Store user's vote in localStorage
    localStorage.setItem("userVoted", "true");
    localStorage.setItem("userVotedChoice", selectedOption.value);

    // Hide poll form
    document.getElementById("poll").style.display = "none";

    // Show loading spinner
    document.getElementById("loading").style.display = "block";

    // Simulate a delay so the spinner is visible
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update JSONBin with new poll results
    await fetch(API_URL.replace("/latest", ""), {
        method: "PUT",
        headers: {
            "X-Master-Key": API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(results)
    });

    // Hide spinner and show results
    document.getElementById("loading").style.display = "none";
    document.getElementById("poll-results").style.display = "block";

    // Show updated results
    await displayResults();
}

async function displayResults() {
    let pollOutput = document.getElementById("poll-output");

    // Fetch poll results
    let results = await loadPollResults();

    if (!results) {
        pollOutput.innerHTML = "<p>Error loading poll results.</p>";
        return;
    }

    let userVote = localStorage.getItem("userVotedChoice"); // Retrieve the user's choice
    let totalVotes = Object.values(results).reduce((a, b) => a + b, 0);
    let resultsHTML = "";

    // Step 1: Compute raw percentages and initial rounding
    let roundedPercentages = {};
    let sum = 0;
    let lastKey = null;

    Object.keys(results).forEach((option, index, array) => {
        let raw = (results[option] / totalVotes) * 100;
        let rounded = Math.round(raw);
        roundedPercentages[option] = rounded;
        sum += rounded;
        lastKey = option; // Track the last option to adjust later
    });

    // Step 2: Adjust the last value to ensure total = 100%
    let difference = 100 - sum;
    roundedPercentages[lastKey] += difference;

    // Step 3: Display results
    Object.keys(results).forEach(option => {
        let percentage = roundedPercentages[option];

        // If this option matches the user's vote, add checkmarks
        if (option === userVote) {
            resultsHTML += `
                <p style="font-weight: bold; font-size: 1.5rem; color: #006B6B;">
                    ✔ ${formatOptionName(option)}: <strong>${percentage}%</strong> ✔
                </p>
            `; 
        } else {
            resultsHTML += `
                <p>${formatOptionName(option)}: <strong>${percentage}%</strong></p>
            `;
        }

        resultsHTML += `
            <div style="background:#ccc; width:100%; height:20px; margin-bottom:70px; padding: 5px; border-radius: 5px;">
                <div style="background:#006B6B; width:${percentage}%; height:20px; border-radius: 5px;"></div>
            </div>
        `;
    });

    // Show poll results
    pollOutput.innerHTML = resultsHTML;
}

// 🎯 Helper function to format names
function formatOptionName(option) {
    const names = {
        daily_life: "People I see in my daily life",
        blogs: "Fashion blogs or runways",
        movies: "Movies and TV shows",
        social_media: "Social media"
    };
    return names[option];
};

document.addEventListener("DOMContentLoaded", async function () {
    if (localStorage.getItem("userVoted") === "true") {
        // 🛑 User has already voted → Hide the poll and show results
        document.getElementById("poll").style.display = "none";
        document.getElementById("poll-results").style.display = "block";
        await displayResults();
    } else {
        // ✅ User has NOT voted → Show the poll form
        document.getElementById("poll").style.display = "block";
        document.getElementById("poll-results").style.display = "none";
    }
});

// questions
function handleChoice(chosenLikeElement, id){
    d3.selectAll("." + id).style("display", "none");
    const like = d3.select(chosenLikeElement).attr("data-like");
    console.log(like);
    d3.select("#"+like).style("display","block");
};

//scrollto 
function scrollDown(targetId) {
    let targetElement = d3.select(`#${targetId}`).node();
    if (targetElement) {
      let elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      d3.transition()
      .duration(500)
      .tween ("scroll", function (){
      let i = d3.interpolateNumber(window.scrollY,elementPosition);
      return function (t){
      window.scrollTo({ top:i(t), behavior:'auto'});
      };
      });
    }
  }

//button recolor
function recolor (clickedElement, id){
    let parentUl = clickedElement.closest ("ul");
    d3.select(parentUl).selectAll("button").style("background-color", "#9E76B4");
    let button = clickedElement.querySelector("button");
    if (button){
   let desiredColor = clickedElement.getAttribute("data-color");
   d3.select(button).style("background-color", desiredColor)
    }
}