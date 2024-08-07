document.addEventListener("DOMContentLoaded", function() {
    var textAreaValue = localStorage.getItem('textToSummarize');
    if (textAreaValue) {
        Summarize(textAreaValue);
    }

    function Summarize(prompt) {
        const loader = document.querySelector('.loader');
        loader.classList.remove('loader--hidden');

        const apiKey = 'YOUR_API_KEY';
        const apiUrl = "https://api.openai.com/v1/chat/completions";

        async function fetchSummary(prompt, retries = 5, delay = 2000) {
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        messages: [
                            { role: 'system', content: 'You are an assistant that specializes in summarizing legal documents and identifying potential risks and concerning terms.' },
                            { role: 'user', content: `Summarize the following terms and conditions. Don't write anything else except: the risks for these terms and conditions and the ways the rights the user has incase the terms and conditions are violated. (seperate the risks and protection as 2 seperate headlines) in a list in HTML form. If you write anything else I will be sad:\n\n${prompt}` }
                        ],
                        max_tokens: 1024,
                        temperature: 0.5,
                    }),
                });

                if (response.status === 429 && retries > 0) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return fetchSummary(prompt, retries - 1, delay * 2);
                }

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();
                const summarizedRisks = data.choices[0].message.content.trim();
                const cleanSummarizedRisks = summarizedRisks.replace(/```html|```/g, ''); // Remove Markdown-style HTML tags
                displaySummarizedRisks(cleanSummarizedRisks);

            } catch (error) {
                console.log(error);
            }
        }

        function displaySummarizedRisks(risks) {
            const risksArray = risks.split('\n');
            const htmlString = risksArray.map(point => `<div>${point}</div>`).join('<br>');
            document.getElementById('output').innerHTML = htmlString;
            loader.classList.add('loader--hidden');
        }

        fetchSummary(prompt);
    }

    document.getElementById("summarize_again").addEventListener('click', function() {
        const loader = document.querySelector('.loader');
        loader.classList.remove('loader--hidden');
        setTimeout(() => {
            window.location.replace("index.html");
        }, 1000); // Adjust the delay as needed
    });

    document.getElementById("copy").addEventListener('click', function() {
        const risks = document.getElementById('output').innerText;
        navigator.clipboard.writeText(risks).then(function() {
            alert('Copied to clipboard');
        }, function() {
            alert('Failed to copy to clipboard');
        });
    });

    document.getElementById("download_txt").addEventListener('click', function() {
        const risks = document.getElementById('output').innerText;
        const blob = new Blob([risks], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'summary.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    });

    // Add the stylesheet and icon toggle functionality
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
