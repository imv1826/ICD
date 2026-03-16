$(document).ready(function () {
    // Detect both English and French success messages (even if hidden)
    let msgFound = $(".alert-success").filter(function () {
      const text = $(this).text().trim();
     return text === "Submission completed successfully." || text === "L'envoi a réussi.";
    }).length > 0;

    if (msgFound) {
      console.log("✅ Success message detected (hidden), replacing with custom modal...");

      // Localized message
      let message = window.location.href.includes("fr-Fr")
           ? "Soumission complétée avec succès."
        : "Submission completed successfully.";

      // Append modal to the body
      $("body").append(`
        <div class="modal fade" id="alertModal" tabindex="-1" style="z-index:1056 !important" aria-labelledby="alertModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="alertModalLabel">Message</h5>
              </div>
              <div class="modal-body">
                <span class="text-danger">${message}</span>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn custom-close-btn" data-bs-dismiss="modal" aria-label="Close">{{ snippets['RefundModal/CloseButton'] }}</button>
              </div>
            </div>
          </div>
        </div>
      `);

      // Add custom styles for close button
      $("<style>")
        .prop("type", "text/css")
        .html(`
          .custom-close-btn {
            background-color: #f26649;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
          }
          .custom-close-btn:hover {
            background-color: #d9534f;
          }
        `)
        .appendTo("head");

      // Show the modal
      $("#alertModal").modal('show');
    } else {
      console.log("⚠️ No success message found.");
    }
  });