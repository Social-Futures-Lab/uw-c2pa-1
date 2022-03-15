var region = "uk";
var studyIDEnds = ["a-d", "b1-d", "b2-d", "b3-d", "b4-d", "c1-d", "c2-d", "c3-d", "c4-d", "a-s", "b1-s", "b2-s", "b3-s", "b4-s", "c1-s", "c2-s", "c3-s", "c4-s"];
const validOrigins =
  /^https?:\/\/(?:localhost(?:\:\d+)?|uwt.az1.qualtrics.com|(?:\w|\-)+.githubpreview.dev|c2pa-ux.netlify.app)/;

contentDiv = document.getElementById("content");
surveyDiv = document.getElementById("survey");
protoFrame = document.getElementById("proto");

function surveyFullscreen() {
  surveyDiv.style.width = "100%";
  contentDiv.style.display = "none";
  surveyDiv.style.height = "100vh";
}

function screenSetup() {
  if (window.innerWidth < window.innerHeight && contentDiv.style.display !== "none") {
    surveyDiv.style.height = "50vh";
    contentDiv.style.height = "50vh";
    surveyDiv.style.width = "100%";
    contentDiv.style.width = "100%";
  }
  else {
    surveyDiv.style.height = "100vh";
    contentDiv.style.height = "100vh";
    if (contentDiv.style.display === "none") {
      surveyFullscreen();
    }
    else {
      surveyDiv.style.width = "50%";
      contentDiv.style.display = "block";
      contentDiv.style.width = "50%";
    }
  }
}

function splitScreen() {
  contentDiv.style.display = "block";
  screenSetup()
}

function generateStudyURL() {
  numConditions = studyIDEnds.length;
  i = Math.floor(Math.random() * numConditions);
  studyURL = "https://c2pa-ux.netlify.app/" + region + "-" + studyIDEnds[i];
  return studyURL;
}

var generatedURL = generateStudyURL();
var baseURL = "https://c2pa-ux.netlify.app/" + region + "-0";

// ===== START

surveyFullscreen();
if (!window.localStorage.getItem("id")) {
  protoFrame.src = "https://c2pa-ux.netlify.app/test-study";
}

window.addEventListener("load", function() {
  screenSetup();
  let url = window.localStorage.getItem("url");
  if (url) {
    protoFrame.src = url;
  }
}, false);

window.addEventListener("resize", function() {
  screenSetup();
}, false);


window.addEventListener("message", (event) => {
  if (validOrigins.test(event.origin) && typeof event.data === "string") {
    console.log("received: " + event.data);

    let msgStart = event.data.substring(0, 2);
    if (msgStart === "t-") {
      overlay.style.display = "block";
      contentDiv.style.display = "none";
      surveyDiv.style.display = "none";
    }

    else if (msgStart === "R_") {
      window.localStorage.setItem("id", event.data);
      protoFrame.src = "";
    }

    else if (msgStart === "q-") {
      protoFrame.contentWindow.postMessage({ action: "highlight", id: event.data}, "*");
      splitScreen();
    }

    else if (msgStart === "c1") {
      baseURL = baseURL + "?responseId=" + window.localStorage.getItem("id");
      protoFrame.src = baseURL;
      window.localStorage.setItem("url", baseURL);
      contentDiv.style.display = "block";
      splitScreen();
    }

    else if (msgStart === "c2") {
      generatedURL = generatedURL + "?responseId=" + window.localStorage.getItem("id");
      protoFrame.src = generatedURL;
      window.localStorage.setItem("url", generatedURL);
      contentDiv.style.display = "block";
      splitScreen();
    }

    else {
      surveyFullscreen();
      if (event.data === "exit") {
        window.localStorage.clear();
      }
    }
  }


}, false);
