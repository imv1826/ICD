$(window).on('load', function () {
    console.log("Window On Load");

    const isFrench = window.location.pathname.toLowerCase().includes("/fr-fr/");
    const $quickView = $("div[data-name='GeneralTab']");

    const $eventNameEN = $quickView.find("#msevtmgt_name").closest("tr");
    const $eventNameFR = $quickView.find("#icd_eventnamefr").closest("tr");

    if (isFrench) {
        $eventNameEN.hide();
        $eventNameFR.show();
        $quickView.find("#icd_eventnamefr_label").text("Nom de l'événement (FR)");
    } else {
        $eventNameFR.hide();
        $eventNameEN.show();
    }
});