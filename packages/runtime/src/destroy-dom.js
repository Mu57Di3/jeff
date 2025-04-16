/**
 * @file
 * Создан Bender 16.04.2025
 */
import {DOM_TYPES} from "./h.js";
import {removeEventListeners} from "./utils/events.js";

export function destroyDom(vdom) {
    const {type} = vdom;

    switch (type) {
        case DOM_TYPES.TEXT:
            removeTextNode(vdom);
            break;
        case DOM_TYPES.ELEMENT:
            removeElementNode(vdom);
            break;
        case DOM_TYPES.FRAGMENT:
            removeFragmentNodes(vdom);
            break;
        default:
            throw new Error(`Can't destroy DOM of type: ${type}`);
    }

    delete vdom.el;
}

function removeTextNode(vdom) {
    const {el} = vdom;
    el.remove();
}

function removeElementNode(vdom) {
    const {el, children, listeners} = vdom;

    el.remove();
    children.forEach(destroyDom);

    if (listeners) {
        removeEventListeners(listeners, el);
        delete vdom.listners;
    }
}

function removeFragmentNodes(vdom) {
    const {children} = vdom;
    children.forEach(destroyDom);
}
