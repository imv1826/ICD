$(document).ready(() => {
    // Apply the style to control elements containing checkboxes
    $("td:has(.checkbox)").find(".control").css("margin-left", '30px');
    
    // Apply the same style to the description below the checkbox
    $("td:has(.checkbox)").find(".description.below").css("margin-left", '30px');
});