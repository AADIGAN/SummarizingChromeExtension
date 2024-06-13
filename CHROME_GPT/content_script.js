// document.getElementById("scan_text").onclick = function(){

//     let tAndC= document.getElementById("input").value;


//     Summarize();
//     console.log(tAndC);

//     window.location.replace("success.html");

//  }





//function Summarize(prompt){

const apiKey = 'sk-proj-EaC5P99M4k6OefJ74iuZT3BlbkFJ1XPqithmHoAqAhsPzugo';
const apiUrl = "https://api.openai.com/v1/chat/completions";
 prompt    = "what is the capital of France?";

async function fetchSummary(prompt, retries = 5, delay = 2000) {
    try {
        console.log(`Sending request with delay: ${delay}ms`);
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: `Summarize the following text:\n\n${prompt}` }
                ],
                max_tokens: 1024,
                temperature: 0.5,
            }),
        });

        if (response.status === 429 && retries > 0) {
            console.warn('Rate limit exceeded, retrying...');
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchSummary(prompt, retries - 1, delay * 2);  // Exponential backoff
        }

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();

    } catch (error) {
        console.log(error);
        return null;
    }
}

fetchSummary(prompt).then(ans => {
    if (ans) {
        const div = document.createElement('div');
        div.innerText = ans;
        console.log(ans);

        // Set the CSS styles for the div
        div.style.width = "200px";
        div.style.color = "#333";
        div.style.padding = "20px";
        div.style.margin = "20px";
        div.style.borderRadius = "4px";
        div.style.position = "absolute";
        div.style.bottom = "0";
        div.style.right = "0";
        div.style.background = "white";
        div.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";  // Add a subtle shadow for better visibility

        // Add the div to the document body
        document.body.appendChild(div);
    }
});
//}