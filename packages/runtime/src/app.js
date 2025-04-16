/**
 * @file
 * Создан Bender 16.04.2025
 */
import {destroyDom} from "./destroy-dom.js";
import {mountDOM} from "./mount-dom.js";
import {Dispatcher} from "./utils/dispatcher";

export function createApp({state, view, reducers = {}}) {
    let parentEl = null;
    let vdom = null;

    const dispatcher = new Dispatcher();
    const subscriptions = [dispatcher.afterEveryCommand(renderApp)];

    function emit(eventName, payload) {
        dispatcher.dispatch(eventName, payload);
    }

    for (const actionName in reducers) {
        const reducer = reducers[actionName];
        const subs = dispatcher.subscribe(actionName, (payload) => {
            state = reducer(state, payload);
        });

        subscriptions.push(subs);
    }

    function renderApp() {
        if (vdom) {
            destroyDom(vdom)
        }

        vdom = view(state, emit);
        mountDOM(vdom, parentEl);
    }

    return {
        mount(_parentEl) {
            parentEl = _parentEl;
            renderApp();
        },

        unmount() {
            destroyDom(vdom);
            vdom = null;
            subscriptions.forEach((unsubscribe) => unsubscribe())
        }
    }
}



