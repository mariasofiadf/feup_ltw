var confPopUp = document.getElementById("gameConf");
var openConf = document.getElementById("play");
var closeConf = document.getElementById("closeConf");

openConf.onclick = function(){
    confPopUp.style.display = "block";
}

closeConf.onclick = function(){ 
    confPopUp.style.display = "none";
}

var rulesPopUp = document.getElementById("rulesPopup");
var openRules = document.getElementById("rules");
var closeRules = document.getElementById("closeRules");

openRules.onclick = function(){
    rulesPopUp.style.display = "block";
}

closeRules.onclick = function(){ 
    rulesPopUp.style.display = "none";
}
