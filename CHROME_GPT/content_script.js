document.addEventListener("DOMContentLoaded", function() {
    var scanTextButton = document.getElementById('scan_text');
    var textArea = document.getElementById('input');

    scanTextButton.addEventListener('click', function() {
        var textAreaValue = textArea.value;
        localStorage.setItem('textToSummarize', textAreaValue);
        window.location.replace("success.html");
    });
    

    var mode = document.getElementById('mode');
    var stylesheet = document.getElementById('styles');

    // Retrieve the saved stylesheet and icon from Chrome storage
    chrome.storage.sync.get(['stylesheet', 'icon'], function(data) {
        if (data.stylesheet) {
            stylesheet.setAttribute('href', data.stylesheet);
        }
        if (data.icon) {
            mode.innerText = data.icon;
        }
    });

    mode.addEventListener('click', function() {
        var newStylesheet = stylesheet.getAttribute('href') === 'styles_lightmode.css' ? 'styles.css' : 'styles_lightmode.css';
        var newIcon = newStylesheet === 'styles_lightmode.css' ? '🌙' : '☀️';
        stylesheet.setAttribute('href', newStylesheet);
        mode.innerText = newIcon;

        // Save the current stylesheet and icon to Chrome storage
        chrome.storage.sync.set({
            stylesheet: newStylesheet,
            icon: newIcon
        }, function() {
            console.log('Stylesheet and icon saved as', newStylesheet, newIcon);
        });
    });

});








