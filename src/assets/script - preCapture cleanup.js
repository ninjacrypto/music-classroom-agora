 
 function openNav() {
    document.getElementById("mySidepanel").style.width = "250px";
    document.getElementById("openbtn").style.display = "none";
  }
  
  function closeNav() {
    document.getElementById("mySidepanel").style.width = "0";
    document.getElementById("openbtn").style.display = "block";
  }

  /* new code 10/14/2020 */
  function openChat() {
    document.getElementById("mySidepane2").style.width = "400px";
    document.getElementById("openchatbtn").style.display = "none";
  }

  function closeChat() {
    document.getElementById("mySidepane2").style.width = "0";
    document.getElementById("openchatbtn").style.display = "block"; 
  }
    /* end */
  
  /* Main page Record */
  var mainPanelInitialized = false;
  var totalMinimizedPanels = 0;
  var differenceInPositioningRecord;
  var differenceInPositioningMixer;
  var differenceInPositioningTracks;
// modified code 9/12/2020
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
//end of new & modified code 9/12/2020
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
  // modified 9/12/2020
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
  // end of modified 9/12/2020

  /* Close Recording without saving it */
  function closeRecordNoSave() {
    document.getElementById("saveRecording").style.display = "none";
  }


//modified code 10/07/2020
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

  // end of new code 10/02/2020

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

// modified code for 9/12/2020


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
//  document.getElementById("mixerPanel").style.bottom = "-5600px";
document.getElementById("mixerPanel").style.display = "none";
  if(totalMinimizedPanels == 0){
    mainPanelInitialized = false;
  }
}

// end of modified code 9/12/2020

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

