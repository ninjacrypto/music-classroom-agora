 function openNav() {
  document.getElementById("mySidepanel").style.width = "250px";
  document.getElementById("openbtn").style.display = "none";
}

function closeNav() {
  document.getElementById("mySidepanel").style.width = "0";
  document.getElementById("openbtn").style.display = "block";
}

function openChat() {
  document.getElementById("mySidepane2").style.width = "400px";
  document.getElementById("openchatbtn").style.display = "none";
}

function closeChat() {
  document.getElementById("mySidepane2").style.width = "0";
  document.getElementById("openchatbtn").style.display = "block"; 
}

/* Main page Record */
var mainPanelInitialized = false;
var totalMinimizedPanels = 0;
var differenceInPositioningRecord;
var differenceInPositioningMixer;
var differenceInPositioningTracks;
function showRecord(y) {
  var a;
  if(mainPanelInitialized == false){
    //
    a = 58;
  } else {
    a = 58 + y;
  }
  mainPanelInitialized = true;    
  b = a.toString() + 'px';
  document.getElementById("controlPanelTop").style.bottom = b;
  document.getElementById("closeRecord").style.display = "block";
  x = document.getElementById("controlPanelTop");
  fadeIn(x);
}

function closeRecord() {
  document.getElementById("controlPanelTop").style.top = "-2700px";
  document.getElementById("controlPanelTop").style.opacity = 0;
  document.getElementById("closeRecord").style.display = "none";
  if(totalMinimizedPanels == 0){
    mainPanelInitialized = false;
  } 
}
/* Fade in */
function fadeIn(x){
  x.style.transition = "opacity 1s linear 0s";
  x.style.opacity = 1;
}

/* Change color on main control panel */
function changeColor(y) {
  var x = document.getElementsByClassName("switch");

  for (i=0; i<x.length; i++) {
    x[i].style.color = y;
    x[i].style.borderColor = y;
  }
}

/* Start BPM */
function startBpm() {
  document.getElementById("panelTopStartWrapper").style.display = "none";
  document.getElementById("panelTopStartWrapperAlt").style.display = "flex";
}

/* Stop BPM */
function stopBpm() {
  document.getElementById("panelTopStartWrapper").style.display = "flex";
  document.getElementById("panelTopStartWrapperAlt").style.display = "none";
}
/* Start Recording change colors & text */
var startRecordingBoolean = false;
function startRecording() {
  if(startRecordingBoolean == true) {
    startRecordingBoolean = false;
    document.getElementById("startRecordingWrapper").style.borderColor = "#FBFF49";
    document.getElementById("startRecordingBtn").innerHTML = "Start<br>Recording";
    document.getElementById("startRecordingBtn").style.backgroundColor = "#88f21e";
    document.getElementById("startRecordingBtn").style.color = "black";
    document.getElementById("saveRecording").style.display = "flex";
      /* Display current date & time */
/*        var currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
*/      var currentTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
      var currentDate = new Date().toLocaleDateString();
      var dateAndTime = currentDate + ', ' + currentTime; 
      document.getElementById("currentTime").innerHTML = dateAndTime;
  } else {
    startRecordingBoolean = true;
    document.getElementById("startRecordingWrapper").style.borderColor = "#F31212";
    document.getElementById("startRecordingBtn").innerHTML = "Stop<br>Recording";
    document.getElementById("startRecordingBtn").style.backgroundColor = "#F31212";
    document.getElementById("startRecordingBtn").style.color = "#FBFF49";
/*      var x = setInterval(leadTimeCounter, 1000);    
      function leadTimeCounter() {
        var y = document.getElementById("leadTimeNum").value;
        if(y >=1) {  
          var a = --y;
          document.getElementById("leadTimeNum").value = a;
        } else {
          clearInterval(x);
        } 
      }
    */    }
}

/* Tracks */
function showTracks(y) {
  var a;
  if(mainPanelInitialized == false){
    a = 58;
  } else {
    a = 58 + y;
  }
  mainPanelInitialized = true;    
  b = a.toString() + 'px';

  
  document.getElementById("tracksContainer").style.bottom = b;
  document.getElementById("tracksContainer").style.display = "flex";
  document.getElementById("closeTracks").style.display = "block";
    
}

function closeTracks() {
  document.getElementById("tracksContainer").style.display = "none";
  document.getElementById("closeTracks").style.display = "none";
  if(totalMinimizedPanels == 0){
    mainPanelInitialized = false;
  }
}

/* Close Recording without saving it */
function closeRecordNoSave() {
  document.getElementById("saveRecording").style.display = "none";
}

function tempChangeScene(x) {
  switch (x) {
    case 1:
    document.getElementById("stageContainer").style.display = "flex";
    document.getElementById("twoGuests").style.display = "none";
    document.getElementById("manyGuests").style.display = "none";
    document.getElementById("userProfileContainer").style.display = "none";
    document.getElementById("closeUserProfile").style.display = "none";
    break;
    case 2:
    tempChatBox(3);
    document.getElementById("stageContainer").style.display = "none";
    document.getElementById("twoGuests").style.display = "flex";  
    document.getElementById("manyGuests").style.display = "none";
    document.getElementById("userProfileContainer").style.display = "none";
    document.getElementById("closeUserProfile").style.display = "none";
    break;
    case 3:
    tempChatBox(4);
    document.getElementById("stageContainer").style.display = "none";
    document.getElementById("twoGuests").style.display = "none";
    document.getElementById("manyGuests").style.display = "flex";
    document.getElementById("userProfileContainer").style.display = "none";
    document.getElementById("closeUserProfile").style.display = "none";
    break;
  }
  

}


// Making video containers draggable

var container = document.querySelector("#stageContainer");
var activeItem = null;

var active = false;

container.addEventListener("touchstart", dragStart, false);
container.addEventListener("touchend", dragEnd, false);
container.addEventListener("touchmove", drag, false);

container.addEventListener("mousedown", dragStart, false);
container.addEventListener("mouseup", dragEnd, false);
container.addEventListener("mousemove", drag, false);


function dragStart(e) {

if (e.target !== e.currentTarget) {
  active = true;

  activeItem = e.target;

  if (activeItem !== null) {
    if (!activeItem.xOffset) {
      activeItem.xOffset = 0;
    }

    if (!activeItem.yOffset) {
      activeItem.yOffset = 0;
    }

    if (e.type === "touchstart") {
      activeItem.initialX = e.touches[0].clientX - activeItem.xOffset;
      activeItem.initialY = e.touches[0].clientY - activeItem.yOffset;
    } else {
      console.log("doing something!");
      activeItem.initialX = e.clientX - activeItem.xOffset;
      activeItem.initialY = e.clientY - activeItem.yOffset;
    }
  }
}
}

function dragEnd(e) {
if (activeItem !== null) {
  activeItem.initialX = activeItem.currentX;
  activeItem.initialY = activeItem.currentY;
}

active = false;
activeItem = null;
}

function drag(e) {
if (active) {
  if (e.type === "touchmove") {
    e.preventDefault();

    activeItem.currentX = e.touches[0].clientX - activeItem.initialX;
    activeItem.currentY = e.touches[0].clientY - activeItem.initialY;
  } else {
    activeItem.currentX = e.clientX - activeItem.initialX;
    activeItem.currentY = e.clientY - activeItem.initialY;
  }

  activeItem.xOffset = activeItem.currentX;
  activeItem.yOffset = activeItem.currentY;

  setTranslate(activeItem.currentX, activeItem.currentY, activeItem);
}
}

