/**
 * @typedef {Object} ConferenceSession
 * @property {string} sessionId
 * @property {string} title
 * @property {string} description
 * @property {number} price
 * @property {string} date
 * @property {string} time
 * @property {string} timeStr
 * @property {string} MembershipType
 * @property {string} audienceType
 * @property {number} remainingCapacity
 * @property {string} conferenceregistrationRequired
 * @property {string} complimentary
 * @property {string} SessionType
 * @property {number} RegistrationCount
 * @property {number} SessionMaxCapacity
 * @property {string} SessionCode
 * * @property {string} SessionTitleFr
 * * @property {string} SessionDescriptionFr
 */

/** @type {ConferenceSession[]} */
const AddonSessionGlobal = JSON.parse(localStorage.getItem("AddonSession") || '[]');

function filterSessions() {
    // Hide the parent <tr> of the element with the id 'icd_sessionaddonselection'
    $('#icd_sessionaddonselection').closest('tr').hide();

    var emailValue = $('#icd_email').val();

    //Code for <tbody>
    // Ensure tbody exists (create if not)
    let $tableBody = $("[data-name='ConferenceSessionSection'] tbody");
    console.log("Before check, tbody exists:", $tableBody.length > 0);

    if ($tableBody.length === 0) {
        const $table = $("[data-name='ConferenceSessionSection']");
        $tableBody = $('<tbody></tbody>');
        $table.find('colgroup').after($tableBody);
        console.log("tbody created and inserted after colgroup.");
    } else {
        console.log("tbody already exists, using existing one.");
    }
    //End of code for <tbody>
    
    // Retrieve session and contact data
   
    const contactData = JSON.parse(sessionStorage.getItem("contactData") || '[]');
    const extracted = extractTimeZone(sessionStorage.getItem("eventTimeZone"));
    const simultaneousSessionErrorMsg = sessionStorage.getItem("simultaneousSessionErrorMsg");
    const language = sessionStorage.getItem("language");

    // Define button text based on language
    const addText = language === "fr-Fr" ? "Ajouter" : "Add";
    const PriceTranslation = language === "fr-Fr" ? "Prix" : "Price";
    const TimeTranslation = language === "fr-Fr" ? "Heure" : "Time";
    const removeText = language === "fr-Fr" ? "Supprimer" : "Remove";
    const varHalifaxStr = language === "fr-Fr" ? "Heure Halifax" : "Halifax Time";

    // Filter contact data by emailValue
    const contact = contactData.find(c => c.email === emailValue);
    //console.log("Contact Data:", contact);

    if (!contact) {
        //console.log("No contact found for the given email");
        return;
    } else {
        //console.log(contact);
    }

    //console.log("Filtered Contact Data:", contact);

    // Check if there's a value in #icd_conferencetype
    const conferenceType = ($('#icd_conferencetype').val() || "").toString();

    // Initially, include all sessions
    let filteredSessions = [...AddonSessionGlobal];

    console.log("All Sessions:", filteredSessions);


    if (language === "fr-Fr") {
        filteredSessions.forEach(session => {
            // Swap dd and mm in date (assumes MM/dd/yyyy)
            if (session.date) {
                const [month, day, year] = session.date.split('/');
                session.date = `${month}/${day}/${year}`;
                
            }

            // Swap dd and mm in time (assumes MM/dd/yyyy hh:mm:ss - MM/dd/yyyy hh:mm:ss)
            if (session.time) {
                session.time = session.time
                    .split(' - ')
                    .map(datetime => {
                        const [datePart, timePart] = datetime.split(' ');
                        const [month, day, year] = datePart.split('/');

                        return `${day}/${month}/${year} ${timePart}`;
                    })
                    .join(' - ');
            }
        });
    }

    console.log("All Sessions into french:",filteredSessions);




    // Check the membership status and log accordingly - audience type/////////////////////////////
    const membershipStatus = contact.membershipStatus;
    if ([100000001, 100000003, 100000006, 100000007, 100000008].includes(membershipStatus)) {
        //console.log("ICD.D member");
    } else if ([100000002, 100000005, 100000007].includes(membershipStatus)) {
        // Filter sessions where audienceType is either Memberes and Everyone
        //console.log("Member");
        filteredSessions = filteredSessions.filter(session => session.audienceType === "100000003" || session.audienceType === "100000000");
    } else {
        // Filter sessions where audienceType = 100000003
        //console.log("Non-Member");
        filteredSessions = filteredSessions.filter(session => session.audienceType === "100000003");
    }
    //console.log(filteredSessions);

    // Filter sessions based on conferenceType if conferenceType = gala filter where conferenceRegistrationRequired = false
    if (conferenceType === "100000001") {
        //console.log("Conference Type is gala");
        filteredSessions = filteredSessions.filter(session => session.conferenceregistrationRequired === "false");
        //console.log(filteredSessions);
    }

      // Filter sessions based on conferenceType if conferenceType = gala filter where conferenceRegistrationRequired = false
    if (conferenceType === "100000001" || conferenceType === "100000002" || conferenceType === "100000000") {
        //console.log("Conference Type is gala");
        filteredSessions = filteredSessions.filter(session => session.SessionType !== "100000006");
        //console.log(filteredSessions);
    }


    // Filter sessions by MembershipType
    filteredSessions = filteredSessions.filter(session => session.MembershipType == "" || session.MembershipType.includes(membershipStatus));
    //console.log(filteredSessions);
 
    // Add start time and end time to each session object
    filteredSessions = filteredSessions.map(session => {
        const sessionTime = session.time || "";
        const [startTimeStr, endTimeStr] = sessionTime.split(" - ");

        const startTime = new Date(startTimeStr);
        const endTime = new Date(endTimeStr);

       


        return {
            ...session,
            startTime: startTime,
            endTime: endTime
        };
    })
    // Sort sessions by start time (assuming session.startTime is a valid date string or timestamp)

filteredSessions.sort((a, b) => {
    const dateA = new Date(a.time.split(' - ')[0]);
    const dateB = new Date(b.time.split(' - ')[0]);

    console.log("Comparing sessions:");
    console.log("A:", a.time, "SessionCode:", a.SessionCode);
    console.log("B:", b.time, "SessionCode:", b.SessionCode);
    console.log("Parsed dates:", dateA, dateB);

    //  Sort by start time
    if (dateA.getTime() !== dateB.getTime()) {
        console.log("Sorting by start time:", dateA - dateB);
        return dateA - dateB; // Ascending order
    }

    //  If start times are the same, sort by SessionCode (number)
    const codeA = a.SessionCode !== null ? Number(a.SessionCode) : Infinity;
    const codeB = b.SessionCode !== null ? Number(b.SessionCode) : Infinity;

    console.log("Start times equal. Sorting by SessionCode:", codeA - codeB);

    return codeA - codeB; // Ascending order
});
    console.log( "sorted list ");
    console.log( filteredSessions);



    // Append filtered sessions to the table
    $tableBody.empty(); // Clear existing rows before appending





    const groupedSessions = {};

    // Group sessions by date
    filteredSessions.forEach(session => {
        if (!groupedSessions[session.date]) {
            groupedSessions[session.date] = [];
        }
        groupedSessions[session.date].push(session);
    });


    // Populate the table
    Object.keys(groupedSessions).forEach(date => {
        const dateObj = new Date(date);

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const longDate = dateObj.toLocaleDateString(language, options);
        $tableBody.append(`
            <tr class="bg-primary text-white">
                <td colspan="2" class="text-center fw-bold" style="background-color: #cce5ff; color: #004085; padding: 10px;">
                    ${longDate}
                </td>
            </tr>
        `);

        groupedSessions[date].forEach(session => {
            const price = session.complimentary === "true" ? 0 : session.price;

            // Language check
            const isFrench = language === "fr-Fr";

            // Localized title & description
            const sessionTitle = isFrench && session.SessionTitleFr
            ? session.SessionTitleFr
            : session.title;

            const sessionDescription = isFrench && session.SessionDescriptionFr
            ? session.SessionDescriptionFr
            : session.description;

            // Determine if the session is full
            const isFull = parseInt(session.RegistrationCount) >= parseInt(session.SessionMaxCapacity);

             // Decide what to display in the left column
             let buttonHTML;
             if (isFull) {
                // Show "Full" button styled the same as Add button but disabled
                buttonHTML = `<button type="button" class="btn btn-primary me-3" 
                 style="width: 130px !important;min-width: 130px !important; cursor: not-allowed;" disabled>{{ snippets['Application/ConferenceSelection/SoldOut'] }}</button>`;
            } else {
                // Otherwise, show normal Add/Remove button
                buttonHTML = `<button type="button" style="width: 130px !important;min-width: 130px !important;" class="btn btn-primary add-session me-3"
                data-session-id="${session.sessionId}">${addText}</button>`;
            }

            $tableBody.append(`
                <tr data-session-id="${session.sessionId}">
                 <td colspan="2">
                <div class="card mb-3">
                    <div class="card-body d-flex align-items-center">
                        ${buttonHTML}
                        <div class="flex-grow-1">

                       
                                
                                <!-- Right Side: Text Content -->
                                <div class="flex-grow-1">
                                <!---    <a href="javascript:void(0);" class="card-title mb-0 fs-6 text-decoration-none">
                                        
                                    </a> -->
                                 <!--   <i class="fas fa-info-circle ms-2" data-bs-toggle="tooltip" data-bs-placement="top"
                                        title="session.description" style="cursor: pointer;">
                                    </i> -->
                                    <p class="card-text mt-1 fs-6"><strong>${sessionTitle}</strong></p>
                                    <p class="card-text mt-1 fs-6"><strong>${sessionDescription}</strong></p>
                                    <p class="card-text mt-1 fs-6"><strong>${TimeTranslation}:</strong> ${removeLeadingZeroFromHoursRange(session.timeStr)}</p>
                                    <p class="card-text fs-6"><strong>${PriceTranslation}:</strong> $${price}</p>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>

            `);

        });
    });

    // Enable tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();

    // Initialize Bootstrap 5 tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));


    // Handle checkbox state change and populate #icd_sessionaddonselection 
    $(document).on('click', '.add-session', function () {
        const selectedSessions = new Set($('#icd_sessionaddonselection').val() ? JSON.parse($('#icd_sessionaddonselection').val()) : []);
        let allSelectedSessionsDetail = new Set();

        const button = $(this);
        const selectedSessionId = button.data("session-id");
        const SelectedSessionsDetail = filteredSessions.find(s => s.sessionId == selectedSessionId);

        if (!SelectedSessionsDetail) return;

        const SelectedSessionsstartTime = SelectedSessionsDetail.startTime ? new Date(SelectedSessionsDetail.startTime) : null;
        const SelectedSessionsEndTime = SelectedSessionsDetail.endTime ? new Date(SelectedSessionsDetail.endTime) : null;

        if (selectedSessions.has(selectedSessionId)) {
            // Remove session if already selected (toggle behavior)
            selectedSessions.delete(selectedSessionId);
            button.text(addText).removeClass("btn-secondary").addClass("btn-primary");
        } else {
            
            // Rebuild allSelectedSessionsDetail from selectedSessions
            allSelectedSessionsDetail = new Set(Array.from(selectedSessions).map(sessionId => {
                const sessionDetail = filteredSessions.find(s => s.sessionId == sessionId);
                return sessionDetail
                    ? JSON.stringify({ sessionId, startTime: new Date(sessionDetail.startTime), endTime: new Date(sessionDetail.endTime) })
                    : null;
            }).filter(s => s !== null)); // Remove null entries

            //console.log("All Selected Sessions Detail:", allSelectedSessionsDetail);
            allSelectedSessionsDetail.add(JSON.stringify({ sessionId: selectedSessionId, startTime: SelectedSessionsstartTime, endTime: SelectedSessionsEndTime }));
            //console.log("All Selected Sessions Detail:", allSelectedSessionsDetail);

            const filteredSessions2 = Array.from(allSelectedSessionsDetail).filter(session => {
                const parsedSession = JSON.parse(session);
                const sessionStartTime = new Date(parsedSession.startTime);
                const sessionEndTime = new Date(parsedSession.endTime);
                //console.log(`Start: ${sessionStartTime.toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}, End: ${sessionEndTime.toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}`);




                return (
                    (sessionStartTime >= SelectedSessionsstartTime && sessionStartTime <= SelectedSessionsEndTime) ||
                    (sessionEndTime >= SelectedSessionsstartTime && sessionEndTime <= SelectedSessionsEndTime)
                );
            });
            //console.log("Filtered Sessions:", filteredSessions2);

            if (filteredSessions2.length > 1) {
                // Show error message if a conflicting session is selected
                const row = button.closest('tr');
                row.find('.btn-secondary').remove();

                // Append error message
                const errorMessage = $(`<small class="text-danger" style="display:block;">${simultaneousSessionErrorMsg}</small>`);
                row.find('td .card-body .card-text').last().after(errorMessage);

                // Async function to remove error message after 3 seconds
                (async () => {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    errorMessage.fadeOut(300, function () { $(this).remove(); });
                })();
            } else {
                selectedSessions.add(selectedSessionId);
                button.text(removeText).removeClass("btn-primary").addClass("btn-secondary");
            }

        }

        $('#icd_sessionaddonselection').val(JSON.stringify([...selectedSessions]));
    });




    // Pre-check checkboxes if #icd_sessionaddonselection has stored data
    const selectedSessions = JSON.parse($('#icd_sessionaddonselection').val() || '[]');

    selectedSessions.forEach(sessionId => {

        const button = $(`[data-session-id="${sessionId}"].add-session`);

        if (button.length) {
            button.text(removeText).removeClass("btn-primary").addClass("btn-secondary");
        }
    });
}

function extractTimeZone(text) {
    if (text) {
        const match = text.match(/\((.*?)\)/);
        return match ? match[1] : null;
    }
    return null; // Return null if the text is null or undefined
}


//remove leading zeros from time
function removeLeadingZeroFromHoursRange(range) {
    const [start, end] = range.split(" - ");

    const [sh, sm] = start.split(":");
    const [eh, em] = end.split(":");

    const startHour = parseInt(sh, 10);  // removes leading zero
    const endHour = parseInt(eh, 10);    // removes leading zero

    return `${startHour}:${sm} - ${endHour}:${em}`;
}

// Run the filtering logic on page load
$(window).on('load', function () {



    filterSessions();
    // Run the filtering logic when the email field or conference type field changes
    $('#icd_conferencetype').on('change', function () {
        filterSessions();
    });
});