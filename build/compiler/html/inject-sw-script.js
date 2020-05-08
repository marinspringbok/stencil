import { generateServiceWorkerUrl } from '../service-worker/service-worker-util';
import { UNREGISTER_SW, getRegisterSW } from '../service-worker/generate-sw';
export const updateIndexHtmlServiceWorker = async (config, buildCtx, doc, outputTarget) => {
    const serviceWorker = outputTarget.serviceWorker;
    if (serviceWorker !== false) {
        if ((serviceWorker && serviceWorker.unregister) || (!serviceWorker && config.devMode)) {
            injectUnregisterServiceWorker(doc);
        }
        else if (serviceWorker) {
            await injectRegisterServiceWorker(buildCtx, outputTarget, doc);
        }
    }
};
const injectRegisterServiceWorker = async (buildCtx, outputTarget, doc) => {
    const swUrl = generateServiceWorkerUrl(outputTarget, outputTarget.serviceWorker);
    const serviceWorker = getRegisterSwScript(doc, buildCtx, swUrl);
    doc.body.appendChild(serviceWorker);
};
const injectUnregisterServiceWorker = (doc) => {
    const script = doc.createElement('script');
    script.innerHTML = UNREGISTER_SW;
    doc.body.appendChild(script);
};
const getRegisterSwScript = (doc, buildCtx, swUrl) => {
    const script = doc.createElement('script');
    script.setAttribute('data-build', `${buildCtx.timestamp}`);
    script.innerHTML = getRegisterSW(swUrl);
    return script;
};
