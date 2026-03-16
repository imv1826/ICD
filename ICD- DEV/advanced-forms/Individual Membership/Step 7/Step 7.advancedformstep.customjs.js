$(document).ready(function () {
    var currentUrl = window.location.href;

 // Determine the language based on the URL
    var message = currentUrl.includes("en-US") 
        ? `Your detailed, itemized invoice will be available on the next page. 
           Please click the <strong>"Submit"</strong> button to proceed.`
        : `Votre facture détaillée et ventilée sera disponible sur la prochaine page. 
           Veuillez cliquer sur le bouton <strong>« Soumettre »</strong> pour continuer.`;

    // Append the message below the label
    $("label[for='Invoice_Subgrid_new_1']").after(`<br><p class="invoice-info" style="font-size: 14px;">${message}</p>`);
});