function setTranslate(xPos, yPos, el) {
el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

/* Mixer show/close */

function showMixer(y) {
var a;
if(mainPanelInitialized == false) {
  a = 58;
} else {
  a = 58 + y;
}
mainPanelInitialized = true;
b = a.toString() + 'px';
document.getElementById("mixerPanel").style.bottom = b;
document.getElementById("mixerPanel").style.display = "flex";  

}

function closeMixer() {
document.getElementById("mixerPanel").style.display = "none";
if(totalMinimizedPanels == 0){
  mainPanelInitialized = false;
}
}

// Minimize or maximize

function minimizeRecord() {
document.getElementById("minimizedPanels").style.display = "flex";
document.getElementById("minimizedRecord").style.display = "flex";
totalMinimizedPanels++;
closeRecord();
}

function maximizeRecord() {

document.getElementById("minimizedRecord").style.display = "none";
totalMinimizedPanels--;
if(totalMinimizedPanels == 0) {
  document.getElementById("minimizedPanels").style.display = "none";
  differenceInPositioningRecord = 0;
  showRecord(differenceInPositioningRecord);
} else {
  differenceInPositioningRecord = -30;
  showRecord(differenceInPositioningRecord);
}
}

function minimizeMixer() {
document.getElementById("minimizedPanels").style.display = "flex";
document.getElementById("minimizedMixer").style.display = "flex";
totalMinimizedPanels++;
closeMixer();
}

function maximizeMixer() {

document.getElementById("minimizedMixer").style.display = "none";
totalMinimizedPanels--;
if(totalMinimizedPanels == 0) {
  document.getElementById("minimizedPanels").style.display = "none";
  differenceInPositioningMixer = 0;
  showMixer(differenceInPositioningMixer);
}
else {
  differenceInPositioningMixer = 30;
  showMixer(differenceInPositioningMixer);
}
}

function minimizeTracks() {
document.getElementById("minimizedPanels").style.display = "flex";
document.getElementById("minimizedTracks").style.display = "flex";
totalMinimizedPanels++;
closeTracks();
}

function maximizeTracks() {

document.getElementById("minimizedTracks").style.display = "none";
totalMinimizedPanels--;
if(totalMinimizedPanels == 0) {
  document.getElementById("minimizedPanels").style.display = "none";
  differenceInPositioningTracks = 0;
  showTracks(differenceInPositioningTracks);
}
else {
  differenceInPositioningTracks = 30;
  showTracks(differenceInPositioningTracks);
}
}

function sliderController() {
var masterSlider = document.getElementById("controlPanelMasterVolumeSlider");
masterSlider.addEventListener("input", function () {
  
  document.body.style.setProperty("--sliderImage", "url('cpmv" + this.value + ".png')");
    
});
}

function displayFeatures() {
document.getElementById("featuresPanel").style.display = "flex";
}

function displayMixer() {
document.getElementById("mixerPanel").style.display = "flex";
document.getElementById("closeMixer").style.display = "flex";
}

function displayRecording() {
document.getElementById("recordingPanel").style.display = "flex";
}

function displayTracks() {
document.getElementById("tracksContainer").style.display = "flex";
document.getElementById("closeTracks").style.display = "block";
}

function displayRecordingInProcess() {
document.getElementById("recordingPanel").style.display = "none";
document.getElementById("recordingInProcessPanel").style.display = "flex";
// countdown
var y = document.getElementById("leadTimeNum").value;
document.getElementById("leadTimeNumCountdown").innerHTML = y;
var x = setInterval(leadTimeCounter, 1000);    
      function leadTimeCounter() {
        if(y >=1) {  
          a = --y;
          document.getElementById("leadTimeNumCountdown").innerHTML = a;
        } else {
          clearInterval(x);
        } 
      }
}

function displaySaveRecording() {
document.getElementById("recordingInProcessPanel").style.display = "none";
document.getElementById("saveRecording").style.display = "flex";
}

function tempChatBox(x) {
switch (x) {
  case 1:
  document.getElementById("guestChatBox1").style.display = "flex";
  document.getElementById("guestChatBox2").style.display = "none";
  document.getElementById("guestChatBox3").style.display = "none";
  document.getElementById("guestChatBox4").style.display = "none";
  document.getElementById("guestChatBox5").style.display = "none";
  break;
  case 2:
    document.getElementById("guestChatBox1").style.display = "flex";
    document.getElementById("guestChatBox2").style.display = "flex";
    document.getElementById("guestChatBox3").style.display = "none";
    document.getElementById("guestChatBox4").style.display = "none";
    document.getElementById("guestChatBox5").style.display = "none";
  break;
  case 3:
    document.getElementById("guestChatBox1").style.display = "flex";
    document.getElementById("guestChatBox2").style.display = "flex";
    document.getElementById("guestChatBox3").style.display = "flex";
    document.getElementById("guestChatBox4").style.display = "none";
    document.getElementById("guestChatBox5").style.display = "none";
  break;
  case 4:
    document.getElementById("guestChatBox1").style.display = "flex";
    document.getElementById("guestChatBox2").style.display = "flex";
    document.getElementById("guestChatBox3").style.display = "flex";
    document.getElementById("guestChatBox4").style.display = "flex";
    document.getElementById("guestChatBox5").style.display = "none";
  break;
  case 5:
    document.getElementById("guestChatBox1").style.display = "flex";
    document.getElementById("guestChatBox2").style.display = "flex";
    document.getElementById("guestChatBox3").style.display = "flex";
    document.getElementById("guestChatBox4").style.display = "flex";
    document.getElementById("guestChatBox5").style.display = "flex";
  break;
}
}

function closeLeftMenuOptions() {
var x = document.getElementsByClassName("leftSideMenuChoiceSelected");
var i;
for (i = 0; i < x.length; i++) {
  x[i].style.display = "none";
}
}
var redirectedFromTextareaControls = false;
var textareaControlInUse = 0;

function openLeftMenuOptions(a) {
closeNav();
var x = document.getElementsByClassName("leftSideMenuChoiceSelected");
x[a].style.display = "flex";
if (redirectedFromTextareaControls == true) {
  redirectedFromTextareaControls = false;
  textareaControlInUse = 0;
  closeTextareaControls();
}
}

function profileAddBand() {
closeLeftMenuOptions();
document.getElementById("profileAddBandContainer").style.display = "flex";
}

function openProfile() {
closeNav();
document.getElementById("stageContainer").style.display = "none";
document.getElementById("twoGuests").style.display = "none";
document.getElementById("manyGuests").style.display = "none";
document.getElementById("userProfileContainer").style.display = "flex";
document.getElementById("closeUserProfile").style.display = "block";
document.getElementById("bandsILeadBtn").style.color = "red";
document.getElementById("bandsIBelongToBtn").style.color = "white";
}

function closeUserProfile() {
document.getElementById("userProfileContainer").style.display = "none";
document.getElementById("closeUserProfile").style.display = "none";
document.getElementById("bandsILeadBtn").style.color = "red";
document.getElementById("stageContainer").style.display = "flex";
}

function leadOrBelongTo(x) {
if (x == 1) {
  document.getElementById("profileBandsILeadContent").style.display = "flex";
  document.getElementById("bandsILeadBtn").style.color = "red";
  document.getElementById("profileBandsIBelongToContent").style.display = "none";
  document.getElementById("bandsIBelongToBtn").style.color = "white";
}
else if(x == 2) {
  document.getElementById("profileBandsILeadContent").style.display = "none";
  document.getElementById("bandsILeadBtn").style.color = "white";
  document.getElementById("profileBandsIBelongToContent").style.display = "flex";
  document.getElementById("bandsIBelongToBtn").style.color = "red";
}
else {
  alert("Oops. Something went wrong!");
}
}

function closeRecordingPanel() {
document.getElementById("recordingPanel").style.display = "none";
}
//
//
//
//
//
//
//
//
// below code after design overhaul
var audioOnly = false;
// new 12/22
var numberOfCurrentCaptures = 2;
// end new 12/22
var currentCapturePanel = 1;

function newRecordingProcess() {
document.getElementById("stageContainer").style.display = "none";
// new 12/22
//var y = "newMainContentArea" + numberOfCurrentCaptures;
//document.getElementById(y).style.display = "none";
document.getElementById("newMainContentArea1").style.display = "none";
//end new 12/22
document.getElementById("newMainToolbarExtra").style.display = "none";
document.getElementById("newMainToolbar").style.display = "none";
document.getElementById("newRecordingProcessContainer").style.display = "flex";  
document.getElementById("newRecordingPanelOneContainer").style.display = "flex";
document.getElementById("closeNewRecording").style.display = "block";
document.getElementById("newRecordingPanelTwoContainer").style.display = "none";
document.getElementById("newRecordingPanelThreeContainer").style.display = "none";
hideNewRecordingPanelFour();
hideNewRecordingPanelFive();
hideNewRecordingPanelSix();
document.getElementById("newRecordingPanel7Container").style.display = "none";
document.getElementById("newRecordingPanel8Container").style.display = "none";
audioOnly = false;
}

function closeNewRecording() {
document.getElementById("stageContainer").style.display = "none";
document.getElementById("newRecordingProcessContainer").style.display = "none";
document.getElementById("newRecordingPanelTwoContainer").style.display = "none";
document.getElementById("newRecordingPanelThreeContainer").style.display = "none";
hideNewRecordingPanelFour();
hideNewRecordingPanelFive();
hideNewRecordingPanelSix();
document.getElementById("newRecordingPanel7Container").style.display = "none";
document.getElementById("newRecordingPanel8Container").style.display = "none";
document.getElementById("newRecordingLeadTimeNum").value = "3";
// new 12/22
//var y = "newMainContentArea" + numberOfCurrentCaptures;
//document.getElementById(y).style.display = "flex";
document.getElementById("newMainContentArea1").style.display = "flex";
// end new 12/22
document.getElementById("newMainToolbarExtra").style.display = "flex";
document.getElementById("newMainToolbar").style.display = "flex";
audioOnly = false;
}

function newRecordingPanelTwo(x) {
document.getElementById("newRecordingPanelOneContainer").style.display = "none";
document.getElementById("newRecordingPanelTwoContainer").style.display = "flex";
document.getElementById("newRecordingPanelThreeContainer").style.display = "none";
if(x==1) {
  audioOnly = true;
}
}

function goBackToNewRecordingPanelOne() {
document.getElementById("newRecordingPanelOneContainer").style.display = "flex";
document.getElementById("newRecordingPanelTwoContainer").style.display = "none";
document.getElementById("newRecordingPanelThreeContainer").style.display = "none";
document.getElementById("newRecordingLeadTimeNum").value = "20";
audioOnly = false;
}

// change lead time
function newRecordingChangeLeadTime(x) {
y = document.getElementById("newRecordingLeadTimeNum").value;
if(x==1) {
  --y;
  document.getElementById("newRecordingLeadTimeNum").value = y;
} else {
  ++y;
  document.getElementById("newRecordingLeadTimeNum").value = y;
}
}

function newRecordingPanelThree() {
if(audioOnly == true) {
  newRecordingPanelFour();
} else {
document.getElementById("newRecordingPanelOneContainer").style.display = "none";
document.getElementById("newRecordingPanelTwoContainer").style.display = "none";
document.getElementById("newRecordingPanelThreeContainer").style.display = "flex";
fadeInCameraContent();
}
}

function goBackToNewRecordingPanelTwo() {
document.getElementById("newRecordingPanelOneContainer").style.display = "none";
document.getElementById("newRecordingPanelTwoContainer").style.display = "flex";
document.getElementById("newRecordingPanelThreeContainer").style.display = "none";
}

function newRecordingPanelFour() {
document.getElementById("newRecordingPanelOneContainer").style.display = "none";
document.getElementById("newRecordingPanelTwoContainer").style.display = "none";
document.getElementById("newRecordingPanelThreeContainer").style.display = "none";
updateRecordingFourCaptures();
document.getElementById("newMainToolbar").style.display = "flex";

}

function newRecordingPanelFive() {
document.getElementById("closeNewRecording").style.display = "none";
hideNewRecordingPanelFour();
updateRecordingFiveCaptures();
beanCounter();
}


var fromContestPage = false;

function beanCounter() {
// countdown
y = document.getElementById("newRecordingLeadTimeNum").value;
z = "panelFiveLeadTime" + numberOfCurrentCaptures;
document.getElementById(z).innerHTML = y;
var x = setInterval(leadTimeCounter, 1000);    
      function leadTimeCounter() {
        if(y >=1) {  
          a = --y;
          document.getElementById(z).innerHTML = a;
        } else {
          clearInterval(x);
          if (fromContestPage == true){
            newRecordingPanelSixContest();
            fromContestPage = false;
          } else {
          newRecordingPanelSix();
        }
        } 
      }
}



var bpmValue;
var bpmCounterRun;

function newRecordingPanelSix() {
bpmValue = document.getElementById("newRecordingBPMNum").value;

  if (bpmValue != "") {
  
    bpmCounterRun = true;
    bpmBeanCounter();
  }
var y = "newRecordingPanelSixContainer" + numberOfCurrentCaptures;
document.getElementById(y).style.display = "flex";
hideNewRecordingPanelFive();
if (textareaControlInUse != 0) {
  switch (textareaControlInUse) {
    case 1:
      textareaControls(4);
      break;
    case 2:
      textareaControls(5);
      break;
    case 3:
      textareaControls(6);
      break;
    case 4:
      textareaControls(4);
      break;
    case 5:
      textareaControls(5);
      break;
    case 6:
      textareaControls(6);
      break;
    case 7:
      textareaControls(4);
      break;
    case 8:
      textareaControls(5);
      break;
    case 9:
      textareaControls(6);
      break;
}
}
}

function tempTrackButtons(x) {
if(x==0) {
  document.getElementById("newRecordingPanelTwoWithoutTracks").style.display = "flex";
  document.getElementById("newRecordingPanelTwoWithTracks").style.display = "none";
} else {
  document.getElementById("newRecordingPanelTwoWithoutTracks").style.display = "none";
  document.getElementById("newRecordingPanelTwoWithTracks").style.display = "flex";
}
}

function fadeInCameraContent(){
setTimeout (function() {
x = document.getElementById("newRecordingPanelThreeBottomLeft1");
x.style.transition = "opacity 2s linear 0s";
x.style.opacity = 1;
y = document.getElementById("newRecordingPanelThreeBottomLeft2");
y.style.transition = "opacity 2s linear 2s";
y.style.opacity = 1;
}, 1000);
}

var stageStatus = "off";
function newChangeView() {
if(stageStatus == "off") {
  document.getElementById("stageContainer").style.display = "flex";
  document.getElementById("newMainToolbarExtra").style.display = "none";
  document.getElementById("newMainToolbar").style.display = "none";
// new 12/22
//  var y = "newMainContentArea" + numberOfCurrentCaptures;
//  document.getElementById(y).style.display = "none";
  document.getElementById("newMainContentArea1").style.display = "none";
//end new 12/22
  stageStatus = "on";
} else {
  document.getElementById("stageContainer").style.display = "none";
  document.getElementById("newMainToolbarExtra").style.display = "flex";
  document.getElementById("newMainToolbar").style.display = "flex";
// new 12/22
//  var y = "newMainContentArea" + numberOfCurrentCaptures;
//  document.getElementById(y).style.display = "none";
  document.getElementById("newMainContentArea1").style.display = "flex";
//end new 12/22
  stageStatus = "off";
}
}

function numberOfCurrentCapturesSwitch(x) {
numberOfCurrentCaptures = x;
var y = "newMainContentArea" + numberOfCurrentCaptures;
document.getElementById("stageContainer").style.display = "none";
document.getElementById(y).style.display = "flex";
var i;
var a;
    for(i = 1; i < 17; i++) {
      if (i == x) {
        continue;
      } else {
      a = "newMainContentArea" + i;
      document.getElementById(a).style.display = "none";
      }
      
    }

      if (numberOfCurrentCaptures == 1 && textareaControlInUse != 0) {
        switch (textareaControlInUse) {
          case 4:
            textareaControls(1);
            break;
          case 5:
            textareaControls(2);
            break;
          case 6:
            textareaControls(3);
            break;
        }
      }
      else if (numberOfCurrentCaptures > 1 && textareaControlInUse != 0) {
        switch (textareaControlInUse) {
          case 1:
            textareaControls(4);
            break;
          case 2:
            textareaControls(5);
            break;
          case 3:
            textareaControls(6);
            break;
        }
      }
}



function updateRecordingFourCaptures() {

// new 12/22 delete all commented lines 
//
//
//
//
//
//var y = "newRecordingPanelFourContainer" + numberOfCurrentCaptures;
//document.getElementById(y).style.display = "flex";
document.getElementById("newRecordingPanelFourContainer2").style.display = "flex";
z = document.getElementById("newRecordingLeadTimeNum").value;
x = "newRecordingActualLeadTime" + numberOfCurrentCaptures;
document.getElementById(x).innerHTML = z;
/*var i;
var q;
for( i = 8; i > numberOfCurrentCaptures; i--) {
  var a = "newRecordingPanelFourContainer" + i;
  document.getElementById(a).style.display = "none";
}
for(q = 1; q < numberOfCurrentCaptures; q++) {
  var a = "newRecordingPanelFourContainer" + q;
  document.getElementById(a).style.display = "none";
} */
}

function hideNewRecordingPanelFour() {
/*
  var i;
  for(i = 8; i > 0; i--) {
    var a = "newRecordingPanelFourContainer" + i;
    document.getElementById(a).style.display = "none";
  } */
  //new 12/22
  document.getElementById("newRecordingPanelFourContainer2").style.display = "none";
  //end new 12/22
}


function updateRecordingFiveCaptures() {
/* delete commented lines
  var y = "newRecordingPanelFiveContainer" + numberOfCurrentCaptures;
document.getElementById(y).style.display = "flex";
var i;
var q;
for(i = 8; i > numberOfCurrentCaptures; i--) {
  var a = "newRecordingPanelFiveContainer" + i;
  document.getElementById(a).style.display = "none";
}
for(q = 1; q < numberOfCurrentCaptures; q++) {
  var a = "newRecordingPanelFiveContainer" + q;
  document.getElementById(a).style.display = "none";
}
*/
// new 12/22
document.getElementById("newRecordingPanelFiveContainer2").style.display = "flex";
// end new 12/22
if (textareaControlInUse != 0) {
  switch (textareaControlInUse) {
    case 1:
      textareaControls(7);
      break;
    case 2:
      textareaControls(8);
      break;
    case 3:
      textareaControls(9);
      break;
    case 4:
      textareaControls(7);
      break;
    case 5:
      textareaControls(8);
      break;
    case 6:
      textareaControls(9);
      break;
    case 7:
      textareaControls(7);
      break;
    case 8:
      textareaControls(8);
      break;
    case 9:
      textareaControls(9);
      break;
}
}
}


function hideNewRecordingPanelFive() {
  /* delete
  var i;
for(i = 8; i > 0; i--) {
  var a = "newRecordingPanelFiveContainer" + i;
  document.getElementById(a).style.display = "none";
} */
  document.getElementById("newRecordingPanelFiveContainer2").style.display = "none";
}

function hideNewRecordingPanelSix() {
  /* delete
  var i;
for(i = 8; i > 0; i--) {
  var a = "newRecordingPanelSixContainer" + i;
  document.getElementById(a).style.display = "none";
} */
  // new 12/22
  document.getElementById("newRecordingPanelSixContainer2").style.display = "none";
  // end new 12/22
}


  function newRecordingPanel7() {
    hideNewRecordingPanelSix();
    document.getElementById("newRecordingPanel7Container").style.display = "flex";
    document.getElementById("newRecordingPanel8Container").style.display = "none";  
    bpmValue = "";
    bpmCounterRun = false;
    bpmBeanCounter();
  }

function newRecordingPanel8() {
document.getElementById("newRecordingPanel7Container").style.display = "none";
document.getElementById("newRecordingPanel8Container").style.display = "flex";
}

function textareaControls(a) {
  redirectedFromTextareaControls = true;

  var y = document.getElementsByClassName("textareaControlsContainer");
  var k = document.getElementsByClassName("textareaControlsKeepContainer");
  var o = document.getElementsByClassName("textareaControlsOpenContainer");
  var u = document.getElementsByClassName("textareaControlsUploadContainer");
  

  if (a == 1 || a == 2 || a == 3) {
   var z = document.getElementsByClassName("textareaControlsContainerOne");
   var x = document.getElementsByClassName("newMainContentCaptureWrapper1YellowOne");
   var i;
    for (i=0; i<x.length; i++) {
      x[i].style.display = "none";
      z[i].style.display = "flex";
      if(a == 1) {
        textareaControlInUse = 1;
        k[i].style.display = "flex";
        o[i].style.display = "none";
        u[i].style.display = "none";
      }
      else if (a == 2) {
        textareaControlInUse = 2;
        k[i].style.display = "none";
        o[i].style.display = "flex";
        u[i].style.display = "none";
      }
      else {
        textareaControlInUse = 3;
        k[i].style.display = "none";
        o[i].style.display = "none";
        u[i].style.display = "flex";
      }
    }
  } else if (a == 4 || a == 5 || a == 6) { 
    var b = document.getElementsByClassName("newMainContentCaptureWrapper1Yellow");
    var q;
    var zen = 0;
    while (zen<b.length) {
      b[zen].style.display = "none";    
      zen++;
    }
    for (q=0; q<y.length; q++) { 
       
        y[q].style.display = "flex";
  
        if(a == 4) {
          textareaControlInUse = 4;
          k[q].style.display = "flex";
          o[q].style.display = "none";
          u[q].style.display = "none";
        }
        else if (a == 5) {
          textareaControlInUse = 5;
          k[q].style.display = "none";
          o[q].style.display = "flex";
          u[q].style.display = "none";
        }
        else {
          textareaControlInUse = 6;
          k[q].style.display = "none";
          o[q].style.display = "none";
          u[q].style.display = "flex";
        }
    }
  } else {
    var fiveX = document.getElementsByClassName("newMainContentCaptureWrapper1Yellow");
    var fiveI;
    var zenX = 0;
    while (zenX<fiveX.length) {
      fiveX[zenX].style.display = "none";    
      zenX++;
    }
   
    for (fiveI=0; fiveI<y.length; fiveI++) {
      
      y[fiveI].style.display = "flex";
      if(a == 7) {
        textareaControlInUse = 4;
        k[fiveI].style.display = "flex";
        o[fiveI].style.display = "none";
        u[fiveI].style.display = "none";
      }
      else if (a == 8) {
        textareaControlInUse = 5;
        k[fiveI].style.display = "none";
        o[fiveI].style.display = "flex";
        u[fiveI].style.display = "none";
      }
      else {
        textareaControlInUse = 6;
        k[fiveI].style.display = "none";
        o[fiveI].style.display = "none";
        u[fiveI].style.display = "flex";
      }
    }
  }
}

function closeTextareaControls() {
  textareaControlInUse = 0;
  redirectedFromTextareaControls = false;
  var x = document.getElementsByClassName("newMainContentCaptureWrapper1YellowOne");
  var z = document.getElementsByClassName("textareaControlsContainerOne");
  var kiwi;
  for (kiwi=0; kiwi<z.length; kiwi++) {
    z[kiwi].style.display = "none";
  }

  var y = document.getElementsByClassName("textareaControlsContainer");
  var k = document.getElementsByClassName("textareaControlsKeepContainer");
  var o = document.getElementsByClassName("textareaControlsOpenContainer");
  var u = document.getElementsByClassName("textareaControlsUploadContainer");
  var b = document.getElementsByClassName("newMainContentCaptureWrapper1Yellow"); 
  var fiveX = document.getElementsByClassName("newMainContentCaptureWrapper1Yellow");
  var i;
  var q;
  var fiveNum;
  var zen = 0;
  while (zen<b.length) {
    b[zen].style.display = "flex";    
    zen++;
  }

  for (i=0; i<x.length; i++) {
    x[i].style.display = "flex";
    y[i].style.display = "none";
    k[i].style.display = "none";
    o[i].style.display = "none";
    u[i].style.display = "none";
  }
  for (q=0; q<y.length; q++) {
    y[q].style.display = "none";
    k[q].style.display = "none";
    o[q].style.display = "none";
    u[q].style.display = "none";
  }
  for (fiveNum=0; fiveNum<fiveX.length; fiveNum++) {
    fiveX[fiveNum].style.display = "flex";
    y[fiveNum].style.display = "none";
    k[fiveNum].style.display = "none";
    o[fiveNum].style.display = "none";
    u[fiveNum].style.display = "none";
  }
}

// code for Contest page
// the following code was written for contest recording with both video & audio
// for now Richard only wants audio so I modified the code
// currently it is skipping the first 3 recording panels
// once he wants both just uncomment the sections below and also delete the one line of code I indicated


function newRecordingProcessContest() {
  document.getElementById("epicRiffContainer").style.display = "none";
  document.getElementById("newMainToolbarExtraContest").style.display = "none";
  document.getElementById("newMainToolbar").style.display = "none";
  document.getElementById("newRecordingProcessContainer").style.display = "flex";  
/*
  document.getElementById("newRecordingPanelOneContainer").style.display = "flex";
  document.getElementById("closeNewRecording").style.display = "block";
  document.getElementById("newRecordingPanelTwoContainer").style.display = "none";
  document.getElementById("newRecordingPanelThreeContainer").style.display = "none";
  document.getElementById("newRecordingPanelFourContainer2").style.display = "none";
*/
  document.getElementById("newRecordingPanelFiveContainer2").style.display = "none";
  document.getElementById("newRecordingPanelSixContainer2").style.display = "none";
  document.getElementById("newRecordingPanel7Container").style.display = "none";
  document.getElementById("newRecordingPanel8Container").style.display = "none";
  document.getElementById("newRecordingPanel9Container").style.display = "none";
//document.getElementById("newRecordingLeadTimeNum").value = "3";
  newRecordingPanelFourContest();  // <- this line will be deleted once both audio & video are in use
}
  
  function closeNewRecordingContest() {
  document.getElementById("newRecordingProcessContainer").style.display = "none";
  document.getElementById("epicRiffContainer").style.display = "flex";
  document.getElementById("newMainToolbarExtraContest").style.display = "flex";
  document.getElementById("newMainToolbar").style.display = "flex";
/*document.getElementById("newRecordingPanelOneContainer").style.display = "none";
  document.getElementById("newRecordingPanelTwoContainer").style.display = "none";
  document.getElementById("newRecordingPanelThreeContainer").style.display = "none";
*/document.getElementById("newRecordingPanelFourContainer2").style.display = "none";
  document.getElementById("newRecordingPanelFiveContainer2").style.display = "none";
  document.getElementById("newRecordingPanelSixContainer2").style.display = "none";
  document.getElementById("newRecordingPanel7Container").style.display = "none";
  document.getElementById("newRecordingPanel8Container").style.display = "none";
  document.getElementById("newRecordingPanel9Container").style.display = "none";
  document.getElementById("newRecordingLeadTimeNum").value = "0";
  numberOfCurrentCaptures = 2;
  fromContestPage = false;
  beanCounter();
  document.getElementById("newRecordingLeadTimeNum").value = "3";
  
  audioOnly = false;
  }

  function newRecordingPanelFourContest() {
    document.getElementById("newRecordingPanelOneContainer").style.display = "none";
    document.getElementById("newRecordingPanelTwoContainer").style.display = "none";
    document.getElementById("newRecordingPanelThreeContainer").style.display = "none";
    document.getElementById("closeNewRecording").style.display = "none";
    document.getElementById("newRecordingPanelFourContainer2").style.display = "flex";
    document.getElementById("newMainToolbar").style.display = "flex";
    z = document.getElementById("newRecordingLeadTimeNum").value;
    document.getElementById("newRecordingActualLeadTime2").innerHTML = z;
    }

    function newRecordingPanelFiveContest() {
      document.getElementById("newRecordingPanelFourContainer2").style.display = "none";
      document.getElementById("newRecordingPanelFiveContainer2").style.display = "flex";
      numberOfCurrentCaptures = 2;
      fromContestPage = true;
      beanCounter();
      }

  function newRecordingPanelSixContest() {
    document.getElementById("newRecordingPanelFiveContainer2").style.display = "none";
    document.getElementById("newRecordingPanelSixContainer2").style.display = "flex";
  }

  function newRecordingPanel7Contest() {
    document.getElementById("newRecordingPanelSixContainer2").style.display = "none";
    document.getElementById("newRecordingPanel8Container").style.display = "none";
    document.getElementById("newRecordingPanel7Container").style.display = "flex";
  }

  function newRecordingPanel8Contest() {
    document.getElementById("newRecordingPanel7Container").style.display = "none";
    document.getElementById("newRecordingPanel8Container").style.display = "flex";
  }

  function newRecordingPanel9Contest() {
    document.getElementById("newRecordingPanel7Container").style.display = "none";
    document.getElementById("newRecordingPanel8Container").style.display = "none";
    document.getElementById("newRecordingPanel9Container").style.display = "flex";
  }

// end of code for Contest page

// old bpmBeanCounter function has been replaced with the one below

// bpm counter

function bpmBeanCounter() {
  var timeSigSelection;
  var i = 1;
  var element1;
  var element2;
  var element3;
  var element4;
  var bpmValue;
  timeSigSelection = document.getElementById("timeSigSelect").value;
  bpmValue = parseInt(document.getElementById("newRecordingBPMNum").value);
  
  var timeTracker = 60/bpmValue*1000;
  var x = setInterval(leadTimeCounter, timeTracker);
      function leadTimeCounter() {
        if(bpmCounterRun == true && timeSigSelection == 4) {
        switch (i) {
          case 1:
            element1 = document.getElementById("bpmCounter1");
            element1.classList.add("newFourActive");
            element4 = document.getElementById("bpmCounter4");
            element4.classList.remove("newFourActive");
            i++;
            break;
          case 2:
            element1 = document.getElementById("bpmCounter1");
            element1.classList.remove("newFourActive");
            element2 = document.getElementById("bpmCounter2");
            element2.classList.add("newFourActive");
            i++;
            break;
          case 3:
            element2 = document.getElementById("bpmCounter2");
            element2.classList.remove("newFourActive");
            element3 = document.getElementById("bpmCounter3");
            element3.classList.add("newFourActive");
            i++;
            break;
          case 4:
            element3 = document.getElementById("bpmCounter3");
            element3.classList.remove("newFourActive");
            element4 = document.getElementById("bpmCounter4");
            element4.classList.add("newFourActive");
            i = 1;
            break;
        }
      } else if(bpmCounterRun == true && timeSigSelection == 8) {
        switch (i) {
          case 1:
            element1 = document.getElementById("bpmCounter1");
            element1.classList.add("newFourActive");
            element4 = document.getElementById("bpmCounter4");
            element4.classList.remove("newFourActive");
            element4.classList.remove("bpmCounterNumTransformed");
            document.getElementById("bpmCounter4E").style.display = "none";
            i++;
            break;
          case 2:
          element1 = document.getElementById("bpmCounter1");
          element1.classList.add("bpmCounterNumTransformed");
          document.getElementById("bpmCounter1E").style.display = "block";
          i++;
          break;
          case 3:
            element1 = document.getElementById("bpmCounter1");
            element1.classList.remove("newFourActive");
            element1.classList.remove("bpmCounterNumTransformed");
            document.getElementById("bpmCounter1E").style.display = "none";
            element2 = document.getElementById("bpmCounter2");
            element2.classList.add("newFourActive");
            i++;
            break;
          case 4:
            element2 = document.getElementById("bpmCounter2");
            element2.classList.add("bpmCounterNumTransformed");
            document.getElementById("bpmCounter2E").style.display = "block";
            i++;
            break;
          case 5:
            element2 = document.getElementById("bpmCounter2");
            element2.classList.remove("newFourActive");
            element2.classList.remove("bpmCounterNumTransformed");
            document.getElementById("bpmCounter2E").style.display = "none";
            element3 = document.getElementById("bpmCounter3");
            element3.classList.add("newFourActive");
            i++;
            break;
          case 6:
            element2 = document.getElementById("bpmCounter3");
            element3.classList.add("bpmCounterNumTransformed");
            document.getElementById("bpmCounter3E").style.display = "block";
            i++;
            break;
          case 7:
            element3 = document.getElementById("bpmCounter3");
            element3.classList.remove("newFourActive");
            element3.classList.remove("bpmCounterNumTransformed");
            document.getElementById("bpmCounter3E").style.display = "none";
            element4 = document.getElementById("bpmCounter4");
            element4.classList.add("newFourActive");
            i++;
            break;
          case 8:
            element4 = document.getElementById("bpmCounter4");
            element4.classList.add("bpmCounterNumTransformed");
            document.getElementById("bpmCounter4E").style.display = "block";
            i = 1;
            break;
        }
      } else if(bpmCounterRun == true && timeSigSelection == 12) {
        switch (i) {
          case 1:
            element1 = document.getElementById("bpmCounter1");
            element1.classList.add("newFourActive");
            element4 = document.getElementById("bpmCounter4");
            element4.classList.remove("newFourActive");
            element4.classList.remove("bpmCounterNumTransformed");
            document.getElementById("bpmCounter4E").style.display = "none";
            document.getElementById("bpmCounter4And").style.display = "none";
            i++;
            break;
          case 2:
          element1 = document.getElementById("bpmCounter1");
          element1.classList.add("bpmCounterNumTransformed");
          document.getElementById("bpmCounter1E").style.display = "block";
          i++;
          break;
          case 3:
          document.getElementById("bpmCounter1And").style.display = "block";
          i++;
          break;
          case 4:
            element1 = document.getElementById("bpmCounter1");
            element1.classList.remove("newFourActive");
            element1.classList.remove("bpmCounterNumTransformed");
            document.getElementById("bpmCounter1E").style.display = "none";
            document.getElementById("bpmCounter1And").style.display = "none";
            element2 = document.getElementById("bpmCounter2");
            element2.classList.add("newFourActive");
            i++;
            break;
          case 5:
            element2 = document.getElementById("bpmCounter2");
            element2.classList.add("bpmCounterNumTransformed");
            document.getElementById("bpmCounter2E").style.display = "block";
            i++;
            break;
          case 6:
            document.getElementById("bpmCounter2And").style.display = "block";
            i++;
            break;
          case 7:
            element2 = document.getElementById("bpmCounter2");
            element2.classList.remove("newFourActive");
            element2.classList.remove("bpmCounterNumTransformed");
            document.getElementById("bpmCounter2E").style.display = "none";
            document.getElementById("bpmCounter2And").style.display = "none";
            element3 = document.getElementById("bpmCounter3");
            element3.classList.add("newFourActive");
            i++;
            break;
          case 8:
            element2 = document.getElementById("bpmCounter3");
            element3.classList.add("bpmCounterNumTransformed");
            document.getElementById("bpmCounter3E").style.display = "block";
            i++;
            break;
          case 9:
            document.getElementById("bpmCounter3And").style.display = "block";
            i++;
            break;
          case 10:
            element3 = document.getElementById("bpmCounter3");
            element3.classList.remove("newFourActive");
            element3.classList.remove("bpmCounterNumTransformed");
            document.getElementById("bpmCounter3E").style.display = "none";
            document.getElementById("bpmCounter3And").style.display = "none";
            element4 = document.getElementById("bpmCounter4");
            element4.classList.add("newFourActive");
            i++;
            break;
          case 11:
            element4 = document.getElementById("bpmCounter4");
            element4.classList.add("bpmCounterNumTransformed");
            document.getElementById("bpmCounter4E").style.display = "block";
            i++;
            break;
          case 12:
            document.getElementById("bpmCounter4And").style.display = "block";
            i=1;
            break;
        }
      } else if(bpmCounterRun == true && timeSigSelection == 16) {
        switch (i) {
          case 1:
            element1 = document.getElementById("bpmCounter1");
            element1.classList.add("newFourActive");
            element4 = document.getElementById("bpmCounter4");
            element4.classList.remove("newFourActive");
            element4.classList.remove("bpmCounterNumTransformed");
            document.getElementById("bpmCounter4E").style.display = "none";
            document.getElementById("bpmCounter4And").style.display = "none";
            document.getElementById("bpmCounter4A").style.display = "none";
            i++;
            break;
          case 2:
          element1 = document.getElementById("bpmCounter1");
          element1.classList.add("bpmCounterNumTransformed");
          document.getElementById("bpmCounter1E").style.display = "block";
          i++;
          break;
          case 3:
          document.getElementById("bpmCounter1And").style.display = "block";
          i++;
          break;
          case 4:
            document.getElementById("bpmCounter1A").style.display = "block";
            i++;
            break;
          case 5:
            element1 = document.getElementById("bpmCounter1");
            element1.classList.remove("newFourActive");
            element1.classList.remove("bpmCounterNumTransformed");
            document.getElementById("bpmCounter1E").style.display = "none";
            document.getElementById("bpmCounter1And").style.display = "none";
            document.getElementById("bpmCounter1A").style.display = "none";
            element2 = document.getElementById("bpmCounter2");
            element2.classList.add("newFourActive");
            i++;
            break;
          case 6:
            element2 = document.getElementById("bpmCounter2");
            element2.classList.add("bpmCounterNumTransformed");
            document.getElementById("bpmCounter2E").style.display = "block";
            i++;
            break;
          case 7:
            document.getElementById("bpmCounter2And").style.display = "block";
            i++;
            break;
          case 8:
            document.getElementById("bpmCounter2A").style.display = "block";
            i++;
            break;
          case 9:
            element2 = document.getElementById("bpmCounter2");
            element2.classList.remove("newFourActive");
            element2.classList.remove("bpmCounterNumTransformed");
            document.getElementById("bpmCounter2E").style.display = "none";
            document.getElementById("bpmCounter2And").style.display = "none";
            document.getElementById("bpmCounter2A").style.display = "none";
            element3 = document.getElementById("bpmCounter3");
            element3.classList.add("newFourActive");
            i++;
            break;
          case 10:
            element2 = document.getElementById("bpmCounter3");
            element3.classList.add("bpmCounterNumTransformed");
            document.getElementById("bpmCounter3E").style.display = "block";
            i++;
            break;
          case 11:
            document.getElementById("bpmCounter3And").style.display = "block";
            i++;
            break;
          case 12:
            document.getElementById("bpmCounter3A").style.display = "block";
            i++;
            break;
          case 13:
            element3 = document.getElementById("bpmCounter3");
            element3.classList.remove("newFourActive");
            element3.classList.remove("bpmCounterNumTransformed");
            document.getElementById("bpmCounter3E").style.display = "none";
            document.getElementById("bpmCounter3And").style.display = "none";
            document.getElementById("bpmCounter3A").style.display = "none";
            element4 = document.getElementById("bpmCounter4");
            element4.classList.add("newFourActive");
            i++;
            break;
          case 14:
            element4 = document.getElementById("bpmCounter4");
            element4.classList.add("bpmCounterNumTransformed");
            document.getElementById("bpmCounter4E").style.display = "block";
            i++;
            break;
          case 15:
            document.getElementById("bpmCounter4And").style.display = "block";
            i++;
            break;
          case 16:
            document.getElementById("bpmCounter4A").style.display = "block";
            i=1;
            break;
        }
      }
      else {
      clearInterval(x);
      document.getElementById("newRecordingBPMNum").value = "";
      document.getElementById("timeSigSelect").value = "4";
      element1.classList.remove("newFourActive");
      element1.classList.remove("bpmCounterNumTransformed");
      document.getElementById("bpmCounter1E").style.display = "none";
      document.getElementById("bpmCounter1And").style.display = "none";
      document.getElementById("bpmCounter1A").style.display = "none";
      element2.classList.remove("newFourActive");
      element2.classList.remove("bpmCounterNumTransformed");
      document.getElementById("bpmCounter2E").style.display = "none";
      document.getElementById("bpmCounter2And").style.display = "none";
      document.getElementById("bpmCounter2A").style.display = "none";
      element3.classList.remove("newFourActive");
      element3.classList.remove("bpmCounterNumTransformed");
      document.getElementById("bpmCounter3E").style.display = "none";
      document.getElementById("bpmCounter3And").style.display = "none";
      document.getElementById("bpmCounter3A").style.display = "none";
      element4.classList.remove("newFourActive");
      element4.classList.remove("bpmCounterNumTransformed");
      document.getElementById("bpmCounter4E").style.display = "none";
      document.getElementById("bpmCounter4And").style.display = "none";
      document.getElementById("bpmCounter4A").style.display = "none";
      bpmCounterRun = false;
      bpmValue = "";
    }
}}

/* Metronome */

var bpmCounterRunPractice;

function bpmBeanCounterPractice() {
  var timeSigSelectionAlt;
  var i = 1;
  var element1;
  var element2;
  var element3;
  var element4;
  var bpmValueAlt;
  timeSigSelectionAlt = document.getElementById("timeSigSelectAlt").value;
  bpmValueAlt = parseInt(document.getElementById("newRecordingBPMNumAlt").value);
  
  if (isNaN(bpmValueAlt)) {
    bpmCounterRunPractice = false;
  }
  
  var timeTracker = 60/bpmValueAlt*1000;
  var x = setInterval(leadTimeCounter, timeTracker);
      function leadTimeCounter() {
        if(bpmCounterRunPractice == true && timeSigSelectionAlt == 4) {
        switch (i) {
          case 1:
            element1 = document.getElementById("bpmCounter1Alt");
            element1.classList.add("newFourActive");
            element4 = document.getElementById("bpmCounter4Alt");
            element4.classList.remove("newFourActive");
            i++;
            break;
          case 2:
            element1 = document.getElementById("bpmCounter1Alt");
            element1.classList.remove("newFourActive");
            element2 = document.getElementById("bpmCounter2Alt");
            element2.classList.add("newFourActive");
            i++;
            break;
          case 3:
            element2 = document.getElementById("bpmCounter2Alt");
            element2.classList.remove("newFourActive");
            element3 = document.getElementById("bpmCounter3Alt");
            element3.classList.add("newFourActive");
            i++;
            break;
          case 4:
            element3 = document.getElementById("bpmCounter3Alt");
            element3.classList.remove("newFourActive");
            element4 = document.getElementById("bpmCounter4Alt");
            element4.classList.add("newFourActive");
            i = 1;
            break;
        }
      } else if(bpmCounterRunPractice == true && timeSigSelectionAlt == 8) {
        switch (i) {
          case 1:
            element1 = document.getElementById("bpmCounter1Alt");
            element1.classList.add("newFourActive");
            element4 = document.getElementById("bpmCounter4Alt");
            element4.classList.remove("newFourActive");
            element4.classList.remove("bpmCounterNumTransformed");
            document.getElementById("bpmCounter4EAlt").style.display = "none";
            i++;
            break;
          case 2:
          element1 = document.getElementById("bpmCounter1Alt");
          element1.classList.add("bpmCounterNumTransformed");
          document.getElementById("bpmCounter1EAlt").style.display = "block";
          i++;
          break;
          case 3:
            element1 = document.getElementById("bpmCounter1Alt");
            element1.classList.remove("newFourActive");
            element1.classList.remove("bpmCounterNumTransformed");
            document.getElementById("bpmCounter1EAlt").style.display = "none";
            element2 = document.getElementById("bpmCounter2Alt");
            element2.classList.add("newFourActive");
            i++;
            break;
          case 4:
            element2 = document.getElementById("bpmCounter2Alt");
            element2.classList.add("bpmCounterNumTransformed");
            document.getElementById("bpmCounter2EAlt").style.display = "block";
            i++;
            break;
          case 5:
            element2 = document.getElementById("bpmCounter2Alt");
            element2.classList.remove("newFourActive");
            element2.classList.remove("bpmCounterNumTransformed");
            document.getElementById("bpmCounter2EAlt").style.display = "none";
            element3 = document.getElementById("bpmCounter3Alt");
            element3.classList.add("newFourActive");
            i++;
            break;
          case 6:
            element2 = document.getElementById("bpmCounter3Alt");
            element3.classList.add("bpmCounterNumTransformed");
            document.getElementById("bpmCounter3EAlt").style.display = "block";
            i++;
            break;
          case 7:
            element3 = document.getElementById("bpmCounter3Alt");
            element3.classList.remove("newFourActive");
            element3.classList.remove("bpmCounterNumTransformed");
            document.getElementById("bpmCounter3EAlt").style.display = "none";
            element4 = document.getElementById("bpmCounter4Alt");
            element4.classList.add("newFourActive");
            i++;
            break;
          case 8:
            element4 = document.getElementById("bpmCounter4Alt");
            element4.classList.add("bpmCounterNumTransformed");
            document.getElementById("bpmCounter4EAlt").style.display = "block";
            i = 1;
            break;
        }
      } else if(bpmCounterRunPractice == true && timeSigSelectionAlt == 12) {
        switch (i) {
          case 1:
            element1 = document.getElementById("bpmCounter1Alt");
            element1.classList.add("newFourActive");
            element4 = document.getElementById("bpmCounter4Alt");
            element4.classList.remove("newFourActive");
            element4.classList.remove("bpmCounterNumTransformed");
            document.getElementById("bpmCounter4EAlt").style.display = "none";
            document.getElementById("bpmCounter4AndAlt").style.display = "none";
            i++;
            break;
          case 2:
          element1 = document.getElementById("bpmCounter1Alt");
          element1.classList.add("bpmCounterNumTransformed");
          document.getElementById("bpmCounter1EAlt").style.display = "block";
          i++;
          break;
          case 3:
          document.getElementById("bpmCounter1AndAlt").style.display = "block";
          i++;
          break;
          case 4:
            element1 = document.getElementById("bpmCounter1Alt");
            element1.classList.remove("newFourActive");
            element1.classList.remove("bpmCounterNumTransformed");
            document.getElementById("bpmCounter1EAlt").style.display = "none";
            document.getElementById("bpmCounter1AndAlt").style.display = "none";
            element2 = document.getElementById("bpmCounter2Alt");
            element2.classList.add("newFourActive");
            i++;
            break;
          case 5:
            element2 = document.getElementById("bpmCounter2Alt");
            element2.classList.add("bpmCounterNumTransformed");
            document.getElementById("bpmCounter2EAlt").style.display = "block";
            i++;
            break;
          case 6:
            document.getElementById("bpmCounter2AndAlt").style.display = "block";
            i++;
            break;
          case 7:
            element2 = document.getElementById("bpmCounter2Alt");
            element2.classList.remove("newFourActive");
            element2.classList.remove("bpmCounterNumTransformed");
            document.getElementById("bpmCounter2EAlt").style.display = "none";
            document.getElementById("bpmCounter2AndAlt").style.display = "none";
            element3 = document.getElementById("bpmCounter3Alt");
            element3.classList.add("newFourActive");
            i++;
            break;
          case 8:
            element2 = document.getElementById("bpmCounter3Alt");
            element3.classList.add("bpmCounterNumTransformed");
            document.getElementById("bpmCounter3EAlt").style.display = "block";
            i++;
            break;
          case 9:
            document.getElementById("bpmCounter3AndAlt").style.display = "block";
            i++;
            break;
          case 10:
            element3 = document.getElementById("bpmCounter3Alt");
            element3.classList.remove("newFourActive");
            element3.classList.remove("bpmCounterNumTransformed");
            document.getElementById("bpmCounter3EAlt").style.display = "none";
            document.getElementById("bpmCounter3AndAlt").style.display = "none";
            element4 = document.getElementById("bpmCounter4Alt");
            element4.classList.add("newFourActive");
            i++;
            break;
          case 11:
            element4 = document.getElementById("bpmCounter4Alt");
            element4.classList.add("bpmCounterNumTransformed");
            document.getElementById("bpmCounter4EAlt").style.display = "block";
            i++;
            break;
          case 12:
            document.getElementById("bpmCounter4AndAlt").style.display = "block";
            i=1;
            break;
        }
      } else if(bpmCounterRunPractice == true && timeSigSelectionAlt == 16) {
        switch (i) {
          case 1:
            element1 = document.getElementById("bpmCounter1Alt");
            element1.classList.add("newFourActive");
            element4 = document.getElementById("bpmCounter4Alt");
            element4.classList.remove("newFourActive");
            element4.classList.remove("bpmCounterNumTransformed");
            document.getElementById("bpmCounter4EAlt").style.display = "none";
            document.getElementById("bpmCounter4AndAlt").style.display = "none";
            document.getElementById("bpmCounter4AAlt").style.display = "none";
            i++;
            break;
          case 2:
          element1 = document.getElementById("bpmCounter1Alt");
          element1.classList.add("bpmCounterNumTransformed");
          document.getElementById("bpmCounter1EAlt").style.display = "block";
          i++;
          break;
          case 3:
          document.getElementById("bpmCounter1AndAlt").style.display = "block";
          i++;
          break;
          case 4:
            document.getElementById("bpmCounter1AAlt").style.display = "block";
            i++;
            break;
          case 5:
            element1 = document.getElementById("bpmCounter1Alt");
            element1.classList.remove("newFourActive");
            element1.classList.remove("bpmCounterNumTransformed");
            document.getElementById("bpmCounter1EAlt").style.display = "none";
            document.getElementById("bpmCounter1AndAlt").style.display = "none";
            document.getElementById("bpmCounter1AAlt").style.display = "none";
            element2 = document.getElementById("bpmCounter2Alt");
            element2.classList.add("newFourActive");
            i++;
            break;
          case 6:
            element2 = document.getElementById("bpmCounter2Alt");
            element2.classList.add("bpmCounterNumTransformed");
            document.getElementById("bpmCounter2EAlt").style.display = "block";
            i++;
            break;
          case 7:
            document.getElementById("bpmCounter2AndAlt").style.display = "block";
            i++;
            break;
          case 8:
            document.getElementById("bpmCounter2AAlt").style.display = "block";
            i++;
            break;
          case 9:
            element2 = document.getElementById("bpmCounter2Alt");
            element2.classList.remove("newFourActive");
            element2.classList.remove("bpmCounterNumTransformed");
            document.getElementById("bpmCounter2EAlt").style.display = "none";
            document.getElementById("bpmCounter2AndAlt").style.display = "none";
            document.getElementById("bpmCounter2AAlt").style.display = "none";
            element3 = document.getElementById("bpmCounter3Alt");
            element3.classList.add("newFourActive");
            i++;
            break;
          case 10:
            element2 = document.getElementById("bpmCounter3Alt");
            element3.classList.add("bpmCounterNumTransformed");
            document.getElementById("bpmCounter3EAlt").style.display = "block";
            i++;
            break;
          case 11:
            document.getElementById("bpmCounter3AndAlt").style.display = "block";
            i++;
            break;
          case 12:
            document.getElementById("bpmCounter3AAlt").style.display = "block";
            i++;
            break;
          case 13:
            element3 = document.getElementById("bpmCounter3Alt");
            element3.classList.remove("newFourActive");
            element3.classList.remove("bpmCounterNumTransformed");
            document.getElementById("bpmCounter3EAlt").style.display = "none";
            document.getElementById("bpmCounter3AndAlt").style.display = "none";
            document.getElementById("bpmCounter3AAlt").style.display = "none";
            element4 = document.getElementById("bpmCounter4Alt");
            element4.classList.add("newFourActive");
            i++;
            break;
          case 14:
            element4 = document.getElementById("bpmCounter4Alt");
            element4.classList.add("bpmCounterNumTransformed");
            document.getElementById("bpmCounter4EAlt").style.display = "block";
            i++;
            break;
          case 15:
            document.getElementById("bpmCounter4AndAlt").style.display = "block";
            i++;
            break;
          case 16:
            document.getElementById("bpmCounter4AAlt").style.display = "block";
            i=1;
            break;
        }
      }
      else {
      clearInterval(x);
      document.getElementById("newRecordingBPMNumAlt").value = "";
      document.getElementById("timeSigSelectAlt").value = "4";
      element1.classList.remove("newFourActive");
      element1.classList.remove("bpmCounterNumTransformed");
      document.getElementById("bpmCounter1EAlt").style.display = "none";
      document.getElementById("bpmCounter1AndAlt").style.display = "none";
      document.getElementById("bpmCounter1AAlt").style.display = "none";
      element2.classList.remove("newFourActive");
      element2.classList.remove("bpmCounterNumTransformed");
      document.getElementById("bpmCounter2EAlt").style.display = "none";
      document.getElementById("bpmCounter2AndAlt").style.display = "none";
      document.getElementById("bpmCounter2AAlt").style.display = "none";
      element3.classList.remove("newFourActive");
      element3.classList.remove("bpmCounterNumTransformed");
      document.getElementById("bpmCounter3EAlt").style.display = "none";
      document.getElementById("bpmCounter3AndAlt").style.display = "none";
      document.getElementById("bpmCounter3AAlt").style.display = "none";
      element4.classList.remove("newFourActive");
      element4.classList.remove("bpmCounterNumTransformed");
      document.getElementById("bpmCounter4EAlt").style.display = "none";
      document.getElementById("bpmCounter4AndAlt").style.display = "none";
      document.getElementById("bpmCounter4AAlt").style.display = "none";
      bpmCounterRunPractice = false;
      bpmValueAlt = "";
    }
}}

function displayMetronome() {
  document.getElementById("metronomePanel").style.display = "flex";  
}
  
function closeMetronome() {
  document.getElementById("metronomePanel").style.display = "none";
  metronomePanelSwitch(2);
  bpmCounterRunPractice = false;
  bpmBeanCounterPractice();
}

function metronomePanelSwitch(x) {
  if (x == 1) {
    document.getElementById("metronomePanelOne").style.display = "none";
    document.getElementById("metronomePanelTwo").style.display = "flex";
    bpmCounterRunPractice = true;
    bpmBeanCounterPractice();
  }
  else {
    document.getElementById("metronomePanelOne").style.display = "flex";
    document.getElementById("metronomePanelTwo").style.display = "none";
    bpmCounterRunPractice = false;
    bpmBeanCounterPractice();
  }
}


function displayMixerNew() {
  document.getElementById("mixerCombo").style.display = "flex";
   var x = document.getElementsByTagName("header")[0];
   x.style.display = "none";
   document.getElementById("openbtn").style.display = "none";
  }

function closeMixerNew() {
  document.getElementById("mixerCombo").style.display = "none";
  var x = document.getElementsByTagName("header")[0];
   x.style.display = "flex";
   document.getElementById("openbtn").style.display = "block";
  }

function mixerPanelToggleSwitch(x) {
  if (x == 0) {
    document.getElementById("mixerPanelToggleOff").style.color = "#a92d0b";
    document.getElementById("mixerPanelToggleOn").style.color = "black";
  }
  else {
    document.getElementById("mixerPanelToggleOff").style.color = "black";
    document.getElementById("mixerPanelToggleOn").style.color = "#5fb713";
  }
}

// mixer combo draggable

    var dragMixerItem = document.querySelector("#draggableMixerItem");
    var mixerCombo = document.querySelector("#mixerCombo");

    var activeMixer = false;
    var currentXMixer;
    var currentYMixer;
    var initialXMixer;
    var initialYMixer;
    var xOffsetMixer = 0;
    var yOffsetMixer = 0;

    mixerCombo.addEventListener("touchstart", dragStartMixer, false);
    mixerCombo.addEventListener("touchend", dragEndMixer, false);
    mixerCombo.addEventListener("touchmove", dragMixer, false);

    mixerCombo.addEventListener("mousedown", dragStartMixer, false);
    mixerCombo.addEventListener("mouseup", dragEndMixer, false);
    mixerCombo.addEventListener("mousemove", dragMixer, false);

    function dragStartMixer(e) {
      if (e.type === "touchstart") {
        initialXMixer = e.touches[0].clientX - xOffsetMixer;
        initialYMixer = e.touches[0].clientY - yOffsetMixer;
      } else {
        initialXMixer = e.clientX - xOffsetMixer;
        initialYMixer = e.clientY - yOffsetMixer;
      }

      if (e.target === dragMixerItem) {
        activeMixer = true;
      }
    }

    function dragEndMixer(e) {
      initialXMixer = currentXMixer;
      initialYMixer = currentYMixer;

      activeMixer = false;
    }

    function dragMixer(e) {
      if (activeMixer) {
      
        e.preventDefault();
      
        if (e.type === "touchmove") {
          currentXMixer = e.touches[0].clientX - initialXMixer;
          currentYMixer = e.touches[0].clientY - initialYMixer;
        } else {
          currentXMixer = e.clientX - initialXMixer;
          currentYMixer = e.clientY - initialYMixer;
        }

        xOffsetMixer = currentXMixer;
        yOffsetMixer = currentYMixer;

        setTranslate(currentXMixer, currentYMixer, dragMixerItem);
      }
    }

    function setTranslate(xPos, yPos, el) {
      el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }
// band page passcode check (whether empty or at least one character has been entered)
    
    function bandPagePasscodeCheck(a) {
      if (a.length > 0) {
        document.getElementById("bandPagePasscodeSubmit").style.display = "block";
        document.getElementById("passcodeWrapperBand").style.padding = "1px 10px";
      }
      else {
        document.getElementById("bandPagePasscodeSubmit").style.display = "none";
        document.getElementById("passcodeWrapperBand").style.padding = "16px 10px";
      }
    }


    // new compact toolbar
// new 02/12
    function expandToolbar() {
      document.getElementById('newCompactToolbar').style.display = "none";
      document.getElementById('newMainToolbarExtra').style.display = "flex";
      document.getElementById('newMainToolbar').style.display = "flex";
      for (var i = 1; i<27; i++) {
        document.getElementById('newMainContentAreaX'+[i]).style.height = "75%";

      }
    }

    function closeExpandedToolbar() {
      document.getElementById('newCompactToolbar').style.display = "flex";
      document.getElementById('newMainToolbarExtra').style.display = "none";
      document.getElementById('newMainToolbar').style.display = "none";
      for (var i = 1; i<27; i++) {
        document.getElementById('newMainContentAreaX'+[i]).style.height = "95%";

      }
    }


    // new 01/16
    let lilOnesAnimationSpeed = 1000;
    lilOnesSpeed.addEventListener('change', e => {
      if(lilOnesSpeed.value <= 0){
        lilOnesAnimationSpeed = 1000;
      }
      else {
        lilOnesAnimationSpeed = 1 / lilOnesSpeed.value * 1000;
      }
    })

    let lilOnesPlaying = true;
    let lilOnesIteration = 0;
    const lilOnesList = document.querySelectorAll('.lilOnesImage');
    let lilOnesChecked = true;

    lilOnesContinuous.addEventListener('click', e => {
      lilOnesChecked = !lilOnesChecked;
    })

    lilOnesStartBtn.addEventListener('click', e => {
      lilOnesPlaying = !lilOnesPlaying;
      
      let x = setInterval(slideCounter, lilOnesAnimationSpeed);  
      function slideCounter() {
        if (lilOnesPlaying == false) {
          document.getElementById('lilOnesStartBtn').innerText = "Stop";
          lilOnesList[lilOnesIteration].classList.remove('active');
          lilOnesIteration++;
          if(lilOnesIteration >= lilOnesList.length && lilOnesChecked == true) {
            lilOnesIteration = 0;
            
          }
          else if (lilOnesIteration >= lilOnesList.length && lilOnesChecked == false) {
            lilOnesList[0].classList.add('active');
            lilOnesIteration = 0;
            lilOnesPlaying = true;  
            document.getElementById('lilOnesStartBtn').innerText = "Play";
            clearInterval(x);  
          }
         else {
          }
          lilOnesList[lilOnesIteration].classList.add('active');
    //      lilOnesList[lilOnesIteration].style.transition = "opacity 1s linear 0s";
    //      lilOnesList[lilOnesIteration].style.opacity = 1;          
        }
        else {
          document.getElementById('lilOnesStartBtn').innerText = "Play";
          clearInterval(x);
        }

      }
    });
    
    function openLilOnes() {
      document.getElementById('lilOnesContainer').style.display = "flex";   
    }

    function closeLilOnes() {
      document.getElementById('lilOnesContainer').style.display = "none";
      lilOnesPlaying = false;
      document.getElementById('lilOnesStartBtn').click();
    }

// vid capture border color change


    function newCaptureBorder(color) {
      let vids = document.querySelectorAll('.changeNewBorderColor');
      let currentCaptureBorderColor = '';   
alert(currentCaptureBorderColor);
      vids.forEach((vidCapture) => {
        vidCapture.style.backgroundImage = 'none';
//        vidCapture.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        if (color == 'green' && currentCaptureBorderColor == 'empty') {
          vidCapture.classList.add('newCaptureGreen');
          currentCaptureBorderColor = 'newCaptureGreen';
        }
        else if (color == 'green' && currentCaptureBorderColor != 'empty') {
          vidCapture.classList.remove(currentCaptureBorderColor);
          vidCapture.classList.add('newCaptureGreen');
          currentCaptureBorderColor = 'newCaptureGreen';
        }
        else if (color == 'aqua' && currentCaptureBorderColor == 'empty') {
          vidCapture.classList.add('newCaptureAqua');
          currentCaptureBorderColor = 'newCaptureAqua';
        }
        else if (color == 'aqua' && currentCaptureBorderColor != 'empty') {
          vidCapture.classList.remove(currentCaptureBorderColor);
          vidCapture.classList.add('newCaptureAqua');
          currentCaptureBorderColor = 'newCaptureAqua';
        }
        else if (color == 'red' && currentCaptureBorderColor == 'empty') {
          vidCapture.classList.add('newCaptureRed');
          currentCaptureBorderColor = 'newCaptureRed';
        }
        else if (color == 'red' && currentCaptureBorderColor != 'empty') {
          vidCapture.classList.remove(currentCaptureBorderColor);
          vidCapture.classList.add('newCaptureRed');
          currentCaptureBorderColor = 'newCaptureRed';
        }
        else if (color == 'orange' && currentCaptureBorderColor == 'empty') {
          vidCapture.classList.add('newCaptureOrange');
          currentCaptureBorderColor = 'newCaptureOrange';
        }
        else if (color == 'orange' && currentCaptureBorderColor != 'empty') {
          vidCapture.classList.remove(currentCaptureBorderColor);
          vidCapture.classList.add('newCaptureOrange');
          currentCaptureBorderColor = 'newCaptureOrange';
        }
        else {
          alert("oops");
        }
      })
    }