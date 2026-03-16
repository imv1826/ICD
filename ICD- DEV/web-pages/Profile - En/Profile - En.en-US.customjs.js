$(document).ready(function() {
    $('#icd_caslcomplianceconsent').hide();
    // Step 1: Find the element with id="emailaddress1"
    var emailElement = $("#emailaddress1");
    // Step 2: Go to the parent of the found element
    var parentElement = emailElement.closest(".control");
    // Step 3: Find the <a> child within the parent
    var linkElement = parentElement.find("a");
    // Step 4: Set the font size of the <a> element to 1.6rem with !important if it was found
    if (linkElement.length > 0) {
        linkElement.attr("style", "font-size: 1rem !important;");
    } else {
        console.log("No <a> element found.");
    }
});