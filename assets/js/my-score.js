$(document).ready(function() {
    // Initialize year picker
    const currentYear = new Date().getFullYear();
    const yearPickerElement = $('#academic-year-picker');

    // Set initial display value
    updateYearPickerDisplay(currentYear);

    // Initialize bootstrap datepicker with year view
    yearPickerElement.datepicker({
        format: 'yyyy',
        startView: 2, // Start with year view
        minViewMode: 'years',
        autoclose: true,
        startDate: new Date(currentYear - 10, 0, 1), // Allow 10 years back
        endDate: new Date(currentYear + 10, 11, 31)   // Allow 10 years forward
    }).on('hide', function(e) {
        // Trigger when datepicker hides
        setTimeout(function() {
            const rawValue = yearPickerElement.val();
            if (rawValue && rawValue.match(/^\d{4}$/)) {
                const year = parseInt(rawValue);
                updateYearPickerDisplay(year);
            }
        }, 0);
    });

    // Function to update display value with format YYYY-YYYY+1
    function updateYearPickerDisplay(year) {
        const nextYear = year + 1;
        const displayText = `${year}-${nextYear}`;
        yearPickerElement.val(displayText);
    }
});
