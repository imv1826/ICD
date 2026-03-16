{% assign eventID = {{request.params['refid']}} | default: "" %}
var eventTableIds = [];

{% fetchxml EventTables %}
    <fetch top="50">
    <entity name="icd_eventtable">
        <attribute name="icd_eventtableid" />
        <filter>
        <condition attribute="statuscode" operator="eq" value="1" />
        <condition attribute="icd_remainingcapacity" operator="gt" value="0" />
        <condition attribute="icd_msevtmgt_event" operator="eq" value="{{eventID}}" />
        </filter>
        <filter type="or">
        <condition attribute="icd_purchaser" operator="eq" value="{{user.id}}" />
        <condition attribute="icd_tablemanager" operator="eq" value="{{user.id}}" />
        </filter>
    </entity>
    </fetch>
{% endfetchxml %}
{% for EventTable in EventTables.results.entities %}
    eventTableIds.push("{{EventTable.icd_eventtableid}}");
    //console.log("{{EventTable.icd_eventtableid}}");
{% endfor %}
//console.log("eventTableId",eventTableIds);
$(window).on("load", function () {

    function checkSessionRegistered() {
        var rowCount = $("#SessionRegistered tbody tr").length;
        //console.log("Row Count:", rowCount);

        if (rowCount > 0) {
            $("#SessionRegistered").show();  // Show the table if rows are present
            $("#SessionRegistered").closest('tr').show();  // Show the parent <tr> if rows are present
        } else {
            $("#SessionRegistered").hide();  // Hide the table if no rows
            $("#SessionRegistered").closest('tr').hide();  // Hide the parent <tr> if no rows
        }
    }

    // Delay check to allow subgrid to load
    setTimeout(checkSessionRegistered, 1000);

    // Use MutationObserver to track dynamic changes
    var observer = new MutationObserver(function (mutations, obs) {
        var rowCount = $("#SessionRegistered tbody tr").length;
        console.log("Observer Row Count:", rowCount);

        if (rowCount > 0) {
            $("#SessionRegistered").show();  // Show the table if rows are present
            $("#SessionRegistered").closest('tr').show();  // Show the parent <tr> if rows are present
        } else {
            $("#SessionRegistered").hide();  // Hide the table if no rows
            $("#SessionRegistered").closest('tr').hide();  // Hide the parent <tr> if no rows
        }
    });

    var targetNode = document.querySelector("#SessionRegistered tbody");
    if (targetNode) {
        observer.observe(targetNode, { childList: true, subtree: true });
    }

    $('#icd_table option').each(function () {
        var val = $(this).val();
        // Keep the default 'Select' option (usually empty string), or if it's in the allowed array
        if (val !== "" && !eventTableIds.includes(val)) {
          $(this).remove();
        }
      });



// --- NEW: Handle icd_email changes with console logs ---
// function handleEmailChange() {
//     var emailVal = $("#icd_email").val();
//     var tableLookup = $("#icd_table");
//     var tableClearCache = $("#icd_tableclearcache");

//     console.log("Current icd_email value:", emailVal);
//     console.log("icd_table value before change:", tableLookup.val());
//     console.log("icd_tableclearcache before change:", tableClearCache.val());

//     // Condition: email NOT equal to Filter@nomail.com
//     if (emailVal && emailVal !== "Filter@nomail.com") {

//         var currentValue = tableLookup.val(); // get icd_table value
        
//         // Set icd_tableclearcache to same value
//         tableClearCache.val(currentValue);
//         tableClearCache.trigger("change");

//         console.log("Triggered icd_tableclearcache with value:", currentValue);

//     } else {
//         console.log("icd_email is Filter@nomail.com or empty. No action taken.");
//     }
// }

// // Trigger on load
// handleEmailChange();

// // Trigger when icd_email changes
// $("#icd_email").on("change keyup paste", handleEmailChange);





});
