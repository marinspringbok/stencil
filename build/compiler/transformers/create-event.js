import { CREATE_EVENT, RUNTIME_APIS, addCoreRuntimeApi } from './core-runtime-apis';
import ts from 'typescript';
export const addCreateEvents = (moduleFile, cmp) => {
    return cmp.events.map(ev => {
        addCoreRuntimeApi(moduleFile, RUNTIME_APIS.createEvent);
        return ts.createStatement(ts.createAssignment(ts.createPropertyAccess(ts.createThis(), ts.createIdentifier(ev.method)), ts.createCall(ts.createIdentifier(CREATE_EVENT), undefined, [ts.createThis(), ts.createLiteral(ev.name), ts.createLiteral(computeFlags(ev))])));
    });
};
const computeFlags = (eventMeta) => {
    let flags = 0;
    if (eventMeta.bubbles) {
        flags |= 4 /* Bubbles */;
    }
    if (eventMeta.composed) {
        flags |= 2 /* Composed */;
    }
    if (eventMeta.cancelable) {
        flags |= 1 /* Cancellable */;
    }
    return flags;
};
