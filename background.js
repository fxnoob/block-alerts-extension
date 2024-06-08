chrome.webNavigation.onCommitted.addListener(async (details) => {
  if (details.frameId === 0) { // Ensure it's the main frame
    try {
      // Attach the debugger to the active tab
      await chrome.debugger.attach({ tabId: details.tabId }, "1.3");

      // Inject the script to override the alert function
      await chrome.debugger.sendCommand({ tabId: details.tabId }, "Runtime.evaluate", {
        expression: `
          (function() {
            window.alert = function(message) {
              console.log('Alert overridden:', message);
            };
          })();
        `
      });
      // Detach the debugger after injecting the script
      await chrome.debugger.detach({ tabId: details.tabId });
    } catch (error) {
      console.error('Error overriding alert:', error);
    }
  }
});
