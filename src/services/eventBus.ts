export type EventType =
    | 'user.login'
    | 'user.logout'
    | 'user.updated'
    | 'goal.created'
    | 'goal.updated'
    | 'goal.completed'
    | 'task.completed'
    | 'recognition.given'
    | 'policy.acknowledged'
    | 'department.created'
    | 'department.updated'
    | 'department.deleted'
    | 'position.created'
    | 'position.updated'
    | 'position.deleted';

type EventHandler<T = any> = (data: T) => void;

class EventBus {
    private handlers: Record<string, EventHandler[]> = {};

    /**
     * Subscribe to an event
     * @returns Unsubscribe function
     */
    subscribe<T = any>(event: EventType | string, handler: EventHandler<T>): () => void {
        if (!this.handlers[event]) {
            this.handlers[event] = [];
        }
        this.handlers[event].push(handler);

        return () => this.unsubscribe(event, handler);
    }

    /**
     * Unsubscribe handler from an event
     */
    unsubscribe(event: EventType | string, handler: EventHandler) {
        if (!this.handlers[event]) return;
        this.handlers[event] = this.handlers[event].filter(h => h !== handler);
    }

    /**
     * Publish an event with data
     */
    publish<T = any>(event: EventType | string, data: T) {
        // console.log(`[EventBus] Publishing: ${event}`, data);

        if (this.handlers[event]) {
            this.handlers[event].forEach(h => {
                try {
                    h(data);
                } catch (err) {
                    console.error(`[EventBus] Error in handler for ${event}:`, err);
                }
            });
        }

        // Wildcard handler for debugging or global logging
        if (this.handlers['*']) {
            this.handlers['*'].forEach(h => h({ event, data }));
        }
    }
}

export const eventBus = new EventBus();