/*
window.onload = function () {
  var masterSlider = document.getElementById("newRightSideVolumeSlider");
  masterSlider.addEventListener("input", function () {
    
    document.body.style.setProperty("--sliderImage", "url('newRightSideMasterVolumeNum" + this.value + ".png')");
      
  });

  tempChatBox(3);

}
*/
function sliderController() {
  var masterSlider = document.getElementById("newRightSideVolumeSlider");
  masterSlider.addEventListener("input", function () {
    
    document.body.style.setProperty("--sliderImage", "url('newRightSideMasterVolumeNum" + this.value + ".png')");
      
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

// new code 9/18/2020
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

//new code
function closeLeftMenuOptions() {
  var x = document.getElementsByClassName("leftSideMenuChoiceSelected");
  var i;
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
}

function openLeftMenuOptions(a) {
  closeNav();
  var x = document.getElementsByClassName("leftSideMenuChoiceSelected");
  x[a].style.display = "flex";
}

//new code 10/02/2020

function profileAddBand() {
  closeLeftMenuOptions();
  document.getElementById("profileAddBandContainer").style.display = "flex";
}

// new code 10/07/2020

//#profileBandsILeadContent, #profileBandsIBelongToContent

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
 
 function newRecordingProcess() {
  // new 10/21/2020
  document.getElementById("stageContainer").style.display = "none";
  // end of new 10/21/2020
  document.getElementById("newMainContentArea").style.display = "none";
  document.getElementById("newMainToolbarExtra").style.display = "none";
  document.getElementById("newMainToolbar").style.display = "none";
  document.getElementById("newRecordingProcessContainer").style.display = "flex";  
  document.getElementById("newRecordingPanelOneContainer").style.display = "flex";
  document.getElementById("closeNewRecording").style.display = "block";
  document.getElementById("newRecordingPanelTwoContainer").style.display = "none";
  document.getElementById("newRecordingPanelThreeContainer").style.display = "none";
  document.getElementById("newRecordingPanelFourContainer").style.display = "none";
  document.getElementById("newRecordingPanelFiveContainer").style.display = "none";
  document.getElementById("newRecordingPanelSixContainer").style.display = "none";
  audioOnly = false;
}

function closeNewRecording() {
  // new 10/21/2020
  document.getElementById("stageContainer").style.display = "none";
  // end of new 10/21/2020
  document.getElementById("newRecordingProcessContainer").style.display = "none";
  document.getElementById("newRecordingPanelTwoContainer").style.display = "none";
  document.getElementById("newRecordingPanelThreeContainer").style.display = "none";
  document.getElementById("newRecordingPanelFourContainer").style.display = "none";
  document.getElementById("newRecordingPanelFiveContainer").style.display = "none";
  document.getElementById("newRecordingPanelSixContainer").style.display = "none";
  document.getElementById("newRecordingLeadTimeNum").value = "0";
  beanCounter();
  document.getElementById("newRecordingLeadTimeNum").value = "20";
  document.getElementById("newMainContentArea").style.display = "flex";
  document.getElementById("newMainToolbarExtra").style.display = "flex";
  document.getElementById("newMainToolbar").style.display = "flex";
  audioOnly = false;
}

function newRecordingPanelTwo(x) {
  document.getElementById("newRecordingPanelOneContainer").style.display = "none";
  document.getElementById("newRecordingPanelTwoContainer").style.display = "flex";
  document.getElementById("newRecordingPanelThreeContainer").style.display = "none";
  document.getElementById("newRecordingPanelFourContainer").style.display = "none";
  document.getElementById("newRecordingPanelFiveContainer").style.display = "none";
  document.getElementById("newRecordingPanelSixContainer").style.display = "none";
  if(x==1) {
    audioOnly = true;
  }
}

function goBackToNewRecordingPanelOne() {
  document.getElementById("newRecordingPanelOneContainer").style.display = "flex";
  document.getElementById("newRecordingPanelTwoContainer").style.display = "none";
  document.getElementById("newRecordingPanelThreeContainer").style.display = "none";
  document.getElementById("newRecordingPanelFourContainer").style.display = "none";
  document.getElementById("newRecordingPanelFiveContainer").style.display = "none";
  document.getElementById("newRecordingPanelSixContainer").style.display = "none";
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
  document.getElementById("newRecordingPanelFourContainer").style.display = "none";
  document.getElementById("newRecordingPanelFiveContainer").style.display = "none";
  document.getElementById("newRecordingPanelSixContainer").style.display = "none";
  // new code 21/10/2020
  fadeInCameraContent();
  // end of 21/20/2020
}
}

function goBackToNewRecordingPanelTwo() {
  document.getElementById("newRecordingPanelOneContainer").style.display = "none";
  document.getElementById("newRecordingPanelTwoContainer").style.display = "flex";
  document.getElementById("newRecordingPanelThreeContainer").style.display = "none";
  document.getElementById("newRecordingPanelFourContainer").style.display = "none";
  document.getElementById("newRecordingPanelFiveContainer").style.display = "none";
  document.getElementById("newRecordingPanelSixContainer").style.display = "none";
}

function newRecordingPanelFour() {
  document.getElementById("newRecordingPanelOneContainer").style.display = "none";
  document.getElementById("newRecordingPanelTwoContainer").style.display = "none";
  document.getElementById("newRecordingPanelThreeContainer").style.display = "none";
  document.getElementById("newRecordingPanelFiveContainer").style.display = "none";
  document.getElementById("newRecordingPanelSixContainer").style.display = "none";
  document.getElementById("closeNewRecording").style.display = "none";
  document.getElementById("newRecordingPanelFourContainer").style.display = "flex";
  document.getElementById("newMainToolbar").style.display = "flex";
  y = document.getElementById("newRecordingLeadTimeNum").value;
  document.getElementById("newRecordingActualLeadTime").innerHTML = y;
}

function newRecordingPanelFive() {
  document.getElementById("newRecordingPanelFourContainer").style.display = "none";
  document.getElementById("newRecordingPanelFiveContainer").style.display = "flex";
  beanCounter();
}

function beanCounter() {
  // countdown
  y = document.getElementById("newRecordingLeadTimeNum").value;
  document.getElementById("panelFiveLeadTime").innerHTML = y;
  var x = setInterval(leadTimeCounter, 1000);    
        function leadTimeCounter() {
          if(y >=1) {  
            a = --y;
            document.getElementById("panelFiveLeadTime").innerHTML = a;
          } else {
            clearInterval(x);
            newRecordingPanelSix();
          } 
        }
}

function newRecordingPanelSix() {
  document.getElementById("newRecordingPanelFiveContainer").style.display = "none";
  document.getElementById("newRecordingPanelSixContainer").style.display = "flex";
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


// 10/21/2020
var stageStatus = "off";

function newChangeView() {
  if(stageStatus == "off") {
    document.getElementById("stageContainer").style.display = "flex";
    document.getElementById("newMainContentArea").style.display = "none";
    stageStatus = "on";
  } else {
    document.getElementById("stageContainer").style.display = "none";
    document.getElementById("newMainContentArea").style.display = "flex";
    stageStatus = "off";
  }
}