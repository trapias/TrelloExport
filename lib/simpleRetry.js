/*
 * Simple retry mechanism for Trello API errors
 * Monitors jQuery ajax for specific errors and provides automatic retry with exponential backoff
 */

(function() {
    console.log('[TrelloExport] Initializing retry handler for Trello API errors');
    
    // Track recent errors and retry attempts
    const errorTracker = {
        errors429: [],
        errors504: [],
        windowSize: 60000, // 1 minute
        retryQueue: new Map(), // Store requests to retry
        activeRetries: new Set() // Track active retry attempts
    };
    
    // Retry configuration
    const retryConfig = {
        maxRetries: 3,
        baseDelay: 1000, // Start with 1 second
        maxDelay: 30000, // Max 30 seconds
        backoffMultiplier: 2
    };
    
    // Clean old errors
    function cleanOldErrors() {
        const now = Date.now();
        errorTracker.errors429 = errorTracker.errors429.filter(time => now - time < errorTracker.windowSize);
        errorTracker.errors504 = errorTracker.errors504.filter(time => now - time < errorTracker.windowSize);
    }
    
    // Calculate retry delay with exponential backoff
    function calculateRetryDelay(retryCount, isRateLimit = false) {
        if (isRateLimit) {
            // For rate limits, use longer delays
            const baseDelay = 5000; // 5 seconds for rate limits
            return Math.min(baseDelay * Math.pow(2, retryCount), 60000); // Max 1 minute
        }
        return Math.min(retryConfig.baseDelay * Math.pow(retryConfig.backoffMultiplier, retryCount), retryConfig.maxDelay);
    }
    
    // Retry a failed request
    function retryRequest(ajaxSettings, retryCount = 0, originalError = null) {
        const requestKey = JSON.stringify({
            url: ajaxSettings.url,
            data: ajaxSettings.data
        });
        
        // Prevent duplicate retries
        if (errorTracker.activeRetries.has(requestKey)) {
            console.log('[TrelloExport] Request already being retried, skipping duplicate');
            return;
        }
        
        errorTracker.activeRetries.add(requestKey);
        
        const isRateLimit = originalError && originalError.status === 429;
        const delay = calculateRetryDelay(retryCount, isRateLimit);
        
        console.log(`[TrelloExport] Retrying request in ${delay}ms (attempt ${retryCount + 1}/${retryConfig.maxRetries})`);
        
        // Show retry notification
        const retryNotification = $.growl.notice({
            title: "Retrying Request",
            message: `Waiting ${Math.round(delay / 1000)} seconds before retry (attempt ${retryCount + 1}/${retryConfig.maxRetries})...`,
            duration: delay + 1000
        });
        
        setTimeout(function() {
            // Clone the original settings to avoid modifying them
            const retrySettings = $.extend(true, {}, ajaxSettings);
            
            // Add retry info to the request
            retrySettings.beforeSend = function(xhr) {
                xhr.setRequestHeader('X-Retry-Attempt', retryCount + 1);
                if (ajaxSettings.beforeSend) {
                    ajaxSettings.beforeSend(xhr);
                }
            };
            
            // Wrap success handler
            const originalSuccess = retrySettings.success;
            retrySettings.success = function(data, textStatus, jqXHR) {
                errorTracker.activeRetries.delete(requestKey);
                console.log('[TrelloExport] Retry successful');
                $.growl.notice({
                    title: "Success",
                    message: "Request completed successfully after retry",
                    duration: 3000
                });
                if (originalSuccess) {
                    originalSuccess(data, textStatus, jqXHR);
                }
            };
            
            // Wrap error handler
            const originalError = retrySettings.error;
            retrySettings.error = function(jqXHR, textStatus, errorThrown) {
                errorTracker.activeRetries.delete(requestKey);
                
                if ((jqXHR.status === 429 || jqXHR.status === 504) && retryCount < retryConfig.maxRetries - 1) {
                    // Retry again
                    retryRequest(ajaxSettings, retryCount + 1, jqXHR);
                } else {
                    // Max retries reached or different error
                    console.error('[TrelloExport] Max retries reached or non-retryable error');
                    if (originalError) {
                        originalError(jqXHR, textStatus, errorThrown);
                    }
                }
            };
            
            // Make the retry request
            $.ajax(retrySettings);
            
        }, delay);
    }
    
    // Monitor ajax errors
    $(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
        if (!ajaxSettings.url || !ajaxSettings.url.includes('trello.com/1/')) {
            return;
        }
        
        cleanOldErrors();
        
        // Check if this request should be retried
        const shouldRetry = (jqXHR.status === 429 || jqXHR.status === 504) && 
                          !ajaxSettings.isRetry && // Prevent infinite retry loops
                          !ajaxSettings.url.includes('batch'); // Don't retry batch requests
        
        if (jqXHR.status === 429) {
            // Rate limit error
            errorTracker.errors429.push(Date.now());
            console.error('[TrelloExport] Rate limit error (429) detected');
            
            if (shouldRetry) {
                // Automatically retry the request
                $.growl.warning({
                    title: "Rate Limit - Retrying",
                    message: "Too many requests to Trello. Automatically retrying with delay...",
                    duration: 5000
                });
                
                // Mark this as a retry to prevent loops
                ajaxSettings.isRetry = true;
                retryRequest(ajaxSettings, 0, jqXHR);
            } else {
                // Show error without retry
                $.growl.error({
                    title: "Rate Limit Reached",
                    message: "Too many requests to Trello. Please wait a moment and try again.",
                    duration: 10000,
                    fixed: true
                });
            }
            
            // If multiple 429 errors, suggest solutions
            if (errorTracker.errors429.length >= 3) {
                $.growl.warning({
                    title: "Tip",
                    message: "Try exporting fewer lists or cards at once, or wait a few minutes before trying again.",
                    duration: 15000
                });
            }
        } else if (jqXHR.status === 504 || (jqXHR.statusText === 'timeout' && ajaxSettings.timeout)) {
            // Timeout error
            errorTracker.errors504.push(Date.now());
            console.error('[TrelloExport] Timeout error (504) detected');
            
            if (shouldRetry) {
                // Automatically retry the request
                $.growl.warning({
                    title: "Timeout - Retrying",
                    message: "Request timed out. Automatically retrying...",
                    duration: 5000
                });
                
                // Mark this as a retry to prevent loops
                ajaxSettings.isRetry = true;
                retryRequest(ajaxSettings, 0, jqXHR);
            } else {
                $.growl.error({
                    title: "Request Timeout",
                    message: "The request took too long. This usually happens with large boards.",
                    duration: 10000,
                    fixed: true
                });
            }
            
            // If multiple timeouts, suggest solutions
            if (errorTracker.errors504.length >= 2) {
                $.growl.warning({
                    title: "Tip", 
                    message: "For large boards, try: 1) Export one list at a time, 2) Reduce the number of cards, or 3) Disable comments/attachments export.",
                    duration: 20000
                });
            }
        }
    });
    
    // Add adaptive delays between requests to prevent rate limiting
    let lastRequestTime = 0;
    let requestCount = 0;
    let requestWindowStart = Date.now();
    const requestWindow = 10000; // 10 seconds
    const maxRequestsPerWindow = 50; // Trello's typical rate limit
    
    $(document).ajaxSend(function(event, jqXHR, ajaxSettings) {
        if (!ajaxSettings.url || !ajaxSettings.url.includes('trello.com/1/')) {
            return;
        }
        
        const now = Date.now();
        
        // Reset counter if window expired
        if (now - requestWindowStart > requestWindow) {
            requestCount = 0;
            requestWindowStart = now;
        }
        
        requestCount++;
        
        // Calculate adaptive delay based on request rate
        let minDelay = 100; // Base delay
        
        // If we're approaching rate limit, increase delay
        if (requestCount > maxRequestsPerWindow * 0.7) {
            minDelay = 500; // Slow down significantly
        } else if (requestCount > maxRequestsPerWindow * 0.5) {
            minDelay = 200; // Moderate slowdown
        }
        
        const timeSinceLastRequest = now - lastRequestTime;
        
        if (timeSinceLastRequest < minDelay) {
            // Add a small delay using setTimeout to avoid blocking
            const delay = minDelay - timeSinceLastRequest;
            console.log(`[TrelloExport] Delaying request by ${delay}ms to prevent rate limiting`);
            
            // Use synchronous delay for simplicity (not ideal but works for this use case)
            const start = Date.now();
            while (Date.now() - start < delay) {
                // Small delay
            }
        }
        
        lastRequestTime = Date.now();
    });
    
    // Provide manual retry function
    window.TrelloExportRetry = function() {
        cleanOldErrors();
        errorTracker.errors429 = [];
        errorTracker.errors504 = [];
        
        $.growl.notice({
            title: "Ready to Retry",
            message: "Error counters reset. You can try exporting again.",
            duration: 3000
        });
    };
    
    console.log('[TrelloExport] Ready - monitoring for 429 and 504 errors');
})();