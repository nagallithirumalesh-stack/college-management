/**
 * Lightweight EventBus for Browser (No Node.js dependencies)
 */
class EventBus {
    constructor() {
        this.events = {};
    }

    /**
     * Subscribe to an event
     * @param {string} eventName 
     * @param {function} callback 
     */
    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    /**
     * Unsubscribe from an event
     * @param {string} eventName 
     * @param {function} callback 
     */
    off(eventName, callback) {
        if (!this.events[eventName]) return;
        this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
    }

    /**
     * Emit an event with data
     * @param {string} eventName 
     * @param {any} data 
     */
    emit(eventName, data) {
        if (!this.events[eventName]) return;
        this.events[eventName].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in EventBus listener for '${eventName}':`, error);
            }
        });
    }
}

const eventBus = new EventBus();
export default eventBus;
