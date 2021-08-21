// place your const, vars, functions or classes here
const bFont = 4;
const sFont = bFont / 2;
const tFont = sFont / 2;

const gold = "#ffff00";
const dGold1 = "#ffff00";
const dGold2 = "#90783a";

var hrmInfo, hrmOffset = 0;
var hrmInterval;
var btm = g.getHeight()-1;

function onHRM(h){
  if(counter !== undefined){
    counter = undefined;
  }
  hrmInfo = h;
  if(hrmInterval) clearInterval(hrmInterval);
  hrmInterval = undefined;
  if(hrmInfo.raw){
    hrmOffset = 0;
    setTimeout(function(){
      hrmInterval = setInterval(readHRM,41);
    },40);
  }
  var str = hrmInfo.bpm;
  g.setColor(gold);
  g.setFont("6x8", tFont);
  g.drawString("HP "+ str + " BPM", 38, 192);
}

Bangle.on('HRM', onHRM);

Bangle.on('HRM-raw', function(v){
  hrmOffset++;
  if(hrmOffset>g.getWidth()){
    hrmOffset=0;
  }
  if(counter !== undefined){
    counter = undefined;
  }
});

var counter = 5;
function countDown(){
  if(counter){
    setTimeout(countDown, 1000);
  }
}
countDown();

var wasHigh = 0, wasLow = 0;
var lastHigh = getTime();
var hrmList = [];
var hrmInfo;

function readHRM() {
  if (!hrmInfo) return;

  if (hrmOffset==0) {
  }
  for (var i=0;i<2;i++) {
    var a = hrmInfo.raw[hrmOffset];
    hrmOffset++;
  }
}

function leapYearDetect(year){
  return !((year % 4) && (year % 100) || !(year % 400));
}

function topLine(){
  g.setColor(gold);
  g.setFontAlign(0, -1, 0);

  g.moveTo(0, 50).lineTo(30, 50);
  g.lineTo(30, 40);
  g.lineTo(35, 40).moveTo(90, 40).lineTo(95, 40);
  g.lineTo(95, 50);
  g.lineTo(239, 50);

  g.setFont("6x8", sFont);
  g.drawString("STAT", 65, 34);
  g.drawString("INV", 130, 34);
  g.drawString("DATA", 190, 34);
  g.setColor(dGold1);
  g.drawString("STATUS", 45, 55);
  g.drawString("SPEC", 122, 55);
  g.drawString("PERKS", 195, 55); 
}

function bottomLine() {
  var today = new Date();
  var yy = today.getFullYear();
  var day = today.getDay(); //day of week as number
  var h = today.getHours();

  var startDate = new Date(yy, 0, 0);
  var oneDay = 1000 * 60 * 60 * 24;
  var daysInYear = 0;
  var diff = today - startDate;
  var currDayInYear = Math.floor(diff / oneDay);

  if (isLeapYear(yy)) daysInYear = 366;
  else daysInYear = 365;

  g.setFont("6x8", tFont);

  //first line
  g.setColor(dGold2);
  g.fillRect(5, 175, 100, 185); //DATE
  g.fillRect(105, 175, 160, 185);//STIM
  g.fillRect(166, 175, 239, 185); // RADAWAY
  g.setColor(gold);

  g.drawString("DATE", 20, 177);
  g.drawString("STIM (3)", 135, 177);
  g.drawString("RADAWAY (8)", 205, 177);

  //second line
  g.setColor(dGold2);
  g.fillRect(5, 190, 70, 200);
  g.fillRect(75, 190, 239, 200);

  g.setColor(gold);
  g.drawString("LEVEL " + day, 100, 192); //show week day
  g.drawRect(127, 192, 235, 198); //frame
  g.fillRect(128, 193, 128 + ((107/24)*h), 197); //progress bar showing progress of day
}

function drawClock() {
  var t = new Date();
  var h = t.getHours();
  var m = t.getMinutes();
  var dd = t.getDate();
  var mm = t.getMonth()+1; //month is zero-based
  var yy = t.getFullYear();
  var time = ("0" + h).substr(-2) + ":" + ("0" + m).substr(-2);

  //create date string
  if (dd.toString().length < 2) dd = '0' + dd;
  if (mm.toString().length < 2) mm = '0' + mm;
  var date = dd + "." + mm + "." + yy;

  g.setFont("6x8",bFont);
  g.setColor(gold);
  g.setFontAlign(0, -1, 0);

  g.clearRect(0, 110, 150, 140);
  g.drawString(time, 70, 110);

  //draw date
  g.setFont("6x8", tFont);
  g.drawString(date, 67, 177);
}

function drawAll() {
  topLine();
  bottomLine();
  drawClock();
  readHRM();
}

// special function to handle display switch on
Bangle.on('lcdPower', (on){
  if (on) {
    drawAll();
  }
});

g.clear();
Bangle.setUI("clock");
Bangle.loadWidgets();
Bangle.drawWidgets();
setInterval(drawClock, 1E4);
drawAll();
