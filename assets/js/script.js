// trigger budget modal
// get modal form 
var modalBudget = $("#modal-budget");
//get modal button that opens the modal
var modalBudgetBtn = $(".budget-calculateBtn");
//get the button that closes the modal
var modalFormCloseX= $(".modal-budget-closeModal");
//get modal close btn 
var modalCloseBtn=$(".modal-budget-closeBtn");
//get modal save btn 
var modalSaveBtn=$(".modal-budget-saveBtn");
//get modal-values
var modalNumberOfTraveler = $(".modal-budget-NumberOfTraveler");
var modalEachTraveler= $(".modal-budget-eachTraveler");
var modalUnexpectedCost = $(".modal-budget-unexpectedCost");
var modalDepartureDate = $(".modal-budget-departureDate");


//when the user clicks the budget calculator button, open the modal
modalBudgetBtn.on("click", function() {
    modalBudget.removeClass("modal-budget-hidden");
    modalBudget.addClass("modal-budget-shown");

    //clear old data
    modalNumberOfTraveler.val('');
    modalEachTraveler.val('');
    modalUnexpectedCost.val('');
    modalDepartureDate.val('');
});

//when the user clicks the span X button, close the modal
modalFormCloseX.on("click", function() {
    modalBudget.removeClass("modal-budget-shown");
    modalBudget.addClass("modal-budget-hidden");
})
//when the user clicks the close button in modal form, close the modal
modalCloseBtn.on("click", function() {
    modalBudget.removeClass("modal-budget-shown");
    modalBudget.addClass("modal-budget-hidden");
})

//convert text field into a jquery date picker
    modalDepartureDate.datepicker ({
        minDate: 1,
});

//get data when user clicks the save button in the modal form, then close the modal
modalSaveBtn.on("click",function() {
    //get modal form values
    var numberOfTravelerVal = $(".modal-budget-NumberOfTraveler").val();
    var eachTravelerVal = $(".modal-budget-eachTraveler").val();
    var unexpectedCostVal = $(".modal-budget-unexpectedCost").val();
    var departureDateVal = $(".modal-budget-departureDate").val();
    departureDate = moment(moment(departureDateVal).format("MM,DD,YYYY"));
    //console.log(departureDate);

    currentDay = moment(moment().format("MM,DD,YYYY"));
    //console.log(currentDay);
    diffDay = departureDate.diff(currentDay,'days');
    //console.log(diffDay);

    var totalCostGroup = (numberOfTravelerVal * eachTravelerVal)+(numberOfTravelerVal * unexpectedCostVal);
    //console.log(totalCostGroup);
    averageGroup = Math.round((totalCostGroup/diffDay)*100)/100;
    //console.log(averageGroup);
    var totalCostEach = (eachTravelerVal*1) + (unexpectedCostVal*1);
    //console.log(totalCostEach);
    averageEach = Math.round((totalCostEach/diffDay)*100)/100;
    
    
    if (numberOfTravelerVal && eachTravelerVal && unexpectedCostVal && departureDateVal) {
        $(".budget-calculatorDatails").empty();
        $(".budget-calculatorDatails").append(
            "<ul><span class='boldText'>You entered: </span>" +
            "<li><span class='boldText'>" + numberOfTravelerVal + "</span>\xa0traveler/s</li>" + 
            "<li>Each traveler\'s estimated cost of <span class='boldText'>$" + eachTravelerVal + ",</span></li>" +
            "<li>The allowable unexpected costs of <span class='boldText'>$" + unexpectedCostVal + "</span>, and</li>" +
            "<li> Your departure date is\xa0<span class='boldText'>" + departureDateVal + ".</span></li></ul>"
        )
        $(".budget-calculatorDatails").append(
            "<ul><span class='boldText'>Based on the information provided, there is/are\xa0"+ diffDay + "\xa0day/s remaining until your departure. We'd suggest that:</span>" +
             "<li>Your group to save at least <span class='bold-text'>$" + totalCostGroup + "</span>\xa0for the entire trip, or <span class='bold-text'>$" + averageGroup + "</span>\xa0per day for\xa0<span class='bold-text'>" + diffDay +"</span>\xa0day/s, or </li>" +
             "<li>Each individual traveler to save at least <span class='bold-text'>$" + totalCostEach + "</span>\xa0for the entire trip, or <span class='bold-text'>$" + averageEach + "</span>\xa0per day for\xa0<span class='bold-text'>" + diffDay +"</span>\xa0day/s. </li></ul>"

        )
    }

    //close the modal after save
    modalBudget.removeClass("modal-budget-shown");
    modalBudget.addClass("modal-budget-hidden");
})
