// ==================== BRIDGE API ====================
// Single communication channel for all JS ↔ Swift interactions

// Store for pending requests
const pendingRequests = new Map();

// Helper to send messages and wait for response
function callNativeAPI(method, params = {}) {
    return new Promise((resolve, reject) => {
        const requestId = 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        pendingRequests.set(requestId, { resolve, reject });
        
        // Swift path
        if (window.webkit?.messageHandlers?.nativeBridge) {
            window.webkit.messageHandlers.nativeBridge.postMessage({
                type: method,
                payload: JSON.stringify(params),
                requestId: requestId
            });
        }
        // Web/Android/iOS fallback path
        else {
            console.log(`[Web Mode] ${method} called with: ${JSON.stringify(params)}`);
            setTimeout(() => {
                handleDummyResponse(method, params)
                    .then(result => resolve(result))
                    .catch(err => reject(err));
            }, 300);
        }
    });
}

// Handle responses from Swift (must be global)
window.onNativeResponse = function(response) {
    try {
        // Parse string response
        const data = typeof response === 'string' ? JSON.parse(response) : response;
        const { requestId, success, result, error } = data;
        
        const pending = pendingRequests.get(requestId);
        if (!pending) {
            console.warn('No pending request for ID:', requestId);
            return;
        }
        
        pendingRequests.delete(requestId);
        
        if (success) {
            pending.resolve(JSON.parse(result || '{}'));
        } else {
            pending.reject(new Error(error || 'Unknown error'));
        }
    } catch (e) {
        console.error('Response parse error:', e, 'Raw:', response);
        // Clean up pending request on error
        pendingRequests.forEach((p, id) => {
            if (response.includes(id)) {
                p.reject(new Error('Parse error'));
                pendingRequests.delete(id);
            }
        });
    }
};
// ==================== PUBLIC API ====================
// This is what your HTML calls - ALL methods go through here

const selectDateCache = new Map();

const API = {
    
    setDoctor: function(doctorData) {
        currentDoctor = doctorData;
        console.log('✅ Doctor data received:', doctorData);
        // Update header immediately if DOM is ready
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            updateHeaderTitle();
        }
        return true; // CRITICAL: Return value for WebKit
    },

    queryPatient: (query) => callNativeAPI('queryPatient', { query }),

    selectDate: (from, to) => {
        const key = `${from}-${to}`;

        if (selectDateCache.has(key)) {
            console.log('Returning cached selectDate for key: ' + key);
            return selectDateCache.get(key);
        }

        console.log('Sending new selectDate request for key: ' + key);
        const promise = callNativeAPI('selectDate', { from, to });
        selectDateCache.set(key, promise);

        promise.finally(() => {
            selectDateCache.delete(key);
        });

        return promise;
    },
    
    saveAppointment: (data) => callNativeAPI('saveAppointment', data),
    
    editAppointment: (data) => callNativeAPI('editAppointment', data),
    
    deleteAppointment: (appointmentId) => callNativeAPI('deleteAppointment', { appointmentId }),
    
};
