import { loadTypeScriptDiagnostics, hasError } from '@utils';
import { loadTypescript } from '../sys/typescript/typescript-load';
export const transpileToEs5 = async (input, inlineHelpers) => {
    const diagnostics = [];
    const ts = await loadTypescript(null, diagnostics, null);
    const results = {
        sourceFilePath: null,
        code: input,
        map: null,
        diagnostics: diagnostics,
        moduleFile: null,
        build: {},
    };
    if (hasError(diagnostics)) {
        return results;
    }
    const transpileOpts = {
        compilerOptions: {
            sourceMap: false,
            allowJs: true,
            declaration: false,
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.ESNext,
            removeComments: false,
            isolatedModules: true,
            skipLibCheck: true,
            noEmitHelpers: !inlineHelpers,
            importHelpers: !inlineHelpers,
        },
    };
    const tsResults = ts.transpileModule(input, transpileOpts);
    results.diagnostics.push(...loadTypeScriptDiagnostics(tsResults.diagnostics));
    results.code = tsResults.outputText;
    return results;
};
