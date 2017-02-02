var context;
window.onload = function(){

  var audio = new Audio();
  var songs = document.querySelectorAll("a");
    var nowPlay= document.querySelector(".nowPlay");
    var playS = document.querySelector("#playSound");
    var pause = document.querySelector(".pauseSound");
    var range = document.querySelector("#rangeP");
    var progressT = document.querySelector("#progressTime");
    var timeS = document.querySelector(".timeAll");
    var timeN = document.querySelector(".timeNow");
    var inpElements = document.querySelectorAll(".eqInp");
    var filters = [];
    var firstPlay = true;
    var temp  = 0;
    var m = 0, tm = 0, s = 0, ts=0;
    var dm = 0, dtm = 0, ds = 0, dts=0;
    
     nowPlay.innerHTML = songs[temp].text;

     window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
    var gainNode = context.createGain();
  var destination = context.destination;
  var source;

   

  range.oninput = function(){
  audio.volume = this.value;
  console.log(this.value);
}
  progressT.oninput = function(){
    audio.currentTime = this.value;
   this.max = audio.duration;
    setTimeout(function(){
   play();
    },100);
   
}
audio.addEventListener('timeupdate',function (){
    var curtime = parseInt(this.currentTime,10);
       progressT.max = this.duration;
       progressT.value = curtime;     
         m =parseInt(curtime/600,10);
         if(m>0){
             curtime = curtime-600*m
         }
         tm = parseInt(curtime/60,10);
         if(tm>0){
              curtime = curtime - 60*tm;
         }
         s = parseInt(curtime/10,10);
         if(s>0){
             curtime = curtime-10*s;
         }
    
         //tm = parseInt(curent/10,10);
         
       timeN.innerHTML = m+""+tm+":"+s+""+curtime;
  });


var play = function(){
  source = context.createMediaElementSource(audio);
   source.connect(gainNode);
  gainNode.connect(destination);
  source.connect(destination);

  var filters = createFilters();
     elementInputs(filters);
  // источник цепляем к первому фильтру 
  source.connect(filters[0]);
  // а последний фильтр - к выходу
  filters[filters.length - 1].connect(context.destination);

  audio.onloadedmetadata = function(){
    var time = parseInt(this.duration,10);
     m =parseInt(time/600,10);
         if(m>0){
             time = time-600*m
         }
         tm = parseInt(time/60,10);
         if(tm>0){
              time = time - 60*tm;
         }
         s = parseInt(time/10,10);
         if(s>0){
             time = time-10*s;
         }
    timeS.innerHTML = m+""+tm+":"+s+""+time;
  }
  gainNode.gain.value = range.value;
 audio.play();
}
   


  playS.onclick = function(){
    if(firstPlay){
    audio.src="data/first.mp3";
    firstPlay=false;
  }
    this.style.display = "none";
    pause.style.display = "block";
    play();
 }

  
 pause.onclick = function(){
    this.style.display = "none";
    playS.style.display = "block";
    audio.pause();
 }

 audio.addEventListener("ended", function(){
      setTimeout(function(){
        ++temp;
        if(temp==songs.length){
          temp=0;
        }
        nowPlay.innerHTML = songs[temp].text;
        audio.src = songs[temp].href;
             play();
            },1000);
            
     });


 for (let i = 0; i <= songs.length-1; i++) {
            songs[i].onclick = function(e){
                  firstPlay=false;
                  playS.style.display = "none";
                  pause.style.display = "block";
                  temp = i;
                  nowPlay.innerHTML = this.text;
                  e.preventDefault();
                  audio.src = this.href;
                   play();
            } 
     }

var filters=[];

   var elementInputs = function(filters){
      for (let i = 0; i < inpElements.length; i++) {
        inpElements[i].addEventListener('change', function (e) {
          filters[i].gain.value = e.target.value;
      });}
}

var createFilter = function (frequency) {
  var filter = context.createBiquadFilter();
     
  filter.type = 'peaking'; // тип фильтра
  filter.frequency.value = frequency; // частота
  filter.Q.value = 1; // Q-factor
  filter.gain.value = 0;

  return filter;
};

var createFilters = function () {
  var frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000],
    filters = frequencies.map(createFilter);

  filters.reduce(function (prev, curr) {
    prev.connect(curr);
    return curr;
  });

  
return filters;

};


 
}

 