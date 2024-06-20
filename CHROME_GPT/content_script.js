document.addEventListener("DOMContentLoaded", function() {
    var scanTextButton = document.getElementById('scan_text');
    var textArea = document.getElementById('input');

    scanTextButton.addEventListener('click', function() {
        var textAreaValue = textArea.value;
        localStorage.setItem('textToSummarize', textAreaValue);
        window.location.replace("success.html");
    });
});


