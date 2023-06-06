var recommendControls = document.getElementById("recommendYes");
var controlInput = document.getElementById("sampleControl");
var roman = document.getElementById("romanYes");
var total = '';

//This is where the vast majority of the magic happens but there's a wee function down near the bottom that deals with inputs being enabled or disabled
function quoteTool(){

// Declare our variables, these are mostly pricing variables 
var extraction = document.getElementById("dnaYes");
var expedited = document.getElementById("expYes");
var sampleNumberInput = parseInt(document.getElementById("sampleNumber").value);
var sampleOpenReminder = document.querySelector(".sample-info");
var sampleMinimumReminder = document.querySelector(".sample-minimum");
var sampleControls;
var sampleSimple;
var sampleNumber = '';
var sampleBatch = 16;
var minSampleSet = 96;
var slotsPaid = '';
var sampleControlRec = 47;
var sampleUnits = Math.ceil((sampleNumber / 16));
var hasErrors = false;
var processCost;
var fullSlots;
var unitPrice;
var expeditedFee;
var expeditedTotal;
var extractionFee;
var extractionSamples;
var extractionTotal;
var subtotal;
var salesTax = 1.08025;
var taxFee;


//Prices without being expedited
var normalExtraction = 20;
var lowProcess = 290;
var lowMidProcess = 270;
var upperMidProcess = 250;
var highProcess = 230;

//Prices when expedited
var expeditedExtraction = 41;
var expLowProcess = 326;
var expLowMidProcess = 306;
var expUpperMidProcess = 286;
var expHighProcess = 266;

//Sample processing thresholds
var low = 879;
var lowMid = 1830;
var upMid = 3618;

// Weird thing to avoid using $ to format total as currency.
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});


//Set values for sampleNumber and unitPrice, this is called lower in the script
//BEGIN SET VALUE FUNCTION
const setValues = () =>{


  extractionFee = normalExtraction;
  
  sampleNumber = sampleNumberInput;

//Set price
switch (true){

  case (sampleNumber <= low) :
  unitPrice = lowProcess;
  break;

  case (sampleNumber <= lowMid) :
  unitPrice = lowMidProcess;
  break;

  case (sampleNumber <= upMid) :
  unitPrice = upperMidProcess;
  break;

  case (sampleNumber > upMid) :
  unitPrice = highProcess;
  break;
}

//The above function sets extraction fees to prices above zero, this function checks if the extraction checkbox is set to "no" and if so, sets the fee to 0
if (extraction.checked){extractionSamples = sampleNumber;}else{extractionFee = 0; extractionSamples = 0;}



//Set the sampleControl variable based on if the user wants a custom number of controls or takes our recommendation
if (controlInput.disabled){
  sampleControls = Math.floor(sampleNumber / sampleControlRec);
} else{
  sampleControls = parseInt(controlInput.value);
}


//Set a variable to raw sample number before adding controls to main variable
sampleSimple = sampleNumber;

sampleNumber += sampleControls;

slotsPaid = sampleNumber;

slotsPaidLess = (Math.floor(sampleNumber/sampleBatch))*sampleBatch;

slotsPaidMore = (Math.ceil(sampleNumber/sampleBatch))*sampleBatch;
if (slotsPaidMore <= 95){
  slotsPaidMore = 96;
}

fullSlots = ((sampleNumber + sampleBatch) % sampleBatch);

extractionTotal = extractionFee * sampleSimple;

processCost = unitPrice * slotsPaid;

subtotal = processCost + extractionTotal;

taxFee = subtotal * salesTax - subtotal;

total = subtotal + taxFee;
console.log(total);
}
//END SET VALUE FUNCTION


