document.addEventListener("DOMContentLoaded", function() {
    var textAreaValue = localStorage.getItem('textToSummarize');
    if (textAreaValue) {
        Summarize(textAreaValue);
    }

    function Summarize(prompt) {
        const loader = document.querySelector('.loader');
        loader.classList.remove('loader--hidden');

        const apiKey = 'your-api-key-here';
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
                            { role: 'user', content: `Summarize the following terms and conditions. Don't write anything else except the risks for these terms and conditions in a list in HTML form. If you write anything else I will be sad:\n\n${prompt}` }
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
        window.location.replace("index.html");
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
});
