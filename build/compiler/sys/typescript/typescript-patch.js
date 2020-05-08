import { hasError } from '@utils';
import { loadTypescript, loadTypescriptSync } from './typescript-load';
import { patchTypeScriptResolveModule } from './typescript-resolve-module';
import { patchTypeScriptSys, patchTypeScriptGetParsedCommandLineOfConfigFile } from './typescript-sys';
import ts from 'typescript';
export const patchTypescript = async (config, diagnostics, inMemoryFs) => {
    // dynamically load the typescript dependency
    const loadedTs = await loadTypescript(config.sys, diagnostics, config.typescriptPath);
    patchTypescriptModule(config, diagnostics, inMemoryFs, loadedTs);
};
export const patchTypescriptSync = (config, diagnostics, inMemoryFs) => {
    const loadedTs = loadTypescriptSync(config.sys, diagnostics, config.typescriptPath);
    patchTypescriptModule(config, diagnostics, inMemoryFs, loadedTs);
};
const patchTypescriptModule = async (config, diagnostics, inMemoryFs, loadedTs) => {
    if (loadedTs && !hasError(diagnostics)) {
        // override some properties on the original imported ts object
        patchTypeScriptSys(loadedTs, config, inMemoryFs);
        patchTypeScriptResolveModule(loadedTs, config, inMemoryFs);
        patchTypeScriptGetParsedCommandLineOfConfigFile(loadedTs, config);
        // the ts object you see imported here is actually a bogus {} object right now
        // so assign the loaded ts object to our project's imported "ts" object
        // our "ts" object is the one the rest of the compiler imports and uses
        Object.assign(ts, loadedTs);
    }
};