//BEGIN CHECK VALUE FUNCTION
function checkValues(){
  //If there are some spare sample slots, display a notice of this and show how many spares there are
  if (fullSlots == 0 || isNaN(fullSlots) || slotsPaid < 96){
    sampleOpenReminder.classList.add("d-none");
  } 
  else {
    sampleOpenReminder.classList.remove("d-none");
hasErrors = true;
  }

//Checks if your sample batch is more than 96 and displays an error if that's the case
if(sampleNumber >= minSampleSet){
 sampleMinimumReminder.classList.add("d-none");
}else{
  sampleMinimumReminder.classList.remove("d-none");
  hasErrors = true;
}

if (hasErrors == true){
document.querySelector('.infoForm').classList.remove('infoFormValid');
document.querySelector('.array-quote .approvalText').classList.add('d-none');
document.querySelector('.array-quote .errorText').classList.remove('d-none');
document.querySelector('.array-quote button').classList.add('btn-secondary');
document.querySelector('.array-quote button').classList.remove('btn-primary');
} else {
document.querySelector('.infoForm').classList.add('infoFormValid');
document.querySelector('.array-quote .approvalText').classList.remove('d-none');
document.querySelector('.array-quote .errorText').classList.add('d-none');
document.querySelector('.array-quote button').classList.add('btn-primary');
document.querySelector('.array-quote button').classList.remove('btn-secondary');
}
}
//END CHECK VALUE FUNCTION


//BEGIN VALUE UPDATE FUNCTION
//Function updates DOM elements with relevant values
function valueUpdate(slotsPaid){


// Switches a bit of error text
  if (slotsPaidLess > 80){document.querySelector('.slotsPaidLess').innerHTML = slotsPaidLess + ' or ';}
  else{document.querySelector('.slotsPaidLess').innerHTML = "";}

  document.querySelector('.slotsPaidMore').innerHTML = slotsPaidMore;
  //document.querySelector('.slotsPaid').innerHTML = slotsPaid;
  document.querySelector('.slotsUsed').innerHTML = sampleNumber;
  document.querySelector('.slotsSample').innerHTML = sampleSimple;
  document.querySelector('.unitPrice').innerHTML = formatter.format(unitPrice);
  document.querySelector('.sampleControls').innerHTML = sampleControls;
  document.querySelector('.processCost').innerHTML = formatter.format(processCost);
  document.querySelector('.extractionSamples').innerHTML = extractionSamples;
  document.querySelector('.extractionUnit').innerHTML = formatter.format(extractionFee);
  document.querySelector('.extractionTotal').innerHTML = formatter.format(extractionTotal);
  document.querySelector('.subtotal').innerHTML = formatter.format(subtotal);
  document.querySelector('.taxFee').innerHTML = formatter.format(taxFee);
  document.querySelector('.total').innerHTML = formatter.format(total);

  document.querySelector('#sampleControl:disabled').value = sampleControls;
}
//END VALUE UPDATE FUNCTION

//convert total to roman numbers
//Why such an odd feature? I saw it on leetcode and wanted to add it link: https://leetcode.com/problems/roman-to-integer/
function toRoman(num){
  // probably going to be a decimal so let's round it quick
  num = Math.ceil(num);
  //Where we hold the roman numeral value which we get down below
  var roman = "";
  // The following 2 arrays work as a key between numeric intger values and their corresponding roman numeral values
  // E.G. decimalNum[2] and romanNum[2] correspond to 5000 and M respectively
  var decimalNum = [10000, 5000, 1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  var romanNum = ["Ẋ", "V̇", "M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];

  // Outer loop: Do this for the length of the decimalNum array length
  for (var i = 0; i < decimalNum.length; i++) {
    // Inner loop: Do this while the number we want to convert is bigger than the number in the decimalNum array
    while (num >= decimalNum[i]) {
      // Each time the while loop runs, concat the corresponding roman numeral to our "roman" variable
      roman += romanNum[i];
      // Each time the while loop runs, subtract the numeric amount of the roman numeral from our number total
      num -= decimalNum[i];
    }
  }

  // Share our converted roman numeral with the app
  return roman;
}

function convertNumeral(){
if (roman.checked){
  document.querySelector('.total').innerHTML = toRoman(total);
} else {
// No need to do anything
}
}

//Run the functions only if the value entered is a positive number
if (sampleNumberInput > -1){
  setValues();
  checkValues();
  valueUpdate();
  convertNumeral();
} else{

}


}
// END QUOTE GENERATION FUNCTION

//Enable/ disable the controller input field based on if they want the recommended amount or a custom one
function controlToggle(){
  if (recommendControls.checked){
    controlInput.setAttribute("disabled","true");
  } else {
    controlInput.removeAttribute("disabled");
  }
}



function formToggle(){
  document.querySelector('.infoFormValid').slideToggle("slow");
}

// Rebuilding slideToggle functionality without jQuery
