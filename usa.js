var region = "us";
var studyIDEnds = ["a-d", "b1-d", "b2-d", "b3-d", "b4-d", "c1-d", "c2-d", "c3-d", "c4-d"];

contentDiv = document.getElementById("content");
surveyDiv = document.getElementById("survey");
protoFrame = document.getElementById("proto");

function splitScreen() {
  if (window.innerWidth < 768) {
    surveyDiv.style.width = "50%";
    contentDiv.style.display = "block";
    contentDiv.style.width = "50%";
  }
  else {
    surveyDiv.style.width = "60%";
    contentDiv.style.display = "block";
    contentDiv.style.width = "40%";
  }
}

function surveyFullscreen() {
  surveyDiv.style.width = "100%";
  contentDiv.style.display = "none";
}

function screenSetup() {
  let overlay = document.getElementById('overlay');
  if (window.innerWidth < window.innerHeight) {
    overlay.style.display = "block";
  }
  else {
    overlay.style.display = "none";
  }
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

window.addEventListener("load", function() {
  screenSetup();
  let url = window.sessionStorage.getItem("url");
  if (url) {
    protoFrame.src = url;
  }
}, false);

window.addEventListener("resize", function() {
  screenSetup();
}, false);


window.addEventListener("message", (event) => {
  if (event.origin === "https://uwt.az1.qualtrics.com") {
    console.log("received: " + event.data);

    let msgStart = event.data.substring(0, 2);
    if (msgStart === "R_") {
      // protoFrame.contentWindow.postMessage({ action: "setResponseId", id: event.data}, "*");
      // console.log("sent id off");
      generatedURL = generatedURL + "?responseId=" + event.data;
      baseURL = baseURL + "?responseId=" + event.data;
    }

    else if (msgStart === "q-") {
      protoFrame.contentWindow.postMessage({ action: "highlight", id: event.data}, "*");
      splitScreen();
    }

    else if (msgStart === "c1") {
      protoFrame.src = baseURL;
      window.sessionStorage.setItem("url", baseURL);
      splitScreen();
    }

    else if (msgStart === "c2") {
      protoFrame.src = generatedURL;
      window.sessionStorage.setItem("url", generatedURL);
      splitScreen();
    }

    else {
      surveyFullscreen();
      if (event.data === "exit") {
        window.sessionStorage.clear();
      }
    }
  }


}, false);
