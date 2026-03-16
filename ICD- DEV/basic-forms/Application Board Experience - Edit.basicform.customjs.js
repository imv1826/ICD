$(document).ready(function(){

    // Initial setup to show or hide fields based on default values 
    var boardRoleValue = $("#icd_boardrole").val();
    var committeeNameValue = $("#icd_committee").val();
    
    // Handle the default visibility for icd_otherboardrole based on the default value
    toggleField("icd_otherboardrole", boardRoleValue === "100000003");
    
    // Handle the default visibility for icd_othercommitteeposition based on the default value
    toggleField("icd_othercommitteeposition", committeeNameValue === "100000027");

    // Event handler for when the #icd_boardrole dropdown changes
    $("#icd_boardrole").change(function(){
        var selectedValue = $(this).val();
        toggleField("icd_otherboardrole", selectedValue === "100000003");
    });

    // Event handler for when the #icd_committeeposition dropdown changes
    $("#icd_committee").change(function(){
        var selectedValue = $(this).val();
        toggleField("icd_othercommitteeposition", selectedValue === "100000027");
    });
});

// Function to toggle visibility and required status of a field
function toggleField(fieldName, isRequired) {
    var field = $("#" + fieldName);
    var parentTd = field.parents("td").first();
    
    // Toggle visibility
    parentTd.toggle(isRequired);
    
    // Handle required status using MakeRequired and MakeNotRequired functions
    if (isRequired) {
        MakeRequired(fieldName);
    } else {
        MakeNotRequired(fieldName);
    }
}

// Make a field required
function MakeRequired(fieldName) {
    var field = $("#" + fieldName);
    field.prop('required', true).closest(".control").prev().addClass("required");

    var validator = $("<span>", {
        id: fieldName + "Validator",
        style: "display:none;",
        controltovalidate: fieldName,
        errormessage: "&lt;a href='#" + fieldName + "_label'&gt;" + $("#" + fieldName + "_label").html() + " is a required field.&lt;/a&gt;",
        evaluationfunction: function() {
            return field.val() != null && field.val() !== "";
        }
    })[0];

    Page_Validators.push(validator);
}

// Remove required status from a field
function MakeNotRequired(fieldName) {
    var field = $("#" + fieldName);
    field.prop('required', false).closest(".control").prev().removeClass("required");

    Page_Validators = Page_Validators.filter(function(validator) {
        return validator.id !== fieldName + "Validator";
    });
}

$(window).on('load', function () {

    // On  load, check if the #icd_account dropdown has a value, if not check the override checkbox
    if ($('#icd_account').val() === '' || $('#icd_account').val() === null) {
        // If no value is selected in icd_account, check the override checkbox
        $('#override_icdOrganisationName').prop('checked', true).trigger('change');
    }

     // Retrieve session storage values
     var typingSnippet = sessionStorage.getItem("Application/AccountLookup/Typing");
     var checkboxSnippet = sessionStorage.getItem("Application/AccountLookup/Checkbox");
    $('#icd_account').closest('td').hide();
    var divOrgCheckbox = `
        <tr> 
            <td colspan="2" rowspan="1" class="clearfix cell text form-control-cell">
                <input type="text" name="companyInfoCompleteSearch" id="companyInfoCompleteSearch"
                    class="text form-control" placeholder="${typingSnippet}"
                    autocomplete="pca-override">
                <div class="help-block">
                    <div>
                        <label style="font-weight: normal;">
                            <input onclick="" type="checkbox" id="override_icdOrganisationName">
                            ${checkboxSnippet}
                        </label>
                    </div>
                </div>
            </td>
        </tr>`;

    // Find the parent td of the input with id "icd_name" and append the new HTML
    var parentTd = $('#icd_name').closest('td');
    parentTd.append(divOrgCheckbox);

    $('#override_icdOrganisationName').on('change', function () {
        if ($(this).is(':checked')) {
            // If the checkbox is checked, hide icd_name and show companyInfoCompleteSearch
            // If the checkbox is unchecked, hide companyInfoCompleteSearch and show icd_name
            $('#companyInfoCompleteSearch').hide();
            $('#icd_name').show();

        } else {
            $('#icd_name').hide();
            $('#companyInfoCompleteSearch').show();
        }
    });

    // Trigger change event on page load to apply the initial state
    $('#override_icdOrganisationName').trigger('change');

    // Autopopulate account field  -------------------------------------------->
    $("#companyInfoCompleteSearch").autocomplete({
        source: function (request, response) {
            if (request.term.length >= 3) {
                $.ajax({
                    url: "/_api/accounts?$select=name,accountid",
                    type: "GET",
                    data: {
                        $filter: "contains(name,'" + request.term + "')",
                        $top: 5
                    },
                    success: function (data) {
                        var results = $.map(data.value, function (account) {
                            return {
                                label: account.name,  // Displayed va lue in the suggestion list
                                value: account.name,  // Value returned on selection
                                accountData: account  // Store the entire account object for later use
                            };
                        });
                        response(results);
                    },
                    error: function () {
                        console.error("Error fetching accounts from API");
                    }
                });
            }
        },
        minLength: 3,
        select: function (event, ui) {
            // Access the selected account's data
            var selectedAccount = ui.item.accountData;

            // Autopopulate fields with the selected account's data
            $("#icd_account").val(selectedAccount.accountid);
            $("#icd_name").val(selectedAccount.name);
        }
    });

    // Clear the #icd_account dropdown when #icd_name changes
    $('#icd_name').on('change input', function () {
        $('#icd_account').val(''); // Clear the value of the dropdown
    });
        $('#companyInfoCompleteSearch').val($('#icd_name').val());
    //End Autopopulate account field -------------------------------------------->

});