// var fullWidths = ["Intro", "Demographics", "Preliminary Questions"];
var region = "uk";
var studyIDEnds = ["a1"]

contentDiv = document.getElementById("content");
surveyDiv = document.getElementById("survey");
protoFrame = document.getElementById("proto");

function splitDesktop() {
  surveyDiv.style.width = "60%";
  contentDiv.style.display = "block";
  contentDiv.style.width = "40%";
}

function splitMobile() {
  surveyDiv.style.width = "50%";
  contentDiv.style.display = "block";
  contentDiv.style.width = "50%";
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

  // if (window.innerWidth < 768) {
  //   splitMobile();
  // } else { splitDesktop(); }
}

function generateStudyURL() {
  numConditions = studyIDEnds.length;
  i = Math.floor(Math.random() * numConditions);
  studyURL = "https://c2pa-ux.netlify.app/" + region + "_" + studyIDEnds[i];
  return studyURL;
}


window.addEventListener("load", function() {
  screenSetup();
}, false);

window.addEventListener("resize", function() {
  screenSetup();
}, false);


window.addEventListener("message", (event) => {
  if (event.origin === "https://uwt.az1.qualtrics.com") {
    console.log("received: " + event.data);

    let msgStart = event.data.substring(0, 2);
    if (msgStart === "R_") {
      protoFrame.contentWindow.postMessage({ action: "setResponseId", id: event.data}, "*");
      // surveyFullscreen();
    }

    else if (msgStart === "q-") {
      protoFrame.contentWindow.postMessage({ action: "highlight", id: event.data}, "*");
      if (window.innerWidth < 768) {
        splitMobile();
      } else { splitDesktop(); }
    }

    else {
      surveyFullscreen();
      if (msgStart === "c1") {
        protoFrame.src = "https://c2pa-ux.netlify.app/" + region + "_0";
      }

      if (msgStart === "c2") {
        protoFrame.src = generateStudyURL();
      }

    }
  }


}, false);
