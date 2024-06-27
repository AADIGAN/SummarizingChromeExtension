chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "summarize",
      title: "Summarize Terms and Conditions",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "summarize") {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: summarizeSelection,
        args: [info.selectionText]
      });
    }
  });
  
  function summarizeSelection(selectedText) {
    const apiKey = 'API key here';
    const apiUrl = "https://api.openai.com/v1/chat/completions";
  
    async function fetchSummary(prompt) {
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
              { role: 'user', content: `Summarize the following terms and conditions, focusing on the risks and concerning terms:\n\n${prompt}` }
            ],
            max_tokens: 1024,
            temperature: 0.5,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const data = await response.json();
        const summarizedRisks = data.choices[0].message.content.trim();
  
        alert(summarizedRisks); // For simplicity, just show the summary in an alert
      } catch (error) {
        console.error(error);
      }
    }
  
    fetchSummary(selectedText);
  }
  