import { isString } from '@utils';
import { STENCIL_INTERNAL_CLIENT_ID } from '../bundle/entry-alias-ids';
import { parseImportPath } from '../transformers/stencil-import-path';
export const getCompileResults = (code, input) => {
    if (!isString(input.file)) {
        input.file = 'module.tsx';
    }
    const parsedImport = parseImportPath(input.file);
    const results = {
        code: typeof code === 'string' ? code : '',
        data: [],
        diagnostics: [],
        inputFileExtension: parsedImport.ext,
        inputFilePath: input.file,
        imports: [],
        map: null,
        outputFilePath: null,
    };
    return {
        importData: parsedImport.data,
        results,
    };
};
export const getCompileModuleConfig = (input) => {
    const compileOpts = {
        componentExport: getCompileConfigOpt(input.componentExport, VALID_EXPORT, 'customelement'),
        componentMetadata: getCompileConfigOpt(input.componentMetadata, VALID_METADATA, null),
        coreImportPath: isString(input.coreImportPath) ? input.coreImportPath : STENCIL_INTERNAL_CLIENT_ID,
        currentDirectory: isString(input.currentDirectory) ? input.currentDirectory : '/',
        file: input.file,
        proxy: getCompileConfigOpt(input.proxy, VALID_PROXY, 'defineproperty'),
        module: getCompileConfigOpt(input.module, VALID_MODULE, 'esm'),
        sourceMap: input.sourceMap === 'inline' ? 'inline' : input.sourceMap !== false,
        style: getCompileConfigOpt(input.style, VALID_STYLE, 'static'),
        target: getCompileConfigOpt(input.target || input.script /* deprecated */, VALID_TARGET, 'latest'),
        typescriptPath: input.typescriptPath,
    };
    const tsCompilerOptions = {
        // best we always set this to true
        allowSyntheticDefaultImports: true,
        // best we always set this to true
        esModuleInterop: true,
        // always get source maps
        sourceMap: compileOpts.sourceMap !== false,
        // isolated per file transpiling
        isolatedModules: true,
        // transpileModule does not write anything to disk so there is no need to verify that there are no conflicts between input and output paths.
        suppressOutputPathCheck: true,
        // Filename can be non-ts file.
        allowNonTsExtensions: true,
        // We are not returning a sourceFile for lib file when asked by the program,
        // so pass --noLib to avoid reporting a file not found error.
        noLib: true,
        noResolve: true,
    };
    if (isString(input.baseUrl)) {
        compileOpts.baseUrl = input.baseUrl;
        tsCompilerOptions.baseUrl = compileOpts.baseUrl;
    }
    if (input.paths) {
        compileOpts.paths = Object.assign({}, input.paths);
        tsCompilerOptions.paths = Object.assign({}, compileOpts.paths);
    }
    const transformOpts = {
        coreImportPath: compileOpts.coreImportPath,
        componentExport: compileOpts.componentExport,
        componentMetadata: compileOpts.componentMetadata,
        currentDirectory: compileOpts.currentDirectory,
        module: compileOpts.module,
        proxy: compileOpts.proxy,
        file: compileOpts.file,
        style: compileOpts.style,
        target: compileOpts.target,
    };
    const config = {
        cwd: compileOpts.currentDirectory,
        rootDir: compileOpts.currentDirectory,
        srcDir: compileOpts.currentDirectory,
        devMode: true,
        minifyCss: true,
        minifyJs: false,
        _isTesting: true,
        validateTypes: false,
        enableCache: false,
        sys: null,
        tsCompilerOptions,
    };
    return {
        compileOpts,
        config,
        transformOpts,
    };
};
export const getCompileCssConfig = (compileOpts, importData, results) => {
    const transformInput = {
        file: results.inputFilePath,
        input: results.code,
        tag: importData && importData.tag,
        encapsulation: importData && importData.encapsulation,
        mode: importData && importData.mode,
        sourceMap: compileOpts.sourceMap !== false,
        commentOriginalSelector: false,
        minify: false,
        autoprefixer: false,
        module: compileOpts.module,
    };
    return transformInput;
};
const getCompileConfigOpt = (value, validValues, defaultValue) => {
    if (value === null || value === 'null') {
        return null;
    }
    value = isString(value) ? value.toLowerCase().trim() : null;
    if (validValues.has(value)) {
        return value;
    }
    return defaultValue;
};
const VALID_EXPORT = new Set(['customelement', 'module']);
const VALID_METADATA = new Set(['compilerstatic', null]);
const VALID_MODULE = new Set(['cjs', 'esm']);
const VALID_PROXY = new Set(['defineproperty', null]);
const VALID_STYLE = new Set(['static']);
const VALID_TARGET = new Set(['latest', 'esnext', 'es2020', 'es2019', 'es2018', 'es2017', 'es2016', 'es2015', 'es5']);
