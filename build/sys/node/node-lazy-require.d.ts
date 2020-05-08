import * as d from '../../declarations';
import { NodeResolveModule } from './node-resolve-module';
export declare class NodeLazyRequire implements d.LazyRequire {
    private nodeResolveModule;
    private lazyDependencies;
    private moduleData;
    constructor(nodeResolveModule: NodeResolveModule, lazyDependencies: {
        [dep: string]: [string, string];
    });
    ensure(logger: d.Logger, fromDir: string, ensureModuleIds: string[]): Promise<void>;
    require(moduleId: string): any;
    getModulePath(moduleId: string): string;
}
