// const API_URL = "https://api.jsonbin.io/v3/b/67b3bdbfe41b4d34e491dfda/latest";
// const API_KEY = "$2a$10$uFZKlfYKEgALY5Td/trR6.Nx8osS9/WYUewAQy0DNi50G58E890Pm";

// // 🎯 Show poll form instantly
// function displayPollForm() {
//     document.getElementById("poll").innerHTML = `
//         <h2>First, we want to hear from you—where do you pull style inspiration from?</h2>
//         <form id="poll-form">
//             <label><input type="radio" name="vote" value="daily_life"> People I see in my daily life</label><br>
//             <label><input type="radio" name="vote" value="blogs"> Fashion blogs or runways</label><br>
//             <label><input type="radio" name="vote" value="movies"> Movies and TV shows</label><br>
//             <label><input type="radio" name="vote" value="social_media"> Social media</label><br>
//             <br>
//             <button type="button" id="vote-button" onclick="submitVote()">Vote</button>
//         </form>
//     `;
// }

// // 🎯 Function to load poll results from JSONBin
// async function loadPollResults() {
//     try {
//         const response = await fetch(API_URL, {
//             method: "GET",
//             headers: {
//                 "X-Master-Key": API_KEY,
//                 "Content-Type": "application/json"
//             }
//         });

//         if (!response.ok) {
//             throw new Error("Failed to load poll results");
//         }

//         const data = await response.json();
//         return data.record; // Access the stored poll data
//     } catch (error) {
//         console.error(error);
//         return null;
//     }
// }

// // 🎯 Function to submit a vote and update JSONBin
// async function submitVote() {
//     const selectedOption = document.querySelector('input[name="vote"]:checked');
//     if (!selectedOption) {
//         alert("Please select an option before voting!");
//         return;
//     }

//     let results = await loadPollResults();
//     if (!results) {
//         alert("Error fetching poll data. Please try again.");
//         return;
//     }

//     results[selectedOption.value] += 1; // Increment vote count

//     // Update JSONBin with new poll results
//     await fetch(API_URL.replace("/latest", ""), { // Remove `/latest` for updating
//         method: "PUT",
//         headers: {
//             "X-Master-Key": API_KEY,
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(results)
//     });

//     localStorage.setItem("userVoted", "true"); // Remember user voted
//     displayResults(); // Show results after voting
// }

// // 🎯 Function to display poll results
// async function displayResults() {
//     let pollSection = document.getElementById("poll");
//     pollSection.innerHTML = "<h2>Loading results...</h2>"; // Show instant loading message

//     let results = await loadPollResults();
//     if (!results) {
//         pollSection.innerHTML = "<p>Error loading poll results.</p>";
//         return;
//     }

//     let totalVotes = Object.values(results).reduce((a, b) => a + b, 0);

//     pollSection.innerHTML = "<h2>Results:</h2>";

//     for (let option in results) {
//         let percentage = totalVotes > 0 ? ((results[option] / totalVotes) * 100).toFixed(2) : 0;
//         pollSection.innerHTML += `
//             <p>${formatOptionName(option)}: <strong>${percentage}%</strong></p>
//             <div style="background:#ccc; width:100%; height:20px; margin-bottom:10px;">
//                 <div style="background:#4CAF50; width:${percentage}%; height:20px;"></div>
//             </div>
//         `;
//     }
// }

// // 🎯 Helper function to format names
// function formatOptionName(option) {
//     const names = {
//         daily_life: "People I see in my daily life",
//         blogs: "Fashion blogs or runways",
//         movies: "Movies and TV shows",
//         social_media: "Social media"
//     };
//     return names[option];
// }

// // 🎯 Load poll form instantly, then fetch results if necessary
// document.addEventListener("DOMContentLoaded", function () {
//     if (localStorage.getItem("userVoted")) {
//         displayResults(); // Load results if user already voted
//     } else {
//         displayPollForm(); // Show form instantly, then fetch results in background
//     }
// });


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

// 🎯 Function to submit a vote and update JSONBin
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

    // Update JSONBin with new poll results
    await fetch(API_URL.replace("/latest", ""), { // Remove `/latest` for updating
        method: "PUT",
        headers: {
            "X-Master-Key": API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(results)
    });

    localStorage.setItem("userVoted", "true"); // Remember user voted
    displayResults(); // Show results after voting
}

// 🎯 Function to display the poll form
function displayPollForm() {
    document.getElementById("poll").innerHTML = `
        <h2>First, we want to hear from you—where do you pull style inspiration from?</h2>
        <form id="poll-form">
            <label><input type="radio" name="vote" value="daily_life"> People I see in my daily life</label><br>
            <label><input type="radio" name="vote" value="blogs"> Fashion blogs or runways</label><br>
            <label><input type="radio" name="vote" value="movies"> Movies and TV shows</label><br>
            <label><input type="radio" name="vote" value="social_media"> Social media</label><br>
            <br>
            <button type="button" id="vote-button" onclick="submitVote()">Vote</button>
        </form>
    `;
}

// 🎯 Function to display poll results
async function displayResults() {
    let results = await loadPollResults();
    if (!results) {
        document.getElementById("poll").innerHTML = "<p>Error loading poll results.</p>";
        return;
    }

    let totalVotes = Object.values(results).reduce((a, b) => a + b, 0);

    let pollSection = document.getElementById("poll");
    pollSection.innerHTML = "<h2>Results:</h2>";

    for (let option in results) {
        let percentage = totalVotes > 0 ? ((results[option] / totalVotes) * 100).toFixed(2) : 0;
        pollSection.innerHTML += `
            <p>${formatOptionName(option)}: <strong>${percentage}%</strong></p>
            <div style="background:#ccc; width:100%; height:20px; margin-bottom:10px;">
                <div style="background:#4CAF50; width:${percentage}%; height:20px;"></div>
            </div>
        `;
    }
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
}

// 🎯 Load poll form or results when the page loads
document.addEventListener("DOMContentLoaded", async function () {
    if (localStorage.getItem("userVoted")) {
        await displayResults();
    } else {
        displayPollForm();
    }
});

// microtrends question
function handleChoice(chosenLikeElement){
    d3.selectAll("div").style("display", "none");
    const like = d3.select(chosenLikeElement).attr("data-like");
    console.log(like);
    d3.select("#"+like).style("display","block")
}