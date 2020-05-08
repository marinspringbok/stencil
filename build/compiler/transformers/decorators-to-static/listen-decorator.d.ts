import * as d from '../../../declarations';
import ts from 'typescript';
export declare const listenDecoratorsToStatic: (diagnostics: d.Diagnostic[], decoratedMembers: ts.ClassElement[], newMembers: ts.ClassElement[]) => void;
export declare const parseListener: (diagnostics: d.Diagnostic[], eventName: string, opts: d.ListenOptions, methodName: string, decoratorNode: ts.Decorator) => d.ComponentCompilerListener;
export declare const isValidTargetValue: (prefix: string) => prefix is d.ListenTargetOptions;
export declare const isValidKeycodeSuffix: (prefix: string) => boolean;
