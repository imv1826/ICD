$(window).on('load', function () {
    // Retrieve user info from sessionStorage
    var storedUserId = sessionStorage.getItem('userId');
    var storedAppID = sessionStorage.getItem('AppID');
    var storedTableSeat = sessionStorage.getItem('tableSeat');
    var userInfo = JSON.parse(sessionStorage.getItem("userInfo")) || {};
    var storedGuestTables = JSON.parse(sessionStorage.getItem("guestTableIds") || "[]");

    //console.log("Retrieved Guest Table IDs:", storedGuestTables);
    var numberOfGuests = 0;

//   // ✅ Hide checkbox row immediately
//     $("#icd_thisticketisforme").closest("tr").hide();

    $.ajax({
        url: `/_api/icd_guests?$count=true&$filter=_icd_application_value eq ${storedAppID} and _icd_contact_value eq ${storedUserId}&$select=icd_guestid`,
        type: "GET",
        cache: true,  // Disable caching
        async: false,  // Synchronous request
        success: function (data) {
            numberOfGuests = data['@odata.count'];
            console.log("Request-belong to protal user : " + numberOfGuests);
        },
        error: function () {
            console.error("Error fetching data for request #" + (i + 1));
        }
    });


    // // Handle checkbox change event
    // $("#icd_thisticketisforme").on("change", function () {
    //     console.log("entering on change of checkbox");
        if ($("#icd_thisticketisforme").is(":checked")) {
            console.log("checkboc is checked");
            // Populate fields with user info and make them readonly
            $("#icd_firstname").val(userInfo.firstname || "").prop("readonly", true);
            $("#icd_lastname").val(userInfo.lastname || "").prop("readonly", true);
            $("#icd_email").val(userInfo.email || "").prop("readonly", true);
            //$("#icd_dietaryrestrictions").val(userInfo.dietaryRestrictions || "").prop("readonly", true);
            $("#icd_title").val(userInfo.title || "").prop("readonly", true);
            $("#icd_informalname").val(userInfo.informalName || "").prop("readonly", true);
            //$("#icd_accessibility").val(userInfo.accessibility || "").prop("readonly", true);
            $("#icd_firstname, #icd_lastname, #icd_email, #icd_dietaryrestrictions, #icd_title, #icd_informalname, #icd_accessibility").each(function () {
                $(this).attr('style', function (i, style) {
                    return (style || '') + 'background-color: #f2f2f2 !important;';
                });
            });
        // } else {
        //     console.log("checkboc is not checked");
        //     // Clear fields and make them editable
        //     $("#icd_firstname, #icd_lastname, #icd_email, #icd_dietaryrestrictions, #icd_title, #icd_informalname, #icd_accessibility")
        //         .val("")
        //         .prop("readonly", false)
        //     $("#icd_firstname, #icd_lastname, #icd_email, #icd_dietaryrestrictions, #icd_title, #icd_informalname, #icd_accessibility").each(function () {
        //         $(this).css('background-color', ''); // Remove inline style
        //         $(this).attr('style', function (i, style) {
        //             return style ? style.replace(/background-color:.*?;/gi, '') : '';
        //         });
        //     });

         }
    //});
 // ✅ NOW hide the checkbox row
    $("#icd_thisticketisforme").closest("tr").hide();

    if (numberOfGuests > 0) {
        $("#icd_thisticketisforme").closest("td").hide();
    }
    // Retrieve the value from sessionStorage
    var numtablePurchased = sessionStorage.getItem('numtablePurchased');

    // Log the value with a detailed message
    console.log('The value of numtablePurchased in sessionStorage is: ' + numtablePurchased);

    // Check if numtablePurchased equals 0
    if (numtablePurchased == 0) {

         var $dropdown = $('#icd_guesttable');

    if ($dropdown.length) {
        $dropdown.closest('tr').hide();
        console.log('Guest table dropdown hidden because numtablePurchased = 0');
    } else {
        console.log('Dropdown #icd_guesttable not found on page');
    }

    
        // Hide the parent <tr> of the element with id icd_addtogalatable
        $('#icd_addtogalatable').closest('tr').hide();
    }

    //validate number of gala table --- set 'add to gala table' readonly or editable
    var numberOfAssignedTable =0;
        $.ajax({
        url: `/_api/icd_guests?$count=true&$filter=_icd_application_value eq ${storedAppID} and icd_addtogalatable eq true &$select=icd_guestid`,
        type: "GET",
        cache: true,  // Disable caching
        async: false,  // Synchronous request
        success: function (data) {
            numberOfAssignedTable = data['@odata.count'];
            console.log("number of table assigned is  : " + numberOfAssignedTable);
        },
        error: function () {
            console.error("Error fetching data for request #");
        }
    });

    if(numberOfAssignedTable >= storedTableSeat && !$("#icd_addtogalatable").prop("checked")){

        $("#icd_addtogalatable").prop("disabled", true);
    }else {
        $("#icd_addtogalatable").prop("disabled", false);
    }


    
    //Code to hide show guest table dropdown

   // Function to handle the visibility logic
    function handleGuestTableVisibility() {
        if ($('#icd_guesttable').length) {
            const closestTd = $('#icd_guesttable').closest('td');
            
            if (closestTd.length) {
                // Check if selected value is 100000000
                if ($('#icd_conferencetype').val() === '100000000') {
                    $('#icd_guesttable').val('');
                    closestTd.hide();
                } else {
                    closestTd.show();
                }
            }
        }
    }

    // Check if the dropdown exists
    if ($('#icd_conferencetype').length) {
        // Run on page load
        handleGuestTableVisibility();
        
        // Add event listener for change event
        $('#icd_conferencetype').on('change', handleGuestTableVisibility);
        
        console.log('Event listener attached to icd_conferencetype and initial check completed');
    } else {
        console.log('Dropdown with id "icd_conferencetype" not found');
    }
    
    
    const select = document.getElementById("icd_guesttable");
    if (select){
      
        // Remove all options not in guestTableIds
        Array.from(select.options).forEach(option => {
            if (!storedGuestTables.includes(option.value)) {
                option.remove();
            }
        });

    }


// var checkDropdown = setInterval(function () {
//     var $dropdown = $('#icd_guesttable');
//     var options = $dropdown.find('option');

//     if ($dropdown.length && options.length > 0) {
//       if (options.length === 1 && options.first().text().trim() === 'Select') {
//         $dropdown.closest('td').hide();
//         console.log('Guest table dropdown hidden because it only has "Select"');
//       } else{
//         console.log('Has values');
//       }
//       clearInterval(checkDropdown);
//     }
//   }, 500);

});