$(window).on('load', function () {
    console.log("testing");
    //get logged in user details
        // Retrieve user info from sessionStorage
        var storedUserId = sessionStorage.getItem('userId');
        var storedAppID = sessionStorage.getItem('AppID');
        var userInfo = JSON.parse(sessionStorage.getItem("userInfo")) || {};
    console.log(userInfo);
    





    $.ajax({
        url: `/_api/icd_guests?$count=true&$filter=_icd_application_value eq ${storedAppID} and _icd_contact_value eq ${userInfo.id}&$select=icd_guestid`,
        type: "GET",
        cache: true,  
        async: false,  // Synchronous request
        success: function (data) {
            numberOfGuests = data['@odata.count'];
            console.log("Request-belong to protal user : " + numberOfGuests);
        },
        error: function () {
            console.error("Error fetching data for request #");
        }
    });


    // Handle checkbox change event
    $("#icd_thisticketisforme").on("change", function () {
        if ($(this).is(":checked")) {
            // Populate fields with user info and make them readonly
            $("#icd_firstname").val(userInfo.firstname || "").prop("readonly", true);
            $("#icd_lastname").val(userInfo.lastname || "").prop("readonly", true);
            $("#icd_email").val(userInfo.email || "").prop("readonly", true);
            $("#icd_dietaryrestrictions").val(userInfo.dietaryRestrictions || "").prop("readonly", true);
            $("#icd_title").val(userInfo.title || "").prop("readonly", true);
            $("#icd_informalname").val(userInfo.informalName || "").prop("readonly", true);
            $("#icd_accessibility").val(userInfo.accessibility || "").prop("readonly", true);
            $("#icd_firstname, #icd_lastname, #icd_email, #icd_dietaryrestrictions, #icd_title, #icd_informalname, #icd_accessibility").each(function () {
                $(this).attr('style', function (i, style) {
                    return (style || '') + 'background-color: #f2f2f2 !important;';
                });
            });
        } else {
            // Clear fields and make them editable
            $("#icd_firstname, #icd_lastname, #icd_email, #icd_dietaryrestrictions, #icd_title, #icd_informalname, #icd_accessibility")
                .val("")
                .prop("readonly", false)
            $("#icd_firstname, #icd_lastname, #icd_email, #icd_dietaryrestrictions, #icd_title, #icd_informalname, #icd_accessibility").each(function () {
                $(this).css('background-color', ''); // Remove inline style
                $(this).attr('style', function (i, style) {
                    return style ? style.replace(/background-color:.*?;/gi, '') : '';
                });
            });

        }
    });

    if (numberOfGuests > 0) {
        $("#icd_thisticketisforme").closest("td").hide();
    }

    // Retrieve the deliveryMethod from sessionStorage
    const deliveryMethod = sessionStorage.getItem('deliveryMethod');

    // Check if deliveryMethod is 100000001 and hide the element
    if (deliveryMethod == '100000001') {
        $("#icd_dietaryrestrictions").closest('td').hide();
    }



     // Retrieve the value from sessionStorage
    var numtablePurchased = sessionStorage.getItem('numtablePurchased');

    // Log the value with a detailed message
    console.log('The value of numtablePurchased in sessionStorage is: ' + numtablePurchased);

    if (numtablePurchased == 0) {
    var $checkbox = $('#icd_addtogalatable');
    if ($checkbox.length) {
        $checkbox.closest('tr').hide();
        console.log('Row containing icd_addtogalatable hidden because numtablePurchased = 0');
    } else {
        console.warn('Checkbox #icd_addtogalatable not found.');
    }
}

    
});