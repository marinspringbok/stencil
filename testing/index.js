'use strict';

function _lazyRequire(moduleId) {
  return new Proxy(
    {},
    {
      get(_target, propertyKey) {
        const importedModule = require(moduleId);
        return Reflect.get(importedModule, propertyKey);
      },
      set(_target, propertyKey, value) {
        const importedModule = require(moduleId);
        return Reflect.set(importedModule, propertyKey, value);
      },
    },
  );
}

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const vm$1 = _interopDefault(require('vm'));
const fs$1 = _interopDefault(require('fs'));
const path$1 = require('path');
const path$1__default = _interopDefault(path$1);
const util$3 = _interopDefault(require('util'));
const tty$1 = _interopDefault(require('tty'));
const net$1 = _interopDefault(require('net'));
const url$1 = require('url');
const url$1__default = _interopDefault(url$1);
const constants$1 = _interopDefault(require('constants'));
const stream$1 = _interopDefault(require('stream'));
const assert$1 = _interopDefault(require('assert'));
const console$2 = _interopDefault(require('console'));
const process$2 = _interopDefault(require('process'));
const index_js = _lazyRequire('../dev-server/index.js');
const stencil_js = require('../compiler/stencil.js');
const ts = _interopDefault(require('typescript'));
const appData = _lazyRequire('@stencil/core/internal/app-data');
const index_js$1 = _lazyRequire('../mock-doc/index.js');
const testing = _lazyRequire('@stencil/core/internal/testing');
const crypto$2 = require('crypto');
const child_process$1 = require('child_process');

async function startPuppeteerBrowser(config) {
    if (!config.flags.e2e) {
        return null;
    }
    const env = process.env;
    const puppeteerDep = config.testing.browserExecutablePath ? 'puppeteer-core' : 'puppeteer';
    const puppeteerModulePath = config.sys.lazyRequire.getModulePath(puppeteerDep);
    const puppeteer = require(puppeteerModulePath);
    env.__STENCIL_PUPPETEER_MODULE__ = puppeteerModulePath;
    env.__STENCIL_BROWSER_WAIT_UNTIL = config.testing.browserWaitUntil;
    if (config.flags.devtools) {
        config.testing.browserDevtools = true;
        config.testing.browserHeadless = false;
        env.__STENCIL_E2E_DEVTOOLS__ = 'true';
    }
    config.logger.debug(`puppeteer: ${puppeteerModulePath}`);
    config.logger.debug(`puppeteer headless: ${config.testing.browserHeadless}`);
    if (Array.isArray(config.testing.browserArgs)) {
        config.logger.debug(`puppeteer args: ${config.testing.browserArgs.join(' ')}`);
    }
    if (typeof config.testing.browserDevtools === 'boolean') {
        config.logger.debug(`puppeteer devtools: ${config.testing.browserDevtools}`);
    }
    if (typeof config.testing.browserSlowMo === 'number') {
        config.logger.debug(`puppeteer slowMo: ${config.testing.browserSlowMo}`);
    }
    const launchOpts = {
        ignoreHTTPSErrors: true,
        args: config.testing.browserArgs,
        headless: config.testing.browserHeadless,
        devtools: config.testing.browserDevtools,
        slowMo: config.testing.browserSlowMo,
    };
    if (config.testing.browserExecutablePath) {
        launchOpts.executablePath = config.testing.browserExecutablePath;
    }
    const browser = await (config.testing.browserWSEndpoint
        ? puppeteer.connect(Object.assign(Object.assign({}, launchOpts), { browserWSEndpoint: config.testing.browserWSEndpoint }))
        : puppeteer.launch(Object.assign({}, launchOpts)));
    env.__STENCIL_BROWSER_WS_ENDPOINT__ = browser.wsEndpoint();
    config.logger.debug(`puppeteer browser wsEndpoint: ${env.__STENCIL_BROWSER_WS_ENDPOINT__}`);
    return browser;
}
async function connectBrowser() {
    // the reason we're connecting to the browser from
    // a web socket is because jest probably has us
    // in a different thread, this is also why this
    // uses process.env for data
    const env = process.env;
    const wsEndpoint = env.__STENCIL_BROWSER_WS_ENDPOINT__;
    if (!wsEndpoint) {
        return null;
    }
    const connectOpts = {
        browserWSEndpoint: wsEndpoint,
        ignoreHTTPSErrors: true,
    };
    const puppeteer = require(env.__STENCIL_PUPPETEER_MODULE__);
    return await puppeteer.connect(connectOpts);
}
async function disconnectBrowser(browser) {
    if (browser) {
        try {
            browser.disconnect();
        }
        catch (e) { }
    }
}
function newBrowserPage(browser) {
    return browser.newPage();
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function getCjsExportFromNamespace (n) {
	return n && n['default'] || n;
}

var build = createCommonjsModule(function (module) {

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Possible types of a MockFunctionResult.
 * 'return': The call completed by returning normally.
 * 'throw': The call completed by throwing a value.
 * 'incomplete': The call has not completed yet. This is possible if you read
 *               the  mock function result from within the mock function itself
 *               (or a function called by the mock function).
 */

/**
 * Represents the result of a single call to a mock function.
 */
// see https://github.com/Microsoft/TypeScript/issues/25215
const MOCK_CONSTRUCTOR_NAME = 'mockConstructor';
const FUNCTION_NAME_RESERVED_PATTERN = /[\s!-\/:-@\[-`{-~]/;
const FUNCTION_NAME_RESERVED_REPLACE = new RegExp(
  FUNCTION_NAME_RESERVED_PATTERN.source,
  'g'
);
const RESERVED_KEYWORDS = new Set([
  'arguments',
  'await',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'else',
  'enum',
  'eval',
  'export',
  'extends',
  'false',
  'finally',
  'for',
  'function',
  'if',
  'implements',
  'import',
  'in',
  'instanceof',
  'interface',
  'let',
  'new',
  'null',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'static',
  'super',
  'switch',
  'this',
  'throw',
  'true',
  'try',
  'typeof',
  'var',
  'void',
  'while',
  'with',
  'yield'
]);

function matchArity(fn, length) {
  let mockConstructor;

  switch (length) {
    case 1:
      mockConstructor = function mockConstructor(_a) {
        return fn.apply(this, arguments);
      };

      break;

    case 2:
      mockConstructor = function mockConstructor(_a, _b) {
        return fn.apply(this, arguments);
      };

      break;

    case 3:
      mockConstructor = function mockConstructor(_a, _b, _c) {
        return fn.apply(this, arguments);
      };

      break;

    case 4:
      mockConstructor = function mockConstructor(_a, _b, _c, _d) {
        return fn.apply(this, arguments);
      };

      break;

    case 5:
      mockConstructor = function mockConstructor(_a, _b, _c, _d, _e) {
        return fn.apply(this, arguments);
      };

      break;

    case 6:
      mockConstructor = function mockConstructor(_a, _b, _c, _d, _e, _f) {
        return fn.apply(this, arguments);
      };

      break;

    case 7:
      mockConstructor = function mockConstructor(_a, _b, _c, _d, _e, _f, _g) {
        return fn.apply(this, arguments);
      };

      break;

    case 8:
      mockConstructor = function mockConstructor(
        _a,
        _b,
        _c,
        _d,
        _e,
        _f,
        _g,
        _h
      ) {
        return fn.apply(this, arguments);
      };

      break;

    case 9:
      mockConstructor = function mockConstructor(
        _a,
        _b,
        _c,
        _d,
        _e,
        _f,
        _g,
        _h,
        _i
      ) {
        return fn.apply(this, arguments);
      };

      break;

    default:
      mockConstructor = function mockConstructor() {
        return fn.apply(this, arguments);
      };

      break;
  }

  return mockConstructor;
}

function getObjectType(value) {
  return Object.prototype.toString.apply(value).slice(8, -1);
}

function getType(ref) {
  const typeName = getObjectType(ref);

  if (
    typeName === 'Function' ||
    typeName === 'AsyncFunction' ||
    typeName === 'GeneratorFunction'
  ) {
    return 'function';
  } else if (Array.isArray(ref)) {
    return 'array';
  } else if (typeName === 'Object') {
    return 'object';
  } else if (
    typeName === 'Number' ||
    typeName === 'String' ||
    typeName === 'Boolean' ||
    typeName === 'Symbol'
  ) {
    return 'constant';
  } else if (
    typeName === 'Map' ||
    typeName === 'WeakMap' ||
    typeName === 'Set'
  ) {
    return 'collection';
  } else if (typeName === 'RegExp') {
    return 'regexp';
  } else if (ref === undefined) {
    return 'undefined';
  } else if (ref === null) {
    return 'null';
  } else {
    return null;
  }
}

function isReadonlyProp(object, prop) {
  if (
    prop === 'arguments' ||
    prop === 'caller' ||
    prop === 'callee' ||
    prop === 'name' ||
    prop === 'length'
  ) {
    const typeName = getObjectType(object);
    return (
      typeName === 'Function' ||
      typeName === 'AsyncFunction' ||
      typeName === 'GeneratorFunction'
    );
  }

  if (
    prop === 'source' ||
    prop === 'global' ||
    prop === 'ignoreCase' ||
    prop === 'multiline'
  ) {
    return getObjectType(object) === 'RegExp';
  }

  return false;
}

class ModuleMockerClass {
  /**
   * @see README.md
   * @param global Global object of the test environment, used to create
   * mocks
   */
  constructor(global) {
    _defineProperty(this, '_environmentGlobal', void 0);

    _defineProperty(this, '_mockState', void 0);

    _defineProperty(this, '_mockConfigRegistry', void 0);

    _defineProperty(this, '_spyState', void 0);

    _defineProperty(this, '_invocationCallCounter', void 0);

    _defineProperty(this, 'ModuleMocker', void 0);

    this._environmentGlobal = global;
    this._mockState = new WeakMap();
    this._mockConfigRegistry = new WeakMap();
    this._spyState = new Set();
    this.ModuleMocker = ModuleMockerClass;
    this._invocationCallCounter = 1;
  }

  _getSlots(object) {
    if (!object) {
      return [];
    }

    const slots = new Set();
    const EnvObjectProto = this._environmentGlobal.Object.prototype;
    const EnvFunctionProto = this._environmentGlobal.Function.prototype;
    const EnvRegExpProto = this._environmentGlobal.RegExp.prototype; // Also check the builtins in the current context as they leak through
    // core node modules.

    const ObjectProto = Object.prototype;
    const FunctionProto = Function.prototype;
    const RegExpProto = RegExp.prototype; // Properties of Object.prototype, Function.prototype and RegExp.prototype
    // are never reported as slots

    while (
      object != null &&
      object !== EnvObjectProto &&
      object !== EnvFunctionProto &&
      object !== EnvRegExpProto &&
      object !== ObjectProto &&
      object !== FunctionProto &&
      object !== RegExpProto
    ) {
      const ownNames = Object.getOwnPropertyNames(object);

      for (let i = 0; i < ownNames.length; i++) {
        const prop = ownNames[i];

        if (!isReadonlyProp(object, prop)) {
          const propDesc = Object.getOwnPropertyDescriptor(object, prop); // @ts-ignore Object.__esModule

          if ((propDesc !== undefined && !propDesc.get) || object.__esModule) {
            slots.add(prop);
          }
        }
      }

      object = Object.getPrototypeOf(object);
    }

    return Array.from(slots);
  }

  _ensureMockConfig(f) {
    let config = this._mockConfigRegistry.get(f);

    if (!config) {
      config = this._defaultMockConfig();

      this._mockConfigRegistry.set(f, config);
    }

    return config;
  }

  _ensureMockState(f) {
    let state = this._mockState.get(f);

    if (!state) {
      state = this._defaultMockState();

      this._mockState.set(f, state);
    }

    return state;
  }

  _defaultMockConfig() {
    return {
      defaultReturnValue: undefined,
      isReturnValueLastSet: false,
      mockImpl: undefined,
      mockName: 'jest.fn()',
      specificMockImpls: [],
      specificReturnValues: []
    };
  }

  _defaultMockState() {
    return {
      calls: [],
      instances: [],
      invocationCallOrder: [],
      results: []
    };
  }

  _makeComponent(metadata, restore) {
    if (metadata.type === 'object') {
      return new this._environmentGlobal.Object();
    } else if (metadata.type === 'array') {
      return new this._environmentGlobal.Array();
    } else if (metadata.type === 'regexp') {
      return new this._environmentGlobal.RegExp('');
    } else if (
      metadata.type === 'constant' ||
      metadata.type === 'collection' ||
      metadata.type === 'null' ||
      metadata.type === 'undefined'
    ) {
      return metadata.value;
    } else if (metadata.type === 'function') {
      const prototype =
        (metadata.members &&
          metadata.members.prototype &&
          metadata.members.prototype.members) ||
        {};

      const prototypeSlots = this._getSlots(prototype);

      const mocker = this;
      const mockConstructor = matchArity(function(...args) {
        const mockState = mocker._ensureMockState(f);

        const mockConfig = mocker._ensureMockConfig(f);

        mockState.instances.push(this);
        mockState.calls.push(args); // Create and record an "incomplete" mock result immediately upon
        // calling rather than waiting for the mock to return. This avoids
        // issues caused by recursion where results can be recorded in the
        // wrong order.

        const mockResult = {
          type: 'incomplete',
          value: undefined
        };
        mockState.results.push(mockResult);
        mockState.invocationCallOrder.push(mocker._invocationCallCounter++); // Will be set to the return value of the mock if an error is not thrown

        let finalReturnValue; // Will be set to the error that is thrown by the mock (if it throws)

        let thrownError; // Will be set to true if the mock throws an error. The presence of a
        // value in `thrownError` is not a 100% reliable indicator because a
        // function could throw a value of undefined.

        let callDidThrowError = false;

        try {
          // The bulk of the implementation is wrapped in an immediately
          // executed arrow function so the return value of the mock function
          // can be easily captured and recorded, despite the many separate
          // return points within the logic.
          finalReturnValue = (() => {
            if (this instanceof f) {
              // This is probably being called as a constructor
              prototypeSlots.forEach(slot => {
                // Copy prototype methods to the instance to make
                // it easier to interact with mock instance call and
                // return values
                if (prototype[slot].type === 'function') {
                  // @ts-ignore no index signature
                  const protoImpl = this[slot]; // @ts-ignore no index signature

                  this[slot] = mocker.generateFromMetadata(prototype[slot]); // @ts-ignore no index signature

                  this[slot]._protoImpl = protoImpl;
                }
              }); // Run the mock constructor implementation

              const mockImpl = mockConfig.specificMockImpls.length
                ? mockConfig.specificMockImpls.shift()
                : mockConfig.mockImpl;
              return mockImpl && mockImpl.apply(this, arguments);
            }

            const returnValue = mockConfig.defaultReturnValue; // If return value is last set, either specific or default, i.e.
            // mockReturnValueOnce()/mockReturnValue() is called and no
            // mockImplementationOnce()/mockImplementation() is called after
            // that.
            // use the set return value.

            if (mockConfig.specificReturnValues.length) {
              return mockConfig.specificReturnValues.shift();
            }

            if (mockConfig.isReturnValueLastSet) {
              return mockConfig.defaultReturnValue;
            } // If mockImplementationOnce()/mockImplementation() is last set,
            // or specific return values are used up, use the mock
            // implementation.

            let specificMockImpl;

            if (returnValue === undefined) {
              specificMockImpl = mockConfig.specificMockImpls.shift();

              if (specificMockImpl === undefined) {
                specificMockImpl = mockConfig.mockImpl;
              }

              if (specificMockImpl) {
                return specificMockImpl.apply(this, arguments);
              }
            } // Otherwise use prototype implementation

            if (returnValue === undefined && f._protoImpl) {
              return f._protoImpl.apply(this, arguments);
            }

            return returnValue;
          })();
        } catch (error) {
          // Store the thrown error so we can record it, then re-throw it.
          thrownError = error;
          callDidThrowError = true;
          throw error;
        } finally {
          // Record the result of the function.
          // NOTE: Intentionally NOT pushing/indexing into the array of mock
          //       results here to avoid corrupting results data if mockClear()
          //       is called during the execution of the mock.
          mockResult.type = callDidThrowError ? 'throw' : 'return';
          mockResult.value = callDidThrowError ? thrownError : finalReturnValue;
        }

        return finalReturnValue;
      }, metadata.length || 0);

      const f = this._createMockFunction(metadata, mockConstructor);

      f._isMockFunction = true;

      f.getMockImplementation = () => this._ensureMockConfig(f).mockImpl;

      if (typeof restore === 'function') {
        this._spyState.add(restore);
      }

      this._mockState.set(f, this._defaultMockState());

      this._mockConfigRegistry.set(f, this._defaultMockConfig());

      Object.defineProperty(f, 'mock', {
        configurable: false,
        enumerable: true,
        get: () => this._ensureMockState(f),
        set: val => this._mockState.set(f, val)
      });

      f.mockClear = () => {
        this._mockState.delete(f);

        return f;
      };

      f.mockReset = () => {
        f.mockClear();

        this._mockConfigRegistry.delete(f);

        return f;
      };

      f.mockRestore = () => {
        f.mockReset();
        return restore ? restore() : undefined;
      };

      f.mockReturnValueOnce = value => {
        // next function call will return this value or default return value
        const mockConfig = this._ensureMockConfig(f);

        mockConfig.specificReturnValues.push(value);
        return f;
      };

      f.mockResolvedValueOnce = value =>
        f.mockImplementationOnce(() => Promise.resolve(value));

      f.mockRejectedValueOnce = value =>
        f.mockImplementationOnce(() => Promise.reject(value));

      f.mockReturnValue = value => {
        // next function call will return specified return value or this one
        const mockConfig = this._ensureMockConfig(f);

        mockConfig.isReturnValueLastSet = true;
        mockConfig.defaultReturnValue = value;
        return f;
      };

      f.mockResolvedValue = value =>
        f.mockImplementation(() => Promise.resolve(value));

      f.mockRejectedValue = value =>
        f.mockImplementation(() => Promise.reject(value));

      f.mockImplementationOnce = fn => {
        // next function call will use this mock implementation return value
        // or default mock implementation return value
        const mockConfig = this._ensureMockConfig(f);

        mockConfig.isReturnValueLastSet = false;
        mockConfig.specificMockImpls.push(fn);
        return f;
      };

      f.mockImplementation = fn => {
        // next function call will use mock implementation return value
        const mockConfig = this._ensureMockConfig(f);

        mockConfig.isReturnValueLastSet = false;
        mockConfig.defaultReturnValue = undefined;
        mockConfig.mockImpl = fn;
        return f;
      };

      f.mockReturnThis = () =>
        f.mockImplementation(function() {
          return this;
        });

      f.mockName = name => {
        if (name) {
          const mockConfig = this._ensureMockConfig(f);

          mockConfig.mockName = name;
        }

        return f;
      };

      f.getMockName = () => {
        const mockConfig = this._ensureMockConfig(f);

        return mockConfig.mockName || 'jest.fn()';
      };

      if (metadata.mockImpl) {
        f.mockImplementation(metadata.mockImpl);
      }

      return f;
    } else {
      const unknownType = metadata.type || 'undefined type';
      throw new Error('Unrecognized type ' + unknownType);
    }
  }

  _createMockFunction(metadata, mockConstructor) {
    let name = metadata.name;

    if (!name) {
      return mockConstructor;
    } // Preserve `name` property of mocked function.

    const boundFunctionPrefix = 'bound ';
    let bindCall = ''; // if-do-while for perf reasons. The common case is for the if to fail.

    if (name && name.startsWith(boundFunctionPrefix)) {
      do {
        name = name.substring(boundFunctionPrefix.length); // Call bind() just to alter the function name.

        bindCall = '.bind(null)';
      } while (name && name.startsWith(boundFunctionPrefix));
    } // Special case functions named `mockConstructor` to guard for infinite
    // loops.

    if (name === MOCK_CONSTRUCTOR_NAME) {
      return mockConstructor;
    }

    if (
      // It's a syntax error to define functions with a reserved keyword
      // as name.
      RESERVED_KEYWORDS.has(name) || // It's also a syntax error to define functions with a name that starts with a number
      /^\d/.test(name)
    ) {
      name = '$' + name;
    } // It's also a syntax error to define a function with a reserved character
    // as part of it's name.

    if (FUNCTION_NAME_RESERVED_PATTERN.test(name)) {
      name = name.replace(FUNCTION_NAME_RESERVED_REPLACE, '$');
    }

    const body =
      'return function ' +
      name +
      '() {' +
      'return ' +
      MOCK_CONSTRUCTOR_NAME +
      '.apply(this,arguments);' +
      '}' +
      bindCall;
    const createConstructor = new this._environmentGlobal.Function(
      MOCK_CONSTRUCTOR_NAME,
      body
    );
    return createConstructor(mockConstructor);
  }

  _generateMock(metadata, callbacks, refs) {
    // metadata not compatible but it's the same type, maybe problem with
    // overloading of _makeComponent and not _generateMock?
    // @ts-ignore
    const mock = this._makeComponent(metadata);

    if (metadata.refID != null) {
      refs[metadata.refID] = mock;
    }

    this._getSlots(metadata.members).forEach(slot => {
      const slotMetadata = (metadata.members && metadata.members[slot]) || {};

      if (slotMetadata.ref != null) {
        callbacks.push(
          (function(ref) {
            return () => (mock[slot] = refs[ref]);
          })(slotMetadata.ref)
        );
      } else {
        mock[slot] = this._generateMock(slotMetadata, callbacks, refs);
      }
    });

    if (
      metadata.type !== 'undefined' &&
      metadata.type !== 'null' &&
      mock.prototype &&
      typeof mock.prototype === 'object'
    ) {
      mock.prototype.constructor = mock;
    }

    return mock;
  }
  /**
   * @see README.md
   * @param _metadata Metadata for the mock in the schema returned by the
   * getMetadata method of this module.
   */

  generateFromMetadata(_metadata) {
    const callbacks = [];
    const refs = {};

    const mock = this._generateMock(_metadata, callbacks, refs);

    callbacks.forEach(setter => setter());
    return mock;
  }
  /**
   * @see README.md
   * @param component The component for which to retrieve metadata.
   */

  getMetadata(component, _refs) {
    const refs = _refs || new Map();
    const ref = refs.get(component);

    if (ref != null) {
      return {
        ref
      };
    }

    const type = getType(component);

    if (!type) {
      return null;
    }

    const metadata = {
      type
    };

    if (
      type === 'constant' ||
      type === 'collection' ||
      type === 'undefined' ||
      type === 'null'
    ) {
      metadata.value = component;
      return metadata;
    } else if (type === 'function') {
      // @ts-ignore this is a function so it has a name
      metadata.name = component.name; // @ts-ignore may be a mock

      if (component._isMockFunction === true) {
        // @ts-ignore may be a mock
        metadata.mockImpl = component.getMockImplementation();
      }
    }

    metadata.refID = refs.size;
    refs.set(component, metadata.refID);
    let members = null; // Leave arrays alone

    if (type !== 'array') {
      this._getSlots(component).forEach(slot => {
        if (
          type === 'function' && // @ts-ignore may be a mock
          component._isMockFunction === true &&
          slot.match(/^mock/)
        ) {
          return;
        } // @ts-ignore no index signature

        const slotMetadata = this.getMetadata(component[slot], refs);

        if (slotMetadata) {
          if (!members) {
            members = {};
          }

          members[slot] = slotMetadata;
        }
      });
    }

    if (members) {
      metadata.members = members;
    }

    return metadata;
  }

  isMockFunction(fn) {
    return !!fn && fn._isMockFunction === true;
  }

  fn(implementation) {
    const length = implementation ? implementation.length : 0;

    const fn = this._makeComponent({
      length,
      type: 'function'
    });

    if (implementation) {
      fn.mockImplementation(implementation);
    }

    return fn;
  }

  spyOn(object, methodName, accessType) {
    if (accessType) {
      return this._spyOnProperty(object, methodName, accessType);
    }

    if (typeof object !== 'object' && typeof object !== 'function') {
      throw new Error(
        'Cannot spyOn on a primitive value; ' + this._typeOf(object) + ' given'
      );
    }

    const original = object[methodName];

    if (!this.isMockFunction(original)) {
      if (typeof original !== 'function') {
        throw new Error(
          'Cannot spy the ' +
            methodName +
            ' property because it is not a function; ' +
            this._typeOf(original) +
            ' given instead'
        );
      }

      const isMethodOwner = object.hasOwnProperty(methodName); // @ts-ignore overriding original method with a Mock

      object[methodName] = this._makeComponent(
        {
          type: 'function'
        },
        () => {
          if (isMethodOwner) {
            object[methodName] = original;
          } else {
            delete object[methodName];
          }
        }
      ); // @ts-ignore original method is now a Mock

      object[methodName].mockImplementation(function() {
        return original.apply(this, arguments);
      });
    }

    return object[methodName];
  }

  _spyOnProperty(obj, propertyName, accessType = 'get') {
    if (typeof obj !== 'object' && typeof obj !== 'function') {
      throw new Error(
        'Cannot spyOn on a primitive value; ' + this._typeOf(obj) + ' given'
      );
    }

    if (!obj) {
      throw new Error(
        'spyOn could not find an object to spy upon for ' + propertyName + ''
      );
    }

    if (!propertyName) {
      throw new Error('No property name supplied');
    }

    let descriptor = Object.getOwnPropertyDescriptor(obj, propertyName);
    let proto = Object.getPrototypeOf(obj);

    while (!descriptor && proto !== null) {
      descriptor = Object.getOwnPropertyDescriptor(proto, propertyName);
      proto = Object.getPrototypeOf(proto);
    }

    if (!descriptor) {
      throw new Error(propertyName + ' property does not exist');
    }

    if (!descriptor.configurable) {
      throw new Error(propertyName + ' is not declared configurable');
    }

    if (!descriptor[accessType]) {
      throw new Error(
        'Property ' + propertyName + ' does not have access type ' + accessType
      );
    }

    const original = descriptor[accessType];

    if (!this.isMockFunction(original)) {
      if (typeof original !== 'function') {
        throw new Error(
          'Cannot spy the ' +
            propertyName +
            ' property because it is not a function; ' +
            this._typeOf(original) +
            ' given instead'
        );
      } // @ts-ignore: mock is assignable

      descriptor[accessType] = this._makeComponent(
        {
          type: 'function'
        },
        () => {
          // @ts-ignore: mock is assignable
          descriptor[accessType] = original;
          Object.defineProperty(obj, propertyName, descriptor);
        }
      );
      descriptor[accessType].mockImplementation(function() {
        // @ts-ignore
        return original.apply(this, arguments);
      });
    }

    Object.defineProperty(obj, propertyName, descriptor);
    return descriptor[accessType];
  }

  clearAllMocks() {
    this._mockState = new WeakMap();
  }

  resetAllMocks() {
    this._mockConfigRegistry = new WeakMap();
    this._mockState = new WeakMap();
  }

  restoreAllMocks() {
    this._spyState.forEach(restore => restore());

    this._spyState = new Set();
  }

  _typeOf(value) {
    return value == null ? '' + value : typeof value;
  }
}
/* eslint-disable-next-line no-redeclare */

const JestMock = new ModuleMockerClass(commonjsGlobal);
module.exports = JestMock;
});

unwrapExports(build);

var symbols = createCommonjsModule(function (module) {

const isHyper = process.env.TERM_PROGRAM === 'Hyper';
const isWindows = process.platform === 'win32';
const isLinux = process.platform === 'linux';

const common = {
  ballotDisabled: '☒',
  ballotOff: '☐',
  ballotOn: '☑',
  bullet: '•',
  bulletWhite: '◦',
  fullBlock: '█',
  heart: '❤',
  identicalTo: '≡',
  line: '─',
  mark: '※',
  middot: '·',
  minus: '－',
  multiplication: '×',
  obelus: '÷',
  pencilDownRight: '✎',
  pencilRight: '✏',
  pencilUpRight: '✐',
  percent: '%',
  pilcrow2: '❡',
  pilcrow: '¶',
  plusMinus: '±',
  section: '§',
  starsOff: '☆',
  starsOn: '★',
  upDownArrow: '↕'
};

const windows = Object.assign({}, common, {
  check: '√',
  cross: '×',
  ellipsisLarge: '...',
  ellipsis: '...',
  info: 'i',
  question: '?',
  questionSmall: '?',
  pointer: '>',
  pointerSmall: '»',
  radioOff: '( )',
  radioOn: '(*)',
  warning: '‼'
});

const other = Object.assign({}, common, {
  ballotCross: '✘',
  check: '✔',
  cross: '✖',
  ellipsisLarge: '⋯',
  ellipsis: '…',
  info: 'ℹ',
  question: '?',
  questionFull: '？',
  questionSmall: '﹖',
  pointer: isLinux ? '▸' : '❯',
  pointerSmall: isLinux ? '‣' : '›',
  radioOff: '◯',
  radioOn: '◉',
  warning: '⚠'
});

module.exports = (isWindows && !isHyper) ? windows : other;
Reflect.defineProperty(module.exports, 'common', { enumerable: false, value: common });
Reflect.defineProperty(module.exports, 'windows', { enumerable: false, value: windows });
Reflect.defineProperty(module.exports, 'other', { enumerable: false, value: other });
});

const isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);

/* eslint-disable no-control-regex */
// this is a modified version of https://github.com/chalk/ansi-regex (MIT License)
const ANSI_REGEX = /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g;

const create = () => {
  const colors = { enabled: true, visible: true, styles: {}, keys: {} };

  if ('FORCE_COLOR' in process.env) {
    colors.enabled = process.env.FORCE_COLOR !== '0';
  }

  const ansi = style => {
    let open = style.open = `\u001b[${style.codes[0]}m`;
    let close = style.close = `\u001b[${style.codes[1]}m`;
    let regex = style.regex = new RegExp(`\\u001b\\[${style.codes[1]}m`, 'g');
    style.wrap = (input, newline) => {
      if (input.includes(close)) input = input.replace(regex, close + open);
      let output = open + input + close;
      // see https://github.com/chalk/chalk/pull/92, thanks to the
      // chalk contributors for this fix. However, we've confirmed that
      // this issue is also present in Windows terminals
      return newline ? output.replace(/\r*\n/g, `${close}$&${open}`) : output;
    };
    return style;
  };

  const wrap = (style, input, newline) => {
    return typeof style === 'function' ? style(input) : style.wrap(input, newline);
  };

  const style = (input, stack) => {
    if (input === '' || input == null) return '';
    if (colors.enabled === false) return input;
    if (colors.visible === false) return '';
    let str = '' + input;
    let nl = str.includes('\n');
    let n = stack.length;
    if (n > 0 && stack.includes('unstyle')) {
      stack = [...new Set(['unstyle', ...stack])].reverse();
    }
    while (n-- > 0) str = wrap(colors.styles[stack[n]], str, nl);
    return str;
  };

  const define = (name, codes, type) => {
    colors.styles[name] = ansi({ name, codes });
    let keys = colors.keys[type] || (colors.keys[type] = []);
    keys.push(name);

    Reflect.defineProperty(colors, name, {
      configurable: true,
      enumerable: true,
      set(value) {
        colors.alias(name, value);
      },
      get() {
        let color = input => style(input, color.stack);
        Reflect.setPrototypeOf(color, colors);
        color.stack = this.stack ? this.stack.concat(name) : [name];
        return color;
      }
    });
  };

  define('reset', [0, 0], 'modifier');
  define('bold', [1, 22], 'modifier');
  define('dim', [2, 22], 'modifier');
  define('italic', [3, 23], 'modifier');
  define('underline', [4, 24], 'modifier');
  define('inverse', [7, 27], 'modifier');
  define('hidden', [8, 28], 'modifier');
  define('strikethrough', [9, 29], 'modifier');

  define('black', [30, 39], 'color');
  define('red', [31, 39], 'color');
  define('green', [32, 39], 'color');
  define('yellow', [33, 39], 'color');
  define('blue', [34, 39], 'color');
  define('magenta', [35, 39], 'color');
  define('cyan', [36, 39], 'color');
  define('white', [37, 39], 'color');
  define('gray', [90, 39], 'color');
  define('grey', [90, 39], 'color');

  define('bgBlack', [40, 49], 'bg');
  define('bgRed', [41, 49], 'bg');
  define('bgGreen', [42, 49], 'bg');
  define('bgYellow', [43, 49], 'bg');
  define('bgBlue', [44, 49], 'bg');
  define('bgMagenta', [45, 49], 'bg');
  define('bgCyan', [46, 49], 'bg');
  define('bgWhite', [47, 49], 'bg');

  define('blackBright', [90, 39], 'bright');
  define('redBright', [91, 39], 'bright');
  define('greenBright', [92, 39], 'bright');
  define('yellowBright', [93, 39], 'bright');
  define('blueBright', [94, 39], 'bright');
  define('magentaBright', [95, 39], 'bright');
  define('cyanBright', [96, 39], 'bright');
  define('whiteBright', [97, 39], 'bright');

  define('bgBlackBright', [100, 49], 'bgBright');
  define('bgRedBright', [101, 49], 'bgBright');
  define('bgGreenBright', [102, 49], 'bgBright');
  define('bgYellowBright', [103, 49], 'bgBright');
  define('bgBlueBright', [104, 49], 'bgBright');
  define('bgMagentaBright', [105, 49], 'bgBright');
  define('bgCyanBright', [106, 49], 'bgBright');
  define('bgWhiteBright', [107, 49], 'bgBright');

  colors.ansiRegex = ANSI_REGEX;
  colors.hasColor = colors.hasAnsi = str => {
    colors.ansiRegex.lastIndex = 0;
    return typeof str === 'string' && str !== '' && colors.ansiRegex.test(str);
  };

  colors.alias = (name, color) => {
    let fn = typeof color === 'string' ? colors[color] : color;

    if (typeof fn !== 'function') {
      throw new TypeError('Expected alias to be the name of an existing color (string) or a function');
    }

    if (!fn.stack) {
      Reflect.defineProperty(fn, 'name', { value: name });
      colors.styles[name] = fn;
      fn.stack = [name];
    }

    Reflect.defineProperty(colors, name, {
      configurable: true,
      enumerable: true,
      set(value) {
        colors.alias(name, value);
      },
      get() {
        let color = input => style(input, color.stack);
        Reflect.setPrototypeOf(color, colors);
        color.stack = this.stack ? this.stack.concat(fn.stack) : fn.stack;
        return color;
      }
    });
  };

  colors.theme = custom => {
    if (!isObject(custom)) throw new TypeError('Expected theme to be an object');
    for (let name of Object.keys(custom)) {
      colors.alias(name, custom[name]);
    }
    return colors;
  };

  colors.alias('unstyle', str => {
    if (typeof str === 'string' && str !== '') {
      colors.ansiRegex.lastIndex = 0;
      return str.replace(colors.ansiRegex, '');
    }
    return '';
  });

  colors.alias('noop', str => str);
  colors.none = colors.clear = colors.noop;

  colors.stripColor = colors.unstyle;
  colors.symbols = symbols;
  colors.define = define;
  return colors;
};

var ansiColors = create();
var create_1 = create;
ansiColors.create = create_1;

var types = {
  ROOT       : 0,
  GROUP      : 1,
  POSITION   : 2,
  SET        : 3,
  RANGE      : 4,
  REPETITION : 5,
  REFERENCE  : 6,
  CHAR       : 7,
};

var INTS = function() {
 return [{ type: types.RANGE , from: 48, to: 57 }];
};

var WORDS = function() {
 return [
    { type: types.CHAR, value: 95 },
    { type: types.RANGE, from: 97, to: 122 },
    { type: types.RANGE, from: 65, to: 90 }
  ].concat(INTS());
};

var WHITESPACE = function() {
 return [
    { type: types.CHAR, value: 9 },
    { type: types.CHAR, value: 10 },
    { type: types.CHAR, value: 11 },
    { type: types.CHAR, value: 12 },
    { type: types.CHAR, value: 13 },
    { type: types.CHAR, value: 32 },
    { type: types.CHAR, value: 160 },
    { type: types.CHAR, value: 5760 },
    { type: types.CHAR, value: 6158 },
    { type: types.CHAR, value: 8192 },
    { type: types.CHAR, value: 8193 },
    { type: types.CHAR, value: 8194 },
    { type: types.CHAR, value: 8195 },
    { type: types.CHAR, value: 8196 },
    { type: types.CHAR, value: 8197 },
    { type: types.CHAR, value: 8198 },
    { type: types.CHAR, value: 8199 },
    { type: types.CHAR, value: 8200 },
    { type: types.CHAR, value: 8201 },
    { type: types.CHAR, value: 8202 },
    { type: types.CHAR, value: 8232 },
    { type: types.CHAR, value: 8233 },
    { type: types.CHAR, value: 8239 },
    { type: types.CHAR, value: 8287 },
    { type: types.CHAR, value: 12288 },
    { type: types.CHAR, value: 65279 }
  ];
};

var NOTANYCHAR = function() {
  return [
    { type: types.CHAR, value: 10 },
    { type: types.CHAR, value: 13 },
    { type: types.CHAR, value: 8232 },
    { type: types.CHAR, value: 8233 },
  ];
};

// Predefined class objects.
var words = function() {
  return { type: types.SET, set: WORDS(), not: false };
};

var notWords = function() {
  return { type: types.SET, set: WORDS(), not: true };
};

var ints = function() {
  return { type: types.SET, set: INTS(), not: false };
};

var notInts = function() {
  return { type: types.SET, set: INTS(), not: true };
};

var whitespace = function() {
  return { type: types.SET, set: WHITESPACE(), not: false };
};

var notWhitespace = function() {
  return { type: types.SET, set: WHITESPACE(), not: true };
};

var anyChar = function() {
  return { type: types.SET, set: NOTANYCHAR(), not: true };
};

var sets = {
	words: words,
	notWords: notWords,
	ints: ints,
	notInts: notInts,
	whitespace: whitespace,
	notWhitespace: notWhitespace,
	anyChar: anyChar
};

var util = createCommonjsModule(function (module, exports) {
// All of these are private and only used by randexp.
// It's assumed that they will always be called with the correct input.

var CTRL = '@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^ ?';
var SLSH = { '0': 0, 't': 9, 'n': 10, 'v': 11, 'f': 12, 'r': 13 };

/**
 * Finds character representations in str and convert all to
 * their respective characters
 *
 * @param {String} str
 * @return {String}
 */
exports.strToChars = function(str) {
  /* jshint maxlen: false */
  var chars_regex = /(\[\\b\])|(\\)?\\(?:u([A-F0-9]{4})|x([A-F0-9]{2})|(0?[0-7]{2})|c([@A-Z\[\\\]\^?])|([0tnvfr]))/g;
  str = str.replace(chars_regex, function(s, b, lbs, a16, b16, c8, dctrl, eslsh) {
    if (lbs) {
      return s;
    }

    var code = b     ? 8 :
               a16   ? parseInt(a16, 16) :
               b16   ? parseInt(b16, 16) :
               c8    ? parseInt(c8,   8) :
               dctrl ? CTRL.indexOf(dctrl) :
               SLSH[eslsh];

    var c = String.fromCharCode(code);

    // Escape special regex characters.
    if (/[\[\]{}\^$.|?*+()]/.test(c)) {
      c = '\\' + c;
    }

    return c;
  });

  return str;
};


/**
 * turns class into tokens
 * reads str until it encounters a ] not preceeded by a \
 *
 * @param {String} str
 * @param {String} regexpStr
 * @return {Array.<Array.<Object>, Number>}
 */
exports.tokenizeClass = function(str, regexpStr) {
  /* jshint maxlen: false */
  var tokens = [];
  var regexp = /\\(?:(w)|(d)|(s)|(W)|(D)|(S))|((?:(?:\\)(.)|([^\]\\]))-(?:\\)?([^\]]))|(\])|(?:\\)?(.)/g;
  var rs, c;


  while ((rs = regexp.exec(str)) != null) {
    if (rs[1]) {
      tokens.push(sets.words());

    } else if (rs[2]) {
      tokens.push(sets.ints());

    } else if (rs[3]) {
      tokens.push(sets.whitespace());

    } else if (rs[4]) {
      tokens.push(sets.notWords());

    } else if (rs[5]) {
      tokens.push(sets.notInts());

    } else if (rs[6]) {
      tokens.push(sets.notWhitespace());

    } else if (rs[7]) {
      tokens.push({
        type: types.RANGE,
        from: (rs[8] || rs[9]).charCodeAt(0),
          to: rs[10].charCodeAt(0),
      });

    } else if (c = rs[12]) {
      tokens.push({
        type: types.CHAR,
        value: c.charCodeAt(0),
      });

    } else {
      return [tokens, regexp.lastIndex];
    }
  }

  exports.error(regexpStr, 'Unterminated character class');
};


/**
 * Shortcut to throw errors.
 *
 * @param {String} regexp
 * @param {String} msg
 */
exports.error = function(regexp, msg) {
  throw new SyntaxError('Invalid regular expression: /' + regexp + '/: ' + msg);
};
});
var util_1 = util.strToChars;
var util_2 = util.tokenizeClass;
var util_3 = util.error;

var wordBoundary = function() {
  return { type: types.POSITION, value: 'b' };
};

var nonWordBoundary = function() {
  return { type: types.POSITION, value: 'B' };
};

var begin = function() {
  return { type: types.POSITION, value: '^' };
};

var end = function() {
  return { type: types.POSITION, value: '$' };
};

var positions = {
	wordBoundary: wordBoundary,
	nonWordBoundary: nonWordBoundary,
	begin: begin,
	end: end
};

var lib = function(regexpStr) {
  var i = 0, l, c,
      start = { type: types.ROOT, stack: []},

      // Keep track of last clause/group and stack.
      lastGroup = start,
      last = start.stack,
      groupStack = [];


  var repeatErr = function(i) {
    util.error(regexpStr, 'Nothing to repeat at column ' + (i - 1));
  };

  // Decode a few escaped characters.
  var str = util.strToChars(regexpStr);
  l = str.length;

  // Iterate through each character in string.
  while (i < l) {
    c = str[i++];

    switch (c) {
      // Handle escaped characters, inclues a few sets.
      case '\\':
        c = str[i++];

        switch (c) {
          case 'b':
            last.push(positions.wordBoundary());
            break;

          case 'B':
            last.push(positions.nonWordBoundary());
            break;

          case 'w':
            last.push(sets.words());
            break;

          case 'W':
            last.push(sets.notWords());
            break;

          case 'd':
            last.push(sets.ints());
            break;

          case 'D':
            last.push(sets.notInts());
            break;

          case 's':
            last.push(sets.whitespace());
            break;

          case 'S':
            last.push(sets.notWhitespace());
            break;

          default:
            // Check if c is integer.
            // In which case it's a reference.
            if (/\d/.test(c)) {
              last.push({ type: types.REFERENCE, value: parseInt(c, 10) });

            // Escaped character.
            } else {
              last.push({ type: types.CHAR, value: c.charCodeAt(0) });
            }
        }

        break;


      // Positionals.
      case '^':
          last.push(positions.begin());
        break;

      case '$':
          last.push(positions.end());
        break;


      // Handle custom sets.
      case '[':
        // Check if this class is 'anti' i.e. [^abc].
        var not;
        if (str[i] === '^') {
          not = true;
          i++;
        } else {
          not = false;
        }

        // Get all the characters in class.
        var classTokens = util.tokenizeClass(str.slice(i), regexpStr);

        // Increase index by length of class.
        i += classTokens[1];
        last.push({
          type: types.SET,
          set: classTokens[0],
          not: not,
        });

        break;


      // Class of any character except \n.
      case '.':
        last.push(sets.anyChar());
        break;


      // Push group onto stack.
      case '(':
        // Create group.
        var group = {
          type: types.GROUP,
          stack: [],
          remember: true,
        };

        c = str[i];

        // If if this is a special kind of group.
        if (c === '?') {
          c = str[i + 1];
          i += 2;

          // Match if followed by.
          if (c === '=') {
            group.followedBy = true;

          // Match if not followed by.
          } else if (c === '!') {
            group.notFollowedBy = true;

          } else if (c !== ':') {
            util.error(regexpStr,
              'Invalid group, character \'' + c +
              '\' after \'?\' at column ' + (i - 1));
          }

          group.remember = false;
        }

        // Insert subgroup into current group stack.
        last.push(group);

        // Remember the current group for when the group closes.
        groupStack.push(lastGroup);

        // Make this new group the current group.
        lastGroup = group;
        last = group.stack;
        break;


      // Pop group out of stack.
      case ')':
        if (groupStack.length === 0) {
          util.error(regexpStr, 'Unmatched ) at column ' + (i - 1));
        }
        lastGroup = groupStack.pop();

        // Check if this group has a PIPE.
        // To get back the correct last stack.
        last = lastGroup.options ?
          lastGroup.options[lastGroup.options.length - 1] : lastGroup.stack;
        break;


      // Use pipe character to give more choices.
      case '|':
        // Create array where options are if this is the first PIPE
        // in this clause.
        if (!lastGroup.options) {
          lastGroup.options = [lastGroup.stack];
          delete lastGroup.stack;
        }

        // Create a new stack and add to options for rest of clause.
        var stack = [];
        lastGroup.options.push(stack);
        last = stack;
        break;


      // Repetition.
      // For every repetition, remove last element from last stack
      // then insert back a RANGE object.
      // This design is chosen because there could be more than
      // one repetition symbols in a regex i.e. `a?+{2,3}`.
      case '{':
        var rs = /^(\d+)(,(\d+)?)?\}/.exec(str.slice(i)), min, max;
        if (rs !== null) {
          if (last.length === 0) {
            repeatErr(i);
          }
          min = parseInt(rs[1], 10);
          max = rs[2] ? rs[3] ? parseInt(rs[3], 10) : Infinity : min;
          i += rs[0].length;

          last.push({
            type: types.REPETITION,
            min: min,
            max: max,
            value: last.pop(),
          });
        } else {
          last.push({
            type: types.CHAR,
            value: 123,
          });
        }
        break;

      case '?':
        if (last.length === 0) {
          repeatErr(i);
        }
        last.push({
          type: types.REPETITION,
          min: 0,
          max: 1,
          value: last.pop(),
        });
        break;

      case '+':
        if (last.length === 0) {
          repeatErr(i);
        }
        last.push({
          type: types.REPETITION,
          min: 1,
          max: Infinity,
          value: last.pop(),
        });
        break;

      case '*':
        if (last.length === 0) {
          repeatErr(i);
        }
        last.push({
          type: types.REPETITION,
          min: 0,
          max: Infinity,
          value: last.pop(),
        });
        break;


      // Default is a character that is not `\[](){}?+*^$`.
      default:
        last.push({
          type: types.CHAR,
          value: c.charCodeAt(0),
        });
    }

  }

  // Check if any groups have not been closed.
  if (groupStack.length !== 0) {
    util.error(regexpStr, 'Unterminated group');
  }

  return start;
};

var types_1 = types;
lib.types = types_1;

var types$1 = lib.types;

var safeRegex = function (re, opts) {
    if (!opts) opts = {};
    var replimit = opts.limit === undefined ? 25 : opts.limit;
    
    if (isRegExp(re)) re = re.source;
    else if (typeof re !== 'string') re = String(re);
    
    try { re = lib(re); }
    catch (err) { return false }
    
    var reps = 0;
    return (function walk (node, starHeight) {
        if (node.type === types$1.REPETITION) {
            starHeight ++;
            reps ++;
            if (starHeight > 1) return false;
            if (reps > replimit) return false;
        }
        
        if (node.options) {
            for (var i = 0, len = node.options.length; i < len; i++) {
                var ok = walk({ stack: node.options[i] }, starHeight);
                if (!ok) return false;
            }
        }
        var stack = node.stack || (node.value && node.value.stack);
        if (!stack) return true;
        
        for (var i = 0; i < stack.length; i++) {
            var ok = walk(stack[i], starHeight);
            if (!ok) return false;
        }
        
        return true;
    })(re, 0);
};

function isRegExp (x) {
    return {}.toString.call(x) === '[object RegExp]';
}

/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var isobject = function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

var toString = Object.prototype.toString;

var kindOf = function kindOf(val) {
  if (val === void 0) return 'undefined';
  if (val === null) return 'null';

  var type = typeof val;
  if (type === 'boolean') return 'boolean';
  if (type === 'string') return 'string';
  if (type === 'number') return 'number';
  if (type === 'symbol') return 'symbol';
  if (type === 'function') {
    return isGeneratorFn(val) ? 'generatorfunction' : 'function';
  }

  if (isArray(val)) return 'array';
  if (isBuffer(val)) return 'buffer';
  if (isArguments(val)) return 'arguments';
  if (isDate(val)) return 'date';
  if (isError(val)) return 'error';
  if (isRegexp(val)) return 'regexp';

  switch (ctorName(val)) {
    case 'Symbol': return 'symbol';
    case 'Promise': return 'promise';

    // Set, Map, WeakSet, WeakMap
    case 'WeakMap': return 'weakmap';
    case 'WeakSet': return 'weakset';
    case 'Map': return 'map';
    case 'Set': return 'set';

    // 8-bit typed arrays
    case 'Int8Array': return 'int8array';
    case 'Uint8Array': return 'uint8array';
    case 'Uint8ClampedArray': return 'uint8clampedarray';

    // 16-bit typed arrays
    case 'Int16Array': return 'int16array';
    case 'Uint16Array': return 'uint16array';

    // 32-bit typed arrays
    case 'Int32Array': return 'int32array';
    case 'Uint32Array': return 'uint32array';
    case 'Float32Array': return 'float32array';
    case 'Float64Array': return 'float64array';
  }

  if (isGeneratorObj(val)) {
    return 'generator';
  }

  // Non-plain objects
  type = toString.call(val);
  switch (type) {
    case '[object Object]': return 'object';
    // iterators
    case '[object Map Iterator]': return 'mapiterator';
    case '[object Set Iterator]': return 'setiterator';
    case '[object String Iterator]': return 'stringiterator';
    case '[object Array Iterator]': return 'arrayiterator';
  }

  // other
  return type.slice(8, -1).toLowerCase().replace(/\s/g, '');
};

function ctorName(val) {
  return val.constructor ? val.constructor.name : null;
}

function isArray(val) {
  if (Array.isArray) return Array.isArray(val);
  return val instanceof Array;
}

function isError(val) {
  return val instanceof Error || (typeof val.message === 'string' && val.constructor && typeof val.constructor.stackTraceLimit === 'number');
}

function isDate(val) {
  if (val instanceof Date) return true;
  return typeof val.toDateString === 'function'
    && typeof val.getDate === 'function'
    && typeof val.setDate === 'function';
}

function isRegexp(val) {
  if (val instanceof RegExp) return true;
  return typeof val.flags === 'string'
    && typeof val.ignoreCase === 'boolean'
    && typeof val.multiline === 'boolean'
    && typeof val.global === 'boolean';
}

function isGeneratorFn(name, val) {
  return ctorName(name) === 'GeneratorFunction';
}

function isGeneratorObj(val) {
  return typeof val.throw === 'function'
    && typeof val.return === 'function'
    && typeof val.next === 'function';
}

function isArguments(val) {
  try {
    if (typeof val.length === 'number' && typeof val.callee === 'function') {
      return true;
    }
  } catch (err) {
    if (err.message.indexOf('callee') !== -1) {
      return true;
    }
  }
  return false;
}

/**
 * If you need to support Safari 5-7 (8-10 yr-old browser),
 * take a look at https://github.com/feross/is-buffer
 */

function isBuffer(val) {
  if (val.constructor && typeof val.constructor.isBuffer === 'function') {
    return val.constructor.isBuffer(val);
  }
  return false;
}

// accessor descriptor properties
var accessor = {
  get: 'function',
  set: 'function',
  configurable: 'boolean',
  enumerable: 'boolean'
};

function isAccessorDescriptor(obj, prop) {
  if (typeof prop === 'string') {
    var val = Object.getOwnPropertyDescriptor(obj, prop);
    return typeof val !== 'undefined';
  }

  if (kindOf(obj) !== 'object') {
    return false;
  }

  if (has(obj, 'value') || has(obj, 'writable')) {
    return false;
  }

  if (!has(obj, 'get') || typeof obj.get !== 'function') {
    return false;
  }

  // tldr: it's valid to have "set" be undefined
  // "set" might be undefined if `Object.getOwnPropertyDescriptor`
  // was used to get the value, and only `get` was defined by the user
  if (has(obj, 'set') && typeof obj[key] !== 'function' && typeof obj[key] !== 'undefined') {
    return false;
  }

  for (var key in obj) {
    if (!accessor.hasOwnProperty(key)) {
      continue;
    }

    if (kindOf(obj[key]) === accessor[key]) {
      continue;
    }

    if (typeof obj[key] !== 'undefined') {
      return false;
    }
  }
  return true;
}

function has(obj, key) {
  return {}.hasOwnProperty.call(obj, key);
}

/**
 * Expose `isAccessorDescriptor`
 */

var isAccessorDescriptor_1 = isAccessorDescriptor;

var isDataDescriptor = function isDataDescriptor(obj, prop) {
  // data descriptor properties
  var data = {
    configurable: 'boolean',
    enumerable: 'boolean',
    writable: 'boolean'
  };

  if (kindOf(obj) !== 'object') {
    return false;
  }

  if (typeof prop === 'string') {
    var val = Object.getOwnPropertyDescriptor(obj, prop);
    return typeof val !== 'undefined';
  }

  if (!('value' in obj) && !('writable' in obj)) {
    return false;
  }

  for (var key in obj) {
    if (key === 'value') continue;

    if (!data.hasOwnProperty(key)) {
      continue;
    }

    if (kindOf(obj[key]) === data[key]) {
      continue;
    }

    if (typeof obj[key] !== 'undefined') {
      return false;
    }
  }
  return true;
};

var isDescriptor = function isDescriptor(obj, key) {
  if (kindOf(obj) !== 'object') {
    return false;
  }
  if ('get' in obj) {
    return isAccessorDescriptor_1(obj, key);
  }
  return isDataDescriptor(obj, key);
};

var define = (typeof Reflect !== 'undefined' && Reflect.defineProperty)
  ? Reflect.defineProperty
  : Object.defineProperty;

var defineProperty = function defineProperty(obj, key, val) {
  if (!isobject(obj) && typeof obj !== 'function' && !Array.isArray(obj)) {
    throw new TypeError('expected an object, function, or array');
  }

  if (typeof key !== 'string') {
    throw new TypeError('expected "key" to be a string');
  }

  if (isDescriptor(val)) {
    define(obj, key, val);
    return obj;
  }

  define(obj, key, {
    configurable: true,
    enumerable: false,
    writable: true,
    value: val
  });

  return obj;
};

function isObjectObject(o) {
  return isobject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

var isPlainObject = function isPlainObject(o) {
  var ctor,prot;

  if (isObjectObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') return false;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
};

var isExtendable = function isExtendable(val) {
  return isPlainObject(val) || typeof val === 'function' || Array.isArray(val);
};

/*!
 * assign-symbols <https://github.com/jonschlinkert/assign-symbols>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var assignSymbols = function(receiver, objects) {
  if (receiver === null || typeof receiver === 'undefined') {
    throw new TypeError('expected first argument to be an object.');
  }

  if (typeof objects === 'undefined' || typeof Symbol === 'undefined') {
    return receiver;
  }

  if (typeof Object.getOwnPropertySymbols !== 'function') {
    return receiver;
  }

  var isEnumerable = Object.prototype.propertyIsEnumerable;
  var target = Object(receiver);
  var len = arguments.length, i = 0;

  while (++i < len) {
    var provider = Object(arguments[i]);
    var names = Object.getOwnPropertySymbols(provider);

    for (var j = 0; j < names.length; j++) {
      var key = names[j];

      if (isEnumerable.call(provider, key)) {
        target[key] = provider[key];
      }
    }
  }
  return target;
};

var extendShallow = Object.assign || function(obj/*, objects*/) {
  if (obj === null || typeof obj === 'undefined') {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  if (!isObject$1(obj)) {
    obj = {};
  }
  for (var i = 1; i < arguments.length; i++) {
    var val = arguments[i];
    if (isString(val)) {
      val = toObject(val);
    }
    if (isObject$1(val)) {
      assign(obj, val);
      assignSymbols(obj, val);
    }
  }
  return obj;
};

function assign(a, b) {
  for (var key in b) {
    if (hasOwn(b, key)) {
      a[key] = b[key];
    }
  }
}

function isString(val) {
  return (val && typeof val === 'string');
}

function toObject(str) {
  var obj = {};
  for (var i in str) {
    obj[i] = str[i];
  }
  return obj;
}

function isObject$1(val) {
  return (val && typeof val === 'object') || isExtendable(val);
}

/**
 * Returns true if the given `key` is an own property of `obj`.
 */

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * The main export is a function that takes a `pattern` string and an `options` object.
 *
 * ```js
 & var not = require('regex-not');
 & console.log(not('foo'));
 & //=> /^(?:(?!^(?:foo)$).)*$/
 * ```
 *
 * @param {String} `pattern`
 * @param {Object} `options`
 * @return {RegExp} Converts the given `pattern` to a regex using the specified `options`.
 * @api public
 */

function toRegex(pattern, options) {
  return new RegExp(toRegex.create(pattern, options));
}

/**
 * Create a regex-compatible string from the given `pattern` and `options`.
 *
 * ```js
 & var not = require('regex-not');
 & console.log(not.create('foo'));
 & //=> '^(?:(?!^(?:foo)$).)*$'
 * ```
 * @param {String} `pattern`
 * @param {Object} `options`
 * @return {String}
 * @api public
 */

toRegex.create = function(pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('expected a string');
  }

  var opts = extendShallow({}, options);
  if (opts.contains === true) {
    opts.strictNegate = false;
  }

  var open = opts.strictOpen !== false ? '^' : '';
  var close = opts.strictClose !== false ? '$' : '';
  var endChar = opts.endChar ? opts.endChar : '+';
  var str = pattern;

  if (opts.strictNegate === false) {
    str = '(?:(?!(?:' + pattern + ')).)' + endChar;
  } else {
    str = '(?:(?!^(?:' + pattern + ')$).)' + endChar;
  }

  var res = open + str + close;
  if (opts.safe === true && safeRegex(res) === false) {
    throw new Error('potentially unsafe regular expression: ' + res);
  }

  return res;
};

/**
 * Expose `toRegex`
 */

var regexNot = toRegex;

var MAX_LENGTH = 1024 * 64;

/**
 * Session cache
 */

var cache = {};

/**
 * Create a regular expression from the given `pattern` string.
 *
 * @param {String|RegExp} `pattern` Pattern can be a string or regular expression.
 * @param {Object} `options`
 * @return {RegExp}
 * @api public
 */

var toRegex$1 = function(patterns, options) {
  if (!Array.isArray(patterns)) {
    return makeRe(patterns, options);
  }
  return makeRe(patterns.join('|'), options);
};

/**
 * Create a regular expression from the given `pattern` string.
 *
 * @param {String|RegExp} `pattern` Pattern can be a string or regular expression.
 * @param {Object} `options`
 * @return {RegExp}
 * @api public
 */

function makeRe(pattern, options) {
  if (pattern instanceof RegExp) {
    return pattern;
  }

  if (typeof pattern !== 'string') {
    throw new TypeError('expected a string');
  }

  if (pattern.length > MAX_LENGTH) {
    throw new Error('expected pattern to be less than ' + MAX_LENGTH + ' characters');
  }

  var key = pattern;
  // do this before shallow cloning options, it's a lot faster
  if (!options || (options && options.cache !== false)) {
    key = createKey(pattern, options);

    if (cache.hasOwnProperty(key)) {
      return cache[key];
    }
  }

  var opts = extendShallow({}, options);
  if (opts.contains === true) {
    if (opts.negate === true) {
      opts.strictNegate = false;
    } else {
      opts.strict = false;
    }
  }

  if (opts.strict === false) {
    opts.strictOpen = false;
    opts.strictClose = false;
  }

  var open = opts.strictOpen !== false ? '^' : '';
  var close = opts.strictClose !== false ? '$' : '';
  var flags = opts.flags || '';
  var regex;

  if (opts.nocase === true && !/i/.test(flags)) {
    flags += 'i';
  }

  try {
    if (opts.negate || typeof opts.strictNegate === 'boolean') {
      pattern = regexNot.create(pattern, opts);
    }

    var str = open + '(?:' + pattern + ')' + close;
    regex = new RegExp(str, flags);

    if (opts.safe === true && safeRegex(regex) === false) {
      throw new Error('potentially unsafe regular expression: ' + regex.source);
    }

  } catch (err) {
    if (opts.strictErrors === true || opts.safe === true) {
      err.key = key;
      err.pattern = pattern;
      err.originalOptions = options;
      err.createdOptions = opts;
      throw err;
    }

    try {
      regex = new RegExp('^' + pattern.replace(/(\W)/g, '\\$1') + '$');
    } catch (err) {
      regex = /.^/; //<= match nothing
    }
  }

  if (opts.cache !== false) {
    memoize(regex, key, pattern, opts);
  }
  return regex;
}

/**
 * Memoize generated regex. This can result in dramatic speed improvements
 * and simplify debugging by adding options and pattern to the regex. It can be
 * disabled by passing setting `options.cache` to false.
 */

function memoize(regex, key, pattern, options) {
  defineProperty(regex, 'cached', true);
  defineProperty(regex, 'pattern', pattern);
  defineProperty(regex, 'options', options);
  defineProperty(regex, 'key', key);
  cache[key] = regex;
}

/**
 * Create the key to use for memoization. The key is generated
 * by iterating over the options and concatenating key-value pairs
 * to the pattern string.
 */

function createKey(pattern, options) {
  if (!options) return pattern;
  var key = pattern;
  for (var prop in options) {
    if (options.hasOwnProperty(prop)) {
      key += ';' + prop + '=' + String(options[prop]);
    }
  }
  return key;
}

/**
 * Expose `makeRe`
 */

var makeRe_1 = makeRe;
toRegex$1.makeRe = makeRe_1;

var arrayUnique = createCommonjsModule(function (module) {

module.exports = function unique(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('array-unique expects an array.');
  }

  var len = arr.length;
  var i = -1;

  while (i++ < len) {
    var j = i + 1;

    for (; j < arr.length; ++j) {
      if (arr[i] === arr[j]) {
        arr.splice(j--, 1);
      }
    }
  }
  return arr;
};

module.exports.immutable = function uniqueImmutable(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('array-unique expects an array.');
  }

  var arrLen = arr.length;
  var newArr = new Array(arrLen);

  for (var i = 0; i < arrLen; i++) {
    newArr[i] = arr[i];
  }

  return module.exports(newArr);
};
});
var arrayUnique_1 = arrayUnique.immutable;

/*!
 * is-extendable <https://github.com/jonschlinkert/is-extendable>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var isExtendable$1 = function isExtendable(val) {
  return typeof val !== 'undefined' && val !== null
    && (typeof val === 'object' || typeof val === 'function');
};

var extendShallow$1 = function extend(o/*, objects*/) {
  if (!isExtendable$1(o)) { o = {}; }

  var len = arguments.length;
  for (var i = 1; i < len; i++) {
    var obj = arguments[i];

    if (isExtendable$1(obj)) {
      assign$1(o, obj);
    }
  }
  return o;
};

function assign$1(a, b) {
  for (var key in b) {
    if (hasOwn$1(b, key)) {
      a[key] = b[key];
    }
  }
}

/**
 * Returns true if the given `key` is an own property of `obj`.
 */

function hasOwn$1(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

var splitString = function(str, options, fn) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  }

  if (typeof options === 'function') {
    fn = options;
    options = null;
  }

  // allow separator to be defined as a string
  if (typeof options === 'string') {
    options = { sep: options };
  }

  var opts = extendShallow({sep: '.'}, options);
  var quotes = opts.quotes || ['"', "'", '`'];
  var brackets;

  if (opts.brackets === true) {
    brackets = {
      '<': '>',
      '(': ')',
      '[': ']',
      '{': '}'
    };
  } else if (opts.brackets) {
    brackets = opts.brackets;
  }

  var tokens = [];
  var stack = [];
  var arr = [''];
  var sep = opts.sep;
  var len = str.length;
  var idx = -1;
  var closeIdx;

  function expected() {
    if (brackets && stack.length) {
      return brackets[stack[stack.length - 1]];
    }
  }

  while (++idx < len) {
    var ch = str[idx];
    var next = str[idx + 1];
    var tok = { val: ch, idx: idx, arr: arr, str: str };
    tokens.push(tok);

    if (ch === '\\') {
      tok.val = keepEscaping(opts, str, idx) === true ? (ch + next) : next;
      tok.escaped = true;
      if (typeof fn === 'function') {
        fn(tok);
      }
      arr[arr.length - 1] += tok.val;
      idx++;
      continue;
    }

    if (brackets && brackets[ch]) {
      stack.push(ch);
      var e = expected();
      var i = idx + 1;

      if (str.indexOf(e, i + 1) !== -1) {
        while (stack.length && i < len) {
          var s = str[++i];
          if (s === '\\') {
            s++;
            continue;
          }

          if (quotes.indexOf(s) !== -1) {
            i = getClosingQuote(str, s, i + 1);
            continue;
          }

          e = expected();
          if (stack.length && str.indexOf(e, i + 1) === -1) {
            break;
          }

          if (brackets[s]) {
            stack.push(s);
            continue;
          }

          if (e === s) {
            stack.pop();
          }
        }
      }

      closeIdx = i;
      if (closeIdx === -1) {
        arr[arr.length - 1] += ch;
        continue;
      }

      ch = str.slice(idx, closeIdx + 1);
      tok.val = ch;
      tok.idx = idx = closeIdx;
    }

    if (quotes.indexOf(ch) !== -1) {
      closeIdx = getClosingQuote(str, ch, idx + 1);
      if (closeIdx === -1) {
        arr[arr.length - 1] += ch;
        continue;
      }

      if (keepQuotes(ch, opts) === true) {
        ch = str.slice(idx, closeIdx + 1);
      } else {
        ch = str.slice(idx + 1, closeIdx);
      }

      tok.val = ch;
      tok.idx = idx = closeIdx;
    }

    if (typeof fn === 'function') {
      fn(tok, tokens);
      ch = tok.val;
      idx = tok.idx;
    }

    if (tok.val === sep && tok.split !== false) {
      arr.push('');
      continue;
    }

    arr[arr.length - 1] += tok.val;
  }

  return arr;
};

function getClosingQuote(str, ch, i, brackets) {
  var idx = str.indexOf(ch, i);
  if (str.charAt(idx - 1) === '\\') {
    return getClosingQuote(str, ch, idx + 1);
  }
  return idx;
}

function keepQuotes(ch, opts) {
  if (opts.keepDoubleQuotes === true && ch === '"') return true;
  if (opts.keepSingleQuotes === true && ch === "'") return true;
  return opts.keepQuotes;
}

function keepEscaping(opts, str, idx) {
  if (typeof opts.keepEscaping === 'function') {
    return opts.keepEscaping(str, idx);
  }
  return opts.keepEscaping === true || str[idx + 1] === '\\';
}

/*!
 * arr-flatten <https://github.com/jonschlinkert/arr-flatten>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var arrFlatten = function (arr) {
  return flat(arr, []);
};

function flat(arr, res) {
  var i = 0, cur;
  var len = arr.length;
  for (; i < len; i++) {
    cur = arr[i];
    Array.isArray(cur) ? flat(cur, res) : res.push(cur);
  }
  return res;
}

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
var isBuffer_1 = function (obj) {
  return obj != null && (isBuffer$1(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
};

function isBuffer$1 (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer$1(obj.slice(0, 0))
}

var toString$1 = Object.prototype.toString;

/**
 * Get the native `typeof` a value.
 *
 * @param  {*} `val`
 * @return {*} Native javascript type
 */

var kindOf$1 = function kindOf(val) {
  // primitivies
  if (typeof val === 'undefined') {
    return 'undefined';
  }
  if (val === null) {
    return 'null';
  }
  if (val === true || val === false || val instanceof Boolean) {
    return 'boolean';
  }
  if (typeof val === 'string' || val instanceof String) {
    return 'string';
  }
  if (typeof val === 'number' || val instanceof Number) {
    return 'number';
  }

  // functions
  if (typeof val === 'function' || val instanceof Function) {
    return 'function';
  }

  // array
  if (typeof Array.isArray !== 'undefined' && Array.isArray(val)) {
    return 'array';
  }

  // check for instances of RegExp and Date before calling `toString`
  if (val instanceof RegExp) {
    return 'regexp';
  }
  if (val instanceof Date) {
    return 'date';
  }

  // other objects
  var type = toString$1.call(val);

  if (type === '[object RegExp]') {
    return 'regexp';
  }
  if (type === '[object Date]') {
    return 'date';
  }
  if (type === '[object Arguments]') {
    return 'arguments';
  }
  if (type === '[object Error]') {
    return 'error';
  }

  // buffer
  if (isBuffer_1(val)) {
    return 'buffer';
  }

  // es6: Map, WeakMap, Set, WeakSet
  if (type === '[object Set]') {
    return 'set';
  }
  if (type === '[object WeakSet]') {
    return 'weakset';
  }
  if (type === '[object Map]') {
    return 'map';
  }
  if (type === '[object WeakMap]') {
    return 'weakmap';
  }
  if (type === '[object Symbol]') {
    return 'symbol';
  }

  // typed arrays
  if (type === '[object Int8Array]') {
    return 'int8array';
  }
  if (type === '[object Uint8Array]') {
    return 'uint8array';
  }
  if (type === '[object Uint8ClampedArray]') {
    return 'uint8clampedarray';
  }
  if (type === '[object Int16Array]') {
    return 'int16array';
  }
  if (type === '[object Uint16Array]') {
    return 'uint16array';
  }
  if (type === '[object Int32Array]') {
    return 'int32array';
  }
  if (type === '[object Uint32Array]') {
    return 'uint32array';
  }
  if (type === '[object Float32Array]') {
    return 'float32array';
  }
  if (type === '[object Float64Array]') {
    return 'float64array';
  }

  // must be a plain object
  return 'object';
};

var isNumber = function isNumber(num) {
  var type = kindOf$1(num);

  if (type === 'string') {
    if (!num.trim()) return false;
  } else if (type !== 'number') {
    return false;
  }

  return (num - num + 1) >= 0;
};

var extendShallow$2 = function extend(o/*, objects*/) {
  if (!isExtendable$1(o)) { o = {}; }

  var len = arguments.length;
  for (var i = 1; i < len; i++) {
    var obj = arguments[i];

    if (isExtendable$1(obj)) {
      assign$2(o, obj);
    }
  }
  return o;
};

function assign$2(a, b) {
  for (var key in b) {
    if (hasOwn$2(b, key)) {
      a[key] = b[key];
    }
  }
}

/**
 * Returns true if the given `key` is an own property of `obj`.
 */

function hasOwn$2(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/*!
 * repeat-string <https://github.com/jonschlinkert/repeat-string>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

/**
 * Results cache
 */

var res = '';
var cache$1;

/**
 * Expose `repeat`
 */

var repeatString = repeat;

/**
 * Repeat the given `string` the specified `number`
 * of times.
 *
 * **Example:**
 *
 * ```js
 * var repeat = require('repeat-string');
 * repeat('A', 5);
 * //=> AAAAA
 * ```
 *
 * @param {String} `string` The string to repeat
 * @param {Number} `number` The number of times to repeat the string
 * @return {String} Repeated string
 * @api public
 */

function repeat(str, num) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  }

  // cover common, quick use cases
  if (num === 1) return str;
  if (num === 2) return str + str;

  var max = str.length * num;
  if (cache$1 !== str || typeof cache$1 === 'undefined') {
    cache$1 = str;
    res = '';
  } else if (res.length >= max) {
    return res.substr(0, max);
  }

  while (max > res.length && num > 1) {
    if (num & 1) {
      res += str;
    }

    num >>= 1;
    str += str;
  }

  res += str;
  res = res.substr(0, max);
  return res;
}

var cache$2 = {};

function toRegexRange(min, max, options) {
  if (isNumber(min) === false) {
    throw new RangeError('toRegexRange: first argument is invalid.');
  }

  if (typeof max === 'undefined' || min === max) {
    return String(min);
  }

  if (isNumber(max) === false) {
    throw new RangeError('toRegexRange: second argument is invalid.');
  }

  options = options || {};
  var relax = String(options.relaxZeros);
  var shorthand = String(options.shorthand);
  var capture = String(options.capture);
  var key = min + ':' + max + '=' + relax + shorthand + capture;
  if (cache$2.hasOwnProperty(key)) {
    return cache$2[key].result;
  }

  var a = Math.min(min, max);
  var b = Math.max(min, max);

  if (Math.abs(a - b) === 1) {
    var result = min + '|' + max;
    if (options.capture) {
      return '(' + result + ')';
    }
    return result;
  }

  var isPadded = padding(min) || padding(max);
  var positives = [];
  var negatives = [];

  var tok = {min: min, max: max, a: a, b: b};
  if (isPadded) {
    tok.isPadded = isPadded;
    tok.maxLen = String(tok.max).length;
  }

  if (a < 0) {
    var newMin = b < 0 ? Math.abs(b) : 1;
    var newMax = Math.abs(a);
    negatives = splitToPatterns(newMin, newMax, tok, options);
    a = tok.a = 0;
  }

  if (b >= 0) {
    positives = splitToPatterns(a, b, tok, options);
  }

  tok.negatives = negatives;
  tok.positives = positives;
  tok.result = siftPatterns(negatives, positives, options);

  if (options.capture && (positives.length + negatives.length) > 1) {
    tok.result = '(' + tok.result + ')';
  }

  cache$2[key] = tok;
  return tok.result;
}

function siftPatterns(neg, pos, options) {
  var onlyNegative = filterPatterns(neg, pos, '-', false, options) || [];
  var onlyPositive = filterPatterns(pos, neg, '', false, options) || [];
  var intersected = filterPatterns(neg, pos, '-?', true, options) || [];
  var subpatterns = onlyNegative.concat(intersected).concat(onlyPositive);
  return subpatterns.join('|');
}

function splitToRanges(min, max) {
  min = Number(min);
  max = Number(max);

  var nines = 1;
  var stops = [max];
  var stop = +countNines(min, nines);

  while (min <= stop && stop <= max) {
    stops = push(stops, stop);
    nines += 1;
    stop = +countNines(min, nines);
  }

  var zeros = 1;
  stop = countZeros(max + 1, zeros) - 1;

  while (min < stop && stop <= max) {
    stops = push(stops, stop);
    zeros += 1;
    stop = countZeros(max + 1, zeros) - 1;
  }

  stops.sort(compare);
  return stops;
}

/**
 * Convert a range to a regex pattern
 * @param {Number} `start`
 * @param {Number} `stop`
 * @return {String}
 */

function rangeToPattern(start, stop, options) {
  if (start === stop) {
    return {pattern: String(start), digits: []};
  }

  var zipped = zip(String(start), String(stop));
  var len = zipped.length, i = -1;

  var pattern = '';
  var digits = 0;

  while (++i < len) {
    var numbers = zipped[i];
    var startDigit = numbers[0];
    var stopDigit = numbers[1];

    if (startDigit === stopDigit) {
      pattern += startDigit;

    } else if (startDigit !== '0' || stopDigit !== '9') {
      pattern += toCharacterClass(startDigit, stopDigit);

    } else {
      digits += 1;
    }
  }

  if (digits) {
    pattern += options.shorthand ? '\\d' : '[0-9]';
  }

  return { pattern: pattern, digits: [digits] };
}

function splitToPatterns(min, max, tok, options) {
  var ranges = splitToRanges(min, max);
  var len = ranges.length;
  var idx = -1;

  var tokens = [];
  var start = min;
  var prev;

  while (++idx < len) {
    var range = ranges[idx];
    var obj = rangeToPattern(start, range, options);
    var zeros = '';

    if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
      if (prev.digits.length > 1) {
        prev.digits.pop();
      }
      prev.digits.push(obj.digits[0]);
      prev.string = prev.pattern + toQuantifier(prev.digits);
      start = range + 1;
      continue;
    }

    if (tok.isPadded) {
      zeros = padZeros(range, tok);
    }

    obj.string = zeros + obj.pattern + toQuantifier(obj.digits);
    tokens.push(obj);
    start = range + 1;
    prev = obj;
  }

  return tokens;
}

function filterPatterns(arr, comparison, prefix, intersection, options) {
  var res = [];

  for (var i = 0; i < arr.length; i++) {
    var tok = arr[i];
    var ele = tok.string;

    if (options.relaxZeros !== false) {
      if (prefix === '-' && ele.charAt(0) === '0') {
        if (ele.charAt(1) === '{') {
          ele = '0*' + ele.replace(/^0\{\d+\}/, '');
        } else {
          ele = '0*' + ele.slice(1);
        }
      }
    }

    if (!intersection && !contains(comparison, 'string', ele)) {
      res.push(prefix + ele);
    }

    if (intersection && contains(comparison, 'string', ele)) {
      res.push(prefix + ele);
    }
  }
  return res;
}

/**
 * Zip strings (`for in` can be used on string characters)
 */

function zip(a, b) {
  var arr = [];
  for (var ch in a) arr.push([a[ch], b[ch]]);
  return arr;
}

function compare(a, b) {
  return a > b ? 1 : b > a ? -1 : 0;
}

function push(arr, ele) {
  if (arr.indexOf(ele) === -1) arr.push(ele);
  return arr;
}

function contains(arr, key, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return true;
    }
  }
  return false;
}

function countNines(min, len) {
  return String(min).slice(0, -len) + repeatString('9', len);
}

function countZeros(integer, zeros) {
  return integer - (integer % Math.pow(10, zeros));
}

function toQuantifier(digits) {
  var start = digits[0];
  var stop = digits[1] ? (',' + digits[1]) : '';
  if (!stop && (!start || start === 1)) {
    return '';
  }
  return '{' + start + stop + '}';
}

function toCharacterClass(a, b) {
  return '[' + a + ((b - a === 1) ? '' : '-') + b + ']';
}

function padding(str) {
  return /^-?(0+)\d/.exec(str);
}

function padZeros(val, tok) {
  if (tok.isPadded) {
    var diff = Math.abs(tok.maxLen - String(val).length);
    switch (diff) {
      case 0:
        return '';
      case 1:
        return '0';
      default: {
        return '0{' + diff + '}';
      }
    }
  }
  return val;
}

/**
 * Expose `toRegexRange`
 */

var toRegexRange_1 = toRegexRange;

/**
 * Return a range of numbers or letters.
 *
 * @param  {String} `start` Start of the range
 * @param  {String} `stop` End of the range
 * @param  {String} `step` Increment or decrement to use.
 * @param  {Function} `fn` Custom function to modify each element in the range.
 * @return {Array}
 */

function fillRange(start, stop, step, options) {
  if (typeof start === 'undefined') {
    return [];
  }

  if (typeof stop === 'undefined' || start === stop) {
    // special case, for handling negative zero
    var isString = typeof start === 'string';
    if (isNumber(start) && !toNumber(start)) {
      return [isString ? '0' : 0];
    }
    return [start];
  }

  if (typeof step !== 'number' && typeof step !== 'string') {
    options = step;
    step = undefined;
  }

  if (typeof options === 'function') {
    options = { transform: options };
  }

  var opts = extendShallow$2({step: step}, options);
  if (opts.step && !isValidNumber(opts.step)) {
    if (opts.strictRanges === true) {
      throw new TypeError('expected options.step to be a number');
    }
    return [];
  }

  opts.isNumber = isValidNumber(start) && isValidNumber(stop);
  if (!opts.isNumber && !isValid(start, stop)) {
    if (opts.strictRanges === true) {
      throw new RangeError('invalid range arguments: ' + util$3.inspect([start, stop]));
    }
    return [];
  }

  opts.isPadded = isPadded(start) || isPadded(stop);
  opts.toString = opts.stringify
    || typeof opts.step === 'string'
    || typeof start === 'string'
    || typeof stop === 'string'
    || !opts.isNumber;

  if (opts.isPadded) {
    opts.maxLength = Math.max(String(start).length, String(stop).length);
  }

  // support legacy minimatch/fill-range options
  if (typeof opts.optimize === 'boolean') opts.toRegex = opts.optimize;
  if (typeof opts.makeRe === 'boolean') opts.toRegex = opts.makeRe;
  return expand(start, stop, opts);
}

function expand(start, stop, options) {
  var a = options.isNumber ? toNumber(start) : start.charCodeAt(0);
  var b = options.isNumber ? toNumber(stop) : stop.charCodeAt(0);

  var step = Math.abs(toNumber(options.step)) || 1;
  if (options.toRegex && step === 1) {
    return toRange(a, b, start, stop, options);
  }

  var zero = {greater: [], lesser: []};
  var asc = a < b;
  var arr = new Array(Math.round((asc ? b - a : a - b) / step));
  var idx = 0;

  while (asc ? a <= b : a >= b) {
    var val = options.isNumber ? a : String.fromCharCode(a);
    if (options.toRegex && (val >= 0 || !options.isNumber)) {
      zero.greater.push(val);
    } else {
      zero.lesser.push(Math.abs(val));
    }

    if (options.isPadded) {
      val = zeros(val, options);
    }

    if (options.toString) {
      val = String(val);
    }

    if (typeof options.transform === 'function') {
      arr[idx++] = options.transform(val, a, b, step, idx, arr, options);
    } else {
      arr[idx++] = val;
    }

    if (asc) {
      a += step;
    } else {
      a -= step;
    }
  }

  if (options.toRegex === true) {
    return toSequence(arr, zero, options);
  }
  return arr;
}

function toRange(a, b, start, stop, options) {
  if (options.isPadded) {
    return toRegexRange_1(start, stop, options);
  }

  if (options.isNumber) {
    return toRegexRange_1(Math.min(a, b), Math.max(a, b), options);
  }

  var start = String.fromCharCode(Math.min(a, b));
  var stop = String.fromCharCode(Math.max(a, b));
  return '[' + start + '-' + stop + ']';
}

function toSequence(arr, zeros, options) {
  var greater = '', lesser = '';
  if (zeros.greater.length) {
    greater = zeros.greater.join('|');
  }
  if (zeros.lesser.length) {
    lesser = '-(' + zeros.lesser.join('|') + ')';
  }
  var res = greater && lesser
    ? greater + '|' + lesser
    : greater || lesser;

  if (options.capture) {
    return '(' + res + ')';
  }
  return res;
}

function zeros(val, options) {
  if (options.isPadded) {
    var str = String(val);
    var len = str.length;
    var dash = '';
    if (str.charAt(0) === '-') {
      dash = '-';
      str = str.slice(1);
    }
    var diff = options.maxLength - len;
    var pad = repeatString('0', diff);
    val = (dash + pad + str);
  }
  if (options.stringify) {
    return String(val);
  }
  return val;
}

function toNumber(val) {
  return Number(val) || 0;
}

function isPadded(str) {
  return /^-?0\d/.test(str);
}

function isValid(min, max) {
  return (isValidNumber(min) || isValidLetter(min))
      && (isValidNumber(max) || isValidLetter(max));
}

function isValidLetter(ch) {
  return typeof ch === 'string' && ch.length === 1 && /^\w+$/.test(ch);
}

function isValidNumber(n) {
  return isNumber(n) && !/\./.test(n);
}

/**
 * Expose `fillRange`
 * @type {Function}
 */

var fillRange_1 = fillRange;

/*!
 * repeat-element <https://github.com/jonschlinkert/repeat-element>
 *
 * Copyright (c) 2015-present, Jon Schlinkert.
 * Licensed under the MIT license.
 */

var repeatElement = function repeat(ele, num) {
  var arr = new Array(num);

  for (var i = 0; i < num; i++) {
    arr[i] = ele;
  }

  return arr;
};

var utils_1 = createCommonjsModule(function (module) {


var utils = module.exports;

/**
 * Module dependencies
 */

utils.extend = extendShallow$1;
utils.flatten = arrFlatten;
utils.isObject = isobject;
utils.fillRange = fillRange_1;
utils.repeat = repeatElement;
utils.unique = arrayUnique;

utils.define = function(obj, key, val) {
  Object.defineProperty(obj, key, {
    writable: true,
    configurable: true,
    enumerable: false,
    value: val
  });
};

/**
 * Returns true if the given string contains only empty brace sets.
 */

utils.isEmptySets = function(str) {
  return /^(?:\{,\})+$/.test(str);
};

/**
 * Returns true if the given string contains only empty brace sets.
 */

utils.isQuotedString = function(str) {
  var open = str.charAt(0);
  if (open === '\'' || open === '"' || open === '`') {
    return str.slice(-1) === open;
  }
  return false;
};

/**
 * Create the key to use for memoization. The unique key is generated
 * by iterating over the options and concatenating key-value pairs
 * to the pattern string.
 */

utils.createKey = function(pattern, options) {
  var id = pattern;
  if (typeof options === 'undefined') {
    return id;
  }
  var keys = Object.keys(options);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    id += ';' + key + '=' + String(options[key]);
  }
  return id;
};

/**
 * Normalize options
 */

utils.createOptions = function(options) {
  var opts = utils.extend.apply(null, arguments);
  if (typeof opts.expand === 'boolean') {
    opts.optimize = !opts.expand;
  }
  if (typeof opts.optimize === 'boolean') {
    opts.expand = !opts.optimize;
  }
  if (opts.optimize === true) {
    opts.makeRe = true;
  }
  return opts;
};

/**
 * Join patterns in `a` to patterns in `b`
 */

utils.join = function(a, b, options) {
  options = options || {};
  a = utils.arrayify(a);
  b = utils.arrayify(b);

  if (!a.length) return b;
  if (!b.length) return a;

  var len = a.length;
  var idx = -1;
  var arr = [];

  while (++idx < len) {
    var val = a[idx];
    if (Array.isArray(val)) {
      for (var i = 0; i < val.length; i++) {
        val[i] = utils.join(val[i], b, options);
      }
      arr.push(val);
      continue;
    }

    for (var j = 0; j < b.length; j++) {
      var bval = b[j];

      if (Array.isArray(bval)) {
        arr.push(utils.join(val, bval, options));
      } else {
        arr.push(val + bval);
      }
    }
  }
  return arr;
};

/**
 * Split the given string on `,` if not escaped.
 */

utils.split = function(str, options) {
  var opts = utils.extend({sep: ','}, options);
  if (typeof opts.keepQuotes !== 'boolean') {
    opts.keepQuotes = true;
  }
  if (opts.unescape === false) {
    opts.keepEscaping = true;
  }
  return splitString(str, opts, utils.escapeBrackets(opts));
};

/**
 * Expand ranges or sets in the given `pattern`.
 *
 * @param {String} `str`
 * @param {Object} `options`
 * @return {Object}
 */

utils.expand = function(str, options) {
  var opts = utils.extend({rangeLimit: 10000}, options);
  var segs = utils.split(str, opts);
  var tok = { segs: segs };

  if (utils.isQuotedString(str)) {
    return tok;
  }

  if (opts.rangeLimit === true) {
    opts.rangeLimit = 10000;
  }

  if (segs.length > 1) {
    if (opts.optimize === false) {
      tok.val = segs[0];
      return tok;
    }

    tok.segs = utils.stringifyArray(tok.segs);
  } else if (segs.length === 1) {
    var arr = str.split('..');

    if (arr.length === 1) {
      tok.val = tok.segs[tok.segs.length - 1] || tok.val || str;
      tok.segs = [];
      return tok;
    }

    if (arr.length === 2 && arr[0] === arr[1]) {
      tok.escaped = true;
      tok.val = arr[0];
      tok.segs = [];
      return tok;
    }

    if (arr.length > 1) {
      if (opts.optimize !== false) {
        opts.optimize = true;
        delete opts.expand;
      }

      if (opts.optimize !== true) {
        var min = Math.min(arr[0], arr[1]);
        var max = Math.max(arr[0], arr[1]);
        var step = arr[2] || 1;

        if (opts.rangeLimit !== false && ((max - min) / step >= opts.rangeLimit)) {
          throw new RangeError('expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.');
        }
      }

      arr.push(opts);
      tok.segs = utils.fillRange.apply(null, arr);

      if (!tok.segs.length) {
        tok.escaped = true;
        tok.val = str;
        return tok;
      }

      if (opts.optimize === true) {
        tok.segs = utils.stringifyArray(tok.segs);
      }

      if (tok.segs === '') {
        tok.val = str;
      } else {
        tok.val = tok.segs[0];
      }
      return tok;
    }
  } else {
    tok.val = str;
  }
  return tok;
};

/**
 * Ensure commas inside brackets and parens are not split.
 * @param {Object} `tok` Token from the `split-string` module
 * @return {undefined}
 */

utils.escapeBrackets = function(options) {
  return function(tok) {
    if (tok.escaped && tok.val === 'b') {
      tok.val = '\\b';
      return;
    }

    if (tok.val !== '(' && tok.val !== '[') return;
    var opts = utils.extend({}, options);
    var stack = [];
    var val = tok.val;
    var str = tok.str;
    var i = tok.idx - 1;

    while (++i < str.length) {
      var ch = str[i];

      if (ch === '\\') {
        val += (opts.keepEscaping === false ? '' : ch) + str[++i];
        continue;
      }

      if (ch === '(') {
        stack.push(ch);
      }

      if (ch === '[') {
        stack.push(ch);
      }

      if (ch === ')') {
        stack.pop();
        if (!stack.length) {
          val += ch;
          break;
        }
      }

      if (ch === ']') {
        stack.pop();
        if (!stack.length) {
          val += ch;
          break;
        }
      }
      val += ch;
    }

    tok.split = false;
    tok.val = val.slice(1);
    tok.idx = i;
  };
};

/**
 * Returns true if the given string looks like a regex quantifier
 * @return {Boolean}
 */

utils.isQuantifier = function(str) {
  return /^(?:[0-9]?,[0-9]|[0-9],)$/.test(str);
};

/**
 * Cast `val` to an array.
 * @param {*} `val`
 */

utils.stringifyArray = function(arr) {
  return [utils.arrayify(arr).join('|')];
};

/**
 * Cast `val` to an array.
 * @param {*} `val`
 */

utils.arrayify = function(arr) {
  if (typeof arr === 'undefined') {
    return [];
  }
  if (typeof arr === 'string') {
    return [arr];
  }
  return arr;
};

/**
 * Returns true if the given `str` is a non-empty string
 * @return {Boolean}
 */

utils.isString = function(str) {
  return str != null && typeof str === 'string';
};

/**
 * Get the last element from `array`
 * @param {Array} `array`
 * @return {*}
 */

utils.last = function(arr, n) {
  return arr[arr.length - (n || 1)];
};

utils.escapeRegex = function(str) {
  return str.replace(/\\?([!^*?()[\]{}+?/])/g, '\\$1');
};
});

var compilers = function(braces, options) {
  braces.compiler

    /**
     * bos
     */

    .set('bos', function() {
      if (this.output) return;
      this.ast.queue = isEscaped(this.ast) ? [this.ast.val] : [];
      this.ast.count = 1;
    })

    /**
     * Square brackets
     */

    .set('bracket', function(node) {
      var close = node.close;
      var open = !node.escaped ? '[' : '\\[';
      var negated = node.negated;
      var inner = node.inner;

      inner = inner.replace(/\\(?=[\\\w]|$)/g, '\\\\');
      if (inner === ']-') {
        inner = '\\]\\-';
      }

      if (negated && inner.indexOf('.') === -1) {
        inner += '.';
      }
      if (negated && inner.indexOf('/') === -1) {
        inner += '/';
      }

      var val = open + negated + inner + close;
      var queue = node.parent.queue;
      var last = utils_1.arrayify(queue.pop());

      queue.push(utils_1.join(last, val));
      queue.push.apply(queue, []);
    })

    /**
     * Brace
     */

    .set('brace', function(node) {
      node.queue = isEscaped(node) ? [node.val] : [];
      node.count = 1;
      return this.mapVisit(node.nodes);
    })

    /**
     * Open
     */

    .set('brace.open', function(node) {
      node.parent.open = node.val;
    })

    /**
     * Inner
     */

    .set('text', function(node) {
      var queue = node.parent.queue;
      var escaped = node.escaped;
      var segs = [node.val];

      if (node.optimize === false) {
        options = utils_1.extend({}, options, {optimize: false});
      }

      if (node.multiplier > 1) {
        node.parent.count *= node.multiplier;
      }

      if (options.quantifiers === true && utils_1.isQuantifier(node.val)) {
        escaped = true;

      } else if (node.val.length > 1) {
        if (isType(node.parent, 'brace') && !isEscaped(node)) {
          var expanded = utils_1.expand(node.val, options);
          segs = expanded.segs;

          if (expanded.isOptimized) {
            node.parent.isOptimized = true;
          }

          // if nothing was expanded, we probably have a literal brace
          if (!segs.length) {
            var val = (expanded.val || node.val);
            if (options.unescape !== false) {
              // unescape unexpanded brace sequence/set separators
              val = val.replace(/\\([,.])/g, '$1');
              // strip quotes
              val = val.replace(/["'`]/g, '');
            }

            segs = [val];
            escaped = true;
          }
        }

      } else if (node.val === ',') {
        if (options.expand) {
          node.parent.queue.push(['']);
          segs = [''];
        } else {
          segs = ['|'];
        }
      } else {
        escaped = true;
      }

      if (escaped && isType(node.parent, 'brace')) {
        if (node.parent.nodes.length <= 4 && node.parent.count === 1) {
          node.parent.escaped = true;
        } else if (node.parent.length <= 3) {
          node.parent.escaped = true;
        }
      }

      if (!hasQueue(node.parent)) {
        node.parent.queue = segs;
        return;
      }

      var last = utils_1.arrayify(queue.pop());
      if (node.parent.count > 1 && options.expand) {
        last = multiply(last, node.parent.count);
        node.parent.count = 1;
      }

      queue.push(utils_1.join(utils_1.flatten(last), segs.shift()));
      queue.push.apply(queue, segs);
    })

    /**
     * Close
     */

    .set('brace.close', function(node) {
      var queue = node.parent.queue;
      var prev = node.parent.parent;
      var last = prev.queue.pop();
      var open = node.parent.open;
      var close = node.val;

      if (open && close && isOptimized(node, options)) {
        open = '(';
        close = ')';
      }

      // if a close brace exists, and the previous segment is one character
      // don't wrap the result in braces or parens
      var ele = utils_1.last(queue);
      if (node.parent.count > 1 && options.expand) {
        ele = multiply(queue.pop(), node.parent.count);
        node.parent.count = 1;
        queue.push(ele);
      }

      if (close && typeof ele === 'string' && ele.length === 1) {
        open = '';
        close = '';
      }

      if ((isLiteralBrace(node, options) || noInner(node)) && !node.parent.hasEmpty) {
        queue.push(utils_1.join(open, queue.pop() || ''));
        queue = utils_1.flatten(utils_1.join(queue, close));
      }

      if (typeof last === 'undefined') {
        prev.queue = [queue];
      } else {
        prev.queue.push(utils_1.flatten(utils_1.join(last, queue)));
      }
    })

    /**
     * eos
     */

    .set('eos', function(node) {
      if (this.input) return;

      if (options.optimize !== false) {
        this.output = utils_1.last(utils_1.flatten(this.ast.queue));
      } else if (Array.isArray(utils_1.last(this.ast.queue))) {
        this.output = utils_1.flatten(this.ast.queue.pop());
      } else {
        this.output = utils_1.flatten(this.ast.queue);
      }

      if (node.parent.count > 1 && options.expand) {
        this.output = multiply(this.output, node.parent.count);
      }

      this.output = utils_1.arrayify(this.output);
      this.ast.queue = [];
    });

};

/**
 * Multiply the segments in the current brace level
 */

function multiply(queue, n, options) {
  return utils_1.flatten(utils_1.repeat(utils_1.arrayify(queue), n));
}

/**
 * Return true if `node` is escaped
 */

function isEscaped(node) {
  return node.escaped === true;
}

/**
 * Returns true if regex parens should be used for sets. If the parent `type`
 * is not `brace`, then we're on a root node, which means we should never
 * expand segments and open/close braces should be `{}` (since this indicates
 * a brace is missing from the set)
 */

function isOptimized(node, options) {
  if (node.parent.isOptimized) return true;
  return isType(node.parent, 'brace')
    && !isEscaped(node.parent)
    && options.expand !== true;
}

/**
 * Returns true if the value in `node` should be wrapped in a literal brace.
 * @return {Boolean}
 */

function isLiteralBrace(node, options) {
  return isEscaped(node.parent) || options.optimize !== false;
}

/**
 * Returns true if the given `node` does not have an inner value.
 * @return {Boolean}
 */

function noInner(node, type) {
  if (node.parent.queue.length === 1) {
    return true;
  }
  var nodes = node.parent.nodes;
  return nodes.length === 3
    && isType(nodes[0], 'brace.open')
    && !isType(nodes[1], 'text')
    && isType(nodes[2], 'brace.close');
}

/**
 * Returns true if the given `node` is the given `type`
 * @return {Boolean}
 */

function isType(node, type) {
  return typeof node !== 'undefined' && node.type === type;
}

/**
 * Returns true if the given `node` has a non-empty queue.
 * @return {Boolean}
 */

function hasQueue(node) {
  return Array.isArray(node.queue) && node.queue.length;
}

// accessor descriptor properties
var accessor$1 = {
  get: 'function',
  set: 'function',
  configurable: 'boolean',
  enumerable: 'boolean'
};

function isAccessorDescriptor$1(obj, prop) {
  if (typeof prop === 'string') {
    var val = Object.getOwnPropertyDescriptor(obj, prop);
    return typeof val !== 'undefined';
  }

  if (kindOf(obj) !== 'object') {
    return false;
  }

  if (has$1(obj, 'value') || has$1(obj, 'writable')) {
    return false;
  }

  if (!has$1(obj, 'get') || typeof obj.get !== 'function') {
    return false;
  }

  // tldr: it's valid to have "set" be undefined
  // "set" might be undefined if `Object.getOwnPropertyDescriptor`
  // was used to get the value, and only `get` was defined by the user
  if (has$1(obj, 'set') && typeof obj[key] !== 'function' && typeof obj[key] !== 'undefined') {
    return false;
  }

  for (var key in obj) {
    if (!accessor$1.hasOwnProperty(key)) {
      continue;
    }

    if (kindOf(obj[key]) === accessor$1[key]) {
      continue;
    }

    if (typeof obj[key] !== 'undefined') {
      return false;
    }
  }
  return true;
}

function has$1(obj, key) {
  return {}.hasOwnProperty.call(obj, key);
}

/**
 * Expose `isAccessorDescriptor`
 */

var isAccessorDescriptor_1$1 = isAccessorDescriptor$1;

var isDataDescriptor$1 = function isDataDescriptor(obj, prop) {
  // data descriptor properties
  var data = {
    configurable: 'boolean',
    enumerable: 'boolean',
    writable: 'boolean'
  };

  if (kindOf(obj) !== 'object') {
    return false;
  }

  if (typeof prop === 'string') {
    var val = Object.getOwnPropertyDescriptor(obj, prop);
    return typeof val !== 'undefined';
  }

  if (!('value' in obj) && !('writable' in obj)) {
    return false;
  }

  for (var key in obj) {
    if (key === 'value') continue;

    if (!data.hasOwnProperty(key)) {
      continue;
    }

    if (kindOf(obj[key]) === data[key]) {
      continue;
    }

    if (typeof obj[key] !== 'undefined') {
      return false;
    }
  }
  return true;
};

var isDescriptor$1 = function isDescriptor(obj, key) {
  if (kindOf(obj) !== 'object') {
    return false;
  }
  if ('get' in obj) {
    return isAccessorDescriptor_1$1(obj, key);
  }
  return isDataDescriptor$1(obj, key);
};

var defineProperty$1 = function defineProperty(obj, prop, val) {
  if (typeof obj !== 'object' && typeof obj !== 'function') {
    throw new TypeError('expected an object or function.');
  }

  if (typeof prop !== 'string') {
    throw new TypeError('expected `prop` to be a string.');
  }

  if (isDescriptor$1(val) && ('set' in val || 'get' in val)) {
    return Object.defineProperty(obj, prop, val);
  }

  return Object.defineProperty(obj, prop, {
    configurable: true,
    enumerable: false,
    writable: true,
    value: val
  });
};

var toString$2 = Object.prototype.toString;

/**
 * Get the native `typeof` a value.
 *
 * @param  {*} `val`
 * @return {*} Native javascript type
 */

var kindOf$2 = function kindOf(val) {
  // primitivies
  if (typeof val === 'undefined') {
    return 'undefined';
  }
  if (val === null) {
    return 'null';
  }
  if (val === true || val === false || val instanceof Boolean) {
    return 'boolean';
  }
  if (typeof val === 'string' || val instanceof String) {
    return 'string';
  }
  if (typeof val === 'number' || val instanceof Number) {
    return 'number';
  }

  // functions
  if (typeof val === 'function' || val instanceof Function) {
    return 'function';
  }

  // array
  if (typeof Array.isArray !== 'undefined' && Array.isArray(val)) {
    return 'array';
  }

  // check for instances of RegExp and Date before calling `toString`
  if (val instanceof RegExp) {
    return 'regexp';
  }
  if (val instanceof Date) {
    return 'date';
  }

  // other objects
  var type = toString$2.call(val);

  if (type === '[object RegExp]') {
    return 'regexp';
  }
  if (type === '[object Date]') {
    return 'date';
  }
  if (type === '[object Arguments]') {
    return 'arguments';
  }
  if (type === '[object Error]') {
    return 'error';
  }

  // buffer
  if (isBuffer_1(val)) {
    return 'buffer';
  }

  // es6: Map, WeakMap, Set, WeakSet
  if (type === '[object Set]') {
    return 'set';
  }
  if (type === '[object WeakSet]') {
    return 'weakset';
  }
  if (type === '[object Map]') {
    return 'map';
  }
  if (type === '[object WeakMap]') {
    return 'weakmap';
  }
  if (type === '[object Symbol]') {
    return 'symbol';
  }

  // typed arrays
  if (type === '[object Int8Array]') {
    return 'int8array';
  }
  if (type === '[object Uint8Array]') {
    return 'uint8array';
  }
  if (type === '[object Uint8ClampedArray]') {
    return 'uint8clampedarray';
  }
  if (type === '[object Int16Array]') {
    return 'int16array';
  }
  if (type === '[object Uint16Array]') {
    return 'uint16array';
  }
  if (type === '[object Int32Array]') {
    return 'int32array';
  }
  if (type === '[object Uint32Array]') {
    return 'uint32array';
  }
  if (type === '[object Float32Array]') {
    return 'float32array';
  }
  if (type === '[object Float64Array]') {
    return 'float64array';
  }

  // must be a plain object
  return 'object';
};

var snapdragonUtil = createCommonjsModule(function (module) {


var utils = module.exports;

/**
 * Returns true if the given value is a node.
 *
 * ```js
 * var Node = require('snapdragon-node');
 * var node = new Node({type: 'foo'});
 * console.log(utils.isNode(node)); //=> true
 * console.log(utils.isNode({})); //=> false
 * ```
 * @param {Object} `node` Instance of [snapdragon-node][]
 * @returns {Boolean}
 * @api public
 */

utils.isNode = function(node) {
  return kindOf$2(node) === 'object' && node.isNode === true;
};

/**
 * Emit an empty string for the given `node`.
 *
 * ```js
 * // do nothing for beginning-of-string
 * snapdragon.compiler.set('bos', utils.noop);
 * ```
 * @param {Object} `node` Instance of [snapdragon-node][]
 * @returns {undefined}
 * @api public
 */

utils.noop = function(node) {
  append(this, '', node);
};

/**
 * Appdend `node.val` to `compiler.output`, exactly as it was created
 * by the parser.
 *
 * ```js
 * snapdragon.compiler.set('text', utils.identity);
 * ```
 * @param {Object} `node` Instance of [snapdragon-node][]
 * @returns {undefined}
 * @api public
 */

utils.identity = function(node) {
  append(this, node.val, node);
};

/**
 * Previously named `.emit`, this method appends the given `val`
 * to `compiler.output` for the given node. Useful when you know
 * what value should be appended advance, regardless of the actual
 * value of `node.val`.
 *
 * ```js
 * snapdragon.compiler
 *   .set('i', function(node) {
 *     this.mapVisit(node);
 *   })
 *   .set('i.open', utils.append('<i>'))
 *   .set('i.close', utils.append('</i>'))
 * ```
 * @param {Object} `node` Instance of [snapdragon-node][]
 * @returns {Function} Returns a compiler middleware function.
 * @api public
 */

utils.append = function(val) {
  return function(node) {
    append(this, val, node);
  };
};

/**
 * Used in compiler middleware, this onverts an AST node into
 * an empty `text` node and deletes `node.nodes` if it exists.
 * The advantage of this method is that, as opposed to completely
 * removing the node, indices will not need to be re-calculated
 * in sibling nodes, and nothing is appended to the output.
 *
 * ```js
 * utils.toNoop(node);
 * // convert `node.nodes` to the given value instead of deleting it
 * utils.toNoop(node, []);
 * ```
 * @param {Object} `node` Instance of [snapdragon-node][]
 * @param {Array} `nodes` Optionally pass a new `nodes` value, to replace the existing `node.nodes` array.
 * @api public
 */

utils.toNoop = function(node, nodes) {
  if (nodes) {
    node.nodes = nodes;
  } else {
    delete node.nodes;
    node.type = 'text';
    node.val = '';
  }
};

/**
 * Visit `node` with the given `fn`. The built-in `.visit` method in snapdragon
 * automatically calls registered compilers, this allows you to pass a visitor
 * function.
 *
 * ```js
 * snapdragon.compiler.set('i', function(node) {
 *   utils.visit(node, function(childNode) {
 *     // do stuff with "childNode"
 *     return childNode;
 *   });
 * });
 * ```
 * @param {Object} `node` Instance of [snapdragon-node][]
 * @param {Function} `fn`
 * @return {Object} returns the node after recursively visiting all child nodes.
 * @api public
 */

utils.visit = function(node, fn) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  assert(isFunction(fn), 'expected a visitor function');
  fn(node);
  return node.nodes ? utils.mapVisit(node, fn) : node;
};

/**
 * Map [visit](#visit) the given `fn` over `node.nodes`. This is called by
 * [visit](#visit), use this method if you do not want `fn` to be called on
 * the first node.
 *
 * ```js
 * snapdragon.compiler.set('i', function(node) {
 *   utils.mapVisit(node, function(childNode) {
 *     // do stuff with "childNode"
 *     return childNode;
 *   });
 * });
 * ```
 * @param {Object} `node` Instance of [snapdragon-node][]
 * @param {Object} `options`
 * @param {Function} `fn`
 * @return {Object} returns the node
 * @api public
 */

utils.mapVisit = function(node, fn) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  assert(isArray(node.nodes), 'expected node.nodes to be an array');
  assert(isFunction(fn), 'expected a visitor function');

  for (var i = 0; i < node.nodes.length; i++) {
    utils.visit(node.nodes[i], fn);
  }
  return node;
};

/**
 * Unshift an `*.open` node onto `node.nodes`.
 *
 * ```js
 * var Node = require('snapdragon-node');
 * snapdragon.parser.set('brace', function(node) {
 *   var match = this.match(/^{/);
 *   if (match) {
 *     var parent = new Node({type: 'brace'});
 *     utils.addOpen(parent, Node);
 *     console.log(parent.nodes[0]):
 *     // { type: 'brace.open', val: '' };
 *
 *     // push the parent "brace" node onto the stack
 *     this.push(parent);
 *
 *     // return the parent node, so it's also added to the AST
 *     return brace;
 *   }
 * });
 * ```
 * @param {Object} `node` Instance of [snapdragon-node][]
 * @param {Function} `Node` (required) Node constructor function from [snapdragon-node][].
 * @param {Function} `filter` Optionaly specify a filter function to exclude the node.
 * @return {Object} Returns the created opening node.
 * @api public
 */

utils.addOpen = function(node, Node, val, filter) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  assert(isFunction(Node), 'expected Node to be a constructor function');

  if (typeof val === 'function') {
    filter = val;
    val = '';
  }

  if (typeof filter === 'function' && !filter(node)) return;
  var open = new Node({ type: node.type + '.open', val: val});
  var unshift = node.unshift || node.unshiftNode;
  if (typeof unshift === 'function') {
    unshift.call(node, open);
  } else {
    utils.unshiftNode(node, open);
  }
  return open;
};

/**
 * Push a `*.close` node onto `node.nodes`.
 *
 * ```js
 * var Node = require('snapdragon-node');
 * snapdragon.parser.set('brace', function(node) {
 *   var match = this.match(/^}/);
 *   if (match) {
 *     var parent = this.parent();
 *     if (parent.type !== 'brace') {
 *       throw new Error('missing opening: ' + '}');
 *     }
 *
 *     utils.addClose(parent, Node);
 *     console.log(parent.nodes[parent.nodes.length - 1]):
 *     // { type: 'brace.close', val: '' };
 *
 *     // no need to return a node, since the parent
 *     // was already added to the AST
 *     return;
 *   }
 * });
 * ```
 * @param {Object} `node` Instance of [snapdragon-node][]
 * @param {Function} `Node` (required) Node constructor function from [snapdragon-node][].
 * @param {Function} `filter` Optionaly specify a filter function to exclude the node.
 * @return {Object} Returns the created closing node.
 * @api public
 */

utils.addClose = function(node, Node, val, filter) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  assert(isFunction(Node), 'expected Node to be a constructor function');

  if (typeof val === 'function') {
    filter = val;
    val = '';
  }

  if (typeof filter === 'function' && !filter(node)) return;
  var close = new Node({ type: node.type + '.close', val: val});
  var push = node.push || node.pushNode;
  if (typeof push === 'function') {
    push.call(node, close);
  } else {
    utils.pushNode(node, close);
  }
  return close;
};

/**
 * Wraps the given `node` with `*.open` and `*.close` nodes.
 *
 * @param {Object} `node` Instance of [snapdragon-node][]
 * @param {Function} `Node` (required) Node constructor function from [snapdragon-node][].
 * @param {Function} `filter` Optionaly specify a filter function to exclude the node.
 * @return {Object} Returns the node
 * @api public
 */

utils.wrapNodes = function(node, Node, filter) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  assert(isFunction(Node), 'expected Node to be a constructor function');

  utils.addOpen(node, Node, filter);
  utils.addClose(node, Node, filter);
  return node;
};

/**
 * Push the given `node` onto `parent.nodes`, and set `parent` as `node.parent.
 *
 * ```js
 * var parent = new Node({type: 'foo'});
 * var node = new Node({type: 'bar'});
 * utils.pushNode(parent, node);
 * console.log(parent.nodes[0].type) // 'bar'
 * console.log(node.parent.type) // 'foo'
 * ```
 * @param {Object} `parent`
 * @param {Object} `node` Instance of [snapdragon-node][]
 * @return {Object} Returns the child node
 * @api public
 */

utils.pushNode = function(parent, node) {
  assert(utils.isNode(parent), 'expected parent node to be an instance of Node');
  assert(utils.isNode(node), 'expected node to be an instance of Node');

  node.define('parent', parent);
  parent.nodes = parent.nodes || [];
  parent.nodes.push(node);
  return node;
};

/**
 * Unshift `node` onto `parent.nodes`, and set `parent` as `node.parent.
 *
 * ```js
 * var parent = new Node({type: 'foo'});
 * var node = new Node({type: 'bar'});
 * utils.unshiftNode(parent, node);
 * console.log(parent.nodes[0].type) // 'bar'
 * console.log(node.parent.type) // 'foo'
 * ```
 * @param {Object} `parent`
 * @param {Object} `node` Instance of [snapdragon-node][]
 * @return {undefined}
 * @api public
 */

utils.unshiftNode = function(parent, node) {
  assert(utils.isNode(parent), 'expected parent node to be an instance of Node');
  assert(utils.isNode(node), 'expected node to be an instance of Node');

  node.define('parent', parent);
  parent.nodes = parent.nodes || [];
  parent.nodes.unshift(node);
};

/**
 * Pop the last `node` off of `parent.nodes`. The advantage of
 * using this method is that it checks for `node.nodes` and works
 * with any version of `snapdragon-node`.
 *
 * ```js
 * var parent = new Node({type: 'foo'});
 * utils.pushNode(parent, new Node({type: 'foo'}));
 * utils.pushNode(parent, new Node({type: 'bar'}));
 * utils.pushNode(parent, new Node({type: 'baz'}));
 * console.log(parent.nodes.length); //=> 3
 * utils.popNode(parent);
 * console.log(parent.nodes.length); //=> 2
 * ```
 * @param {Object} `parent`
 * @param {Object} `node` Instance of [snapdragon-node][]
 * @return {Number|Undefined} Returns the length of `node.nodes` or undefined.
 * @api public
 */

utils.popNode = function(node) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  if (typeof node.pop === 'function') {
    return node.pop();
  }
  return node.nodes && node.nodes.pop();
};

/**
 * Shift the first `node` off of `parent.nodes`. The advantage of
 * using this method is that it checks for `node.nodes` and works
 * with any version of `snapdragon-node`.
 *
 * ```js
 * var parent = new Node({type: 'foo'});
 * utils.pushNode(parent, new Node({type: 'foo'}));
 * utils.pushNode(parent, new Node({type: 'bar'}));
 * utils.pushNode(parent, new Node({type: 'baz'}));
 * console.log(parent.nodes.length); //=> 3
 * utils.shiftNode(parent);
 * console.log(parent.nodes.length); //=> 2
 * ```
 * @param {Object} `parent`
 * @param {Object} `node` Instance of [snapdragon-node][]
 * @return {Number|Undefined} Returns the length of `node.nodes` or undefined.
 * @api public
 */

utils.shiftNode = function(node) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  if (typeof node.shift === 'function') {
    return node.shift();
  }
  return node.nodes && node.nodes.shift();
};

/**
 * Remove the specified `node` from `parent.nodes`.
 *
 * ```js
 * var parent = new Node({type: 'abc'});
 * var foo = new Node({type: 'foo'});
 * utils.pushNode(parent, foo);
 * utils.pushNode(parent, new Node({type: 'bar'}));
 * utils.pushNode(parent, new Node({type: 'baz'}));
 * console.log(parent.nodes.length); //=> 3
 * utils.removeNode(parent, foo);
 * console.log(parent.nodes.length); //=> 2
 * ```
 * @param {Object} `parent`
 * @param {Object} `node` Instance of [snapdragon-node][]
 * @return {Object|undefined} Returns the removed node, if successful, or undefined if it does not exist on `parent.nodes`.
 * @api public
 */

utils.removeNode = function(parent, node) {
  assert(utils.isNode(parent), 'expected parent.node to be an instance of Node');
  assert(utils.isNode(node), 'expected node to be an instance of Node');

  if (!parent.nodes) {
    return null;
  }

  if (typeof parent.remove === 'function') {
    return parent.remove(node);
  }

  var idx = parent.nodes.indexOf(node);
  if (idx !== -1) {
    return parent.nodes.splice(idx, 1);
  }
};

/**
 * Returns true if `node.type` matches the given `type`. Throws a
 * `TypeError` if `node` is not an instance of `Node`.
 *
 * ```js
 * var Node = require('snapdragon-node');
 * var node = new Node({type: 'foo'});
 * console.log(utils.isType(node, 'foo')); // false
 * console.log(utils.isType(node, 'bar')); // true
 * ```
 * @param {Object} `node` Instance of [snapdragon-node][]
 * @param {String} `type`
 * @return {Boolean}
 * @api public
 */

utils.isType = function(node, type) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  switch (kindOf$2(type)) {
    case 'array':
      var types = type.slice();
      for (var i = 0; i < types.length; i++) {
        if (utils.isType(node, types[i])) {
          return true;
        }
      }
      return false;
    case 'string':
      return node.type === type;
    case 'regexp':
      return type.test(node.type);
    default: {
      throw new TypeError('expected "type" to be an array, string or regexp');
    }
  }
};

/**
 * Returns true if the given `node` has the given `type` in `node.nodes`.
 * Throws a `TypeError` if `node` is not an instance of `Node`.
 *
 * ```js
 * var Node = require('snapdragon-node');
 * var node = new Node({
 *   type: 'foo',
 *   nodes: [
 *     new Node({type: 'bar'}),
 *     new Node({type: 'baz'})
 *   ]
 * });
 * console.log(utils.hasType(node, 'xyz')); // false
 * console.log(utils.hasType(node, 'baz')); // true
 * ```
 * @param {Object} `node` Instance of [snapdragon-node][]
 * @param {String} `type`
 * @return {Boolean}
 * @api public
 */

utils.hasType = function(node, type) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  if (!Array.isArray(node.nodes)) return false;
  for (var i = 0; i < node.nodes.length; i++) {
    if (utils.isType(node.nodes[i], type)) {
      return true;
    }
  }
  return false;
};

/**
 * Returns the first node from `node.nodes` of the given `type`
 *
 * ```js
 * var node = new Node({
 *   type: 'foo',
 *   nodes: [
 *     new Node({type: 'text', val: 'abc'}),
 *     new Node({type: 'text', val: 'xyz'})
 *   ]
 * });
 *
 * var textNode = utils.firstOfType(node.nodes, 'text');
 * console.log(textNode.val);
 * //=> 'abc'
 * ```
 * @param {Array} `nodes`
 * @param {String} `type`
 * @return {Object|undefined} Returns the first matching node or undefined.
 * @api public
 */

utils.firstOfType = function(nodes, type) {
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    if (utils.isType(node, type)) {
      return node;
    }
  }
};

/**
 * Returns the node at the specified index, or the first node of the
 * given `type` from `node.nodes`.
 *
 * ```js
 * var node = new Node({
 *   type: 'foo',
 *   nodes: [
 *     new Node({type: 'text', val: 'abc'}),
 *     new Node({type: 'text', val: 'xyz'})
 *   ]
 * });
 *
 * var nodeOne = utils.findNode(node.nodes, 'text');
 * console.log(nodeOne.val);
 * //=> 'abc'
 *
 * var nodeTwo = utils.findNode(node.nodes, 1);
 * console.log(nodeTwo.val);
 * //=> 'xyz'
 * ```
 *
 * @param {Array} `nodes`
 * @param {String|Number} `type` Node type or index.
 * @return {Object} Returns a node or undefined.
 * @api public
 */

utils.findNode = function(nodes, type) {
  if (!Array.isArray(nodes)) {
    return null;
  }
  if (typeof type === 'number') {
    return nodes[type];
  }
  return utils.firstOfType(nodes, type);
};

/**
 * Returns true if the given node is an "*.open" node.
 *
 * ```js
 * var Node = require('snapdragon-node');
 * var brace = new Node({type: 'brace'});
 * var open = new Node({type: 'brace.open'});
 * var close = new Node({type: 'brace.close'});
 *
 * console.log(utils.isOpen(brace)); // false
 * console.log(utils.isOpen(open)); // true
 * console.log(utils.isOpen(close)); // false
 * ```
 * @param {Object} `node` Instance of [snapdragon-node][]
 * @return {Boolean}
 * @api public
 */

utils.isOpen = function(node) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  return node.type.slice(-5) === '.open';
};

/**
 * Returns true if the given node is a "*.close" node.
 *
 * ```js
 * var Node = require('snapdragon-node');
 * var brace = new Node({type: 'brace'});
 * var open = new Node({type: 'brace.open'});
 * var close = new Node({type: 'brace.close'});
 *
 * console.log(utils.isClose(brace)); // false
 * console.log(utils.isClose(open)); // false
 * console.log(utils.isClose(close)); // true
 * ```
 * @param {Object} `node` Instance of [snapdragon-node][]
 * @return {Boolean}
 * @api public
 */

utils.isClose = function(node) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  return node.type.slice(-6) === '.close';
};

/**
 * Returns true if `node.nodes` **has** an `.open` node
 *
 * ```js
 * var Node = require('snapdragon-node');
 * var brace = new Node({
 *   type: 'brace',
 *   nodes: []
 * });
 *
 * var open = new Node({type: 'brace.open'});
 * console.log(utils.hasOpen(brace)); // false
 *
 * brace.pushNode(open);
 * console.log(utils.hasOpen(brace)); // true
 * ```
 * @param {Object} `node` Instance of [snapdragon-node][]
 * @return {Boolean}
 * @api public
 */

utils.hasOpen = function(node) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  var first = node.first || node.nodes ? node.nodes[0] : null;
  if (utils.isNode(first)) {
    return first.type === node.type + '.open';
  }
  return false;
};

/**
 * Returns true if `node.nodes` **has** a `.close` node
 *
 * ```js
 * var Node = require('snapdragon-node');
 * var brace = new Node({
 *   type: 'brace',
 *   nodes: []
 * });
 *
 * var close = new Node({type: 'brace.close'});
 * console.log(utils.hasClose(brace)); // false
 *
 * brace.pushNode(close);
 * console.log(utils.hasClose(brace)); // true
 * ```
 * @param {Object} `node` Instance of [snapdragon-node][]
 * @return {Boolean}
 * @api public
 */

utils.hasClose = function(node) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  var last = node.last || node.nodes ? node.nodes[node.nodes.length - 1] : null;
  if (utils.isNode(last)) {
    return last.type === node.type + '.close';
  }
  return false;
};

/**
 * Returns true if `node.nodes` has both `.open` and `.close` nodes
 *
 * ```js
 * var Node = require('snapdragon-node');
 * var brace = new Node({
 *   type: 'brace',
 *   nodes: []
 * });
 *
 * var open = new Node({type: 'brace.open'});
 * var close = new Node({type: 'brace.close'});
 * console.log(utils.hasOpen(brace)); // false
 * console.log(utils.hasClose(brace)); // false
 *
 * brace.pushNode(open);
 * brace.pushNode(close);
 * console.log(utils.hasOpen(brace)); // true
 * console.log(utils.hasClose(brace)); // true
 * ```
 * @param {Object} `node` Instance of [snapdragon-node][]
 * @return {Boolean}
 * @api public
 */

utils.hasOpenAndClose = function(node) {
  return utils.hasOpen(node) && utils.hasClose(node);
};

/**
 * Push the given `node` onto the `state.inside` array for the
 * given type. This array is used as a specialized "stack" for
 * only the given `node.type`.
 *
 * ```js
 * var state = { inside: {}};
 * var node = new Node({type: 'brace'});
 * utils.addType(state, node);
 * console.log(state.inside);
 * //=> { brace: [{type: 'brace'}] }
 * ```
 * @param {Object} `state` The `compiler.state` object or custom state object.
 * @param {Object} `node` Instance of [snapdragon-node][]
 * @return {Array} Returns the `state.inside` stack for the given type.
 * @api public
 */

utils.addType = function(state, node) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  assert(isObject(state), 'expected state to be an object');

  var type = node.parent
    ? node.parent.type
    : node.type.replace(/\.open$/, '');

  if (!state.hasOwnProperty('inside')) {
    state.inside = {};
  }
  if (!state.inside.hasOwnProperty(type)) {
    state.inside[type] = [];
  }

  var arr = state.inside[type];
  arr.push(node);
  return arr;
};

/**
 * Remove the given `node` from the `state.inside` array for the
 * given type. This array is used as a specialized "stack" for
 * only the given `node.type`.
 *
 * ```js
 * var state = { inside: {}};
 * var node = new Node({type: 'brace'});
 * utils.addType(state, node);
 * console.log(state.inside);
 * //=> { brace: [{type: 'brace'}] }
 * utils.removeType(state, node);
 * //=> { brace: [] }
 * ```
 * @param {Object} `state` The `compiler.state` object or custom state object.
 * @param {Object} `node` Instance of [snapdragon-node][]
 * @return {Array} Returns the `state.inside` stack for the given type.
 * @api public
 */

utils.removeType = function(state, node) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  assert(isObject(state), 'expected state to be an object');

  var type = node.parent
    ? node.parent.type
    : node.type.replace(/\.close$/, '');

  if (state.inside.hasOwnProperty(type)) {
    return state.inside[type].pop();
  }
};

/**
 * Returns true if `node.val` is an empty string, or `node.nodes` does
 * not contain any non-empty text nodes.
 *
 * ```js
 * var node = new Node({type: 'text'});
 * utils.isEmpty(node); //=> true
 * node.val = 'foo';
 * utils.isEmpty(node); //=> false
 * ```
 * @param {Object} `node` Instance of [snapdragon-node][]
 * @param {Function} `fn`
 * @return {Boolean}
 * @api public
 */

utils.isEmpty = function(node, fn) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');

  if (!Array.isArray(node.nodes)) {
    if (node.type !== 'text') {
      return true;
    }
    if (typeof fn === 'function') {
      return fn(node, node.parent);
    }
    return !utils.trim(node.val);
  }

  for (var i = 0; i < node.nodes.length; i++) {
    var child = node.nodes[i];
    if (utils.isOpen(child) || utils.isClose(child)) {
      continue;
    }
    if (!utils.isEmpty(child, fn)) {
      return false;
    }
  }

  return true;
};

/**
 * Returns true if the `state.inside` stack for the given type exists
 * and has one or more nodes on it.
 *
 * ```js
 * var state = { inside: {}};
 * var node = new Node({type: 'brace'});
 * console.log(utils.isInsideType(state, 'brace')); //=> false
 * utils.addType(state, node);
 * console.log(utils.isInsideType(state, 'brace')); //=> true
 * utils.removeType(state, node);
 * console.log(utils.isInsideType(state, 'brace')); //=> false
 * ```
 * @param {Object} `state`
 * @param {String} `type`
 * @return {Boolean}
 * @api public
 */

utils.isInsideType = function(state, type) {
  assert(isObject(state), 'expected state to be an object');
  assert(isString(type), 'expected type to be a string');

  if (!state.hasOwnProperty('inside')) {
    return false;
  }

  if (!state.inside.hasOwnProperty(type)) {
    return false;
  }

  return state.inside[type].length > 0;
};

/**
 * Returns true if `node` is either a child or grand-child of the given `type`,
 * or `state.inside[type]` is a non-empty array.
 *
 * ```js
 * var state = { inside: {}};
 * var node = new Node({type: 'brace'});
 * var open = new Node({type: 'brace.open'});
 * console.log(utils.isInside(state, open, 'brace')); //=> false
 * utils.pushNode(node, open);
 * console.log(utils.isInside(state, open, 'brace')); //=> true
 * ```
 * @param {Object} `state` Either the `compiler.state` object, if it exists, or a user-supplied state object.
 * @param {Object} `node` Instance of [snapdragon-node][]
 * @param {String} `type` The `node.type` to check for.
 * @return {Boolean}
 * @api public
 */

utils.isInside = function(state, node, type) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  assert(isObject(state), 'expected state to be an object');

  if (Array.isArray(type)) {
    for (var i = 0; i < type.length; i++) {
      if (utils.isInside(state, node, type[i])) {
        return true;
      }
    }
    return false;
  }

  var parent = node.parent;
  if (typeof type === 'string') {
    return (parent && parent.type === type) || utils.isInsideType(state, type);
  }

  if (kindOf$2(type) === 'regexp') {
    if (parent && parent.type && type.test(parent.type)) {
      return true;
    }

    var keys = Object.keys(state.inside);
    var len = keys.length;
    var idx = -1;
    while (++idx < len) {
      var key = keys[idx];
      var val = state.inside[key];

      if (Array.isArray(val) && val.length !== 0 && type.test(key)) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Get the last `n` element from the given `array`. Used for getting
 * a node from `node.nodes.`
 *
 * @param {Array} `array`
 * @param {Number} `n`
 * @return {undefined}
 * @api public
 */

utils.last = function(arr, n) {
  return arr[arr.length - (n || 1)];
};

/**
 * Cast the given `val` to an array.
 *
 * ```js
 * console.log(utils.arrayify(''));
 * //=> []
 * console.log(utils.arrayify('foo'));
 * //=> ['foo']
 * console.log(utils.arrayify(['foo']));
 * //=> ['foo']
 * ```
 * @param {any} `val`
 * @return {Array}
 * @api public
 */

utils.arrayify = function(val) {
  if (typeof val === 'string' && val !== '') {
    return [val];
  }
  if (!Array.isArray(val)) {
    return [];
  }
  return val;
};

/**
 * Convert the given `val` to a string by joining with `,`. Useful
 * for creating a cheerio/CSS/DOM-style selector from a list of strings.
 *
 * @param {any} `val`
 * @return {Array}
 * @api public
 */

utils.stringify = function(val) {
  return utils.arrayify(val).join(',');
};

/**
 * Ensure that the given value is a string and call `.trim()` on it,
 * or return an empty string.
 *
 * @param {String} `str`
 * @return {String}
 * @api public
 */

utils.trim = function(str) {
  return typeof str === 'string' ? str.trim() : '';
};

/**
 * Return true if val is an object
 */

function isObject(val) {
  return kindOf$2(val) === 'object';
}

/**
 * Return true if val is a string
 */

function isString(val) {
  return typeof val === 'string';
}

/**
 * Return true if val is a function
 */

function isFunction(val) {
  return typeof val === 'function';
}

/**
 * Return true if val is an array
 */

function isArray(val) {
  return Array.isArray(val);
}

/**
 * Shim to ensure the `.append` methods work with any version of snapdragon
 */

function append(compiler, val, node) {
  if (typeof compiler.append !== 'function') {
    return compiler.emit(val, node);
  }
  return compiler.append(val, node);
}

/**
 * Simplified assertion. Throws an error is `val` is falsey.
 */

function assert(val, message) {
  if (!val) throw new Error(message);
}
});

var snapdragonNode = createCommonjsModule(function (module, exports) {




var ownNames;

/**
 * Create a new AST `Node` with the given `val` and `type`.
 *
 * ```js
 * var node = new Node('*', 'Star');
 * var node = new Node({type: 'star', val: '*'});
 * ```
 * @name Node
 * @param {String|Object} `val` Pass a matched substring, or an object to merge onto the node.
 * @param {String} `type` The node type to use when `val` is a string.
 * @return {Object} node instance
 * @api public
 */

function Node(val, type, parent) {
  if (typeof type !== 'string') {
    parent = type;
    type = null;
  }

  defineProperty$1(this, 'parent', parent);
  defineProperty$1(this, 'isNode', true);
  defineProperty$1(this, 'expect', null);

  if (typeof type !== 'string' && isobject(val)) {
    lazyKeys();
    var keys = Object.keys(val);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (ownNames.indexOf(key) === -1) {
        this[key] = val[key];
      }
    }
  } else {
    this.type = type;
    this.val = val;
  }
}

/**
 * Returns true if the given value is a node.
 *
 * ```js
 * var Node = require('snapdragon-node');
 * var node = new Node({type: 'foo'});
 * console.log(Node.isNode(node)); //=> true
 * console.log(Node.isNode({})); //=> false
 * ```
 * @param {Object} `node`
 * @returns {Boolean}
 * @api public
 */

Node.isNode = function(node) {
  return snapdragonUtil.isNode(node);
};

/**
 * Define a non-enumberable property on the node instance.
 * Useful for adding properties that shouldn't be extended
 * or visible during debugging.
 *
 * ```js
 * var node = new Node();
 * node.define('foo', 'something non-enumerable');
 * ```
 * @param {String} `name`
 * @param {any} `val`
 * @return {Object} returns the node instance
 * @api public
 */

Node.prototype.define = function(name, val) {
  defineProperty$1(this, name, val);
  return this;
};

/**
 * Returns true if `node.val` is an empty string, or `node.nodes` does
 * not contain any non-empty text nodes.
 *
 * ```js
 * var node = new Node({type: 'text'});
 * node.isEmpty(); //=> true
 * node.val = 'foo';
 * node.isEmpty(); //=> false
 * ```
 * @param {Function} `fn` (optional) Filter function that is called on `node` and/or child nodes. `isEmpty` will return false immediately when the filter function returns false on any nodes.
 * @return {Boolean}
 * @api public
 */

Node.prototype.isEmpty = function(fn) {
  return snapdragonUtil.isEmpty(this, fn);
};

/**
 * Given node `foo` and node `bar`, push node `bar` onto `foo.nodes`, and
 * set `foo` as `bar.parent`.
 *
 * ```js
 * var foo = new Node({type: 'foo'});
 * var bar = new Node({type: 'bar'});
 * foo.push(bar);
 * ```
 * @param {Object} `node`
 * @return {Number} Returns the length of `node.nodes`
 * @api public
 */

Node.prototype.push = function(node) {
  assert(Node.isNode(node), 'expected node to be an instance of Node');
  defineProperty$1(node, 'parent', this);

  this.nodes = this.nodes || [];
  return this.nodes.push(node);
};

/**
 * Given node `foo` and node `bar`, unshift node `bar` onto `foo.nodes`, and
 * set `foo` as `bar.parent`.
 *
 * ```js
 * var foo = new Node({type: 'foo'});
 * var bar = new Node({type: 'bar'});
 * foo.unshift(bar);
 * ```
 * @param {Object} `node`
 * @return {Number} Returns the length of `node.nodes`
 * @api public
 */

Node.prototype.unshift = function(node) {
  assert(Node.isNode(node), 'expected node to be an instance of Node');
  defineProperty$1(node, 'parent', this);

  this.nodes = this.nodes || [];
  return this.nodes.unshift(node);
};

/**
 * Pop a node from `node.nodes`.
 *
 * ```js
 * var node = new Node({type: 'foo'});
 * node.push(new Node({type: 'a'}));
 * node.push(new Node({type: 'b'}));
 * node.push(new Node({type: 'c'}));
 * node.push(new Node({type: 'd'}));
 * console.log(node.nodes.length);
 * //=> 4
 * node.pop();
 * console.log(node.nodes.length);
 * //=> 3
 * ```
 * @return {Number} Returns the popped `node`
 * @api public
 */

Node.prototype.pop = function() {
  return this.nodes && this.nodes.pop();
};

/**
 * Shift a node from `node.nodes`.
 *
 * ```js
 * var node = new Node({type: 'foo'});
 * node.push(new Node({type: 'a'}));
 * node.push(new Node({type: 'b'}));
 * node.push(new Node({type: 'c'}));
 * node.push(new Node({type: 'd'}));
 * console.log(node.nodes.length);
 * //=> 4
 * node.shift();
 * console.log(node.nodes.length);
 * //=> 3
 * ```
 * @return {Object} Returns the shifted `node`
 * @api public
 */

Node.prototype.shift = function() {
  return this.nodes && this.nodes.shift();
};

/**
 * Remove `node` from `node.nodes`.
 *
 * ```js
 * node.remove(childNode);
 * ```
 * @param {Object} `node`
 * @return {Object} Returns the removed node.
 * @api public
 */

Node.prototype.remove = function(node) {
  assert(Node.isNode(node), 'expected node to be an instance of Node');
  this.nodes = this.nodes || [];
  var idx = node.index;
  if (idx !== -1) {
    node.index = -1;
    return this.nodes.splice(idx, 1);
  }
  return null;
};

/**
 * Get the first child node from `node.nodes` that matches the given `type`.
 * If `type` is a number, the child node at that index is returned.
 *
 * ```js
 * var child = node.find(1); //<= index of the node to get
 * var child = node.find('foo'); //<= node.type of a child node
 * var child = node.find(/^(foo|bar)$/); //<= regex to match node.type
 * var child = node.find(['foo', 'bar']); //<= array of node.type(s)
 * ```
 * @param {String} `type`
 * @return {Object} Returns a child node or undefined.
 * @api public
 */

Node.prototype.find = function(type) {
  return snapdragonUtil.findNode(this.nodes, type);
};

/**
 * Return true if the node is the given `type`.
 *
 * ```js
 * var node = new Node({type: 'bar'});
 * cosole.log(node.isType('foo'));          // false
 * cosole.log(node.isType(/^(foo|bar)$/));  // true
 * cosole.log(node.isType(['foo', 'bar'])); // true
 * ```
 * @param {String} `type`
 * @return {Boolean}
 * @api public
 */

Node.prototype.isType = function(type) {
  return snapdragonUtil.isType(this, type);
};

/**
 * Return true if the `node.nodes` has the given `type`.
 *
 * ```js
 * var foo = new Node({type: 'foo'});
 * var bar = new Node({type: 'bar'});
 * foo.push(bar);
 *
 * cosole.log(foo.hasType('qux'));          // false
 * cosole.log(foo.hasType(/^(qux|bar)$/));  // true
 * cosole.log(foo.hasType(['qux', 'bar'])); // true
 * ```
 * @param {String} `type`
 * @return {Boolean}
 * @api public
 */

Node.prototype.hasType = function(type) {
  return snapdragonUtil.hasType(this, type);
};

/**
 * Get the siblings array, or `null` if it doesn't exist.
 *
 * ```js
 * var foo = new Node({type: 'foo'});
 * var bar = new Node({type: 'bar'});
 * var baz = new Node({type: 'baz'});
 * foo.push(bar);
 * foo.push(baz);
 *
 * console.log(bar.siblings.length) // 2
 * console.log(baz.siblings.length) // 2
 * ```
 * @return {Array}
 * @api public
 */

Object.defineProperty(Node.prototype, 'siblings', {
  set: function() {
    throw new Error('node.siblings is a getter and cannot be defined');
  },
  get: function() {
    return this.parent ? this.parent.nodes : null;
  }
});

/**
 * Get the node's current index from `node.parent.nodes`.
 * This should always be correct, even when the parent adds nodes.
 *
 * ```js
 * var foo = new Node({type: 'foo'});
 * var bar = new Node({type: 'bar'});
 * var baz = new Node({type: 'baz'});
 * var qux = new Node({type: 'qux'});
 * foo.push(bar);
 * foo.push(baz);
 * foo.unshift(qux);
 *
 * console.log(bar.index) // 1
 * console.log(baz.index) // 2
 * console.log(qux.index) // 0
 * ```
 * @return {Number}
 * @api public
 */

Object.defineProperty(Node.prototype, 'index', {
  set: function(index) {
    defineProperty$1(this, 'idx', index);
  },
  get: function() {
    if (!Array.isArray(this.siblings)) {
      return -1;
    }
    var tok = this.idx !== -1 ? this.siblings[this.idx] : null;
    if (tok !== this) {
      this.idx = this.siblings.indexOf(this);
    }
    return this.idx;
  }
});

/**
 * Get the previous node from the siblings array or `null`.
 *
 * ```js
 * var foo = new Node({type: 'foo'});
 * var bar = new Node({type: 'bar'});
 * var baz = new Node({type: 'baz'});
 * foo.push(bar);
 * foo.push(baz);
 *
 * console.log(baz.prev.type) // 'bar'
 * ```
 * @return {Object}
 * @api public
 */

Object.defineProperty(Node.prototype, 'prev', {
  set: function() {
    throw new Error('node.prev is a getter and cannot be defined');
  },
  get: function() {
    if (Array.isArray(this.siblings)) {
      return this.siblings[this.index - 1] || this.parent.prev;
    }
    return null;
  }
});

/**
 * Get the siblings array, or `null` if it doesn't exist.
 *
 * ```js
 * var foo = new Node({type: 'foo'});
 * var bar = new Node({type: 'bar'});
 * var baz = new Node({type: 'baz'});
 * foo.push(bar);
 * foo.push(baz);
 *
 * console.log(bar.siblings.length) // 2
 * console.log(baz.siblings.length) // 2
 * ```
 * @return {Object}
 * @api public
 */

Object.defineProperty(Node.prototype, 'next', {
  set: function() {
    throw new Error('node.next is a getter and cannot be defined');
  },
  get: function() {
    if (Array.isArray(this.siblings)) {
      return this.siblings[this.index + 1] || this.parent.next;
    }
    return null;
  }
});

/**
 * Get the first node from `node.nodes`.
 *
 * ```js
 * var foo = new Node({type: 'foo'});
 * var bar = new Node({type: 'bar'});
 * var baz = new Node({type: 'baz'});
 * var qux = new Node({type: 'qux'});
 * foo.push(bar);
 * foo.push(baz);
 * foo.push(qux);
 *
 * console.log(foo.first.type) // 'bar'
 * ```
 * @return {Object} The first node, or undefiend
 * @api public
 */

Object.defineProperty(Node.prototype, 'first', {
  get: function() {
    return this.nodes ? this.nodes[0] : null;
  }
});

/**
 * Get the last node from `node.nodes`.
 *
 * ```js
 * var foo = new Node({type: 'foo'});
 * var bar = new Node({type: 'bar'});
 * var baz = new Node({type: 'baz'});
 * var qux = new Node({type: 'qux'});
 * foo.push(bar);
 * foo.push(baz);
 * foo.push(qux);
 *
 * console.log(foo.last.type) // 'qux'
 * ```
 * @return {Object} The last node, or undefiend
 * @api public
 */

Object.defineProperty(Node.prototype, 'last', {
  get: function() {
    return this.nodes ? snapdragonUtil.last(this.nodes) : null;
  }
});

/**
 * Get the last node from `node.nodes`.
 *
 * ```js
 * var foo = new Node({type: 'foo'});
 * var bar = new Node({type: 'bar'});
 * var baz = new Node({type: 'baz'});
 * var qux = new Node({type: 'qux'});
 * foo.push(bar);
 * foo.push(baz);
 * foo.push(qux);
 *
 * console.log(foo.last.type) // 'qux'
 * ```
 * @return {Object} The last node, or undefiend
 * @api public
 */

Object.defineProperty(Node.prototype, 'scope', {
  get: function() {
    if (this.isScope !== true) {
      return this.parent ? this.parent.scope : this;
    }
    return this;
  }
});

/**
 * Get own property names from Node prototype, but only the
 * first time `Node` is instantiated
 */

function lazyKeys() {
  if (!ownNames) {
    ownNames = Object.getOwnPropertyNames(Node.prototype);
  }
}

/**
 * Simplified assertion. Throws an error is `val` is falsey.
 */

function assert(val, message) {
  if (!val) throw new Error(message);
}

/**
 * Expose `Node`
 */

exports = module.exports = Node;
});

/**
 * Braces parsers
 */

var parsers = function(braces, options) {
  braces.parser
    .set('bos', function() {
      if (!this.parsed) {
        this.ast = this.nodes[0] = new snapdragonNode(this.ast);
      }
    })

    /**
     * Character parsers
     */

    .set('escape', function() {
      var pos = this.position();
      var m = this.match(/^(?:\\(.)|\$\{)/);
      if (!m) return;

      var prev = this.prev();
      var last = utils_1.last(prev.nodes);

      var node = pos(new snapdragonNode({
        type: 'text',
        multiplier: 1,
        val: m[0]
      }));

      if (node.val === '\\\\') {
        return node;
      }

      if (node.val === '${') {
        var str = this.input;
        var idx = -1;
        var ch;

        while ((ch = str[++idx])) {
          this.consume(1);
          node.val += ch;
          if (ch === '\\') {
            node.val += str[++idx];
            continue;
          }
          if (ch === '}') {
            break;
          }
        }
      }

      if (this.options.unescape !== false) {
        node.val = node.val.replace(/\\([{}])/g, '$1');
      }

      if (last.val === '"' && this.input.charAt(0) === '"') {
        last.val = node.val;
        this.consume(1);
        return;
      }

      return concatNodes.call(this, pos, node, prev, options);
    })

    /**
     * Brackets: "[...]" (basic, this is overridden by
     * other parsers in more advanced implementations)
     */

    .set('bracket', function() {
      var isInside = this.isInside('brace');
      var pos = this.position();
      var m = this.match(/^(?:\[([!^]?)([^\]]{2,}|\]-)(\]|[^*+?]+)|\[)/);
      if (!m) return;

      var prev = this.prev();
      var val = m[0];
      var negated = m[1] ? '^' : '';
      var inner = m[2] || '';
      var close = m[3] || '';

      if (isInside && prev.type === 'brace') {
        prev.text = prev.text || '';
        prev.text += val;
      }

      var esc = this.input.slice(0, 2);
      if (inner === '' && esc === '\\]') {
        inner += esc;
        this.consume(2);

        var str = this.input;
        var idx = -1;
        var ch;

        while ((ch = str[++idx])) {
          this.consume(1);
          if (ch === ']') {
            close = ch;
            break;
          }
          inner += ch;
        }
      }

      return pos(new snapdragonNode({
        type: 'bracket',
        val: val,
        escaped: close !== ']',
        negated: negated,
        inner: inner,
        close: close
      }));
    })

    /**
     * Empty braces (we capture these early to
     * speed up processing in the compiler)
     */

    .set('multiplier', function() {
      var isInside = this.isInside('brace');
      var pos = this.position();
      var m = this.match(/^\{((?:,|\{,+\})+)\}/);
      if (!m) return;

      this.multiplier = true;
      var prev = this.prev();
      var val = m[0];

      if (isInside && prev.type === 'brace') {
        prev.text = prev.text || '';
        prev.text += val;
      }

      var node = pos(new snapdragonNode({
        type: 'text',
        multiplier: 1,
        match: m,
        val: val
      }));

      return concatNodes.call(this, pos, node, prev, options);
    })

    /**
     * Open
     */

    .set('brace.open', function() {
      var pos = this.position();
      var m = this.match(/^\{(?!(?:[^\\}]?|,+)\})/);
      if (!m) return;

      var prev = this.prev();
      var last = utils_1.last(prev.nodes);

      // if the last parsed character was an extglob character
      // we need to _not optimize_ the brace pattern because
      // it might be mistaken for an extglob by a downstream parser
      if (last && last.val && isExtglobChar(last.val.slice(-1))) {
        last.optimize = false;
      }

      var open = pos(new snapdragonNode({
        type: 'brace.open',
        val: m[0]
      }));

      var node = pos(new snapdragonNode({
        type: 'brace',
        nodes: []
      }));

      node.push(open);
      prev.push(node);
      this.push('brace', node);
    })

    /**
     * Close
     */

    .set('brace.close', function() {
      var pos = this.position();
      var m = this.match(/^\}/);
      if (!m || !m[0]) return;

      var brace = this.pop('brace');
      var node = pos(new snapdragonNode({
        type: 'brace.close',
        val: m[0]
      }));

      if (!this.isType(brace, 'brace')) {
        if (this.options.strict) {
          throw new Error('missing opening "{"');
        }
        node.type = 'text';
        node.multiplier = 0;
        node.escaped = true;
        return node;
      }

      var prev = this.prev();
      var last = utils_1.last(prev.nodes);
      if (last.text) {
        var lastNode = utils_1.last(last.nodes);
        if (lastNode.val === ')' && /[!@*?+]\(/.test(last.text)) {
          var open = last.nodes[0];
          var text = last.nodes[1];
          if (open.type === 'brace.open' && text && text.type === 'text') {
            text.optimize = false;
          }
        }
      }

      if (brace.nodes.length > 2) {
        var first = brace.nodes[1];
        if (first.type === 'text' && first.val === ',') {
          brace.nodes.splice(1, 1);
          brace.nodes.push(first);
        }
      }

      brace.push(node);
    })

    /**
     * Capture boundary characters
     */

    .set('boundary', function() {
      var pos = this.position();
      var m = this.match(/^[$^](?!\{)/);
      if (!m) return;
      return pos(new snapdragonNode({
        type: 'text',
        val: m[0]
      }));
    })

    /**
     * One or zero, non-comma characters wrapped in braces
     */

    .set('nobrace', function() {
      var isInside = this.isInside('brace');
      var pos = this.position();
      var m = this.match(/^\{[^,]?\}/);
      if (!m) return;

      var prev = this.prev();
      var val = m[0];

      if (isInside && prev.type === 'brace') {
        prev.text = prev.text || '';
        prev.text += val;
      }

      return pos(new snapdragonNode({
        type: 'text',
        multiplier: 0,
        val: val
      }));
    })

    /**
     * Text
     */

    .set('text', function() {
      var isInside = this.isInside('brace');
      var pos = this.position();
      var m = this.match(/^((?!\\)[^${}[\]])+/);
      if (!m) return;

      var prev = this.prev();
      var val = m[0];

      if (isInside && prev.type === 'brace') {
        prev.text = prev.text || '';
        prev.text += val;
      }

      var node = pos(new snapdragonNode({
        type: 'text',
        multiplier: 1,
        val: val
      }));

      return concatNodes.call(this, pos, node, prev, options);
    });
};

/**
 * Returns true if the character is an extglob character.
 */

function isExtglobChar(ch) {
  return ch === '!' || ch === '@' || ch === '*' || ch === '?' || ch === '+';
}

/**
 * Combine text nodes, and calculate empty sets (`{,,}`)
 * @param {Function} `pos` Function to calculate node position
 * @param {Object} `node` AST node
 * @return {Object}
 */

function concatNodes(pos, node, parent, options) {
  node.orig = node.val;
  var prev = this.prev();
  var last = utils_1.last(prev.nodes);
  var isEscaped = false;

  if (node.val.length > 1) {
    var a = node.val.charAt(0);
    var b = node.val.slice(-1);

    isEscaped = (a === '"' && b === '"')
      || (a === "'" && b === "'")
      || (a === '`' && b === '`');
  }

  if (isEscaped && options.unescape !== false) {
    node.val = node.val.slice(1, node.val.length - 1);
    node.escaped = true;
  }

  if (node.match) {
    var match = node.match[1];
    if (!match || match.indexOf('}') === -1) {
      match = node.match[0];
    }

    // replace each set with a single ","
    var val = match.replace(/\{/g, ',').replace(/\}/g, '');
    node.multiplier *= val.length;
    node.val = '';
  }

  var simpleText = last.type === 'text'
    && last.multiplier === 1
    && node.multiplier === 1
    && node.val;

  if (simpleText) {
    last.val += node.val;
    return;
  }

  prev.push(node);
}

// accessor descriptor properties
var accessor$2 = {
  get: 'function',
  set: 'function',
  configurable: 'boolean',
  enumerable: 'boolean'
};

function isAccessorDescriptor$2(obj, prop) {
  if (typeof prop === 'string') {
    var val = Object.getOwnPropertyDescriptor(obj, prop);
    return typeof val !== 'undefined';
  }

  if (kindOf(obj) !== 'object') {
    return false;
  }

  if (has$2(obj, 'value') || has$2(obj, 'writable')) {
    return false;
  }

  if (!has$2(obj, 'get') || typeof obj.get !== 'function') {
    return false;
  }

  // tldr: it's valid to have "set" be undefined
  // "set" might be undefined if `Object.getOwnPropertyDescriptor`
  // was used to get the value, and only `get` was defined by the user
  if (has$2(obj, 'set') && typeof obj[key] !== 'function' && typeof obj[key] !== 'undefined') {
    return false;
  }

  for (var key in obj) {
    if (!accessor$2.hasOwnProperty(key)) {
      continue;
    }

    if (kindOf(obj[key]) === accessor$2[key]) {
      continue;
    }

    if (typeof obj[key] !== 'undefined') {
      return false;
    }
  }
  return true;
}

function has$2(obj, key) {
  return {}.hasOwnProperty.call(obj, key);
}

/**
 * Expose `isAccessorDescriptor`
 */

var isAccessorDescriptor_1$2 = isAccessorDescriptor$2;

var isDataDescriptor$2 = function isDataDescriptor(obj, prop) {
  // data descriptor properties
  var data = {
    configurable: 'boolean',
    enumerable: 'boolean',
    writable: 'boolean'
  };

  if (kindOf(obj) !== 'object') {
    return false;
  }

  if (typeof prop === 'string') {
    var val = Object.getOwnPropertyDescriptor(obj, prop);
    return typeof val !== 'undefined';
  }

  if (!('value' in obj) && !('writable' in obj)) {
    return false;
  }

  for (var key in obj) {
    if (key === 'value') continue;

    if (!data.hasOwnProperty(key)) {
      continue;
    }

    if (kindOf(obj[key]) === data[key]) {
      continue;
    }

    if (typeof obj[key] !== 'undefined') {
      return false;
    }
  }
  return true;
};

var isDescriptor$2 = function isDescriptor(obj, key) {
  if (kindOf(obj) !== 'object') {
    return false;
  }
  if ('get' in obj) {
    return isAccessorDescriptor_1$2(obj, key);
  }
  return isDataDescriptor$2(obj, key);
};

var defineProperty$2 = function defineProperty(obj, prop, val) {
  if (typeof obj !== 'object' && typeof obj !== 'function') {
    throw new TypeError('expected an object or function.');
  }

  if (typeof prop !== 'string') {
    throw new TypeError('expected `prop` to be a string.');
  }

  if (isDescriptor$2(val) && ('set' in val || 'get' in val)) {
    return Object.defineProperty(obj, prop, val);
  }

  return Object.defineProperty(obj, prop, {
    configurable: true,
    enumerable: false,
    writable: true,
    value: val
  });
};

var componentEmitter = createCommonjsModule(function (module) {
/**
 * Expose `Emitter`.
 */

{
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
}
/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }

  // Remove event specific arrays for event types that no
  // one is subscribed for to avoid memory leak.
  if (callbacks.length === 0) {
    delete this._callbacks['$' + event];
  }

  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};

  var args = new Array(arguments.length - 1)
    , callbacks = this._callbacks['$' + event];

  for (var i = 1; i < arguments.length; i++) {
    args[i - 1] = arguments[i];
  }

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};
});

var objectVisit = function visit(thisArg, method, target, val) {
  if (!isobject(thisArg) && typeof thisArg !== 'function') {
    throw new Error('object-visit expects `thisArg` to be an object.');
  }

  if (typeof method !== 'string') {
    throw new Error('object-visit expects `method` name to be a string');
  }

  if (typeof thisArg[method] !== 'function') {
    return thisArg;
  }

  var args = [].slice.call(arguments, 3);
  target = target || {};

  for (var key in target) {
    var arr = [key, target[key]].concat(args);
    thisArg[method].apply(thisArg, arr);
  }
  return thisArg;
};

/**
 * Map `visit` over an array of objects.
 *
 * @param  {Object} `collection` The context in which to invoke `method`
 * @param  {String} `method` Name of the method to call on `collection`
 * @param  {Object} `arr` Array of objects.
 */

var mapVisit = function mapVisit(collection, method, val) {
  if (isObject$2(val)) {
    return objectVisit.apply(null, arguments);
  }

  if (!Array.isArray(val)) {
    throw new TypeError('expected an array: ' + util$3.inspect(val));
  }

  var args = [].slice.call(arguments, 3);

  for (var i = 0; i < val.length; i++) {
    var ele = val[i];
    if (isObject$2(ele)) {
      objectVisit.apply(null, [collection, method, ele].concat(args));
    } else {
      collection[method].apply(collection, [ele].concat(args));
    }
  }
};

function isObject$2(val) {
  return val && (typeof val === 'function' || (!Array.isArray(val) && typeof val === 'object'));
}

var collectionVisit = function(collection, method, val) {
  var result;

  if (typeof val === 'string' && (method in collection)) {
    var args = [].slice.call(arguments, 2);
    result = collection[method].apply(collection, args);
  } else if (Array.isArray(val)) {
    result = mapVisit.apply(null, arguments);
  } else {
    result = objectVisit.apply(null, arguments);
  }

  if (typeof result !== 'undefined') {
    return result;
  }

  return collection;
};

var toString$3 = Object.prototype.toString;

/**
 * Get the native `typeof` a value.
 *
 * @param  {*} `val`
 * @return {*} Native javascript type
 */

var kindOf$3 = function kindOf(val) {
  // primitivies
  if (typeof val === 'undefined') {
    return 'undefined';
  }
  if (val === null) {
    return 'null';
  }
  if (val === true || val === false || val instanceof Boolean) {
    return 'boolean';
  }
  if (typeof val === 'string' || val instanceof String) {
    return 'string';
  }
  if (typeof val === 'number' || val instanceof Number) {
    return 'number';
  }

  // functions
  if (typeof val === 'function' || val instanceof Function) {
    return 'function';
  }

  // array
  if (typeof Array.isArray !== 'undefined' && Array.isArray(val)) {
    return 'array';
  }

  // check for instances of RegExp and Date before calling `toString`
  if (val instanceof RegExp) {
    return 'regexp';
  }
  if (val instanceof Date) {
    return 'date';
  }

  // other objects
  var type = toString$3.call(val);

  if (type === '[object RegExp]') {
    return 'regexp';
  }
  if (type === '[object Date]') {
    return 'date';
  }
  if (type === '[object Arguments]') {
    return 'arguments';
  }
  if (type === '[object Error]') {
    return 'error';
  }

  // buffer
  if (isBuffer_1(val)) {
    return 'buffer';
  }

  // es6: Map, WeakMap, Set, WeakSet
  if (type === '[object Set]') {
    return 'set';
  }
  if (type === '[object WeakSet]') {
    return 'weakset';
  }
  if (type === '[object Map]') {
    return 'map';
  }
  if (type === '[object WeakMap]') {
    return 'weakmap';
  }
  if (type === '[object Symbol]') {
    return 'symbol';
  }

  // typed arrays
  if (type === '[object Int8Array]') {
    return 'int8array';
  }
  if (type === '[object Uint8Array]') {
    return 'uint8array';
  }
  if (type === '[object Uint8ClampedArray]') {
    return 'uint8clampedarray';
  }
  if (type === '[object Int16Array]') {
    return 'int16array';
  }
  if (type === '[object Uint16Array]') {
    return 'uint16array';
  }
  if (type === '[object Int32Array]') {
    return 'int32array';
  }
  if (type === '[object Uint32Array]') {
    return 'uint32array';
  }
  if (type === '[object Float32Array]') {
    return 'float32array';
  }
  if (type === '[object Float64Array]') {
    return 'float64array';
  }

  // must be a plain object
  return 'object';
};

var toObjectPath = function toPath(args) {
  if (kindOf$3(args) !== 'arguments') {
    args = arguments;
  }
  return filter(args).join('.');
};

function filter(arr) {
  var len = arr.length;
  var idx = -1;
  var res = [];

  while (++idx < len) {
    var ele = arr[idx];
    if (kindOf$3(ele) === 'arguments' || Array.isArray(ele)) {
      res.push.apply(res, filter(ele));
    } else if (typeof ele === 'string') {
      res.push(ele);
    }
  }
  return res;
}

var arrUnion = function union(init) {
  if (!Array.isArray(init)) {
    throw new TypeError('arr-union expects the first argument to be an array.');
  }

  var len = arguments.length;
  var i = 0;

  while (++i < len) {
    var arg = arguments[i];
    if (!arg) continue;

    if (!Array.isArray(arg)) {
      arg = [arg];
    }

    for (var j = 0; j < arg.length; j++) {
      var ele = arg[j];

      if (init.indexOf(ele) >= 0) {
        continue;
      }
      init.push(ele);
    }
  }
  return init;
};

/*!
 * get-value <https://github.com/jonschlinkert/get-value>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var getValue = function(obj, prop, a, b, c) {
  if (!isObject$3(obj) || !prop) {
    return obj;
  }

  prop = toString$4(prop);

  // allowing for multiple properties to be passed as
  // a string or array, but much faster (3-4x) than doing
  // `[].slice.call(arguments)`
  if (a) prop += '.' + toString$4(a);
  if (b) prop += '.' + toString$4(b);
  if (c) prop += '.' + toString$4(c);

  if (prop in obj) {
    return obj[prop];
  }

  var segs = prop.split('.');
  var len = segs.length;
  var i = -1;

  while (obj && (++i < len)) {
    var key = segs[i];
    while (key[key.length - 1] === '\\') {
      key = key.slice(0, -1) + '.' + segs[++i];
    }
    obj = obj[key];
  }
  return obj;
};

function isObject$3(val) {
  return val !== null && (typeof val === 'object' || typeof val === 'function');
}

function toString$4(val) {
  if (!val) return '';
  if (Array.isArray(val)) {
    return val.join('.');
  }
  return val;
}

var extendShallow$3 = function extend(o/*, objects*/) {
  if (!isExtendable$1(o)) { o = {}; }

  var len = arguments.length;
  for (var i = 1; i < len; i++) {
    var obj = arguments[i];

    if (isExtendable$1(obj)) {
      assign$3(o, obj);
    }
  }
  return o;
};

function assign$3(a, b) {
  for (var key in b) {
    if (hasOwn$3(b, key)) {
      a[key] = b[key];
    }
  }
}

/**
 * Returns true if the given `key` is an own property of `obj`.
 */

function hasOwn$3(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

var setValue = function(obj, prop, val) {
  if (!isExtendable$1(obj)) {
    return obj;
  }

  if (Array.isArray(prop)) {
    prop = [].concat.apply([], prop).join('.');
  }

  if (typeof prop !== 'string') {
    return obj;
  }

  var keys = splitString(prop, {sep: '.', brackets: true}).filter(isValidKey);
  var len = keys.length;
  var idx = -1;
  var current = obj;

  while (++idx < len) {
    var key = keys[idx];
    if (idx !== len - 1) {
      if (!isExtendable$1(current[key])) {
        current[key] = {};
      }
      current = current[key];
      continue;
    }

    if (isPlainObject(current[key]) && isPlainObject(val)) {
      current[key] = extendShallow$3({}, current[key], val);
    } else {
      current[key] = val;
    }
  }

  return obj;
};

function isValidKey(key) {
  return key !== '__proto__' && key !== 'constructor' && key !== 'prototype';
}

var unionValue = function unionValue(obj, prop, value) {
  if (!isExtendable$1(obj)) {
    throw new TypeError('union-value expects the first argument to be an object.');
  }

  if (typeof prop !== 'string') {
    throw new TypeError('union-value expects `prop` to be a string.');
  }

  var arr = arrayify(getValue(obj, prop));
  setValue(obj, prop, arrUnion(arr, arrayify(value)));
  return obj;
};

function arrayify(val) {
  if (val === null || typeof val === 'undefined') {
    return [];
  }
  if (Array.isArray(val)) {
    return val;
  }
  return [val];
}

var toString$5 = {}.toString;

var isarray = Array.isArray || function (arr) {
  return toString$5.call(arr) == '[object Array]';
};

var isobject$1 = function isObject(val) {
  return val != null && typeof val === 'object' && isarray(val) === false;
};

/*!
 * has-values <https://github.com/jonschlinkert/has-values>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var hasValues = function hasValue(o, noZero) {
  if (o === null || o === undefined) {
    return false;
  }

  if (typeof o === 'boolean') {
    return true;
  }

  if (typeof o === 'number') {
    if (o === 0 && noZero === true) {
      return false;
    }
    return true;
  }

  if (o.length !== undefined) {
    return o.length !== 0;
  }

  for (var key in o) {
    if (o.hasOwnProperty(key)) {
      return true;
    }
  }
  return false;
};

var hasValue = function(obj, prop, noZero) {
  if (isobject$1(obj)) {
    return hasValues(getValue(obj, prop), noZero);
  }
  return hasValues(obj, prop);
};

var unsetValue = function unset(obj, prop) {
  if (!isobject(obj)) {
    throw new TypeError('expected an object.');
  }
  if (obj.hasOwnProperty(prop)) {
    delete obj[prop];
    return true;
  }

  if (hasValue(obj, prop)) {
    var segs = prop.split('.');
    var last = segs.pop();
    while (segs.length && segs[segs.length - 1].slice(-1) === '\\') {
      last = segs.pop().slice(0, -1) + '.' + last;
    }
    while (segs.length) obj = obj[prop = segs.shift()];
    return (delete obj[last]);
  }
  return true;
};

/**
 * Create a `Cache` constructor that when instantiated will
 * store values on the given `prop`.
 *
 * ```js
 * var Cache = require('cache-base').namespace('data');
 * var cache = new Cache();
 *
 * cache.set('foo', 'bar');
 * //=> {data: {foo: 'bar'}}
 * ```
 * @param {String} `prop` The property name to use for storing values.
 * @return {Function} Returns a custom `Cache` constructor
 * @api public
 */

function namespace(prop) {

  /**
   * Create a new `Cache`. Internally the `Cache` constructor is created using
   * the `namespace` function, with `cache` defined as the storage object.
   *
   * ```js
   * var app = new Cache();
   * ```
   * @param {Object} `cache` Optionally pass an object to initialize with.
   * @constructor
   * @api public
   */

  function Cache(cache) {
    if (prop) {
      this[prop] = {};
    }
    if (cache) {
      this.set(cache);
    }
  }

  /**
   * Inherit Emitter
   */

  componentEmitter(Cache.prototype);

  /**
   * Assign `value` to `key`. Also emits `set` with
   * the key and value.
   *
   * ```js
   * app.on('set', function(key, val) {
   *   // do something when `set` is emitted
   * });
   *
   * app.set(key, value);
   *
   * // also takes an object or array
   * app.set({name: 'Halle'});
   * app.set([{foo: 'bar'}, {baz: 'quux'}]);
   * console.log(app);
   * //=> {name: 'Halle', foo: 'bar', baz: 'quux'}
   * ```
   *
   * @name .set
   * @emits `set` with `key` and `value` as arguments.
   * @param {String} `key`
   * @param {any} `value`
   * @return {Object} Returns the instance for chaining.
   * @api public
   */

  Cache.prototype.set = function(key, val) {
    if (Array.isArray(key) && arguments.length === 2) {
      key = toObjectPath(key);
    }
    if (isobject(key) || Array.isArray(key)) {
      this.visit('set', key);
    } else {
      setValue(prop ? this[prop] : this, key, val);
      this.emit('set', key, val);
    }
    return this;
  };

  /**
   * Union `array` to `key`. Also emits `set` with
   * the key and value.
   *
   * ```js
   * app.union('a.b', ['foo']);
   * app.union('a.b', ['bar']);
   * console.log(app.get('a'));
   * //=> {b: ['foo', 'bar']}
   * ```
   * @name .union
   * @param {String} `key`
   * @param {any} `value`
   * @return {Object} Returns the instance for chaining.
   * @api public
   */

  Cache.prototype.union = function(key, val) {
    if (Array.isArray(key) && arguments.length === 2) {
      key = toObjectPath(key);
    }
    var ctx = prop ? this[prop] : this;
    unionValue(ctx, key, arrayify$1(val));
    this.emit('union', val);
    return this;
  };

  /**
   * Return the value of `key`. Dot notation may be used
   * to get [nested property values][get-value].
   *
   * ```js
   * app.set('a.b.c', 'd');
   * app.get('a.b');
   * //=> {c: 'd'}
   *
   * app.get(['a', 'b']);
   * //=> {c: 'd'}
   * ```
   *
   * @name .get
   * @emits `get` with `key` and `value` as arguments.
   * @param {String} `key` The name of the property to get. Dot-notation may be used.
   * @return {any} Returns the value of `key`
   * @api public
   */

  Cache.prototype.get = function(key) {
    key = toObjectPath(arguments);

    var ctx = prop ? this[prop] : this;
    var val = getValue(ctx, key);

    this.emit('get', key, val);
    return val;
  };

  /**
   * Return true if app has a stored value for `key`,
   * false only if value is `undefined`.
   *
   * ```js
   * app.set('foo', 'bar');
   * app.has('foo');
   * //=> true
   * ```
   *
   * @name .has
   * @emits `has` with `key` and true or false as arguments.
   * @param {String} `key`
   * @return {Boolean}
   * @api public
   */

  Cache.prototype.has = function(key) {
    key = toObjectPath(arguments);

    var ctx = prop ? this[prop] : this;
    var val = getValue(ctx, key);

    var has = typeof val !== 'undefined';
    this.emit('has', key, has);
    return has;
  };

  /**
   * Delete one or more properties from the instance.
   *
   * ```js
   * app.del(); // delete all
   * // or
   * app.del('foo');
   * // or
   * app.del(['foo', 'bar']);
   * ```
   * @name .del
   * @emits `del` with the `key` as the only argument.
   * @param {String|Array} `key` Property name or array of property names.
   * @return {Object} Returns the instance for chaining.
   * @api public
   */

  Cache.prototype.del = function(key) {
    if (Array.isArray(key)) {
      this.visit('del', key);
    } else {
      unsetValue(prop ? this[prop] : this, key);
      this.emit('del', key);
    }
    return this;
  };

  /**
   * Reset the entire cache to an empty object.
   *
   * ```js
   * app.clear();
   * ```
   * @api public
   */

  Cache.prototype.clear = function() {
    if (prop) {
      this[prop] = {};
    }
  };

  /**
   * Visit `method` over the properties in the given object, or map
   * visit over the object-elements in an array.
   *
   * @name .visit
   * @param {String} `method` The name of the `base` method to call.
   * @param {Object|Array} `val` The object or array to iterate over.
   * @return {Object} Returns the instance for chaining.
   * @api public
   */

  Cache.prototype.visit = function(method, val) {
    collectionVisit(this, method, val);
    return this;
  };

  return Cache;
}

/**
 * Cast val to an array
 */

function arrayify$1(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
}

/**
 * Expose `Cache`
 */

var cacheBase = namespace();

/**
 * Expose `Cache.namespace`
 */

var namespace_1 = namespace;
cacheBase.namespace = namespace_1;

var isExtendable$2 = function isExtendable(val) {
  return isPlainObject(val) || typeof val === 'function' || Array.isArray(val);
};

/*!
 * for-in <https://github.com/jonschlinkert/for-in>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var forIn = function forIn(obj, fn, thisArg) {
  for (var key in obj) {
    if (fn.call(thisArg, obj[key], key, obj) === false) {
      break;
    }
  }
};

function mixinDeep(target, objects) {
  var len = arguments.length, i = 0;
  while (++i < len) {
    var obj = arguments[i];
    if (isObject$4(obj)) {
      forIn(obj, copy, target);
    }
  }
  return target;
}

/**
 * Copy properties from the source object to the
 * target object.
 *
 * @param  {*} `val`
 * @param  {String} `key`
 */

function copy(val, key) {
  if (!isValidKey$1(key)) {
    return;
  }

  var obj = this[key];
  if (isObject$4(val) && isObject$4(obj)) {
    mixinDeep(obj, val);
  } else {
    this[key] = val;
  }
}

/**
 * Returns true if `val` is an object or function.
 *
 * @param  {any} val
 * @return {Boolean}
 */

function isObject$4(val) {
  return isExtendable$2(val) && !Array.isArray(val);
}

/**
 * Returns true if `key` is a valid key to use when extending objects.
 *
 * @param  {String} `key`
 * @return {Boolean}
 */

function isValidKey$1(key) {
  return key !== '__proto__' && key !== 'constructor' && key !== 'prototype';
}
/**
 * Expose `mixinDeep`
 */

var mixinDeep_1 = mixinDeep;

/*!
 * pascalcase <https://github.com/jonschlinkert/pascalcase>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

function pascalcase(str) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string.');
  }
  str = str.replace(/([A-Z])/g, ' $1');
  if (str.length === 1) { return str.toUpperCase(); }
  str = str.replace(/^[\W_]+|[\W_]+$/g, '').toLowerCase();
  str = str.charAt(0).toUpperCase() + str.slice(1);
  return str.replace(/[\W_]+(\w|$)/g, function (_, ch) {
    return ch.toUpperCase();
  });
}

var pascalcase_1 = pascalcase;

var toString$6 = Object.prototype.toString;

/**
 * Get the native `typeof` a value.
 *
 * @param  {*} `val`
 * @return {*} Native javascript type
 */

var kindOf$4 = function kindOf(val) {
  var type = typeof val;

  // primitivies
  if (type === 'undefined') {
    return 'undefined';
  }
  if (val === null) {
    return 'null';
  }
  if (val === true || val === false || val instanceof Boolean) {
    return 'boolean';
  }
  if (type === 'string' || val instanceof String) {
    return 'string';
  }
  if (type === 'number' || val instanceof Number) {
    return 'number';
  }

  // functions
  if (type === 'function' || val instanceof Function) {
    if (typeof val.constructor.name !== 'undefined' && val.constructor.name.slice(0, 9) === 'Generator') {
      return 'generatorfunction';
    }
    return 'function';
  }

  // array
  if (typeof Array.isArray !== 'undefined' && Array.isArray(val)) {
    return 'array';
  }

  // check for instances of RegExp and Date before calling `toString`
  if (val instanceof RegExp) {
    return 'regexp';
  }
  if (val instanceof Date) {
    return 'date';
  }

  // other objects
  type = toString$6.call(val);

  if (type === '[object RegExp]') {
    return 'regexp';
  }
  if (type === '[object Date]') {
    return 'date';
  }
  if (type === '[object Arguments]') {
    return 'arguments';
  }
  if (type === '[object Error]') {
    return 'error';
  }
  if (type === '[object Promise]') {
    return 'promise';
  }

  // buffer
  if (isBuffer$2(val)) {
    return 'buffer';
  }

  // es6: Map, WeakMap, Set, WeakSet
  if (type === '[object Set]') {
    return 'set';
  }
  if (type === '[object WeakSet]') {
    return 'weakset';
  }
  if (type === '[object Map]') {
    return 'map';
  }
  if (type === '[object WeakMap]') {
    return 'weakmap';
  }
  if (type === '[object Symbol]') {
    return 'symbol';
  }
  
  if (type === '[object Map Iterator]') {
    return 'mapiterator';
  }
  if (type === '[object Set Iterator]') {
    return 'setiterator';
  }
  if (type === '[object String Iterator]') {
    return 'stringiterator';
  }
  if (type === '[object Array Iterator]') {
    return 'arrayiterator';
  }
  
  // typed arrays
  if (type === '[object Int8Array]') {
    return 'int8array';
  }
  if (type === '[object Uint8Array]') {
    return 'uint8array';
  }
  if (type === '[object Uint8ClampedArray]') {
    return 'uint8clampedarray';
  }
  if (type === '[object Int16Array]') {
    return 'int16array';
  }
  if (type === '[object Uint16Array]') {
    return 'uint16array';
  }
  if (type === '[object Int32Array]') {
    return 'int32array';
  }
  if (type === '[object Uint32Array]') {
    return 'uint32array';
  }
  if (type === '[object Float32Array]') {
    return 'float32array';
  }
  if (type === '[object Float64Array]') {
    return 'float64array';
  }

  // must be a plain object
  return 'object';
};

/**
 * If you need to support Safari 5-7 (8-10 yr-old browser),
 * take a look at https://github.com/feross/is-buffer
 */

function isBuffer$2(val) {
  return val.constructor
    && typeof val.constructor.isBuffer === 'function'
    && val.constructor.isBuffer(val);
}

var toString$7 = Object.prototype.toString;

/**
 * Get the native `typeof` a value.
 *
 * @param  {*} `val`
 * @return {*} Native javascript type
 */

var kindOf$5 = function kindOf(val) {
  // primitivies
  if (typeof val === 'undefined') {
    return 'undefined';
  }
  if (val === null) {
    return 'null';
  }
  if (val === true || val === false || val instanceof Boolean) {
    return 'boolean';
  }
  if (typeof val === 'string' || val instanceof String) {
    return 'string';
  }
  if (typeof val === 'number' || val instanceof Number) {
    return 'number';
  }

  // functions
  if (typeof val === 'function' || val instanceof Function) {
    return 'function';
  }

  // array
  if (typeof Array.isArray !== 'undefined' && Array.isArray(val)) {
    return 'array';
  }

  // check for instances of RegExp and Date before calling `toString`
  if (val instanceof RegExp) {
    return 'regexp';
  }
  if (val instanceof Date) {
    return 'date';
  }

  // other objects
  var type = toString$7.call(val);

  if (type === '[object RegExp]') {
    return 'regexp';
  }
  if (type === '[object Date]') {
    return 'date';
  }
  if (type === '[object Arguments]') {
    return 'arguments';
  }
  if (type === '[object Error]') {
    return 'error';
  }

  // buffer
  if (isBuffer_1(val)) {
    return 'buffer';
  }

  // es6: Map, WeakMap, Set, WeakSet
  if (type === '[object Set]') {
    return 'set';
  }
  if (type === '[object WeakSet]') {
    return 'weakset';
  }
  if (type === '[object Map]') {
    return 'map';
  }
  if (type === '[object WeakMap]') {
    return 'weakmap';
  }
  if (type === '[object Symbol]') {
    return 'symbol';
  }

  // typed arrays
  if (type === '[object Int8Array]') {
    return 'int8array';
  }
  if (type === '[object Uint8Array]') {
    return 'uint8array';
  }
  if (type === '[object Uint8ClampedArray]') {
    return 'uint8clampedarray';
  }
  if (type === '[object Int16Array]') {
    return 'int16array';
  }
  if (type === '[object Uint16Array]') {
    return 'uint16array';
  }
  if (type === '[object Int32Array]') {
    return 'int32array';
  }
  if (type === '[object Uint32Array]') {
    return 'uint32array';
  }
  if (type === '[object Float32Array]') {
    return 'float32array';
  }
  if (type === '[object Float64Array]') {
    return 'float64array';
  }

  // must be a plain object
  return 'object';
};

// accessor descriptor properties
var accessor$3 = {
  get: 'function',
  set: 'function',
  configurable: 'boolean',
  enumerable: 'boolean'
};

function isAccessorDescriptor$3(obj, prop) {
  if (typeof prop === 'string') {
    var val = Object.getOwnPropertyDescriptor(obj, prop);
    return typeof val !== 'undefined';
  }

  if (kindOf$5(obj) !== 'object') {
    return false;
  }

  if (has$3(obj, 'value') || has$3(obj, 'writable')) {
    return false;
  }

  if (!has$3(obj, 'get') || typeof obj.get !== 'function') {
    return false;
  }

  // tldr: it's valid to have "set" be undefined
  // "set" might be undefined if `Object.getOwnPropertyDescriptor`
  // was used to get the value, and only `get` was defined by the user
  if (has$3(obj, 'set') && typeof obj[key] !== 'function' && typeof obj[key] !== 'undefined') {
    return false;
  }

  for (var key in obj) {
    if (!accessor$3.hasOwnProperty(key)) {
      continue;
    }

    if (kindOf$5(obj[key]) === accessor$3[key]) {
      continue;
    }

    if (typeof obj[key] !== 'undefined') {
      return false;
    }
  }
  return true;
}

function has$3(obj, key) {
  return {}.hasOwnProperty.call(obj, key);
}

/**
 * Expose `isAccessorDescriptor`
 */

var isAccessorDescriptor_1$3 = isAccessorDescriptor$3;

var toString$8 = Object.prototype.toString;

/**
 * Get the native `typeof` a value.
 *
 * @param  {*} `val`
 * @return {*} Native javascript type
 */

var kindOf$6 = function kindOf(val) {
  // primitivies
  if (typeof val === 'undefined') {
    return 'undefined';
  }
  if (val === null) {
    return 'null';
  }
  if (val === true || val === false || val instanceof Boolean) {
    return 'boolean';
  }
  if (typeof val === 'string' || val instanceof String) {
    return 'string';
  }
  if (typeof val === 'number' || val instanceof Number) {
    return 'number';
  }

  // functions
  if (typeof val === 'function' || val instanceof Function) {
    return 'function';
  }

  // array
  if (typeof Array.isArray !== 'undefined' && Array.isArray(val)) {
    return 'array';
  }

  // check for instances of RegExp and Date before calling `toString`
  if (val instanceof RegExp) {
    return 'regexp';
  }
  if (val instanceof Date) {
    return 'date';
  }

  // other objects
  var type = toString$8.call(val);

  if (type === '[object RegExp]') {
    return 'regexp';
  }
  if (type === '[object Date]') {
    return 'date';
  }
  if (type === '[object Arguments]') {
    return 'arguments';
  }
  if (type === '[object Error]') {
    return 'error';
  }

  // buffer
  if (isBuffer_1(val)) {
    return 'buffer';
  }

  // es6: Map, WeakMap, Set, WeakSet
  if (type === '[object Set]') {
    return 'set';
  }
  if (type === '[object WeakSet]') {
    return 'weakset';
  }
  if (type === '[object Map]') {
    return 'map';
  }
  if (type === '[object WeakMap]') {
    return 'weakmap';
  }
  if (type === '[object Symbol]') {
    return 'symbol';
  }

  // typed arrays
  if (type === '[object Int8Array]') {
    return 'int8array';
  }
  if (type === '[object Uint8Array]') {
    return 'uint8array';
  }
  if (type === '[object Uint8ClampedArray]') {
    return 'uint8clampedarray';
  }
  if (type === '[object Int16Array]') {
    return 'int16array';
  }
  if (type === '[object Uint16Array]') {
    return 'uint16array';
  }
  if (type === '[object Int32Array]') {
    return 'int32array';
  }
  if (type === '[object Uint32Array]') {
    return 'uint32array';
  }
  if (type === '[object Float32Array]') {
    return 'float32array';
  }
  if (type === '[object Float64Array]') {
    return 'float64array';
  }

  // must be a plain object
  return 'object';
};

// data descriptor properties
var data = {
  configurable: 'boolean',
  enumerable: 'boolean',
  writable: 'boolean'
};

function isDataDescriptor$3(obj, prop) {
  if (kindOf$6(obj) !== 'object') {
    return false;
  }

  if (typeof prop === 'string') {
    var val = Object.getOwnPropertyDescriptor(obj, prop);
    return typeof val !== 'undefined';
  }

  if (!('value' in obj) && !('writable' in obj)) {
    return false;
  }

  for (var key in obj) {
    if (key === 'value') continue;

    if (!data.hasOwnProperty(key)) {
      continue;
    }

    if (kindOf$6(obj[key]) === data[key]) {
      continue;
    }

    if (typeof obj[key] !== 'undefined') {
      return false;
    }
  }
  return true;
}

/**
 * Expose `isDataDescriptor`
 */

var isDataDescriptor_1 = isDataDescriptor$3;

var isDescriptor$3 = function isDescriptor(obj, key) {
  if (kindOf$4(obj) !== 'object') {
    return false;
  }
  if ('get' in obj) {
    return isAccessorDescriptor_1$3(obj, key);
  }
  return isDataDescriptor_1(obj, key);
};

var defineProperty$3 = function defineProperty(obj, prop, val) {
  if (typeof obj !== 'object' && typeof obj !== 'function') {
    throw new TypeError('expected an object or function.');
  }

  if (typeof prop !== 'string') {
    throw new TypeError('expected `prop` to be a string.');
  }

  if (isDescriptor$3(val) && ('set' in val || 'get' in val)) {
    return Object.defineProperty(obj, prop, val);
  }

  return Object.defineProperty(obj, prop, {
    configurable: true,
    enumerable: false,
    writable: true,
    value: val
  });
};

var toString$9 = Object.prototype.toString;

/**
 * Get the native `typeof` a value.
 *
 * @param  {*} `val`
 * @return {*} Native javascript type
 */

var kindOf$7 = function kindOf(val) {
  // primitivies
  if (typeof val === 'undefined') {
    return 'undefined';
  }
  if (val === null) {
    return 'null';
  }
  if (val === true || val === false || val instanceof Boolean) {
    return 'boolean';
  }
  if (typeof val === 'string' || val instanceof String) {
    return 'string';
  }
  if (typeof val === 'number' || val instanceof Number) {
    return 'number';
  }

  // functions
  if (typeof val === 'function' || val instanceof Function) {
    return 'function';
  }

  // array
  if (typeof Array.isArray !== 'undefined' && Array.isArray(val)) {
    return 'array';
  }

  // check for instances of RegExp and Date before calling `toString`
  if (val instanceof RegExp) {
    return 'regexp';
  }
  if (val instanceof Date) {
    return 'date';
  }

  // other objects
  var type = toString$9.call(val);

  if (type === '[object RegExp]') {
    return 'regexp';
  }
  if (type === '[object Date]') {
    return 'date';
  }
  if (type === '[object Arguments]') {
    return 'arguments';
  }
  if (type === '[object Error]') {
    return 'error';
  }

  // buffer
  if (isBuffer_1(val)) {
    return 'buffer';
  }

  // es6: Map, WeakMap, Set, WeakSet
  if (type === '[object Set]') {
    return 'set';
  }
  if (type === '[object WeakSet]') {
    return 'weakset';
  }
  if (type === '[object Map]') {
    return 'map';
  }
  if (type === '[object WeakMap]') {
    return 'weakmap';
  }
  if (type === '[object Symbol]') {
    return 'symbol';
  }

  // typed arrays
  if (type === '[object Int8Array]') {
    return 'int8array';
  }
  if (type === '[object Uint8Array]') {
    return 'uint8array';
  }
  if (type === '[object Uint8ClampedArray]') {
    return 'uint8clampedarray';
  }
  if (type === '[object Int16Array]') {
    return 'int16array';
  }
  if (type === '[object Uint16Array]') {
    return 'uint16array';
  }
  if (type === '[object Int32Array]') {
    return 'int32array';
  }
  if (type === '[object Uint32Array]') {
    return 'uint32array';
  }
  if (type === '[object Float32Array]') {
    return 'float32array';
  }
  if (type === '[object Float64Array]') {
    return 'float64array';
  }

  // must be a plain object
  return 'object';
};

/*!
 * copy-descriptor <https://github.com/jonschlinkert/copy-descriptor>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

/**
 * Copy a descriptor from one object to another.
 *
 * ```js
 * function App() {
 *   this.cache = {};
 * }
 * App.prototype.set = function(key, val) {
 *   this.cache[key] = val;
 *   return this;
 * };
 * Object.defineProperty(App.prototype, 'count', {
 *   get: function() {
 *     return Object.keys(this.cache).length;
 *   }
 * });
 *
 * copy(App.prototype, 'count', 'len');
 *
 * // create an instance
 * var app = new App();
 *
 * app.set('a', true);
 * app.set('b', true);
 * app.set('c', true);
 *
 * console.log(app.count);
 * //=> 3
 * console.log(app.len);
 * //=> 3
 * ```
 * @name copy
 * @param {Object} `receiver` The target object
 * @param {Object} `provider` The provider object
 * @param {String} `from` The key to copy on provider.
 * @param {String} `to` Optionally specify a new key name to use.
 * @return {Object}
 * @api public
 */

var copyDescriptor = function copyDescriptor(receiver, provider, from, to) {
  if (!isObject$5(provider) && typeof provider !== 'function') {
    to = from;
    from = provider;
    provider = receiver;
  }
  if (!isObject$5(receiver) && typeof receiver !== 'function') {
    throw new TypeError('expected the first argument to be an object');
  }
  if (!isObject$5(provider) && typeof provider !== 'function') {
    throw new TypeError('expected provider to be an object');
  }

  if (typeof to !== 'string') {
    to = from;
  }
  if (typeof from !== 'string') {
    throw new TypeError('expected key to be a string');
  }

  if (!(from in provider)) {
    throw new Error('property "' + from + '" does not exist');
  }

  var val = Object.getOwnPropertyDescriptor(provider, from);
  if (val) Object.defineProperty(receiver, to, val);
};

function isObject$5(val) {
  return {}.toString.call(val) === '[object Object]';
}

var defineProperty$4 = function defineProperty(obj, prop, val) {
  if (typeof obj !== 'object' && typeof obj !== 'function') {
    throw new TypeError('expected an object or function.');
  }

  if (typeof prop !== 'string') {
    throw new TypeError('expected `prop` to be a string.');
  }

  if (isDescriptor$3(val) && ('set' in val || 'get' in val)) {
    return Object.defineProperty(obj, prop, val);
  }

  return Object.defineProperty(obj, prop, {
    configurable: true,
    enumerable: false,
    writable: true,
    value: val
  });
};

/**
 * Copy static properties, prototype properties, and descriptors from one object to another.
 *
 * ```js
 * function App() {}
 * var proto = App.prototype;
 * App.prototype.set = function() {};
 * App.prototype.get = function() {};
 *
 * var obj = {};
 * copy(obj, proto);
 * ```
 * @param {Object} `receiver`
 * @param {Object} `provider`
 * @param {String|Array} `omit` One or more properties to omit
 * @return {Object}
 * @api public
 */

function copy$1(receiver, provider, omit) {
  if (!isObject$6(receiver)) {
    throw new TypeError('expected receiving object to be an object.');
  }
  if (!isObject$6(provider)) {
    throw new TypeError('expected providing object to be an object.');
  }

  var props = nativeKeys(provider);
  var keys = Object.keys(provider);
  var len = props.length;
  omit = arrayify$2(omit);

  while (len--) {
    var key = props[len];

    if (has$4(keys, key)) {
      defineProperty$4(receiver, key, provider[key]);
    } else if (!(key in receiver) && !has$4(omit, key)) {
      copyDescriptor(receiver, provider, key);
    }
  }
}
/**
 * Return true if the given value is an object or function
 */

function isObject$6(val) {
  return kindOf$7(val) === 'object' || typeof val === 'function';
}

/**
 * Returns true if an array has any of the given elements, or an
 * object has any of the give keys.
 *
 * ```js
 * has(['a', 'b', 'c'], 'c');
 * //=> true
 *
 * has(['a', 'b', 'c'], ['c', 'z']);
 * //=> true
 *
 * has({a: 'b', c: 'd'}, ['c', 'z']);
 * //=> true
 * ```
 * @param {Object} `obj`
 * @param {String|Array} `val`
 * @return {Boolean}
 */

function has$4(obj, val) {
  val = arrayify$2(val);
  var len = val.length;

  if (isObject$6(obj)) {
    for (var key in obj) {
      if (val.indexOf(key) > -1) {
        return true;
      }
    }

    var keys = nativeKeys(obj);
    return has$4(keys, val);
  }

  if (Array.isArray(obj)) {
    var arr = obj;
    while (len--) {
      if (arr.indexOf(val[len]) > -1) {
        return true;
      }
    }
    return false;
  }

  throw new TypeError('expected an array or object.');
}

/**
 * Cast the given value to an array.
 *
 * ```js
 * arrayify('foo');
 * //=> ['foo']
 *
 * arrayify(['foo']);
 * //=> ['foo']
 * ```
 *
 * @param {String|Array} `val`
 * @return {Array}
 */

function arrayify$2(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
}

/**
 * Returns true if a value has a `contructor`
 *
 * ```js
 * hasConstructor({});
 * //=> true
 *
 * hasConstructor(Object.create(null));
 * //=> false
 * ```
 * @param  {Object} `value`
 * @return {Boolean}
 */

function hasConstructor(val) {
  return isObject$6(val) && typeof val.constructor !== 'undefined';
}

/**
 * Get the native `ownPropertyNames` from the constructor of the
 * given `object`. An empty array is returned if the object does
 * not have a constructor.
 *
 * ```js
 * nativeKeys({a: 'b', b: 'c', c: 'd'})
 * //=> ['a', 'b', 'c']
 *
 * nativeKeys(function(){})
 * //=> ['length', 'caller']
 * ```
 *
 * @param  {Object} `obj` Object that has a `constructor`.
 * @return {Array} Array of keys.
 */

function nativeKeys(val) {
  if (!hasConstructor(val)) return [];
  return Object.getOwnPropertyNames(val);
}

/**
 * Expose `copy`
 */

var objectCopy = copy$1;

/**
 * Expose `copy.has` for tests
 */

var has_1 = has$4;
objectCopy.has = has_1;

var defineProperty$5 = function defineProperty(obj, prop, val) {
  if (typeof obj !== 'object' && typeof obj !== 'function') {
    throw new TypeError('expected an object or function.');
  }

  if (typeof prop !== 'string') {
    throw new TypeError('expected `prop` to be a string.');
  }

  if (isDescriptor$3(val) && ('set' in val || 'get' in val)) {
    return Object.defineProperty(obj, prop, val);
  }

  return Object.defineProperty(obj, prop, {
    configurable: true,
    enumerable: false,
    writable: true,
    value: val
  });
};

/**
 * Returns a function for extending the static properties,
 * prototype properties, and descriptors from the `Parent`
 * constructor onto `Child` constructors.
 *
 * ```js
 * var extend = require('static-extend');
 * Parent.extend = extend(Parent);
 *
 * // optionally pass a custom merge function as the second arg
 * Parent.extend = extend(Parent, function(Child) {
 *   Child.prototype.mixin = function(key, val) {
 *     Child.prototype[key] = val;
 *   };
 * });
 *
 * // extend "child" constructors
 * Parent.extend(Child);
 *
 * // optionally define prototype methods as the second arg
 * Parent.extend(Child, {
 *   foo: function() {},
 *   bar: function() {}
 * });
 * ```
 * @param {Function} `Parent` Parent ctor
 * @param {Function} `extendFn` Optional extend function for handling any necessary custom merging. Useful when updating methods that require a specific prototype.
 *   @param {Function} `Child` Child ctor
 *   @param {Object} `proto` Optionally pass additional prototype properties to inherit.
 *   @return {Object}
 * @api public
 */

function extend(Parent, extendFn) {
  if (typeof Parent !== 'function') {
    throw new TypeError('expected Parent to be a function.');
  }

  return function(Ctor, proto) {
    if (typeof Ctor !== 'function') {
      throw new TypeError('expected Ctor to be a function.');
    }

    util$3.inherits(Ctor, Parent);
    objectCopy(Ctor, Parent);

    // proto can be null or a plain object
    if (typeof proto === 'object') {
      var obj = Object.create(proto);

      for (var k in obj) {
        Ctor.prototype[k] = obj[k];
      }
    }

    // keep a reference to the parent prototype
    defineProperty$5(Ctor.prototype, '_parent_', {
      configurable: true,
      set: function() {},
      get: function() {
        return Parent.prototype;
      }
    });

    if (typeof extendFn === 'function') {
      extendFn(Ctor, Parent);
    }

    Ctor.extend = extend(Ctor, extendFn);
  };
}
/**
 * Expose `extend`
 */

var staticExtend = extend;

var classUtils = createCommonjsModule(function (module) {







/**
 * Expose class utils
 */

var cu = module.exports;

/**
 * Expose class utils: `cu`
 */

cu.isObject = function isObject(val) {
  return isobject(val) || typeof val === 'function';
};

/**
 * Returns true if an array has any of the given elements, or an
 * object has any of the give keys.
 *
 * ```js
 * cu.has(['a', 'b', 'c'], 'c');
 * //=> true
 *
 * cu.has(['a', 'b', 'c'], ['c', 'z']);
 * //=> true
 *
 * cu.has({a: 'b', c: 'd'}, ['c', 'z']);
 * //=> true
 * ```
 * @param {Object} `obj`
 * @param {String|Array} `val`
 * @return {Boolean}
 * @api public
 */

cu.has = function has(obj, val) {
  val = cu.arrayify(val);
  var len = val.length;

  if (cu.isObject(obj)) {
    for (var key in obj) {
      if (val.indexOf(key) > -1) {
        return true;
      }
    }

    var keys = cu.nativeKeys(obj);
    return cu.has(keys, val);
  }

  if (Array.isArray(obj)) {
    var arr = obj;
    while (len--) {
      if (arr.indexOf(val[len]) > -1) {
        return true;
      }
    }
    return false;
  }

  throw new TypeError('expected an array or object.');
};

/**
 * Returns true if an array or object has all of the given values.
 *
 * ```js
 * cu.hasAll(['a', 'b', 'c'], 'c');
 * //=> true
 *
 * cu.hasAll(['a', 'b', 'c'], ['c', 'z']);
 * //=> false
 *
 * cu.hasAll({a: 'b', c: 'd'}, ['c', 'z']);
 * //=> false
 * ```
 * @param {Object|Array} `val`
 * @param {String|Array} `values`
 * @return {Boolean}
 * @api public
 */

cu.hasAll = function hasAll(val, values) {
  values = cu.arrayify(values);
  var len = values.length;
  while (len--) {
    if (!cu.has(val, values[len])) {
      return false;
    }
  }
  return true;
};

/**
 * Cast the given value to an array.
 *
 * ```js
 * cu.arrayify('foo');
 * //=> ['foo']
 *
 * cu.arrayify(['foo']);
 * //=> ['foo']
 * ```
 *
 * @param {String|Array} `val`
 * @return {Array}
 * @api public
 */

cu.arrayify = function arrayify(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Noop
 */

cu.noop = function noop() {
  return;
};

/**
 * Returns the first argument passed to the function.
 */

cu.identity = function identity(val) {
  return val;
};

/**
 * Returns true if a value has a `contructor`
 *
 * ```js
 * cu.hasConstructor({});
 * //=> true
 *
 * cu.hasConstructor(Object.create(null));
 * //=> false
 * ```
 * @param  {Object} `value`
 * @return {Boolean}
 * @api public
 */

cu.hasConstructor = function hasConstructor(val) {
  return cu.isObject(val) && typeof val.constructor !== 'undefined';
};

/**
 * Get the native `ownPropertyNames` from the constructor of the
 * given `object`. An empty array is returned if the object does
 * not have a constructor.
 *
 * ```js
 * cu.nativeKeys({a: 'b', b: 'c', c: 'd'})
 * //=> ['a', 'b', 'c']
 *
 * cu.nativeKeys(function(){})
 * //=> ['length', 'caller']
 * ```
 *
 * @param  {Object} `obj` Object that has a `constructor`.
 * @return {Array} Array of keys.
 * @api public
 */

cu.nativeKeys = function nativeKeys(val) {
  if (!cu.hasConstructor(val)) return [];
  var keys = Object.getOwnPropertyNames(val);
  if ('caller' in val) keys.push('caller');
  return keys;
};

/**
 * Returns property descriptor `key` if it's an "own" property
 * of the given object.
 *
 * ```js
 * function App() {}
 * Object.defineProperty(App.prototype, 'count', {
 *   get: function() {
 *     return Object.keys(this).length;
 *   }
 * });
 * cu.getDescriptor(App.prototype, 'count');
 * // returns:
 * // {
 * //   get: [Function],
 * //   set: undefined,
 * //   enumerable: false,
 * //   configurable: false
 * // }
 * ```
 *
 * @param {Object} `obj`
 * @param {String} `key`
 * @return {Object} Returns descriptor `key`
 * @api public
 */

cu.getDescriptor = function getDescriptor(obj, key) {
  if (!cu.isObject(obj)) {
    throw new TypeError('expected an object.');
  }
  if (typeof key !== 'string') {
    throw new TypeError('expected key to be a string.');
  }
  return Object.getOwnPropertyDescriptor(obj, key);
};

/**
 * Copy a descriptor from one object to another.
 *
 * ```js
 * function App() {}
 * Object.defineProperty(App.prototype, 'count', {
 *   get: function() {
 *     return Object.keys(this).length;
 *   }
 * });
 * var obj = {};
 * cu.copyDescriptor(obj, App.prototype, 'count');
 * ```
 * @param {Object} `receiver`
 * @param {Object} `provider`
 * @param {String} `name`
 * @return {Object}
 * @api public
 */

cu.copyDescriptor = function copyDescriptor(receiver, provider, name) {
  if (!cu.isObject(receiver)) {
    throw new TypeError('expected receiving object to be an object.');
  }
  if (!cu.isObject(provider)) {
    throw new TypeError('expected providing object to be an object.');
  }
  if (typeof name !== 'string') {
    throw new TypeError('expected name to be a string.');
  }

  var val = cu.getDescriptor(provider, name);
  if (val) Object.defineProperty(receiver, name, val);
};

/**
 * Copy static properties, prototype properties, and descriptors
 * from one object to another.
 *
 * @param {Object} `receiver`
 * @param {Object} `provider`
 * @param {String|Array} `omit` One or more properties to omit
 * @return {Object}
 * @api public
 */

cu.copy = function copy(receiver, provider, omit) {
  if (!cu.isObject(receiver)) {
    throw new TypeError('expected receiving object to be an object.');
  }
  if (!cu.isObject(provider)) {
    throw new TypeError('expected providing object to be an object.');
  }
  var props = Object.getOwnPropertyNames(provider);
  var keys = Object.keys(provider);
  var len = props.length,
    key;
  omit = cu.arrayify(omit);

  while (len--) {
    key = props[len];

    if (cu.has(keys, key)) {
      defineProperty$3(receiver, key, provider[key]);
    } else if (!(key in receiver) && !cu.has(omit, key)) {
      cu.copyDescriptor(receiver, provider, key);
    }
  }
};

/**
 * Inherit the static properties, prototype properties, and descriptors
 * from of an object.
 *
 * @param {Object} `receiver`
 * @param {Object} `provider`
 * @param {String|Array} `omit` One or more properties to omit
 * @return {Object}
 * @api public
 */

cu.inherit = function inherit(receiver, provider, omit) {
  if (!cu.isObject(receiver)) {
    throw new TypeError('expected receiving object to be an object.');
  }
  if (!cu.isObject(provider)) {
    throw new TypeError('expected providing object to be an object.');
  }

  var keys = [];
  for (var key in provider) {
    keys.push(key);
    receiver[key] = provider[key];
  }

  keys = keys.concat(cu.arrayify(omit));

  var a = provider.prototype || provider;
  var b = receiver.prototype || receiver;
  cu.copy(b, a, keys);
};

/**
 * Returns a function for extending the static properties,
 * prototype properties, and descriptors from the `Parent`
 * constructor onto `Child` constructors.
 *
 * ```js
 * var extend = cu.extend(Parent);
 * Parent.extend(Child);
 *
 * // optional methods
 * Parent.extend(Child, {
 *   foo: function() {},
 *   bar: function() {}
 * });
 * ```
 * @param {Function} `Parent` Parent ctor
 * @param {Function} `extend` Optional extend function to handle custom extensions. Useful when updating methods that require a specific prototype.
 *   @param {Function} `Child` Child ctor
 *   @param {Object} `proto` Optionally pass additional prototype properties to inherit.
 *   @return {Object}
 * @api public
 */

cu.extend = function() {
  // keep it lazy, instead of assigning to `cu.extend`
  return staticExtend.apply(null, arguments);
};

/**
 * Bubble up events emitted from static methods on the Parent ctor.
 *
 * @param {Object} `Parent`
 * @param {Array} `events` Event names to bubble up
 * @api public
 */

cu.bubble = function(Parent, events) {
  events = events || [];
  Parent.bubble = function(Child, arr) {
    if (Array.isArray(arr)) {
      events = arrUnion([], events, arr);
    }
    var len = events.length;
    var idx = -1;
    while (++idx < len) {
      var name = events[idx];
      Parent.on(name, Child.emit.bind(Child, name));
    }
    cu.bubble(Child, events);
  };
};
});

/**
 * Optionally define a custom `cache` namespace to use.
 */

function namespace$1(name) {
  var Cache = name ? cacheBase.namespace(name) : cacheBase;
  var fns = [];

  /**
   * Create an instance of `Base` with the given `config` and `options`.
   *
   * ```js
   * // initialize with `config` and `options`
   * var app = new Base({isApp: true}, {abc: true});
   * app.set('foo', 'bar');
   *
   * // values defined with the given `config` object will be on the root of the instance
   * console.log(app.baz); //=> undefined
   * console.log(app.foo); //=> 'bar'
   * // or use `.get`
   * console.log(app.get('isApp')); //=> true
   * console.log(app.get('foo')); //=> 'bar'
   *
   * // values defined with the given `options` object will be on `app.options
   * console.log(app.options.abc); //=> true
   * ```
   *
   * @param {Object} `config` If supplied, this object is passed to [cache-base][] to merge onto the the instance upon instantiation.
   * @param {Object} `options` If supplied, this object is used to initialize the `base.options` object.
   * @api public
   */

  function Base(config, options) {
    if (!(this instanceof Base)) {
      return new Base(config, options);
    }
    Cache.call(this, config);
    this.is('base');
    this.initBase(config, options);
  }

  /**
   * Inherit cache-base
   */

  util$3.inherits(Base, Cache);

  /**
   * Add static emitter methods
   */

  componentEmitter(Base);

  /**
   * Initialize `Base` defaults with the given `config` object
   */

  Base.prototype.initBase = function(config, options) {
    this.options = mixinDeep_1({}, this.options, options);
    this.cache = this.cache || {};
    this.define('registered', {});
    if (name) this[name] = {};

    // make `app._callbacks` non-enumerable
    this.define('_callbacks', this._callbacks);
    if (isobject(config)) {
      this.visit('set', config);
    }
    Base.run(this, 'use', fns);
  };

  /**
   * Set the given `name` on `app._name` and `app.is*` properties. Used for doing
   * lookups in plugins.
   *
   * ```js
   * app.is('foo');
   * console.log(app._name);
   * //=> 'foo'
   * console.log(app.isFoo);
   * //=> true
   * app.is('bar');
   * console.log(app.isFoo);
   * //=> true
   * console.log(app.isBar);
   * //=> true
   * console.log(app._name);
   * //=> 'bar'
   * ```
   * @name .is
   * @param {String} `name`
   * @return {Boolean}
   * @api public
   */

  Base.prototype.is = function(name) {
    if (typeof name !== 'string') {
      throw new TypeError('expected name to be a string');
    }
    this.define('is' + pascalcase_1(name), true);
    this.define('_name', name);
    this.define('_appname', name);
    return this;
  };

  /**
   * Returns true if a plugin has already been registered on an instance.
   *
   * Plugin implementors are encouraged to use this first thing in a plugin
   * to prevent the plugin from being called more than once on the same
   * instance.
   *
   * ```js
   * var base = new Base();
   * base.use(function(app) {
   *   if (app.isRegistered('myPlugin')) return;
   *   // do stuff to `app`
   * });
   *
   * // to also record the plugin as being registered
   * base.use(function(app) {
   *   if (app.isRegistered('myPlugin', true)) return;
   *   // do stuff to `app`
   * });
   * ```
   * @name .isRegistered
   * @emits `plugin` Emits the name of the plugin being registered. Useful for unit tests, to ensure plugins are only registered once.
   * @param {String} `name` The plugin name.
   * @param {Boolean} `register` If the plugin if not already registered, to record it as being registered pass `true` as the second argument.
   * @return {Boolean} Returns true if a plugin is already registered.
   * @api public
   */

  Base.prototype.isRegistered = function(name, register) {
    if (this.registered.hasOwnProperty(name)) {
      return true;
    }
    if (register !== false) {
      this.registered[name] = true;
      this.emit('plugin', name);
    }
    return false;
  };

  /**
   * Define a plugin function to be called immediately upon init. Plugins are chainable
   * and expose the following arguments to the plugin function:
   *
   * - `app`: the current instance of `Base`
   * - `base`: the [first ancestor instance](#base) of `Base`
   *
   * ```js
   * var app = new Base()
   *   .use(foo)
   *   .use(bar)
   *   .use(baz)
   * ```
   * @name .use
   * @param {Function} `fn` plugin function to call
   * @return {Object} Returns the item instance for chaining.
   * @api public
   */

  Base.prototype.use = function(fn) {
    fn.call(this, this);
    return this;
  };

  /**
   * The `.define` method is used for adding non-enumerable property on the instance.
   * Dot-notation is **not supported** with `define`.
   *
   * ```js
   * // arbitrary `render` function using lodash `template`
   * app.define('render', function(str, locals) {
   *   return _.template(str)(locals);
   * });
   * ```
   * @name .define
   * @param {String} `key` The name of the property to define.
   * @param {any} `value`
   * @return {Object} Returns the instance for chaining.
   * @api public
   */

  Base.prototype.define = function(key, val) {
    if (isobject(key)) {
      return this.visit('define', key);
    }
    defineProperty$2(this, key, val);
    return this;
  };

  /**
   * Mix property `key` onto the Base prototype. If base is inherited using
   * `Base.extend` this method will be overridden by a new `mixin` method that will
   * only add properties to the prototype of the inheriting application.
   *
   * ```js
   * app.mixin('foo', function() {
   *   // do stuff
   * });
   * ```
   * @name .mixin
   * @param {String} `key`
   * @param {Object|Array} `val`
   * @return {Object} Returns the `base` instance for chaining.
   * @api public
   */

  Base.prototype.mixin = function(key, val) {
    Base.prototype[key] = val;
    return this;
  };

  /**
   * Non-enumberable mixin array, used by the static [Base.mixin]() method.
   */

  Base.prototype.mixins = Base.prototype.mixins || [];

  /**
   * Getter/setter used when creating nested instances of `Base`, for storing a reference
   * to the first ancestor instance. This works by setting an instance of `Base` on the `parent`
   * property of a "child" instance. The `base` property defaults to the current instance if
   * no `parent` property is defined.
   *
   * ```js
   * // create an instance of `Base`, this is our first ("base") instance
   * var first = new Base();
   * first.foo = 'bar'; // arbitrary property, to make it easier to see what's happening later
   *
   * // create another instance
   * var second = new Base();
   * // create a reference to the first instance (`first`)
   * second.parent = first;
   *
   * // create another instance
   * var third = new Base();
   * // create a reference to the previous instance (`second`)
   * // repeat this pattern every time a "child" instance is created
   * third.parent = second;
   *
   * // we can always access the first instance using the `base` property
   * console.log(first.base.foo);
   * //=> 'bar'
   * console.log(second.base.foo);
   * //=> 'bar'
   * console.log(third.base.foo);
   * //=> 'bar'
   * // and now you know how to get to third base ;)
   * ```
   * @name .base
   * @api public
   */

  Object.defineProperty(Base.prototype, 'base', {
    configurable: true,
    get: function() {
      return this.parent ? this.parent.base : this;
    }
  });

  /**
   * Static method for adding global plugin functions that will
   * be added to an instance when created.
   *
   * ```js
   * Base.use(function(app) {
   *   app.foo = 'bar';
   * });
   * var app = new Base();
   * console.log(app.foo);
   * //=> 'bar'
   * ```
   * @name #use
   * @param {Function} `fn` Plugin function to use on each instance.
   * @return {Object} Returns the `Base` constructor for chaining
   * @api public
   */

  defineProperty$2(Base, 'use', function(fn) {
    fns.push(fn);
    return Base;
  });

  /**
   * Run an array of functions by passing each function
   * to a method on the given object specified by the given property.
   *
   * @param  {Object} `obj` Object containing method to use.
   * @param  {String} `prop` Name of the method on the object to use.
   * @param  {Array} `arr` Array of functions to pass to the method.
   */

  defineProperty$2(Base, 'run', function(obj, prop, arr) {
    var len = arr.length, i = 0;
    while (len--) {
      obj[prop](arr[i++]);
    }
    return Base;
  });

  /**
   * Static method for inheriting the prototype and static methods of the `Base` class.
   * This method greatly simplifies the process of creating inheritance-based applications.
   * See [static-extend][] for more details.
   *
   * ```js
   * var extend = cu.extend(Parent);
   * Parent.extend(Child);
   *
   * // optional methods
   * Parent.extend(Child, {
   *   foo: function() {},
   *   bar: function() {}
   * });
   * ```
   * @name #extend
   * @param {Function} `Ctor` constructor to extend
   * @param {Object} `methods` Optional prototype properties to mix in.
   * @return {Object} Returns the `Base` constructor for chaining
   * @api public
   */

  defineProperty$2(Base, 'extend', classUtils.extend(Base, function(Ctor, Parent) {
    Ctor.prototype.mixins = Ctor.prototype.mixins || [];

    defineProperty$2(Ctor, 'mixin', function(fn) {
      var mixin = fn(Ctor.prototype, Ctor);
      if (typeof mixin === 'function') {
        Ctor.prototype.mixins.push(mixin);
      }
      return Ctor;
    });

    defineProperty$2(Ctor, 'mixins', function(Child) {
      Base.run(Child, 'mixin', Ctor.prototype.mixins);
      return Ctor;
    });

    Ctor.prototype.mixin = function(key, value) {
      Ctor.prototype[key] = value;
      return this;
    };
    return Base;
  }));

  /**
   * Used for adding methods to the `Base` prototype, and/or to the prototype of child instances.
   * When a mixin function returns a function, the returned function is pushed onto the `.mixins`
   * array, making it available to be used on inheriting classes whenever `Base.mixins()` is
   * called (e.g. `Base.mixins(Child)`).
   *
   * ```js
   * Base.mixin(function(proto) {
   *   proto.foo = function(msg) {
   *     return 'foo ' + msg;
   *   };
   * });
   * ```
   * @name #mixin
   * @param {Function} `fn` Function to call
   * @return {Object} Returns the `Base` constructor for chaining
   * @api public
   */

  defineProperty$2(Base, 'mixin', function(fn) {
    var mixin = fn(Base.prototype, Base);
    if (typeof mixin === 'function') {
      Base.prototype.mixins.push(mixin);
    }
    return Base;
  });

  /**
   * Static method for running global mixin functions against a child constructor.
   * Mixins must be registered before calling this method.
   *
   * ```js
   * Base.extend(Child);
   * Base.mixins(Child);
   * ```
   * @name #mixins
   * @param {Function} `Child` Constructor function of a child class
   * @return {Object} Returns the `Base` constructor for chaining
   * @api public
   */

  defineProperty$2(Base, 'mixins', function(Child) {
    Base.run(Child, 'mixin', Base.prototype.mixins);
    return Base;
  });

  /**
   * Similar to `util.inherit`, but copies all static properties, prototype properties, and
   * getters/setters from `Provider` to `Receiver`. See [class-utils][]{#inherit} for more details.
   *
   * ```js
   * Base.inherit(Foo, Bar);
   * ```
   * @name #inherit
   * @param {Function} `Receiver` Receiving (child) constructor
   * @param {Function} `Provider` Providing (parent) constructor
   * @return {Object} Returns the `Base` constructor for chaining
   * @api public
   */

  defineProperty$2(Base, 'inherit', classUtils.inherit);
  defineProperty$2(Base, 'bubble', classUtils.bubble);
  return Base;
}

/**
 * Expose `Base` with default settings
 */

var base = namespace$1();

/**
 * Allow users to define a namespace
 */

var namespace_1$1 = namespace$1;
base.namespace = namespace_1$1;

var defineProperty$6 = function defineProperty(obj, prop, val) {
  if (typeof obj !== 'object' && typeof obj !== 'function') {
    throw new TypeError('expected an object or function.');
  }

  if (typeof prop !== 'string') {
    throw new TypeError('expected `prop` to be a string.');
  }

  if (isDescriptor$3(val) && ('set' in val || 'get' in val)) {
    return Object.defineProperty(obj, prop, val);
  }

  return Object.defineProperty(obj, prop, {
    configurable: true,
    enumerable: false,
    writable: true,
    value: val
  });
};

/*!
 * use <https://github.com/jonschlinkert/use>
 *
 * Copyright (c) 2015-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var use = function base(app, options) {
  if (!isObject$7(app) && typeof app !== 'function') {
    throw new TypeError('expected an object or function');
  }

  var opts = isObject$7(options) ? options : {};
  var prop = typeof opts.prop === 'string' ? opts.prop : 'fns';
  if (!Array.isArray(app[prop])) {
    define$1(app, prop, []);
  }

  /**
   * Define a plugin function to be passed to use. The only
   * parameter exposed to the plugin is `app`, the object or function.
   * passed to `use(app)`. `app` is also exposed as `this` in plugins.
   *
   * Additionally, **if a plugin returns a function, the function will
   * be pushed onto the `fns` array**, allowing the plugin to be
   * called at a later point by the `run` method.
   *
   * ```js
   * var use = require('use');
   *
   * // define a plugin
   * function foo(app) {
   *   // do stuff
   * }
   *
   * var app = function(){};
   * use(app);
   *
   * // register plugins
   * app.use(foo);
   * app.use(bar);
   * app.use(baz);
   * ```
   * @name .use
   * @param {Function} `fn` plugin function to call
   * @api public
   */

  define$1(app, 'use', use);

  /**
   * Run all plugins on `fns`. Any plugin that returns a function
   * when called by `use` is pushed onto the `fns` array.
   *
   * ```js
   * var config = {};
   * app.run(config);
   * ```
   * @name .run
   * @param {Object} `value` Object to be modified by plugins.
   * @return {Object} Returns the object passed to `run`
   * @api public
   */

  define$1(app, 'run', function(val) {
    if (!isObject$7(val)) return;

    if (!val.use || !val.run) {
      define$1(val, prop, val[prop] || []);
      define$1(val, 'use', use);
    }

    if (!val[prop] || val[prop].indexOf(base) === -1) {
      val.use(base);
    }

    var self = this || app;
    var fns = self[prop];
    var len = fns.length;
    var idx = -1;

    while (++idx < len) {
      val.use(fns[idx]);
    }
    return val;
  });

  /**
   * Call plugin `fn`. If a function is returned push it into the
   * `fns` array to be called by the `run` method.
   */

  function use(type, fn, options) {
    var offset = 1;

    if (typeof type === 'string' || Array.isArray(type)) {
      fn = wrap(type, fn);
      offset++;
    } else {
      options = fn;
      fn = type;
    }

    if (typeof fn !== 'function') {
      throw new TypeError('expected a function');
    }

    var self = this || app;
    var fns = self[prop];

    var args = [].slice.call(arguments, offset);
    args.unshift(self);

    if (typeof opts.hook === 'function') {
      opts.hook.apply(self, args);
    }

    var val = fn.apply(self, args);
    if (typeof val === 'function' && fns.indexOf(val) === -1) {
      fns.push(val);
    }
    return self;
  }

  /**
   * Wrap a named plugin function so that it's only called on objects of the
   * given `type`
   *
   * @param {String} `type`
   * @param {Function} `fn` Plugin function
   * @return {Function}
   */

  function wrap(type, fn) {
    return function plugin() {
      return this.type === type ? fn.apply(this, arguments) : plugin;
    };
  }

  return app;
};

function isObject$7(val) {
  return val && typeof val === 'object' && !Array.isArray(val);
}

function define$1(obj, key, val) {
  Object.defineProperty(obj, key, {
    configurable: true,
    writable: true,
    value: val
  });
}

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

var ms = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

var debug = createCommonjsModule(function (module, exports) {
/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = ms;

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}
});
var debug_1 = debug.coerce;
var debug_2 = debug.disable;
var debug_3 = debug.enable;
var debug_4 = debug.enabled;
var debug_5 = debug.humanize;
var debug_6 = debug.names;
var debug_7 = debug.skips;
var debug_8 = debug.formatters;

var browser = createCommonjsModule(function (module, exports) {
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit');

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}
});
var browser_1 = browser.log;
var browser_2 = browser.formatArgs;
var browser_3 = browser.save;
var browser_4 = browser.load;
var browser_5 = browser.useColors;
var browser_6 = browser.storage;
var browser_7 = browser.colors;

var node = createCommonjsModule(function (module, exports) {
/**
 * Module dependencies.
 */




/**
 * This is the Node.js implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // camel-case
  var prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

  // coerce string value into JS value
  var val = process.env[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
  else if (val === 'null') val = null;
  else val = Number(val);

  obj[prop] = val;
  return obj;
}, {});

/**
 * The file descriptor to write the `debug()` calls to.
 * Set the `DEBUG_FD` env variable to override with another value. i.e.:
 *
 *   $ DEBUG_FD=3 node script.js 3>debug.log
 */

var fd = parseInt(process.env.DEBUG_FD, 10) || 2;

if (1 !== fd && 2 !== fd) {
  util$3.deprecate(function(){}, 'except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)')();
}

var stream = 1 === fd ? process.stdout :
             2 === fd ? process.stderr :
             createWritableStdioStream(fd);

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : tty$1.isatty(fd);
}

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

exports.formatters.o = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util$3.inspect(v, this.inspectOpts)
    .split('\n').map(function(str) {
      return str.trim()
    }).join(' ');
};

/**
 * Map %o to `util.inspect()`, allowing multiple lines if needed.
 */

exports.formatters.O = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util$3.inspect(v, this.inspectOpts);
};

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var name = this.namespace;
  var useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var prefix = '  \u001b[3' + c + ';1m' + name + ' ' + '\u001b[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push('\u001b[3' + c + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
  } else {
    args[0] = new Date().toUTCString()
      + ' ' + name + ' ' + args[0];
  }
}

/**
 * Invokes `util.format()` with the specified arguments and writes to `stream`.
 */

function log() {
  return stream.write(util$3.format.apply(util$3, arguments) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  if (null == namespaces) {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  return process.env.DEBUG;
}

/**
 * Copied from `node/src/node.js`.
 *
 * XXX: It's lame that node doesn't expose this API out-of-the-box. It also
 * relies on the undocumented `tty_wrap.guessHandleType()` which is also lame.
 */

function createWritableStdioStream (fd) {
  var stream;
  var tty_wrap = process.binding('tty_wrap');

  // Note stream._type is used for test-module-load-list.js

  switch (tty_wrap.guessHandleType(fd)) {
    case 'TTY':
      stream = new tty$1.WriteStream(fd);
      stream._type = 'tty';

      // Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream._handle && stream._handle.unref) {
        stream._handle.unref();
      }
      break;

    case 'FILE':
      var fs = fs$1;
      stream = new fs.SyncWriteStream(fd, { autoClose: false });
      stream._type = 'fs';
      break;

    case 'PIPE':
    case 'TCP':
      var net = net$1;
      stream = new net.Socket({
        fd: fd,
        readable: false,
        writable: true
      });

      // FIXME Should probably have an option in net.Socket to create a
      // stream from an existing fd which is writable only. But for now
      // we'll just add this hack and set the `readable` member to false.
      // Test: ./node test/fixtures/echo.js < /etc/passwd
      stream.readable = false;
      stream.read = null;
      stream._type = 'pipe';

      // FIXME Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream._handle && stream._handle.unref) {
        stream._handle.unref();
      }
      break;

    default:
      // Probably an error on in uv_guess_handle()
      throw new Error('Implement me. Unknown stream file type!');
  }

  // For supporting legacy API we put the FD here.
  stream.fd = fd;

  stream._isStdio = true;

  return stream;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init (debug) {
  debug.inspectOpts = {};

  var keys = Object.keys(exports.inspectOpts);
  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

/**
 * Enable namespaces listed in `process.env.DEBUG` initially.
 */

exports.enable(load());
});
var node_1 = node.init;
var node_2 = node.log;
var node_3 = node.formatArgs;
var node_4 = node.save;
var node_5 = node.load;
var node_6 = node.useColors;
var node_7 = node.colors;
var node_8 = node.inspectOpts;

var src = createCommonjsModule(function (module) {
/**
 * Detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

if (typeof process !== 'undefined' && process.type === 'renderer') {
  module.exports = browser;
} else {
  module.exports = node;
}
});

var extendShallow$4 = function extend(o/*, objects*/) {
  if (!isExtendable$1(o)) { o = {}; }

  var len = arguments.length;
  for (var i = 1; i < len; i++) {
    var obj = arguments[i];

    if (isExtendable$1(obj)) {
      assign$4(o, obj);
    }
  }
  return o;
};

function assign$4(a, b) {
  for (var key in b) {
    if (hasOwn$4(b, key)) {
      a[key] = b[key];
    }
  }
}

/**
 * Returns true if the given `key` is an own property of `obj`.
 */

function hasOwn$4(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
 */
var encode = function (number) {
  if (0 <= number && number < intToCharMap.length) {
    return intToCharMap[number];
  }
  throw new TypeError("Must be between 0 and 63: " + number);
};

/**
 * Decode a single base 64 character code digit to an integer. Returns -1 on
 * failure.
 */
var decode = function (charCode) {
  var bigA = 65;     // 'A'
  var bigZ = 90;     // 'Z'

  var littleA = 97;  // 'a'
  var littleZ = 122; // 'z'

  var zero = 48;     // '0'
  var nine = 57;     // '9'

  var plus = 43;     // '+'
  var slash = 47;    // '/'

  var littleOffset = 26;
  var numberOffset = 52;

  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
  if (bigA <= charCode && charCode <= bigZ) {
    return (charCode - bigA);
  }

  // 26 - 51: abcdefghijklmnopqrstuvwxyz
  if (littleA <= charCode && charCode <= littleZ) {
    return (charCode - littleA + littleOffset);
  }

  // 52 - 61: 0123456789
  if (zero <= charCode && charCode <= nine) {
    return (charCode - zero + numberOffset);
  }

  // 62: +
  if (charCode == plus) {
    return 62;
  }

  // 63: /
  if (charCode == slash) {
    return 63;
  }

  // Invalid base64 digit.
  return -1;
};

var base64 = {
	encode: encode,
	decode: decode
};

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */



// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// length quantities we use in the source map spec, the first bit is the sign,
// the next four bits are the actual value, and the 6th bit is the
// continuation bit. The continuation bit tells us whether there are more
// digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

var VLQ_BASE_SHIFT = 5;

// binary: 100000
var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

// binary: 011111
var VLQ_BASE_MASK = VLQ_BASE - 1;

// binary: 100000
var VLQ_CONTINUATION_BIT = VLQ_BASE;

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
function toVLQSigned(aValue) {
  return aValue < 0
    ? ((-aValue) << 1) + 1
    : (aValue << 1) + 0;
}

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
function fromVLQSigned(aValue) {
  var isNegative = (aValue & 1) === 1;
  var shifted = aValue >> 1;
  return isNegative
    ? -shifted
    : shifted;
}

/**
 * Returns the base 64 VLQ encoded value.
 */
var encode$1 = function base64VLQ_encode(aValue) {
  var encoded = "";
  var digit;

  var vlq = toVLQSigned(aValue);

  do {
    digit = vlq & VLQ_BASE_MASK;
    vlq >>>= VLQ_BASE_SHIFT;
    if (vlq > 0) {
      // There are still more digits in this value, so we must make sure the
      // continuation bit is marked.
      digit |= VLQ_CONTINUATION_BIT;
    }
    encoded += base64.encode(digit);
  } while (vlq > 0);

  return encoded;
};

/**
 * Decodes the next base 64 VLQ value from the given string and returns the
 * value and the rest of the string via the out parameter.
 */
var decode$1 = function base64VLQ_decode(aStr, aIndex, aOutParam) {
  var strLen = aStr.length;
  var result = 0;
  var shift = 0;
  var continuation, digit;

  do {
    if (aIndex >= strLen) {
      throw new Error("Expected more digits in base 64 VLQ value.");
    }

    digit = base64.decode(aStr.charCodeAt(aIndex++));
    if (digit === -1) {
      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
    }

    continuation = !!(digit & VLQ_CONTINUATION_BIT);
    digit &= VLQ_BASE_MASK;
    result = result + (digit << shift);
    shift += VLQ_BASE_SHIFT;
  } while (continuation);

  aOutParam.value = fromVLQSigned(result);
  aOutParam.rest = aIndex;
};

var base64Vlq = {
	encode: encode$1,
	decode: decode$1
};

var util$1 = createCommonjsModule(function (module, exports) {
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * This is a helper function for getting values from parameter/options
 * objects.
 *
 * @param args The object we are extracting values from
 * @param name The name of the property we are getting.
 * @param defaultValue An optional value to return if the property is missing
 * from the object. If this is not specified and the property is missing, an
 * error will be thrown.
 */
function getArg(aArgs, aName, aDefaultValue) {
  if (aName in aArgs) {
    return aArgs[aName];
  } else if (arguments.length === 3) {
    return aDefaultValue;
  } else {
    throw new Error('"' + aName + '" is a required argument.');
  }
}
exports.getArg = getArg;

var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
var dataUrlRegexp = /^data:.+\,.+$/;

function urlParse(aUrl) {
  var match = aUrl.match(urlRegexp);
  if (!match) {
    return null;
  }
  return {
    scheme: match[1],
    auth: match[2],
    host: match[3],
    port: match[4],
    path: match[5]
  };
}
exports.urlParse = urlParse;

function urlGenerate(aParsedUrl) {
  var url = '';
  if (aParsedUrl.scheme) {
    url += aParsedUrl.scheme + ':';
  }
  url += '//';
  if (aParsedUrl.auth) {
    url += aParsedUrl.auth + '@';
  }
  if (aParsedUrl.host) {
    url += aParsedUrl.host;
  }
  if (aParsedUrl.port) {
    url += ":" + aParsedUrl.port;
  }
  if (aParsedUrl.path) {
    url += aParsedUrl.path;
  }
  return url;
}
exports.urlGenerate = urlGenerate;

/**
 * Normalizes a path, or the path portion of a URL:
 *
 * - Replaces consecutive slashes with one slash.
 * - Removes unnecessary '.' parts.
 * - Removes unnecessary '<dir>/..' parts.
 *
 * Based on code in the Node.js 'path' core module.
 *
 * @param aPath The path or url to normalize.
 */
function normalize(aPath) {
  var path = aPath;
  var url = urlParse(aPath);
  if (url) {
    if (!url.path) {
      return aPath;
    }
    path = url.path;
  }
  var isAbsolute = exports.isAbsolute(path);

  var parts = path.split(/\/+/);
  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
    part = parts[i];
    if (part === '.') {
      parts.splice(i, 1);
    } else if (part === '..') {
      up++;
    } else if (up > 0) {
      if (part === '') {
        // The first part is blank if the path is absolute. Trying to go
        // above the root is a no-op. Therefore we can remove all '..' parts
        // directly after the root.
        parts.splice(i + 1, up);
        up = 0;
      } else {
        parts.splice(i, 2);
        up--;
      }
    }
  }
  path = parts.join('/');

  if (path === '') {
    path = isAbsolute ? '/' : '.';
  }

  if (url) {
    url.path = path;
    return urlGenerate(url);
  }
  return path;
}
exports.normalize = normalize;

/**
 * Joins two paths/URLs.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be joined with the root.
 *
 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
 *   first.
 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
 *   is updated with the result and aRoot is returned. Otherwise the result
 *   is returned.
 *   - If aPath is absolute, the result is aPath.
 *   - Otherwise the two paths are joined with a slash.
 * - Joining for example 'http://' and 'www.example.com' is also supported.
 */
function join(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }
  if (aPath === "") {
    aPath = ".";
  }
  var aPathUrl = urlParse(aPath);
  var aRootUrl = urlParse(aRoot);
  if (aRootUrl) {
    aRoot = aRootUrl.path || '/';
  }

  // `join(foo, '//www.example.org')`
  if (aPathUrl && !aPathUrl.scheme) {
    if (aRootUrl) {
      aPathUrl.scheme = aRootUrl.scheme;
    }
    return urlGenerate(aPathUrl);
  }

  if (aPathUrl || aPath.match(dataUrlRegexp)) {
    return aPath;
  }

  // `join('http://', 'www.example.com')`
  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
    aRootUrl.host = aPath;
    return urlGenerate(aRootUrl);
  }

  var joined = aPath.charAt(0) === '/'
    ? aPath
    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

  if (aRootUrl) {
    aRootUrl.path = joined;
    return urlGenerate(aRootUrl);
  }
  return joined;
}
exports.join = join;

exports.isAbsolute = function (aPath) {
  return aPath.charAt(0) === '/' || urlRegexp.test(aPath);
};

/**
 * Make a path relative to a URL or another path.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be made relative to aRoot.
 */
function relative(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }

  aRoot = aRoot.replace(/\/$/, '');

  // It is possible for the path to be above the root. In this case, simply
  // checking whether the root is a prefix of the path won't work. Instead, we
  // need to remove components from the root one by one, until either we find
  // a prefix that fits, or we run out of components to remove.
  var level = 0;
  while (aPath.indexOf(aRoot + '/') !== 0) {
    var index = aRoot.lastIndexOf("/");
    if (index < 0) {
      return aPath;
    }

    // If the only part of the root that is left is the scheme (i.e. http://,
    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
    // have exhausted all components, so the path is not relative to the root.
    aRoot = aRoot.slice(0, index);
    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
      return aPath;
    }

    ++level;
  }

  // Make sure we add a "../" for each component we removed from the root.
  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
}
exports.relative = relative;

var supportsNullProto = (function () {
  var obj = Object.create(null);
  return !('__proto__' in obj);
}());

function identity (s) {
  return s;
}

/**
 * Because behavior goes wacky when you set `__proto__` on objects, we
 * have to prefix all the strings in our set with an arbitrary character.
 *
 * See https://github.com/mozilla/source-map/pull/31 and
 * https://github.com/mozilla/source-map/issues/30
 *
 * @param String aStr
 */
function toSetString(aStr) {
  if (isProtoString(aStr)) {
    return '$' + aStr;
  }

  return aStr;
}
exports.toSetString = supportsNullProto ? identity : toSetString;

function fromSetString(aStr) {
  if (isProtoString(aStr)) {
    return aStr.slice(1);
  }

  return aStr;
}
exports.fromSetString = supportsNullProto ? identity : fromSetString;

function isProtoString(s) {
  if (!s) {
    return false;
  }

  var length = s.length;

  if (length < 9 /* "__proto__".length */) {
    return false;
  }

  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
      s.charCodeAt(length - 9) !== 95  /* '_' */) {
    return false;
  }

  for (var i = length - 10; i >= 0; i--) {
    if (s.charCodeAt(i) !== 36 /* '$' */) {
      return false;
    }
  }

  return true;
}

/**
 * Comparator between two mappings where the original positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same original source/line/column, but different generated
 * line and column the same. Useful when searching for a mapping with a
 * stubbed out mapping.
 */
function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
  var cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0 || onlyCompareOriginal) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByOriginalPositions = compareByOriginalPositions;

/**
 * Comparator between two mappings with deflated source and name indices where
 * the generated positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same generated line and column, but different
 * source/name/original line and column the same. Useful when searching for a
 * mapping with a stubbed out mapping.
 */
function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0 || onlyCompareGenerated) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

function strcmp(aStr1, aStr2) {
  if (aStr1 === aStr2) {
    return 0;
  }

  if (aStr1 === null) {
    return 1; // aStr2 !== null
  }

  if (aStr2 === null) {
    return -1; // aStr1 !== null
  }

  if (aStr1 > aStr2) {
    return 1;
  }

  return -1;
}

/**
 * Comparator between two mappings with inflated source and name strings where
 * the generated positions are compared.
 */
function compareByGeneratedPositionsInflated(mappingA, mappingB) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

/**
 * Strip any JSON XSSI avoidance prefix from the string (as documented
 * in the source maps specification), and then parse the string as
 * JSON.
 */
function parseSourceMapInput(str) {
  return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
}
exports.parseSourceMapInput = parseSourceMapInput;

/**
 * Compute the URL of a source given the the source root, the source's
 * URL, and the source map's URL.
 */
function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
  sourceURL = sourceURL || '';

  if (sourceRoot) {
    // This follows what Chrome does.
    if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
      sourceRoot += '/';
    }
    // The spec says:
    //   Line 4: An optional source root, useful for relocating source
    //   files on a server or removing repeated values in the
    //   “sources” entry.  This value is prepended to the individual
    //   entries in the “source” field.
    sourceURL = sourceRoot + sourceURL;
  }

  // Historically, SourceMapConsumer did not take the sourceMapURL as
  // a parameter.  This mode is still somewhat supported, which is why
  // this code block is conditional.  However, it's preferable to pass
  // the source map URL to SourceMapConsumer, so that this function
  // can implement the source URL resolution algorithm as outlined in
  // the spec.  This block is basically the equivalent of:
  //    new URL(sourceURL, sourceMapURL).toString()
  // ... except it avoids using URL, which wasn't available in the
  // older releases of node still supported by this library.
  //
  // The spec says:
  //   If the sources are not absolute URLs after prepending of the
  //   “sourceRoot”, the sources are resolved relative to the
  //   SourceMap (like resolving script src in a html document).
  if (sourceMapURL) {
    var parsed = urlParse(sourceMapURL);
    if (!parsed) {
      throw new Error("sourceMapURL could not be parsed");
    }
    if (parsed.path) {
      // Strip the last path component, but keep the "/".
      var index = parsed.path.lastIndexOf('/');
      if (index >= 0) {
        parsed.path = parsed.path.substring(0, index + 1);
      }
    }
    sourceURL = join(urlGenerate(parsed), sourceURL);
  }

  return normalize(sourceURL);
}
exports.computeSourceURL = computeSourceURL;
});
var util_1$1 = util$1.getArg;
var util_2$1 = util$1.urlParse;
var util_3$1 = util$1.urlGenerate;
var util_4 = util$1.normalize;
var util_5 = util$1.join;
var util_6 = util$1.isAbsolute;
var util_7 = util$1.relative;
var util_8 = util$1.toSetString;
var util_9 = util$1.fromSetString;
var util_10 = util$1.compareByOriginalPositions;
var util_11 = util$1.compareByGeneratedPositionsDeflated;
var util_12 = util$1.compareByGeneratedPositionsInflated;
var util_13 = util$1.parseSourceMapInput;
var util_14 = util$1.computeSourceURL;

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */


var has$5 = Object.prototype.hasOwnProperty;
var hasNativeMap = typeof Map !== "undefined";

/**
 * A data structure which is a combination of an array and a set. Adding a new
 * member is O(1), testing for membership is O(1), and finding the index of an
 * element is O(1). Removing elements from the set is not supported. Only
 * strings are supported for membership.
 */
function ArraySet() {
  this._array = [];
  this._set = hasNativeMap ? new Map() : Object.create(null);
}

/**
 * Static method for creating ArraySet instances from an existing array.
 */
ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
  var set = new ArraySet();
  for (var i = 0, len = aArray.length; i < len; i++) {
    set.add(aArray[i], aAllowDuplicates);
  }
  return set;
};

/**
 * Return how many unique items are in this ArraySet. If duplicates have been
 * added, than those do not count towards the size.
 *
 * @returns Number
 */
ArraySet.prototype.size = function ArraySet_size() {
  return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
};

/**
 * Add the given string to this set.
 *
 * @param String aStr
 */
ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
  var sStr = hasNativeMap ? aStr : util$1.toSetString(aStr);
  var isDuplicate = hasNativeMap ? this.has(aStr) : has$5.call(this._set, sStr);
  var idx = this._array.length;
  if (!isDuplicate || aAllowDuplicates) {
    this._array.push(aStr);
  }
  if (!isDuplicate) {
    if (hasNativeMap) {
      this._set.set(aStr, idx);
    } else {
      this._set[sStr] = idx;
    }
  }
};

/**
 * Is the given string a member of this set?
 *
 * @param String aStr
 */
ArraySet.prototype.has = function ArraySet_has(aStr) {
  if (hasNativeMap) {
    return this._set.has(aStr);
  } else {
    var sStr = util$1.toSetString(aStr);
    return has$5.call(this._set, sStr);
  }
};

/**
 * What is the index of the given string in the array?
 *
 * @param String aStr
 */
ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
  if (hasNativeMap) {
    var idx = this._set.get(aStr);
    if (idx >= 0) {
        return idx;
    }
  } else {
    var sStr = util$1.toSetString(aStr);
    if (has$5.call(this._set, sStr)) {
      return this._set[sStr];
    }
  }

  throw new Error('"' + aStr + '" is not in the set.');
};

/**
 * What is the element at the given index?
 *
 * @param Number aIdx
 */
ArraySet.prototype.at = function ArraySet_at(aIdx) {
  if (aIdx >= 0 && aIdx < this._array.length) {
    return this._array[aIdx];
  }
  throw new Error('No element indexed by ' + aIdx);
};

/**
 * Returns the array representation of this set (which has the proper indices
 * indicated by indexOf). Note that this is a copy of the internal array used
 * for storing the members so that no one can mess with internal state.
 */
ArraySet.prototype.toArray = function ArraySet_toArray() {
  return this._array.slice();
};

var ArraySet_1 = ArraySet;

var arraySet = {
	ArraySet: ArraySet_1
};

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2014 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */



/**
 * Determine whether mappingB is after mappingA with respect to generated
 * position.
 */
function generatedPositionAfter(mappingA, mappingB) {
  // Optimized for most common case
  var lineA = mappingA.generatedLine;
  var lineB = mappingB.generatedLine;
  var columnA = mappingA.generatedColumn;
  var columnB = mappingB.generatedColumn;
  return lineB > lineA || lineB == lineA && columnB >= columnA ||
         util$1.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
}

/**
 * A data structure to provide a sorted view of accumulated mappings in a
 * performance conscious manner. It trades a neglibable overhead in general
 * case for a large speedup in case of mappings being added in order.
 */
function MappingList() {
  this._array = [];
  this._sorted = true;
  // Serves as infimum
  this._last = {generatedLine: -1, generatedColumn: 0};
}

/**
 * Iterate through internal items. This method takes the same arguments that
 * `Array.prototype.forEach` takes.
 *
 * NOTE: The order of the mappings is NOT guaranteed.
 */
MappingList.prototype.unsortedForEach =
  function MappingList_forEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg);
  };

/**
 * Add the given source mapping.
 *
 * @param Object aMapping
 */
MappingList.prototype.add = function MappingList_add(aMapping) {
  if (generatedPositionAfter(this._last, aMapping)) {
    this._last = aMapping;
    this._array.push(aMapping);
  } else {
    this._sorted = false;
    this._array.push(aMapping);
  }
};

/**
 * Returns the flat, sorted array of mappings. The mappings are sorted by
 * generated position.
 *
 * WARNING: This method returns internal data without copying, for
 * performance. The return value must NOT be mutated, and should be treated as
 * an immutable borrow. If you want to take ownership, you must make your own
 * copy.
 */
MappingList.prototype.toArray = function MappingList_toArray() {
  if (!this._sorted) {
    this._array.sort(util$1.compareByGeneratedPositionsInflated);
    this._sorted = true;
  }
  return this._array;
};

var MappingList_1 = MappingList;

var mappingList = {
	MappingList: MappingList_1
};

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */



var ArraySet$1 = arraySet.ArraySet;
var MappingList$1 = mappingList.MappingList;

/**
 * An instance of the SourceMapGenerator represents a source map which is
 * being built incrementally. You may pass an object with the following
 * properties:
 *
 *   - file: The filename of the generated source.
 *   - sourceRoot: A root for all relative URLs in this source map.
 */
function SourceMapGenerator(aArgs) {
  if (!aArgs) {
    aArgs = {};
  }
  this._file = util$1.getArg(aArgs, 'file', null);
  this._sourceRoot = util$1.getArg(aArgs, 'sourceRoot', null);
  this._skipValidation = util$1.getArg(aArgs, 'skipValidation', false);
  this._sources = new ArraySet$1();
  this._names = new ArraySet$1();
  this._mappings = new MappingList$1();
  this._sourcesContents = null;
}

SourceMapGenerator.prototype._version = 3;

/**
 * Creates a new SourceMapGenerator based on a SourceMapConsumer
 *
 * @param aSourceMapConsumer The SourceMap.
 */
SourceMapGenerator.fromSourceMap =
  function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
    var sourceRoot = aSourceMapConsumer.sourceRoot;
    var generator = new SourceMapGenerator({
      file: aSourceMapConsumer.file,
      sourceRoot: sourceRoot
    });
    aSourceMapConsumer.eachMapping(function (mapping) {
      var newMapping = {
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      };

      if (mapping.source != null) {
        newMapping.source = mapping.source;
        if (sourceRoot != null) {
          newMapping.source = util$1.relative(sourceRoot, newMapping.source);
        }

        newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        };

        if (mapping.name != null) {
          newMapping.name = mapping.name;
        }
      }

      generator.addMapping(newMapping);
    });
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var sourceRelative = sourceFile;
      if (sourceRoot !== null) {
        sourceRelative = util$1.relative(sourceRoot, sourceFile);
      }

      if (!generator._sources.has(sourceRelative)) {
        generator._sources.add(sourceRelative);
      }

      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        generator.setSourceContent(sourceFile, content);
      }
    });
    return generator;
  };

/**
 * Add a single mapping from original source line and column to the generated
 * source's line and column for this source map being created. The mapping
 * object should have the following properties:
 *
 *   - generated: An object with the generated line and column positions.
 *   - original: An object with the original line and column positions.
 *   - source: The original source file (relative to the sourceRoot).
 *   - name: An optional original token name for this mapping.
 */
SourceMapGenerator.prototype.addMapping =
  function SourceMapGenerator_addMapping(aArgs) {
    var generated = util$1.getArg(aArgs, 'generated');
    var original = util$1.getArg(aArgs, 'original', null);
    var source = util$1.getArg(aArgs, 'source', null);
    var name = util$1.getArg(aArgs, 'name', null);

    if (!this._skipValidation) {
      this._validateMapping(generated, original, source, name);
    }

    if (source != null) {
      source = String(source);
      if (!this._sources.has(source)) {
        this._sources.add(source);
      }
    }

    if (name != null) {
      name = String(name);
      if (!this._names.has(name)) {
        this._names.add(name);
      }
    }

    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source: source,
      name: name
    });
  };

/**
 * Set the source content for a source file.
 */
SourceMapGenerator.prototype.setSourceContent =
  function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
    var source = aSourceFile;
    if (this._sourceRoot != null) {
      source = util$1.relative(this._sourceRoot, source);
    }

    if (aSourceContent != null) {
      // Add the source content to the _sourcesContents map.
      // Create a new _sourcesContents map if the property is null.
      if (!this._sourcesContents) {
        this._sourcesContents = Object.create(null);
      }
      this._sourcesContents[util$1.toSetString(source)] = aSourceContent;
    } else if (this._sourcesContents) {
      // Remove the source file from the _sourcesContents map.
      // If the _sourcesContents map is empty, set the property to null.
      delete this._sourcesContents[util$1.toSetString(source)];
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null;
      }
    }
  };

/**
 * Applies the mappings of a sub-source-map for a specific source file to the
 * source map being generated. Each mapping to the supplied source file is
 * rewritten using the supplied source map. Note: The resolution for the
 * resulting mappings is the minimium of this map and the supplied map.
 *
 * @param aSourceMapConsumer The source map to be applied.
 * @param aSourceFile Optional. The filename of the source file.
 *        If omitted, SourceMapConsumer's file property will be used.
 * @param aSourceMapPath Optional. The dirname of the path to the source map
 *        to be applied. If relative, it is relative to the SourceMapConsumer.
 *        This parameter is needed when the two source maps aren't in the same
 *        directory, and the source map to be applied contains relative source
 *        paths. If so, those relative source paths need to be rewritten
 *        relative to the SourceMapGenerator.
 */
SourceMapGenerator.prototype.applySourceMap =
  function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
    var sourceFile = aSourceFile;
    // If aSourceFile is omitted, we will use the file property of the SourceMap
    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error(
          'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
          'or the source map\'s "file" property. Both were omitted.'
        );
      }
      sourceFile = aSourceMapConsumer.file;
    }
    var sourceRoot = this._sourceRoot;
    // Make "sourceFile" relative if an absolute Url is passed.
    if (sourceRoot != null) {
      sourceFile = util$1.relative(sourceRoot, sourceFile);
    }
    // Applying the SourceMap can add and remove items from the sources and
    // the names array.
    var newSources = new ArraySet$1();
    var newNames = new ArraySet$1();

    // Find mappings for the "sourceFile"
    this._mappings.unsortedForEach(function (mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        // Check if it can be mapped by the source map, then update the mapping.
        var original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        });
        if (original.source != null) {
          // Copy mapping
          mapping.source = original.source;
          if (aSourceMapPath != null) {
            mapping.source = util$1.join(aSourceMapPath, mapping.source);
          }
          if (sourceRoot != null) {
            mapping.source = util$1.relative(sourceRoot, mapping.source);
          }
          mapping.originalLine = original.line;
          mapping.originalColumn = original.column;
          if (original.name != null) {
            mapping.name = original.name;
          }
        }
      }

      var source = mapping.source;
      if (source != null && !newSources.has(source)) {
        newSources.add(source);
      }

      var name = mapping.name;
      if (name != null && !newNames.has(name)) {
        newNames.add(name);
      }

    }, this);
    this._sources = newSources;
    this._names = newNames;

    // Copy sourcesContents of applied map.
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aSourceMapPath != null) {
          sourceFile = util$1.join(aSourceMapPath, sourceFile);
        }
        if (sourceRoot != null) {
          sourceFile = util$1.relative(sourceRoot, sourceFile);
        }
        this.setSourceContent(sourceFile, content);
      }
    }, this);
  };

/**
 * A mapping can have one of the three levels of data:
 *
 *   1. Just the generated position.
 *   2. The Generated position, original position, and original source.
 *   3. Generated and original position, original source, as well as a name
 *      token.
 *
 * To maintain consistency, we validate that any new mapping being added falls
 * in to one of these categories.
 */
SourceMapGenerator.prototype._validateMapping =
  function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                                              aName) {
    // When aOriginal is truthy but has empty values for .line and .column,
    // it is most likely a programmer error. In this case we throw a very
    // specific error message to try to guide them the right way.
    // For example: https://github.com/Polymer/polymer-bundler/pull/519
    if (aOriginal && typeof aOriginal.line !== 'number' && typeof aOriginal.column !== 'number') {
        throw new Error(
            'original.line and original.column are not numbers -- you probably meant to omit ' +
            'the original mapping entirely and only map the generated position. If so, pass ' +
            'null for the original mapping instead of an object with empty or null values.'
        );
    }

    if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
        && aGenerated.line > 0 && aGenerated.column >= 0
        && !aOriginal && !aSource && !aName) {
      // Case 1.
      return;
    }
    else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
             && aOriginal && 'line' in aOriginal && 'column' in aOriginal
             && aGenerated.line > 0 && aGenerated.column >= 0
             && aOriginal.line > 0 && aOriginal.column >= 0
             && aSource) {
      // Cases 2 and 3.
      return;
    }
    else {
      throw new Error('Invalid mapping: ' + JSON.stringify({
        generated: aGenerated,
        source: aSource,
        original: aOriginal,
        name: aName
      }));
    }
  };

/**
 * Serialize the accumulated mappings in to the stream of base 64 VLQs
 * specified by the source map format.
 */
SourceMapGenerator.prototype._serializeMappings =
  function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 1;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousName = 0;
    var previousSource = 0;
    var result = '';
    var next;
    var mapping;
    var nameIdx;
    var sourceIdx;

    var mappings = this._mappings.toArray();
    for (var i = 0, len = mappings.length; i < len; i++) {
      mapping = mappings[i];
      next = '';

      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0;
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ';';
          previousGeneratedLine++;
        }
      }
      else {
        if (i > 0) {
          if (!util$1.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
            continue;
          }
          next += ',';
        }
      }

      next += base64Vlq.encode(mapping.generatedColumn
                                 - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generatedColumn;

      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source);
        next += base64Vlq.encode(sourceIdx - previousSource);
        previousSource = sourceIdx;

        // lines are stored 0-based in SourceMap spec version 3
        next += base64Vlq.encode(mapping.originalLine - 1
                                   - previousOriginalLine);
        previousOriginalLine = mapping.originalLine - 1;

        next += base64Vlq.encode(mapping.originalColumn
                                   - previousOriginalColumn);
        previousOriginalColumn = mapping.originalColumn;

        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name);
          next += base64Vlq.encode(nameIdx - previousName);
          previousName = nameIdx;
        }
      }

      result += next;
    }

    return result;
  };

SourceMapGenerator.prototype._generateSourcesContent =
  function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function (source) {
      if (!this._sourcesContents) {
        return null;
      }
      if (aSourceRoot != null) {
        source = util$1.relative(aSourceRoot, source);
      }
      var key = util$1.toSetString(source);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
        ? this._sourcesContents[key]
        : null;
    }, this);
  };

/**
 * Externalize the source map.
 */
SourceMapGenerator.prototype.toJSON =
  function SourceMapGenerator_toJSON() {
    var map = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    if (this._file != null) {
      map.file = this._file;
    }
    if (this._sourceRoot != null) {
      map.sourceRoot = this._sourceRoot;
    }
    if (this._sourcesContents) {
      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
    }

    return map;
  };

/**
 * Render the source map being generated to a string.
 */
SourceMapGenerator.prototype.toString =
  function SourceMapGenerator_toString() {
    return JSON.stringify(this.toJSON());
  };

var SourceMapGenerator_1 = SourceMapGenerator;

var sourceMapGenerator = {
	SourceMapGenerator: SourceMapGenerator_1
};

var binarySearch = createCommonjsModule(function (module, exports) {
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

exports.GREATEST_LOWER_BOUND = 1;
exports.LEAST_UPPER_BOUND = 2;

/**
 * Recursive implementation of binary search.
 *
 * @param aLow Indices here and lower do not contain the needle.
 * @param aHigh Indices here and higher do not contain the needle.
 * @param aNeedle The element being searched for.
 * @param aHaystack The non-empty array being searched.
 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 */
function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
  // This function terminates when one of the following is true:
  //
  //   1. We find the exact element we are looking for.
  //
  //   2. We did not find the exact element, but we can return the index of
  //      the next-closest element.
  //
  //   3. We did not find the exact element, and there is no next-closest
  //      element than the one we are searching for, so we return -1.
  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
  var cmp = aCompare(aNeedle, aHaystack[mid], true);
  if (cmp === 0) {
    // Found the element we are looking for.
    return mid;
  }
  else if (cmp > 0) {
    // Our needle is greater than aHaystack[mid].
    if (aHigh - mid > 1) {
      // The element is in the upper half.
      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
    }

    // The exact needle element was not found in this haystack. Determine if
    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return aHigh < aHaystack.length ? aHigh : -1;
    } else {
      return mid;
    }
  }
  else {
    // Our needle is less than aHaystack[mid].
    if (mid - aLow > 1) {
      // The element is in the lower half.
      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
    }

    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return mid;
    } else {
      return aLow < 0 ? -1 : aLow;
    }
  }
}

/**
 * This is an implementation of binary search which will always try and return
 * the index of the closest element if there is no exact hit. This is because
 * mappings between original and generated line/col pairs are single points,
 * and there is an implicit region between each of them, so a miss just means
 * that you aren't on the very start of a region.
 *
 * @param aNeedle The element you are looking for.
 * @param aHaystack The array that is being searched.
 * @param aCompare A function which takes the needle and an element in the
 *     array and returns -1, 0, or 1 depending on whether the needle is less
 *     than, equal to, or greater than the element, respectively.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
 */
exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
  if (aHaystack.length === 0) {
    return -1;
  }

  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
  if (index < 0) {
    return -1;
  }

  // We have found either the exact element, or the next-closest element than
  // the one we are searching for. However, there may be more than one such
  // element. Make sure we always return the smallest of these.
  while (index - 1 >= 0) {
    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
      break;
    }
    --index;
  }

  return index;
};
});
var binarySearch_1 = binarySearch.GREATEST_LOWER_BOUND;
var binarySearch_2 = binarySearch.LEAST_UPPER_BOUND;
var binarySearch_3 = binarySearch.search;

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// It turns out that some (most?) JavaScript engines don't self-host
// `Array.prototype.sort`. This makes sense because C++ will likely remain
// faster than JS when doing raw CPU-intensive sorting. However, when using a
// custom comparator function, calling back and forth between the VM's C++ and
// JIT'd JS is rather slow *and* loses JIT type information, resulting in
// worse generated code for the comparator function than would be optimal. In
// fact, when sorting with a comparator, these costs outweigh the benefits of
// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
// a ~3500ms mean speed-up in `bench/bench.html`.

/**
 * Swap the elements indexed by `x` and `y` in the array `ary`.
 *
 * @param {Array} ary
 *        The array.
 * @param {Number} x
 *        The index of the first item.
 * @param {Number} y
 *        The index of the second item.
 */
function swap(ary, x, y) {
  var temp = ary[x];
  ary[x] = ary[y];
  ary[y] = temp;
}

/**
 * Returns a random integer within the range `low .. high` inclusive.
 *
 * @param {Number} low
 *        The lower bound on the range.
 * @param {Number} high
 *        The upper bound on the range.
 */
function randomIntInRange(low, high) {
  return Math.round(low + (Math.random() * (high - low)));
}

/**
 * The Quick Sort algorithm.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 * @param {Number} p
 *        Start index of the array
 * @param {Number} r
 *        End index of the array
 */
function doQuickSort(ary, comparator, p, r) {
  // If our lower bound is less than our upper bound, we (1) partition the
  // array into two pieces and (2) recurse on each half. If it is not, this is
  // the empty array and our base case.

  if (p < r) {
    // (1) Partitioning.
    //
    // The partitioning chooses a pivot between `p` and `r` and moves all
    // elements that are less than or equal to the pivot to the before it, and
    // all the elements that are greater than it after it. The effect is that
    // once partition is done, the pivot is in the exact place it will be when
    // the array is put in sorted order, and it will not need to be moved
    // again. This runs in O(n) time.

    // Always choose a random pivot so that an input array which is reverse
    // sorted does not cause O(n^2) running time.
    var pivotIndex = randomIntInRange(p, r);
    var i = p - 1;

    swap(ary, pivotIndex, r);
    var pivot = ary[r];

    // Immediately after `j` is incremented in this loop, the following hold
    // true:
    //
    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
    //
    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
    for (var j = p; j < r; j++) {
      if (comparator(ary[j], pivot) <= 0) {
        i += 1;
        swap(ary, i, j);
      }
    }

    swap(ary, i + 1, j);
    var q = i + 1;

    // (2) Recurse on each half.

    doQuickSort(ary, comparator, p, q - 1);
    doQuickSort(ary, comparator, q + 1, r);
  }
}

/**
 * Sort the given array in-place with the given comparator function.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 */
var quickSort_1 = function (ary, comparator) {
  doQuickSort(ary, comparator, 0, ary.length - 1);
};

var quickSort = {
	quickSort: quickSort_1
};

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */



var ArraySet$2 = arraySet.ArraySet;

var quickSort$1 = quickSort.quickSort;

function SourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util$1.parseSourceMapInput(aSourceMap);
  }

  return sourceMap.sections != null
    ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
    : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
}

SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
  return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
};

/**
 * The version of the source mapping spec that we are consuming.
 */
SourceMapConsumer.prototype._version = 3;

// `__generatedMappings` and `__originalMappings` are arrays that hold the
// parsed mapping coordinates from the source map's "mappings" attribute. They
// are lazily instantiated, accessed via the `_generatedMappings` and
// `_originalMappings` getters respectively, and we only parse the mappings
// and create these arrays once queried for a source location. We jump through
// these hoops because there can be many thousands of mappings, and parsing
// them is expensive, so we only want to do it if we must.
//
// Each object in the arrays is of the form:
//
//     {
//       generatedLine: The line number in the generated code,
//       generatedColumn: The column number in the generated code,
//       source: The path to the original source file that generated this
//               chunk of code,
//       originalLine: The line number in the original source that
//                     corresponds to this chunk of generated code,
//       originalColumn: The column number in the original source that
//                       corresponds to this chunk of generated code,
//       name: The name of the original symbol which generated this chunk of
//             code.
//     }
//
// All properties except for `generatedLine` and `generatedColumn` can be
// `null`.
//
// `_generatedMappings` is ordered by the generated positions.
//
// `_originalMappings` is ordered by the original positions.

SourceMapConsumer.prototype.__generatedMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__generatedMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__generatedMappings;
  }
});

SourceMapConsumer.prototype.__originalMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__originalMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__originalMappings;
  }
});

SourceMapConsumer.prototype._charIsMappingSeparator =
  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
SourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };

SourceMapConsumer.GENERATED_ORDER = 1;
SourceMapConsumer.ORIGINAL_ORDER = 2;

SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
SourceMapConsumer.LEAST_UPPER_BOUND = 2;

/**
 * Iterate over each mapping between an original source/line/column and a
 * generated line/column in this source map.
 *
 * @param Function aCallback
 *        The function that is called with each mapping.
 * @param Object aContext
 *        Optional. If specified, this object will be the value of `this` every
 *        time that `aCallback` is called.
 * @param aOrder
 *        Either `SourceMapConsumer.GENERATED_ORDER` or
 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
 *        iterate over the mappings sorted by the generated file's line/column
 *        order or the original's source/line/column order, respectively. Defaults to
 *        `SourceMapConsumer.GENERATED_ORDER`.
 */
SourceMapConsumer.prototype.eachMapping =
  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

    var mappings;
    switch (order) {
    case SourceMapConsumer.GENERATED_ORDER:
      mappings = this._generatedMappings;
      break;
    case SourceMapConsumer.ORIGINAL_ORDER:
      mappings = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
    }

    var sourceRoot = this.sourceRoot;
    mappings.map(function (mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      source = util$1.computeSourceURL(sourceRoot, source, this._sourceMapURL);
      return {
        source: source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };

/**
 * Returns all generated line and column information for the original source,
 * line, and column provided. If no column is provided, returns all mappings
 * corresponding to a either the line we are searching for or the next
 * closest line that has any mappings. Otherwise, returns all mappings
 * corresponding to the given line and either the column we are searching for
 * or the next closest column that has any offsets.
 *
 * The only argument is an object with the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number is 1-based.
 *   - column: Optional. the column number in the original source.
 *    The column number is 0-based.
 *
 * and an array of objects is returned, each with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *    line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *    The column number is 0-based.
 */
SourceMapConsumer.prototype.allGeneratedPositionsFor =
  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util$1.getArg(aArgs, 'line');

    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
    // returns the index of the closest mapping less than the needle. By
    // setting needle.originalColumn to 0, we thus find the last mapping for
    // the given line, provided such a mapping exists.
    var needle = {
      source: util$1.getArg(aArgs, 'source'),
      originalLine: line,
      originalColumn: util$1.getArg(aArgs, 'column', 0)
    };

    needle.source = this._findSourceIndex(needle.source);
    if (needle.source < 0) {
      return [];
    }

    var mappings = [];

    var index = this._findMapping(needle,
                                  this._originalMappings,
                                  "originalLine",
                                  "originalColumn",
                                  util$1.compareByOriginalPositions,
                                  binarySearch.LEAST_UPPER_BOUND);
    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (aArgs.column === undefined) {
        var originalLine = mapping.originalLine;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we found. Since
        // mappings are sorted, this is guaranteed to find all mappings for
        // the line we found.
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util$1.getArg(mapping, 'generatedLine', null),
            column: util$1.getArg(mapping, 'generatedColumn', null),
            lastColumn: util$1.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we were searching for.
        // Since mappings are sorted, this is guaranteed to find all mappings for
        // the line we are searching for.
        while (mapping &&
               mapping.originalLine === line &&
               mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util$1.getArg(mapping, 'generatedLine', null),
            column: util$1.getArg(mapping, 'generatedColumn', null),
            lastColumn: util$1.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      }
    }

    return mappings;
  };

var SourceMapConsumer_1 = SourceMapConsumer;

/**
 * A BasicSourceMapConsumer instance represents a parsed source map which we can
 * query for information about the original file positions by giving it a file
 * position in the generated source.
 *
 * The first parameter is the raw source map (either as a JSON string, or
 * already parsed to an object). According to the spec, source maps have the
 * following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - sources: An array of URLs to the original source files.
 *   - names: An array of identifiers which can be referrenced by individual mappings.
 *   - sourceRoot: Optional. The URL root from which all sources are relative.
 *   - sourcesContent: Optional. An array of contents of the original source files.
 *   - mappings: A string of base64 VLQs which contain the actual mappings.
 *   - file: Optional. The generated file this source map is associated with.
 *
 * Here is an example source map, taken from the source map spec[0]:
 *
 *     {
 *       version : 3,
 *       file: "out.js",
 *       sourceRoot : "",
 *       sources: ["foo.js", "bar.js"],
 *       names: ["src", "maps", "are", "fun"],
 *       mappings: "AA,AB;;ABCDE;"
 *     }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
 */
function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util$1.parseSourceMapInput(aSourceMap);
  }

  var version = util$1.getArg(sourceMap, 'version');
  var sources = util$1.getArg(sourceMap, 'sources');
  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
  // requires the array) to play nice here.
  var names = util$1.getArg(sourceMap, 'names', []);
  var sourceRoot = util$1.getArg(sourceMap, 'sourceRoot', null);
  var sourcesContent = util$1.getArg(sourceMap, 'sourcesContent', null);
  var mappings = util$1.getArg(sourceMap, 'mappings');
  var file = util$1.getArg(sourceMap, 'file', null);

  // Once again, Sass deviates from the spec and supplies the version as a
  // string rather than a number, so we use loose equality checking here.
  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  if (sourceRoot) {
    sourceRoot = util$1.normalize(sourceRoot);
  }

  sources = sources
    .map(String)
    // Some source maps produce relative source paths like "./foo.js" instead of
    // "foo.js".  Normalize these first so that future comparisons will succeed.
    // See bugzil.la/1090768.
    .map(util$1.normalize)
    // Always ensure that absolute sources are internally stored relative to
    // the source root, if the source root is absolute. Not doing this would
    // be particularly problematic when the source root is a prefix of the
    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
    .map(function (source) {
      return sourceRoot && util$1.isAbsolute(sourceRoot) && util$1.isAbsolute(source)
        ? util$1.relative(sourceRoot, source)
        : source;
    });

  // Pass `true` below to allow duplicate names and sources. While source maps
  // are intended to be compressed and deduplicated, the TypeScript compiler
  // sometimes generates source maps with duplicates in them. See Github issue
  // #72 and bugzil.la/889492.
  this._names = ArraySet$2.fromArray(names.map(String), true);
  this._sources = ArraySet$2.fromArray(sources, true);

  this._absoluteSources = this._sources.toArray().map(function (s) {
    return util$1.computeSourceURL(sourceRoot, s, aSourceMapURL);
  });

  this.sourceRoot = sourceRoot;
  this.sourcesContent = sourcesContent;
  this._mappings = mappings;
  this._sourceMapURL = aSourceMapURL;
  this.file = file;
}

BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

/**
 * Utility function to find the index of a source.  Returns -1 if not
 * found.
 */
BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
  var relativeSource = aSource;
  if (this.sourceRoot != null) {
    relativeSource = util$1.relative(this.sourceRoot, relativeSource);
  }

  if (this._sources.has(relativeSource)) {
    return this._sources.indexOf(relativeSource);
  }

  // Maybe aSource is an absolute URL as returned by |sources|.  In
  // this case we can't simply undo the transform.
  var i;
  for (i = 0; i < this._absoluteSources.length; ++i) {
    if (this._absoluteSources[i] == aSource) {
      return i;
    }
  }

  return -1;
};

/**
 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
 *
 * @param SourceMapGenerator aSourceMap
 *        The source map that will be consumed.
 * @param String aSourceMapURL
 *        The URL at which the source map can be found (optional)
 * @returns BasicSourceMapConsumer
 */
BasicSourceMapConsumer.fromSourceMap =
  function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);

    var names = smc._names = ArraySet$2.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet$2.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                            smc.sourceRoot);
    smc.file = aSourceMap._file;
    smc._sourceMapURL = aSourceMapURL;
    smc._absoluteSources = smc._sources.toArray().map(function (s) {
      return util$1.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
    });

    // Because we are modifying the entries (by converting string sources and
    // names to indices into the sources and names ArraySets), we have to make
    // a copy of the entry or else bad things happen. Shared mutable state
    // strikes again! See github issue #191.

    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];

    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping;
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;

      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;

        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }

        destOriginalMappings.push(destMapping);
      }

      destGeneratedMappings.push(destMapping);
    }

    quickSort$1(smc.__originalMappings, util$1.compareByOriginalPositions);

    return smc;
  };

/**
 * The version of the source mapping spec that we are consuming.
 */
BasicSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
  get: function () {
    return this._absoluteSources.slice();
  }
});

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
BasicSourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;

    while (index < length) {
      if (aStr.charAt(index) === ';') {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      }
      else if (aStr.charAt(index) === ',') {
        index++;
      }
      else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;

        // Because each offset is encoded relative to the previous one,
        // many segments often have the same encoding. We can exploit this
        // fact by caching the parsed variable length fields of each segment,
        // allowing us to avoid a second parse if we encounter the same
        // segment again.
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);

        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64Vlq.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }

          if (segment.length === 2) {
            throw new Error('Found a source, but no line and column');
          }

          if (segment.length === 3) {
            throw new Error('Found a source and line, but no column');
          }

          cachedSegments[str] = segment;
        }

        // Generated column.
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;

        if (segment.length > 1) {
          // Original source.
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];

          // Original line.
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          // Lines are stored 0-based
          mapping.originalLine += 1;

          // Original column.
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;

          if (segment.length > 4) {
            // Original name.
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }

        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === 'number') {
          originalMappings.push(mapping);
        }
      }
    }

    quickSort$1(generatedMappings, util$1.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;

    quickSort$1(originalMappings, util$1.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };

/**
 * Find the mapping that best matches the hypothetical "needle" mapping that
 * we are searching for in the given "haystack" of mappings.
 */
BasicSourceMapConsumer.prototype._findMapping =
  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                         aColumnName, aComparator, aBias) {
    // To return the position we are searching for, we must first find the
    // mapping for the given position and then return the opposite position it
    // points to. Because the mappings are sorted, we can use binary search to
    // find the best mapping.

    if (aNeedle[aLineName] <= 0) {
      throw new TypeError('Line must be greater than or equal to 1, got '
                          + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError('Column must be greater than or equal to 0, got '
                          + aNeedle[aColumnName]);
    }

    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
  };

/**
 * Compute the last column for each generated mapping. The last column is
 * inclusive.
 */
BasicSourceMapConsumer.prototype.computeColumnSpans =
  function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];

      // Mappings do not contain a field for the last generated columnt. We
      // can come up with an optimistic estimate, however, by assuming that
      // mappings are contiguous (i.e. given two consecutive mappings, the
      // first mapping ends where the second one starts).
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];

        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }

      // The last mapping for each line spans the entire line.
      mapping.lastGeneratedColumn = Infinity;
    }
  };

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
BasicSourceMapConsumer.prototype.originalPositionFor =
  function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util$1.getArg(aArgs, 'line'),
      generatedColumn: util$1.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      util$1.compareByGeneratedPositionsDeflated,
      util$1.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._generatedMappings[index];

      if (mapping.generatedLine === needle.generatedLine) {
        var source = util$1.getArg(mapping, 'source', null);
        if (source !== null) {
          source = this._sources.at(source);
          source = util$1.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
        }
        var name = util$1.getArg(mapping, 'name', null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source: source,
          line: util$1.getArg(mapping, 'originalLine', null),
          column: util$1.getArg(mapping, 'originalColumn', null),
          name: name
        };
      }
    }

    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
  function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() &&
      !this.sourcesContent.some(function (sc) { return sc == null; });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
BasicSourceMapConsumer.prototype.sourceContentFor =
  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }

    var index = this._findSourceIndex(aSource);
    if (index >= 0) {
      return this.sourcesContent[index];
    }

    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util$1.relative(this.sourceRoot, relativeSource);
    }

    var url;
    if (this.sourceRoot != null
        && (url = util$1.urlParse(this.sourceRoot))) {
      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
      // many users. We can help them out when they expect file:// URIs to
      // behave like it would if they were running a local HTTP server. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
      if (url.scheme == "file"
          && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
      }

      if ((!url.path || url.path == "/")
          && this._sources.has("/" + relativeSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
      }
    }

    // This function is used recursively from
    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
    // don't want to throw if we can't find the source - we just want to
    // return null, so we provide a flag to exit gracefully.
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
BasicSourceMapConsumer.prototype.generatedPositionFor =
  function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util$1.getArg(aArgs, 'source');
    source = this._findSourceIndex(source);
    if (source < 0) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }

    var needle = {
      source: source,
      originalLine: util$1.getArg(aArgs, 'line'),
      originalColumn: util$1.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util$1.compareByOriginalPositions,
      util$1.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (mapping.source === needle.source) {
        return {
          line: util$1.getArg(mapping, 'generatedLine', null),
          column: util$1.getArg(mapping, 'generatedColumn', null),
          lastColumn: util$1.getArg(mapping, 'lastGeneratedColumn', null)
        };
      }
    }

    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };

var BasicSourceMapConsumer_1 = BasicSourceMapConsumer;

/**
 * An IndexedSourceMapConsumer instance represents a parsed source map which
 * we can query for information. It differs from BasicSourceMapConsumer in
 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
 * input.
 *
 * The first parameter is a raw source map (either as a JSON string, or already
 * parsed to an object). According to the spec for indexed source maps, they
 * have the following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - file: Optional. The generated file this source map is associated with.
 *   - sections: A list of section definitions.
 *
 * Each value under the "sections" field has two fields:
 *   - offset: The offset into the original specified at which this section
 *       begins to apply, defined as an object with a "line" and "column"
 *       field.
 *   - map: A source map definition. This source map could also be indexed,
 *       but doesn't have to be.
 *
 * Instead of the "map" field, it's also possible to have a "url" field
 * specifying a URL to retrieve a source map from, but that's currently
 * unsupported.
 *
 * Here's an example source map, taken from the source map spec[0], but
 * modified to omit a section which uses the "url" field.
 *
 *  {
 *    version : 3,
 *    file: "app.js",
 *    sections: [{
 *      offset: {line:100, column:10},
 *      map: {
 *        version : 3,
 *        file: "section.js",
 *        sources: ["foo.js", "bar.js"],
 *        names: ["src", "maps", "are", "fun"],
 *        mappings: "AAAA,E;;ABCDE;"
 *      }
 *    }],
 *  }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
 */
function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util$1.parseSourceMapInput(aSourceMap);
  }

  var version = util$1.getArg(sourceMap, 'version');
  var sections = util$1.getArg(sourceMap, 'sections');

  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  this._sources = new ArraySet$2();
  this._names = new ArraySet$2();

  var lastOffset = {
    line: -1,
    column: 0
  };
  this._sections = sections.map(function (s) {
    if (s.url) {
      // The url field will require support for asynchronicity.
      // See https://github.com/mozilla/source-map/issues/16
      throw new Error('Support for url field in sections not implemented.');
    }
    var offset = util$1.getArg(s, 'offset');
    var offsetLine = util$1.getArg(offset, 'line');
    var offsetColumn = util$1.getArg(offset, 'column');

    if (offsetLine < lastOffset.line ||
        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
      throw new Error('Section offsets must be ordered and non-overlapping.');
    }
    lastOffset = offset;

    return {
      generatedOffset: {
        // The offset fields are 0-based, but we use 1-based indices when
        // encoding/decoding from VLQ.
        generatedLine: offsetLine + 1,
        generatedColumn: offsetColumn + 1
      },
      consumer: new SourceMapConsumer(util$1.getArg(s, 'map'), aSourceMapURL)
    }
  });
}

IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

/**
 * The version of the source mapping spec that we are consuming.
 */
IndexedSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
  get: function () {
    var sources = [];
    for (var i = 0; i < this._sections.length; i++) {
      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
        sources.push(this._sections[i].consumer.sources[j]);
      }
    }
    return sources;
  }
});

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
IndexedSourceMapConsumer.prototype.originalPositionFor =
  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util$1.getArg(aArgs, 'line'),
      generatedColumn: util$1.getArg(aArgs, 'column')
    };

    // Find the section containing the generated position we're trying to map
    // to an original position.
    var sectionIndex = binarySearch.search(needle, this._sections,
      function(needle, section) {
        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }

        return (needle.generatedColumn -
                section.generatedOffset.generatedColumn);
      });
    var section = this._sections[sectionIndex];

    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }

    return section.consumer.originalPositionFor({
      line: needle.generatedLine -
        (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn -
        (section.generatedOffset.generatedLine === needle.generatedLine
         ? section.generatedOffset.generatedColumn - 1
         : 0),
      bias: aArgs.bias
    });
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function (s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
IndexedSourceMapConsumer.prototype.sourceContentFor =
  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      var content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based. 
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
IndexedSourceMapConsumer.prototype.generatedPositionFor =
  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      // Only consider this section if the requested source is in the list of
      // sources of the consumer.
      if (section.consumer._findSourceIndex(util$1.getArg(aArgs, 'source')) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line +
            (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column +
            (section.generatedOffset.generatedLine === generatedPosition.line
             ? section.generatedOffset.generatedColumn - 1
             : 0)
        };
        return ret;
      }
    }

    return {
      line: null,
      column: null
    };
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
IndexedSourceMapConsumer.prototype._parseMappings =
  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];

        var source = section.consumer._sources.at(mapping.source);
        source = util$1.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
        this._sources.add(source);
        source = this._sources.indexOf(source);

        var name = null;
        if (mapping.name) {
          name = section.consumer._names.at(mapping.name);
          this._names.add(name);
          name = this._names.indexOf(name);
        }

        // The mappings coming from the consumer for the section have
        // generated positions relative to the start of the section, so we
        // need to offset them to be relative to the start of the concatenated
        // generated file.
        var adjustedMapping = {
          source: source,
          generatedLine: mapping.generatedLine +
            (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn +
            (section.generatedOffset.generatedLine === mapping.generatedLine
            ? section.generatedOffset.generatedColumn - 1
            : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: name
        };

        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === 'number') {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }

    quickSort$1(this.__generatedMappings, util$1.compareByGeneratedPositionsDeflated);
    quickSort$1(this.__originalMappings, util$1.compareByOriginalPositions);
  };

var IndexedSourceMapConsumer_1 = IndexedSourceMapConsumer;

var sourceMapConsumer = {
	SourceMapConsumer: SourceMapConsumer_1,
	BasicSourceMapConsumer: BasicSourceMapConsumer_1,
	IndexedSourceMapConsumer: IndexedSourceMapConsumer_1
};

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var SourceMapGenerator$1 = sourceMapGenerator.SourceMapGenerator;


// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
// operating systems these days (capturing the result).
var REGEX_NEWLINE = /(\r?\n)/;

// Newline character code for charCodeAt() comparisons
var NEWLINE_CODE = 10;

// Private symbol for identifying `SourceNode`s when multiple versions of
// the source-map library are loaded. This MUST NOT CHANGE across
// versions!
var isSourceNode = "$$$isSourceNode$$$";

/**
 * SourceNodes provide a way to abstract over interpolating/concatenating
 * snippets of generated JavaScript source code while maintaining the line and
 * column information associated with the original source code.
 *
 * @param aLine The original line number.
 * @param aColumn The original column number.
 * @param aSource The original source's filename.
 * @param aChunks Optional. An array of strings which are snippets of
 *        generated JS, or other SourceNodes.
 * @param aName The original identifier.
 */
function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
  this.children = [];
  this.sourceContents = {};
  this.line = aLine == null ? null : aLine;
  this.column = aColumn == null ? null : aColumn;
  this.source = aSource == null ? null : aSource;
  this.name = aName == null ? null : aName;
  this[isSourceNode] = true;
  if (aChunks != null) this.add(aChunks);
}

/**
 * Creates a SourceNode from generated code and a SourceMapConsumer.
 *
 * @param aGeneratedCode The generated code
 * @param aSourceMapConsumer The SourceMap for the generated code
 * @param aRelativePath Optional. The path that relative sources in the
 *        SourceMapConsumer should be relative to.
 */
SourceNode.fromStringWithSourceMap =
  function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
    // The SourceNode we want to fill with the generated code
    // and the SourceMap
    var node = new SourceNode();

    // All even indices of this array are one line of the generated code,
    // while all odd indices are the newlines between two adjacent lines
    // (since `REGEX_NEWLINE` captures its match).
    // Processed fragments are accessed by calling `shiftNextLine`.
    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
    var remainingLinesIndex = 0;
    var shiftNextLine = function() {
      var lineContents = getNextLine();
      // The last line of a file might not have a newline.
      var newLine = getNextLine() || "";
      return lineContents + newLine;

      function getNextLine() {
        return remainingLinesIndex < remainingLines.length ?
            remainingLines[remainingLinesIndex++] : undefined;
      }
    };

    // We need to remember the position of "remainingLines"
    var lastGeneratedLine = 1, lastGeneratedColumn = 0;

    // The generate SourceNodes we need a code range.
    // To extract it current and last mapping is used.
    // Here we store the last mapping.
    var lastMapping = null;

    aSourceMapConsumer.eachMapping(function (mapping) {
      if (lastMapping !== null) {
        // We add the code from "lastMapping" to "mapping":
        // First check if there is a new line in between.
        if (lastGeneratedLine < mapping.generatedLine) {
          // Associate first line with "lastMapping"
          addMappingWithCode(lastMapping, shiftNextLine());
          lastGeneratedLine++;
          lastGeneratedColumn = 0;
          // The remaining code is added without mapping
        } else {
          // There is no new line in between.
          // Associate the code between "lastGeneratedColumn" and
          // "mapping.generatedColumn" with "lastMapping"
          var nextLine = remainingLines[remainingLinesIndex] || '';
          var code = nextLine.substr(0, mapping.generatedColumn -
                                        lastGeneratedColumn);
          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn -
                                              lastGeneratedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
          addMappingWithCode(lastMapping, code);
          // No more remaining code, continue
          lastMapping = mapping;
          return;
        }
      }
      // We add the generated code until the first mapping
      // to the SourceNode without any mapping.
      // Each line is added as separate string.
      while (lastGeneratedLine < mapping.generatedLine) {
        node.add(shiftNextLine());
        lastGeneratedLine++;
      }
      if (lastGeneratedColumn < mapping.generatedColumn) {
        var nextLine = remainingLines[remainingLinesIndex] || '';
        node.add(nextLine.substr(0, mapping.generatedColumn));
        remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
        lastGeneratedColumn = mapping.generatedColumn;
      }
      lastMapping = mapping;
    }, this);
    // We have processed all mappings.
    if (remainingLinesIndex < remainingLines.length) {
      if (lastMapping) {
        // Associate the remaining code in the current line with "lastMapping"
        addMappingWithCode(lastMapping, shiftNextLine());
      }
      // and add the remaining lines without any mapping
      node.add(remainingLines.splice(remainingLinesIndex).join(""));
    }

    // Copy sourcesContent into SourceNode
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aRelativePath != null) {
          sourceFile = util$1.join(aRelativePath, sourceFile);
        }
        node.setSourceContent(sourceFile, content);
      }
    });

    return node;

    function addMappingWithCode(mapping, code) {
      if (mapping === null || mapping.source === undefined) {
        node.add(code);
      } else {
        var source = aRelativePath
          ? util$1.join(aRelativePath, mapping.source)
          : mapping.source;
        node.add(new SourceNode(mapping.originalLine,
                                mapping.originalColumn,
                                source,
                                code,
                                mapping.name));
      }
    }
  };

/**
 * Add a chunk of generated JS to this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.add = function SourceNode_add(aChunk) {
  if (Array.isArray(aChunk)) {
    aChunk.forEach(function (chunk) {
      this.add(chunk);
    }, this);
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    if (aChunk) {
      this.children.push(aChunk);
    }
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Add a chunk of generated JS to the beginning of this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
  if (Array.isArray(aChunk)) {
    for (var i = aChunk.length-1; i >= 0; i--) {
      this.prepend(aChunk[i]);
    }
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    this.children.unshift(aChunk);
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Walk over the tree of JS snippets in this node and its children. The
 * walking function is called once for each snippet of JS and is passed that
 * snippet and the its original associated source's line/column location.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walk = function SourceNode_walk(aFn) {
  var chunk;
  for (var i = 0, len = this.children.length; i < len; i++) {
    chunk = this.children[i];
    if (chunk[isSourceNode]) {
      chunk.walk(aFn);
    }
    else {
      if (chunk !== '') {
        aFn(chunk, { source: this.source,
                     line: this.line,
                     column: this.column,
                     name: this.name });
      }
    }
  }
};

/**
 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
 * each of `this.children`.
 *
 * @param aSep The separator.
 */
SourceNode.prototype.join = function SourceNode_join(aSep) {
  var newChildren;
  var i;
  var len = this.children.length;
  if (len > 0) {
    newChildren = [];
    for (i = 0; i < len-1; i++) {
      newChildren.push(this.children[i]);
      newChildren.push(aSep);
    }
    newChildren.push(this.children[i]);
    this.children = newChildren;
  }
  return this;
};

/**
 * Call String.prototype.replace on the very right-most source snippet. Useful
 * for trimming whitespace from the end of a source node, etc.
 *
 * @param aPattern The pattern to replace.
 * @param aReplacement The thing to replace the pattern with.
 */
SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
  var lastChild = this.children[this.children.length - 1];
  if (lastChild[isSourceNode]) {
    lastChild.replaceRight(aPattern, aReplacement);
  }
  else if (typeof lastChild === 'string') {
    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
  }
  else {
    this.children.push(''.replace(aPattern, aReplacement));
  }
  return this;
};

/**
 * Set the source content for a source file. This will be added to the SourceMapGenerator
 * in the sourcesContent field.
 *
 * @param aSourceFile The filename of the source file
 * @param aSourceContent The content of the source file
 */
SourceNode.prototype.setSourceContent =
  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
    this.sourceContents[util$1.toSetString(aSourceFile)] = aSourceContent;
  };

/**
 * Walk over the tree of SourceNodes. The walking function is called for each
 * source file content and is passed the filename and source content.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walkSourceContents =
  function SourceNode_walkSourceContents(aFn) {
    for (var i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i][isSourceNode]) {
        this.children[i].walkSourceContents(aFn);
      }
    }

    var sources = Object.keys(this.sourceContents);
    for (var i = 0, len = sources.length; i < len; i++) {
      aFn(util$1.fromSetString(sources[i]), this.sourceContents[sources[i]]);
    }
  };

/**
 * Return the string representation of this source node. Walks over the tree
 * and concatenates all the various snippets together to one string.
 */
SourceNode.prototype.toString = function SourceNode_toString() {
  var str = "";
  this.walk(function (chunk) {
    str += chunk;
  });
  return str;
};

/**
 * Returns the string representation of this source node along with a source
 * map.
 */
SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
  var generated = {
    code: "",
    line: 1,
    column: 0
  };
  var map = new SourceMapGenerator$1(aArgs);
  var sourceMappingActive = false;
  var lastOriginalSource = null;
  var lastOriginalLine = null;
  var lastOriginalColumn = null;
  var lastOriginalName = null;
  this.walk(function (chunk, original) {
    generated.code += chunk;
    if (original.source !== null
        && original.line !== null
        && original.column !== null) {
      if(lastOriginalSource !== original.source
         || lastOriginalLine !== original.line
         || lastOriginalColumn !== original.column
         || lastOriginalName !== original.name) {
        map.addMapping({
          source: original.source,
          original: {
            line: original.line,
            column: original.column
          },
          generated: {
            line: generated.line,
            column: generated.column
          },
          name: original.name
        });
      }
      lastOriginalSource = original.source;
      lastOriginalLine = original.line;
      lastOriginalColumn = original.column;
      lastOriginalName = original.name;
      sourceMappingActive = true;
    } else if (sourceMappingActive) {
      map.addMapping({
        generated: {
          line: generated.line,
          column: generated.column
        }
      });
      lastOriginalSource = null;
      sourceMappingActive = false;
    }
    for (var idx = 0, length = chunk.length; idx < length; idx++) {
      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
        generated.line++;
        generated.column = 0;
        // Mappings end at eol
        if (idx + 1 === length) {
          lastOriginalSource = null;
          sourceMappingActive = false;
        } else if (sourceMappingActive) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
      } else {
        generated.column++;
      }
    }
  });
  this.walkSourceContents(function (sourceFile, sourceContent) {
    map.setSourceContent(sourceFile, sourceContent);
  });

  return { code: generated.code, map: map };
};

var SourceNode_1 = SourceNode;

var sourceNode = {
	SourceNode: SourceNode_1
};

/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
var SourceMapGenerator$2 = sourceMapGenerator.SourceMapGenerator;
var SourceMapConsumer$1 = sourceMapConsumer.SourceMapConsumer;
var SourceNode$1 = sourceNode.SourceNode;

var sourceMap = {
	SourceMapGenerator: SourceMapGenerator$2,
	SourceMapConsumer: SourceMapConsumer$1,
	SourceNode: SourceNode$1
};

var sourceMapUrl = createCommonjsModule(function (module, exports) {
// Copyright 2014 Simon Lydell
// X11 (“MIT”) Licensed. (See LICENSE.)

void (function(root, factory) {
  {
    module.exports = factory();
  }
}(commonjsGlobal, function() {

  var innerRegex = /[#@] sourceMappingURL=([^\s'"]*)/;

  var regex = RegExp(
    "(?:" +
      "/\\*" +
      "(?:\\s*\r?\n(?://)?)?" +
      "(?:" + innerRegex.source + ")" +
      "\\s*" +
      "\\*/" +
      "|" +
      "//(?:" + innerRegex.source + ")" +
    ")" +
    "\\s*"
  );

  return {

    regex: regex,
    _innerRegex: innerRegex,

    getFrom: function(code) {
      var match = code.match(regex);
      return (match ? match[1] || match[2] || "" : null)
    },

    existsIn: function(code) {
      return regex.test(code)
    },

    removeFrom: function(code) {
      return code.replace(regex, "")
    },

    insertBefore: function(code, string) {
      var match = code.match(regex);
      if (match) {
        return code.slice(0, match.index) + string + code.slice(match.index)
      } else {
        return code + string
      }
    }
  }

}));
});

// Copyright 2014 Simon Lydell
// X11 (“MIT”) Licensed. (See LICENSE.)



function resolveUrl(/* ...urls */) {
  return Array.prototype.reduce.call(arguments, function(resolved, nextUrl) {
    return url$1__default.resolve(resolved, nextUrl)
  })
}

var resolveUrl_1 = resolveUrl;

var token = '%[a-f0-9]{2}';
var singleMatcher = new RegExp(token, 'gi');
var multiMatcher = new RegExp('(' + token + ')+', 'gi');

function decodeComponents(components, split) {
	try {
		// Try to decode the entire string first
		return decodeURIComponent(components.join(''));
	} catch (err) {
		// Do nothing
	}

	if (components.length === 1) {
		return components;
	}

	split = split || 1;

	// Split the array in 2 parts
	var left = components.slice(0, split);
	var right = components.slice(split);

	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}

function decode$2(input) {
	try {
		return decodeURIComponent(input);
	} catch (err) {
		var tokens = input.match(singleMatcher);

		for (var i = 1; i < tokens.length; i++) {
			input = decodeComponents(tokens, i).join('');

			tokens = input.match(singleMatcher);
		}

		return input;
	}
}

function customDecodeURIComponent(input) {
	// Keep track of all the replacements and prefill the map with the `BOM`
	var replaceMap = {
		'%FE%FF': '\uFFFD\uFFFD',
		'%FF%FE': '\uFFFD\uFFFD'
	};

	var match = multiMatcher.exec(input);
	while (match) {
		try {
			// Decode as big chunks as possible
			replaceMap[match[0]] = decodeURIComponent(match[0]);
		} catch (err) {
			var result = decode$2(match[0]);

			if (result !== match[0]) {
				replaceMap[match[0]] = result;
			}
		}

		match = multiMatcher.exec(input);
	}

	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
	replaceMap['%C2'] = '\uFFFD';

	var entries = Object.keys(replaceMap);

	for (var i = 0; i < entries.length; i++) {
		// Replace all decoded components
		var key = entries[i];
		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
	}

	return input;
}

var decodeUriComponent = function (encodedURI) {
	if (typeof encodedURI !== 'string') {
		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
	}

	try {
		encodedURI = encodedURI.replace(/\+/g, ' ');

		// Try the built in decoder first
		return decodeURIComponent(encodedURI);
	} catch (err) {
		// Fallback to a more advanced decoder
		return customDecodeURIComponent(encodedURI);
	}
};

// Copyright 2017 Simon Lydell
// X11 (“MIT”) Licensed. (See LICENSE.)



function customDecodeUriComponent(string) {
  // `decodeUriComponent` turns `+` into ` `, but that's not wanted.
  return decodeUriComponent(string.replace(/\+/g, "%2B"))
}

var decodeUriComponent_1 = customDecodeUriComponent;

function urix(aPath) {
  if (path$1__default.sep === "\\") {
    return aPath
      .replace(/\\/g, "/")
      .replace(/^[a-z]:\/?/i, "/")
  }
  return aPath
}

var urix_1 = urix;

function atob(str) {
  return Buffer.from(str, 'base64').toString('binary');
}

var nodeAtob = atob.atob = atob;

// Copyright 2014, 2015, 2016, 2017 Simon Lydell
// X11 (“MIT”) Licensed. (See LICENSE.)









function callbackAsync(callback, error, result) {
  setImmediate(function() { callback(error, result); });
}

function parseMapToJSON(string, data) {
  try {
    return JSON.parse(string.replace(/^\)\]\}'/, ""))
  } catch (error) {
    error.sourceMapData = data;
    throw error
  }
}

function readSync(read, url, data) {
  var readUrl = decodeUriComponent_1(url);
  try {
    return String(read(readUrl))
  } catch (error) {
    error.sourceMapData = data;
    throw error
  }
}



function resolveSourceMap(code, codeUrl, read, callback) {
  var mapData;
  try {
    mapData = resolveSourceMapHelper(code, codeUrl);
  } catch (error) {
    return callbackAsync(callback, error)
  }
  if (!mapData || mapData.map) {
    return callbackAsync(callback, null, mapData)
  }
  var readUrl = decodeUriComponent_1(mapData.url);
  read(readUrl, function(error, result) {
    if (error) {
      error.sourceMapData = mapData;
      return callback(error)
    }
    mapData.map = String(result);
    try {
      mapData.map = parseMapToJSON(mapData.map, mapData);
    } catch (error) {
      return callback(error)
    }
    callback(null, mapData);
  });
}

function resolveSourceMapSync(code, codeUrl, read) {
  var mapData = resolveSourceMapHelper(code, codeUrl);
  if (!mapData || mapData.map) {
    return mapData
  }
  mapData.map = readSync(read, mapData.url, mapData);
  mapData.map = parseMapToJSON(mapData.map, mapData);
  return mapData
}

var dataUriRegex = /^data:([^,;]*)(;[^,;]*)*(?:,(.*))?$/;
var jsonMimeTypeRegex = /^(?:application|text)\/json$/;

function resolveSourceMapHelper(code, codeUrl) {
  codeUrl = urix_1(codeUrl);

  var url = sourceMapUrl.getFrom(code);
  if (!url) {
    return null
  }

  var dataUri = url.match(dataUriRegex);
  if (dataUri) {
    var mimeType = dataUri[1];
    var lastParameter = dataUri[2] || "";
    var encoded = dataUri[3] || "";
    var data = {
      sourceMappingURL: url,
      url: null,
      sourcesRelativeTo: codeUrl,
      map: encoded
    };
    if (!jsonMimeTypeRegex.test(mimeType)) {
      var error = new Error("Unuseful data uri mime type: " + (mimeType || "text/plain"));
      error.sourceMapData = data;
      throw error
    }
    data.map = parseMapToJSON(
      lastParameter === ";base64" ? nodeAtob(encoded) : decodeURIComponent(encoded),
      data
    );
    return data
  }

  var mapUrl = resolveUrl_1(codeUrl, url);
  return {
    sourceMappingURL: url,
    url: mapUrl,
    sourcesRelativeTo: mapUrl,
    map: null
  }
}



function resolveSources(map, mapUrl, read, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  var pending = map.sources ? map.sources.length : 0;
  var result = {
    sourcesResolved: [],
    sourcesContent:  []
  };

  if (pending === 0) {
    callbackAsync(callback, null, result);
    return
  }

  var done = function() {
    pending--;
    if (pending === 0) {
      callback(null, result);
    }
  };

  resolveSourcesHelper(map, mapUrl, options, function(fullUrl, sourceContent, index) {
    result.sourcesResolved[index] = fullUrl;
    if (typeof sourceContent === "string") {
      result.sourcesContent[index] = sourceContent;
      callbackAsync(done, null);
    } else {
      var readUrl = decodeUriComponent_1(fullUrl);
      read(readUrl, function(error, source) {
        result.sourcesContent[index] = error ? error : String(source);
        done();
      });
    }
  });
}

function resolveSourcesSync(map, mapUrl, read, options) {
  var result = {
    sourcesResolved: [],
    sourcesContent:  []
  };

  if (!map.sources || map.sources.length === 0) {
    return result
  }

  resolveSourcesHelper(map, mapUrl, options, function(fullUrl, sourceContent, index) {
    result.sourcesResolved[index] = fullUrl;
    if (read !== null) {
      if (typeof sourceContent === "string") {
        result.sourcesContent[index] = sourceContent;
      } else {
        var readUrl = decodeUriComponent_1(fullUrl);
        try {
          result.sourcesContent[index] = String(read(readUrl));
        } catch (error) {
          result.sourcesContent[index] = error;
        }
      }
    }
  });

  return result
}

var endingSlash = /\/?$/;

function resolveSourcesHelper(map, mapUrl, options, fn) {
  options = options || {};
  mapUrl = urix_1(mapUrl);
  var fullUrl;
  var sourceContent;
  var sourceRoot;
  for (var index = 0, len = map.sources.length; index < len; index++) {
    sourceRoot = null;
    if (typeof options.sourceRoot === "string") {
      sourceRoot = options.sourceRoot;
    } else if (typeof map.sourceRoot === "string" && options.sourceRoot !== false) {
      sourceRoot = map.sourceRoot;
    }
    // If the sourceRoot is the empty string, it is equivalent to not setting
    // the property at all.
    if (sourceRoot === null || sourceRoot === '') {
      fullUrl = resolveUrl_1(mapUrl, map.sources[index]);
    } else {
      // Make sure that the sourceRoot ends with a slash, so that `/scripts/subdir` becomes
      // `/scripts/subdir/<source>`, not `/scripts/<source>`. Pointing to a file as source root
      // does not make sense.
      fullUrl = resolveUrl_1(mapUrl, sourceRoot.replace(endingSlash, "/"), map.sources[index]);
    }
    sourceContent = (map.sourcesContent || [])[index];
    fn(fullUrl, sourceContent, index);
  }
}



function resolve(code, codeUrl, read, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  if (code === null) {
    var mapUrl = codeUrl;
    var data = {
      sourceMappingURL: null,
      url: mapUrl,
      sourcesRelativeTo: mapUrl,
      map: null
    };
    var readUrl = decodeUriComponent_1(mapUrl);
    read(readUrl, function(error, result) {
      if (error) {
        error.sourceMapData = data;
        return callback(error)
      }
      data.map = String(result);
      try {
        data.map = parseMapToJSON(data.map, data);
      } catch (error) {
        return callback(error)
      }
      _resolveSources(data);
    });
  } else {
    resolveSourceMap(code, codeUrl, read, function(error, mapData) {
      if (error) {
        return callback(error)
      }
      if (!mapData) {
        return callback(null, null)
      }
      _resolveSources(mapData);
    });
  }

  function _resolveSources(mapData) {
    resolveSources(mapData.map, mapData.sourcesRelativeTo, read, options, function(error, result) {
      if (error) {
        return callback(error)
      }
      mapData.sourcesResolved = result.sourcesResolved;
      mapData.sourcesContent  = result.sourcesContent;
      callback(null, mapData);
    });
  }
}

function resolveSync(code, codeUrl, read, options) {
  var mapData;
  if (code === null) {
    var mapUrl = codeUrl;
    mapData = {
      sourceMappingURL: null,
      url: mapUrl,
      sourcesRelativeTo: mapUrl,
      map: null
    };
    mapData.map = readSync(read, mapUrl, mapData);
    mapData.map = parseMapToJSON(mapData.map, mapData);
  } else {
    mapData = resolveSourceMapSync(code, codeUrl, read);
    if (!mapData) {
      return null
    }
  }
  var result = resolveSourcesSync(mapData.map, mapData.sourcesRelativeTo, read, options);
  mapData.sourcesResolved = result.sourcesResolved;
  mapData.sourcesContent  = result.sourcesContent;
  return mapData
}



var sourceMapResolveNode = {
  resolveSourceMap:     resolveSourceMap,
  resolveSourceMapSync: resolveSourceMapSync,
  resolveSources:       resolveSources,
  resolveSourcesSync:   resolveSourcesSync,
  resolve:              resolve,
  resolveSync:          resolveSync,
  parseMapToJSON:       parseMapToJSON
};

/**
 * Module dependencies
 */

var extend$1 = extendShallow$4;
var SourceMap = sourceMap;
var sourceMapResolve = sourceMapResolveNode;

/**
 * Convert backslash in the given string to forward slashes
 */

var unixify = function(fp) {
  return fp.split(/\\+/).join('/');
};

/**
 * Return true if `val` is a non-empty string
 *
 * @param {String} `str`
 * @return {Boolean}
 */

var isString$1 = function(str) {
  return str && typeof str === 'string';
};

/**
 * Cast `val` to an array
 * @return {Array}
 */

var arrayify$3 = function(val) {
  if (typeof val === 'string') return [val];
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Get the last `n` element from the given `array`
 * @param {Array} `array`
 * @return {*}
 */

var last = function(arr, n) {
  return arr[arr.length - (n || 1)];
};

var utils = {
	extend: extend$1,
	SourceMap: SourceMap,
	sourceMapResolve: sourceMapResolve,
	unixify: unixify,
	isString: isString$1,
	arrayify: arrayify$3,
	last: last
};

var sourceMaps = createCommonjsModule(function (module, exports) {






/**
 * Expose `mixin()`.
 * This code is based on `source-maps-support.js` in reworkcss/css
 * https://github.com/reworkcss/css/blob/master/lib/stringify/source-map-support.js
 * Copyright (c) 2012 TJ Holowaychuk <tj@vision-media.ca>
 */

module.exports = mixin;

/**
 * Mixin source map support into `compiler`.
 *
 * @param {Object} `compiler`
 * @api public
 */

function mixin(compiler) {
  defineProperty$6(compiler, '_comment', compiler.comment);
  compiler.map = new utils.SourceMap.SourceMapGenerator();
  compiler.position = { line: 1, column: 1 };
  compiler.content = {};
  compiler.files = {};

  for (var key in exports) {
    defineProperty$6(compiler, key, exports[key]);
  }
}

/**
 * Update position.
 *
 * @param {String} str
 */

exports.updatePosition = function(str) {
  var lines = str.match(/\n/g);
  if (lines) this.position.line += lines.length;
  var i = str.lastIndexOf('\n');
  this.position.column = ~i ? str.length - i : this.position.column + str.length;
};

/**
 * Emit `str` with `position`.
 *
 * @param {String} str
 * @param {Object} [pos]
 * @return {String}
 */

exports.emit = function(str, node) {
  var position = node.position || {};
  var source = position.source;
  if (source) {
    if (position.filepath) {
      source = utils.unixify(position.filepath);
    }

    this.map.addMapping({
      source: source,
      generated: {
        line: this.position.line,
        column: Math.max(this.position.column - 1, 0)
      },
      original: {
        line: position.start.line,
        column: position.start.column - 1
      }
    });

    if (position.content) {
      this.addContent(source, position);
    }
    if (position.filepath) {
      this.addFile(source, position);
    }

    this.updatePosition(str);
    this.output += str;
  }
  return str;
};

/**
 * Adds a file to the source map output if it has not already been added
 * @param {String} `file`
 * @param {Object} `pos`
 */

exports.addFile = function(file, position) {
  if (typeof position.content !== 'string') return;
  if (Object.prototype.hasOwnProperty.call(this.files, file)) return;
  this.files[file] = position.content;
};

/**
 * Adds a content source to the source map output if it has not already been added
 * @param {String} `source`
 * @param {Object} `position`
 */

exports.addContent = function(source, position) {
  if (typeof position.content !== 'string') return;
  if (Object.prototype.hasOwnProperty.call(this.content, source)) return;
  this.map.setSourceContent(source, position.content);
};

/**
 * Applies any original source maps to the output and embeds the source file
 * contents in the source map.
 */

exports.applySourceMaps = function() {
  Object.keys(this.files).forEach(function(file) {
    var content = this.files[file];
    this.map.setSourceContent(file, content);

    if (this.options.inputSourcemaps === true) {
      var originalMap = utils.sourceMapResolve.resolveSync(content, file, fs$1.readFileSync);
      if (originalMap) {
        var map = new utils.SourceMap.SourceMapConsumer(originalMap.map);
        var relativeTo = originalMap.sourcesRelativeTo;
        this.map.applySourceMap(map, file, utils.unixify(path$1__default.dirname(relativeTo)));
      }
    }
  }, this);
};

/**
 * Process comments, drops sourceMap comments.
 * @param {Object} node
 */

exports.comment = function(node) {
  if (/^# sourceMappingURL=/.test(node.comment)) {
    return this.emit('', node.position);
  }
  return this._comment(node);
};
});
var sourceMaps_1 = sourceMaps.updatePosition;
var sourceMaps_2 = sourceMaps.emit;
var sourceMaps_3 = sourceMaps.addFile;
var sourceMaps_4 = sourceMaps.addContent;
var sourceMaps_5 = sourceMaps.applySourceMaps;
var sourceMaps_6 = sourceMaps.comment;

var debug$1 = src('snapdragon:compiler');


/**
 * Create a new `Compiler` with the given `options`.
 * @param {Object} `options`
 */

function Compiler(options, state) {
  debug$1('initializing', __filename);
  this.options = utils.extend({source: 'string'}, options);
  this.state = state || {};
  this.compilers = {};
  this.output = '';
  this.set('eos', function(node) {
    return this.emit(node.val, node);
  });
  this.set('noop', function(node) {
    return this.emit(node.val, node);
  });
  this.set('bos', function(node) {
    return this.emit(node.val, node);
  });
  use(this);
}

/**
 * Prototype methods
 */

Compiler.prototype = {

  /**
   * Throw an error message with details including the cursor position.
   * @param {String} `msg` Message to use in the Error.
   */

  error: function(msg, node) {
    var pos = node.position || {start: {column: 0}};
    var message = this.options.source + ' column:' + pos.start.column + ': ' + msg;

    var err = new Error(message);
    err.reason = msg;
    err.column = pos.start.column;
    err.source = this.pattern;

    if (this.options.silent) {
      this.errors.push(err);
    } else {
      throw err;
    }
  },

  /**
   * Define a non-enumberable property on the `Compiler` instance.
   *
   * ```js
   * compiler.define('foo', 'bar');
   * ```
   * @name .define
   * @param {String} `key` propery name
   * @param {any} `val` property value
   * @return {Object} Returns the Compiler instance for chaining.
   * @api public
   */

  define: function(key, val) {
    defineProperty$6(this, key, val);
    return this;
  },

  /**
   * Emit `node.val`
   */

  emit: function(str, node) {
    this.output += str;
    return str;
  },

  /**
   * Add a compiler `fn` with the given `name`
   */

  set: function(name, fn) {
    this.compilers[name] = fn;
    return this;
  },

  /**
   * Get compiler `name`.
   */

  get: function(name) {
    return this.compilers[name];
  },

  /**
   * Get the previous AST node.
   */

  prev: function(n) {
    return this.ast.nodes[this.idx - (n || 1)] || { type: 'bos', val: '' };
  },

  /**
   * Get the next AST node.
   */

  next: function(n) {
    return this.ast.nodes[this.idx + (n || 1)] || { type: 'eos', val: '' };
  },

  /**
   * Visit `node`.
   */

  visit: function(node, nodes, i) {
    var fn = this.compilers[node.type];
    this.idx = i;

    if (typeof fn !== 'function') {
      throw this.error('compiler "' + node.type + '" is not registered', node);
    }
    return fn.call(this, node, nodes, i);
  },

  /**
   * Map visit over array of `nodes`.
   */

  mapVisit: function(nodes) {
    if (!Array.isArray(nodes)) {
      throw new TypeError('expected an array');
    }
    var len = nodes.length;
    var idx = -1;
    while (++idx < len) {
      this.visit(nodes[idx], nodes, idx);
    }
    return this;
  },

  /**
   * Compile `ast`.
   */

  compile: function(ast, options) {
    var opts = utils.extend({}, this.options, options);
    this.ast = ast;
    this.parsingErrors = this.ast.errors;
    this.output = '';

    // source map support
    if (opts.sourcemap) {
      var sourcemaps = sourceMaps;
      sourcemaps(this);
      this.mapVisit(this.ast.nodes);
      this.applySourceMaps();
      this.map = opts.sourcemap === 'generator' ? this.map : this.map.toJSON();
      return this;
    }

    this.mapVisit(this.ast.nodes);
    return this;
  }
};

/**
 * Expose `Compiler`
 */

var compiler = Compiler;

/*!
 * map-cache <https://github.com/jonschlinkert/map-cache>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var hasOwn$5 = Object.prototype.hasOwnProperty;

/**
 * Expose `MapCache`
 */

var mapCache = MapCache;

/**
 * Creates a cache object to store key/value pairs.
 *
 * ```js
 * var cache = new MapCache();
 * ```
 *
 * @api public
 */

function MapCache(data) {
  this.__data__ = data || {};
}

/**
 * Adds `value` to `key` on the cache.
 *
 * ```js
 * cache.set('foo', 'bar');
 * ```
 *
 * @param {String} `key` The key of the value to cache.
 * @param {*} `value` The value to cache.
 * @returns {Object} Returns the `Cache` object for chaining.
 * @api public
 */

MapCache.prototype.set = function mapSet(key, value) {
  if (key !== '__proto__') {
    this.__data__[key] = value;
  }
  return this;
};

/**
 * Gets the cached value for `key`.
 *
 * ```js
 * cache.get('foo');
 * //=> 'bar'
 * ```
 *
 * @param {String} `key` The key of the value to get.
 * @returns {*} Returns the cached value.
 * @api public
 */

MapCache.prototype.get = function mapGet(key) {
  return key === '__proto__' ? undefined : this.__data__[key];
};

/**
 * Checks if a cached value for `key` exists.
 *
 * ```js
 * cache.has('foo');
 * //=> true
 * ```
 *
 * @param {String} `key` The key of the entry to check.
 * @returns {Boolean} Returns `true` if an entry for `key` exists, else `false`.
 * @api public
 */

MapCache.prototype.has = function mapHas(key) {
  return key !== '__proto__' && hasOwn$5.call(this.__data__, key);
};

/**
 * Removes `key` and its value from the cache.
 *
 * ```js
 * cache.del('foo');
 * ```
 * @title .del
 * @param {String} `key` The key of the value to remove.
 * @returns {Boolean} Returns `true` if the entry was removed successfully, else `false`.
 * @api public
 */

MapCache.prototype.del = function mapDelete(key) {
  return this.has(key) && delete this.__data__[key];
};

/**
 * Store position for a node
 */

var position = function Position(start, parser) {
  this.start = start;
  this.end = { line: parser.line, column: parser.column };
  defineProperty$6(this, 'content', parser.orig);
  defineProperty$6(this, 'source', parser.options.source);
};

var debug$2 = src('snapdragon:parser');



/**
 * Create a new `Parser` with the given `input` and `options`.
 * @param {String} `input`
 * @param {Object} `options`
 * @api public
 */

function Parser(options) {
  debug$2('initializing', __filename);
  this.options = utils.extend({source: 'string'}, options);
  this.init(this.options);
  use(this);
}

/**
 * Prototype methods
 */

Parser.prototype = {
  constructor: Parser,

  init: function(options) {
    this.orig = '';
    this.input = '';
    this.parsed = '';

    this.column = 1;
    this.line = 1;

    this.regex = new mapCache();
    this.errors = this.errors || [];
    this.parsers = this.parsers || {};
    this.types = this.types || [];
    this.sets = this.sets || {};
    this.fns = this.fns || [];
    this.currentType = 'root';

    var pos = this.position();
    this.bos = pos({type: 'bos', val: ''});

    this.ast = {
      type: 'root',
      errors: this.errors,
      nodes: [this.bos]
    };

    defineProperty$6(this.bos, 'parent', this.ast);
    this.nodes = [this.ast];

    this.count = 0;
    this.setCount = 0;
    this.stack = [];
  },

  /**
   * Throw a formatted error with the cursor column and `msg`.
   * @param {String} `msg` Message to use in the Error.
   */

  error: function(msg, node) {
    var pos = node.position || {start: {column: 0, line: 0}};
    var line = pos.start.line;
    var column = pos.start.column;
    var source = this.options.source;

    var message = source + ' <line:' + line + ' column:' + column + '>: ' + msg;
    var err = new Error(message);
    err.source = source;
    err.reason = msg;
    err.pos = pos;

    if (this.options.silent) {
      this.errors.push(err);
    } else {
      throw err;
    }
  },

  /**
   * Define a non-enumberable property on the `Parser` instance.
   *
   * ```js
   * parser.define('foo', 'bar');
   * ```
   * @name .define
   * @param {String} `key` propery name
   * @param {any} `val` property value
   * @return {Object} Returns the Parser instance for chaining.
   * @api public
   */

  define: function(key, val) {
    defineProperty$6(this, key, val);
    return this;
  },

  /**
   * Mark position and patch `node.position`.
   */

  position: function() {
    var start = { line: this.line, column: this.column };
    var self = this;

    return function(node) {
      defineProperty$6(node, 'position', new position(start, self));
      return node;
    };
  },

  /**
   * Set parser `name` with the given `fn`
   * @param {String} `name`
   * @param {Function} `fn`
   * @api public
   */

  set: function(type, fn) {
    if (this.types.indexOf(type) === -1) {
      this.types.push(type);
    }
    this.parsers[type] = fn.bind(this);
    return this;
  },

  /**
   * Get parser `name`
   * @param {String} `name`
   * @api public
   */

  get: function(name) {
    return this.parsers[name];
  },

  /**
   * Push a `token` onto the `type` stack.
   *
   * @param {String} `type`
   * @return {Object} `token`
   * @api public
   */

  push: function(type, token) {
    this.sets[type] = this.sets[type] || [];
    this.count++;
    this.stack.push(token);
    return this.sets[type].push(token);
  },

  /**
   * Pop a token off of the `type` stack
   * @param {String} `type`
   * @returns {Object} Returns a token
   * @api public
   */

  pop: function(type) {
    this.sets[type] = this.sets[type] || [];
    this.count--;
    this.stack.pop();
    return this.sets[type].pop();
  },

  /**
   * Return true if inside a `stack` node. Types are `braces`, `parens` or `brackets`.
   *
   * @param {String} `type`
   * @return {Boolean}
   * @api public
   */

  isInside: function(type) {
    this.sets[type] = this.sets[type] || [];
    return this.sets[type].length > 0;
  },

  /**
   * Return true if `node` is the given `type`.
   *
   * ```js
   * parser.isType(node, 'brace');
   * ```
   * @param {Object} `node`
   * @param {String} `type`
   * @return {Boolean}
   * @api public
   */

  isType: function(node, type) {
    return node && node.type === type;
  },

  /**
   * Get the previous AST node
   * @return {Object}
   */

  prev: function(n) {
    return this.stack.length > 0
      ? utils.last(this.stack, n)
      : utils.last(this.nodes, n);
  },

  /**
   * Update line and column based on `str`.
   */

  consume: function(len) {
    this.input = this.input.substr(len);
  },

  /**
   * Update column based on `str`.
   */

  updatePosition: function(str, len) {
    var lines = str.match(/\n/g);
    if (lines) this.line += lines.length;
    var i = str.lastIndexOf('\n');
    this.column = ~i ? len - i : this.column + len;
    this.parsed += str;
    this.consume(len);
  },

  /**
   * Match `regex`, return captures, and update the cursor position by `match[0]` length.
   * @param {RegExp} `regex`
   * @return {Object}
   */

  match: function(regex) {
    var m = regex.exec(this.input);
    if (m) {
      this.updatePosition(m[0], m[0].length);
      return m;
    }
  },

  /**
   * Capture `type` with the given regex.
   * @param {String} `type`
   * @param {RegExp} `regex`
   * @return {Function}
   */

  capture: function(type, regex) {
    if (typeof regex === 'function') {
      return this.set.apply(this, arguments);
    }

    this.regex.set(type, regex);
    this.set(type, function() {
      var parsed = this.parsed;
      var pos = this.position();
      var m = this.match(regex);
      if (!m || !m[0]) return;

      var prev = this.prev();
      var node = pos({
        type: type,
        val: m[0],
        parsed: parsed,
        rest: this.input
      });

      if (m[1]) {
        node.inner = m[1];
      }

      defineProperty$6(node, 'inside', this.stack.length > 0);
      defineProperty$6(node, 'parent', prev);
      prev.nodes.push(node);
    }.bind(this));
    return this;
  },

  /**
   * Create a parser with open and close for parens,
   * brackets or braces
   */

  capturePair: function(type, openRegex, closeRegex, fn) {
    this.sets[type] = this.sets[type] || [];

    /**
     * Open
     */

    this.set(type + '.open', function() {
      var parsed = this.parsed;
      var pos = this.position();
      var m = this.match(openRegex);
      if (!m || !m[0]) return;

      var val = m[0];
      this.setCount++;
      this.specialChars = true;
      var open = pos({
        type: type + '.open',
        val: val,
        rest: this.input
      });

      if (typeof m[1] !== 'undefined') {
        open.inner = m[1];
      }

      var prev = this.prev();
      var node = pos({
        type: type,
        nodes: [open]
      });

      defineProperty$6(node, 'rest', this.input);
      defineProperty$6(node, 'parsed', parsed);
      defineProperty$6(node, 'prefix', m[1]);
      defineProperty$6(node, 'parent', prev);
      defineProperty$6(open, 'parent', node);

      if (typeof fn === 'function') {
        fn.call(this, open, node);
      }

      this.push(type, node);
      prev.nodes.push(node);
    });

    /**
     * Close
     */

    this.set(type + '.close', function() {
      var pos = this.position();
      var m = this.match(closeRegex);
      if (!m || !m[0]) return;

      var parent = this.pop(type);
      var node = pos({
        type: type + '.close',
        rest: this.input,
        suffix: m[1],
        val: m[0]
      });

      if (!this.isType(parent, type)) {
        if (this.options.strict) {
          throw new Error('missing opening "' + type + '"');
        }

        this.setCount--;
        node.escaped = true;
        return node;
      }

      if (node.suffix === '\\') {
        parent.escaped = true;
        node.escaped = true;
      }

      parent.nodes.push(node);
      defineProperty$6(node, 'parent', parent);
    });

    return this;
  },

  /**
   * Capture end-of-string
   */

  eos: function() {
    var pos = this.position();
    if (this.input) return;
    var prev = this.prev();

    while (prev.type !== 'root' && !prev.visited) {
      if (this.options.strict === true) {
        throw new SyntaxError('invalid syntax:' + util$3.inspect(prev, null, 2));
      }

      if (!hasDelims(prev)) {
        prev.parent.escaped = true;
        prev.escaped = true;
      }

      visit(prev, function(node) {
        if (!hasDelims(node.parent)) {
          node.parent.escaped = true;
          node.escaped = true;
        }
      });

      prev = prev.parent;
    }

    var tok = pos({
      type: 'eos',
      val: this.append || ''
    });

    defineProperty$6(tok, 'parent', this.ast);
    return tok;
  },

  /**
   * Run parsers to advance the cursor position
   */

  next: function() {
    var parsed = this.parsed;
    var len = this.types.length;
    var idx = -1;
    var tok;

    while (++idx < len) {
      if ((tok = this.parsers[this.types[idx]].call(this))) {
        defineProperty$6(tok, 'rest', this.input);
        defineProperty$6(tok, 'parsed', parsed);
        this.last = tok;
        return tok;
      }
    }
  },

  /**
   * Parse the given string.
   * @return {Array}
   */

  parse: function(input) {
    if (typeof input !== 'string') {
      throw new TypeError('expected a string');
    }

    this.init(this.options);
    this.orig = input;
    this.input = input;
    var self = this;

    function parse() {
      // check input before calling `.next()`
      input = self.input;

      // get the next AST ndoe
      var node = self.next();
      if (node) {
        var prev = self.prev();
        if (prev) {
          defineProperty$6(node, 'parent', prev);
          if (prev.nodes) {
            prev.nodes.push(node);
          }
        }

        if (self.sets.hasOwnProperty(prev.type)) {
          self.currentType = prev.type;
        }
      }

      // if we got here but input is not changed, throw an error
      if (self.input && input === self.input) {
        throw new Error('no parsers registered for: "' + self.input.slice(0, 5) + '"');
      }
    }

    while (this.input) parse();
    if (this.stack.length && this.options.strict) {
      var node = this.stack.pop();
      throw this.error('missing opening ' + node.type + ': "' + this.orig + '"');
    }

    var eos = this.eos();
    var tok = this.prev();
    if (tok.type !== 'eos') {
      this.ast.nodes.push(eos);
    }

    return this.ast;
  }
};

/**
 * Visit `node` with the given `fn`
 */

function visit(node, fn) {
  if (!node.visited) {
    defineProperty$6(node, 'visited', true);
    return node.nodes ? mapVisit$1(node.nodes, fn) : fn(node);
  }
  return node;
}

/**
 * Map visit over array of `nodes`.
 */

function mapVisit$1(nodes, fn) {
  var len = nodes.length;
  var idx = -1;
  while (++idx < len) {
    visit(nodes[idx], fn);
  }
}

function hasOpen(node) {
  return node.nodes && node.nodes[0].type === (node.type + '.open');
}

function hasClose(node) {
  return node.nodes && utils.last(node.nodes).type === (node.type + '.close');
}

function hasDelims(node) {
  return hasOpen(node) && hasClose(node);
}

/**
 * Expose `Parser`
 */

var parser = Parser;

/**
 * Create a new instance of `Snapdragon` with the given `options`.
 *
 * ```js
 * var snapdragon = new Snapdragon();
 * ```
 *
 * @param {Object} `options`
 * @api public
 */

function Snapdragon(options) {
  base.call(this, null, options);
  this.options = utils.extend({source: 'string'}, this.options);
  this.compiler = new compiler(this.options);
  this.parser = new parser(this.options);

  Object.defineProperty(this, 'compilers', {
    get: function() {
      return this.compiler.compilers;
    }
  });

  Object.defineProperty(this, 'parsers', {
    get: function() {
      return this.parser.parsers;
    }
  });

  Object.defineProperty(this, 'regex', {
    get: function() {
      return this.parser.regex;
    }
  });
}

/**
 * Inherit Base
 */

base.extend(Snapdragon);

/**
 * Add a parser to `snapdragon.parsers` for capturing the given `type` using
 * the specified regex or parser function. A function is useful if you need
 * to customize how the token is created and/or have access to the parser
 * instance to check options, etc.
 *
 * ```js
 * snapdragon
 *   .capture('slash', /^\//)
 *   .capture('dot', function() {
 *     var pos = this.position();
 *     var m = this.match(/^\./);
 *     if (!m) return;
 *     return pos({
 *       type: 'dot',
 *       val: m[0]
 *     });
 *   });
 * ```
 * @param {String} `type`
 * @param {RegExp|Function} `regex`
 * @return {Object} Returns the parser instance for chaining
 * @api public
 */

Snapdragon.prototype.capture = function() {
  return this.parser.capture.apply(this.parser, arguments);
};

/**
 * Register a plugin `fn`.
 *
 * ```js
 * var snapdragon = new Snapdgragon([options]);
 * snapdragon.use(function() {
 *   console.log(this);          //<= snapdragon instance
 *   console.log(this.parser);   //<= parser instance
 *   console.log(this.compiler); //<= compiler instance
 * });
 * ```
 * @param {Object} `fn`
 * @api public
 */

Snapdragon.prototype.use = function(fn) {
  fn.call(this, this);
  return this;
};

/**
 * Parse the given `str`.
 *
 * ```js
 * var snapdragon = new Snapdgragon([options]);
 * // register parsers
 * snapdragon.parser.use(function() {});
 *
 * // parse
 * var ast = snapdragon.parse('foo/bar');
 * console.log(ast);
 * ```
 * @param {String} `str`
 * @param {Object} `options` Set `options.sourcemap` to true to enable source maps.
 * @return {Object} Returns an AST.
 * @api public
 */

Snapdragon.prototype.parse = function(str, options) {
  this.options = utils.extend({}, this.options, options);
  var parsed = this.parser.parse(str, this.options);

  // add non-enumerable parser reference
  defineProperty$6(parsed, 'parser', this.parser);
  return parsed;
};

/**
 * Compile the given `AST`.
 *
 * ```js
 * var snapdragon = new Snapdgragon([options]);
 * // register plugins
 * snapdragon.use(function() {});
 * // register parser plugins
 * snapdragon.parser.use(function() {});
 * // register compiler plugins
 * snapdragon.compiler.use(function() {});
 *
 * // parse
 * var ast = snapdragon.parse('foo/bar');
 *
 * // compile
 * var res = snapdragon.compile(ast);
 * console.log(res.output);
 * ```
 * @param {Object} `ast`
 * @param {Object} `options`
 * @return {Object} Returns an object with an `output` property with the rendered string.
 * @api public
 */

Snapdragon.prototype.compile = function(ast, options) {
  this.options = utils.extend({}, this.options, options);
  var compiled = this.compiler.compile(ast, this.options);

  // add non-enumerable compiler reference
  defineProperty$6(compiled, 'compiler', this.compiler);
  return compiled;
};

/**
 * Expose `Snapdragon`
 */

var snapdragon = Snapdragon;

/**
 * Expose `Parser` and `Compiler`
 */

var Compiler_1 = compiler;
var Parser_1 = parser;
snapdragon.Compiler = Compiler_1;
snapdragon.Parser = Parser_1;

/**
 * Customize Snapdragon parser and renderer
 */

function Braces(options) {
  this.options = extendShallow$1({}, options);
}

/**
 * Initialize braces
 */

Braces.prototype.init = function(options) {
  if (this.isInitialized) return;
  this.isInitialized = true;
  var opts = utils_1.createOptions({}, this.options, options);
  this.snapdragon = this.options.snapdragon || new snapdragon(opts);
  this.compiler = this.snapdragon.compiler;
  this.parser = this.snapdragon.parser;

  compilers(this.snapdragon, opts);
  parsers(this.snapdragon, opts);

  /**
   * Call Snapdragon `.parse` method. When AST is returned, we check to
   * see if any unclosed braces are left on the stack and, if so, we iterate
   * over the stack and correct the AST so that compilers are called in the correct
   * order and unbalance braces are properly escaped.
   */

  utils_1.define(this.snapdragon, 'parse', function(pattern, options) {
    var parsed = snapdragon.prototype.parse.apply(this, arguments);
    this.parser.ast.input = pattern;

    var stack = this.parser.stack;
    while (stack.length) {
      addParent({type: 'brace.close', val: ''}, stack.pop());
    }

    function addParent(node, parent) {
      utils_1.define(node, 'parent', parent);
      parent.nodes.push(node);
    }

    // add non-enumerable parser reference
    utils_1.define(parsed, 'parser', this.parser);
    return parsed;
  });
};

/**
 * Decorate `.parse` method
 */

Braces.prototype.parse = function(ast, options) {
  if (ast && typeof ast === 'object' && ast.nodes) return ast;
  this.init(options);
  return this.snapdragon.parse(ast, options);
};

/**
 * Decorate `.compile` method
 */

Braces.prototype.compile = function(ast, options) {
  if (typeof ast === 'string') {
    ast = this.parse(ast, options);
  } else {
    this.init(options);
  }
  return this.snapdragon.compile(ast, options);
};

/**
 * Expand
 */

Braces.prototype.expand = function(pattern) {
  var ast = this.parse(pattern, {expand: true});
  return this.compile(ast, {expand: true});
};

/**
 * Optimize
 */

Braces.prototype.optimize = function(pattern) {
  var ast = this.parse(pattern, {optimize: true});
  return this.compile(ast, {optimize: true});
};

/**
 * Expose `Braces`
 */

var braces = Braces;

/**
 * Module dependencies
 */





/**
 * Local dependencies
 */





var MAX_LENGTH$1 = 1024 * 64;
var cache$3 = {};

/**
 * Convert the given `braces` pattern into a regex-compatible string. By default, only one string is generated for every input string. Set `options.expand` to true to return an array of patterns (similar to Bash or minimatch. Before using `options.expand`, it's recommended that you read the [performance notes](#performance)).
 *
 * ```js
 * var braces = require('braces');
 * console.log(braces('{a,b,c}'));
 * //=> ['(a|b|c)']
 *
 * console.log(braces('{a,b,c}', {expand: true}));
 * //=> ['a', 'b', 'c']
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {String}
 * @api public
 */

function braces$1(pattern, options) {
  var key = utils_1.createKey(String(pattern), options);
  var arr = [];

  var disabled = options && options.cache === false;
  if (!disabled && cache$3.hasOwnProperty(key)) {
    return cache$3[key];
  }

  if (Array.isArray(pattern)) {
    for (var i = 0; i < pattern.length; i++) {
      arr.push.apply(arr, braces$1.create(pattern[i], options));
    }
  } else {
    arr = braces$1.create(pattern, options);
  }

  if (options && options.nodupes === true) {
    arr = arrayUnique(arr);
  }

  if (!disabled) {
    cache$3[key] = arr;
  }
  return arr;
}

/**
 * Expands a brace pattern into an array. This method is called by the main [braces](#braces) function when `options.expand` is true. Before using this method it's recommended that you read the [performance notes](#performance)) and advantages of using [.optimize](#optimize) instead.
 *
 * ```js
 * var braces = require('braces');
 * console.log(braces.expand('a/{b,c}/d'));
 * //=> ['a/b/d', 'a/c/d'];
 * ```
 * @param {String} `pattern` Brace pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces$1.expand = function(pattern, options) {
  return braces$1.create(pattern, extendShallow$1({}, options, {expand: true}));
};

/**
 * Expands a brace pattern into a regex-compatible, optimized string. This method is called by the main [braces](#braces) function by default.
 *
 * ```js
 * var braces = require('braces');
 * console.log(braces.expand('a/{b,c}/d'));
 * //=> ['a/(b|c)/d']
 * ```
 * @param {String} `pattern` Brace pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces$1.optimize = function(pattern, options) {
  return braces$1.create(pattern, options);
};

/**
 * Processes a brace pattern and returns either an expanded array (if `options.expand` is true), a highly optimized regex-compatible string. This method is called by the main [braces](#braces) function.
 *
 * ```js
 * var braces = require('braces');
 * console.log(braces.create('user-{200..300}/project-{a,b,c}-{1..10}'))
 * //=> 'user-(20[0-9]|2[1-9][0-9]|300)/project-(a|b|c)-([1-9]|10)'
 * ```
 * @param {String} `pattern` Brace pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces$1.create = function(pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('expected a string');
  }

  var maxLength = (options && options.maxLength) || MAX_LENGTH$1;
  if (pattern.length >= maxLength) {
    throw new Error('expected pattern to be less than ' + maxLength + ' characters');
  }

  function create() {
    if (pattern === '' || pattern.length < 3) {
      return [pattern];
    }

    if (utils_1.isEmptySets(pattern)) {
      return [];
    }

    if (utils_1.isQuotedString(pattern)) {
      return [pattern.slice(1, -1)];
    }

    var proto = new braces(options);
    var result = !options || options.expand !== true
      ? proto.optimize(pattern, options)
      : proto.expand(pattern, options);

    // get the generated pattern(s)
    var arr = result.output;

    // filter out empty strings if specified
    if (options && options.noempty === true) {
      arr = arr.filter(Boolean);
    }

    // filter out duplicates if specified
    if (options && options.nodupes === true) {
      arr = arrayUnique(arr);
    }

    Object.defineProperty(arr, 'result', {
      enumerable: false,
      value: result
    });

    return arr;
  }

  return memoize$1('create', pattern, options, create);
};

/**
 * Create a regular expression from the given string `pattern`.
 *
 * ```js
 * var braces = require('braces');
 *
 * console.log(braces.makeRe('id-{200..300}'));
 * //=> /^(?:id-(20[0-9]|2[1-9][0-9]|300))$/
 * ```
 * @param {String} `pattern` The pattern to convert to regex.
 * @param {Object} `options`
 * @return {RegExp}
 * @api public
 */

braces$1.makeRe = function(pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('expected a string');
  }

  var maxLength = (options && options.maxLength) || MAX_LENGTH$1;
  if (pattern.length >= maxLength) {
    throw new Error('expected pattern to be less than ' + maxLength + ' characters');
  }

  function makeRe() {
    var arr = braces$1(pattern, options);
    var opts = extendShallow$1({strictErrors: false}, options);
    return toRegex$1(arr, opts);
  }

  return memoize$1('makeRe', pattern, options, makeRe);
};

/**
 * Parse the given `str` with the given `options`.
 *
 * ```js
 * var braces = require('braces');
 * var ast = braces.parse('a/{b,c}/d');
 * console.log(ast);
 * // { type: 'root',
 * //   errors: [],
 * //   input: 'a/{b,c}/d',
 * //   nodes:
 * //    [ { type: 'bos', val: '' },
 * //      { type: 'text', val: 'a/' },
 * //      { type: 'brace',
 * //        nodes:
 * //         [ { type: 'brace.open', val: '{' },
 * //           { type: 'text', val: 'b,c' },
 * //           { type: 'brace.close', val: '}' } ] },
 * //      { type: 'text', val: '/d' },
 * //      { type: 'eos', val: '' } ] }
 * ```
 * @param {String} `pattern` Brace pattern to parse
 * @param {Object} `options`
 * @return {Object} Returns an AST
 * @api public
 */

braces$1.parse = function(pattern, options) {
  var proto = new braces(options);
  return proto.parse(pattern, options);
};

/**
 * Compile the given `ast` or string with the given `options`.
 *
 * ```js
 * var braces = require('braces');
 * var ast = braces.parse('a/{b,c}/d');
 * console.log(braces.compile(ast));
 * // { options: { source: 'string' },
 * //   state: {},
 * //   compilers:
 * //    { eos: [Function],
 * //      noop: [Function],
 * //      bos: [Function],
 * //      brace: [Function],
 * //      'brace.open': [Function],
 * //      text: [Function],
 * //      'brace.close': [Function] },
 * //   output: [ 'a/(b|c)/d' ],
 * //   ast:
 * //    { ... },
 * //   parsingErrors: [] }
 * ```
 * @param {Object|String} `ast` AST from [.parse](#parse). If a string is passed it will be parsed first.
 * @param {Object} `options`
 * @return {Object} Returns an object that has an `output` property with the compiled string.
 * @api public
 */

braces$1.compile = function(ast, options) {
  var proto = new braces(options);
  return proto.compile(ast, options);
};

/**
 * Clear the regex cache.
 *
 * ```js
 * braces.clearCache();
 * ```
 * @api public
 */

braces$1.clearCache = function() {
  cache$3 = braces$1.cache = {};
};

/**
 * Memoize a generated regex or function. A unique key is generated
 * from the method name, pattern, and user-defined options. Set
 * options.memoize to false to disable.
 */

function memoize$1(type, pattern, options, fn) {
  var key = utils_1.createKey(type + ':' + pattern, options);
  var disabled = options && options.cache === false;
  if (disabled) {
    braces$1.clearCache();
    return fn(pattern, options);
  }

  if (cache$3.hasOwnProperty(key)) {
    return cache$3[key];
  }

  var res = fn(pattern, options);
  cache$3[key] = res;
  return res;
}

/**
 * Expose `Braces` constructor and methods
 * @type {Function}
 */

braces$1.Braces = braces;
braces$1.compilers = compilers;
braces$1.parsers = parsers;
braces$1.cache = cache$3;

/**
 * Expose `braces`
 * @type {Function}
 */

var braces_1 = braces$1;

/**
* Nanomatch compilers
*/

var compilers$1 = function(nanomatch, options) {
  function slash() {
    if (options && typeof options.slash === 'string') {
      return options.slash;
    }
    if (options && typeof options.slash === 'function') {
      return options.slash.call(nanomatch);
    }
    return '\\\\/';
  }

  function star() {
    if (options && typeof options.star === 'string') {
      return options.star;
    }
    if (options && typeof options.star === 'function') {
      return options.star.call(nanomatch);
    }
    return '[^' + slash() + ']*?';
  }

  var ast = nanomatch.ast = nanomatch.parser.ast;
  ast.state = nanomatch.parser.state;
  nanomatch.compiler.state = ast.state;
  nanomatch.compiler

    /**
     * Negation / escaping
     */

    .set('not', function(node) {
      var prev = this.prev();
      if (this.options.nonegate === true || prev.type !== 'bos') {
        return this.emit('\\' + node.val, node);
      }
      return this.emit(node.val, node);
    })
    .set('escape', function(node) {
      if (this.options.unescape && /^[-\w_.]/.test(node.val)) {
        return this.emit(node.val, node);
      }
      return this.emit('\\' + node.val, node);
    })
    .set('quoted', function(node) {
      return this.emit(node.val, node);
    })

    /**
     * Regex
     */

    .set('dollar', function(node) {
      if (node.parent.type === 'bracket') {
        return this.emit(node.val, node);
      }
      return this.emit('\\' + node.val, node);
    })

    /**
     * Dot: "."
     */

    .set('dot', function(node) {
      if (node.dotfiles === true) this.dotfiles = true;
      return this.emit('\\' + node.val, node);
    })

    /**
     * Slashes: "/" and "\"
     */

    .set('backslash', function(node) {
      return this.emit(node.val, node);
    })
    .set('slash', function(node, nodes, i) {
      var val = '[' + slash() + ']';
      var parent = node.parent;
      var prev = this.prev();

      // set "node.hasSlash" to true on all ancestor parens nodes
      while (parent.type === 'paren' && !parent.hasSlash) {
        parent.hasSlash = true;
        parent = parent.parent;
      }

      if (prev.addQmark) {
        val += '?';
      }

      // word boundary
      if (node.rest.slice(0, 2) === '\\b') {
        return this.emit(val, node);
      }

      // globstars
      if (node.parsed === '**' || node.parsed === './**') {
        this.output = '(?:' + this.output;
        return this.emit(val + ')?', node);
      }

      // negation
      if (node.parsed === '!**' && this.options.nonegate !== true) {
        return this.emit(val + '?\\b', node);
      }
      return this.emit(val, node);
    })

    /**
     * Square brackets
     */

    .set('bracket', function(node) {
      var close = node.close;
      var open = !node.escaped ? '[' : '\\[';
      var negated = node.negated;
      var inner = node.inner;
      var val = node.val;

      if (node.escaped === true) {
        inner = inner.replace(/\\?(\W)/g, '\\$1');
        negated = '';
      }

      if (inner === ']-') {
        inner = '\\]\\-';
      }

      if (negated && inner.indexOf('.') === -1) {
        inner += '.';
      }
      if (negated && inner.indexOf('/') === -1) {
        inner += '/';
      }

      val = open + negated + inner + close;
      return this.emit(val, node);
    })

    /**
     * Square: "[.]" (only matches a single character in brackets)
     */

    .set('square', function(node) {
      var val = (/^\W/.test(node.val) ? '\\' : '') + node.val;
      return this.emit(val, node);
    })

    /**
     * Question mark: "?"
     */

    .set('qmark', function(node) {
      var prev = this.prev();
      // don't use "slash" variable so that we always avoid
      // matching backslashes and slashes with a qmark
      var val = '[^.\\\\/]';
      if (this.options.dot || (prev.type !== 'bos' && prev.type !== 'slash')) {
        val = '[^\\\\/]';
      }

      if (node.parsed.slice(-1) === '(') {
        var ch = node.rest.charAt(0);
        if (ch === '!' || ch === '=' || ch === ':') {
          return this.emit(node.val, node);
        }
      }

      if (node.val.length > 1) {
        val += '{' + node.val.length + '}';
      }
      return this.emit(val, node);
    })

    /**
     * Plus
     */

    .set('plus', function(node) {
      var prev = node.parsed.slice(-1);
      if (prev === ']' || prev === ')') {
        return this.emit(node.val, node);
      }
      if (!this.output || (/[?*+]/.test(ch) && node.parent.type !== 'bracket')) {
        return this.emit('\\+', node);
      }
      var ch = this.output.slice(-1);
      if (/\w/.test(ch) && !node.inside) {
        return this.emit('+\\+?', node);
      }
      return this.emit('+', node);
    })

    /**
     * globstar: '**'
     */

    .set('globstar', function(node, nodes, i) {
      if (!this.output) {
        this.state.leadingGlobstar = true;
      }

      var prev = this.prev();
      var before = this.prev(2);
      var next = this.next();
      var after = this.next(2);
      var type = prev.type;
      var val = node.val;

      if (prev.type === 'slash' && next.type === 'slash') {
        if (before.type === 'text') {
          this.output += '?';

          if (after.type !== 'text') {
            this.output += '\\b';
          }
        }
      }

      var parsed = node.parsed;
      if (parsed.charAt(0) === '!') {
        parsed = parsed.slice(1);
      }

      var isInside = node.isInside.paren || node.isInside.brace;
      if (parsed && type !== 'slash' && type !== 'bos' && !isInside) {
        val = star();
      } else {
        val = this.options.dot !== true
          ? '(?:(?!(?:[' + slash() + ']|^)\\.).)*?'
          : '(?:(?!(?:[' + slash() + ']|^)(?:\\.{1,2})($|[' + slash() + ']))(?!\\.{2}).)*?';
      }

      if ((type === 'slash' || type === 'bos') && this.options.dot !== true) {
        val = '(?!\\.)' + val;
      }

      if (prev.type === 'slash' && next.type === 'slash' && before.type !== 'text') {
        if (after.type === 'text' || after.type === 'star') {
          node.addQmark = true;
        }
      }

      if (this.options.capture) {
        val = '(' + val + ')';
      }

      return this.emit(val, node);
    })

    /**
     * Star: "*"
     */

    .set('star', function(node, nodes, i) {
      var prior = nodes[i - 2] || {};
      var prev = this.prev();
      var next = this.next();
      var type = prev.type;

      function isStart(n) {
        return n.type === 'bos' || n.type === 'slash';
      }

      if (this.output === '' && this.options.contains !== true) {
        this.output = '(?![' + slash() + '])';
      }

      if (type === 'bracket' && this.options.bash === false) {
        var str = next && next.type === 'bracket' ? star() : '*?';
        if (!prev.nodes || prev.nodes[1].type !== 'posix') {
          return this.emit(str, node);
        }
      }

      var prefix = !this.dotfiles && type !== 'text' && type !== 'escape'
        ? (this.options.dot ? '(?!(?:^|[' + slash() + '])\\.{1,2}(?:$|[' + slash() + ']))' : '(?!\\.)')
        : '';

      if (isStart(prev) || (isStart(prior) && type === 'not')) {
        if (prefix !== '(?!\\.)') {
          prefix += '(?!(\\.{2}|\\.[' + slash() + ']))(?=.)';
        } else {
          prefix += '(?=.)';
        }
      } else if (prefix === '(?!\\.)') {
        prefix = '';
      }

      if (prev.type === 'not' && prior.type === 'bos' && this.options.dot === true) {
        this.output = '(?!\\.)' + this.output;
      }

      var output = prefix + star();
      if (this.options.capture) {
        output = '(' + output + ')';
      }

      return this.emit(output, node);
    })

    /**
     * Text
     */

    .set('text', function(node) {
      return this.emit(node.val, node);
    })

    /**
     * End-of-string
     */

    .set('eos', function(node) {
      var prev = this.prev();
      var val = node.val;

      this.output = '(?:\\.[' + slash() + '](?=.))?' + this.output;
      if (this.state.metachar && prev.type !== 'qmark' && prev.type !== 'slash') {
        val += (this.options.contains ? '[' + slash() + ']?' : '(?:[' + slash() + ']|$)');
      }

      return this.emit(val, node);
    });

  /**
   * Allow custom compilers to be passed on options
   */

  if (options && typeof options.compilers === 'function') {
    options.compilers(nanomatch.compiler);
  }
};

/**
 * Characters to use in negation regex (we want to "not" match
 * characters that are matched by other parsers)
 */

var cached;
var NOT_REGEX = '[\\[!*+?$^"\'.\\\\/]+';
var not = createTextRegex(NOT_REGEX);

/**
 * Nanomatch parsers
 */

var parsers$1 = function(nanomatch, options) {
  var parser = nanomatch.parser;
  var opts = parser.options;

  parser.state = {
    slashes: 0,
    paths: []
  };

  parser.ast.state = parser.state;
  parser

    /**
     * Beginning-of-string
     */

    .capture('prefix', function() {
      if (this.parsed) return;
      var m = this.match(/^\.[\\/]/);
      if (!m) return;
      this.state.strictOpen = !!this.options.strictOpen;
      this.state.addPrefix = true;
    })

    /**
     * Escape: "\\."
     */

    .capture('escape', function() {
      if (this.isInside('bracket')) return;
      var pos = this.position();
      var m = this.match(/^(?:\\(.)|([$^]))/);
      if (!m) return;

      return pos({
        type: 'escape',
        val: m[2] || m[1]
      });
    })

    /**
     * Quoted strings
     */

    .capture('quoted', function() {
      var pos = this.position();
      var m = this.match(/^["']/);
      if (!m) return;

      var quote = m[0];
      if (this.input.indexOf(quote) === -1) {
        return pos({
          type: 'escape',
          val: quote
        });
      }

      var tok = advanceTo(this.input, quote);
      this.consume(tok.len);

      return pos({
        type: 'quoted',
        val: tok.esc
      });
    })

    /**
     * Negations: "!"
     */

    .capture('not', function() {
      var parsed = this.parsed;
      var pos = this.position();
      var m = this.match(this.notRegex || /^!+/);
      if (!m) return;
      var val = m[0];

      var isNegated = (val.length % 2) === 1;
      if (parsed === '' && !isNegated) {
        val = '';
      }

      // if nothing has been parsed, we know `!` is at the start,
      // so we need to wrap the result in a negation regex
      if (parsed === '' && isNegated && this.options.nonegate !== true) {
        this.bos.val = '(?!^(?:';
        this.append = ')$).*';
        val = '';
      }
      return pos({
        type: 'not',
        val: val
      });
    })

    /**
     * Dot: "."
     */

    .capture('dot', function() {
      var parsed = this.parsed;
      var pos = this.position();
      var m = this.match(/^\.+/);
      if (!m) return;

      var val = m[0];
      this.state.dot = val === '.' && (parsed === '' || parsed.slice(-1) === '/');

      return pos({
        type: 'dot',
        dotfiles: this.state.dot,
        val: val
      });
    })

    /**
     * Plus: "+"
     */

    .capture('plus', /^\+(?!\()/)

    /**
     * Question mark: "?"
     */

    .capture('qmark', function() {
      var parsed = this.parsed;
      var pos = this.position();
      var m = this.match(/^\?+(?!\()/);
      if (!m) return;

      this.state.metachar = true;
      this.state.qmark = true;

      return pos({
        type: 'qmark',
        parsed: parsed,
        val: m[0]
      });
    })

    /**
     * Globstar: "**"
     */

    .capture('globstar', function() {
      var parsed = this.parsed;
      var pos = this.position();
      var m = this.match(/^\*{2}(?![*(])(?=[,)/]|$)/);
      if (!m) return;

      var type = opts.noglobstar !== true ? 'globstar' : 'star';
      var node = pos({type: type, parsed: parsed});
      this.state.metachar = true;

      while (this.input.slice(0, 4) === '/**/') {
        this.input = this.input.slice(3);
      }

      node.isInside = {
        brace: this.isInside('brace'),
        paren: this.isInside('paren')
      };

      if (type === 'globstar') {
        this.state.globstar = true;
        node.val = '**';

      } else {
        this.state.star = true;
        node.val = '*';
      }

      return node;
    })

    /**
     * Star: "*"
     */

    .capture('star', function() {
      var pos = this.position();
      var starRe = /^(?:\*(?![*(])|[*]{3,}(?!\()|[*]{2}(?![(/]|$)|\*(?=\*\())/;
      var m = this.match(starRe);
      if (!m) return;

      this.state.metachar = true;
      this.state.star = true;
      return pos({
        type: 'star',
        val: m[0]
      });
    })

    /**
     * Slash: "/"
     */

    .capture('slash', function() {
      var pos = this.position();
      var m = this.match(/^\//);
      if (!m) return;

      this.state.slashes++;
      return pos({
        type: 'slash',
        val: m[0]
      });
    })

    /**
     * Backslash: "\\"
     */

    .capture('backslash', function() {
      var pos = this.position();
      var m = this.match(/^\\(?![*+?(){}[\]'"])/);
      if (!m) return;

      var val = m[0];

      if (this.isInside('bracket')) {
        val = '\\';
      } else if (val.length > 1) {
        val = '\\\\';
      }

      return pos({
        type: 'backslash',
        val: val
      });
    })

    /**
     * Square: "[.]"
     */

    .capture('square', function() {
      if (this.isInside('bracket')) return;
      var pos = this.position();
      var m = this.match(/^\[([^!^\\])\]/);
      if (!m) return;

      return pos({
        type: 'square',
        val: m[1]
      });
    })

    /**
     * Brackets: "[...]" (basic, this can be overridden by other parsers)
     */

    .capture('bracket', function() {
      var pos = this.position();
      var m = this.match(/^(?:\[([!^]?)([^\]]+|\]-)(\]|[^*+?]+)|\[)/);
      if (!m) return;

      var val = m[0];
      var negated = m[1] ? '^' : '';
      var inner = (m[2] || '').replace(/\\\\+/, '\\\\');
      var close = m[3] || '';

      if (m[2] && inner.length < m[2].length) {
        val = val.replace(/\\\\+/, '\\\\');
      }

      var esc = this.input.slice(0, 2);
      if (inner === '' && esc === '\\]') {
        inner += esc;
        this.consume(2);

        var str = this.input;
        var idx = -1;
        var ch;

        while ((ch = str[++idx])) {
          this.consume(1);
          if (ch === ']') {
            close = ch;
            break;
          }
          inner += ch;
        }
      }

      return pos({
        type: 'bracket',
        val: val,
        escaped: close !== ']',
        negated: negated,
        inner: inner,
        close: close
      });
    })

    /**
     * Text
     */

    .capture('text', function() {
      if (this.isInside('bracket')) return;
      var pos = this.position();
      var m = this.match(not);
      if (!m || !m[0]) return;

      return pos({
        type: 'text',
        val: m[0]
      });
    });

  /**
   * Allow custom parsers to be passed on options
   */

  if (options && typeof options.parsers === 'function') {
    options.parsers(nanomatch.parser);
  }
};

/**
 * Advance to the next non-escaped character
 */

function advanceTo(input, endChar) {
  var ch = input.charAt(0);
  var tok = { len: 1, val: '', esc: '' };
  var idx = 0;

  function advance() {
    if (ch !== '\\') {
      tok.esc += '\\' + ch;
      tok.val += ch;
    }

    ch = input.charAt(++idx);
    tok.len++;

    if (ch === '\\') {
      advance();
      advance();
    }
  }

  while (ch && ch !== endChar) {
    advance();
  }
  return tok;
}

/**
 * Create text regex
 */

function createTextRegex(pattern) {
  if (cached) return cached;
  var opts = {contains: true, strictClose: false};
  var not = regexNot.create(pattern, opts);
  var re = toRegex$1('^(?:[*]\\((?=.)|' + not + ')', opts);
  return (cached = re);
}

/**
 * Expose negation string
 */

var not_1 = NOT_REGEX;
parsers$1.not = not_1;

var fragmentCache = createCommonjsModule(function (module, exports) {



/**
 * Create a new `FragmentCache` with an optional object to use for `caches`.
 *
 * ```js
 * var fragment = new FragmentCache();
 * ```
 * @name FragmentCache
 * @param {String} `cacheName`
 * @return {Object} Returns the [map-cache][] instance.
 * @api public
 */

function FragmentCache(caches) {
  this.caches = caches || {};
}

/**
 * Prototype
 */

FragmentCache.prototype = {

  /**
   * Get cache `name` from the `fragment.caches` object. Creates a new
   * `MapCache` if it doesn't already exist.
   *
   * ```js
   * var cache = fragment.cache('files');
   * console.log(fragment.caches.hasOwnProperty('files'));
   * //=> true
   * ```
   * @name .cache
   * @param {String} `cacheName`
   * @return {Object} Returns the [map-cache][] instance.
   * @api public
   */

  cache: function(cacheName) {
    return this.caches[cacheName] || (this.caches[cacheName] = new mapCache());
  },

  /**
   * Set a value for property `key` on cache `name`
   *
   * ```js
   * fragment.set('files', 'somefile.js', new File({path: 'somefile.js'}));
   * ```
   * @name .set
   * @param {String} `name`
   * @param {String} `key` Property name to set
   * @param {any} `val` The value of `key`
   * @return {Object} The cache instance for chaining
   * @api public
   */

  set: function(cacheName, key, val) {
    var cache = this.cache(cacheName);
    cache.set(key, val);
    return cache;
  },

  /**
   * Returns true if a non-undefined value is set for `key` on fragment cache `name`.
   *
   * ```js
   * var cache = fragment.cache('files');
   * cache.set('somefile.js');
   *
   * console.log(cache.has('somefile.js'));
   * //=> true
   *
   * console.log(cache.has('some-other-file.js'));
   * //=> false
   * ```
   * @name .has
   * @param {String} `name` Cache name
   * @param {String} `key` Optionally specify a property to check for on cache `name`
   * @return {Boolean}
   * @api public
   */

  has: function(cacheName, key) {
    return typeof this.get(cacheName, key) !== 'undefined';
  },

  /**
   * Get `name`, or if specified, the value of `key`. Invokes the [cache]() method,
   * so that cache `name` will be created it doesn't already exist. If `key` is not passed,
   * the entire cache (`name`) is returned.
   *
   * ```js
   * var Vinyl = require('vinyl');
   * var cache = fragment.cache('files');
   * cache.set('somefile.js', new Vinyl({path: 'somefile.js'}));
   * console.log(cache.get('somefile.js'));
   * //=> <File "somefile.js">
   * ```
   * @name .get
   * @param {String} `name`
   * @return {Object} Returns cache `name`, or the value of `key` if specified
   * @api public
   */

  get: function(name, key) {
    var cache = this.cache(name);
    if (typeof key === 'string') {
      return cache.get(key);
    }
    return cache;
  }
};

/**
 * Expose `FragmentCache`
 */

exports = module.exports = FragmentCache;
});

var cache$4 = new (fragmentCache)();

var isWindows = createCommonjsModule(function (module, exports) {
/*!
 * is-windows <https://github.com/jonschlinkert/is-windows>
 *
 * Copyright © 2015-2018, Jon Schlinkert.
 * Released under the MIT License.
 */

(function(factory) {
  if (exports && 'object' === 'object' && 'object' !== 'undefined') {
    module.exports = factory();
  } else if (typeof window !== 'undefined') {
    window.isWindows = factory();
  } else if (typeof commonjsGlobal !== 'undefined') {
    commonjsGlobal.isWindows = factory();
  } else if (typeof self !== 'undefined') {
    self.isWindows = factory();
  } else {
    this.isWindows = factory();
  }
})(function() {
  return function isWindows() {
    return process && (process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE));
  };
});
});

/*!
 * arr-diff <https://github.com/jonschlinkert/arr-diff>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var arrDiff = function diff(arr/*, arrays*/) {
  var len = arguments.length;
  var idx = 0;
  while (++idx < len) {
    arr = diffArray(arr, arguments[idx]);
  }
  return arr;
};

function diffArray(one, two) {
  if (!Array.isArray(two)) {
    return one.slice();
  }

  var tlen = two.length;
  var olen = one.length;
  var idx = -1;
  var arr = [];

  while (++idx < olen) {
    var ele = one[idx];

    var hasEle = false;
    for (var i = 0; i < tlen; i++) {
      var val = two[i];

      if (ele === val) {
        hasEle = true;
        break;
      }
    }

    if (hasEle === false) {
      arr.push(ele);
    }
  }
  return arr;
}

var object_pick = function pick(obj, keys) {
  if (!isobject(obj) && typeof obj !== 'function') {
    return {};
  }

  var res = {};
  if (typeof keys === 'string') {
    if (keys in obj) {
      res[keys] = obj[keys];
    }
    return res;
  }

  var len = keys.length;
  var idx = -1;

  while (++idx < len) {
    var key = keys[idx];
    if (key in obj) {
      res[key] = obj[key];
    }
  }
  return res;
};

var utils_1$1 = createCommonjsModule(function (module) {

var utils = module.exports;


/**
 * Module dependencies
 */

var isWindows$1 = isWindows();

utils.define = defineProperty;
utils.diff = arrDiff;
utils.extend = extendShallow;
utils.pick = object_pick;
utils.typeOf = kindOf;
utils.unique = arrayUnique;

/**
 * Returns true if the given value is effectively an empty string
 */

utils.isEmptyString = function(val) {
  return String(val) === '' || String(val) === './';
};

/**
 * Returns true if the platform is windows, or `path.sep` is `\\`.
 * This is defined as a function to allow `path.sep` to be set in unit tests,
 * or by the user, if there is a reason to do so.
 * @return {Boolean}
 */

utils.isWindows = function() {
  return path$1__default.sep === '\\' || isWindows$1 === true;
};

/**
 * Return the last element from an array
 */

utils.last = function(arr, n) {
  return arr[arr.length - (n || 1)];
};

/**
 * Get the `Snapdragon` instance to use
 */

utils.instantiate = function(ast, options) {
  var snapdragon$1;
  // if an instance was created by `.parse`, use that instance
  if (utils.typeOf(ast) === 'object' && ast.snapdragon) {
    snapdragon$1 = ast.snapdragon;
  // if the user supplies an instance on options, use that instance
  } else if (utils.typeOf(options) === 'object' && options.snapdragon) {
    snapdragon$1 = options.snapdragon;
  // create a new instance
  } else {
    snapdragon$1 = new snapdragon(options);
  }

  utils.define(snapdragon$1, 'parse', function(str, options) {
    var parsed = snapdragon.prototype.parse.call(this, str, options);
    parsed.input = str;

    // escape unmatched brace/bracket/parens
    var last = this.parser.stack.pop();
    if (last && this.options.strictErrors !== true) {
      var open = last.nodes[0];
      var inner = last.nodes[1];
      if (last.type === 'bracket') {
        if (inner.val.charAt(0) === '[') {
          inner.val = '\\' + inner.val;
        }

      } else {
        open.val = '\\' + open.val;
        var sibling = open.parent.nodes[1];
        if (sibling.type === 'star') {
          sibling.loose = true;
        }
      }
    }

    // add non-enumerable parser reference
    utils.define(parsed, 'parser', this.parser);
    return parsed;
  });

  return snapdragon$1;
};

/**
 * Create the key to use for memoization. The key is generated
 * by iterating over the options and concatenating key-value pairs
 * to the pattern string.
 */

utils.createKey = function(pattern, options) {
  if (typeof options === 'undefined') {
    return pattern;
  }
  var key = pattern;
  for (var prop in options) {
    if (options.hasOwnProperty(prop)) {
      key += ';' + prop + '=' + String(options[prop]);
    }
  }
  return key;
};

/**
 * Cast `val` to an array
 * @return {Array}
 */

utils.arrayify = function(val) {
  if (typeof val === 'string') return [val];
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Return true if `val` is a non-empty string
 */

utils.isString = function(val) {
  return typeof val === 'string';
};

/**
 * Return true if `val` is a non-empty string
 */

utils.isRegex = function(val) {
  return utils.typeOf(val) === 'regexp';
};

/**
 * Return true if `val` is a non-empty string
 */

utils.isObject = function(val) {
  return utils.typeOf(val) === 'object';
};

/**
 * Escape regex characters in the given string
 */

utils.escapeRegex = function(str) {
  return str.replace(/[-[\]{}()^$|*+?.\\/\s]/g, '\\$&');
};

/**
 * Combines duplicate characters in the provided `input` string.
 * @param {String} `input`
 * @returns {String}
 */

utils.combineDupes = function(input, patterns) {
  patterns = utils.arrayify(patterns).join('|').split('|');
  patterns = patterns.map(function(s) {
    return s.replace(/\\?([+*\\/])/g, '\\$1');
  });
  var substr = patterns.join('|');
  var regex = new RegExp('(' + substr + ')(?=\\1)', 'g');
  return input.replace(regex, '');
};

/**
 * Returns true if the given `str` has special characters
 */

utils.hasSpecialChars = function(str) {
  return /(?:(?:(^|\/)[!.])|[*?+()|[\]{}]|[+@]\()/.test(str);
};

/**
 * Normalize slashes in the given filepath.
 *
 * @param {String} `filepath`
 * @return {String}
 */

utils.toPosixPath = function(str) {
  return str.replace(/\\+/g, '/');
};

/**
 * Strip backslashes before special characters in a string.
 *
 * @param {String} `str`
 * @return {String}
 */

utils.unescape = function(str) {
  return utils.toPosixPath(str.replace(/\\(?=[*+?!.])/g, ''));
};

/**
 * Strip the drive letter from a windows filepath
 * @param {String} `fp`
 * @return {String}
 */

utils.stripDrive = function(fp) {
  return utils.isWindows() ? fp.replace(/^[a-z]:[\\/]+?/i, '/') : fp;
};

/**
 * Strip the prefix from a filepath
 * @param {String} `fp`
 * @return {String}
 */

utils.stripPrefix = function(str) {
  if (str.charAt(0) === '.' && (str.charAt(1) === '/' || str.charAt(1) === '\\')) {
    return str.slice(2);
  }
  return str;
};

/**
 * Returns true if `str` is a common character that doesn't need
 * to be processed to be used for matching.
 * @param {String} `str`
 * @return {Boolean}
 */

utils.isSimpleChar = function(str) {
  return str.trim() === '' || str === '.';
};

/**
 * Returns true if the given str is an escaped or
 * unescaped path character
 */

utils.isSlash = function(str) {
  return str === '/' || str === '\\/' || str === '\\' || str === '\\\\';
};

/**
 * Returns a function that returns true if the given
 * pattern matches or contains a `filepath`
 *
 * @param {String} `pattern`
 * @return {Function}
 */

utils.matchPath = function(pattern, options) {
  return (options && options.contains)
    ? utils.containsPattern(pattern, options)
    : utils.equalsPattern(pattern, options);
};

/**
 * Returns true if the given (original) filepath or unixified path are equal
 * to the given pattern.
 */

utils._equals = function(filepath, unixPath, pattern) {
  return pattern === filepath || pattern === unixPath;
};

/**
 * Returns true if the given (original) filepath or unixified path contain
 * the given pattern.
 */

utils._contains = function(filepath, unixPath, pattern) {
  return filepath.indexOf(pattern) !== -1 || unixPath.indexOf(pattern) !== -1;
};

/**
 * Returns a function that returns true if the given
 * pattern is the same as a given `filepath`
 *
 * @param {String} `pattern`
 * @return {Function}
 */

utils.equalsPattern = function(pattern, options) {
  var unixify = utils.unixify(options);
  options = options || {};

  return function fn(filepath) {
    var equal = utils._equals(filepath, unixify(filepath), pattern);
    if (equal === true || options.nocase !== true) {
      return equal;
    }
    var lower = filepath.toLowerCase();
    return utils._equals(lower, unixify(lower), pattern);
  };
};

/**
 * Returns a function that returns true if the given
 * pattern contains a `filepath`
 *
 * @param {String} `pattern`
 * @return {Function}
 */

utils.containsPattern = function(pattern, options) {
  var unixify = utils.unixify(options);
  options = options || {};

  return function(filepath) {
    var contains = utils._contains(filepath, unixify(filepath), pattern);
    if (contains === true || options.nocase !== true) {
      return contains;
    }
    var lower = filepath.toLowerCase();
    return utils._contains(lower, unixify(lower), pattern);
  };
};

/**
 * Returns a function that returns true if the given
 * regex matches the `filename` of a file path.
 *
 * @param {RegExp} `re` Matching regex
 * @return {Function}
 */

utils.matchBasename = function(re) {
  return function(filepath) {
    return re.test(filepath) || re.test(path$1__default.basename(filepath));
  };
};

/**
 * Returns the given value unchanced.
 * @return {any}
 */

utils.identity = function(val) {
  return val;
};

/**
 * Determines the filepath to return based on the provided options.
 * @return {any}
 */

utils.value = function(str, unixify, options) {
  if (options && options.unixify === false) {
    return str;
  }
  if (options && typeof options.unixify === 'function') {
    return options.unixify(str);
  }
  return unixify(str);
};

/**
 * Returns a function that normalizes slashes in a string to forward
 * slashes, strips `./` from beginning of paths, and optionally unescapes
 * special characters.
 * @return {Function}
 */

utils.unixify = function(options) {
  var opts = options || {};
  return function(filepath) {
    if (opts.stripPrefix !== false) {
      filepath = utils.stripPrefix(filepath);
    }
    if (opts.unescape === true) {
      filepath = utils.unescape(filepath);
    }
    if (opts.unixify === true || utils.isWindows()) {
      filepath = utils.toPosixPath(filepath);
    }
    return filepath;
  };
};
});

/**
 * Module dependencies
 */





/**
 * Local dependencies
 */





var MAX_LENGTH$2 = 1024 * 64;

/**
 * The main function takes a list of strings and one or more
 * glob patterns to use for matching.
 *
 * ```js
 * var nm = require('nanomatch');
 * nm(list, patterns[, options]);
 *
 * console.log(nm(['a.js', 'a.txt'], ['*.js']));
 * //=> [ 'a.js' ]
 * ```
 * @param {Array} `list` A list of strings to match
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Array} Returns an array of matches
 * @summary false
 * @api public
 */

function nanomatch(list, patterns, options) {
  patterns = utils_1$1.arrayify(patterns);
  list = utils_1$1.arrayify(list);

  var len = patterns.length;
  if (list.length === 0 || len === 0) {
    return [];
  }

  if (len === 1) {
    return nanomatch.match(list, patterns[0], options);
  }

  var negated = false;
  var omit = [];
  var keep = [];
  var idx = -1;

  while (++idx < len) {
    var pattern = patterns[idx];

    if (typeof pattern === 'string' && pattern.charCodeAt(0) === 33 /* ! */) {
      omit.push.apply(omit, nanomatch.match(list, pattern.slice(1), options));
      negated = true;
    } else {
      keep.push.apply(keep, nanomatch.match(list, pattern, options));
    }
  }

  // minimatch.match parity
  if (negated && keep.length === 0) {
    if (options && options.unixify === false) {
      keep = list.slice();
    } else {
      var unixify = utils_1$1.unixify(options);
      for (var i = 0; i < list.length; i++) {
        keep.push(unixify(list[i]));
      }
    }
  }

  var matches = utils_1$1.diff(keep, omit);
  if (!options || options.nodupes !== false) {
    return utils_1$1.unique(matches);
  }

  return matches;
}

/**
 * Similar to the main function, but `pattern` must be a string.
 *
 * ```js
 * var nm = require('nanomatch');
 * nm.match(list, pattern[, options]);
 *
 * console.log(nm.match(['a.a', 'a.aa', 'a.b', 'a.c'], '*.a'));
 * //=> ['a.a', 'a.aa']
 * ```
 * @param {Array} `list` Array of strings to match
 * @param {String} `pattern` Glob pattern to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Array} Returns an array of matches
 * @api public
 */

nanomatch.match = function(list, pattern, options) {
  if (Array.isArray(pattern)) {
    throw new TypeError('expected pattern to be a string');
  }

  var unixify = utils_1$1.unixify(options);
  var isMatch = memoize$2('match', pattern, options, nanomatch.matcher);
  var matches = [];

  list = utils_1$1.arrayify(list);
  var len = list.length;
  var idx = -1;

  while (++idx < len) {
    var ele = list[idx];
    if (ele === pattern || isMatch(ele)) {
      matches.push(utils_1$1.value(ele, unixify, options));
    }
  }

  // if no options were passed, uniquify results and return
  if (typeof options === 'undefined') {
    return utils_1$1.unique(matches);
  }

  if (matches.length === 0) {
    if (options.failglob === true) {
      throw new Error('no matches found for "' + pattern + '"');
    }
    if (options.nonull === true || options.nullglob === true) {
      return [options.unescape ? utils_1$1.unescape(pattern) : pattern];
    }
  }

  // if `opts.ignore` was defined, diff ignored list
  if (options.ignore) {
    matches = nanomatch.not(matches, options.ignore, options);
  }

  return options.nodupes !== false ? utils_1$1.unique(matches) : matches;
};

/**
 * Returns true if the specified `string` matches the given glob `pattern`.
 *
 * ```js
 * var nm = require('nanomatch');
 * nm.isMatch(string, pattern[, options]);
 *
 * console.log(nm.isMatch('a.a', '*.a'));
 * //=> true
 * console.log(nm.isMatch('a.b', '*.a'));
 * //=> false
 * ```
 * @param {String} `string` String to match
 * @param {String} `pattern` Glob pattern to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if the string matches the glob pattern.
 * @api public
 */

nanomatch.isMatch = function(str, pattern, options) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string: "' + util$3.inspect(str) + '"');
  }

  if (utils_1$1.isEmptyString(str) || utils_1$1.isEmptyString(pattern)) {
    return false;
  }

  var equals = utils_1$1.equalsPattern(options);
  if (equals(str)) {
    return true;
  }

  var isMatch = memoize$2('isMatch', pattern, options, nanomatch.matcher);
  return isMatch(str);
};

/**
 * Returns true if some of the elements in the given `list` match any of the
 * given glob `patterns`.
 *
 * ```js
 * var nm = require('nanomatch');
 * nm.some(list, patterns[, options]);
 *
 * console.log(nm.some(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
 * // true
 * console.log(nm.some(['foo.js'], ['*.js', '!foo.js']));
 * // false
 * ```
 * @param  {String|Array} `list` The string or array of strings to test. Returns as soon as the first match is found.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

nanomatch.some = function(list, patterns, options) {
  if (typeof list === 'string') {
    list = [list];
  }

  for (var i = 0; i < list.length; i++) {
    if (nanomatch(list[i], patterns, options).length === 1) {
      return true;
    }
  }

  return false;
};

/**
 * Returns true if every element in the given `list` matches
 * at least one of the given glob `patterns`.
 *
 * ```js
 * var nm = require('nanomatch');
 * nm.every(list, patterns[, options]);
 *
 * console.log(nm.every('foo.js', ['foo.js']));
 * // true
 * console.log(nm.every(['foo.js', 'bar.js'], ['*.js']));
 * // true
 * console.log(nm.every(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
 * // false
 * console.log(nm.every(['foo.js'], ['*.js', '!foo.js']));
 * // false
 * ```
 * @param  {String|Array} `list` The string or array of strings to test.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

nanomatch.every = function(list, patterns, options) {
  if (typeof list === 'string') {
    list = [list];
  }

  for (var i = 0; i < list.length; i++) {
    if (nanomatch(list[i], patterns, options).length !== 1) {
      return false;
    }
  }

  return true;
};

/**
 * Returns true if **any** of the given glob `patterns`
 * match the specified `string`.
 *
 * ```js
 * var nm = require('nanomatch');
 * nm.any(string, patterns[, options]);
 *
 * console.log(nm.any('a.a', ['b.*', '*.a']));
 * //=> true
 * console.log(nm.any('a.a', 'b.*'));
 * //=> false
 * ```
 * @param  {String|Array} `str` The string to test.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

nanomatch.any = function(str, patterns, options) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string: "' + util$3.inspect(str) + '"');
  }

  if (utils_1$1.isEmptyString(str) || utils_1$1.isEmptyString(patterns)) {
    return false;
  }

  if (typeof patterns === 'string') {
    patterns = [patterns];
  }

  for (var i = 0; i < patterns.length; i++) {
    if (nanomatch.isMatch(str, patterns[i], options)) {
      return true;
    }
  }
  return false;
};

/**
 * Returns true if **all** of the given `patterns`
 * match the specified string.
 *
 * ```js
 * var nm = require('nanomatch');
 * nm.all(string, patterns[, options]);
 *
 * console.log(nm.all('foo.js', ['foo.js']));
 * // true
 *
 * console.log(nm.all('foo.js', ['*.js', '!foo.js']));
 * // false
 *
 * console.log(nm.all('foo.js', ['*.js', 'foo.js']));
 * // true
 *
 * console.log(nm.all('foo.js', ['*.js', 'f*', '*o*', '*o.js']));
 * // true
 * ```
 * @param  {String|Array} `str` The string to test.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

nanomatch.all = function(str, patterns, options) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string: "' + util$3.inspect(str) + '"');
  }

  if (typeof patterns === 'string') {
    patterns = [patterns];
  }

  for (var i = 0; i < patterns.length; i++) {
    if (!nanomatch.isMatch(str, patterns[i], options)) {
      return false;
    }
  }
  return true;
};

/**
 * Returns a list of strings that _**do not match any**_ of the given `patterns`.
 *
 * ```js
 * var nm = require('nanomatch');
 * nm.not(list, patterns[, options]);
 *
 * console.log(nm.not(['a.a', 'b.b', 'c.c'], '*.a'));
 * //=> ['b.b', 'c.c']
 * ```
 * @param {Array} `list` Array of strings to match.
 * @param {String|Array} `patterns` One or more glob pattern to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Array} Returns an array of strings that **do not match** the given patterns.
 * @api public
 */

nanomatch.not = function(list, patterns, options) {
  var opts = extendShallow({}, options);
  var ignore = opts.ignore;
  delete opts.ignore;

  list = utils_1$1.arrayify(list);

  var matches = utils_1$1.diff(list, nanomatch(list, patterns, opts));
  if (ignore) {
    matches = utils_1$1.diff(matches, nanomatch(list, ignore));
  }

  return opts.nodupes !== false ? utils_1$1.unique(matches) : matches;
};

/**
 * Returns true if the given `string` contains the given pattern. Similar
 * to [.isMatch](#isMatch) but the pattern can match any part of the string.
 *
 * ```js
 * var nm = require('nanomatch');
 * nm.contains(string, pattern[, options]);
 *
 * console.log(nm.contains('aa/bb/cc', '*b'));
 * //=> true
 * console.log(nm.contains('aa/bb/cc', '*d'));
 * //=> false
 * ```
 * @param {String} `str` The string to match.
 * @param {String|Array} `patterns` Glob pattern to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if the patter matches any part of `str`.
 * @api public
 */

nanomatch.contains = function(str, patterns, options) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string: "' + util$3.inspect(str) + '"');
  }

  if (typeof patterns === 'string') {
    if (utils_1$1.isEmptyString(str) || utils_1$1.isEmptyString(patterns)) {
      return false;
    }

    var equals = utils_1$1.equalsPattern(patterns, options);
    if (equals(str)) {
      return true;
    }
    var contains = utils_1$1.containsPattern(patterns, options);
    if (contains(str)) {
      return true;
    }
  }

  var opts = extendShallow({}, options, {contains: true});
  return nanomatch.any(str, patterns, opts);
};

/**
 * Returns true if the given pattern and options should enable
 * the `matchBase` option.
 * @return {Boolean}
 * @api private
 */

nanomatch.matchBase = function(pattern, options) {
  if (pattern && pattern.indexOf('/') !== -1 || !options) return false;
  return options.basename === true || options.matchBase === true;
};

/**
 * Filter the keys of the given object with the given `glob` pattern
 * and `options`. Does not attempt to match nested keys. If you need this feature,
 * use [glob-object][] instead.
 *
 * ```js
 * var nm = require('nanomatch');
 * nm.matchKeys(object, patterns[, options]);
 *
 * var obj = { aa: 'a', ab: 'b', ac: 'c' };
 * console.log(nm.matchKeys(obj, '*b'));
 * //=> { ab: 'b' }
 * ```
 * @param {Object} `object` The object with keys to filter.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Object} Returns an object with only keys that match the given patterns.
 * @api public
 */

nanomatch.matchKeys = function(obj, patterns, options) {
  if (!utils_1$1.isObject(obj)) {
    throw new TypeError('expected the first argument to be an object');
  }
  var keys = nanomatch(Object.keys(obj), patterns, options);
  return utils_1$1.pick(obj, keys);
};

/**
 * Returns a memoized matcher function from the given glob `pattern` and `options`.
 * The returned function takes a string to match as its only argument and returns
 * true if the string is a match.
 *
 * ```js
 * var nm = require('nanomatch');
 * nm.matcher(pattern[, options]);
 *
 * var isMatch = nm.matcher('*.!(*a)');
 * console.log(isMatch('a.a'));
 * //=> false
 * console.log(isMatch('a.b'));
 * //=> true
 * ```
 * @param {String} `pattern` Glob pattern
 * @param {Object} `options` See available [options](#options) for changing how matches are performed.
 * @return {Function} Returns a matcher function.
 * @api public
 */

nanomatch.matcher = function matcher(pattern, options) {
  if (utils_1$1.isEmptyString(pattern)) {
    return function() {
      return false;
    };
  }

  if (Array.isArray(pattern)) {
    return compose(pattern, options, matcher);
  }

  // if pattern is a regex
  if (pattern instanceof RegExp) {
    return test(pattern);
  }

  // if pattern is invalid
  if (!utils_1$1.isString(pattern)) {
    throw new TypeError('expected pattern to be an array, string or regex');
  }

  // if pattern is a non-glob string
  if (!utils_1$1.hasSpecialChars(pattern)) {
    if (options && options.nocase === true) {
      pattern = pattern.toLowerCase();
    }
    return utils_1$1.matchPath(pattern, options);
  }

  // if pattern is a glob string
  var re = nanomatch.makeRe(pattern, options);

  // if `options.matchBase` or `options.basename` is defined
  if (nanomatch.matchBase(pattern, options)) {
    return utils_1$1.matchBasename(re, options);
  }

  function test(regex) {
    var equals = utils_1$1.equalsPattern(options);
    var unixify = utils_1$1.unixify(options);

    return function(str) {
      if (equals(str)) {
        return true;
      }

      if (regex.test(unixify(str))) {
        return true;
      }
      return false;
    };
  }

  // create matcher function
  var matcherFn = test(re);
  // set result object from compiler on matcher function,
  // as a non-enumerable property. useful for debugging
  utils_1$1.define(matcherFn, 'result', re.result);
  return matcherFn;
};

/**
 * Returns an array of matches captured by `pattern` in `string, or
 * `null` if the pattern did not match.
 *
 * ```js
 * var nm = require('nanomatch');
 * nm.capture(pattern, string[, options]);
 *
 * console.log(nm.capture('test/*.js', 'test/foo.js'));
 * //=> ['foo']
 * console.log(nm.capture('test/*.js', 'foo/bar.css'));
 * //=> null
 * ```
 * @param {String} `pattern` Glob pattern to use for matching.
 * @param {String} `string` String to match
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns an array of captures if the string matches the glob pattern, otherwise `null`.
 * @api public
 */

nanomatch.capture = function(pattern, str, options) {
  var re = nanomatch.makeRe(pattern, extendShallow({capture: true}, options));
  var unixify = utils_1$1.unixify(options);

  function match() {
    return function(string) {
      var match = re.exec(unixify(string));
      if (!match) {
        return null;
      }

      return match.slice(1);
    };
  }

  var capture = memoize$2('capture', pattern, options, match);
  return capture(str);
};

/**
 * Create a regular expression from the given glob `pattern`.
 *
 * ```js
 * var nm = require('nanomatch');
 * nm.makeRe(pattern[, options]);
 *
 * console.log(nm.makeRe('*.js'));
 * //=> /^(?:(\.[\\\/])?(?!\.)(?=.)[^\/]*?\.js)$/
 * ```
 * @param {String} `pattern` A glob pattern to convert to regex.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed.
 * @return {RegExp} Returns a regex created from the given pattern.
 * @api public
 */

nanomatch.makeRe = function(pattern, options) {
  if (pattern instanceof RegExp) {
    return pattern;
  }

  if (typeof pattern !== 'string') {
    throw new TypeError('expected pattern to be a string');
  }

  if (pattern.length > MAX_LENGTH$2) {
    throw new Error('expected pattern to be less than ' + MAX_LENGTH$2 + ' characters');
  }

  function makeRe() {
    var opts = utils_1$1.extend({wrap: false}, options);
    var result = nanomatch.create(pattern, opts);
    var regex = toRegex$1(result.output, opts);
    utils_1$1.define(regex, 'result', result);
    return regex;
  }

  return memoize$2('makeRe', pattern, options, makeRe);
};

/**
 * Parses the given glob `pattern` and returns an object with the compiled `output`
 * and optional source `map`.
 *
 * ```js
 * var nm = require('nanomatch');
 * nm.create(pattern[, options]);
 *
 * console.log(nm.create('abc/*.js'));
 * // { options: { source: 'string', sourcemap: true },
 * //   state: {},
 * //   compilers:
 * //    { ... },
 * //   output: '(\\.[\\\\\\/])?abc\\/(?!\\.)(?=.)[^\\/]*?\\.js',
 * //   ast:
 * //    { type: 'root',
 * //      errors: [],
 * //      nodes:
 * //       [ ... ],
 * //      dot: false,
 * //      input: 'abc/*.js' },
 * //   parsingErrors: [],
 * //   map:
 * //    { version: 3,
 * //      sources: [ 'string' ],
 * //      names: [],
 * //      mappings: 'AAAA,GAAG,EAAC,kBAAC,EAAC,EAAE',
 * //      sourcesContent: [ 'abc/*.js' ] },
 * //   position: { line: 1, column: 28 },
 * //   content: {},
 * //   files: {},
 * //   idx: 6 }
 * ```
 * @param {String} `pattern` Glob pattern to parse and compile.
 * @param {Object} `options` Any [options](#options) to change how parsing and compiling is performed.
 * @return {Object} Returns an object with the parsed AST, compiled string and optional source map.
 * @api public
 */

nanomatch.create = function(pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('expected a string');
  }
  function create() {
    return nanomatch.compile(nanomatch.parse(pattern, options), options);
  }
  return memoize$2('create', pattern, options, create);
};

/**
 * Parse the given `str` with the given `options`.
 *
 * ```js
 * var nm = require('nanomatch');
 * nm.parse(pattern[, options]);
 *
 * var ast = nm.parse('a/{b,c}/d');
 * console.log(ast);
 * // { type: 'root',
 * //   errors: [],
 * //   input: 'a/{b,c}/d',
 * //   nodes:
 * //    [ { type: 'bos', val: '' },
 * //      { type: 'text', val: 'a/' },
 * //      { type: 'brace',
 * //        nodes:
 * //         [ { type: 'brace.open', val: '{' },
 * //           { type: 'text', val: 'b,c' },
 * //           { type: 'brace.close', val: '}' } ] },
 * //      { type: 'text', val: '/d' },
 * //      { type: 'eos', val: '' } ] }
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {Object} Returns an AST
 * @api public
 */

nanomatch.parse = function(pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('expected a string');
  }

  function parse() {
    var snapdragon = utils_1$1.instantiate(null, options);
    parsers$1(snapdragon, options);

    var ast = snapdragon.parse(pattern, options);
    utils_1$1.define(ast, 'snapdragon', snapdragon);
    ast.input = pattern;
    return ast;
  }

  return memoize$2('parse', pattern, options, parse);
};

/**
 * Compile the given `ast` or string with the given `options`.
 *
 * ```js
 * var nm = require('nanomatch');
 * nm.compile(ast[, options]);
 *
 * var ast = nm.parse('a/{b,c}/d');
 * console.log(nm.compile(ast));
 * // { options: { source: 'string' },
 * //   state: {},
 * //   compilers:
 * //    { eos: [Function],
 * //      noop: [Function],
 * //      bos: [Function],
 * //      brace: [Function],
 * //      'brace.open': [Function],
 * //      text: [Function],
 * //      'brace.close': [Function] },
 * //   output: [ 'a/(b|c)/d' ],
 * //   ast:
 * //    { ... },
 * //   parsingErrors: [] }
 * ```
 * @param {Object|String} `ast`
 * @param {Object} `options`
 * @return {Object} Returns an object that has an `output` property with the compiled string.
 * @api public
 */

nanomatch.compile = function(ast, options) {
  if (typeof ast === 'string') {
    ast = nanomatch.parse(ast, options);
  }

  function compile() {
    var snapdragon = utils_1$1.instantiate(ast, options);
    compilers$1(snapdragon, options);
    return snapdragon.compile(ast, options);
  }

  return memoize$2('compile', ast.input, options, compile);
};

/**
 * Clear the regex cache.
 *
 * ```js
 * nm.clearCache();
 * ```
 * @api public
 */

nanomatch.clearCache = function() {
  nanomatch.cache.__data__ = {};
};

/**
 * Compose a matcher function with the given patterns.
 * This allows matcher functions to be compiled once and
 * called multiple times.
 */

function compose(patterns, options, matcher) {
  var matchers;

  return memoize$2('compose', String(patterns), options, function() {
    return function(file) {
      // delay composition until it's invoked the first time,
      // after that it won't be called again
      if (!matchers) {
        matchers = [];
        for (var i = 0; i < patterns.length; i++) {
          matchers.push(matcher(patterns[i], options));
        }
      }

      var len = matchers.length;
      while (len--) {
        if (matchers[len](file) === true) {
          return true;
        }
      }
      return false;
    };
  });
}

/**
 * Memoize a generated regex or function. A unique key is generated
 * from the `type` (usually method name), the `pattern`, and
 * user-defined options.
 */

function memoize$2(type, pattern, options, fn) {
  var key = utils_1$1.createKey(type + '=' + pattern, options);

  if (options && options.cache === false) {
    return fn(pattern, options);
  }

  if (cache$4.has(type, key)) {
    return cache$4.get(type, key);
  }

  var val = fn(pattern, options);
  cache$4.set(type, key, val);
  return val;
}

/**
 * Expose compiler, parser and cache on `nanomatch`
 */

nanomatch.compilers = compilers$1;
nanomatch.parsers = parsers$1;
nanomatch.cache = cache$4;

/**
 * Expose `nanomatch`
 * @type {Function}
 */

var nanomatch_1 = nanomatch;

var extendShallow$5 = function extend(o/*, objects*/) {
  if (!isExtendable$1(o)) { o = {}; }

  var len = arguments.length;
  for (var i = 1; i < len; i++) {
    var obj = arguments[i];

    if (isExtendable$1(obj)) {
      assign$5(o, obj);
    }
  }
  return o;
};

function assign$5(a, b) {
  for (var key in b) {
    if (hasOwn$6(b, key)) {
      a[key] = b[key];
    }
  }
}

/**
 * Returns true if the given `key` is an own property of `obj`.
 */

function hasOwn$6(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * POSIX character classes
 */

var posixCharacterClasses = {
  alnum: 'a-zA-Z0-9',
  alpha: 'a-zA-Z',
  ascii: '\\x00-\\x7F',
  blank: ' \\t',
  cntrl: '\\x00-\\x1F\\x7F',
  digit: '0-9',
  graph: '\\x21-\\x7E',
  lower: 'a-z',
  print: '\\x20-\\x7E ',
  punct: '\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~',
  space: ' \\t\\r\\n\\v\\f',
  upper: 'A-Z',
  word: 'A-Za-z0-9_',
  xdigit: 'A-Fa-f0-9'
};

var compilers$2 = function(brackets) {
  brackets.compiler

    /**
     * Escaped characters
     */

    .set('escape', function(node) {
      return this.emit('\\' + node.val.replace(/^\\/, ''), node);
    })

    /**
     * Text
     */

    .set('text', function(node) {
      return this.emit(node.val.replace(/([{}])/g, '\\$1'), node);
    })

    /**
     * POSIX character classes
     */

    .set('posix', function(node) {
      if (node.val === '[::]') {
        return this.emit('\\[::\\]', node);
      }

      var val = posixCharacterClasses[node.inner];
      if (typeof val === 'undefined') {
        val = '[' + node.inner + ']';
      }
      return this.emit(val, node);
    })

    /**
     * Non-posix brackets
     */

    .set('bracket', function(node) {
      return this.mapVisit(node.nodes);
    })
    .set('bracket.open', function(node) {
      return this.emit(node.val, node);
    })
    .set('bracket.inner', function(node) {
      var inner = node.val;

      if (inner === '[' || inner === ']') {
        return this.emit('\\' + node.val, node);
      }
      if (inner === '^]') {
        return this.emit('^\\]', node);
      }
      if (inner === '^') {
        return this.emit('^', node);
      }

      if (/-/.test(inner) && !/(\d-\d|\w-\w)/.test(inner)) {
        inner = inner.split('-').join('\\-');
      }

      var isNegated = inner.charAt(0) === '^';
      // add slashes to negated brackets, per spec
      if (isNegated && inner.indexOf('/') === -1) {
        inner += '/';
      }
      if (isNegated && inner.indexOf('.') === -1) {
        inner += '.';
      }

      // don't unescape `0` (octal literal)
      inner = inner.replace(/\\([1-9])/g, '$1');
      return this.emit(inner, node);
    })
    .set('bracket.close', function(node) {
      var val = node.val.replace(/^\\/, '');
      if (node.parent.escaped === true) {
        return this.emit('\\' + val, node);
      }
      return this.emit(val, node);
    });
};

var cached$1;

/**
 * Get the last element from `array`
 * @param {Array} `array`
 * @return {*}
 */

var last$1 = function(arr) {
  return arr[arr.length - 1];
};

/**
 * Create and cache regex to use for text nodes
 */

var createRegex = function(pattern, include) {
  if (cached$1) return cached$1;
  var opts = {contains: true, strictClose: false};
  var not = regexNot.create(pattern, opts);
  var re;

  if (typeof include === 'string') {
    re = toRegex$1('^(?:' + include + '|' + not + ')', opts);
  } else {
    re = toRegex$1(not, opts);
  }

  return (cached$1 = re);
};

var utils$1 = {
	last: last$1,
	createRegex: createRegex
};

var defineProperty$7 = function defineProperty(obj, prop, val) {
  if (typeof obj !== 'object' && typeof obj !== 'function') {
    throw new TypeError('expected an object or function.');
  }

  if (typeof prop !== 'string') {
    throw new TypeError('expected `prop` to be a string.');
  }

  if (isDescriptor$3(val) && ('set' in val || 'get' in val)) {
    return Object.defineProperty(obj, prop, val);
  }

  return Object.defineProperty(obj, prop, {
    configurable: true,
    enumerable: false,
    writable: true,
    value: val
  });
};

/**
 * Text regex
 */

var TEXT_REGEX = '(\\[(?=.*\\])|\\])+';
var not$1 = utils$1.createRegex(TEXT_REGEX);

/**
 * Brackets parsers
 */

function parsers$2(brackets) {
  brackets.state = brackets.state || {};
  brackets.parser.sets.bracket = brackets.parser.sets.bracket || [];
  brackets.parser

    .capture('escape', function() {
      if (this.isInside('bracket')) return;
      var pos = this.position();
      var m = this.match(/^\\(.)/);
      if (!m) return;

      return pos({
        type: 'escape',
        val: m[0]
      });
    })

    /**
     * Text parser
     */

    .capture('text', function() {
      if (this.isInside('bracket')) return;
      var pos = this.position();
      var m = this.match(not$1);
      if (!m || !m[0]) return;

      return pos({
        type: 'text',
        val: m[0]
      });
    })

    /**
     * POSIX character classes: "[[:alpha:][:digits:]]"
     */

    .capture('posix', function() {
      var pos = this.position();
      var m = this.match(/^\[:(.*?):\](?=.*\])/);
      if (!m) return;

      var inside = this.isInside('bracket');
      if (inside) {
        brackets.posix++;
      }

      return pos({
        type: 'posix',
        insideBracket: inside,
        inner: m[1],
        val: m[0]
      });
    })

    /**
     * Bracket (noop)
     */

    .capture('bracket', function() {})

    /**
     * Open: '['
     */

    .capture('bracket.open', function() {
      var parsed = this.parsed;
      var pos = this.position();
      var m = this.match(/^\[(?=.*\])/);
      if (!m) return;

      var prev = this.prev();
      var last = utils$1.last(prev.nodes);

      if (parsed.slice(-1) === '\\' && !this.isInside('bracket')) {
        last.val = last.val.slice(0, last.val.length - 1);
        return pos({
          type: 'escape',
          val: m[0]
        });
      }

      var open = pos({
        type: 'bracket.open',
        val: m[0]
      });

      if (last.type === 'bracket.open' || this.isInside('bracket')) {
        open.val = '\\' + open.val;
        open.type = 'bracket.inner';
        open.escaped = true;
        return open;
      }

      var node = pos({
        type: 'bracket',
        nodes: [open]
      });

      defineProperty$7(node, 'parent', prev);
      defineProperty$7(open, 'parent', node);
      this.push('bracket', node);
      prev.nodes.push(node);
    })

    /**
     * Bracket text
     */

    .capture('bracket.inner', function() {
      if (!this.isInside('bracket')) return;
      var pos = this.position();
      var m = this.match(not$1);
      if (!m || !m[0]) return;

      var next = this.input.charAt(0);
      var val = m[0];

      var node = pos({
        type: 'bracket.inner',
        val: val
      });

      if (val === '\\\\') {
        return node;
      }

      var first = val.charAt(0);
      var last = val.slice(-1);

      if (first === '!') {
        val = '^' + val.slice(1);
      }

      if (last === '\\' || (val === '^' && next === ']')) {
        val += this.input[0];
        this.consume(1);
      }

      node.val = val;
      return node;
    })

    /**
     * Close: ']'
     */

    .capture('bracket.close', function() {
      var parsed = this.parsed;
      var pos = this.position();
      var m = this.match(/^\]/);
      if (!m) return;

      var prev = this.prev();
      var last = utils$1.last(prev.nodes);

      if (parsed.slice(-1) === '\\' && !this.isInside('bracket')) {
        last.val = last.val.slice(0, last.val.length - 1);

        return pos({
          type: 'escape',
          val: m[0]
        });
      }

      var node = pos({
        type: 'bracket.close',
        rest: this.input,
        val: m[0]
      });

      if (last.type === 'bracket.open') {
        node.type = 'bracket.inner';
        node.escaped = true;
        return node;
      }

      var bracket = this.pop('bracket');
      if (!this.isType(bracket, 'bracket')) {
        if (this.options.strict) {
          throw new Error('missing opening "["');
        }
        node.type = 'bracket.inner';
        node.escaped = true;
        return node;
      }

      bracket.nodes.push(node);
      defineProperty$7(node, 'parent', bracket);
    });
}

/**
 * Brackets parsers
 */

var parsers_1 = parsers$2;

/**
 * Expose text regex
 */

var TEXT_REGEX_1 = TEXT_REGEX;
parsers_1.TEXT_REGEX = TEXT_REGEX_1;

var extendShallow$6 = function extend(o/*, objects*/) {
  if (!isExtendable$1(o)) { o = {}; }

  var len = arguments.length;
  for (var i = 1; i < len; i++) {
    var obj = arguments[i];

    if (isExtendable$1(obj)) {
      assign$6(o, obj);
    }
  }
  return o;
};

function assign$6(a, b) {
  for (var key in b) {
    if (hasOwn$7(b, key)) {
      a[key] = b[key];
    }
  }
}

/**
 * Returns true if the given `key` is an own property of `obj`.
 */

function hasOwn$7(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Local dependencies
 */




/**
 * Module dependencies
 */

var debug$3 = src('expand-brackets');




/**
 * Parses the given POSIX character class `pattern` and returns a
 * string that can be used for creating regular expressions for matching.
 *
 * @param {String} `pattern`
 * @param {Object} `options`
 * @return {Object}
 * @api public
 */

function brackets(pattern, options) {
  debug$3('initializing from <%s>', __filename);
  var res = brackets.create(pattern, options);
  return res.output;
}

/**
 * Takes an array of strings and a POSIX character class pattern, and returns a new
 * array with only the strings that matched the pattern.
 *
 * ```js
 * var brackets = require('expand-brackets');
 * console.log(brackets.match(['1', 'a', 'ab'], '[[:alpha:]]'));
 * //=> ['a']
 *
 * console.log(brackets.match(['1', 'a', 'ab'], '[[:alpha:]]+'));
 * //=> ['a', 'ab']
 * ```
 * @param {Array} `arr` Array of strings to match
 * @param {String} `pattern` POSIX character class pattern(s)
 * @param {Object} `options`
 * @return {Array}
 * @api public
 */

brackets.match = function(arr, pattern, options) {
  arr = [].concat(arr);
  var opts = extendShallow$6({}, options);
  var isMatch = brackets.matcher(pattern, opts);
  var len = arr.length;
  var idx = -1;
  var res = [];

  while (++idx < len) {
    var ele = arr[idx];
    if (isMatch(ele)) {
      res.push(ele);
    }
  }

  if (res.length === 0) {
    if (opts.failglob === true) {
      throw new Error('no matches found for "' + pattern + '"');
    }

    if (opts.nonull === true || opts.nullglob === true) {
      return [pattern.split('\\').join('')];
    }
  }
  return res;
};

/**
 * Returns true if the specified `string` matches the given
 * brackets `pattern`.
 *
 * ```js
 * var brackets = require('expand-brackets');
 *
 * console.log(brackets.isMatch('a.a', '[[:alpha:]].[[:alpha:]]'));
 * //=> true
 * console.log(brackets.isMatch('1.2', '[[:alpha:]].[[:alpha:]]'));
 * //=> false
 * ```
 * @param {String} `string` String to match
 * @param {String} `pattern` Poxis pattern
 * @param {String} `options`
 * @return {Boolean}
 * @api public
 */

brackets.isMatch = function(str, pattern, options) {
  return brackets.matcher(pattern, options)(str);
};

/**
 * Takes a POSIX character class pattern and returns a matcher function. The returned
 * function takes the string to match as its only argument.
 *
 * ```js
 * var brackets = require('expand-brackets');
 * var isMatch = brackets.matcher('[[:lower:]].[[:upper:]]');
 *
 * console.log(isMatch('a.a'));
 * //=> false
 * console.log(isMatch('a.A'));
 * //=> true
 * ```
 * @param {String} `pattern` Poxis pattern
 * @param {String} `options`
 * @return {Boolean}
 * @api public
 */

brackets.matcher = function(pattern, options) {
  var re = brackets.makeRe(pattern, options);
  return function(str) {
    return re.test(str);
  };
};

/**
 * Create a regular expression from the given `pattern`.
 *
 * ```js
 * var brackets = require('expand-brackets');
 * var re = brackets.makeRe('[[:alpha:]]');
 * console.log(re);
 * //=> /^(?:[a-zA-Z])$/
 * ```
 * @param {String} `pattern` The pattern to convert to regex.
 * @param {Object} `options`
 * @return {RegExp}
 * @api public
 */

brackets.makeRe = function(pattern, options) {
  var res = brackets.create(pattern, options);
  var opts = extendShallow$6({strictErrors: false}, options);
  return toRegex$1(res.output, opts);
};

/**
 * Parses the given POSIX character class `pattern` and returns an object
 * with the compiled `output` and optional source `map`.
 *
 * ```js
 * var brackets = require('expand-brackets');
 * console.log(brackets('[[:alpha:]]'));
 * // { options: { source: 'string' },
 * //   input: '[[:alpha:]]',
 * //   state: {},
 * //   compilers:
 * //    { eos: [Function],
 * //      noop: [Function],
 * //      bos: [Function],
 * //      not: [Function],
 * //      escape: [Function],
 * //      text: [Function],
 * //      posix: [Function],
 * //      bracket: [Function],
 * //      'bracket.open': [Function],
 * //      'bracket.inner': [Function],
 * //      'bracket.literal': [Function],
 * //      'bracket.close': [Function] },
 * //   output: '[a-zA-Z]',
 * //   ast:
 * //    { type: 'root',
 * //      errors: [],
 * //      nodes: [ [Object], [Object], [Object] ] },
 * //   parsingErrors: [] }
 * ```
 * @param {String} `pattern`
 * @param {Object} `options`
 * @return {Object}
 * @api public
 */

brackets.create = function(pattern, options) {
  var snapdragon$1 = (options && options.snapdragon) || new snapdragon(options);
  compilers$2(snapdragon$1);
  parsers_1(snapdragon$1);

  var ast = snapdragon$1.parse(pattern, options);
  ast.input = pattern;
  var res = snapdragon$1.compile(ast, options);
  res.input = pattern;
  return res;
};

/**
 * Expose `brackets` constructor, parsers and compilers
 */

brackets.compilers = compilers$2;
brackets.parsers = parsers_1;

/**
 * Expose `brackets`
 * @type {Function}
 */

var expandBrackets = brackets;

/**
 * Extglob compilers
 */

var compilers$3 = function(extglob) {
  function star() {
    if (typeof extglob.options.star === 'function') {
      return extglob.options.star.apply(this, arguments);
    }
    if (typeof extglob.options.star === 'string') {
      return extglob.options.star;
    }
    return '.*?';
  }

  /**
   * Use `expand-brackets` compilers
   */

  extglob.use(expandBrackets.compilers);
  extglob.compiler

    /**
     * Escaped: "\\*"
     */

    .set('escape', function(node) {
      return this.emit(node.val, node);
    })

    /**
     * Dot: "."
     */

    .set('dot', function(node) {
      return this.emit('\\' + node.val, node);
    })

    /**
     * Question mark: "?"
     */

    .set('qmark', function(node) {
      var val = '[^\\\\/.]';
      var prev = this.prev();

      if (node.parsed.slice(-1) === '(') {
        var ch = node.rest.charAt(0);
        if (ch !== '!' && ch !== '=' && ch !== ':') {
          return this.emit(val, node);
        }
        return this.emit(node.val, node);
      }

      if (prev.type === 'text' && prev.val) {
        return this.emit(val, node);
      }

      if (node.val.length > 1) {
        val += '{' + node.val.length + '}';
      }
      return this.emit(val, node);
    })

    /**
     * Plus: "+"
     */

    .set('plus', function(node) {
      var prev = node.parsed.slice(-1);
      if (prev === ']' || prev === ')') {
        return this.emit(node.val, node);
      }
      var ch = this.output.slice(-1);
      if (!this.output || (/[?*+]/.test(ch) && node.parent.type !== 'bracket')) {
        return this.emit('\\+', node);
      }
      if (/\w/.test(ch) && !node.inside) {
        return this.emit('+\\+?', node);
      }
      return this.emit('+', node);
    })

    /**
     * Star: "*"
     */

    .set('star', function(node) {
      var prev = this.prev();
      var prefix = prev.type !== 'text' && prev.type !== 'escape'
        ? '(?!\\.)'
        : '';

      return this.emit(prefix + star.call(this, node), node);
    })

    /**
     * Parens
     */

    .set('paren', function(node) {
      return this.mapVisit(node.nodes);
    })
    .set('paren.open', function(node) {
      var capture = this.options.capture ? '(' : '';

      switch (node.parent.prefix) {
        case '!':
        case '^':
          return this.emit(capture + '(?:(?!(?:', node);
        case '*':
        case '+':
        case '?':
        case '@':
          return this.emit(capture + '(?:', node);
        default: {
          var val = node.val;
          if (this.options.bash === true) {
            val = '\\' + val;
          } else if (!this.options.capture && val === '(' && node.parent.rest[0] !== '?') {
            val += '?:';
          }

          return this.emit(val, node);
        }
      }
    })
    .set('paren.close', function(node) {
      var capture = this.options.capture ? ')' : '';

      switch (node.prefix) {
        case '!':
        case '^':
          var prefix = /^(\)|$)/.test(node.rest) ? '$' : '';
          var str = star.call(this, node);

          // if the extglob has a slash explicitly defined, we know the user wants
          // to match slashes, so we need to ensure the "star" regex allows for it
          if (node.parent.hasSlash && !this.options.star && this.options.slash !== false) {
            str = '.*?';
          }

          return this.emit(prefix + ('))' + str + ')') + capture, node);
        case '*':
        case '+':
        case '?':
          return this.emit(')' + node.prefix + capture, node);
        case '@':
          return this.emit(')' + capture, node);
        default: {
          var val = (this.options.bash === true ? '\\' : '') + ')';
          return this.emit(val, node);
        }
      }
    })

    /**
     * Text
     */

    .set('text', function(node) {
      var val = node.val.replace(/[\[\]]/g, '\\$&');
      return this.emit(val, node);
    });
};

// accessor descriptor properties
var accessor$4 = {
  get: 'function',
  set: 'function',
  configurable: 'boolean',
  enumerable: 'boolean'
};

function isAccessorDescriptor$4(obj, prop) {
  if (typeof prop === 'string') {
    var val = Object.getOwnPropertyDescriptor(obj, prop);
    return typeof val !== 'undefined';
  }

  if (kindOf(obj) !== 'object') {
    return false;
  }

  if (has$6(obj, 'value') || has$6(obj, 'writable')) {
    return false;
  }

  if (!has$6(obj, 'get') || typeof obj.get !== 'function') {
    return false;
  }

  // tldr: it's valid to have "set" be undefined
  // "set" might be undefined if `Object.getOwnPropertyDescriptor`
  // was used to get the value, and only `get` was defined by the user
  if (has$6(obj, 'set') && typeof obj[key] !== 'function' && typeof obj[key] !== 'undefined') {
    return false;
  }

  for (var key in obj) {
    if (!accessor$4.hasOwnProperty(key)) {
      continue;
    }

    if (kindOf(obj[key]) === accessor$4[key]) {
      continue;
    }

    if (typeof obj[key] !== 'undefined') {
      return false;
    }
  }
  return true;
}

function has$6(obj, key) {
  return {}.hasOwnProperty.call(obj, key);
}

/**
 * Expose `isAccessorDescriptor`
 */

var isAccessorDescriptor_1$4 = isAccessorDescriptor$4;

var isDataDescriptor$4 = function isDataDescriptor(obj, prop) {
  // data descriptor properties
  var data = {
    configurable: 'boolean',
    enumerable: 'boolean',
    writable: 'boolean'
  };

  if (kindOf(obj) !== 'object') {
    return false;
  }

  if (typeof prop === 'string') {
    var val = Object.getOwnPropertyDescriptor(obj, prop);
    return typeof val !== 'undefined';
  }

  if (!('value' in obj) && !('writable' in obj)) {
    return false;
  }

  for (var key in obj) {
    if (key === 'value') continue;

    if (!data.hasOwnProperty(key)) {
      continue;
    }

    if (kindOf(obj[key]) === data[key]) {
      continue;
    }

    if (typeof obj[key] !== 'undefined') {
      return false;
    }
  }
  return true;
};

var isDescriptor$4 = function isDescriptor(obj, key) {
  if (kindOf(obj) !== 'object') {
    return false;
  }
  if ('get' in obj) {
    return isAccessorDescriptor_1$4(obj, key);
  }
  return isDataDescriptor$4(obj, key);
};

var defineProperty$8 = function defineProperty(obj, prop, val) {
  if (typeof obj !== 'object' && typeof obj !== 'function') {
    throw new TypeError('expected an object or function.');
  }

  if (typeof prop !== 'string') {
    throw new TypeError('expected `prop` to be a string.');
  }

  if (isDescriptor$4(val) && ('set' in val || 'get' in val)) {
    return Object.defineProperty(obj, prop, val);
  }

  return Object.defineProperty(obj, prop, {
    configurable: true,
    enumerable: false,
    writable: true,
    value: val
  });
};

var utils_1$2 = createCommonjsModule(function (module) {




/**
 * Utils
 */

var utils = module.exports;
var cache = utils.cache = new fragmentCache();

/**
 * Cast `val` to an array
 * @return {Array}
 */

utils.arrayify = function(val) {
  if (!Array.isArray(val)) {
    return [val];
  }
  return val;
};

/**
 * Memoize a generated regex or function
 */

utils.memoize = function(type, pattern, options, fn) {
  var key = utils.createKey(type + pattern, options);

  if (cache.has(type, key)) {
    return cache.get(type, key);
  }

  var val = fn(pattern, options);
  if (options && options.cache === false) {
    return val;
  }

  cache.set(type, key, val);
  return val;
};

/**
 * Create the key to use for memoization. The key is generated
 * by iterating over the options and concatenating key-value pairs
 * to the pattern string.
 */

utils.createKey = function(pattern, options) {
  var key = pattern;
  if (typeof options === 'undefined') {
    return key;
  }
  for (var prop in options) {
    key += ';' + prop + '=' + String(options[prop]);
  }
  return key;
};

/**
 * Create the regex to use for matching text
 */

utils.createRegex = function(str) {
  var opts = {contains: true, strictClose: false};
  return regexNot(str, opts);
};
});

/**
 * Characters to use in text regex (we want to "not" match
 * characters that are matched by other parsers)
 */

var TEXT_REGEX$1 = '([!@*?+]?\\(|\\)|[*?.+\\\\]|\\[:?(?=.*\\])|:?\\])+';
var not$2 = utils_1$2.createRegex(TEXT_REGEX$1);

/**
 * Extglob parsers
 */

function parsers$3(extglob) {
  extglob.state = extglob.state || {};

  /**
   * Use `expand-brackets` parsers
   */

  extglob.use(expandBrackets.parsers);
  extglob.parser.sets.paren = extglob.parser.sets.paren || [];
  extglob.parser

    /**
     * Extglob open: "*("
     */

    .capture('paren.open', function() {
      var parsed = this.parsed;
      var pos = this.position();
      var m = this.match(/^([!@*?+])?\(/);
      if (!m) return;

      var prev = this.prev();
      var prefix = m[1];
      var val = m[0];

      var open = pos({
        type: 'paren.open',
        parsed: parsed,
        val: val
      });

      var node = pos({
        type: 'paren',
        prefix: prefix,
        nodes: [open]
      });

      // if nested negation extglobs, just cancel them out to simplify
      if (prefix === '!' && prev.type === 'paren' && prev.prefix === '!') {
        prev.prefix = '@';
        node.prefix = '@';
      }

      defineProperty$8(node, 'rest', this.input);
      defineProperty$8(node, 'parsed', parsed);
      defineProperty$8(node, 'parent', prev);
      defineProperty$8(open, 'parent', node);

      this.push('paren', node);
      prev.nodes.push(node);
    })

    /**
     * Extglob close: ")"
     */

    .capture('paren.close', function() {
      var parsed = this.parsed;
      var pos = this.position();
      var m = this.match(/^\)/);
      if (!m) return;

      var parent = this.pop('paren');
      var node = pos({
        type: 'paren.close',
        rest: this.input,
        parsed: parsed,
        val: m[0]
      });

      if (!this.isType(parent, 'paren')) {
        if (this.options.strict) {
          throw new Error('missing opening paren: "("');
        }
        node.escaped = true;
        return node;
      }

      node.prefix = parent.prefix;
      parent.nodes.push(node);
      defineProperty$8(node, 'parent', parent);
    })

    /**
     * Escape: "\\."
     */

    .capture('escape', function() {
      var pos = this.position();
      var m = this.match(/^\\(.)/);
      if (!m) return;

      return pos({
        type: 'escape',
        val: m[0],
        ch: m[1]
      });
    })

    /**
     * Question marks: "?"
     */

    .capture('qmark', function() {
      var parsed = this.parsed;
      var pos = this.position();
      var m = this.match(/^\?+(?!\()/);
      if (!m) return;
      extglob.state.metachar = true;
      return pos({
        type: 'qmark',
        rest: this.input,
        parsed: parsed,
        val: m[0]
      });
    })

    /**
     * Character parsers
     */

    .capture('star', /^\*(?!\()/)
    .capture('plus', /^\+(?!\()/)
    .capture('dot', /^\./)
    .capture('text', not$2);
}
/**
 * Expose text regex string
 */

var TEXT_REGEX_1$1 = TEXT_REGEX$1;

/**
 * Extglob parsers
 */

var parsers_1$1 = parsers$3;
parsers_1$1.TEXT_REGEX = TEXT_REGEX_1$1;

/**
 * Module dependencies
 */





/**
 * Local dependencies
 */




/**
 * Customize Snapdragon parser and renderer
 */

function Extglob(options) {
  this.options = extendShallow$5({source: 'extglob'}, options);
  this.snapdragon = this.options.snapdragon || new snapdragon(this.options);
  this.snapdragon.patterns = this.snapdragon.patterns || {};
  this.compiler = this.snapdragon.compiler;
  this.parser = this.snapdragon.parser;

  compilers$3(this.snapdragon);
  parsers_1$1(this.snapdragon);

  /**
   * Override Snapdragon `.parse` method
   */

  defineProperty$8(this.snapdragon, 'parse', function(str, options) {
    var parsed = snapdragon.prototype.parse.apply(this, arguments);
    parsed.input = str;

    // escape unmatched brace/bracket/parens
    var last = this.parser.stack.pop();
    if (last && this.options.strict !== true) {
      var node = last.nodes[0];
      node.val = '\\' + node.val;
      var sibling = node.parent.nodes[1];
      if (sibling.type === 'star') {
        sibling.loose = true;
      }
    }

    // add non-enumerable parser reference
    defineProperty$8(parsed, 'parser', this.parser);
    return parsed;
  });

  /**
   * Decorate `.parse` method
   */

  defineProperty$8(this, 'parse', function(ast, options) {
    return this.snapdragon.parse.apply(this.snapdragon, arguments);
  });

  /**
   * Decorate `.compile` method
   */

  defineProperty$8(this, 'compile', function(ast, options) {
    return this.snapdragon.compile.apply(this.snapdragon, arguments);
  });

}

/**
 * Expose `Extglob`
 */

var extglob = Extglob;

/**
 * Module dependencies
 */





/**
 * Local dependencies
 */





var MAX_LENGTH$3 = 1024 * 64;

/**
 * Convert the given `extglob` pattern into a regex-compatible string. Returns
 * an object with the compiled result and the parsed AST.
 *
 * ```js
 * var extglob = require('extglob');
 * console.log(extglob('*.!(*a)'));
 * //=> '(?!\\.)[^/]*?\\.(?!(?!\\.)[^/]*?a\\b).*?'
 * ```
 * @param {String} `pattern`
 * @param {Object} `options`
 * @return {String}
 * @api public
 */

function extglob$1(pattern, options) {
  return extglob$1.create(pattern, options).output;
}

/**
 * Takes an array of strings and an extglob pattern and returns a new
 * array that contains only the strings that match the pattern.
 *
 * ```js
 * var extglob = require('extglob');
 * console.log(extglob.match(['a.a', 'a.b', 'a.c'], '*.!(*a)'));
 * //=> ['a.b', 'a.c']
 * ```
 * @param {Array} `list` Array of strings to match
 * @param {String} `pattern` Extglob pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of matches
 * @api public
 */

extglob$1.match = function(list, pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('expected pattern to be a string');
  }

  list = utils_1$2.arrayify(list);
  var isMatch = extglob$1.matcher(pattern, options);
  var len = list.length;
  var idx = -1;
  var matches = [];

  while (++idx < len) {
    var ele = list[idx];

    if (isMatch(ele)) {
      matches.push(ele);
    }
  }

  // if no options were passed, uniquify results and return
  if (typeof options === 'undefined') {
    return arrayUnique(matches);
  }

  if (matches.length === 0) {
    if (options.failglob === true) {
      throw new Error('no matches found for "' + pattern + '"');
    }
    if (options.nonull === true || options.nullglob === true) {
      return [pattern.split('\\').join('')];
    }
  }

  return options.nodupes !== false ? arrayUnique(matches) : matches;
};

/**
 * Returns true if the specified `string` matches the given
 * extglob `pattern`.
 *
 * ```js
 * var extglob = require('extglob');
 *
 * console.log(extglob.isMatch('a.a', '*.!(*a)'));
 * //=> false
 * console.log(extglob.isMatch('a.b', '*.!(*a)'));
 * //=> true
 * ```
 * @param {String} `string` String to match
 * @param {String} `pattern` Extglob pattern
 * @param {String} `options`
 * @return {Boolean}
 * @api public
 */

extglob$1.isMatch = function(str, pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('expected pattern to be a string');
  }

  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  }

  if (pattern === str) {
    return true;
  }

  if (pattern === '' || pattern === ' ' || pattern === '.') {
    return pattern === str;
  }

  var isMatch = utils_1$2.memoize('isMatch', pattern, options, extglob$1.matcher);
  return isMatch(str);
};

/**
 * Returns true if the given `string` contains the given pattern. Similar to `.isMatch` but
 * the pattern can match any part of the string.
 *
 * ```js
 * var extglob = require('extglob');
 * console.log(extglob.contains('aa/bb/cc', '*b'));
 * //=> true
 * console.log(extglob.contains('aa/bb/cc', '*d'));
 * //=> false
 * ```
 * @param {String} `str` The string to match.
 * @param {String} `pattern` Glob pattern to use for matching.
 * @param {Object} `options`
 * @return {Boolean} Returns true if the patter matches any part of `str`.
 * @api public
 */

extglob$1.contains = function(str, pattern, options) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  }

  if (pattern === '' || pattern === ' ' || pattern === '.') {
    return pattern === str;
  }

  var opts = extendShallow$5({}, options, {contains: true});
  opts.strictClose = false;
  opts.strictOpen = false;
  return extglob$1.isMatch(str, pattern, opts);
};

/**
 * Takes an extglob pattern and returns a matcher function. The returned
 * function takes the string to match as its only argument.
 *
 * ```js
 * var extglob = require('extglob');
 * var isMatch = extglob.matcher('*.!(*a)');
 *
 * console.log(isMatch('a.a'));
 * //=> false
 * console.log(isMatch('a.b'));
 * //=> true
 * ```
 * @param {String} `pattern` Extglob pattern
 * @param {String} `options`
 * @return {Boolean}
 * @api public
 */

extglob$1.matcher = function(pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('expected pattern to be a string');
  }

  function matcher() {
    var re = extglob$1.makeRe(pattern, options);
    return function(str) {
      return re.test(str);
    };
  }

  return utils_1$2.memoize('matcher', pattern, options, matcher);
};

/**
 * Convert the given `extglob` pattern into a regex-compatible string. Returns
 * an object with the compiled result and the parsed AST.
 *
 * ```js
 * var extglob = require('extglob');
 * console.log(extglob.create('*.!(*a)').output);
 * //=> '(?!\\.)[^/]*?\\.(?!(?!\\.)[^/]*?a\\b).*?'
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {String}
 * @api public
 */

extglob$1.create = function(pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('expected pattern to be a string');
  }

  function create() {
    var ext = new extglob(options);
    var ast = ext.parse(pattern, options);
    return ext.compile(ast, options);
  }

  return utils_1$2.memoize('create', pattern, options, create);
};

/**
 * Returns an array of matches captured by `pattern` in `string`, or `null`
 * if the pattern did not match.
 *
 * ```js
 * var extglob = require('extglob');
 * extglob.capture(pattern, string[, options]);
 *
 * console.log(extglob.capture('test/*.js', 'test/foo.js'));
 * //=> ['foo']
 * console.log(extglob.capture('test/*.js', 'foo/bar.css'));
 * //=> null
 * ```
 * @param {String} `pattern` Glob pattern to use for matching.
 * @param {String} `string` String to match
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns an array of captures if the string matches the glob pattern, otherwise `null`.
 * @api public
 */

extglob$1.capture = function(pattern, str, options) {
  var re = extglob$1.makeRe(pattern, extendShallow$5({capture: true}, options));

  function match() {
    return function(string) {
      var match = re.exec(string);
      if (!match) {
        return null;
      }

      return match.slice(1);
    };
  }

  var capture = utils_1$2.memoize('capture', pattern, options, match);
  return capture(str);
};

/**
 * Create a regular expression from the given `pattern` and `options`.
 *
 * ```js
 * var extglob = require('extglob');
 * var re = extglob.makeRe('*.!(*a)');
 * console.log(re);
 * //=> /^[^\/]*?\.(?![^\/]*?a)[^\/]*?$/
 * ```
 * @param {String} `pattern` The pattern to convert to regex.
 * @param {Object} `options`
 * @return {RegExp}
 * @api public
 */

extglob$1.makeRe = function(pattern, options) {
  if (pattern instanceof RegExp) {
    return pattern;
  }

  if (typeof pattern !== 'string') {
    throw new TypeError('expected pattern to be a string');
  }

  if (pattern.length > MAX_LENGTH$3) {
    throw new Error('expected pattern to be less than ' + MAX_LENGTH$3 + ' characters');
  }

  function makeRe() {
    var opts = extendShallow$5({strictErrors: false}, options);
    if (opts.strictErrors === true) opts.strict = true;
    var res = extglob$1.create(pattern, opts);
    return toRegex$1(res.output, opts);
  }

  var regex = utils_1$2.memoize('makeRe', pattern, options, makeRe);
  if (regex.source.length > MAX_LENGTH$3) {
    throw new SyntaxError('potentially malicious regex detected');
  }

  return regex;
};

/**
 * Cache
 */

extglob$1.cache = utils_1$2.cache;
extglob$1.clearCache = function() {
  extglob$1.cache.__data__ = {};
};

/**
 * Expose `Extglob` constructor, parsers and compilers
 */

extglob$1.Extglob = extglob;
extglob$1.compilers = compilers$3;
extglob$1.parsers = parsers_1$1;

/**
 * Expose `extglob`
 * @type {Function}
 */

var extglob_1 = extglob$1;

var compilers$4 = function(snapdragon) {
  var compilers = snapdragon.compiler.compilers;
  var opts = snapdragon.options;

  // register nanomatch compilers
  snapdragon.use(nanomatch_1.compilers);

  // get references to some specific nanomatch compilers before they
  // are overridden by the extglob and/or custom compilers
  var escape = compilers.escape;
  var qmark = compilers.qmark;
  var slash = compilers.slash;
  var star = compilers.star;
  var text = compilers.text;
  var plus = compilers.plus;
  var dot = compilers.dot;

  // register extglob compilers or escape exglobs if disabled
  if (opts.extglob === false || opts.noext === true) {
    snapdragon.compiler.use(escapeExtglobs);
  } else {
    snapdragon.use(extglob_1.compilers);
  }

  snapdragon.use(function() {
    this.options.star = this.options.star || function(/*node*/) {
      return '[^\\\\/]*?';
    };
  });

  // custom micromatch compilers
  snapdragon.compiler

    // reset referenced compiler
    .set('dot', dot)
    .set('escape', escape)
    .set('plus', plus)
    .set('slash', slash)
    .set('qmark', qmark)
    .set('star', star)
    .set('text', text);
};

function escapeExtglobs(compiler) {
  compiler.set('paren', function(node) {
    var val = '';
    visit(node, function(tok) {
      if (tok.val) val += (/^\W/.test(tok.val) ? '\\' : '') + tok.val;
    });
    return this.emit(val, node);
  });

  /**
   * Visit `node` with the given `fn`
   */

  function visit(node, fn) {
    return node.nodes ? mapVisit(node.nodes, fn) : fn(node);
  }

  /**
   * Map visit over array of `nodes`.
   */

  function mapVisit(nodes, fn) {
    var len = nodes.length;
    var idx = -1;
    while (++idx < len) {
      visit(nodes[idx], fn);
    }
  }
}

var not$3;

/**
 * Characters to use in negation regex (we want to "not" match
 * characters that are matched by other parsers)
 */

var TEXT = '([!@*?+]?\\(|\\)|\\[:?(?=.*?:?\\])|:?\\]|[*+?!^$.\\\\/])+';
var createNotRegex = function(opts) {
  return not$3 || (not$3 = textRegex(TEXT));
};

/**
 * Parsers
 */

var parsers$4 = function(snapdragon) {
  var parsers = snapdragon.parser.parsers;

  // register nanomatch parsers
  snapdragon.use(nanomatch_1.parsers);

  // get references to some specific nanomatch parsers before they
  // are overridden by the extglob and/or parsers
  var escape = parsers.escape;
  var slash = parsers.slash;
  var qmark = parsers.qmark;
  var plus = parsers.plus;
  var star = parsers.star;
  var dot = parsers.dot;

  // register extglob parsers
  snapdragon.use(extglob_1.parsers);

  // custom micromatch parsers
  snapdragon.parser
    .use(function() {
      // override "notRegex" created in nanomatch parser
      this.notRegex = /^\!+(?!\()/;
    })
    // reset the referenced parsers
    .capture('escape', escape)
    .capture('slash', slash)
    .capture('qmark', qmark)
    .capture('star', star)
    .capture('plus', plus)
    .capture('dot', dot)

    /**
     * Override `text` parser
     */

    .capture('text', function() {
      if (this.isInside('bracket')) return;
      var pos = this.position();
      var m = this.match(createNotRegex(this.options));
      if (!m || !m[0]) return;

      // escape regex boundary characters and simple brackets
      var val = m[0].replace(/([[\]^$])/g, '\\$1');

      return pos({
        type: 'text',
        val: val
      });
    });
};

/**
 * Create text regex
 */

function textRegex(pattern) {
  var notStr = regexNot.create(pattern, {contains: true, strictClose: false});
  var prefix = '(?:[\\^]|\\\\|';
  return toRegex$1(prefix + notStr + ')', {strictClose: false});
}

var cache$5 = new (fragmentCache)();

var utils_1$3 = createCommonjsModule(function (module) {

var utils = module.exports;


/**
 * Module dependencies
 */


utils.define = defineProperty;
utils.diff = arrDiff;
utils.extend = extendShallow;
utils.pick = object_pick;
utils.typeOf = kindOf;
utils.unique = arrayUnique;

/**
 * Returns true if the platform is windows, or `path.sep` is `\\`.
 * This is defined as a function to allow `path.sep` to be set in unit tests,
 * or by the user, if there is a reason to do so.
 * @return {Boolean}
 */

utils.isWindows = function() {
  return path$1__default.sep === '\\' || process.platform === 'win32';
};

/**
 * Get the `Snapdragon` instance to use
 */

utils.instantiate = function(ast, options) {
  var snapdragon$1;
  // if an instance was created by `.parse`, use that instance
  if (utils.typeOf(ast) === 'object' && ast.snapdragon) {
    snapdragon$1 = ast.snapdragon;
  // if the user supplies an instance on options, use that instance
  } else if (utils.typeOf(options) === 'object' && options.snapdragon) {
    snapdragon$1 = options.snapdragon;
  // create a new instance
  } else {
    snapdragon$1 = new snapdragon(options);
  }

  utils.define(snapdragon$1, 'parse', function(str, options) {
    var parsed = snapdragon.prototype.parse.apply(this, arguments);
    parsed.input = str;

    // escape unmatched brace/bracket/parens
    var last = this.parser.stack.pop();
    if (last && this.options.strictErrors !== true) {
      var open = last.nodes[0];
      var inner = last.nodes[1];
      if (last.type === 'bracket') {
        if (inner.val.charAt(0) === '[') {
          inner.val = '\\' + inner.val;
        }

      } else {
        open.val = '\\' + open.val;
        var sibling = open.parent.nodes[1];
        if (sibling.type === 'star') {
          sibling.loose = true;
        }
      }
    }

    // add non-enumerable parser reference
    utils.define(parsed, 'parser', this.parser);
    return parsed;
  });

  return snapdragon$1;
};

/**
 * Create the key to use for memoization. The key is generated
 * by iterating over the options and concatenating key-value pairs
 * to the pattern string.
 */

utils.createKey = function(pattern, options) {
  if (utils.typeOf(options) !== 'object') {
    return pattern;
  }
  var val = pattern;
  var keys = Object.keys(options);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    val += ';' + key + '=' + String(options[key]);
  }
  return val;
};

/**
 * Cast `val` to an array
 * @return {Array}
 */

utils.arrayify = function(val) {
  if (typeof val === 'string') return [val];
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Return true if `val` is a non-empty string
 */

utils.isString = function(val) {
  return typeof val === 'string';
};

/**
 * Return true if `val` is a non-empty string
 */

utils.isObject = function(val) {
  return utils.typeOf(val) === 'object';
};

/**
 * Returns true if the given `str` has special characters
 */

utils.hasSpecialChars = function(str) {
  return /(?:(?:(^|\/)[!.])|[*?+()|\[\]{}]|[+@]\()/.test(str);
};

/**
 * Escape regex characters in the given string
 */

utils.escapeRegex = function(str) {
  return str.replace(/[-[\]{}()^$|*+?.\\\/\s]/g, '\\$&');
};

/**
 * Normalize slashes in the given filepath.
 *
 * @param {String} `filepath`
 * @return {String}
 */

utils.toPosixPath = function(str) {
  return str.replace(/\\+/g, '/');
};

/**
 * Strip backslashes before special characters in a string.
 *
 * @param {String} `str`
 * @return {String}
 */

utils.unescape = function(str) {
  return utils.toPosixPath(str.replace(/\\(?=[*+?!.])/g, ''));
};

/**
 * Strip the prefix from a filepath
 * @param {String} `fp`
 * @return {String}
 */

utils.stripPrefix = function(str) {
  if (str.charAt(0) !== '.') {
    return str;
  }
  var ch = str.charAt(1);
  if (utils.isSlash(ch)) {
    return str.slice(2);
  }
  return str;
};

/**
 * Returns true if the given str is an escaped or
 * unescaped path character
 */

utils.isSlash = function(str) {
  return str === '/' || str === '\\/' || str === '\\' || str === '\\\\';
};

/**
 * Returns a function that returns true if the given
 * pattern matches or contains a `filepath`
 *
 * @param {String} `pattern`
 * @return {Function}
 */

utils.matchPath = function(pattern, options) {
  return (options && options.contains)
    ? utils.containsPattern(pattern, options)
    : utils.equalsPattern(pattern, options);
};

/**
 * Returns true if the given (original) filepath or unixified path are equal
 * to the given pattern.
 */

utils._equals = function(filepath, unixPath, pattern) {
  return pattern === filepath || pattern === unixPath;
};

/**
 * Returns true if the given (original) filepath or unixified path contain
 * the given pattern.
 */

utils._contains = function(filepath, unixPath, pattern) {
  return filepath.indexOf(pattern) !== -1 || unixPath.indexOf(pattern) !== -1;
};

/**
 * Returns a function that returns true if the given
 * pattern is the same as a given `filepath`
 *
 * @param {String} `pattern`
 * @return {Function}
 */

utils.equalsPattern = function(pattern, options) {
  var unixify = utils.unixify(options);
  options = options || {};

  return function fn(filepath) {
    var equal = utils._equals(filepath, unixify(filepath), pattern);
    if (equal === true || options.nocase !== true) {
      return equal;
    }
    var lower = filepath.toLowerCase();
    return utils._equals(lower, unixify(lower), pattern);
  };
};

/**
 * Returns a function that returns true if the given
 * pattern contains a `filepath`
 *
 * @param {String} `pattern`
 * @return {Function}
 */

utils.containsPattern = function(pattern, options) {
  var unixify = utils.unixify(options);
  options = options || {};

  return function(filepath) {
    var contains = utils._contains(filepath, unixify(filepath), pattern);
    if (contains === true || options.nocase !== true) {
      return contains;
    }
    var lower = filepath.toLowerCase();
    return utils._contains(lower, unixify(lower), pattern);
  };
};

/**
 * Returns a function that returns true if the given
 * regex matches the `filename` of a file path.
 *
 * @param {RegExp} `re` Matching regex
 * @return {Function}
 */

utils.matchBasename = function(re) {
  return function(filepath) {
    return re.test(path$1__default.basename(filepath));
  };
};

/**
 * Determines the filepath to return based on the provided options.
 * @return {any}
 */

utils.value = function(str, unixify, options) {
  if (options && options.unixify === false) {
    return str;
  }
  return unixify(str);
};

/**
 * Returns a function that normalizes slashes in a string to forward
 * slashes, strips `./` from beginning of paths, and optionally unescapes
 * special characters.
 * @return {Function}
 */

utils.unixify = function(options) {
  options = options || {};
  return function(filepath) {
    if (utils.isWindows() || options.unixify === true) {
      filepath = utils.toPosixPath(filepath);
    }
    if (options.stripPrefix !== false) {
      filepath = utils.stripPrefix(filepath);
    }
    if (options.unescape === true) {
      filepath = utils.unescape(filepath);
    }
    return filepath;
  };
};
});

/**
 * Module dependencies
 */






/**
 * Local dependencies
 */





var MAX_LENGTH$4 = 1024 * 64;

/**
 * The main function takes a list of strings and one or more
 * glob patterns to use for matching.
 *
 * ```js
 * var mm = require('micromatch');
 * mm(list, patterns[, options]);
 *
 * console.log(mm(['a.js', 'a.txt'], ['*.js']));
 * //=> [ 'a.js' ]
 * ```
 * @param {Array} `list` A list of strings to match
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Array} Returns an array of matches
 * @summary false
 * @api public
 */

function micromatch(list, patterns, options) {
  patterns = utils_1$3.arrayify(patterns);
  list = utils_1$3.arrayify(list);

  var len = patterns.length;
  if (list.length === 0 || len === 0) {
    return [];
  }

  if (len === 1) {
    return micromatch.match(list, patterns[0], options);
  }

  var omit = [];
  var keep = [];
  var idx = -1;

  while (++idx < len) {
    var pattern = patterns[idx];

    if (typeof pattern === 'string' && pattern.charCodeAt(0) === 33 /* ! */) {
      omit.push.apply(omit, micromatch.match(list, pattern.slice(1), options));
    } else {
      keep.push.apply(keep, micromatch.match(list, pattern, options));
    }
  }

  var matches = utils_1$3.diff(keep, omit);
  if (!options || options.nodupes !== false) {
    return utils_1$3.unique(matches);
  }

  return matches;
}

/**
 * Similar to the main function, but `pattern` must be a string.
 *
 * ```js
 * var mm = require('micromatch');
 * mm.match(list, pattern[, options]);
 *
 * console.log(mm.match(['a.a', 'a.aa', 'a.b', 'a.c'], '*.a'));
 * //=> ['a.a', 'a.aa']
 * ```
 * @param {Array} `list` Array of strings to match
 * @param {String} `pattern` Glob pattern to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Array} Returns an array of matches
 * @api public
 */

micromatch.match = function(list, pattern, options) {
  if (Array.isArray(pattern)) {
    throw new TypeError('expected pattern to be a string');
  }

  var unixify = utils_1$3.unixify(options);
  var isMatch = memoize$3('match', pattern, options, micromatch.matcher);
  var matches = [];

  list = utils_1$3.arrayify(list);
  var len = list.length;
  var idx = -1;

  while (++idx < len) {
    var ele = list[idx];
    if (ele === pattern || isMatch(ele)) {
      matches.push(utils_1$3.value(ele, unixify, options));
    }
  }

  // if no options were passed, uniquify results and return
  if (typeof options === 'undefined') {
    return utils_1$3.unique(matches);
  }

  if (matches.length === 0) {
    if (options.failglob === true) {
      throw new Error('no matches found for "' + pattern + '"');
    }
    if (options.nonull === true || options.nullglob === true) {
      return [options.unescape ? utils_1$3.unescape(pattern) : pattern];
    }
  }

  // if `opts.ignore` was defined, diff ignored list
  if (options.ignore) {
    matches = micromatch.not(matches, options.ignore, options);
  }

  return options.nodupes !== false ? utils_1$3.unique(matches) : matches;
};

/**
 * Returns true if the specified `string` matches the given glob `pattern`.
 *
 * ```js
 * var mm = require('micromatch');
 * mm.isMatch(string, pattern[, options]);
 *
 * console.log(mm.isMatch('a.a', '*.a'));
 * //=> true
 * console.log(mm.isMatch('a.b', '*.a'));
 * //=> false
 * ```
 * @param {String} `string` String to match
 * @param {String} `pattern` Glob pattern to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if the string matches the glob pattern.
 * @api public
 */

micromatch.isMatch = function(str, pattern, options) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string: "' + util$3.inspect(str) + '"');
  }

  if (isEmptyString(str) || isEmptyString(pattern)) {
    return false;
  }

  var equals = utils_1$3.equalsPattern(options);
  if (equals(str)) {
    return true;
  }

  var isMatch = memoize$3('isMatch', pattern, options, micromatch.matcher);
  return isMatch(str);
};

/**
 * Returns true if some of the strings in the given `list` match any of the
 * given glob `patterns`.
 *
 * ```js
 * var mm = require('micromatch');
 * mm.some(list, patterns[, options]);
 *
 * console.log(mm.some(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
 * // true
 * console.log(mm.some(['foo.js'], ['*.js', '!foo.js']));
 * // false
 * ```
 * @param  {String|Array} `list` The string or array of strings to test. Returns as soon as the first match is found.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch.some = function(list, patterns, options) {
  if (typeof list === 'string') {
    list = [list];
  }
  for (var i = 0; i < list.length; i++) {
    if (micromatch(list[i], patterns, options).length === 1) {
      return true;
    }
  }
  return false;
};

/**
 * Returns true if every string in the given `list` matches
 * any of the given glob `patterns`.
 *
 * ```js
 * var mm = require('micromatch');
 * mm.every(list, patterns[, options]);
 *
 * console.log(mm.every('foo.js', ['foo.js']));
 * // true
 * console.log(mm.every(['foo.js', 'bar.js'], ['*.js']));
 * // true
 * console.log(mm.every(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
 * // false
 * console.log(mm.every(['foo.js'], ['*.js', '!foo.js']));
 * // false
 * ```
 * @param  {String|Array} `list` The string or array of strings to test.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch.every = function(list, patterns, options) {
  if (typeof list === 'string') {
    list = [list];
  }
  for (var i = 0; i < list.length; i++) {
    if (micromatch(list[i], patterns, options).length !== 1) {
      return false;
    }
  }
  return true;
};

/**
 * Returns true if **any** of the given glob `patterns`
 * match the specified `string`.
 *
 * ```js
 * var mm = require('micromatch');
 * mm.any(string, patterns[, options]);
 *
 * console.log(mm.any('a.a', ['b.*', '*.a']));
 * //=> true
 * console.log(mm.any('a.a', 'b.*'));
 * //=> false
 * ```
 * @param  {String|Array} `str` The string to test.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch.any = function(str, patterns, options) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string: "' + util$3.inspect(str) + '"');
  }

  if (isEmptyString(str) || isEmptyString(patterns)) {
    return false;
  }

  if (typeof patterns === 'string') {
    patterns = [patterns];
  }

  for (var i = 0; i < patterns.length; i++) {
    if (micromatch.isMatch(str, patterns[i], options)) {
      return true;
    }
  }
  return false;
};

/**
 * Returns true if **all** of the given `patterns` match
 * the specified string.
 *
 * ```js
 * var mm = require('micromatch');
 * mm.all(string, patterns[, options]);
 *
 * console.log(mm.all('foo.js', ['foo.js']));
 * // true
 *
 * console.log(mm.all('foo.js', ['*.js', '!foo.js']));
 * // false
 *
 * console.log(mm.all('foo.js', ['*.js', 'foo.js']));
 * // true
 *
 * console.log(mm.all('foo.js', ['*.js', 'f*', '*o*', '*o.js']));
 * // true
 * ```
 * @param  {String|Array} `str` The string to test.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch.all = function(str, patterns, options) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string: "' + util$3.inspect(str) + '"');
  }
  if (typeof patterns === 'string') {
    patterns = [patterns];
  }
  for (var i = 0; i < patterns.length; i++) {
    if (!micromatch.isMatch(str, patterns[i], options)) {
      return false;
    }
  }
  return true;
};

/**
 * Returns a list of strings that _**do not match any**_ of the given `patterns`.
 *
 * ```js
 * var mm = require('micromatch');
 * mm.not(list, patterns[, options]);
 *
 * console.log(mm.not(['a.a', 'b.b', 'c.c'], '*.a'));
 * //=> ['b.b', 'c.c']
 * ```
 * @param {Array} `list` Array of strings to match.
 * @param {String|Array} `patterns` One or more glob pattern to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Array} Returns an array of strings that **do not match** the given patterns.
 * @api public
 */

micromatch.not = function(list, patterns, options) {
  var opts = extendShallow({}, options);
  var ignore = opts.ignore;
  delete opts.ignore;

  var unixify = utils_1$3.unixify(opts);
  list = utils_1$3.arrayify(list).map(unixify);

  var matches = utils_1$3.diff(list, micromatch(list, patterns, opts));
  if (ignore) {
    matches = utils_1$3.diff(matches, micromatch(list, ignore));
  }

  return opts.nodupes !== false ? utils_1$3.unique(matches) : matches;
};

/**
 * Returns true if the given `string` contains the given pattern. Similar
 * to [.isMatch](#isMatch) but the pattern can match any part of the string.
 *
 * ```js
 * var mm = require('micromatch');
 * mm.contains(string, pattern[, options]);
 *
 * console.log(mm.contains('aa/bb/cc', '*b'));
 * //=> true
 * console.log(mm.contains('aa/bb/cc', '*d'));
 * //=> false
 * ```
 * @param {String} `str` The string to match.
 * @param {String|Array} `patterns` Glob pattern to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if the patter matches any part of `str`.
 * @api public
 */

micromatch.contains = function(str, patterns, options) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string: "' + util$3.inspect(str) + '"');
  }

  if (typeof patterns === 'string') {
    if (isEmptyString(str) || isEmptyString(patterns)) {
      return false;
    }

    var equals = utils_1$3.equalsPattern(patterns, options);
    if (equals(str)) {
      return true;
    }
    var contains = utils_1$3.containsPattern(patterns, options);
    if (contains(str)) {
      return true;
    }
  }

  var opts = extendShallow({}, options, {contains: true});
  return micromatch.any(str, patterns, opts);
};

/**
 * Returns true if the given pattern and options should enable
 * the `matchBase` option.
 * @return {Boolean}
 * @api private
 */

micromatch.matchBase = function(pattern, options) {
  if (pattern && pattern.indexOf('/') !== -1 || !options) return false;
  return options.basename === true || options.matchBase === true;
};

/**
 * Filter the keys of the given object with the given `glob` pattern
 * and `options`. Does not attempt to match nested keys. If you need this feature,
 * use [glob-object][] instead.
 *
 * ```js
 * var mm = require('micromatch');
 * mm.matchKeys(object, patterns[, options]);
 *
 * var obj = { aa: 'a', ab: 'b', ac: 'c' };
 * console.log(mm.matchKeys(obj, '*b'));
 * //=> { ab: 'b' }
 * ```
 * @param {Object} `object` The object with keys to filter.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Object} Returns an object with only keys that match the given patterns.
 * @api public
 */

micromatch.matchKeys = function(obj, patterns, options) {
  if (!utils_1$3.isObject(obj)) {
    throw new TypeError('expected the first argument to be an object');
  }
  var keys = micromatch(Object.keys(obj), patterns, options);
  return utils_1$3.pick(obj, keys);
};

/**
 * Returns a memoized matcher function from the given glob `pattern` and `options`.
 * The returned function takes a string to match as its only argument and returns
 * true if the string is a match.
 *
 * ```js
 * var mm = require('micromatch');
 * mm.matcher(pattern[, options]);
 *
 * var isMatch = mm.matcher('*.!(*a)');
 * console.log(isMatch('a.a'));
 * //=> false
 * console.log(isMatch('a.b'));
 * //=> true
 * ```
 * @param {String} `pattern` Glob pattern
 * @param {Object} `options` See available [options](#options) for changing how matches are performed.
 * @return {Function} Returns a matcher function.
 * @api public
 */

micromatch.matcher = function matcher(pattern, options) {
  if (Array.isArray(pattern)) {
    return compose$1(pattern, options, matcher);
  }

  // if pattern is a regex
  if (pattern instanceof RegExp) {
    return test(pattern);
  }

  // if pattern is invalid
  if (!utils_1$3.isString(pattern)) {
    throw new TypeError('expected pattern to be an array, string or regex');
  }

  // if pattern is a non-glob string
  if (!utils_1$3.hasSpecialChars(pattern)) {
    if (options && options.nocase === true) {
      pattern = pattern.toLowerCase();
    }
    return utils_1$3.matchPath(pattern, options);
  }

  // if pattern is a glob string
  var re = micromatch.makeRe(pattern, options);

  // if `options.matchBase` or `options.basename` is defined
  if (micromatch.matchBase(pattern, options)) {
    return utils_1$3.matchBasename(re, options);
  }

  function test(regex) {
    var equals = utils_1$3.equalsPattern(options);
    var unixify = utils_1$3.unixify(options);

    return function(str) {
      if (equals(str)) {
        return true;
      }

      if (regex.test(unixify(str))) {
        return true;
      }
      return false;
    };
  }

  var fn = test(re);
  Object.defineProperty(fn, 'result', {
    configurable: true,
    enumerable: false,
    value: re.result
  });
  return fn;
};

/**
 * Returns an array of matches captured by `pattern` in `string, or `null` if the pattern did not match.
 *
 * ```js
 * var mm = require('micromatch');
 * mm.capture(pattern, string[, options]);
 *
 * console.log(mm.capture('test/*.js', 'test/foo.js'));
 * //=> ['foo']
 * console.log(mm.capture('test/*.js', 'foo/bar.css'));
 * //=> null
 * ```
 * @param {String} `pattern` Glob pattern to use for matching.
 * @param {String} `string` String to match
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns an array of captures if the string matches the glob pattern, otherwise `null`.
 * @api public
 */

micromatch.capture = function(pattern, str, options) {
  var re = micromatch.makeRe(pattern, extendShallow({capture: true}, options));
  var unixify = utils_1$3.unixify(options);

  function match() {
    return function(string) {
      var match = re.exec(unixify(string));
      if (!match) {
        return null;
      }

      return match.slice(1);
    };
  }

  var capture = memoize$3('capture', pattern, options, match);
  return capture(str);
};

/**
 * Create a regular expression from the given glob `pattern`.
 *
 * ```js
 * var mm = require('micromatch');
 * mm.makeRe(pattern[, options]);
 *
 * console.log(mm.makeRe('*.js'));
 * //=> /^(?:(\.[\\\/])?(?!\.)(?=.)[^\/]*?\.js)$/
 * ```
 * @param {String} `pattern` A glob pattern to convert to regex.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed.
 * @return {RegExp} Returns a regex created from the given pattern.
 * @api public
 */

micromatch.makeRe = function(pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('expected pattern to be a string');
  }

  if (pattern.length > MAX_LENGTH$4) {
    throw new Error('expected pattern to be less than ' + MAX_LENGTH$4 + ' characters');
  }

  function makeRe() {
    var result = micromatch.create(pattern, options);
    var ast_array = [];
    var output = result.map(function(obj) {
      obj.ast.state = obj.state;
      ast_array.push(obj.ast);
      return obj.output;
    });

    var regex = toRegex$1(output.join('|'), options);
    Object.defineProperty(regex, 'result', {
      configurable: true,
      enumerable: false,
      value: ast_array
    });
    return regex;
  }

  return memoize$3('makeRe', pattern, options, makeRe);
};

/**
 * Expand the given brace `pattern`.
 *
 * ```js
 * var mm = require('micromatch');
 * console.log(mm.braces('foo/{a,b}/bar'));
 * //=> ['foo/(a|b)/bar']
 *
 * console.log(mm.braces('foo/{a,b}/bar', {expand: true}));
 * //=> ['foo/(a|b)/bar']
 * ```
 * @param {String} `pattern` String with brace pattern to expand.
 * @param {Object} `options` Any [options](#options) to change how expansion is performed. See the [braces][] library for all available options.
 * @return {Array}
 * @api public
 */

micromatch.braces = function(pattern, options) {
  if (typeof pattern !== 'string' && !Array.isArray(pattern)) {
    throw new TypeError('expected pattern to be an array or string');
  }

  function expand() {
    if (options && options.nobrace === true || !/\{.*\}/.test(pattern)) {
      return utils_1$3.arrayify(pattern);
    }
    return braces_1(pattern, options);
  }

  return memoize$3('braces', pattern, options, expand);
};

/**
 * Proxy to the [micromatch.braces](#method), for parity with
 * minimatch.
 */

micromatch.braceExpand = function(pattern, options) {
  var opts = extendShallow({}, options, {expand: true});
  return micromatch.braces(pattern, opts);
};

/**
 * Parses the given glob `pattern` and returns an array of abstract syntax
 * trees (ASTs), with the compiled `output` and optional source `map` on
 * each AST.
 *
 * ```js
 * var mm = require('micromatch');
 * mm.create(pattern[, options]);
 *
 * console.log(mm.create('abc/*.js'));
 * // [{ options: { source: 'string', sourcemap: true },
 * //   state: {},
 * //   compilers:
 * //    { ... },
 * //   output: '(\\.[\\\\\\/])?abc\\/(?!\\.)(?=.)[^\\/]*?\\.js',
 * //   ast:
 * //    { type: 'root',
 * //      errors: [],
 * //      nodes:
 * //       [ ... ],
 * //      dot: false,
 * //      input: 'abc/*.js' },
 * //   parsingErrors: [],
 * //   map:
 * //    { version: 3,
 * //      sources: [ 'string' ],
 * //      names: [],
 * //      mappings: 'AAAA,GAAG,EAAC,kBAAC,EAAC,EAAE',
 * //      sourcesContent: [ 'abc/*.js' ] },
 * //   position: { line: 1, column: 28 },
 * //   content: {},
 * //   files: {},
 * //   idx: 6 }]
 * ```
 * @param {String} `pattern` Glob pattern to parse and compile.
 * @param {Object} `options` Any [options](#options) to change how parsing and compiling is performed.
 * @return {Object} Returns an object with the parsed AST, compiled string and optional source map.
 * @api public
 */

micromatch.create = function(pattern, options) {
  return memoize$3('create', pattern, options, function() {
    function create(str, opts) {
      return micromatch.compile(micromatch.parse(str, opts), opts);
    }

    pattern = micromatch.braces(pattern, options);
    var len = pattern.length;
    var idx = -1;
    var res = [];

    while (++idx < len) {
      res.push(create(pattern[idx], options));
    }
    return res;
  });
};

/**
 * Parse the given `str` with the given `options`.
 *
 * ```js
 * var mm = require('micromatch');
 * mm.parse(pattern[, options]);
 *
 * var ast = mm.parse('a/{b,c}/d');
 * console.log(ast);
 * // { type: 'root',
 * //   errors: [],
 * //   input: 'a/{b,c}/d',
 * //   nodes:
 * //    [ { type: 'bos', val: '' },
 * //      { type: 'text', val: 'a/' },
 * //      { type: 'brace',
 * //        nodes:
 * //         [ { type: 'brace.open', val: '{' },
 * //           { type: 'text', val: 'b,c' },
 * //           { type: 'brace.close', val: '}' } ] },
 * //      { type: 'text', val: '/d' },
 * //      { type: 'eos', val: '' } ] }
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {Object} Returns an AST
 * @api public
 */

micromatch.parse = function(pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('expected a string');
  }

  function parse() {
    var snapdragon = utils_1$3.instantiate(null, options);
    parsers$4(snapdragon);

    var ast = snapdragon.parse(pattern, options);
    utils_1$3.define(ast, 'snapdragon', snapdragon);
    ast.input = pattern;
    return ast;
  }

  return memoize$3('parse', pattern, options, parse);
};

/**
 * Compile the given `ast` or string with the given `options`.
 *
 * ```js
 * var mm = require('micromatch');
 * mm.compile(ast[, options]);
 *
 * var ast = mm.parse('a/{b,c}/d');
 * console.log(mm.compile(ast));
 * // { options: { source: 'string' },
 * //   state: {},
 * //   compilers:
 * //    { eos: [Function],
 * //      noop: [Function],
 * //      bos: [Function],
 * //      brace: [Function],
 * //      'brace.open': [Function],
 * //      text: [Function],
 * //      'brace.close': [Function] },
 * //   output: [ 'a/(b|c)/d' ],
 * //   ast:
 * //    { ... },
 * //   parsingErrors: [] }
 * ```
 * @param {Object|String} `ast`
 * @param {Object} `options`
 * @return {Object} Returns an object that has an `output` property with the compiled string.
 * @api public
 */

micromatch.compile = function(ast, options) {
  if (typeof ast === 'string') {
    ast = micromatch.parse(ast, options);
  }

  return memoize$3('compile', ast.input, options, function() {
    var snapdragon = utils_1$3.instantiate(ast, options);
    compilers$4(snapdragon);
    return snapdragon.compile(ast, options);
  });
};

/**
 * Clear the regex cache.
 *
 * ```js
 * mm.clearCache();
 * ```
 * @api public
 */

micromatch.clearCache = function() {
  micromatch.cache.caches = {};
};

/**
 * Returns true if the given value is effectively an empty string
 */

function isEmptyString(val) {
  return String(val) === '' || String(val) === './';
}

/**
 * Compose a matcher function with the given patterns.
 * This allows matcher functions to be compiled once and
 * called multiple times.
 */

function compose$1(patterns, options, matcher) {
  var matchers;

  return memoize$3('compose', String(patterns), options, function() {
    return function(file) {
      // delay composition until it's invoked the first time,
      // after that it won't be called again
      if (!matchers) {
        matchers = [];
        for (var i = 0; i < patterns.length; i++) {
          matchers.push(matcher(patterns[i], options));
        }
      }

      var len = matchers.length;
      while (len--) {
        if (matchers[len](file) === true) {
          return true;
        }
      }
      return false;
    };
  });
}

/**
 * Memoize a generated regex or function. A unique key is generated
 * from the `type` (usually method name), the `pattern`, and
 * user-defined options.
 */

function memoize$3(type, pattern, options, fn) {
  var key = utils_1$3.createKey(type + '=' + pattern, options);

  if (options && options.cache === false) {
    return fn(pattern, options);
  }

  if (cache$5.has(type, key)) {
    return cache$5.get(type, key);
  }

  var val = fn(pattern, options);
  cache$5.set(type, key, val);
  return val;
}

/**
 * Expose compiler, parser and cache on `micromatch`
 */

micromatch.compilers = compilers$4;
micromatch.parsers = parsers$4;
micromatch.caches = cache$5.caches;

/**
 * Expose `micromatch`
 * @type {Function}
 */

var micromatch_1 = micromatch;

var slash = input => {
	const isExtendedLengthPath = /^\\\\\?\\/.test(input);
	const hasNonAscii = /[^\u0000-\u0080]+/.test(input); // eslint-disable-line no-control-regex

	if (isExtendedLengthPath || hasNonAscii) {
		return input;
	}

	return input.replace(/\\/g, '/');
};

var jsTokens = createCommonjsModule(function (module, exports) {
// Copyright 2014, 2015, 2016, 2017, 2018 Simon Lydell
// License: MIT. (See LICENSE.)

Object.defineProperty(exports, "__esModule", {
  value: true
});

// This regex comes from regex.coffee, and is inserted here by generate-index.js
// (run `npm run build`).
exports.default = /((['"])(?:(?!\2|\\).|\\(?:\r\n|[\s\S]))*(\2)?|`(?:[^`\\$]|\\[\s\S]|\$(?!\{)|\$\{(?:[^{}]|\{[^}]*\}?)*\}?)*(`)?)|(\/\/.*)|(\/\*(?:[^*]|\*(?!\/))*(\*\/)?)|(\/(?!\*)(?:\[(?:(?![\]\\]).|\\.)*\]|(?![\/\]\\]).|\\.)+\/(?:(?!\s*(?:\b|[\u0080-\uFFFF$\\'"~({]|[+\-!](?!=)|\.?\d))|[gmiyus]{1,6}\b(?![\u0080-\uFFFF$\\]|\s*(?:[+\-*%&|^<>!=?({]|\/(?![\/*])))))|(0[xX][\da-fA-F]+|0[oO][0-7]+|0[bB][01]+|(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?)|((?!\d)(?:(?!\s)[$\w\u0080-\uFFFF]|\\u[\da-fA-F]{4}|\\u\{[\da-fA-F]+\})+)|(--|\+\+|&&|\|\||=>|\.{3}|(?:[+\-\/%&|^]|\*{1,2}|<{1,2}|>{1,3}|!=?|={1,2})=?|[?~.,:;[\](){}])|(\s+)|(^$|[\s\S])/g;

exports.matchToToken = function(match) {
  var token = {type: "invalid", value: match[0], closed: undefined};
       if (match[ 1]) token.type = "string" , token.closed = !!(match[3] || match[4]);
  else if (match[ 5]) token.type = "comment";
  else if (match[ 6]) token.type = "comment", token.closed = !!match[7];
  else if (match[ 8]) token.type = "regex";
  else if (match[ 9]) token.type = "number";
  else if (match[10]) token.type = "name";
  else if (match[11]) token.type = "punctuator";
  else if (match[12]) token.type = "whitespace";
  return token
};
});

unwrapExports(jsTokens);
var jsTokens_1 = jsTokens.matchToToken;

var ast = createCommonjsModule(function (module) {
/*
  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 'AS IS'
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function () {

    function isExpression(node) {
        if (node == null) { return false; }
        switch (node.type) {
            case 'ArrayExpression':
            case 'AssignmentExpression':
            case 'BinaryExpression':
            case 'CallExpression':
            case 'ConditionalExpression':
            case 'FunctionExpression':
            case 'Identifier':
            case 'Literal':
            case 'LogicalExpression':
            case 'MemberExpression':
            case 'NewExpression':
            case 'ObjectExpression':
            case 'SequenceExpression':
            case 'ThisExpression':
            case 'UnaryExpression':
            case 'UpdateExpression':
                return true;
        }
        return false;
    }

    function isIterationStatement(node) {
        if (node == null) { return false; }
        switch (node.type) {
            case 'DoWhileStatement':
            case 'ForInStatement':
            case 'ForStatement':
            case 'WhileStatement':
                return true;
        }
        return false;
    }

    function isStatement(node) {
        if (node == null) { return false; }
        switch (node.type) {
            case 'BlockStatement':
            case 'BreakStatement':
            case 'ContinueStatement':
            case 'DebuggerStatement':
            case 'DoWhileStatement':
            case 'EmptyStatement':
            case 'ExpressionStatement':
            case 'ForInStatement':
            case 'ForStatement':
            case 'IfStatement':
            case 'LabeledStatement':
            case 'ReturnStatement':
            case 'SwitchStatement':
            case 'ThrowStatement':
            case 'TryStatement':
            case 'VariableDeclaration':
            case 'WhileStatement':
            case 'WithStatement':
                return true;
        }
        return false;
    }

    function isSourceElement(node) {
      return isStatement(node) || node != null && node.type === 'FunctionDeclaration';
    }

    function trailingStatement(node) {
        switch (node.type) {
        case 'IfStatement':
            if (node.alternate != null) {
                return node.alternate;
            }
            return node.consequent;

        case 'LabeledStatement':
        case 'ForStatement':
        case 'ForInStatement':
        case 'WhileStatement':
        case 'WithStatement':
            return node.body;
        }
        return null;
    }

    function isProblematicIfStatement(node) {
        var current;

        if (node.type !== 'IfStatement') {
            return false;
        }
        if (node.alternate == null) {
            return false;
        }
        current = node.consequent;
        do {
            if (current.type === 'IfStatement') {
                if (current.alternate == null)  {
                    return true;
                }
            }
            current = trailingStatement(current);
        } while (current);

        return false;
    }

    module.exports = {
        isExpression: isExpression,
        isStatement: isStatement,
        isIterationStatement: isIterationStatement,
        isSourceElement: isSourceElement,
        isProblematicIfStatement: isProblematicIfStatement,

        trailingStatement: trailingStatement
    };
}());
/* vim: set sw=4 ts=4 et tw=80 : */
});
var ast_1 = ast.isExpression;
var ast_2 = ast.isStatement;
var ast_3 = ast.isIterationStatement;
var ast_4 = ast.isSourceElement;
var ast_5 = ast.isProblematicIfStatement;
var ast_6 = ast.trailingStatement;

var code = createCommonjsModule(function (module) {
/*
  Copyright (C) 2013-2014 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2014 Ivan Nikulin <ifaaan@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function () {

    var ES6Regex, ES5Regex, NON_ASCII_WHITESPACES, IDENTIFIER_START, IDENTIFIER_PART, ch;

    // See `tools/generate-identifier-regex.js`.
    ES5Regex = {
        // ECMAScript 5.1/Unicode v9.0.0 NonAsciiIdentifierStart:
        NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
        // ECMAScript 5.1/Unicode v9.0.0 NonAsciiIdentifierPart:
        NonAsciiIdentifierPart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/
    };

    ES6Regex = {
        // ECMAScript 6/Unicode v9.0.0 NonAsciiIdentifierStart:
        NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/,
        // ECMAScript 6/Unicode v9.0.0 NonAsciiIdentifierPart:
        NonAsciiIdentifierPart: /[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
    };

    function isDecimalDigit(ch) {
        return 0x30 <= ch && ch <= 0x39;  // 0..9
    }

    function isHexDigit(ch) {
        return 0x30 <= ch && ch <= 0x39 ||  // 0..9
            0x61 <= ch && ch <= 0x66 ||     // a..f
            0x41 <= ch && ch <= 0x46;       // A..F
    }

    function isOctalDigit(ch) {
        return ch >= 0x30 && ch <= 0x37;  // 0..7
    }

    // 7.2 White Space

    NON_ASCII_WHITESPACES = [
        0x1680,
        0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A,
        0x202F, 0x205F,
        0x3000,
        0xFEFF
    ];

    function isWhiteSpace(ch) {
        return ch === 0x20 || ch === 0x09 || ch === 0x0B || ch === 0x0C || ch === 0xA0 ||
            ch >= 0x1680 && NON_ASCII_WHITESPACES.indexOf(ch) >= 0;
    }

    // 7.3 Line Terminators

    function isLineTerminator(ch) {
        return ch === 0x0A || ch === 0x0D || ch === 0x2028 || ch === 0x2029;
    }

    // 7.6 Identifier Names and Identifiers

    function fromCodePoint(cp) {
        if (cp <= 0xFFFF) { return String.fromCharCode(cp); }
        var cu1 = String.fromCharCode(Math.floor((cp - 0x10000) / 0x400) + 0xD800);
        var cu2 = String.fromCharCode(((cp - 0x10000) % 0x400) + 0xDC00);
        return cu1 + cu2;
    }

    IDENTIFIER_START = new Array(0x80);
    for(ch = 0; ch < 0x80; ++ch) {
        IDENTIFIER_START[ch] =
            ch >= 0x61 && ch <= 0x7A ||  // a..z
            ch >= 0x41 && ch <= 0x5A ||  // A..Z
            ch === 0x24 || ch === 0x5F;  // $ (dollar) and _ (underscore)
    }

    IDENTIFIER_PART = new Array(0x80);
    for(ch = 0; ch < 0x80; ++ch) {
        IDENTIFIER_PART[ch] =
            ch >= 0x61 && ch <= 0x7A ||  // a..z
            ch >= 0x41 && ch <= 0x5A ||  // A..Z
            ch >= 0x30 && ch <= 0x39 ||  // 0..9
            ch === 0x24 || ch === 0x5F;  // $ (dollar) and _ (underscore)
    }

    function isIdentifierStartES5(ch) {
        return ch < 0x80 ? IDENTIFIER_START[ch] : ES5Regex.NonAsciiIdentifierStart.test(fromCodePoint(ch));
    }

    function isIdentifierPartES5(ch) {
        return ch < 0x80 ? IDENTIFIER_PART[ch] : ES5Regex.NonAsciiIdentifierPart.test(fromCodePoint(ch));
    }

    function isIdentifierStartES6(ch) {
        return ch < 0x80 ? IDENTIFIER_START[ch] : ES6Regex.NonAsciiIdentifierStart.test(fromCodePoint(ch));
    }

    function isIdentifierPartES6(ch) {
        return ch < 0x80 ? IDENTIFIER_PART[ch] : ES6Regex.NonAsciiIdentifierPart.test(fromCodePoint(ch));
    }

    module.exports = {
        isDecimalDigit: isDecimalDigit,
        isHexDigit: isHexDigit,
        isOctalDigit: isOctalDigit,
        isWhiteSpace: isWhiteSpace,
        isLineTerminator: isLineTerminator,
        isIdentifierStartES5: isIdentifierStartES5,
        isIdentifierPartES5: isIdentifierPartES5,
        isIdentifierStartES6: isIdentifierStartES6,
        isIdentifierPartES6: isIdentifierPartES6
    };
}());
/* vim: set sw=4 ts=4 et tw=80 : */
});
var code_1 = code.isDecimalDigit;
var code_2 = code.isHexDigit;
var code_3 = code.isOctalDigit;
var code_4 = code.isWhiteSpace;
var code_5 = code.isLineTerminator;
var code_6 = code.isIdentifierStartES5;
var code_7 = code.isIdentifierPartES5;
var code_8 = code.isIdentifierStartES6;
var code_9 = code.isIdentifierPartES6;

var keyword = createCommonjsModule(function (module) {
/*
  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function () {

    var code$1 = code;

    function isStrictModeReservedWordES6(id) {
        switch (id) {
        case 'implements':
        case 'interface':
        case 'package':
        case 'private':
        case 'protected':
        case 'public':
        case 'static':
        case 'let':
            return true;
        default:
            return false;
        }
    }

    function isKeywordES5(id, strict) {
        // yield should not be treated as keyword under non-strict mode.
        if (!strict && id === 'yield') {
            return false;
        }
        return isKeywordES6(id, strict);
    }

    function isKeywordES6(id, strict) {
        if (strict && isStrictModeReservedWordES6(id)) {
            return true;
        }

        switch (id.length) {
        case 2:
            return (id === 'if') || (id === 'in') || (id === 'do');
        case 3:
            return (id === 'var') || (id === 'for') || (id === 'new') || (id === 'try');
        case 4:
            return (id === 'this') || (id === 'else') || (id === 'case') ||
                (id === 'void') || (id === 'with') || (id === 'enum');
        case 5:
            return (id === 'while') || (id === 'break') || (id === 'catch') ||
                (id === 'throw') || (id === 'const') || (id === 'yield') ||
                (id === 'class') || (id === 'super');
        case 6:
            return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
                (id === 'switch') || (id === 'export') || (id === 'import');
        case 7:
            return (id === 'default') || (id === 'finally') || (id === 'extends');
        case 8:
            return (id === 'function') || (id === 'continue') || (id === 'debugger');
        case 10:
            return (id === 'instanceof');
        default:
            return false;
        }
    }

    function isReservedWordES5(id, strict) {
        return id === 'null' || id === 'true' || id === 'false' || isKeywordES5(id, strict);
    }

    function isReservedWordES6(id, strict) {
        return id === 'null' || id === 'true' || id === 'false' || isKeywordES6(id, strict);
    }

    function isRestrictedWord(id) {
        return id === 'eval' || id === 'arguments';
    }

    function isIdentifierNameES5(id) {
        var i, iz, ch;

        if (id.length === 0) { return false; }

        ch = id.charCodeAt(0);
        if (!code$1.isIdentifierStartES5(ch)) {
            return false;
        }

        for (i = 1, iz = id.length; i < iz; ++i) {
            ch = id.charCodeAt(i);
            if (!code$1.isIdentifierPartES5(ch)) {
                return false;
            }
        }
        return true;
    }

    function decodeUtf16(lead, trail) {
        return (lead - 0xD800) * 0x400 + (trail - 0xDC00) + 0x10000;
    }

    function isIdentifierNameES6(id) {
        var i, iz, ch, lowCh, check;

        if (id.length === 0) { return false; }

        check = code$1.isIdentifierStartES6;
        for (i = 0, iz = id.length; i < iz; ++i) {
            ch = id.charCodeAt(i);
            if (0xD800 <= ch && ch <= 0xDBFF) {
                ++i;
                if (i >= iz) { return false; }
                lowCh = id.charCodeAt(i);
                if (!(0xDC00 <= lowCh && lowCh <= 0xDFFF)) {
                    return false;
                }
                ch = decodeUtf16(ch, lowCh);
            }
            if (!check(ch)) {
                return false;
            }
            check = code$1.isIdentifierPartES6;
        }
        return true;
    }

    function isIdentifierES5(id, strict) {
        return isIdentifierNameES5(id) && !isReservedWordES5(id, strict);
    }

    function isIdentifierES6(id, strict) {
        return isIdentifierNameES6(id) && !isReservedWordES6(id, strict);
    }

    module.exports = {
        isKeywordES5: isKeywordES5,
        isKeywordES6: isKeywordES6,
        isReservedWordES5: isReservedWordES5,
        isReservedWordES6: isReservedWordES6,
        isRestrictedWord: isRestrictedWord,
        isIdentifierNameES5: isIdentifierNameES5,
        isIdentifierNameES6: isIdentifierNameES6,
        isIdentifierES5: isIdentifierES5,
        isIdentifierES6: isIdentifierES6
    };
}());
/* vim: set sw=4 ts=4 et tw=80 : */
});
var keyword_1 = keyword.isKeywordES5;
var keyword_2 = keyword.isKeywordES6;
var keyword_3 = keyword.isReservedWordES5;
var keyword_4 = keyword.isReservedWordES6;
var keyword_5 = keyword.isRestrictedWord;
var keyword_6 = keyword.isIdentifierNameES5;
var keyword_7 = keyword.isIdentifierNameES6;
var keyword_8 = keyword.isIdentifierES5;
var keyword_9 = keyword.isIdentifierES6;

var utils$2 = createCommonjsModule(function (module, exports) {
/*
  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


(function () {

    exports.ast = ast;
    exports.code = code;
    exports.keyword = keyword;
}());
/* vim: set sw=4 ts=4 et tw=80 : */
});
var utils_1$4 = utils$2.ast;
var utils_2 = utils$2.code;
var utils_3 = utils$2.keyword;

var lib$1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shouldHighlight = shouldHighlight;
exports.getChalk = getChalk;
exports.default = highlight;

function _jsTokens() {
  const data = _interopRequireWildcard(jsTokens);

  _jsTokens = function () {
    return data;
  };

  return data;
}

function _esutils() {
  const data = _interopRequireDefault(utils$2);

  _esutils = function () {
    return data;
  };

  return data;
}

function _chalk() {
  const data = _interopRequireDefault(ansiColors);

  _chalk = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function getDefs(chalk) {
  return {
    keyword: chalk.cyan,
    capitalized: chalk.yellow,
    jsx_tag: chalk.yellow,
    punctuator: chalk.yellow,
    number: chalk.magenta,
    string: chalk.green,
    regex: chalk.magenta,
    comment: chalk.grey,
    invalid: chalk.white.bgRed.bold
  };
}

const NEWLINE = /\r\n|[\n\r\u2028\u2029]/;
const JSX_TAG = /^[a-z][\w-]*$/i;
const BRACKET = /^[()[\]{}]$/;

function getTokenType(match) {
  const [offset, text] = match.slice(-2);
  const token = (0, _jsTokens().matchToToken)(match);

  if (token.type === "name") {
    if (_esutils().default.keyword.isReservedWordES6(token.value)) {
      return "keyword";
    }

    if (JSX_TAG.test(token.value) && (text[offset - 1] === "<" || text.substr(offset - 2, 2) == "</")) {
      return "jsx_tag";
    }

    if (token.value[0] !== token.value[0].toLowerCase()) {
      return "capitalized";
    }
  }

  if (token.type === "punctuator" && BRACKET.test(token.value)) {
    return "bracket";
  }

  if (token.type === "invalid" && (token.value === "@" || token.value === "#")) {
    return "punctuator";
  }

  return token.type;
}

function highlightTokens(defs, text) {
  return text.replace(_jsTokens().default, function (...args) {
    const type = getTokenType(args);
    const colorize = defs[type];

    if (colorize) {
      return args[0].split(NEWLINE).map(str => colorize(str)).join("\n");
    } else {
      return args[0];
    }
  });
}

function shouldHighlight(options) {
  return _chalk().default.supportsColor || options.forceColor;
}

function getChalk(options) {
  let chalk = _chalk().default;

  if (options.forceColor) {
    chalk = new (_chalk().default.constructor)({
      enabled: true,
      level: 1
    });
  }

  return chalk;
}

function highlight(code, options = {}) {
  if (shouldHighlight(options)) {
    const chalk = getChalk(options);
    const defs = getDefs(chalk);
    return highlightTokens(defs, code);
  } else {
    return code;
  }
}
});

unwrapExports(lib$1);
var lib_1 = lib$1.shouldHighlight;
var lib_2 = lib$1.getChalk;

var lib$2 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.codeFrameColumns = codeFrameColumns;
exports.default = _default;

function _highlight() {
  const data = _interopRequireWildcard(lib$1);

  _highlight = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

let deprecationWarningShown = false;

function getDefs(chalk) {
  return {
    gutter: chalk.grey,
    marker: chalk.red.bold,
    message: chalk.red.bold
  };
}

const NEWLINE = /\r\n|[\n\r\u2028\u2029]/;

function getMarkerLines(loc, source, opts) {
  const startLoc = Object.assign({
    column: 0,
    line: -1
  }, loc.start);
  const endLoc = Object.assign({}, startLoc, loc.end);
  const {
    linesAbove = 2,
    linesBelow = 3
  } = opts || {};
  const startLine = startLoc.line;
  const startColumn = startLoc.column;
  const endLine = endLoc.line;
  const endColumn = endLoc.column;
  let start = Math.max(startLine - (linesAbove + 1), 0);
  let end = Math.min(source.length, endLine + linesBelow);

  if (startLine === -1) {
    start = 0;
  }

  if (endLine === -1) {
    end = source.length;
  }

  const lineDiff = endLine - startLine;
  const markerLines = {};

  if (lineDiff) {
    for (let i = 0; i <= lineDiff; i++) {
      const lineNumber = i + startLine;

      if (!startColumn) {
        markerLines[lineNumber] = true;
      } else if (i === 0) {
        const sourceLength = source[lineNumber - 1].length;
        markerLines[lineNumber] = [startColumn, sourceLength - startColumn + 1];
      } else if (i === lineDiff) {
        markerLines[lineNumber] = [0, endColumn];
      } else {
        const sourceLength = source[lineNumber - i].length;
        markerLines[lineNumber] = [0, sourceLength];
      }
    }
  } else {
    if (startColumn === endColumn) {
      if (startColumn) {
        markerLines[startLine] = [startColumn, 0];
      } else {
        markerLines[startLine] = true;
      }
    } else {
      markerLines[startLine] = [startColumn, endColumn - startColumn];
    }
  }

  return {
    start,
    end,
    markerLines
  };
}

function codeFrameColumns(rawLines, loc, opts = {}) {
  const highlighted = (opts.highlightCode || opts.forceColor) && (0, _highlight().shouldHighlight)(opts);
  const chalk = (0, _highlight().getChalk)(opts);
  const defs = getDefs(chalk);

  const maybeHighlight = (chalkFn, string) => {
    return highlighted ? chalkFn(string) : string;
  };

  const lines = rawLines.split(NEWLINE);
  const {
    start,
    end,
    markerLines
  } = getMarkerLines(loc, lines, opts);
  const hasColumns = loc.start && typeof loc.start.column === "number";
  const numberMaxWidth = String(end).length;
  const highlightedLines = highlighted ? (0, _highlight().default)(rawLines, opts) : rawLines;
  let frame = highlightedLines.split(NEWLINE).slice(start, end).map((line, index) => {
    const number = start + 1 + index;
    const paddedNumber = ` ${number}`.slice(-numberMaxWidth);
    const gutter = ` ${paddedNumber} | `;
    const hasMarker = markerLines[number];
    const lastMarkerLine = !markerLines[number + 1];

    if (hasMarker) {
      let markerLine = "";

      if (Array.isArray(hasMarker)) {
        const markerSpacing = line.slice(0, Math.max(hasMarker[0] - 1, 0)).replace(/[^\t]/g, " ");
        const numberOfMarkers = hasMarker[1] || 1;
        markerLine = ["\n ", maybeHighlight(defs.gutter, gutter.replace(/\d/g, " ")), markerSpacing, maybeHighlight(defs.marker, "^").repeat(numberOfMarkers)].join("");

        if (lastMarkerLine && opts.message) {
          markerLine += " " + maybeHighlight(defs.message, opts.message);
        }
      }

      return [maybeHighlight(defs.marker, ">"), maybeHighlight(defs.gutter, gutter), line, markerLine].join("");
    } else {
      return ` ${maybeHighlight(defs.gutter, gutter)}${line}`;
    }
  }).join("\n");

  if (opts.message && !hasColumns) {
    frame = `${" ".repeat(numberMaxWidth + 1)}${opts.message}\n${frame}`;
  }

  if (highlighted) {
    return chalk.reset(frame);
  } else {
    return frame;
  }
}

function _default(rawLines, lineNumber, colNumber, opts = {}) {
  if (!deprecationWarningShown) {
    deprecationWarningShown = true;
    const message = "Passing lineNumber and colNumber is deprecated to @babel/code-frame. Please use `codeFrameColumns`.";

    if (process.emitWarning) {
      process.emitWarning(message, "DeprecationWarning");
    } else {
      const deprecationError = new Error(message);
      deprecationError.name = "DeprecationWarning";
      console.warn(new Error(message));
    }
  }

  colNumber = Math.max(colNumber, 0);
  const location = {
    start: {
      column: colNumber,
      line: lineNumber
    }
  };
  return codeFrameColumns(rawLines, location, opts);
}
});

unwrapExports(lib$2);
var lib_1$1 = lib$2.codeFrameColumns;

var stackUtils = createCommonjsModule(function (module) {
module.exports = StackUtils;

function StackUtils(opts) {
  if (!(this instanceof StackUtils)) {
    throw new Error('StackUtils constructor must be called with new');
  }
  opts = opts || {};
  this._cwd = (opts.cwd || process.cwd()).replace(/\\/g, '/');
  this._internals = opts.internals || [];
  this._wrapCallSite = opts.wrapCallSite || false;
}

module.exports.nodeInternals = nodeInternals;

function nodeInternals() {
  if (!module.exports.natives) {
    module.exports.natives = Object.keys(process.binding('natives'));
    module.exports.natives.push('bootstrap_node', 'node',
                                'internal/bootstrap/node');
  }

  return module.exports.natives.map(function (n) {
    return new RegExp('\\(' + n + '\\.js:\\d+:\\d+\\)$');
  }).concat([
    /\s*at (bootstrap_)?node\.js:\d+:\d+?$/,
    /\(internal\/[^:]+:\d+:\d+\)$/,
    /\/\.node-spawn-wrap-\w+-\w+\/node:\d+:\d+\)?$/
  ]);
}

StackUtils.prototype.clean = function (stack) {
  if (!Array.isArray(stack)) {
    stack = stack.split('\n');
  }

  if (!(/^\s*at /.test(stack[0])) &&
    (/^\s*at /.test(stack[1]))) {
    stack = stack.slice(1);
  }

  var outdent = false;
  var lastNonAtLine = null;
  var result = [];

  stack.forEach(function (st) {
    st = st.replace(/\\/g, '/');
    var isInternal = this._internals.some(function (internal) {
      return internal.test(st);
    });

    if (isInternal) {
      return null;
    }

    var isAtLine = /^\s*at /.test(st);

    if (outdent) {
      st = st.replace(/\s+$/, '').replace(/^(\s+)at /, '$1');
    } else {
      st = st.trim();
      if (isAtLine) {
        st = st.substring(3);
      }
    }

    st = st.replace(this._cwd + '/', '');

    if (st) {
      if (isAtLine) {
        if (lastNonAtLine) {
          result.push(lastNonAtLine);
          lastNonAtLine = null;
        }
        result.push(st);
      } else {
        outdent = true;
        lastNonAtLine = st;
      }
    }
  }, this);

  stack = result.join('\n').trim();

  if (stack) {
    return stack + '\n';
  }
  return '';
};

StackUtils.prototype.captureString = function (limit, fn) {
  if (typeof limit === 'function') {
    fn = limit;
    limit = Infinity;
  }
  if (!fn) {
    fn = this.captureString;
  }

  var limitBefore = Error.stackTraceLimit;
  if (limit) {
    Error.stackTraceLimit = limit;
  }

  var obj = {};

  Error.captureStackTrace(obj, fn);
  var stack = obj.stack;
  Error.stackTraceLimit = limitBefore;

  return this.clean(stack);
};

StackUtils.prototype.capture = function (limit, fn) {
  if (typeof limit === 'function') {
    fn = limit;
    limit = Infinity;
  }
  if (!fn) {
    fn = this.capture;
  }
  var prepBefore = Error.prepareStackTrace;
  var limitBefore = Error.stackTraceLimit;
  var wrapCallSite = this._wrapCallSite;

  Error.prepareStackTrace = function (obj, site) {
    if (wrapCallSite) {
      return site.map(wrapCallSite);
    }
    return site;
  };

  if (limit) {
    Error.stackTraceLimit = limit;
  }

  var obj = {};
  Error.captureStackTrace(obj, fn);
  var stack = obj.stack;
  Error.prepareStackTrace = prepBefore;
  Error.stackTraceLimit = limitBefore;

  return stack;
};

StackUtils.prototype.at = function at(fn) {
  if (!fn) {
    fn = at;
  }

  var site = this.capture(1, fn)[0];

  if (!site) {
    return {};
  }

  var res = {
    line: site.getLineNumber(),
    column: site.getColumnNumber()
  };

  this._setFile(res, site.getFileName());

  if (site.isConstructor()) {
    res.constructor = true;
  }

  if (site.isEval()) {
    res.evalOrigin = site.getEvalOrigin();
  }

  // Node v10 stopped with the isNative() on callsites, apparently
  /* istanbul ignore next */
  if (site.isNative()) {
    res.native = true;
  }

  var typename = null;
  try {
    typename = site.getTypeName();
  } catch (er) {}

  if (typename &&
    typename !== 'Object' &&
    typename !== '[object Object]') {
    res.type = typename;
  }

  var fname = site.getFunctionName();
  if (fname) {
    res.function = fname;
  }

  var meth = site.getMethodName();
  if (meth && fname !== meth) {
    res.method = meth;
  }

  return res;
};

StackUtils.prototype._setFile = function (result, filename) {
  if (filename) {
    filename = filename.replace(/\\/g, '/');
    if ((filename.indexOf(this._cwd + '/') === 0)) {
      filename = filename.substr(this._cwd.length + 1);
    }
    result.file = filename;
  }
};

var re = new RegExp(
  '^' +
    // Sometimes we strip out the '    at' because it's noisy
  '(?:\\s*at )?' +
    // $1 = ctor if 'new'
  '(?:(new) )?' +
    // $2 = function name (can be literally anything)
    // May contain method at the end as [as xyz]
  '(?:(.*?) \\()?' +
    // (eval at <anonymous> (file.js:1:1),
    // $3 = eval origin
    // $4:$5:$6 are eval file/line/col, but not normally reported
  '(?:eval at ([^ ]+) \\((.+?):(\\d+):(\\d+)\\), )?' +
    // file:line:col
    // $7:$8:$9
    // $10 = 'native' if native
  '(?:(.+?):(\\d+):(\\d+)|(native))' +
    // maybe close the paren, then end
    // if $11 is ), then we only allow balanced parens in the filename
    // any imbalance is placed on the fname.  This is a heuristic, and
    // bound to be incorrect in some edge cases.  The bet is that
    // having weird characters in method names is more common than
    // having weird characters in filenames, which seems reasonable.
  '(\\)?)$'
);

var methodRe = /^(.*?) \[as (.*?)\]$/;

StackUtils.prototype.parseLine = function parseLine(line) {
  var match = line && line.match(re);
  if (!match) {
    return null;
  }

  var ctor = match[1] === 'new';
  var fname = match[2];
  var evalOrigin = match[3];
  var evalFile = match[4];
  var evalLine = Number(match[5]);
  var evalCol = Number(match[6]);
  var file = match[7];
  var lnum = match[8];
  var col = match[9];
  var native = match[10] === 'native';
  var closeParen = match[11] === ')';

  var res = {};

  if (lnum) {
    res.line = Number(lnum);
  }

  if (col) {
    res.column = Number(col);
  }

  if (closeParen && file) {
    // make sure parens are balanced
    // if we have a file like "asdf) [as foo] (xyz.js", then odds are
    // that the fname should be += " (asdf) [as foo]" and the file
    // should be just "xyz.js"
    // walk backwards from the end to find the last unbalanced (
    var closes = 0;
    for (var i = file.length - 1; i > 0; i--) {
      if (file.charAt(i) === ')') {
        closes ++;
      } else if (file.charAt(i) === '(' && file.charAt(i - 1) === ' ') {
        closes --;
        if (closes === -1 && file.charAt(i - 1) === ' ') {
          var before = file.substr(0, i - 1);
          var after = file.substr(i + 1);
          file = after;
          fname += ' (' + before;
          break;
        }
      }
    }
  }

  if (fname) {
    var methodMatch = fname.match(methodRe);
    if (methodMatch) {
      fname = methodMatch[1];
      var meth = methodMatch[2];
    }
  }

  this._setFile(res, file);

  if (ctor) {
    res.constructor = true;
  }

  if (evalOrigin) {
    res.evalOrigin = evalOrigin;
    res.evalLine = evalLine;
    res.evalColumn = evalCol;
    res.evalFile = evalFile && evalFile.replace(/\\/g, '/');
  }

  if (native) {
    res.native = true;
  }

  if (fname) {
    res.function = fname;
  }

  if (meth && fname !== meth) {
    res.method = meth;
  }

  return res;
};

var bound = new StackUtils();

Object.keys(StackUtils.prototype).forEach(function (key) {
  StackUtils[key] = bound[key].bind(bound);
});
});
var stackUtils_1 = stackUtils.nodeInternals;
var stackUtils_2 = stackUtils.natives;



const types$2 = /*#__PURE__*/Object.freeze({
    __proto__: null
});

var build$1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
Object.defineProperty(exports, 'Frame', {
  enumerable: true,
  get: function get() {
    return types$2.Frame;
  }
});
exports.separateMessageFromStack = exports.formatResultsErrors = exports.formatStackTrace = exports.getTopFrame = exports.getStackTraceLines = exports.formatExecError = void 0;

var _fs = _interopRequireDefault(fs$1);

var _path = _interopRequireDefault(path$1__default);

var _chalk = _interopRequireDefault(ansiColors);

var _micromatch = _interopRequireDefault(micromatch_1);

var _slash = _interopRequireDefault(slash);



var _stackUtils = _interopRequireDefault(stackUtils);



function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

var Symbol = commonjsGlobal['jest-symbol-do-not-touch'] || commonjsGlobal.Symbol;

var jestReadFile =
  commonjsGlobal[Symbol.for('jest-native-read-file')] || _fs.default.readFileSync;

var Symbol = commonjsGlobal['jest-symbol-do-not-touch'] || commonjsGlobal.Symbol;
// stack utils tries to create pretty stack by making paths relative.
const stackUtils$1 = new _stackUtils.default({
  cwd: 'something which does not exist'
});
let nodeInternals = [];

try {
  nodeInternals = _stackUtils.default.nodeInternals();
} catch (e) {
  // `StackUtils.nodeInternals()` fails in browsers. We don't need to remove
  // node internals in the browser though, so no issue.
}

const PATH_NODE_MODULES = `${_path.default.sep}node_modules${_path.default.sep}`;
const PATH_JEST_PACKAGES = `${_path.default.sep}jest${_path.default.sep}packages${_path.default.sep}`; // filter for noisy stack trace lines

const JASMINE_IGNORE = /^\s+at(?:(?:.jasmine\-)|\s+jasmine\.buildExpectationResult)/;
const JEST_INTERNALS_IGNORE = /^\s+at.*?jest(-.*?)?(\/|\\)(build|node_modules|packages)(\/|\\)/;
const ANONYMOUS_FN_IGNORE = /^\s+at <anonymous>.*$/;
const ANONYMOUS_PROMISE_IGNORE = /^\s+at (new )?Promise \(<anonymous>\).*$/;
const ANONYMOUS_GENERATOR_IGNORE = /^\s+at Generator.next \(<anonymous>\).*$/;
const NATIVE_NEXT_IGNORE = /^\s+at next \(native\).*$/;
const TITLE_INDENT = '  ';
const MESSAGE_INDENT = '    ';
const STACK_INDENT = '      ';
const ANCESTRY_SEPARATOR = ' \u203A ';

const TITLE_BULLET = _chalk.default.bold('\u25cf ');

const STACK_TRACE_COLOR = _chalk.default.dim;
const STACK_PATH_REGEXP = /\s*at.*\(?(\:\d*\:\d*|native)\)?/;
const EXEC_ERROR_MESSAGE = 'Test suite failed to run';
const NOT_EMPTY_LINE_REGEXP = /^(?!$)/gm;

const indentAllLines = (lines, indent) =>
  lines.replace(NOT_EMPTY_LINE_REGEXP, indent);

const trim = string => (string || '').trim(); // Some errors contain not only line numbers in stack traces
// e.g. SyntaxErrors can contain snippets of code, and we don't
// want to trim those, because they may have pointers to the column/character
// which will get misaligned.

const trimPaths = string =>
  string.match(STACK_PATH_REGEXP) ? trim(string) : string;

const getRenderedCallsite = (fileContent, line, column) => {
  let renderedCallsite = (0, lib$2.codeFrameColumns)(
    fileContent,
    {
      start: {
        column,
        line
      }
    },
    {
      highlightCode: true
    }
  );
  renderedCallsite = indentAllLines(renderedCallsite, MESSAGE_INDENT);
  renderedCallsite = `\n${renderedCallsite}\n`;
  return renderedCallsite;
};

const blankStringRegexp = /^\s*$/; // ExecError is an error thrown outside of the test suite (not inside an `it` or
// `before/after each` hooks). If it's thrown, none of the tests in the file
// are executed.

const formatExecError = (error, config, options, testPath, reuseMessage) => {
  if (!error || typeof error === 'number') {
    error = new Error(`Expected an Error, but "${String(error)}" was thrown`);
    error.stack = '';
  }

  let message, stack;

  if (typeof error === 'string' || !error) {
    error || (error = 'EMPTY ERROR');
    message = '';
    stack = error;
  } else {
    message = error.message;
    stack = error.stack;
  }

  const separated = separateMessageFromStack(stack || '');
  stack = separated.stack;

  if (separated.message.includes(trim(message))) {
    // Often stack trace already contains the duplicate of the message
    message = separated.message;
  }

  message = indentAllLines(message, MESSAGE_INDENT);
  stack =
    stack && !options.noStackTrace
      ? '\n' + formatStackTrace(stack, config, options, testPath)
      : '';

  if (blankStringRegexp.test(message) && blankStringRegexp.test(stack)) {
    // this can happen if an empty object is thrown.
    message = MESSAGE_INDENT + 'Error: No message was provided';
  }

  let messageToUse;

  if (reuseMessage) {
    messageToUse = ` ${message.trim()}`;
  } else {
    messageToUse = `${EXEC_ERROR_MESSAGE}\n\n${message}`;
  }

  return TITLE_INDENT + TITLE_BULLET + messageToUse + stack + '\n';
};

exports.formatExecError = formatExecError;

const removeInternalStackEntries = (lines, options) => {
  let pathCounter = 0;
  return lines.filter(line => {
    if (ANONYMOUS_FN_IGNORE.test(line)) {
      return false;
    }

    if (ANONYMOUS_PROMISE_IGNORE.test(line)) {
      return false;
    }

    if (ANONYMOUS_GENERATOR_IGNORE.test(line)) {
      return false;
    }

    if (NATIVE_NEXT_IGNORE.test(line)) {
      return false;
    }

    if (nodeInternals.some(internal => internal.test(line))) {
      return false;
    }

    if (!STACK_PATH_REGEXP.test(line)) {
      return true;
    }

    if (JASMINE_IGNORE.test(line)) {
      return false;
    }

    if (++pathCounter === 1) {
      return true; // always keep the first line even if it's from Jest
    }

    if (options.noStackTrace) {
      return false;
    }

    if (JEST_INTERNALS_IGNORE.test(line)) {
      return false;
    }

    return true;
  });
};

const formatPaths = (config, relativeTestPath, line) => {
  // Extract the file path from the trace line.
  const match = line.match(/(^\s*at .*?\(?)([^()]+)(:[0-9]+:[0-9]+\)?.*$)/);

  if (!match) {
    return line;
  }

  let filePath = (0, _slash.default)(
    _path.default.relative(config.rootDir, match[2])
  ); // highlight paths from the current test file

  if (
    (config.testMatch &&
      config.testMatch.length &&
      _micromatch.default.some(filePath, config.testMatch)) ||
    filePath === relativeTestPath
  ) {
    filePath = _chalk.default.reset.cyan(filePath);
  }

  return STACK_TRACE_COLOR(match[1]) + filePath + STACK_TRACE_COLOR(match[3]);
};

const getStackTraceLines = (
  stack,
  options = {
    noStackTrace: false
  }
) => removeInternalStackEntries(stack.split(/\n/), options);

exports.getStackTraceLines = getStackTraceLines;

const getTopFrame = lines => {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (
      var _iterator = lines[Symbol.iterator](), _step;
      !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
      _iteratorNormalCompletion = true
    ) {
      const line = _step.value;

      if (
        line.includes(PATH_NODE_MODULES) ||
        line.includes(PATH_JEST_PACKAGES)
      ) {
        continue;
      }

      const parsedFrame = stackUtils$1.parseLine(line.trim());

      if (parsedFrame && parsedFrame.file) {
        return parsedFrame;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return null;
};

exports.getTopFrame = getTopFrame;

const formatStackTrace = (stack, config, options, testPath) => {
  const lines = getStackTraceLines(stack, options);
  const topFrame = getTopFrame(lines);
  let renderedCallsite = '';
  const relativeTestPath = testPath
    ? (0, _slash.default)(_path.default.relative(config.rootDir, testPath))
    : null;

  if (topFrame) {
    const column = topFrame.column,
      filename = topFrame.file,
      line = topFrame.line;

    if (line && filename && _path.default.isAbsolute(filename)) {
      let fileContent;

      try {
        // TODO: check & read HasteFS instead of reading the filesystem:
        // see: https://github.com/facebook/jest/pull/5405#discussion_r164281696
        fileContent = jestReadFile(filename, 'utf8');
        renderedCallsite = getRenderedCallsite(fileContent, line, column);
      } catch (e) {
        // the file does not exist or is inaccessible, we ignore
      }
    }
  }

  const stacktrace = lines
    .filter(Boolean)
    .map(
      line =>
        STACK_INDENT + formatPaths(config, relativeTestPath, trimPaths(line))
    )
    .join('\n');
  return `${renderedCallsite}\n${stacktrace}`;
};

exports.formatStackTrace = formatStackTrace;

const formatResultsErrors = (testResults, config, options, testPath) => {
  const failedResults = testResults.reduce((errors, result) => {
    result.failureMessages.forEach(content =>
      errors.push({
        content,
        result
      })
    );
    return errors;
  }, []);

  if (!failedResults.length) {
    return null;
  }

  return failedResults
    .map(({result, content}) => {
      let _separateMessageFromS = separateMessageFromStack(content),
        message = _separateMessageFromS.message,
        stack = _separateMessageFromS.stack;

      stack = options.noStackTrace
        ? ''
        : STACK_TRACE_COLOR(
            formatStackTrace(stack, config, options, testPath)
          ) + '\n';
      message = indentAllLines(message, MESSAGE_INDENT);
      const title =
        _chalk.default.bold.red(
          TITLE_INDENT +
            TITLE_BULLET +
            result.ancestorTitles.join(ANCESTRY_SEPARATOR) +
            (result.ancestorTitles.length ? ANCESTRY_SEPARATOR : '') +
            result.title
        ) + '\n';
      return title + '\n' + message + '\n' + stack;
    })
    .join('\n');
};

exports.formatResultsErrors = formatResultsErrors;
const errorRegexp = /^Error:?\s*$/;

const removeBlankErrorLine = str =>
  str
    .split('\n') // Lines saying just `Error:` are useless
    .filter(line => !errorRegexp.test(line))
    .join('\n')
    .trimRight(); // jasmine and worker farm sometimes don't give us access to the actual
// Error object, so we have to regexp out the message from the stack string
// to format it.

const separateMessageFromStack = content => {
  if (!content) {
    return {
      message: '',
      stack: ''
    };
  } // All lines up to what looks like a stack -- or if nothing looks like a stack
  // (maybe it's a code frame instead), just the first non-empty line.
  // If the error is a plain "Error:" instead of a SyntaxError or TypeError we
  // remove the prefix from the message because it is generally not useful.

  const messageMatch = content.match(
    /^(?:Error: )?([\s\S]*?(?=\n\s*at\s.*:\d*:\d*)|\s*.*)([\s\S]*)$/
  );

  if (!messageMatch) {
    // For typescript
    throw new Error('If you hit this error, the regex above is buggy.');
  }

  const message = removeBlankErrorLine(messageMatch[1]);
  const stack = removeBlankErrorLine(messageMatch[2]);
  return {
    message,
    stack
  };
};

exports.separateMessageFromStack = separateMessageFromStack;
});

unwrapExports(build$1);
var build_1 = build$1.separateMessageFromStack;
var build_2 = build$1.formatResultsErrors;
var build_3 = build$1.formatStackTrace;
var build_4 = build$1.getTopFrame;
var build_5 = build$1.getStackTraceLines;
var build_6 = build$1.formatExecError;

var jestFakeTimers = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

function _jestMessageUtil() {
  const data = build$1;

  _jestMessageUtil = function _jestMessageUtil() {
    return data;
  };

  return data;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

const MS_IN_A_YEAR = 31536000000; // TODO: Copied from `jest-util` to avoid cyclic dependency. Import from `jest-util` in the next major

const setGlobal = (globalToMutate, key, value) => {
  // @ts-ignore: no index
  globalToMutate[key] = value;
};

class FakeTimers {
  constructor({global, moduleMocker, timerConfig, config, maxLoops}) {
    _defineProperty(this, '_cancelledImmediates', void 0);

    _defineProperty(this, '_cancelledTicks', void 0);

    _defineProperty(this, '_config', void 0);

    _defineProperty(this, '_disposed', void 0);

    _defineProperty(this, '_fakeTimerAPIs', void 0);

    _defineProperty(this, '_global', void 0);

    _defineProperty(this, '_immediates', void 0);

    _defineProperty(this, '_maxLoops', void 0);

    _defineProperty(this, '_moduleMocker', void 0);

    _defineProperty(this, '_now', void 0);

    _defineProperty(this, '_ticks', void 0);

    _defineProperty(this, '_timerAPIs', void 0);

    _defineProperty(this, '_timers', void 0);

    _defineProperty(this, '_uuidCounter', void 0);

    _defineProperty(this, '_timerConfig', void 0);

    this._global = global;
    this._timerConfig = timerConfig;
    this._config = config;
    this._maxLoops = maxLoops || 100000;
    this._uuidCounter = 1;
    this._moduleMocker = moduleMocker; // Store original timer APIs for future reference

    this._timerAPIs = {
      clearImmediate: global.clearImmediate,
      clearInterval: global.clearInterval,
      clearTimeout: global.clearTimeout,
      nextTick: global.process && global.process.nextTick,
      setImmediate: global.setImmediate,
      setInterval: global.setInterval,
      setTimeout: global.setTimeout
    };
    this.reset();

    this._createMocks();
  }

  clearAllTimers() {
    this._immediates.forEach(immediate =>
      this._fakeClearImmediate(immediate.uuid)
    );

    this._timers.clear();
  }

  dispose() {
    this._disposed = true;
    this.clearAllTimers();
  }

  reset() {
    this._cancelledTicks = {};
    this._cancelledImmediates = {};
    this._now = 0;
    this._ticks = [];
    this._immediates = [];
    this._timers = new Map();
  }

  runAllTicks() {
    this._checkFakeTimers(); // Only run a generous number of ticks and then bail.
    // This is just to help avoid recursive loops

    let i;

    for (i = 0; i < this._maxLoops; i++) {
      const tick = this._ticks.shift();

      if (tick === undefined) {
        break;
      }

      if (!this._cancelledTicks.hasOwnProperty(tick.uuid)) {
        // Callback may throw, so update the map prior calling.
        this._cancelledTicks[tick.uuid] = true;
        tick.callback();
      }
    }

    if (i === this._maxLoops) {
      throw new Error(
        'Ran ' +
          this._maxLoops +
          ' ticks, and there are still more! ' +
          "Assuming we've hit an infinite recursion and bailing out..."
      );
    }
  }

  runAllImmediates() {
    this._checkFakeTimers(); // Only run a generous number of immediates and then bail.

    let i;

    for (i = 0; i < this._maxLoops; i++) {
      const immediate = this._immediates.shift();

      if (immediate === undefined) {
        break;
      }

      this._runImmediate(immediate);
    }

    if (i === this._maxLoops) {
      throw new Error(
        'Ran ' +
          this._maxLoops +
          ' immediates, and there are still more! Assuming ' +
          "we've hit an infinite recursion and bailing out..."
      );
    }
  }

  _runImmediate(immediate) {
    if (!this._cancelledImmediates.hasOwnProperty(immediate.uuid)) {
      // Callback may throw, so update the map prior calling.
      this._cancelledImmediates[immediate.uuid] = true;
      immediate.callback();
    }
  }

  runAllTimers() {
    this._checkFakeTimers();

    this.runAllTicks();
    this.runAllImmediates(); // Only run a generous number of timers and then bail.
    // This is just to help avoid recursive loops

    let i;

    for (i = 0; i < this._maxLoops; i++) {
      const nextTimerHandle = this._getNextTimerHandle(); // If there are no more timer handles, stop!

      if (nextTimerHandle === null) {
        break;
      }

      this._runTimerHandle(nextTimerHandle); // Some of the immediate calls could be enqueued
      // during the previous handling of the timers, we should
      // run them as well.

      if (this._immediates.length) {
        this.runAllImmediates();
      }

      if (this._ticks.length) {
        this.runAllTicks();
      }
    }

    if (i === this._maxLoops) {
      throw new Error(
        'Ran ' +
          this._maxLoops +
          ' timers, and there are still more! ' +
          "Assuming we've hit an infinite recursion and bailing out..."
      );
    }
  }

  runOnlyPendingTimers() {
    // We need to hold the current shape of `this._timers` because existing
    // timers can add new ones to the map and hence would run more than necessary.
    // See https://github.com/facebook/jest/pull/4608 for details
    const timerEntries = Array.from(this._timers.entries());

    this._checkFakeTimers();

    this._immediates.forEach(this._runImmediate, this);

    timerEntries
      .sort(([, left], [, right]) => left.expiry - right.expiry)
      .forEach(([timerHandle]) => this._runTimerHandle(timerHandle));
  }

  advanceTimersToNextTimer(steps = 1) {
    if (steps < 1) {
      return;
    }

    const nextExpiry = Array.from(this._timers.values()).reduce(
      (minExpiry, timer) => {
        if (minExpiry === null || timer.expiry < minExpiry) return timer.expiry;
        return minExpiry;
      },
      null
    );

    if (nextExpiry !== null) {
      this.advanceTimersByTime(nextExpiry - this._now);
      this.advanceTimersToNextTimer(steps - 1);
    }
  }

  advanceTimersByTime(msToRun) {
    this._checkFakeTimers(); // Only run a generous number of timers and then bail.
    // This is just to help avoid recursive loops

    let i;

    for (i = 0; i < this._maxLoops; i++) {
      const timerHandle = this._getNextTimerHandle(); // If there are no more timer handles, stop!

      if (timerHandle === null) {
        break;
      }

      const timerValue = this._timers.get(timerHandle);

      if (timerValue === undefined) {
        break;
      }

      const nextTimerExpiry = timerValue.expiry;

      if (this._now + msToRun < nextTimerExpiry) {
        // There are no timers between now and the target we're running to, so
        // adjust our time cursor and quit
        this._now += msToRun;
        break;
      } else {
        msToRun -= nextTimerExpiry - this._now;
        this._now = nextTimerExpiry;

        this._runTimerHandle(timerHandle);
      }
    }

    if (i === this._maxLoops) {
      throw new Error(
        'Ran ' +
          this._maxLoops +
          ' timers, and there are still more! ' +
          "Assuming we've hit an infinite recursion and bailing out..."
      );
    }
  }

  runWithRealTimers(cb) {
    const prevClearImmediate = this._global.clearImmediate;
    const prevClearInterval = this._global.clearInterval;
    const prevClearTimeout = this._global.clearTimeout;
    const prevNextTick = this._global.process.nextTick;
    const prevSetImmediate = this._global.setImmediate;
    const prevSetInterval = this._global.setInterval;
    const prevSetTimeout = this._global.setTimeout;
    this.useRealTimers();
    let cbErr = null;
    let errThrown = false;

    try {
      cb();
    } catch (e) {
      errThrown = true;
      cbErr = e;
    }

    this._global.clearImmediate = prevClearImmediate;
    this._global.clearInterval = prevClearInterval;
    this._global.clearTimeout = prevClearTimeout;
    this._global.process.nextTick = prevNextTick;
    this._global.setImmediate = prevSetImmediate;
    this._global.setInterval = prevSetInterval;
    this._global.setTimeout = prevSetTimeout;

    if (errThrown) {
      throw cbErr;
    }
  }

  useRealTimers() {
    const global = this._global;
    setGlobal(global, 'clearImmediate', this._timerAPIs.clearImmediate);
    setGlobal(global, 'clearInterval', this._timerAPIs.clearInterval);
    setGlobal(global, 'clearTimeout', this._timerAPIs.clearTimeout);
    setGlobal(global, 'setImmediate', this._timerAPIs.setImmediate);
    setGlobal(global, 'setInterval', this._timerAPIs.setInterval);
    setGlobal(global, 'setTimeout', this._timerAPIs.setTimeout);
    global.process.nextTick = this._timerAPIs.nextTick;
  }

  useFakeTimers() {
    this._createMocks();

    const global = this._global;
    setGlobal(global, 'clearImmediate', this._fakeTimerAPIs.clearImmediate);
    setGlobal(global, 'clearInterval', this._fakeTimerAPIs.clearInterval);
    setGlobal(global, 'clearTimeout', this._fakeTimerAPIs.clearTimeout);
    setGlobal(global, 'setImmediate', this._fakeTimerAPIs.setImmediate);
    setGlobal(global, 'setInterval', this._fakeTimerAPIs.setInterval);
    setGlobal(global, 'setTimeout', this._fakeTimerAPIs.setTimeout);
    global.process.nextTick = this._fakeTimerAPIs.nextTick;
  }

  getTimerCount() {
    this._checkFakeTimers();

    return this._timers.size + this._immediates.length + this._ticks.length;
  }

  _checkFakeTimers() {
    if (this._global.setTimeout !== this._fakeTimerAPIs.setTimeout) {
      this._global.console.warn(
        `A function to advance timers was called but the timers API is not ` +
          `mocked with fake timers. Call \`jest.useFakeTimers()\` in this ` +
          `test or enable fake timers globally by setting ` +
          `\`"timers": "fake"\` in ` +
          `the configuration file. This warning is likely a result of a ` +
          `default configuration change in Jest 15.\n\n` +
          `Release Blog Post: https://jestjs.io/blog/2016/09/01/jest-15.html\n` +
          `Stack Trace:\n` +
          (0, _jestMessageUtil().formatStackTrace)(
            new Error().stack,
            this._config,
            {
              noStackTrace: false
            }
          )
      );
    }
  }

  _createMocks() {
    const fn = (
      impl // @ts-ignore TODO: figure out better typings here
    ) => this._moduleMocker.fn().mockImplementation(impl); // TODO: add better typings; these are mocks, but typed as regular timers

    this._fakeTimerAPIs = {
      clearImmediate: fn(this._fakeClearImmediate.bind(this)),
      clearInterval: fn(this._fakeClearTimer.bind(this)),
      clearTimeout: fn(this._fakeClearTimer.bind(this)),
      nextTick: fn(this._fakeNextTick.bind(this)),
      setImmediate: fn(this._fakeSetImmediate.bind(this)),
      setInterval: fn(this._fakeSetInterval.bind(this)),
      setTimeout: fn(this._fakeSetTimeout.bind(this))
    };
  }

  _fakeClearTimer(timerRef) {
    const uuid = this._timerConfig.refToId(timerRef);

    if (uuid) {
      this._timers.delete(String(uuid));
    }
  }

  _fakeClearImmediate(uuid) {
    this._cancelledImmediates[uuid] = true;
  }

  _fakeNextTick(callback, ...args) {
    if (this._disposed) {
      return;
    }

    const uuid = String(this._uuidCounter++);

    this._ticks.push({
      callback: (function(_callback) {
        function callback() {
          return _callback.apply(this, arguments);
        }

        callback.toString = function() {
          return _callback.toString();
        };

        return callback;
      })(() => callback.apply(null, args)),
      uuid
    });

    const cancelledTicks = this._cancelledTicks;

    this._timerAPIs.nextTick(() => {
      if (!cancelledTicks.hasOwnProperty(uuid)) {
        // Callback may throw, so update the map prior calling.
        cancelledTicks[uuid] = true;
        callback.apply(null, args);
      }
    });
  }

  _fakeSetImmediate(callback, ...args) {
    if (this._disposed) {
      return null;
    }

    const uuid = this._uuidCounter++;

    this._immediates.push({
      callback: (function(_callback2) {
        function callback() {
          return _callback2.apply(this, arguments);
        }

        callback.toString = function() {
          return _callback2.toString();
        };

        return callback;
      })(() => callback.apply(null, args)),
      uuid: String(uuid)
    });

    const cancelledImmediates = this._cancelledImmediates;

    this._timerAPIs.setImmediate(() => {
      if (!cancelledImmediates.hasOwnProperty(uuid)) {
        // Callback may throw, so update the map prior calling.
        cancelledImmediates[String(uuid)] = true;
        callback.apply(null, args);
      }
    });

    return uuid;
  }

  _fakeSetInterval(callback, intervalDelay, ...args) {
    if (this._disposed) {
      return null;
    }

    if (intervalDelay == null) {
      intervalDelay = 0;
    }

    const uuid = this._uuidCounter++;

    this._timers.set(String(uuid), {
      callback: (function(_callback3) {
        function callback() {
          return _callback3.apply(this, arguments);
        }

        callback.toString = function() {
          return _callback3.toString();
        };

        return callback;
      })(() => callback.apply(null, args)),
      expiry: this._now + intervalDelay,
      interval: intervalDelay,
      type: 'interval'
    });

    return this._timerConfig.idToRef(uuid);
  }

  _fakeSetTimeout(callback, delay, ...args) {
    if (this._disposed) {
      return null;
    } // eslint-disable-next-line no-bitwise

    delay = Number(delay) | 0;
    const uuid = this._uuidCounter++;

    this._timers.set(String(uuid), {
      callback: (function(_callback4) {
        function callback() {
          return _callback4.apply(this, arguments);
        }

        callback.toString = function() {
          return _callback4.toString();
        };

        return callback;
      })(() => callback.apply(null, args)),
      expiry: this._now + delay,
      interval: undefined,
      type: 'timeout'
    });

    return this._timerConfig.idToRef(uuid);
  }

  _getNextTimerHandle() {
    let nextTimerHandle = null;
    let soonestTime = MS_IN_A_YEAR;

    this._timers.forEach((timer, uuid) => {
      if (timer.expiry < soonestTime) {
        soonestTime = timer.expiry;
        nextTimerHandle = uuid;
      }
    });

    return nextTimerHandle;
  }

  _runTimerHandle(timerHandle) {
    const timer = this._timers.get(timerHandle);

    if (!timer) {
      return;
    }

    switch (timer.type) {
      case 'timeout':
        const callback = timer.callback;

        this._timers.delete(timerHandle);

        callback();
        break;

      case 'interval':
        timer.expiry = this._now + (timer.interval || 0);
        timer.callback();
        break;

      default:
        throw new Error('Unexpected timer type: ' + timer.type);
    }
  }
}

exports.default = FakeTimers;
});

unwrapExports(jestFakeTimers);

var build$2 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
Object.defineProperty(exports, 'JestFakeTimers', {
  enumerable: true,
  get: function get() {
    return _jestFakeTimers.default;
  }
});

var _jestFakeTimers = _interopRequireDefault(jestFakeTimers);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}
});

unwrapExports(build$2);

var origCwd = process.cwd;
var cwd = null;

var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;

process.cwd = function() {
  if (!cwd)
    cwd = origCwd.call(process);
  return cwd
};
try {
  process.cwd();
} catch (er) {}

var chdir = process.chdir;
process.chdir = function(d) {
  cwd = null;
  chdir.call(process, d);
};

var polyfills = patch;

function patch (fs) {
  // (re-)implement some things that are known busted or missing.

  // lchmod, broken prior to 0.6.2
  // back-port the fix here.
  if (constants$1.hasOwnProperty('O_SYMLINK') &&
      process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
    patchLchmod(fs);
  }

  // lutimes implementation, or no-op
  if (!fs.lutimes) {
    patchLutimes(fs);
  }

  // https://github.com/isaacs/node-graceful-fs/issues/4
  // Chown should not fail on einval or eperm if non-root.
  // It should not fail on enosys ever, as this just indicates
  // that a fs doesn't support the intended operation.

  fs.chown = chownFix(fs.chown);
  fs.fchown = chownFix(fs.fchown);
  fs.lchown = chownFix(fs.lchown);

  fs.chmod = chmodFix(fs.chmod);
  fs.fchmod = chmodFix(fs.fchmod);
  fs.lchmod = chmodFix(fs.lchmod);

  fs.chownSync = chownFixSync(fs.chownSync);
  fs.fchownSync = chownFixSync(fs.fchownSync);
  fs.lchownSync = chownFixSync(fs.lchownSync);

  fs.chmodSync = chmodFixSync(fs.chmodSync);
  fs.fchmodSync = chmodFixSync(fs.fchmodSync);
  fs.lchmodSync = chmodFixSync(fs.lchmodSync);

  fs.stat = statFix(fs.stat);
  fs.fstat = statFix(fs.fstat);
  fs.lstat = statFix(fs.lstat);

  fs.statSync = statFixSync(fs.statSync);
  fs.fstatSync = statFixSync(fs.fstatSync);
  fs.lstatSync = statFixSync(fs.lstatSync);

  // if lchmod/lchown do not exist, then make them no-ops
  if (!fs.lchmod) {
    fs.lchmod = function (path, mode, cb) {
      if (cb) process.nextTick(cb);
    };
    fs.lchmodSync = function () {};
  }
  if (!fs.lchown) {
    fs.lchown = function (path, uid, gid, cb) {
      if (cb) process.nextTick(cb);
    };
    fs.lchownSync = function () {};
  }

  // on Windows, A/V software can lock the directory, causing this
  // to fail with an EACCES or EPERM if the directory contains newly
  // created files.  Try again on failure, for up to 60 seconds.

  // Set the timeout this long because some Windows Anti-Virus, such as Parity
  // bit9, may lock files for up to a minute, causing npm package install
  // failures. Also, take care to yield the scheduler. Windows scheduling gives
  // CPU to a busy looping process, which can cause the program causing the lock
  // contention to be starved of CPU by node, so the contention doesn't resolve.
  if (platform === "win32") {
    fs.rename = (function (fs$rename) { return function (from, to, cb) {
      var start = Date.now();
      var backoff = 0;
      fs$rename(from, to, function CB (er) {
        if (er
            && (er.code === "EACCES" || er.code === "EPERM")
            && Date.now() - start < 60000) {
          setTimeout(function() {
            fs.stat(to, function (stater, st) {
              if (stater && stater.code === "ENOENT")
                fs$rename(from, to, CB);
              else
                cb(er);
            });
          }, backoff);
          if (backoff < 100)
            backoff += 10;
          return;
        }
        if (cb) cb(er);
      });
    }})(fs.rename);
  }

  // if read() returns EAGAIN, then just try it again.
  fs.read = (function (fs$read) {
    function read (fd, buffer, offset, length, position, callback_) {
      var callback;
      if (callback_ && typeof callback_ === 'function') {
        var eagCounter = 0;
        callback = function (er, _, __) {
          if (er && er.code === 'EAGAIN' && eagCounter < 10) {
            eagCounter ++;
            return fs$read.call(fs, fd, buffer, offset, length, position, callback)
          }
          callback_.apply(this, arguments);
        };
      }
      return fs$read.call(fs, fd, buffer, offset, length, position, callback)
    }

    // This ensures `util.promisify` works as it does for native `fs.read`.
    read.__proto__ = fs$read;
    return read
  })(fs.read);

  fs.readSync = (function (fs$readSync) { return function (fd, buffer, offset, length, position) {
    var eagCounter = 0;
    while (true) {
      try {
        return fs$readSync.call(fs, fd, buffer, offset, length, position)
      } catch (er) {
        if (er.code === 'EAGAIN' && eagCounter < 10) {
          eagCounter ++;
          continue
        }
        throw er
      }
    }
  }})(fs.readSync);

  function patchLchmod (fs) {
    fs.lchmod = function (path, mode, callback) {
      fs.open( path
             , constants$1.O_WRONLY | constants$1.O_SYMLINK
             , mode
             , function (err, fd) {
        if (err) {
          if (callback) callback(err);
          return
        }
        // prefer to return the chmod error, if one occurs,
        // but still try to close, and report closing errors if they occur.
        fs.fchmod(fd, mode, function (err) {
          fs.close(fd, function(err2) {
            if (callback) callback(err || err2);
          });
        });
      });
    };

    fs.lchmodSync = function (path, mode) {
      var fd = fs.openSync(path, constants$1.O_WRONLY | constants$1.O_SYMLINK, mode);

      // prefer to return the chmod error, if one occurs,
      // but still try to close, and report closing errors if they occur.
      var threw = true;
      var ret;
      try {
        ret = fs.fchmodSync(fd, mode);
        threw = false;
      } finally {
        if (threw) {
          try {
            fs.closeSync(fd);
          } catch (er) {}
        } else {
          fs.closeSync(fd);
        }
      }
      return ret
    };
  }

  function patchLutimes (fs) {
    if (constants$1.hasOwnProperty("O_SYMLINK")) {
      fs.lutimes = function (path, at, mt, cb) {
        fs.open(path, constants$1.O_SYMLINK, function (er, fd) {
          if (er) {
            if (cb) cb(er);
            return
          }
          fs.futimes(fd, at, mt, function (er) {
            fs.close(fd, function (er2) {
              if (cb) cb(er || er2);
            });
          });
        });
      };

      fs.lutimesSync = function (path, at, mt) {
        var fd = fs.openSync(path, constants$1.O_SYMLINK);
        var ret;
        var threw = true;
        try {
          ret = fs.futimesSync(fd, at, mt);
          threw = false;
        } finally {
          if (threw) {
            try {
              fs.closeSync(fd);
            } catch (er) {}
          } else {
            fs.closeSync(fd);
          }
        }
        return ret
      };

    } else {
      fs.lutimes = function (_a, _b, _c, cb) { if (cb) process.nextTick(cb); };
      fs.lutimesSync = function () {};
    }
  }

  function chmodFix (orig) {
    if (!orig) return orig
    return function (target, mode, cb) {
      return orig.call(fs, target, mode, function (er) {
        if (chownErOk(er)) er = null;
        if (cb) cb.apply(this, arguments);
      })
    }
  }

  function chmodFixSync (orig) {
    if (!orig) return orig
    return function (target, mode) {
      try {
        return orig.call(fs, target, mode)
      } catch (er) {
        if (!chownErOk(er)) throw er
      }
    }
  }


  function chownFix (orig) {
    if (!orig) return orig
    return function (target, uid, gid, cb) {
      return orig.call(fs, target, uid, gid, function (er) {
        if (chownErOk(er)) er = null;
        if (cb) cb.apply(this, arguments);
      })
    }
  }

  function chownFixSync (orig) {
    if (!orig) return orig
    return function (target, uid, gid) {
      try {
        return orig.call(fs, target, uid, gid)
      } catch (er) {
        if (!chownErOk(er)) throw er
      }
    }
  }

  function statFix (orig) {
    if (!orig) return orig
    // Older versions of Node erroneously returned signed integers for
    // uid + gid.
    return function (target, options, cb) {
      if (typeof options === 'function') {
        cb = options;
        options = null;
      }
      function callback (er, stats) {
        if (stats) {
          if (stats.uid < 0) stats.uid += 0x100000000;
          if (stats.gid < 0) stats.gid += 0x100000000;
        }
        if (cb) cb.apply(this, arguments);
      }
      return options ? orig.call(fs, target, options, callback)
        : orig.call(fs, target, callback)
    }
  }

  function statFixSync (orig) {
    if (!orig) return orig
    // Older versions of Node erroneously returned signed integers for
    // uid + gid.
    return function (target, options) {
      var stats = options ? orig.call(fs, target, options)
        : orig.call(fs, target);
      if (stats.uid < 0) stats.uid += 0x100000000;
      if (stats.gid < 0) stats.gid += 0x100000000;
      return stats;
    }
  }

  // ENOSYS means that the fs doesn't support the op. Just ignore
  // that, because it doesn't matter.
  //
  // if there's no getuid, or if getuid() is something other
  // than 0, and the error is EINVAL or EPERM, then just ignore
  // it.
  //
  // This specific case is a silent failure in cp, install, tar,
  // and most other unix tools that manage permissions.
  //
  // When running as root, or if other types of errors are
  // encountered, then it's strict.
  function chownErOk (er) {
    if (!er)
      return true

    if (er.code === "ENOSYS")
      return true

    var nonroot = !process.getuid || process.getuid() !== 0;
    if (nonroot) {
      if (er.code === "EINVAL" || er.code === "EPERM")
        return true
    }

    return false
  }
}

var Stream = stream$1.Stream;

var legacyStreams = legacy;

function legacy (fs) {
  return {
    ReadStream: ReadStream,
    WriteStream: WriteStream
  }

  function ReadStream (path, options) {
    if (!(this instanceof ReadStream)) return new ReadStream(path, options);

    Stream.call(this);

    var self = this;

    this.path = path;
    this.fd = null;
    this.readable = true;
    this.paused = false;

    this.flags = 'r';
    this.mode = 438; /*=0666*/
    this.bufferSize = 64 * 1024;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.encoding) this.setEncoding(this.encoding);

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.end === undefined) {
        this.end = Infinity;
      } else if ('number' !== typeof this.end) {
        throw TypeError('end must be a Number');
      }

      if (this.start > this.end) {
        throw new Error('start must be <= end');
      }

      this.pos = this.start;
    }

    if (this.fd !== null) {
      process.nextTick(function() {
        self._read();
      });
      return;
    }

    fs.open(this.path, this.flags, this.mode, function (err, fd) {
      if (err) {
        self.emit('error', err);
        self.readable = false;
        return;
      }

      self.fd = fd;
      self.emit('open', fd);
      self._read();
    });
  }

  function WriteStream (path, options) {
    if (!(this instanceof WriteStream)) return new WriteStream(path, options);

    Stream.call(this);

    this.path = path;
    this.fd = null;
    this.writable = true;

    this.flags = 'w';
    this.encoding = 'binary';
    this.mode = 438; /*=0666*/
    this.bytesWritten = 0;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.start < 0) {
        throw new Error('start must be >= zero');
      }

      this.pos = this.start;
    }

    this.busy = false;
    this._queue = [];

    if (this.fd === null) {
      this._open = fs.open;
      this._queue.push([this._open, this.path, this.flags, this.mode, undefined]);
      this.flush();
    }
  }
}

var clone_1 = clone;

function clone (obj) {
  if (obj === null || typeof obj !== 'object')
    return obj

  if (obj instanceof Object)
    var copy = { __proto__: obj.__proto__ };
  else
    var copy = Object.create(null);

  Object.getOwnPropertyNames(obj).forEach(function (key) {
    Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key));
  });

  return copy
}

var gracefulFs = createCommonjsModule(function (module) {
/* istanbul ignore next - node 0.x polyfill */
var gracefulQueue;
var previousSymbol;

/* istanbul ignore else - node 0.x polyfill */
if (typeof Symbol === 'function' && typeof Symbol.for === 'function') {
  gracefulQueue = Symbol.for('graceful-fs.queue');
  // This is used in testing by future versions
  previousSymbol = Symbol.for('graceful-fs.previous');
} else {
  gracefulQueue = '___graceful-fs.queue';
  previousSymbol = '___graceful-fs.previous';
}

function noop () {}

var debug = noop;
if (util$3.debuglog)
  debug = util$3.debuglog('gfs4');
else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ''))
  debug = function() {
    var m = util$3.format.apply(util$3, arguments);
    m = 'GFS4: ' + m.split(/\n/).join('\nGFS4: ');
    console.error(m);
  };

// Once time initialization
if (!commonjsGlobal[gracefulQueue]) {
  // This queue can be shared by multiple loaded instances
  var queue = [];
  Object.defineProperty(commonjsGlobal, gracefulQueue, {
    get: function() {
      return queue
    }
  });

  // Patch fs.close/closeSync to shared queue version, because we need
  // to retry() whenever a close happens *anywhere* in the program.
  // This is essential when multiple graceful-fs instances are
  // in play at the same time.
  fs$1.close = (function (fs$close) {
    function close (fd, cb) {
      return fs$close.call(fs$1, fd, function (err) {
        // This function uses the graceful-fs shared queue
        if (!err) {
          retry();
        }

        if (typeof cb === 'function')
          cb.apply(this, arguments);
      })
    }

    Object.defineProperty(close, previousSymbol, {
      value: fs$close
    });
    return close
  })(fs$1.close);

  fs$1.closeSync = (function (fs$closeSync) {
    function closeSync (fd) {
      // This function uses the graceful-fs shared queue
      fs$closeSync.apply(fs$1, arguments);
      retry();
    }

    Object.defineProperty(closeSync, previousSymbol, {
      value: fs$closeSync
    });
    return closeSync
  })(fs$1.closeSync);

  if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) {
    process.on('exit', function() {
      debug(commonjsGlobal[gracefulQueue]);
      assert$1.equal(commonjsGlobal[gracefulQueue].length, 0);
    });
  }
}

module.exports = patch(clone_1(fs$1));
if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs$1.__patched) {
    module.exports = patch(fs$1);
    fs$1.__patched = true;
}

function patch (fs) {
  // Everything that references the open() function needs to be in here
  polyfills(fs);
  fs.gracefulify = patch;

  fs.createReadStream = createReadStream;
  fs.createWriteStream = createWriteStream;
  var fs$readFile = fs.readFile;
  fs.readFile = readFile;
  function readFile (path, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null;

    return go$readFile(path, options, cb)

    function go$readFile (path, options, cb) {
      return fs$readFile(path, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$readFile, [path, options, cb]]);
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments);
          retry();
        }
      })
    }
  }

  var fs$writeFile = fs.writeFile;
  fs.writeFile = writeFile;
  function writeFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null;

    return go$writeFile(path, data, options, cb)

    function go$writeFile (path, data, options, cb) {
      return fs$writeFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$writeFile, [path, data, options, cb]]);
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments);
          retry();
        }
      })
    }
  }

  var fs$appendFile = fs.appendFile;
  if (fs$appendFile)
    fs.appendFile = appendFile;
  function appendFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null;

    return go$appendFile(path, data, options, cb)

    function go$appendFile (path, data, options, cb) {
      return fs$appendFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$appendFile, [path, data, options, cb]]);
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments);
          retry();
        }
      })
    }
  }

  var fs$readdir = fs.readdir;
  fs.readdir = readdir;
  function readdir (path, options, cb) {
    var args = [path];
    if (typeof options !== 'function') {
      args.push(options);
    } else {
      cb = options;
    }
    args.push(go$readdir$cb);

    return go$readdir(args)

    function go$readdir$cb (err, files) {
      if (files && files.sort)
        files.sort();

      if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
        enqueue([go$readdir, [args]]);

      else {
        if (typeof cb === 'function')
          cb.apply(this, arguments);
        retry();
      }
    }
  }

  function go$readdir (args) {
    return fs$readdir.apply(fs, args)
  }

  if (process.version.substr(0, 4) === 'v0.8') {
    var legStreams = legacyStreams(fs);
    ReadStream = legStreams.ReadStream;
    WriteStream = legStreams.WriteStream;
  }

  var fs$ReadStream = fs.ReadStream;
  if (fs$ReadStream) {
    ReadStream.prototype = Object.create(fs$ReadStream.prototype);
    ReadStream.prototype.open = ReadStream$open;
  }

  var fs$WriteStream = fs.WriteStream;
  if (fs$WriteStream) {
    WriteStream.prototype = Object.create(fs$WriteStream.prototype);
    WriteStream.prototype.open = WriteStream$open;
  }

  Object.defineProperty(fs, 'ReadStream', {
    get: function () {
      return ReadStream
    },
    set: function (val) {
      ReadStream = val;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(fs, 'WriteStream', {
    get: function () {
      return WriteStream
    },
    set: function (val) {
      WriteStream = val;
    },
    enumerable: true,
    configurable: true
  });

  // legacy names
  var FileReadStream = ReadStream;
  Object.defineProperty(fs, 'FileReadStream', {
    get: function () {
      return FileReadStream
    },
    set: function (val) {
      FileReadStream = val;
    },
    enumerable: true,
    configurable: true
  });
  var FileWriteStream = WriteStream;
  Object.defineProperty(fs, 'FileWriteStream', {
    get: function () {
      return FileWriteStream
    },
    set: function (val) {
      FileWriteStream = val;
    },
    enumerable: true,
    configurable: true
  });

  function ReadStream (path, options) {
    if (this instanceof ReadStream)
      return fs$ReadStream.apply(this, arguments), this
    else
      return ReadStream.apply(Object.create(ReadStream.prototype), arguments)
  }

  function ReadStream$open () {
    var that = this;
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        if (that.autoClose)
          that.destroy();

        that.emit('error', err);
      } else {
        that.fd = fd;
        that.emit('open', fd);
        that.read();
      }
    });
  }

  function WriteStream (path, options) {
    if (this instanceof WriteStream)
      return fs$WriteStream.apply(this, arguments), this
    else
      return WriteStream.apply(Object.create(WriteStream.prototype), arguments)
  }

  function WriteStream$open () {
    var that = this;
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        that.destroy();
        that.emit('error', err);
      } else {
        that.fd = fd;
        that.emit('open', fd);
      }
    });
  }

  function createReadStream (path, options) {
    return new fs.ReadStream(path, options)
  }

  function createWriteStream (path, options) {
    return new fs.WriteStream(path, options)
  }

  var fs$open = fs.open;
  fs.open = open;
  function open (path, flags, mode, cb) {
    if (typeof mode === 'function')
      cb = mode, mode = null;

    return go$open(path, flags, mode, cb)

    function go$open (path, flags, mode, cb) {
      return fs$open(path, flags, mode, function (err, fd) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$open, [path, flags, mode, cb]]);
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments);
          retry();
        }
      })
    }
  }

  return fs
}

function enqueue (elem) {
  debug('ENQUEUE', elem[0].name, elem[1]);
  commonjsGlobal[gracefulQueue].push(elem);
}

function retry () {
  var elem = commonjsGlobal[gracefulQueue].shift();
  if (elem) {
    debug('RETRY', elem[0].name, elem[1]);
    elem[0].apply(null, elem[1]);
  }
}
});

const callsites = () => {
	const _prepareStackTrace = Error.prepareStackTrace;
	Error.prepareStackTrace = (_, stack) => stack;
	const stack = new Error().stack.slice(1);
	Error.prepareStackTrace = _prepareStackTrace;
	return stack;
};

var callsites_1 = callsites;
// TODO: Remove this for the next major release
var default_1 = callsites;
callsites_1.default = default_1;

var getCallsite = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

function _gracefulFs() {
  const data = _interopRequireDefault(gracefulFs);

  _gracefulFs = function _gracefulFs() {
    return data;
  };

  return data;
}

function _callsites() {
  const data = _interopRequireDefault(callsites_1);

  _callsites = function _callsites() {
    return data;
  };

  return data;
}

function _sourceMap() {
  const data = sourceMap;

  _sourceMap = function _sourceMap() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// Copied from https://github.com/rexxars/sourcemap-decorate-callsites/blob/5b9735a156964973a75dc62fd2c7f0c1975458e8/lib/index.js#L113-L158
const addSourceMapConsumer = (callsite, consumer) => {
  const getLineNumber = callsite.getLineNumber;
  const getColumnNumber = callsite.getColumnNumber;
  let position = null;

  function getPosition() {
    if (!position) {
      position = consumer.originalPositionFor({
        column: getColumnNumber.call(callsite) || -1,
        line: getLineNumber.call(callsite) || -1
      });
    }

    return position;
  }

  Object.defineProperties(callsite, {
    getColumnNumber: {
      value() {
        return getPosition().column || getColumnNumber.call(callsite);
      },

      writable: false
    },
    getLineNumber: {
      value() {
        return getPosition().line || getLineNumber.call(callsite);
      },

      writable: false
    }
  });
};

var _default = (level, sourceMaps) => {
  const levelAfterThisCall = level + 1;
  const stack = (0, _callsites().default)()[levelAfterThisCall];
  const sourceMapFileName = sourceMaps && sourceMaps[stack.getFileName() || ''];

  if (sourceMapFileName) {
    try {
      const sourceMap = _gracefulFs().default.readFileSync(
        sourceMapFileName,
        'utf8'
      ); // @ts-ignore: Not allowed to pass string

      addSourceMapConsumer(
        stack,
        new (_sourceMap()).SourceMapConsumer(sourceMap)
      );
    } catch (e) {
      // ignore
    }
  }

  return stack;
};

exports.default = _default;
});

unwrapExports(getCallsite);



const types$3 = /*#__PURE__*/Object.freeze({
    __proto__: null
});

var build$3 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
Object.defineProperty(exports, 'getCallsite', {
  enumerable: true,
  get: function get() {
    return _getCallsite.default;
  }
});
Object.defineProperty(exports, 'SourceMapRegistry', {
  enumerable: true,
  get: function get() {
    return types$3.SourceMapRegistry;
  }
});

var _getCallsite = _interopRequireDefault(getCallsite);



function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}
});

unwrapExports(build$3);

var BufferedConsole_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

function _assert() {
  const data = _interopRequireDefault(assert$1);

  _assert = function _assert() {
    return data;
  };

  return data;
}

function _console() {
  const data = console$2;

  _console = function _console() {
    return data;
  };

  return data;
}

function _util() {
  const data = util$3;

  _util = function _util() {
    return data;
  };

  return data;
}

function _chalk() {
  const data = _interopRequireDefault(ansiColors);

  _chalk = function _chalk() {
    return data;
  };

  return data;
}

function _sourceMap() {
  const data = build$3;

  _sourceMap = function _sourceMap() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

class BufferedConsole extends _console().Console {
  constructor(getSourceMaps) {
    const buffer = [];
    super({
      write: message => {
        BufferedConsole.write(buffer, 'log', message, null, getSourceMaps());
        return true;
      }
    });

    _defineProperty(this, '_buffer', void 0);

    _defineProperty(this, '_counters', void 0);

    _defineProperty(this, '_timers', void 0);

    _defineProperty(this, '_groupDepth', void 0);

    _defineProperty(this, '_getSourceMaps', void 0);

    this._getSourceMaps = getSourceMaps;
    this._buffer = buffer;
    this._counters = {};
    this._timers = {};
    this._groupDepth = 0;
  }

  static write(buffer, type, message, level, sourceMaps) {
    const callsite = (0, _sourceMap().getCallsite)(
      level != null ? level : 2,
      sourceMaps
    );
    const origin = callsite.getFileName() + ':' + callsite.getLineNumber();
    buffer.push({
      message,
      origin,
      type
    });
    return buffer;
  }

  _log(type, message) {
    BufferedConsole.write(
      this._buffer,
      type,
      '  '.repeat(this._groupDepth) + message,
      3,
      this._getSourceMaps()
    );
  }

  assert(value, message) {
    try {
      (0, _assert().default)(value, message);
    } catch (error) {
      this._log('assert', error.toString());
    }
  }

  count(label = 'default') {
    if (!this._counters[label]) {
      this._counters[label] = 0;
    }

    this._log(
      'count',
      (0, _util().format)(`${label}: ${++this._counters[label]}`)
    );
  }

  countReset(label = 'default') {
    this._counters[label] = 0;
  }

  debug(firstArg, ...rest) {
    this._log('debug', (0, _util().format)(firstArg, ...rest));
  }

  dir(firstArg, ...rest) {
    this._log('dir', (0, _util().format)(firstArg, ...rest));
  }

  dirxml(firstArg, ...rest) {
    this._log('dirxml', (0, _util().format)(firstArg, ...rest));
  }

  error(firstArg, ...rest) {
    this._log('error', (0, _util().format)(firstArg, ...rest));
  }

  group(title, ...rest) {
    this._groupDepth++;

    if (title || rest.length > 0) {
      this._log(
        'group',
        _chalk().default.bold((0, _util().format)(title, ...rest))
      );
    }
  }

  groupCollapsed(title, ...rest) {
    this._groupDepth++;

    if (title || rest.length > 0) {
      this._log(
        'groupCollapsed',
        _chalk().default.bold((0, _util().format)(title, ...rest))
      );
    }
  }

  groupEnd() {
    if (this._groupDepth > 0) {
      this._groupDepth--;
    }
  }

  info(firstArg, ...rest) {
    this._log('info', (0, _util().format)(firstArg, ...rest));
  }

  log(firstArg, ...rest) {
    this._log('log', (0, _util().format)(firstArg, ...rest));
  }

  time(label = 'default') {
    if (this._timers[label]) {
      return;
    }

    this._timers[label] = new Date();
  }

  timeEnd(label = 'default') {
    const startTime = this._timers[label];

    if (startTime) {
      const endTime = new Date();
      const time = endTime.getTime() - startTime.getTime();

      this._log('time', (0, _util().format)(`${label}: ${time}ms`));

      delete this._timers[label];
    }
  }

  warn(firstArg, ...rest) {
    this._log('warn', (0, _util().format)(firstArg, ...rest));
  }

  getBuffer() {
    return this._buffer.length ? this._buffer : undefined;
  }
}

exports.default = BufferedConsole;
});

unwrapExports(BufferedConsole_1);

var CustomConsole_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

function _assert() {
  const data = _interopRequireDefault(assert$1);

  _assert = function _assert() {
    return data;
  };

  return data;
}

function _util() {
  const data = util$3;

  _util = function _util() {
    return data;
  };

  return data;
}

function _console() {
  const data = console$2;

  _console = function _console() {
    return data;
  };

  return data;
}

function _chalk() {
  const data = _interopRequireDefault(ansiColors);

  _chalk = function _chalk() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

// TODO: Copied from `jest-util`. Import from it in Jest 25
function clearLine(stream) {
  if (stream.isTTY) {
    stream.write('\x1b[999D\x1b[K');
  }
}

class CustomConsole extends _console().Console {
  constructor(stdout, stderr, formatBuffer = (_type, message) => message) {
    super(stdout, stderr);

    _defineProperty(this, '_stdout', void 0);

    _defineProperty(this, '_stderr', void 0);

    _defineProperty(this, '_formatBuffer', void 0);

    _defineProperty(this, '_counters', void 0);

    _defineProperty(this, '_timers', void 0);

    _defineProperty(this, '_groupDepth', void 0);

    this._stdout = stdout;
    this._stderr = stderr;
    this._formatBuffer = formatBuffer;
    this._counters = {};
    this._timers = {};
    this._groupDepth = 0;
  }

  _log(type, message) {
    clearLine(this._stdout);
    super.log(
      this._formatBuffer(type, '  '.repeat(this._groupDepth) + message)
    );
  }

  _logError(type, message) {
    clearLine(this._stderr);
    super.error(
      this._formatBuffer(type, '  '.repeat(this._groupDepth) + message)
    );
  }

  assert(value, message) {
    try {
      (0, _assert().default)(value, message);
    } catch (error) {
      this._logError('assert', error.toString());
    }
  }

  count(label = 'default') {
    if (!this._counters[label]) {
      this._counters[label] = 0;
    }

    this._log(
      'count',
      (0, _util().format)(`${label}: ${++this._counters[label]}`)
    );
  }

  countReset(label = 'default') {
    this._counters[label] = 0;
  }

  debug(firstArg, ...args) {
    this._log('debug', (0, _util().format)(firstArg, ...args));
  }

  dir(firstArg, ...args) {
    this._log('dir', (0, _util().format)(firstArg, ...args));
  }

  dirxml(firstArg, ...args) {
    this._log('dirxml', (0, _util().format)(firstArg, ...args));
  }

  error(firstArg, ...args) {
    this._logError('error', (0, _util().format)(firstArg, ...args));
  }

  group(title, ...args) {
    this._groupDepth++;

    if (title || args.length > 0) {
      this._log(
        'group',
        _chalk().default.bold((0, _util().format)(title, ...args))
      );
    }
  }

  groupCollapsed(title, ...args) {
    this._groupDepth++;

    if (title || args.length > 0) {
      this._log(
        'groupCollapsed',
        _chalk().default.bold((0, _util().format)(title, ...args))
      );
    }
  }

  groupEnd() {
    if (this._groupDepth > 0) {
      this._groupDepth--;
    }
  }

  info(firstArg, ...args) {
    this._log('info', (0, _util().format)(firstArg, ...args));
  }

  log(firstArg, ...args) {
    this._log('log', (0, _util().format)(firstArg, ...args));
  }

  time(label = 'default') {
    if (this._timers[label]) {
      return;
    }

    this._timers[label] = new Date();
  }

  timeEnd(label = 'default') {
    const startTime = this._timers[label];

    if (startTime) {
      const endTime = new Date().getTime();
      const time = endTime - startTime.getTime();

      this._log('time', (0, _util().format)(`${label}: ${time}ms`));

      delete this._timers[label];
    }
  }

  warn(firstArg, ...args) {
    this._logError('warn', (0, _util().format)(firstArg, ...args));
  }

  getBuffer() {
    return undefined;
  }
}

exports.default = CustomConsole;
});

unwrapExports(CustomConsole_1);

var NullConsole_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

var _CustomConsole = _interopRequireDefault(CustomConsole_1);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
class NullConsole extends _CustomConsole.default {
  assert() {}

  debug() {}

  dir() {}

  error() {}

  info() {}

  log() {}

  time() {}

  timeEnd() {}

  trace() {}

  warn() {}
}

exports.default = NullConsole;
});

unwrapExports(NullConsole_1);

var getConsoleOutput = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

function _path() {
  const data = _interopRequireDefault(path$1__default);

  _path = function _path() {
    return data;
  };

  return data;
}

function _chalk() {
  const data = _interopRequireDefault(ansiColors);

  _chalk = function _chalk() {
    return data;
  };

  return data;
}

function _slash() {
  const data = _interopRequireDefault(slash);

  _slash = function _slash() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var _default = (root, verbose, buffer) => {
  const TITLE_INDENT = verbose ? '  ' : '    ';
  const CONSOLE_INDENT = TITLE_INDENT + '  ';
  return buffer.reduce((output, {type, message, origin}) => {
    origin = (0, _slash().default)(_path().default.relative(root, origin));
    message = message
      .split(/\n/)
      .map(line => CONSOLE_INDENT + line)
      .join('\n');
    let typeMessage = 'console.' + type;

    if (type === 'warn') {
      message = _chalk().default.yellow(message);
      typeMessage = _chalk().default.yellow(typeMessage);
    } else if (type === 'error') {
      message = _chalk().default.red(message);
      typeMessage = _chalk().default.red(typeMessage);
    }

    return (
      output +
      TITLE_INDENT +
      _chalk().default.dim(typeMessage) +
      ' ' +
      _chalk().default.dim(origin) +
      '\n' +
      message +
      '\n'
    );
  }, '');
};

exports.default = _default;
});

unwrapExports(getConsoleOutput);



const types$4 = /*#__PURE__*/Object.freeze({
    __proto__: null
});

var build$4 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
Object.defineProperty(exports, 'BufferedConsole', {
  enumerable: true,
  get: function get() {
    return _BufferedConsole.default;
  }
});
Object.defineProperty(exports, 'CustomConsole', {
  enumerable: true,
  get: function get() {
    return _CustomConsole.default;
  }
});
Object.defineProperty(exports, 'NullConsole', {
  enumerable: true,
  get: function get() {
    return _NullConsole.default;
  }
});
Object.defineProperty(exports, 'getConsoleOutput', {
  enumerable: true,
  get: function get() {
    return _getConsoleOutput.default;
  }
});
Object.defineProperty(exports, 'ConsoleBuffer', {
  enumerable: true,
  get: function get() {
    return types$4.ConsoleBuffer;
  }
});
Object.defineProperty(exports, 'LogMessage', {
  enumerable: true,
  get: function get() {
    return types$4.LogMessage;
  }
});
Object.defineProperty(exports, 'LogType', {
  enumerable: true,
  get: function get() {
    return types$4.LogType;
  }
});

var _BufferedConsole = _interopRequireDefault(BufferedConsole_1);

var _CustomConsole = _interopRequireDefault(CustomConsole_1);

var _NullConsole = _interopRequireDefault(NullConsole_1);

var _getConsoleOutput = _interopRequireDefault(getConsoleOutput);



function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}
});

unwrapExports(build$4);

var formatTestResults_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = formatTestResults;

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(
        Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        })
      );
    }
    ownKeys.forEach(function(key) {
      _defineProperty(target, key, source[key]);
    });
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const formatTestResult = (testResult, codeCoverageFormatter, reporter) => {
  const assertionResults = testResult.testResults.map(formatTestAssertion);

  if (testResult.testExecError) {
    const now = Date.now();
    return {
      assertionResults,
      coverage: {},
      endTime: now,
      message: testResult.failureMessage
        ? testResult.failureMessage
        : testResult.testExecError.message,
      name: testResult.testFilePath,
      startTime: now,
      status: 'failed',
      summary: ''
    };
  } else {
    const allTestsPassed = testResult.numFailingTests === 0;
    return {
      assertionResults,
      coverage: codeCoverageFormatter
        ? codeCoverageFormatter(testResult.coverage, reporter)
        : testResult.coverage,
      endTime: testResult.perfStats.end,
      message: testResult.failureMessage || '',
      name: testResult.testFilePath,
      startTime: testResult.perfStats.start,
      status: allTestsPassed ? 'passed' : 'failed',
      summary: ''
    };
  }
};

function formatTestAssertion(assertion) {
  const result = {
    ancestorTitles: assertion.ancestorTitles,
    failureMessages: null,
    fullName: assertion.fullName,
    location: assertion.location,
    status: assertion.status,
    title: assertion.title
  };

  if (assertion.failureMessages) {
    result.failureMessages = assertion.failureMessages;
  }

  return result;
}

function formatTestResults(results, codeCoverageFormatter, reporter) {
  const testResults = results.testResults.map(testResult =>
    formatTestResult(testResult, codeCoverageFormatter, reporter)
  );
  return _objectSpread({}, results, {
    testResults
  });
}
});

unwrapExports(formatTestResults_1);

var helpers = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.addResult = exports.buildFailureTestResult = exports.makeEmptyAggregatedTestResult = void 0;

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const makeEmptyAggregatedTestResult = () => ({
  numFailedTestSuites: 0,
  numFailedTests: 0,
  numPassedTestSuites: 0,
  numPassedTests: 0,
  numPendingTestSuites: 0,
  numPendingTests: 0,
  numRuntimeErrorTestSuites: 0,
  numTodoTests: 0,
  numTotalTestSuites: 0,
  numTotalTests: 0,
  openHandles: [],
  snapshot: {
    added: 0,
    didUpdate: false,
    // is set only after the full run
    failure: false,
    filesAdded: 0,
    // combines individual test results + removed files after the full run
    filesRemoved: 0,
    filesRemovedList: [],
    filesUnmatched: 0,
    filesUpdated: 0,
    matched: 0,
    total: 0,
    unchecked: 0,
    uncheckedKeysByFile: [],
    unmatched: 0,
    updated: 0
  },
  startTime: 0,
  success: true,
  testResults: [],
  wasInterrupted: false
});

exports.makeEmptyAggregatedTestResult = makeEmptyAggregatedTestResult;

const buildFailureTestResult = (testPath, err) => ({
  console: undefined,
  displayName: '',
  failureMessage: null,
  leaks: false,
  numFailingTests: 0,
  numPassingTests: 0,
  numPendingTests: 0,
  numTodoTests: 0,
  openHandles: [],
  perfStats: {
    end: 0,
    start: 0
  },
  skipped: false,
  snapshot: {
    added: 0,
    fileDeleted: false,
    matched: 0,
    unchecked: 0,
    uncheckedKeys: [],
    unmatched: 0,
    updated: 0
  },
  sourceMaps: {},
  testExecError: err,
  testFilePath: testPath,
  testResults: []
}); // Add individual test result to an aggregated test result

exports.buildFailureTestResult = buildFailureTestResult;

const addResult = (aggregatedResults, testResult) => {
  // `todos` are new as of Jest 24, and not all runners return it.
  // Set it to `0` to avoid `NaN`
  if (!testResult.numTodoTests) {
    testResult.numTodoTests = 0;
  }

  aggregatedResults.testResults.push(testResult);
  aggregatedResults.numTotalTests +=
    testResult.numPassingTests +
    testResult.numFailingTests +
    testResult.numPendingTests +
    testResult.numTodoTests;
  aggregatedResults.numFailedTests += testResult.numFailingTests;
  aggregatedResults.numPassedTests += testResult.numPassingTests;
  aggregatedResults.numPendingTests += testResult.numPendingTests;
  aggregatedResults.numTodoTests += testResult.numTodoTests;

  if (testResult.testExecError) {
    aggregatedResults.numRuntimeErrorTestSuites++;
  }

  if (testResult.skipped) {
    aggregatedResults.numPendingTestSuites++;
  } else if (testResult.numFailingTests > 0 || testResult.testExecError) {
    aggregatedResults.numFailedTestSuites++;
  } else {
    aggregatedResults.numPassedTestSuites++;
  } // Snapshot data

  if (testResult.snapshot.added) {
    aggregatedResults.snapshot.filesAdded++;
  }

  if (testResult.snapshot.fileDeleted) {
    aggregatedResults.snapshot.filesRemoved++;
  }

  if (testResult.snapshot.unmatched) {
    aggregatedResults.snapshot.filesUnmatched++;
  }

  if (testResult.snapshot.updated) {
    aggregatedResults.snapshot.filesUpdated++;
  }

  aggregatedResults.snapshot.added += testResult.snapshot.added;
  aggregatedResults.snapshot.matched += testResult.snapshot.matched;
  aggregatedResults.snapshot.unchecked += testResult.snapshot.unchecked;

  if (
    testResult.snapshot.uncheckedKeys &&
    testResult.snapshot.uncheckedKeys.length > 0
  ) {
    aggregatedResults.snapshot.uncheckedKeysByFile.push({
      filePath: testResult.testFilePath,
      keys: testResult.snapshot.uncheckedKeys
    });
  }

  aggregatedResults.snapshot.unmatched += testResult.snapshot.unmatched;
  aggregatedResults.snapshot.updated += testResult.snapshot.updated;
  aggregatedResults.snapshot.total +=
    testResult.snapshot.added +
    testResult.snapshot.matched +
    testResult.snapshot.unmatched +
    testResult.snapshot.updated;
};

exports.addResult = addResult;
});

unwrapExports(helpers);
var helpers_1 = helpers.addResult;
var helpers_2 = helpers.buildFailureTestResult;
var helpers_3 = helpers.makeEmptyAggregatedTestResult;



const types$5 = /*#__PURE__*/Object.freeze({
    __proto__: null
});

var build$5 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
Object.defineProperty(exports, 'formatTestResults', {
  enumerable: true,
  get: function get() {
    return _formatTestResults.default;
  }
});
Object.defineProperty(exports, 'addResult', {
  enumerable: true,
  get: function get() {
    return helpers.addResult;
  }
});
Object.defineProperty(exports, 'buildFailureTestResult', {
  enumerable: true,
  get: function get() {
    return helpers.buildFailureTestResult;
  }
});
Object.defineProperty(exports, 'makeEmptyAggregatedTestResult', {
  enumerable: true,
  get: function get() {
    return helpers.makeEmptyAggregatedTestResult;
  }
});
Object.defineProperty(exports, 'AggregatedResult', {
  enumerable: true,
  get: function get() {
    return types$5.AggregatedResult;
  }
});
Object.defineProperty(exports, 'AssertionLocation', {
  enumerable: true,
  get: function get() {
    return types$5.AssertionLocation;
  }
});
Object.defineProperty(exports, 'AssertionResult', {
  enumerable: true,
  get: function get() {
    return types$5.AssertionResult;
  }
});
Object.defineProperty(exports, 'FailedAssertion', {
  enumerable: true,
  get: function get() {
    return types$5.FailedAssertion;
  }
});
Object.defineProperty(exports, 'Milliseconds', {
  enumerable: true,
  get: function get() {
    return types$5.Milliseconds;
  }
});
Object.defineProperty(exports, 'SerializableError', {
  enumerable: true,
  get: function get() {
    return types$5.SerializableError;
  }
});
Object.defineProperty(exports, 'SnapshotSummary', {
  enumerable: true,
  get: function get() {
    return types$5.SnapshotSummary;
  }
});
Object.defineProperty(exports, 'Status', {
  enumerable: true,
  get: function get() {
    return types$5.Status;
  }
});
Object.defineProperty(exports, 'Suite', {
  enumerable: true,
  get: function get() {
    return types$5.Suite;
  }
});
Object.defineProperty(exports, 'TestResult', {
  enumerable: true,
  get: function get() {
    return types$5.TestResult;
  }
});

var _formatTestResults = _interopRequireDefault(formatTestResults_1);





function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}
});

unwrapExports(build$5);

var clearLine = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var _default = stream => {
  if (process.stdout.isTTY) {
    stream.write('\x1b[999D\x1b[K');
  }
};

exports.default = _default;
});

unwrapExports(clearLine);

var _0777 = parseInt('0777', 8);

var mkdirp = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;

function mkdirP (p, opts, f, made) {
    if (typeof opts === 'function') {
        f = opts;
        opts = {};
    }
    else if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }
    
    var mode = opts.mode;
    var xfs = opts.fs || fs$1;
    
    if (mode === undefined) {
        mode = _0777;
    }
    if (!made) made = null;
    
    var cb = f || function () {};
    p = path$1__default.resolve(p);
    
    xfs.mkdir(p, mode, function (er) {
        if (!er) {
            made = made || p;
            return cb(null, made);
        }
        switch (er.code) {
            case 'ENOENT':
                if (path$1__default.dirname(p) === p) return cb(er);
                mkdirP(path$1__default.dirname(p), opts, function (er, made) {
                    if (er) cb(er, made);
                    else mkdirP(p, opts, cb, made);
                });
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                xfs.stat(p, function (er2, stat) {
                    // if the stat fails, then that's super weird.
                    // let the original error be the failure reason.
                    if (er2 || !stat.isDirectory()) cb(er, made);
                    else cb(null, made);
                });
                break;
        }
    });
}

mkdirP.sync = function sync (p, opts, made) {
    if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }
    
    var mode = opts.mode;
    var xfs = opts.fs || fs$1;
    
    if (mode === undefined) {
        mode = _0777;
    }
    if (!made) made = null;

    p = path$1__default.resolve(p);

    try {
        xfs.mkdirSync(p, mode);
        made = made || p;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT' :
                made = sync(path$1__default.dirname(p), opts, made);
                sync(p, opts, made);
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                var stat;
                try {
                    stat = xfs.statSync(p);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }

    return made;
};

var createDirectory_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = createDirectory;

function _mkdirp() {
  const data = _interopRequireDefault(mkdirp);

  _mkdirp = function _mkdirp() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function createDirectory(path) {
  try {
    _mkdirp().default.sync(path, '777');
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e;
    }
  }
}
});

unwrapExports(createDirectory_1);

var ErrorWithStack_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
class ErrorWithStack extends Error {
  constructor(message, callsite) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, callsite);
    }
  }
}

exports.default = ErrorWithStack;
});

unwrapExports(ErrorWithStack_1);

var getFailedSnapshotTests_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function getFailedSnapshotTests(testResults) {
  const failedTestPaths = [];

  if (testResults.numFailedTests === 0 || !testResults.testResults) {
    return failedTestPaths;
  }

  testResults.testResults.forEach(testResult => {
    if (testResult.snapshot && testResult.snapshot.unmatched) {
      failedTestPaths.push(testResult.testFilePath);
    }
  });
  return failedTestPaths;
}

var _default = getFailedSnapshotTests;
exports.default = _default;
});

unwrapExports(getFailedSnapshotTests_1);

var deepCyclicCopy_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = deepCyclicCopy;

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const EMPTY = new Set();

// Node 6 does not have gOPDs, so we define a simple polyfill for it.
if (!Object.getOwnPropertyDescriptors) {
  // @ts-ignore: polyfill
  Object.getOwnPropertyDescriptors = obj => {
    const list = {};
    Object.getOwnPropertyNames(obj)
      .concat(Object.getOwnPropertySymbols(obj))
      .forEach(key => {
        // @ts-ignore: assignment with a Symbol is OK.
        list[key] = Object.getOwnPropertyDescriptor(obj, key);
      });
    return list;
  };
}

function deepCyclicCopy(
  value,
  options = {
    blacklist: EMPTY,
    keepPrototype: false
  },
  cycles = new WeakMap()
) {
  if (typeof value !== 'object' || value === null) {
    return value;
  } else if (cycles.has(value)) {
    return cycles.get(value);
  } else if (Array.isArray(value)) {
    return deepCyclicCopyArray(value, options, cycles);
  } else {
    return deepCyclicCopyObject(value, options, cycles);
  }
}

function deepCyclicCopyObject(object, options, cycles) {
  const newObject = options.keepPrototype
    ? Object.create(Object.getPrototypeOf(object))
    : {};
  const descriptors = Object.getOwnPropertyDescriptors(object);
  cycles.set(object, newObject);
  Object.keys(descriptors).forEach(key => {
    if (options.blacklist && options.blacklist.has(key)) {
      delete descriptors[key];
      return;
    }

    const descriptor = descriptors[key];

    if (typeof descriptor.value !== 'undefined') {
      descriptor.value = deepCyclicCopy(
        descriptor.value,
        {
          blacklist: EMPTY,
          keepPrototype: options.keepPrototype
        },
        cycles
      );
    }

    descriptor.configurable = true;
  });
  return Object.defineProperties(newObject, descriptors);
}

function deepCyclicCopyArray(array, options, cycles) {
  const newArray = options.keepPrototype
    ? new (Object.getPrototypeOf(array)).constructor(array.length)
    : [];
  const length = array.length;
  cycles.set(array, newArray);

  for (let i = 0; i < length; i++) {
    newArray[i] = deepCyclicCopy(
      array[i],
      {
        blacklist: EMPTY,
        keepPrototype: options.keepPrototype
      },
      cycles
    );
  }

  return newArray;
}
});

unwrapExports(deepCyclicCopy_1);

var createProcessObject = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = _default;

var _deepCyclicCopy = _interopRequireDefault(deepCyclicCopy_1);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const BLACKLIST = new Set(['env', 'mainModule', '_events']);
const isWin32 = process.platform === 'win32';
const proto = Object.getPrototypeOf(process.env); // The "process.env" object has a bunch of particularities: first, it does not
// directly extend from Object; second, it converts any assigned value to a
// string; and third, it is case-insensitive in Windows. We use a proxy here to
// mimic it (see https://nodejs.org/api/process.html#process_process_env).

function createProcessEnv() {
  const real = Object.create(proto);
  const lookup = {};

  function deletePropertyWin32(_target, key) {
    for (const name in real) {
      if (real.hasOwnProperty(name)) {
        if (typeof key === 'string') {
          if (name.toLowerCase() === key.toLowerCase()) {
            delete real[name];
            delete lookup[name.toLowerCase()];
          }
        } else {
          if (key === name) {
            delete real[name];
            delete lookup[name];
          }
        }
      }
    }

    return true;
  }

  function deleteProperty(_target, key) {
    delete real[key];
    delete lookup[key];
    return true;
  }

  function getProperty(_target, key) {
    return real[key];
  }

  function getPropertyWin32(_target, key) {
    if (typeof key === 'string') {
      return lookup[key in proto ? key : key.toLowerCase()];
    } else {
      return real[key];
    }
  }

  const proxy = new Proxy(real, {
    deleteProperty: isWin32 ? deletePropertyWin32 : deleteProperty,
    get: isWin32 ? getPropertyWin32 : getProperty,

    set(_target, key, value) {
      const strValue = '' + value;

      if (typeof key === 'string') {
        lookup[key.toLowerCase()] = strValue;
      }

      real[key] = strValue;
      return true;
    }
  });
  return Object.assign(proxy, process.env);
}

function _default() {
  const process = process$2;

  const newProcess = (0, _deepCyclicCopy.default)(process, {
    blacklist: BLACKLIST,
    keepPrototype: true
  });

  try {
    // This fails on Node 12, but it's already set to 'process'
    newProcess[Symbol.toStringTag] = 'process';
  } catch (e) {
    // Make sure it's actually set instead of potentially ignoring errors
    if (newProcess[Symbol.toStringTag] !== 'process') {
      e.message =
        'Unable to set toStringTag on process. Please open up an issue at https://github.com/facebook/jest\n\n' +
        e.message;
      throw e;
    }
  } // Sequentially execute all constructors over the object.

  let proto = process;

  while ((proto = Object.getPrototypeOf(proto))) {
    if (typeof proto.constructor === 'function') {
      proto.constructor.call(newProcess);
    }
  }

  newProcess.env = createProcessEnv();

  newProcess.send = () => {};

  return newProcess;
}
});

unwrapExports(createProcessObject);

var installCommonGlobals = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = _default;

function _fs() {
  const data = _interopRequireDefault(fs$1);

  _fs = function _fs() {
    return data;
  };

  return data;
}

var _createProcessObject = _interopRequireDefault(
  createProcessObject
);

var _deepCyclicCopy = _interopRequireDefault(deepCyclicCopy_1);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const DTRACE = Object.keys(commonjsGlobal).filter(key => key.startsWith('DTRACE'));

function _default(globalObject, globals) {
  globalObject.process = (0, _createProcessObject.default)();
  const symbol = globalObject.Symbol; // Keep a reference to some globals that Jest needs

  Object.defineProperties(globalObject, {
    [symbol.for('jest-native-promise')]: {
      enumerable: false,
      value: Promise,
      writable: false
    },
    [symbol.for('jest-native-now')]: {
      enumerable: false,
      value: globalObject.Date.now.bind(globalObject.Date),
      writable: false
    },
    [symbol.for('jest-native-read-file')]: {
      enumerable: false,
      value: _fs().default.readFileSync.bind(_fs().default),
      writable: false
    },
    [symbol.for('jest-native-write-file')]: {
      enumerable: false,
      value: _fs().default.writeFileSync.bind(_fs().default),
      writable: false
    },
    [symbol.for('jest-native-exists-file')]: {
      enumerable: false,
      value: _fs().default.existsSync.bind(_fs().default),
      writable: false
    },
    'jest-symbol-do-not-touch': {
      enumerable: false,
      value: symbol,
      writable: false
    }
  }); // Forward some APIs.

  DTRACE.forEach(dtrace => {
    // @ts-ignore: no index
    globalObject[dtrace] = function(...args) {
      // @ts-ignore: no index
      return commonjsGlobal[dtrace].apply(this, args);
    };
  }); // Forward some others (this breaks the sandbox but for now it's OK).

  globalObject.Buffer = commonjsGlobal.Buffer;
  globalObject.setImmediate = commonjsGlobal.setImmediate;
  globalObject.clearImmediate = commonjsGlobal.clearImmediate;
  return Object.assign(globalObject, (0, _deepCyclicCopy.default)(globals));
}
});

unwrapExports(installCommonGlobals);

var interopRequireDefault_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = interopRequireDefault;

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// copied from https://github.com/babel/babel/blob/56044c7851d583d498f919e9546caddf8f80a72f/packages/babel-helpers/src/helpers.js#L558-L562
function interopRequireDefault(obj) {
  return obj && obj.__esModule
    ? obj
    : {
        default: obj
      };
}
});

unwrapExports(interopRequireDefault_1);

const vendors = [
	{
		name: "AppVeyor",
		constant: "APPVEYOR",
		env: "APPVEYOR",
		pr: "APPVEYOR_PULL_REQUEST_NUMBER"
	},
	{
		name: "Azure Pipelines",
		constant: "AZURE_PIPELINES",
		env: "SYSTEM_TEAMFOUNDATIONCOLLECTIONURI",
		pr: "SYSTEM_PULLREQUEST_PULLREQUESTID"
	},
	{
		name: "Bamboo",
		constant: "BAMBOO",
		env: "bamboo_planKey"
	},
	{
		name: "Bitbucket Pipelines",
		constant: "BITBUCKET",
		env: "BITBUCKET_COMMIT",
		pr: "BITBUCKET_PR_ID"
	},
	{
		name: "Bitrise",
		constant: "BITRISE",
		env: "BITRISE_IO",
		pr: "BITRISE_PULL_REQUEST"
	},
	{
		name: "Buddy",
		constant: "BUDDY",
		env: "BUDDY_WORKSPACE_ID",
		pr: "BUDDY_EXECUTION_PULL_REQUEST_ID"
	},
	{
		name: "Buildkite",
		constant: "BUILDKITE",
		env: "BUILDKITE",
		pr: {
			env: "BUILDKITE_PULL_REQUEST",
			ne: "false"
		}
	},
	{
		name: "CircleCI",
		constant: "CIRCLE",
		env: "CIRCLECI",
		pr: "CIRCLE_PULL_REQUEST"
	},
	{
		name: "Cirrus CI",
		constant: "CIRRUS",
		env: "CIRRUS_CI",
		pr: "CIRRUS_PR"
	},
	{
		name: "AWS CodeBuild",
		constant: "CODEBUILD",
		env: "CODEBUILD_BUILD_ARN"
	},
	{
		name: "Codeship",
		constant: "CODESHIP",
		env: {
			CI_NAME: "codeship"
		}
	},
	{
		name: "Drone",
		constant: "DRONE",
		env: "DRONE",
		pr: {
			DRONE_BUILD_EVENT: "pull_request"
		}
	},
	{
		name: "dsari",
		constant: "DSARI",
		env: "DSARI"
	},
	{
		name: "GitLab CI",
		constant: "GITLAB",
		env: "GITLAB_CI"
	},
	{
		name: "GoCD",
		constant: "GOCD",
		env: "GO_PIPELINE_LABEL"
	},
	{
		name: "Hudson",
		constant: "HUDSON",
		env: "HUDSON_URL"
	},
	{
		name: "Jenkins",
		constant: "JENKINS",
		env: [
			"JENKINS_URL",
			"BUILD_ID"
		],
		pr: {
			any: [
				"ghprbPullId",
				"CHANGE_ID"
			]
		}
	},
	{
		name: "Magnum CI",
		constant: "MAGNUM",
		env: "MAGNUM"
	},
	{
		name: "Netlify CI",
		constant: "NETLIFY",
		env: "NETLIFY_BUILD_BASE",
		pr: {
			env: "PULL_REQUEST",
			ne: "false"
		}
	},
	{
		name: "Sail CI",
		constant: "SAIL",
		env: "SAILCI",
		pr: "SAIL_PULL_REQUEST_NUMBER"
	},
	{
		name: "Semaphore",
		constant: "SEMAPHORE",
		env: "SEMAPHORE",
		pr: "PULL_REQUEST_NUMBER"
	},
	{
		name: "Shippable",
		constant: "SHIPPABLE",
		env: "SHIPPABLE",
		pr: {
			IS_PULL_REQUEST: "true"
		}
	},
	{
		name: "Solano CI",
		constant: "SOLANO",
		env: "TDDIUM",
		pr: "TDDIUM_PR_ID"
	},
	{
		name: "Strider CD",
		constant: "STRIDER",
		env: "STRIDER"
	},
	{
		name: "TaskCluster",
		constant: "TASKCLUSTER",
		env: [
			"TASK_ID",
			"RUN_ID"
		]
	},
	{
		name: "TeamCity",
		constant: "TEAMCITY",
		env: "TEAMCITY_VERSION"
	},
	{
		name: "Travis CI",
		constant: "TRAVIS",
		env: "TRAVIS",
		pr: {
			env: "TRAVIS_PULL_REQUEST",
			ne: "false"
		}
	}
];

const vendors$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': vendors
});

const vendors$2 = getCjsExportFromNamespace(vendors$1);

var ciInfo = createCommonjsModule(function (module, exports) {



var env = process.env;

// Used for testing only
Object.defineProperty(exports, '_vendors', {
  value: vendors$2.map(function (v) { return v.constant })
});

exports.name = null;
exports.isPR = null;

vendors$2.forEach(function (vendor) {
  var envs = Array.isArray(vendor.env) ? vendor.env : [vendor.env];
  var isCI = envs.every(function (obj) {
    return checkEnv(obj)
  });

  exports[vendor.constant] = isCI;

  if (isCI) {
    exports.name = vendor.name;

    switch (typeof vendor.pr) {
      case 'string':
        // "pr": "CIRRUS_PR"
        exports.isPR = !!env[vendor.pr];
        break
      case 'object':
        if ('env' in vendor.pr) {
          // "pr": { "env": "BUILDKITE_PULL_REQUEST", "ne": "false" }
          exports.isPR = vendor.pr.env in env && env[vendor.pr.env] !== vendor.pr.ne;
        } else if ('any' in vendor.pr) {
          // "pr": { "any": ["ghprbPullId", "CHANGE_ID"] }
          exports.isPR = vendor.pr.any.some(function (key) {
            return !!env[key]
          });
        } else {
          // "pr": { "DRONE_BUILD_EVENT": "pull_request" }
          exports.isPR = checkEnv(vendor.pr);
        }
        break
      default:
        // PR detection not supported for this vendor
        exports.isPR = null;
    }
  }
});

exports.isCI = !!(
  env.CI || // Travis CI, CircleCI, Cirrus CI, Gitlab CI, Appveyor, CodeShip, dsari
  env.CONTINUOUS_INTEGRATION || // Travis CI, Cirrus CI
  env.BUILD_NUMBER || // Jenkins, TeamCity
  env.RUN_ID || // TaskCluster, dsari
  exports.name ||
  false
);

function checkEnv (obj) {
  if (typeof obj === 'string') return !!env[obj]
  return Object.keys(obj).every(function (k) {
    return env[k] === obj[k]
  })
}
});
var ciInfo_1 = ciInfo.name;
var ciInfo_2 = ciInfo.isPR;
var ciInfo_3 = ciInfo.isCI;

var isCi = ciInfo.isCI;

var isInteractive = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

function _isCi() {
  const data = _interopRequireDefault(isCi);

  _isCi = function _isCi() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var _default =
  !!process.stdout.isTTY && process.env.TERM !== 'dumb' && !_isCi().default;

exports.default = _default;
});

unwrapExports(isInteractive);

var isPromise_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const Promise = commonjsGlobal.Promise; // see ES2015 spec 25.4.4.5, https://stackoverflow.com/a/38339199

const isPromise = candidate => Promise.resolve(candidate) === candidate;

var _default = isPromise;
exports.default = _default;
});

unwrapExports(isPromise_1);

var setGlobal = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var _default = (globalToMutate, key, value) => {
  // @ts-ignore: no index
  globalToMutate[key] = value;
};

exports.default = _default;
});

unwrapExports(setGlobal);

var convertDescriptorToString_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = convertDescriptorToString;

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// See: https://github.com/facebook/jest/pull/5154
function convertDescriptorToString(descriptor) {
  if (
    typeof descriptor === 'string' ||
    typeof descriptor === 'number' ||
    descriptor === undefined
  ) {
    return descriptor;
  }

  if (typeof descriptor !== 'function') {
    throw new Error('describe expects a class, function, number, or string.');
  }

  if (descriptor.name !== undefined) {
    return descriptor.name;
  } // Fallback for old browsers, pardon Flow

  const stringified = descriptor.toString();
  const typeDescriptorMatch = stringified.match(/class|function/);
  const indexOfNameSpace = // @ts-ignore: typeDescriptorMatch exists
    typeDescriptorMatch.index + typeDescriptorMatch[0].length;
  const indexOfNameAfterSpace = stringified.search(/\(|\{/);
  const name = stringified.substring(indexOfNameSpace, indexOfNameAfterSpace);
  return name.trim();
}
});

unwrapExports(convertDescriptorToString_1);

var specialChars = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.CLEAR = exports.ICONS = exports.ARROW = void 0;

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const isWindows = process.platform === 'win32';
const ARROW = ' \u203A ';
exports.ARROW = ARROW;
const ICONS = {
  failed: isWindows ? '\u00D7' : '\u2715',
  pending: '\u25CB',
  success: isWindows ? '\u221A' : '\u2713',
  todo: '\u270E'
};
exports.ICONS = ICONS;
const CLEAR = isWindows ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H';
exports.CLEAR = CLEAR;
});

unwrapExports(specialChars);
var specialChars_1 = specialChars.CLEAR;
var specialChars_2 = specialChars.ICONS;
var specialChars_3 = specialChars.ARROW;

var replacePathSepForGlob_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = replacePathSepForGlob;

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function replacePathSepForGlob(path) {
  return path.replace(/\\(?![{}()+?.^$])/g, '/');
}
});

unwrapExports(replacePathSepForGlob_1);

var testPathPatternToRegExp = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// Because we serialize/deserialize globalConfig when we spawn workers,
// we can't pass regular expression. Using this shared function on both sides
// will ensure that we produce consistent regexp for testPathPattern.
var _default = testPathPattern => new RegExp(testPathPattern, 'i');

exports.default = _default;
});

unwrapExports(testPathPatternToRegExp);

var preRunMessage = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.remove = exports.print = void 0;

function _chalk() {
  const data = _interopRequireDefault(ansiColors);

  _chalk = function _chalk() {
    return data;
  };

  return data;
}

var _clearLine = _interopRequireDefault(clearLine);

var _isInteractive = _interopRequireDefault(isInteractive);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const print = stream => {
  if (_isInteractive.default) {
    stream.write(
      _chalk().default.bold.dim('Determining test suites to run...')
    );
  }
};

exports.print = print;

const remove = stream => {
  if (_isInteractive.default) {
    (0, _clearLine.default)(stream);
  }
};

exports.remove = remove;
});

unwrapExports(preRunMessage);
var preRunMessage_1 = preRunMessage.remove;
var preRunMessage_2 = preRunMessage.print;

var pluralize_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = pluralize;

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function pluralize(word, count) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}
});

unwrapExports(pluralize_1);

var build$6 = createCommonjsModule(function (module) {

function _fakeTimers() {
  const data = build$2;

  _fakeTimers = function _fakeTimers() {
    return data;
  };

  return data;
}

function _sourceMap() {
  const data = build$3;

  _sourceMap = function _sourceMap() {
    return data;
  };

  return data;
}

function _console() {
  const data = build$4;

  _console = function _console() {
    return data;
  };

  return data;
}

function _testResult() {
  const data = build$5;

  _testResult = function _testResult() {
    return data;
  };

  return data;
}

var _clearLine = _interopRequireDefault2(clearLine);

var _createDirectory = _interopRequireDefault2(createDirectory_1);

var _ErrorWithStack = _interopRequireDefault2(ErrorWithStack_1);

var _getFailedSnapshotTests = _interopRequireDefault2(
  getFailedSnapshotTests_1
);

var _installCommonGlobals = _interopRequireDefault2(
  installCommonGlobals
);

var _interopRequireDefault = _interopRequireDefault2(
  interopRequireDefault_1
);

var _isInteractive = _interopRequireDefault2(isInteractive);

var _isPromise = _interopRequireDefault2(isPromise_1);

var _setGlobal = _interopRequireDefault2(setGlobal);

var _deepCyclicCopy = _interopRequireDefault2(deepCyclicCopy_1);

var _convertDescriptorToString = _interopRequireDefault2(
  convertDescriptorToString_1
);

var specialChars$1 = _interopRequireWildcard(specialChars);

var _replacePathSepForGlob = _interopRequireDefault2(
  replacePathSepForGlob_1
);

var _testPathPatternToRegExp = _interopRequireDefault2(
  testPathPatternToRegExp
);

var preRunMessage$1 = _interopRequireWildcard(preRunMessage);

var _pluralize = _interopRequireDefault2(pluralize_1);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};
    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc =
            Object.defineProperty && Object.getOwnPropertyDescriptor
              ? Object.getOwnPropertyDescriptor(obj, key)
              : {};
          if (desc.get || desc.set) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
    }
    newObj.default = obj;
    return newObj;
  }
}

function _interopRequireDefault2(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// TODO: Remove these exports in the next major
module.exports = {
  BufferedConsole: _console().BufferedConsole,
  Console: _console().CustomConsole,
  ErrorWithStack: _ErrorWithStack.default,
  FakeTimers: _fakeTimers().JestFakeTimers,
  NullConsole: _console().NullConsole,
  clearLine: _clearLine.default,
  convertDescriptorToString: _convertDescriptorToString.default,
  createDirectory: _createDirectory.default,
  deepCyclicCopy: _deepCyclicCopy.default,
  formatTestResults: _testResult().formatTestResults,
  getCallsite: _sourceMap().getCallsite,
  getConsoleOutput: _console().getConsoleOutput,
  getFailedSnapshotTests: _getFailedSnapshotTests.default,
  installCommonGlobals: _installCommonGlobals.default,
  interopRequireDefault: _interopRequireDefault.default,
  isInteractive: _isInteractive.default,
  isPromise: _isPromise.default,
  pluralize: _pluralize.default,
  preRunMessage: preRunMessage$1,
  replacePathSepForGlob: _replacePathSepForGlob.default,
  setGlobal: _setGlobal.default,
  specialChars: specialChars$1,
  testPathPatternToRegExp: _testPathPatternToRegExp.default
};
});

unwrapExports(build$6);
var build_1$1 = build$6.BufferedConsole;
var build_2$1 = build$6.Console;
var build_3$1 = build$6.ErrorWithStack;
var build_4$1 = build$6.FakeTimers;
var build_5$1 = build$6.NullConsole;
var build_6$1 = build$6.clearLine;
var build_7 = build$6.convertDescriptorToString;
var build_8 = build$6.createDirectory;
var build_9 = build$6.deepCyclicCopy;
var build_10 = build$6.formatTestResults;
var build_11 = build$6.getCallsite;
var build_12 = build$6.getConsoleOutput;
var build_13 = build$6.getFailedSnapshotTests;
var build_14 = build$6.installCommonGlobals;
var build_15 = build$6.interopRequireDefault;
var build_16 = build$6.isInteractive;
var build_17 = build$6.isPromise;
var build_18 = build$6.pluralize;
var build_19 = build$6.preRunMessage;
var build_20 = build$6.replacePathSepForGlob;
var build_21 = build$6.setGlobal;
var build_22 = build$6.specialChars;
var build_23 = build$6.testPathPatternToRegExp;

var build$7 = createCommonjsModule(function (module) {

function _vm() {
  const data = _interopRequireDefault(vm$1);

  _vm = function _vm() {
    return data;
  };

  return data;
}

function _jestMock() {
  const data = build;

  _jestMock = function _jestMock() {
    return data;
  };

  return data;
}

function _jestUtil() {
  const data = build$6;

  _jestUtil = function _jestUtil() {
    return data;
  };

  return data;
}

function _fakeTimers() {
  const data = build$2;

  _fakeTimers = function _fakeTimers() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

class NodeEnvironment {
  constructor(config) {
    _defineProperty(this, 'context', void 0);

    _defineProperty(this, 'fakeTimers', void 0);

    _defineProperty(this, 'global', void 0);

    _defineProperty(this, 'moduleMocker', void 0);

    this.context = _vm().default.createContext();

    const global = (this.global = _vm().default.runInContext(
      'this',
      Object.assign(this.context, config.testEnvironmentOptions)
    ));

    global.global = global;
    global.clearInterval = clearInterval;
    global.clearTimeout = clearTimeout;
    global.setInterval = setInterval;
    global.setTimeout = setTimeout;
    global.ArrayBuffer = ArrayBuffer; // URL and URLSearchParams are global in Node >= 10

    if (typeof URL !== 'undefined' && typeof URLSearchParams !== 'undefined') {
      /* global URL, URLSearchParams */
      global.URL = URL;
      global.URLSearchParams = URLSearchParams;
    } // TextDecoder and TextDecoder are global in Node >= 11

    if (
      typeof TextEncoder !== 'undefined' &&
      typeof TextDecoder !== 'undefined'
    ) {
      /* global TextEncoder, TextDecoder */
      global.TextEncoder = TextEncoder;
      global.TextDecoder = TextDecoder;
    }

    (0, _jestUtil().installCommonGlobals)(global, config.globals);
    this.moduleMocker = new (_jestMock()).ModuleMocker(global);

    const timerIdToRef = id => ({
      id,

      ref() {
        return this;
      },

      unref() {
        return this;
      }
    });

    const timerRefToId = timer => (timer && timer.id) || undefined;

    const timerConfig = {
      idToRef: timerIdToRef,
      refToId: timerRefToId
    };
    this.fakeTimers = new (_fakeTimers()).JestFakeTimers({
      config,
      global,
      moduleMocker: this.moduleMocker,
      timerConfig
    });
  }

  setup() {
    return Promise.resolve();
  }

  teardown() {
    if (this.fakeTimers) {
      this.fakeTimers.dispose();
    }

    this.context = null;
    this.fakeTimers = null;
    return Promise.resolve();
  } // TS infers the return type to be `any`, since that's what `runInContext`
  // returns.

  runScript(script) {
    if (this.context) {
      return script.runInContext(this.context);
    }

    return null;
  }
}

module.exports = NodeEnvironment;
});

const NodeEnvironment = unwrapExports(build$7);

function createJestPuppeteerEnvironment() {
    const JestEnvironment = class extends NodeEnvironment {
        constructor(config) {
            super(config);
            this.browser = null;
            this.pages = [];
        }
        async setup() {
            if (process.env.__STENCIL_E2E_TESTS__ === 'true') {
                this.global.__NEW_TEST_PAGE__ = this.newPuppeteerPage.bind(this);
                this.global.__CLOSE_OPEN_PAGES__ = this.closeOpenPages.bind(this);
            }
        }
        async newPuppeteerPage() {
            if (!this.browser) {
                // load the browser and page on demand
                this.browser = await connectBrowser();
            }
            const page = await newBrowserPage(this.browser);
            this.pages.push(page);
            const env = process.env;
            if (typeof env.__STENCIL_DEFAULT_TIMEOUT__ === 'string') {
                page.setDefaultTimeout(parseInt(env.__STENCIL_DEFAULT_TIMEOUT__, 10));
            }
            return page;
        }
        async closeOpenPages() {
            await Promise.all(this.pages.map(page => page.close()));
            this.pages.length = 0;
        }
        async teardown() {
            await super.teardown();
            await this.closeOpenPages();
            await disconnectBrowser(this.browser);
            this.browser = null;
        }
    };
    return JestEnvironment;
}

const IS_NODE_ENV = typeof global !== 'undefined' &&
    typeof require === 'function' &&
    !!global.process &&
    Array.isArray(global.process.argv) &&
    typeof __filename === 'string' &&
    (!global.origin || typeof global.origin !== 'string');
const IS_NODE_WINDOWS_ENV = IS_NODE_ENV && global.process.platform === 'win32';
const IS_LOCATION_ENV = typeof location !== 'undefined';
const IS_WEB_WORKER_ENV = typeof self !== 'undefined' && typeof self.importScripts === 'function' && typeof XMLHttpRequest !== 'undefined' && IS_LOCATION_ENV && typeof navigator !== 'undefined';
const IS_FETCH_ENV = typeof fetch === 'function';
const HAS_WEB_WORKER = typeof Worker === 'function' && IS_LOCATION_ENV;

const formatLazyBundleRuntimeMeta = (bundleId, cmps) => {
    return [bundleId, cmps.map(cmp => formatComponentRuntimeMeta(cmp, true))];
};
const formatComponentRuntimeMeta = (compilerMeta, includeMethods) => {
    let flags = 0;
    if (compilerMeta.encapsulation === 'shadow') {
        flags |= 1 /* shadowDomEncapsulation */;
        if (compilerMeta.shadowDelegatesFocus) {
            flags |= 16 /* shadowDelegatesFocus */;
        }
    }
    else if (compilerMeta.encapsulation === 'scoped') {
        flags |= 2 /* scopedCssEncapsulation */;
    }
    if (compilerMeta.encapsulation !== 'shadow' && compilerMeta.htmlTagNames.includes('slot')) {
        flags |= 4 /* hasSlotRelocation */;
    }
    const members = formatComponentRuntimeMembers(compilerMeta, includeMethods);
    const hostListeners = formatHostListeners(compilerMeta);
    return trimFalsy([flags, compilerMeta.tagName, Object.keys(members).length > 0 ? members : undefined, hostListeners.length > 0 ? hostListeners : undefined]);
};
const formatComponentRuntimeMembers = (compilerMeta, includeMethods = true) => {
    return Object.assign(Object.assign(Object.assign({}, formatPropertiesRuntimeMember(compilerMeta.properties)), formatStatesRuntimeMember(compilerMeta.states)), (includeMethods ? formatMethodsRuntimeMember(compilerMeta.methods) : {}));
};
const formatPropertiesRuntimeMember = (properties) => {
    const runtimeMembers = {};
    properties.forEach(member => {
        runtimeMembers[member.name] = trimFalsy([
            /**
             * [0] member type
             */
            formatFlags(member),
            formatAttrName(member),
        ]);
    });
    return runtimeMembers;
};
const formatFlags = (compilerProperty) => {
    let type = formatPropType(compilerProperty.type);
    if (compilerProperty.mutable) {
        type |= 1024 /* Mutable */;
    }
    if (compilerProperty.reflect) {
        type |= 512 /* ReflectAttr */;
    }
    return type;
};
const formatAttrName = (compilerProperty) => {
    if (typeof compilerProperty.attribute === 'string') {
        // string attr name means we should observe this attribute
        if (compilerProperty.name === compilerProperty.attribute) {
            // property name and attribute name are the exact same
            // true value means to use the property name for the attribute name
            return undefined;
        }
        // property name and attribute name are not the same
        // so we need to return the actual string value
        // example: "multiWord" !== "multi-word"
        return compilerProperty.attribute;
    }
    // we shouldn't even observe an attribute for this property
    return undefined;
};
const formatPropType = (type) => {
    if (type === 'string') {
        return 1 /* String */;
    }
    if (type === 'number') {
        return 2 /* Number */;
    }
    if (type === 'boolean') {
        return 4 /* Boolean */;
    }
    if (type === 'any') {
        return 8 /* Any */;
    }
    return 16 /* Unknown */;
};
const formatStatesRuntimeMember = (states) => {
    const runtimeMembers = {};
    states.forEach(member => {
        runtimeMembers[member.name] = [
            32 /* State */,
        ];
    });
    return runtimeMembers;
};
const formatMethodsRuntimeMember = (methods) => {
    const runtimeMembers = {};
    methods.forEach(member => {
        runtimeMembers[member.name] = [
            64 /* Method */,
        ];
    });
    return runtimeMembers;
};
const formatHostListeners = (compilerMeta) => {
    return compilerMeta.listeners.map(compilerListener => {
        const hostListener = [computeListenerFlags(compilerListener), compilerListener.name, compilerListener.method];
        return hostListener;
    });
};
const computeListenerFlags = (listener) => {
    let flags = 0;
    if (listener.capture) {
        flags |= 2 /* Capture */;
    }
    if (listener.passive) {
        flags |= 1 /* Passive */;
    }
    switch (listener.target) {
        case 'document':
            flags |= 4 /* TargetDocument */;
            break;
        case 'window':
            flags |= 8 /* TargetWindow */;
            break;
        case 'parent':
            flags |= 16 /* TargetParent */;
            break;
        case 'body':
            flags |= 32 /* TargetBody */;
            break;
    }
    return flags;
};
const trimFalsy = (data) => {
    const arr = data;
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i]) {
            break;
        }
        // if falsy, safe to pop()
        arr.pop();
    }
    return arr;
};

const isDefined = (v) => v !== null && v !== undefined;
const isFunction = (v) => typeof v === 'function';
const isString$2 = (v) => typeof v === 'string';
const isIterable = (v) => isDefined(v) && isFunction(v[Symbol.iterator]);

/**
 * Checks if the path is the OS root path, such as "/" or "C:\"
 */
const isRootPath = (p) => p === '/' || windowsPathRegex.test(p);
// https://github.com/nodejs/node/blob/5883a59b21a97e8b7339f435c977155a2c29ba8d/lib/path.js#L43
const windowsPathRegex = /^(?:[a-zA-Z]:|[\\/]{2}[^\\/]+[\\/]+[^\\/]+)?[\\/]$/;

const splitLineBreaks = (sourceText) => {
    if (typeof sourceText !== 'string')
        return [];
    sourceText = sourceText.replace(/\\r/g, '\n');
    return sourceText.split('\n');
};

const hasError = (diagnostics) => {
    if (diagnostics == null || diagnostics.length === 0) {
        return false;
    }
    return diagnostics.some(d => d.level === 'error' && d.type !== 'runtime');
};
const hasWarning = (diagnostics) => {
    if (diagnostics == null || diagnostics.length === 0) {
        return false;
    }
    return diagnostics.some(d => d.level === 'warn');
};
const TASK_CANCELED_MSG = `task canceled`;

/**
 * Convert Windows backslash paths to slash paths: foo\\bar ➔ foo/bar
 * Forward-slash paths can be used in Windows as long as they're not
 * extended-length paths and don't contain any non-ascii characters.
 * This was created since the path methods in Node.js outputs \\ paths on Windows.
 */
const normalizePath = (path) => {
    if (typeof path !== 'string') {
        throw new Error(`invalid path to normalize`);
    }
    path = normalizeSlashes(path.trim());
    const components = pathComponents(path, getRootLength(path));
    const reducedComponents = reducePathComponents(components);
    const rootPart = reducedComponents[0];
    const secondPart = reducedComponents[1];
    const normalized = rootPart + reducedComponents.slice(1).join('/');
    if (normalized === '') {
        return '.';
    }
    if (rootPart === '' && secondPart && path.includes('/') && !secondPart.startsWith('.') && !secondPart.startsWith('@')) {
        return './' + normalized;
    }
    return normalized;
};
const normalizeSlashes = (path) => path.replace(backslashRegExp, '/');
const altDirectorySeparator = '\\';
const urlSchemeSeparator = '://';
const backslashRegExp = /\\/g;
const reducePathComponents = (components) => {
    if (!Array.isArray(components) || components.length === 0) {
        return [];
    }
    const reduced = [components[0]];
    for (let i = 1; i < components.length; i++) {
        const component = components[i];
        if (!component)
            continue;
        if (component === '.')
            continue;
        if (component === '..') {
            if (reduced.length > 1) {
                if (reduced[reduced.length - 1] !== '..') {
                    reduced.pop();
                    continue;
                }
            }
            else if (reduced[0])
                continue;
        }
        reduced.push(component);
    }
    return reduced;
};
const getRootLength = (path) => {
    const rootLength = getEncodedRootLength(path);
    return rootLength < 0 ? ~rootLength : rootLength;
};
const getEncodedRootLength = (path) => {
    if (!path)
        return 0;
    const ch0 = path.charCodeAt(0);
    // POSIX or UNC
    if (ch0 === 47 /* slash */ || ch0 === 92 /* backslash */) {
        if (path.charCodeAt(1) !== ch0)
            return 1; // POSIX: "/" (or non-normalized "\")
        const p1 = path.indexOf(ch0 === 47 /* slash */ ? '/' : altDirectorySeparator, 2);
        if (p1 < 0)
            return path.length; // UNC: "//server" or "\\server"
        return p1 + 1; // UNC: "//server/" or "\\server\"
    }
    // DOS
    if (isVolumeCharacter(ch0) && path.charCodeAt(1) === 58 /* colon */) {
        const ch2 = path.charCodeAt(2);
        if (ch2 === 47 /* slash */ || ch2 === 92 /* backslash */)
            return 3; // DOS: "c:/" or "c:\"
        if (path.length === 2)
            return 2; // DOS: "c:" (but not "c:d")
    }
    // URL
    const schemeEnd = path.indexOf(urlSchemeSeparator);
    if (schemeEnd !== -1) {
        const authorityStart = schemeEnd + urlSchemeSeparator.length;
        const authorityEnd = path.indexOf('/', authorityStart);
        if (authorityEnd !== -1) {
            // URL: "file:///", "file://server/", "file://server/path"
            // For local "file" URLs, include the leading DOS volume (if present).
            // Per https://www.ietf.org/rfc/rfc1738.txt, a host of "" or "localhost" is a
            // special case interpreted as "the machine from which the URL is being interpreted".
            const scheme = path.slice(0, schemeEnd);
            const authority = path.slice(authorityStart, authorityEnd);
            if (scheme === 'file' && (authority === '' || authority === 'localhost') && isVolumeCharacter(path.charCodeAt(authorityEnd + 1))) {
                const volumeSeparatorEnd = getFileUrlVolumeSeparatorEnd(path, authorityEnd + 2);
                if (volumeSeparatorEnd !== -1) {
                    if (path.charCodeAt(volumeSeparatorEnd) === 47 /* slash */) {
                        // URL: "file:///c:/", "file://localhost/c:/", "file:///c%3a/", "file://localhost/c%3a/"
                        return ~(volumeSeparatorEnd + 1);
                    }
                    if (volumeSeparatorEnd === path.length) {
                        // URL: "file:///c:", "file://localhost/c:", "file:///c$3a", "file://localhost/c%3a"
                        // but not "file:///c:d" or "file:///c%3ad"
                        return ~volumeSeparatorEnd;
                    }
                }
            }
            return ~(authorityEnd + 1); // URL: "file://server/", "http://server/"
        }
        return ~path.length; // URL: "file://server", "http://server"
    }
    // relative
    return 0;
};
const isVolumeCharacter = (charCode) => (charCode >= 97 /* a */ && charCode <= 122 /* z */) || (charCode >= 65 /* A */ && charCode <= 90 /* Z */);
const getFileUrlVolumeSeparatorEnd = (url, start) => {
    const ch0 = url.charCodeAt(start);
    if (ch0 === 58 /* colon */)
        return start + 1;
    if (ch0 === 37 /* percent */ && url.charCodeAt(start + 1) === 51 /* _3 */) {
        const ch2 = url.charCodeAt(start + 2);
        if (ch2 === 97 /* a */ || ch2 === 65 /* A */)
            return start + 3;
    }
    return -1;
};
const pathComponents = (path, rootLength) => {
    const root = path.substring(0, rootLength);
    const rest = path.substring(rootLength).split('/');
    const restLen = rest.length;
    if (restLen > 0 && !rest[restLen - 1]) {
        rest.pop();
    }
    return [root, ...rest];
};
/**
 * Same as normalizePath(), expect it'll also strip any querystrings
 * from the path name. So /dir/file.css?tag=cmp-a becomes /dir/file.css
 */
const normalizeFsPath = (p) => normalizePath(p.split('?')[0]);

const loadTypeScriptDiagnostic = (tsDiagnostic) => {
    const d = {
        level: 'warn',
        type: 'typescript',
        language: 'typescript',
        header: 'TypeScript',
        code: tsDiagnostic.code.toString(),
        messageText: flattenDiagnosticMessageText(tsDiagnostic, tsDiagnostic.messageText),
        relFilePath: null,
        absFilePath: null,
        lines: [],
    };
    if (tsDiagnostic.category === 1) {
        d.level = 'error';
    }
    if (tsDiagnostic.file) {
        d.absFilePath = tsDiagnostic.file.fileName;
        const sourceText = tsDiagnostic.file.text;
        const srcLines = splitLineBreaks(sourceText);
        const posData = tsDiagnostic.file.getLineAndCharacterOfPosition(tsDiagnostic.start);
        const errorLine = {
            lineIndex: posData.line,
            lineNumber: posData.line + 1,
            text: srcLines[posData.line],
            errorCharStart: posData.character,
            errorLength: Math.max(tsDiagnostic.length, 1),
        };
        d.lineNumber = errorLine.lineNumber;
        d.columnNumber = errorLine.errorCharStart + 1;
        d.lines.push(errorLine);
        if (errorLine.errorLength === 0 && errorLine.errorCharStart > 0) {
            errorLine.errorLength = 1;
            errorLine.errorCharStart--;
        }
        if (errorLine.lineIndex > 0) {
            const previousLine = {
                lineIndex: errorLine.lineIndex - 1,
                lineNumber: errorLine.lineNumber - 1,
                text: srcLines[errorLine.lineIndex - 1],
                errorCharStart: -1,
                errorLength: -1,
            };
            d.lines.unshift(previousLine);
        }
        if (errorLine.lineIndex + 1 < srcLines.length) {
            const nextLine = {
                lineIndex: errorLine.lineIndex + 1,
                lineNumber: errorLine.lineNumber + 1,
                text: srcLines[errorLine.lineIndex + 1],
                errorCharStart: -1,
                errorLength: -1,
            };
            d.lines.push(nextLine);
        }
    }
    return d;
};
const flattenDiagnosticMessageText = (tsDiagnostic, diag) => {
    if (typeof diag === 'string') {
        return diag;
    }
    else if (diag === undefined) {
        return '';
    }
    const ignoreCodes = [];
    const isStencilConfig = tsDiagnostic.file.fileName.includes('stencil.config');
    if (isStencilConfig) {
        ignoreCodes.push(2322);
    }
    let result = '';
    if (!ignoreCodes.includes(diag.code)) {
        result = diag.messageText;
        if (isIterable(diag.next)) {
            for (const kid of diag.next) {
                result += flattenDiagnosticMessageText(tsDiagnostic, kid);
            }
        }
    }
    if (isStencilConfig) {
        result = result.replace(`type 'StencilConfig'`, `Stencil Config`);
        result = result.replace(`Object literal may only specify known properties, but `, ``);
        result = result.replace(`Object literal may only specify known properties, and `, ``);
    }
    return result.trim();
};

const isOutputTargetDistLazy = (o) => o.type === DIST_LAZY;
const isOutputTargetWww = (o) => o.type === WWW;
const DIST_LAZY = `dist-lazy`;
const WWW = `www`;

function shuffleArray(array) {
    // http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
function getAppScriptUrl(config, browserUrl) {
    const appFileName = `${config.fsNamespace}.esm.js`;
    return getAppUrl(config, browserUrl, appFileName);
}
function getAppStyleUrl(config, browserUrl) {
    if (config.globalStyle) {
        const appFileName = `${config.fsNamespace}.css`;
        return getAppUrl(config, browserUrl, appFileName);
    }
    return null;
}
function getAppUrl(config, browserUrl, appFileName) {
    const wwwOutput = config.outputTargets.find(isOutputTargetWww);
    if (wwwOutput) {
        const appBuildDir = wwwOutput.buildDir;
        const appFilePath = path$1.join(appBuildDir, appFileName);
        const appUrlPath = path$1.relative(wwwOutput.dir, appFilePath);
        const url = new URL(appUrlPath, browserUrl);
        return url.href;
    }
    const distOutput = config.outputTargets.find(isOutputTargetDistLazy);
    if (distOutput) {
        const appBuildDir = distOutput.esmDir;
        const appFilePath = path$1.join(appBuildDir, appFileName);
        const appUrlPath = path$1.relative(config.rootDir, appFilePath);
        const url = new URL(appUrlPath, browserUrl);
        return url.href;
    }
    return browserUrl;
}

function buildJestArgv(config) {
    const yargs = require('yargs');
    const args = [...config.flags.unknownArgs.slice(), ...config.flags.knownArgs.slice()];
    if (!args.some(a => a.startsWith('--max-workers') || a.startsWith('--maxWorkers'))) {
        args.push(`--max-workers=${config.maxConcurrentWorkers}`);
    }
    if (config.flags.devtools) {
        args.push('--runInBand');
    }
    config.logger.info(config.logger.magenta(`jest args: ${args.join(' ')}`));
    const { options } = require('jest-cli/build/cli/args');
    const jestArgv = yargs(args).options(options).argv;
    jestArgv.config = buildJestConfig(config);
    if (typeof jestArgv.maxWorkers === 'string') {
        try {
            jestArgv.maxWorkers = parseInt(jestArgv.maxWorkers, 10);
        }
        catch (e) { }
    }
    if (typeof jestArgv.ci === 'string') {
        jestArgv.ci = jestArgv.ci === 'true' || jestArgv.ci === '';
    }
    return jestArgv;
}
function buildJestConfig(config) {
    const jestDefaults = require('jest-config').defaults;
    const validJestConfigKeys = Object.keys(jestDefaults);
    const jestConfig = {};
    Object.keys(config.testing).forEach(key => {
        if (validJestConfigKeys.includes(key)) {
            jestConfig[key] = config.testing[key];
        }
    });
    jestConfig.rootDir = config.rootDir;
    if (Array.isArray(config.testing.reporters)) {
        jestConfig.reporters = config.testing.reporters;
    }
    return JSON.stringify(jestConfig);
}
function getProjectListFromCLIArgs(config, argv) {
    const projects = argv.projects ? argv.projects : [];
    projects.push(config.rootDir);
    return projects;
}

function setScreenshotEmulateData(userEmulateConfig, env) {
    const screenshotEmulate = {
        userAgent: 'default',
        viewport: {
            width: 800,
            height: 600,
            deviceScaleFactor: 1,
            isMobile: false,
            hasTouch: false,
            isLandscape: false,
        },
    };
    if (typeof userEmulateConfig.device === 'string') {
        try {
            const deviceDescriptors = require(env.__STENCIL_PUPPETEER_MODULE__ + '/DeviceDescriptors');
            const puppeteerEmulateOpts = deviceDescriptors[userEmulateConfig.device];
            if (!puppeteerEmulateOpts) {
                console.error(`invalid emulate device: ${userEmulateConfig.device}`);
                return;
            }
            screenshotEmulate.device = userEmulateConfig.device;
            screenshotEmulate.userAgent = puppeteerEmulateOpts.userAgent;
            screenshotEmulate.viewport = puppeteerEmulateOpts.viewport;
        }
        catch (e) {
            console.error('error loading puppeteer DeviceDescriptors', e);
            return;
        }
    }
    if (userEmulateConfig.viewport) {
        if (typeof userEmulateConfig.viewport.width === 'number') {
            screenshotEmulate.viewport.width = userEmulateConfig.viewport.width;
        }
        if (typeof userEmulateConfig.viewport.height === 'number') {
            screenshotEmulate.viewport.height = userEmulateConfig.viewport.height;
        }
        if (typeof userEmulateConfig.viewport.deviceScaleFactor === 'number') {
            screenshotEmulate.viewport.deviceScaleFactor = userEmulateConfig.viewport.deviceScaleFactor;
        }
        if (typeof userEmulateConfig.viewport.hasTouch === 'boolean') {
            screenshotEmulate.viewport.hasTouch = userEmulateConfig.viewport.hasTouch;
        }
        if (typeof userEmulateConfig.viewport.isLandscape === 'boolean') {
            screenshotEmulate.viewport.isLandscape = userEmulateConfig.viewport.isLandscape;
        }
        if (typeof userEmulateConfig.viewport.isMobile === 'boolean') {
            screenshotEmulate.viewport.isMobile = userEmulateConfig.viewport.isMobile;
        }
        if (typeof userEmulateConfig.userAgent === 'string') {
            screenshotEmulate.userAgent = userEmulateConfig.userAgent;
        }
    }
    env.__STENCIL_EMULATE__ = JSON.stringify(screenshotEmulate);
}

async function runJest(config, env) {
    let success = false;
    try {
        // set all of the emulate configs to the process.env to be read later on
        const emulateConfigs = getEmulateConfigs(config.testing, config.flags);
        env.__STENCIL_EMULATE_CONFIGS__ = JSON.stringify(emulateConfigs);
        if (config.flags.ci || config.flags.e2e) {
            env.__STENCIL_DEFAULT_TIMEOUT__ = '30000';
        }
        else {
            env.__STENCIL_DEFAULT_TIMEOUT__ = '15000';
        }
        if (config.flags.devtools) {
            env.__STENCIL_DEFAULT_TIMEOUT__ = '300000000';
        }
        config.logger.debug(`default timeout: ${env.__STENCIL_DEFAULT_TIMEOUT__}`);
        // build up our args from our already know list of args in the config
        const jestArgv = buildJestArgv(config);
        // build up the project paths, which is basically the app's root dir
        const projects = getProjectListFromCLIArgs(config, jestArgv);
        // run the jest-cli with our data rather than letting the
        // jest-cli parse the args itself
        const { runCLI } = require('jest-cli');
        const cliResults = await runCLI(jestArgv, projects);
        success = !!cliResults.results.success;
    }
    catch (e) {
        config.logger.error(`runJest: ${e}`);
    }
    return success;
}
function createTestRunner() {
    const TestRunner = require('jest-runner');
    class StencilTestRunner extends TestRunner {
        async runTests(tests, watcher, onStart, onResult, onFailure, options) {
            const env = process.env;
            // filter out only the tests the flags said we should run
            tests = tests.filter(t => includeTestFile(t.path, env));
            if (env.__STENCIL_SCREENSHOT__ === 'true') {
                // we're doing e2e screenshots, so let's loop through
                // each of the emulate configs for each test
                // get the emulate configs from the process env
                // and parse the emulate config data
                const emulateConfigs = JSON.parse(env.__STENCIL_EMULATE_CONFIGS__);
                // loop through each emulate config to re-run the tests per config
                for (let i = 0; i < emulateConfigs.length; i++) {
                    const emulateConfig = emulateConfigs[i];
                    // reset the environment for each emulate config
                    setScreenshotEmulateData(emulateConfig, env);
                    // run the test for each emulate config
                    await super.runTests(tests, watcher, onStart, onResult, onFailure, options);
                }
            }
            else {
                // not doing e2e screenshot tests
                // so just run each test once
                await super.runTests(tests, watcher, onStart, onResult, onFailure, options);
            }
        }
    }
    return StencilTestRunner;
}
function includeTestFile(testPath, env) {
    testPath = testPath.toLowerCase().replace(/\\/g, '/');
    const hasE2E = testPath.includes('.e2e.') || testPath.includes('/e2e.');
    if (env.__STENCIL_E2E_TESTS__ === 'true' && hasE2E) {
        // keep this test if it's an e2e file and we should be testing e2e
        return true;
    }
    if (env.__STENCIL_SPEC_TESTS__ === 'true' && !hasE2E) {
        // keep this test if it's a spec file and we should be testing unit tests
        return true;
    }
    return false;
}
function getEmulateConfigs(testing, flags) {
    let emulateConfigs = testing.emulate.slice();
    if (typeof flags.emulate === 'string') {
        const emulateFlag = flags.emulate.toLowerCase();
        emulateConfigs = emulateConfigs.filter(emulateConfig => {
            if (typeof emulateConfig.device === 'string' && emulateConfig.device.toLowerCase() === emulateFlag) {
                return true;
            }
            if (typeof emulateConfig.userAgent === 'string' && emulateConfig.userAgent.toLowerCase().includes(emulateFlag)) {
                return true;
            }
            return false;
        });
    }
    return emulateConfigs;
}

async function runJestScreenshot(config, env) {
    config.logger.debug(`screenshot connector: ${config.testing.screenshotConnector}`);
    const ScreenshotConnector = require(config.testing.screenshotConnector);
    const connector = new ScreenshotConnector();
    // for CI, let's wait a little longer than locally before taking the screenshot
    const pixelmatchModulePath = path$1.join(config.sys.getCompilerExecutingPath(), '..', '..', 'screenshot', 'pixel-match.js');
    config.logger.debug(`pixelmatch module: ${pixelmatchModulePath}`);
    const initTimespan = config.logger.createTimeSpan(`screenshot, initBuild started`, true);
    await connector.initBuild({
        buildId: createBuildId(),
        buildMessage: createBuildMessage(),
        buildTimestamp: Date.now(),
        appNamespace: config.namespace,
        rootDir: config.rootDir,
        cacheDir: config.cacheDir,
        packageDir: path$1.join(config.sys.getCompilerExecutingPath(), '..', '..'),
        updateMaster: config.flags.updateScreenshot,
        logger: config.logger,
        allowableMismatchedPixels: config.testing.allowableMismatchedPixels,
        allowableMismatchedRatio: config.testing.allowableMismatchedRatio,
        pixelmatchThreshold: config.testing.pixelmatchThreshold,
        waitBeforeScreenshot: config.testing.waitBeforeScreenshot,
        pixelmatchModulePath: pixelmatchModulePath,
    });
    if (!config.flags.updateScreenshot) {
        await connector.pullMasterBuild();
    }
    initTimespan.finish(`screenshot, initBuild finished`);
    const dataPromises = await Promise.all([await connector.getMasterBuild(), await connector.getScreenshotCache()]);
    const masterBuild = dataPromises[0];
    const screenshotCache = dataPromises[1];
    env.__STENCIL_SCREENSHOT_BUILD__ = connector.toJson(masterBuild, screenshotCache);
    const testsTimespan = config.logger.createTimeSpan(`screenshot, tests started`, true);
    const passed = await runJest(config, env);
    testsTimespan.finish(`screenshot, tests finished, passed: ${passed}`);
    try {
        const completeTimespan = config.logger.createTimeSpan(`screenshot, completeTimespan started`, true);
        let results = await connector.completeBuild(masterBuild);
        completeTimespan.finish(`screenshot, completeTimespan finished`);
        if (results) {
            const publishTimespan = config.logger.createTimeSpan(`screenshot, publishBuild started`, true);
            results = await connector.publishBuild(results);
            publishTimespan.finish(`screenshot, publishBuild finished`);
            if (config.flags.updateScreenshot) {
                // updating the master screenshot
                if (results.currentBuild && typeof results.currentBuild.previewUrl === 'string') {
                    config.logger.info(config.logger.magenta(results.currentBuild.previewUrl));
                }
            }
            else {
                // comparing the screenshot to master
                if (results.compare) {
                    try {
                        await connector.updateScreenshotCache(screenshotCache, results);
                    }
                    catch (e) {
                        config.logger.error(e);
                    }
                    config.logger.info(`screenshots compared: ${results.compare.diffs.length}`);
                    if (typeof results.compare.url === 'string') {
                        config.logger.info(config.logger.magenta(results.compare.url));
                    }
                }
            }
        }
    }
    catch (e) {
        config.logger.error(e, e.stack);
    }
    return passed;
}
function createBuildId() {
    const d = new Date();
    let fmDt = d.getFullYear() + '';
    fmDt += ('0' + (d.getMonth() + 1)).slice(-2);
    fmDt += ('0' + d.getDate()).slice(-2);
    fmDt += ('0' + d.getHours()).slice(-2);
    fmDt += ('0' + d.getMinutes()).slice(-2);
    fmDt += ('0' + d.getSeconds()).slice(-2);
    return fmDt;
}
function createBuildMessage() {
    const d = new Date();
    let fmDt = d.getFullYear() + '' + '-';
    fmDt += ('0' + (d.getMonth() + 1)).slice(-2) + '-';
    fmDt += ('0' + d.getDate()).slice(-2) + ' ';
    fmDt += ('0' + d.getHours()).slice(-2) + ':';
    fmDt += ('0' + d.getMinutes()).slice(-2) + ':';
    fmDt += ('0' + d.getSeconds()).slice(-2);
    return `Build: ${fmDt}`;
}

const createTesting = async (config) => {
    config = setupTestingConfig(config);
    const { createCompiler } = require('../compiler/stencil.js');
    const compiler = await createCompiler(config);
    let devServer;
    let puppeteerBrowser;
    const run = async (opts = {}) => {
        if (!opts.spec && !opts.e2e) {
            config.logger.error(`Testing requires either the --spec or --e2e command line flags, or both. For example, to run unit tests, use the command: stencil test --spec`);
            return false;
        }
        const env = process.env;
        const msg = [];
        if (opts.e2e) {
            msg.push('e2e');
            env.__STENCIL_E2E_TESTS__ = 'true';
        }
        if (opts.spec) {
            msg.push('spec');
            env.__STENCIL_SPEC_TESTS__ = 'true';
        }
        config.logger.info(config.logger.magenta(`testing ${msg.join(' and ')} files`));
        const doScreenshots = !!(opts.e2e && opts.screenshot);
        if (doScreenshots) {
            env.__STENCIL_SCREENSHOT__ = 'true';
            if (opts.updateScreenshot) {
                config.logger.info(config.logger.magenta(`updating master screenshots`));
            }
            else {
                config.logger.info(config.logger.magenta(`comparing against master screenshots`));
            }
        }
        if (opts.e2e) {
            // e2e tests only
            // do a build, start a dev server
            // and spin up a puppeteer browser
            let buildTask = null;
            config.outputTargets.forEach(outputTarget => {
                outputTarget.empty = false;
            });
            const doBuild = !(config.flags && config.flags.build === false);
            if (doBuild) {
                buildTask = compiler.build();
            }
            config.devServer.openBrowser = false;
            config.devServer.gzip = false;
            config.devServer.reloadStrategy = null;
            const startupResults = await Promise.all([index_js.startServer(config.devServer, config.logger), startPuppeteerBrowser(config)]);
            devServer = startupResults[0];
            puppeteerBrowser = startupResults[1];
            if (doBuild) {
                const results = await buildTask;
                if (!results || (!config.watch && hasError(results && results.diagnostics))) {
                    await destroy();
                    return false;
                }
            }
            if (devServer) {
                env.__STENCIL_BROWSER_URL__ = devServer.browserUrl;
                config.logger.debug(`e2e dev server url: ${env.__STENCIL_BROWSER_URL__}`);
                env.__STENCIL_APP_SCRIPT_URL__ = getAppScriptUrl(config, devServer.browserUrl);
                config.logger.debug(`e2e app script url: ${env.__STENCIL_APP_SCRIPT_URL__}`);
                const styleUrl = getAppStyleUrl(config, devServer.browserUrl);
                if (styleUrl) {
                    env.__STENCIL_APP_STYLE_URL__ = getAppStyleUrl(config, devServer.browserUrl);
                    config.logger.debug(`e2e app style url: ${env.__STENCIL_APP_STYLE_URL__}`);
                }
            }
        }
        let passed = false;
        try {
            if (doScreenshots) {
                passed = await runJestScreenshot(config, env);
            }
            else {
                passed = await runJest(config, env);
            }
            config.logger.info('');
        }
        catch (e) {
            config.logger.error(e);
        }
        return passed;
    };
    const destroy = async () => {
        const closingTime = []; // you don't have to go home but you can't stay here
        if (config) {
            if (config.sys && config.sys.destroy) {
                closingTime.push(config.sys.destroy());
            }
            config = null;
        }
        if (devServer) {
            if (devServer.close) {
                closingTime.push(devServer.close());
            }
            devServer = null;
        }
        if (puppeteerBrowser) {
            if (puppeteerBrowser.close) {
                closingTime.push(puppeteerBrowser.close());
            }
            puppeteerBrowser = null;
        }
        await Promise.all(closingTime);
    };
    return {
        destroy,
        run,
    };
};
function setupTestingConfig(config) {
    config.buildEs5 = false;
    config.devMode = true;
    config.minifyCss = false;
    config.minifyJs = false;
    config.hashFileNames = false;
    config.validateTypes = false;
    config._isTesting = true;
    config.buildDist = true;
    config.flags = config.flags || {};
    config.flags.serve = false;
    config.flags.open = false;
    config.outputTargets.forEach(o => {
        if (o.type === 'www') {
            o.serviceWorker = null;
        }
    });
    return config;
}

function transpile(input, opts = {}) {
    opts = Object.assign(Object.assign({}, opts), { componentExport: null, componentMetadata: 'compilerstatic', coreImportPath: isString$2(opts.coreImportPath) ? opts.coreImportPath : '@stencil/core/internal/testing', currentDirectory: opts.currentDirectory || process.cwd(), module: 'cjs', proxy: null, sourceMap: 'inline', style: null, target: 'es2015' });
    try {
        const v = process.version.replace('v', '').split('.');
        if (parseInt(v[0], 10) >= 10) {
            // let's go with ES2017 for node 10 and above
            opts.target = 'es2017';
        }
    }
    catch (e) { }
    return stencil_js.compileSync(input, opts);
}

const jestPreprocessor = {
    process(sourceText, filePath, jestConfig) {
        if (shouldTransform(filePath, sourceText)) {
            const opts = {
                file: filePath,
                currentDirectory: jestConfig.rootDir,
            };
            const tsCompilerOptions = this.getCompilerOptions(jestConfig.rootDir);
            if (tsCompilerOptions) {
                if (tsCompilerOptions.baseUrl) {
                    opts.baseUrl = tsCompilerOptions.baseUrl;
                }
                if (tsCompilerOptions.paths) {
                    opts.paths = tsCompilerOptions.paths;
                }
            }
            const results = transpile(sourceText, opts);
            const hasErrors = results.diagnostics.some(diagnostic => diagnostic.level === 'error');
            if (results.diagnostics && hasErrors) {
                const msg = results.diagnostics.map(formatDiagnostic).join('\n\n');
                throw new Error(msg);
            }
            return results.code;
        }
        return sourceText;
    },
    getCompilerOptions(rootDir) {
        if (!this._tsCompilerOptions) {
            this._tsCompilerOptions = getCompilerOptions(rootDir);
        }
        return this._tsCompilerOptions;
    },
    getCacheKey(code, filePath, jestConfigStr, transformOptions) {
        // https://github.com/facebook/jest/blob/v23.6.0/packages/jest-runtime/src/script_transformer.js#L61-L90
        if (!this._tsCompilerOptionsKey) {
            const opts = this.getCompilerOptions(transformOptions.rootDir);
            this._tsCompilerOptionsKey = JSON.stringify(opts);
        }
        const key = [
            process.version,
            this._tsCompilerOptionsKey,
            code,
            filePath,
            jestConfigStr,
            !!transformOptions.instrument,
            4,
        ];
        return key.join(':');
    },
};
function formatDiagnostic(diagnostic) {
    let m = '';
    if (diagnostic.relFilePath) {
        m += diagnostic.relFilePath;
        if (typeof diagnostic.lineNumber === 'number') {
            m += ':' + diagnostic.lineNumber + 1;
            if (typeof diagnostic.columnNumber === 'number') {
                m += ':' + diagnostic.columnNumber;
            }
        }
        m += '\n';
    }
    m += diagnostic.messageText;
    return m;
}
function getCompilerOptions(rootDir) {
    if (typeof rootDir !== 'string') {
        return null;
    }
    rootDir = normalizePath(rootDir);
    const tsconfigFilePath = ts.findConfigFile(rootDir, ts.sys.fileExists);
    if (!tsconfigFilePath) {
        return null;
    }
    const tsconfigResults = ts.readConfigFile(tsconfigFilePath, ts.sys.readFile);
    if (tsconfigResults.error) {
        throw new Error(formatDiagnostic(loadTypeScriptDiagnostic(tsconfigResults.error)));
    }
    const parseResult = ts.parseJsonConfigFileContent(tsconfigResults.config, ts.sys, rootDir, undefined, tsconfigFilePath);
    return parseResult.options;
}
function shouldTransform(filePath, sourceText) {
    const ext = filePath
        .split('.')
        .pop()
        .toLowerCase()
        .split('?')[0];
    if (ext === 'ts' || ext === 'tsx' || ext === 'jsx') {
        // typescript extensions (to include .d.ts)
        return true;
    }
    if (ext === 'mjs') {
        // es module extensions
        return true;
    }
    if (ext === 'js') {
        // there may be false positives here
        // but worst case scenario a commonjs file is transpiled to commonjs
        if (sourceText.includes('import ') || sourceText.includes('import.') || sourceText.includes('import(')) {
            return true;
        }
        if (sourceText.includes('export ')) {
            return true;
        }
    }
    if (ext === 'css') {
        // convert a standard css file into an nodejs ready file
        return true;
    }
    return false;
}

function toEqualAttribute(elm, expectAttrName, expectAttrValue) {
    if (!elm) {
        throw new Error(`expect toMatchAttribute value is null`);
    }
    if (typeof elm.then === 'function') {
        throw new Error(`element must be a resolved value, not a promise, before it can be tested`);
    }
    if (elm.nodeType !== 1 /* ELEMENT_NODE */) {
        throw new Error(`expect toMatchAttribute value is not an element`);
    }
    let receivedAttrValue = elm.getAttribute(expectAttrName);
    if (expectAttrValue != null) {
        expectAttrValue = String(expectAttrValue);
    }
    if (receivedAttrValue != null) {
        receivedAttrValue = String(receivedAttrValue);
    }
    const pass = expectAttrValue === receivedAttrValue;
    return {
        message: () => `expected attribute ${expectAttrName} "${expectAttrValue}" to ${pass ? 'not ' : ''}equal "${receivedAttrValue}"`,
        pass: pass,
    };
}
function toEqualAttributes(elm, expectAttrs) {
    if (!elm) {
        throw new Error(`expect toEqualAttributes value is null`);
    }
    if (typeof elm.then === 'function') {
        throw new Error(`element must be a resolved value, not a promise, before it can be tested`);
    }
    if (elm.nodeType !== 1 /* ELEMENT_NODE */) {
        throw new Error(`expect toEqualAttributes value is not an element`);
    }
    const attrNames = Object.keys(expectAttrs);
    const pass = attrNames.every(attrName => {
        let expectAttrValue = expectAttrs[attrName];
        if (expectAttrValue != null) {
            expectAttrValue = String(expectAttrValue);
        }
        return elm.getAttribute(attrName) === expectAttrValue;
    });
    return {
        message: () => `expected attributes to ${pass ? 'not ' : ''}equal ${attrNames.map(a => `[${a}="${expectAttrs[a]}"]`).join(', ')}`,
        pass: pass,
    };
}
function toHaveAttribute(elm, expectAttrName) {
    if (!elm) {
        throw new Error(`expect toHaveAttribute value is null`);
    }
    if (typeof elm.then === 'function') {
        throw new Error(`element must be a resolved value, not a promise, before it can be tested`);
    }
    if (elm.nodeType !== 1 /* ELEMENT_NODE */) {
        throw new Error(`expect toHaveAttribute value is not an element`);
    }
    const pass = elm.hasAttribute(expectAttrName);
    return {
        message: () => `expected to ${pass ? 'not ' : ''}have the attribute "${expectAttrName}"`,
        pass: pass,
    };
}

function toHaveReceivedEvent(eventSpy) {
    if (!eventSpy) {
        throw new Error(`toHaveReceivedEvent event spy is null`);
    }
    if (typeof eventSpy.then === 'function') {
        throw new Error(`event spy must be a resolved value, not a promise, before it can be tested`);
    }
    if (!eventSpy.eventName) {
        throw new Error(`toHaveReceivedEvent did not receive an event spy`);
    }
    const pass = eventSpy.events.length > 0;
    return {
        message: () => `expected to have ${pass ? 'not ' : ''}called "${eventSpy.eventName}" event`,
        pass: pass,
    };
}
function toHaveReceivedEventTimes(eventSpy, count) {
    if (!eventSpy) {
        throw new Error(`toHaveReceivedEventTimes event spy is null`);
    }
    if (typeof eventSpy.then === 'function') {
        throw new Error(`event spy must be a resolved value, not a promise, before it can be tested`);
    }
    if (!eventSpy.eventName) {
        throw new Error(`toHaveReceivedEventTimes did not receive an event spy`);
    }
    const pass = eventSpy.length === count;
    return {
        message: () => `expected event "${eventSpy.eventName}" to have been called ${count} times, but was called ${eventSpy.events.length} time${eventSpy.events.length > 1 ? 's' : ''}`,
        pass: pass,
    };
}
function toHaveReceivedEventDetail(eventSpy, eventDetail) {
    if (!eventSpy) {
        throw new Error(`toHaveReceivedEventDetail event spy is null`);
    }
    if (typeof eventSpy.then === 'function') {
        throw new Error(`event spy must be a resolved value, not a promise, before it can be tested`);
    }
    if (!eventSpy.eventName) {
        throw new Error(`toHaveReceivedEventDetail did not receive an event spy`);
    }
    if (!eventSpy.lastEvent) {
        throw new Error(`event "${eventSpy.eventName}" was not received`);
    }
    const pass = deepEqual(eventSpy.lastEvent.detail, eventDetail);
    expect(eventSpy.lastEvent.detail).toEqual(eventDetail);
    return {
        message: () => `expected event "${eventSpy.eventName}" detail to ${pass ? 'not ' : ''}equal`,
        pass: pass,
    };
}
function toHaveFirstReceivedEventDetail(eventSpy, eventDetail) {
    if (!eventSpy) {
        throw new Error(`toHaveFirstReceivedEventDetail event spy is null`);
    }
    if (typeof eventSpy.then === 'function') {
        throw new Error(`event spy must be a resolved value, not a promise, before it can be tested`);
    }
    if (!eventSpy.eventName) {
        throw new Error(`toHaveFirstReceivedEventDetail did not receive an event spy`);
    }
    if (!eventSpy.firstEvent) {
        throw new Error(`event "${eventSpy.eventName}" was not received`);
    }
    const pass = deepEqual(eventSpy.firstEvent.detail, eventDetail);
    expect(eventSpy.lastEvent.detail).toEqual(eventDetail);
    return {
        message: () => `expected event "${eventSpy.eventName}" detail to ${pass ? 'not ' : ''}equal`,
        pass: pass,
    };
}
function toHaveNthReceivedEventDetail(eventSpy, index, eventDetail) {
    if (!eventSpy) {
        throw new Error(`toHaveNthReceivedEventDetail event spy is null`);
    }
    if (typeof eventSpy.then === 'function') {
        throw new Error(`event spy must be a resolved value, not a promise, before it can be tested`);
    }
    if (!eventSpy.eventName) {
        throw new Error(`toHaveNthReceivedEventDetail did not receive an event spy`);
    }
    if (!eventSpy.firstEvent) {
        throw new Error(`event "${eventSpy.eventName}" was not received`);
    }
    const event = eventSpy.events[index];
    if (!event) {
        throw new Error(`event at index ${index} was not received`);
    }
    const pass = deepEqual(event.detail, eventDetail);
    expect(event.detail).toEqual(eventDetail);
    return {
        message: () => `expected event "${eventSpy.eventName}" detail to ${pass ? 'not ' : ''}equal`,
        pass: pass,
    };
}
// from https://www.npmjs.com/package/fast-deep-equal
// License in NOTICE.md
const deepEqual = function equal(a, b) {
    if (a === b)
        return true;
    if (a && b && typeof a == 'object' && typeof b == 'object') {
        var arrA = Array.isArray(a), arrB = Array.isArray(b), i, length, key;
        if (arrA && arrB) {
            length = a.length;
            if (length != b.length)
                return false;
            for (i = length; i-- !== 0;)
                if (!equal(a[i], b[i]))
                    return false;
            return true;
        }
        if (arrA != arrB)
            return false;
        var dateA = a instanceof Date, dateB = b instanceof Date;
        if (dateA != dateB)
            return false;
        if (dateA && dateB)
            return a.getTime() == b.getTime();
        var regexpA = a instanceof RegExp, regexpB = b instanceof RegExp;
        if (regexpA != regexpB)
            return false;
        if (regexpA && regexpB)
            return a.toString() == b.toString();
        var keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length)
            return false;
        for (i = length; i-- !== 0;)
            if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
                return false;
        for (i = length; i-- !== 0;) {
            key = keys[i];
            if (!equal(a[key], b[key]))
                return false;
        }
        return true;
    }
    return a !== a && b !== b;
};

function toEqualHtml(input, shouldEqual) {
    return compareHtml(input, shouldEqual, true);
}
function toEqualLightHtml(input, shouldEqual) {
    return compareHtml(input, shouldEqual, false);
}
function compareHtml(input, shouldEqual, serializeShadowRoot) {
    if (input == null) {
        throw new Error(`expect toEqualHtml() value is "${input}"`);
    }
    if (typeof input.then === 'function') {
        throw new Error(`element must be a resolved value, not a promise, before it can be tested`);
    }
    let serializeA;
    if (input.nodeType === 1 /* ELEMENT_NODE */) {
        const options = getSpecOptions(input);
        serializeA = index_js$1.serializeNodeToHtml(input, {
            prettyHtml: true,
            outerHtml: true,
            removeHtmlComments: options.includeAnnotations === false,
            excludeTags: ['body'],
            serializeShadowRoot,
        });
    }
    else if (input.nodeType === 11 /* DOCUMENT_FRAGMENT_NODE */) {
        serializeA = index_js$1.serializeNodeToHtml(input, {
            prettyHtml: true,
            excludeTags: ['style'],
            excludeTagContent: ['style'],
            serializeShadowRoot,
        });
    }
    else if (typeof input === 'string') {
        const parseA = index_js$1.parseHtmlToFragment(input);
        serializeA = index_js$1.serializeNodeToHtml(parseA, {
            prettyHtml: true,
            serializeShadowRoot,
        });
    }
    else {
        throw new Error(`expect toEqualHtml() value should be an element, shadow root or string.`);
    }
    const parseB = index_js$1.parseHtmlToFragment(shouldEqual);
    const serializeB = index_js$1.serializeNodeToHtml(parseB, {
        prettyHtml: true,
        excludeTags: ['body'],
    });
    if (serializeA !== serializeB) {
        expect(serializeA).toBe(serializeB);
        return {
            message: () => 'HTML does not match',
            pass: false,
        };
    }
    return {
        message: () => 'expect HTML to match',
        pass: true,
    };
}
function getSpecOptions(el) {
    if (el && el.ownerDocument && el.ownerDocument.defaultView) {
        return el.ownerDocument.defaultView['__stencil_spec_options'] || {};
    }
    return {};
}

function toEqualText(input, expectTextContent) {
    if (input == null) {
        throw new Error(`expect toEqualText() value is "${input}"`);
    }
    if (typeof input.then === 'function') {
        throw new Error(`element must be a resolved value, not a promise, before it can be tested`);
    }
    let textContent;
    if (input.nodeType === 1 /* ELEMENT_NODE */) {
        textContent = input.textContent.replace(/\s\s+/g, ' ').trim();
    }
    else if (input != null) {
        textContent = String(input)
            .replace(/\s\s+/g, ' ')
            .trim();
    }
    if (typeof expectTextContent === 'string') {
        expectTextContent = expectTextContent.replace(/\s\s+/g, ' ').trim();
    }
    const pass = textContent === expectTextContent;
    return {
        message: () => `expected textContent "${expectTextContent}" to ${pass ? 'not ' : ''}equal "${textContent}"`,
        pass: pass,
    };
}

function toHaveClass(elm, expectClassName) {
    if (!elm) {
        throw new Error(`expect toHaveClass value is null`);
    }
    if (typeof elm.then === 'function') {
        throw new Error(`element must be a resolved value, not a promise, before it can be tested`);
    }
    if (elm.nodeType !== 1) {
        throw new Error(`expect toHaveClass value is not an element`);
    }
    const pass = elm.classList.contains(expectClassName);
    return {
        message: () => `expected to ${pass ? 'not ' : ''}have css class "${expectClassName}"`,
        pass: pass,
    };
}
function toHaveClasses(elm, expectClassNames) {
    if (!elm) {
        throw new Error(`expect toHaveClasses value is null`);
    }
    if (typeof elm.then === 'function') {
        throw new Error(`element must be a resolved value, not a promise, before it can be tested`);
    }
    if (elm.nodeType !== 1) {
        throw new Error(`expect toHaveClasses value is not an element`);
    }
    const pass = expectClassNames.every(expectClassName => {
        return elm.classList.contains(expectClassName);
    });
    return {
        message: () => `expected to ${pass ? 'not ' : ''}have css classes "${expectClassNames.join(' ')}", but className is "${elm.className}"`,
        pass: pass,
    };
}
function toMatchClasses(elm, expectClassNames) {
    let { pass } = toHaveClasses(elm, expectClassNames);
    if (pass) {
        pass = expectClassNames.length === elm.classList.length;
    }
    return {
        message: () => `expected to ${pass ? 'not ' : ''}match css classes "${expectClassNames.join(' ')}", but className is "${elm.className}"`,
        pass: pass,
    };
}

function toMatchScreenshot(compare, opts = {}) {
    if (!compare) {
        throw new Error(`expect toMatchScreenshot value is null`);
    }
    if (typeof compare.then === 'function') {
        throw new Error(`expect(compare).toMatchScreenshot() must be a resolved value, not a promise, before it can be tested`);
    }
    if (typeof compare.mismatchedPixels !== 'number') {
        throw new Error(`expect toMatchScreenshot() value is not a screenshot compare`);
    }
    const device = compare.device || compare.userAgent;
    if (typeof opts.allowableMismatchedRatio === 'number') {
        if (opts.allowableMismatchedRatio < 0 || opts.allowableMismatchedRatio > 1) {
            throw new Error(`expect toMatchScreenshot() allowableMismatchedRatio must be a value ranging from 0 to 1`);
        }
        const mismatchedRatio = compare.mismatchedPixels / (compare.width * compare.deviceScaleFactor * (compare.height * compare.deviceScaleFactor));
        return {
            message: () => `${device}: screenshot has a mismatch ratio of "${mismatchedRatio}" for "${compare.desc}", but expected ratio to be less than "${opts.allowableMismatchedRatio}"`,
            pass: mismatchedRatio <= opts.allowableMismatchedRatio,
        };
    }
    if (typeof opts.allowableMismatchedPixels === 'number') {
        if (opts.allowableMismatchedPixels < 0) {
            throw new Error(`expect toMatchScreenshot() allowableMismatchedPixels value must be a value that is 0 or greater`);
        }
        return {
            message: () => `${device}: screenshot has "${compare.mismatchedPixels}" mismatched pixels for "${compare.desc}", but expected less than "${opts.allowableMismatchedPixels}" mismatched pixels`,
            pass: compare.mismatchedPixels <= opts.allowableMismatchedPixels,
        };
    }
    if (typeof compare.allowableMismatchedRatio === 'number') {
        const mismatchedRatio = compare.mismatchedPixels / (compare.width * compare.deviceScaleFactor * (compare.height * compare.deviceScaleFactor));
        return {
            message: () => `${device}: screenshot has a mismatch ratio of "${mismatchedRatio}" for "${compare.desc}", but expected ratio to be less than "${compare.allowableMismatchedRatio}"`,
            pass: mismatchedRatio <= compare.allowableMismatchedRatio,
        };
    }
    if (typeof compare.allowableMismatchedPixels === 'number') {
        return {
            message: () => `${device}: screenshot has "${compare.mismatchedPixels}" mismatched pixels for "${compare.desc}", but expected less than "${compare.allowableMismatchedPixels}" mismatched pixels`,
            pass: compare.mismatchedPixels <= compare.allowableMismatchedPixels,
        };
    }
    throw new Error(`expect toMatchScreenshot() missing allowableMismatchedPixels in testing config`);
}

const expectExtend = {
    toEqualAttribute,
    toEqualAttributes,
    toEqualHtml,
    toEqualLightHtml,
    toEqualText,
    toHaveAttribute,
    toHaveClass,
    toHaveClasses,
    toMatchClasses,
    toHaveReceivedEvent,
    toHaveReceivedEventDetail,
    toHaveReceivedEventTimes,
    toHaveFirstReceivedEventDetail,
    toHaveNthReceivedEventDetail,
    toMatchScreenshot,
};

const mockedResponses = new Map();
function setupMockFetch(global) {
    const win = global.window;
    if (!('fetch' in win)) {
        win.fetch = function (input) {
            return globalMockFetch(input);
        };
    }
    if (!('fetch' in global)) {
        global.fetch = function (input) {
            return globalMockFetch(input);
        };
    }
}
async function globalMockFetch(requestInput) {
    let requestUrl;
    if (requestInput == null) {
        throw new Error(`missing url input for mock fetch()`);
    }
    else if (typeof requestInput === 'string') {
        requestUrl = requestInput;
    }
    else if (typeof requestInput.url === 'string') {
        requestUrl = requestInput.url;
    }
    else {
        throw new Error(`invalid url for mock fetch()`);
    }
    requestUrl = new url$1.URL(requestUrl, location.href).href;
    let mockedData = mockedResponses.get(requestUrl);
    if (mockedData == null) {
        const defaultUrl = new url$1.URL(FETCH_DEFAULT_PATH, location.href);
        mockedData = mockedResponses.get(defaultUrl.href);
    }
    if (mockedData == null) {
        return new MockResponse404();
    }
    const mockedResponse = mockedData.response.clone();
    if (typeof mockedResponse.status !== 'number') {
        mockedResponse.status = 200;
    }
    if (typeof mockedResponse.statusText !== 'string') {
        if (mockedResponse.status >= 500) {
            mockedResponse.statusText = 'Internal Server Error';
        }
        else if (mockedResponse.status === 404) {
            mockedResponse.statusText = 'Not Found';
        }
        else if (mockedResponse.status >= 400) {
            mockedResponse.statusText = 'Bad Request';
        }
        else if (mockedResponse.status === 302) {
            mockedResponse.statusText = 'Found';
        }
        else if (mockedResponse.status === 301) {
            mockedResponse.statusText = 'Moved Permanently';
        }
        else if (mockedResponse.status >= 300) {
            mockedResponse.statusText = 'Redirection';
        }
        else {
            mockedResponse.statusText = 'OK';
        }
    }
    mockedResponse.ok = mockedResponse.status >= 200 && mockedResponse.status <= 299;
    if (typeof mockedResponse.type !== 'string') {
        mockedResponse.type = 'basic';
    }
    return mockedResponse;
}
function setMockedResponse(response, input, reject) {
    if (!response) {
        throw new Error('MockResponse required');
    }
    if (typeof response.url !== 'string' || response.url === '') {
        if (typeof input === 'string') {
            response.url = input;
        }
        else if (input && typeof input.url === 'string') {
            response.url = input.url;
        }
        else {
            response.url = FETCH_DEFAULT_PATH;
        }
    }
    const u = new url$1.URL(response.url, location.href);
    response.url = u.href;
    const mockedResponseData = {
        response,
        reject,
    };
    mockedResponses.set(response.url, mockedResponseData);
}
function mockFetchReset() {
    mockedResponses.clear();
}
const mockFetch = {
    json(data, url) {
        const rsp = new index_js$1.MockResponse(JSON.stringify(data, null, 2), {
            headers: new index_js$1.MockHeaders({
                'Content-Type': 'application/json',
            }),
        });
        setMockedResponse(rsp, url, false);
    },
    text(data, url) {
        const rsp = new index_js$1.MockResponse(data, {
            headers: new index_js$1.MockHeaders({
                'Content-Type': 'text/plain',
            }),
        });
        setMockedResponse(rsp, url, false);
    },
    response(rsp, url) {
        setMockedResponse(rsp, url, false);
    },
    reject(rsp, url) {
        setMockedResponse(rsp, url, true);
    },
    reset: mockFetchReset,
};
class MockResponse404 extends index_js$1.MockResponse {
    constructor() {
        super('', {
            headers: new index_js$1.MockHeaders({
                'Content-Type': 'text/plain',
            }),
        });
        this.status = 404;
        this.statusText = 'Not Found';
    }
    async json() {
        return { status: 404, statusText: 'Not Found' };
    }
    async text() {
        return 'Not Found';
    }
}
const FETCH_DEFAULT_PATH = '/mock-fetch-data';

const print = (val) => {
    return index_js$1.serializeNodeToHtml(val, {
        serializeShadowRoot: true,
        prettyHtml: true,
        outerHtml: true,
    });
};
const test = (val) => {
    return val !== undefined && val !== null && (val instanceof HTMLElement || val instanceof index_js$1.MockNode);
};
const HtmlSerializer = {
    print,
    test,
};

function resetBuildConditionals(b) {
    Object.keys(b).forEach(key => {
        b[key] = true;
    });
    b.isDev = true;
    b.isTesting = true;
    b.isDebug = false;
    b.lazyLoad = true;
    b.member = true;
    b.reflect = true;
    b.scoped = true;
    b.shadowDom = true;
    b.slotRelocation = true;
    b.asyncLoading = true;
    b.svg = true;
    b.updatable = true;
    b.vdomAttribute = true;
    b.vdomClass = true;
    b.vdomFunctional = true;
    b.vdomKey = true;
    b.vdomPropOrAttr = true;
    b.vdomRef = true;
    b.vdomListener = true;
    b.vdomStyle = true;
    b.vdomText = true;
    b.vdomXlink = true;
    b.allRenderFn = false;
    b.devTools = false;
    b.hydrateClientSide = false;
    b.hydrateServerSide = false;
    b.cssAnnotations = false;
    b.style = false;
    b.hydratedAttribute = false;
    b.hydratedClass = true;
    b.appendChildSlotFix = false;
    b.cloneNodeFix = false;
    b.dynamicImportShim = false;
    b.hotModuleReplacement = false;
    b.safari10 = false;
    b.scriptDataOpts = false;
    b.slotChildNodesFix = false;
}

function jestSetupTestFramework() {
    global.Context = {};
    global.resourcesUrl = '/build';
    expect.extend(expectExtend);
    expect.addSnapshotSerializer(HtmlSerializer);
    index_js$1.setupGlobal(global);
    setupMockFetch(global);
    beforeEach(() => {
        // reset the platform for this new test
        testing.resetPlatform();
        resetBuildConditionals(appData.BUILD);
        testing.modeResolutionChain.length = 0;
    });
    afterEach(async () => {
        if (global.__CLOSE_OPEN_PAGES__) {
            await global.__CLOSE_OPEN_PAGES__();
        }
        testing.stopAutoApplyChanges();
        index_js$1.teardownGlobal(global);
        global.Context = {};
        global.resourcesUrl = '/build';
    });
    const jasmineEnv = jasmine.getEnv();
    if (jasmineEnv != null) {
        jasmineEnv.addReporter({
            specStarted: (spec) => {
                global.currentSpec = spec;
            },
        });
    }
    global.screenshotDescriptions = new Set();
    const env = process.env;
    if (typeof env.__STENCIL_DEFAULT_TIMEOUT__ === 'string') {
        const time = parseInt(env.__STENCIL_DEFAULT_TIMEOUT__, 10);
        jest.setTimeout(time * 1.5);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = time;
    }
}

/**
 * A new BuildCtx object is created for every build
 * and rebuild.
 */
class BuildContext {
    constructor(config, compilerCtx) {
        this.buildId = -1;
        this.buildMessages = [];
        this.buildResults = null;
        this.bundleBuildCount = 0;
        this.collections = [];
        this.completedTasks = [];
        this.components = [];
        this.componentGraph = new Map();
        this.data = {};
        this.diagnostics = [];
        this.dirsAdded = [];
        this.dirsDeleted = [];
        this.entryModules = [];
        this.filesAdded = [];
        this.filesChanged = [];
        this.filesDeleted = [];
        this.filesUpdated = [];
        this.filesWritten = [];
        this.globalStyle = undefined;
        this.hasConfigChanges = false;
        this.hasFinished = false;
        this.hasHtmlChanges = false;
        this.hasPrintedResults = false;
        this.hasServiceWorkerChanges = false;
        this.hasScriptChanges = true;
        this.hasStyleChanges = true;
        this.hydrateAppFilePath = null;
        this.indexBuildCount = 0;
        this.indexDoc = undefined;
        this.isRebuild = false;
        this.moduleFiles = [];
        this.outputs = [];
        this.packageJson = {};
        this.packageJsonFilePath = null;
        this.pendingCopyTasks = [];
        this.requiresFullBuild = true;
        this.scriptsAdded = [];
        this.scriptsDeleted = [];
        this.startTime = Date.now();
        this.styleBuildCount = 0;
        this.stylesPromise = null;
        this.stylesUpdated = [];
        this.timeSpan = null;
        this.transpileBuildCount = 0;
        this.config = config;
        this.compilerCtx = compilerCtx;
        this.buildId = ++this.compilerCtx.activeBuildId;
        this.debug = config.logger.debug.bind(config.logger);
    }
    start() {
        // get the build id from the incremented activeBuildId
        // print out a good message
        const msg = `${this.isRebuild ? 'rebuild' : 'build'}, ${this.config.fsNamespace}, ${this.config.devMode ? 'dev' : 'prod'} mode, started`;
        const buildLog = {
            buildId: this.buildId,
            messages: [],
            progress: 0,
        };
        this.compilerCtx.events.emit('buildLog', buildLog);
        // create a timespan for this build
        this.timeSpan = this.createTimeSpan(msg);
        // create a build timestamp for this build
        this.timestamp = getBuildTimestamp();
        // debug log our new build
        this.debug(`start build, ${this.timestamp}`);
        const buildStart = {
            buildId: this.buildId,
            timestamp: this.timestamp,
        };
        this.compilerCtx.events.emit('buildStart', buildStart);
    }
    createTimeSpan(msg, debug) {
        if (!this.hasFinished || debug) {
            if (debug) {
                if (this.config.watch) {
                    msg = `${this.config.logger.cyan('[' + this.buildId + ']')} ${msg}`;
                }
            }
            const timeSpan = this.config.logger.createTimeSpan(msg, debug, this.buildMessages);
            if (!debug && this.compilerCtx.events) {
                const buildLog = {
                    buildId: this.buildId,
                    messages: this.buildMessages,
                    progress: getProgress(this.completedTasks),
                };
                this.compilerCtx.events.emit('buildLog', buildLog);
            }
            return {
                duration: () => {
                    return timeSpan.duration();
                },
                finish: (finishedMsg, color, bold, newLineSuffix) => {
                    if (!this.hasFinished || debug) {
                        if (debug) {
                            if (this.config.watch) {
                                finishedMsg = `${this.config.logger.cyan('[' + this.buildId + ']')} ${finishedMsg}`;
                            }
                        }
                        timeSpan.finish(finishedMsg, color, bold, newLineSuffix);
                        if (!debug) {
                            const buildLog = {
                                buildId: this.buildId,
                                messages: this.buildMessages.slice(),
                                progress: getProgress(this.completedTasks),
                            };
                            this.compilerCtx.events.emit('buildLog', buildLog);
                        }
                    }
                    return timeSpan.duration();
                },
            };
        }
        return {
            duration() {
                return 0;
            },
            finish() {
                return 0;
            },
        };
    }
    debug(msg) {
        this.config.logger.debug(msg);
    }
    get hasError() {
        return hasError(this.diagnostics);
    }
    get hasWarning() {
        return hasWarning(this.diagnostics);
    }
    progress(t) {
        this.completedTasks.push(t);
    }
    async validateTypesBuild() {
        if (this.hasError) {
            // no need to wait on this one since
            // we already aborted this build
            return;
        }
        if (!this.validateTypesPromise) {
            // there is no pending validate types promise
            // so it probably already finished
            // so no need to wait on anything
            return;
        }
        if (!this.config.watch) {
            // this is not a watch build, so we need to make
            // sure that the type validation has finished
            this.debug(`build, non-watch, waiting on validateTypes`);
            await this.validateTypesPromise;
            this.debug(`build, non-watch, finished waiting on validateTypes`);
        }
    }
}
const getBuildTimestamp = () => {
    const d = new Date();
    // YYYY-MM-DDThh:mm:ss
    let timestamp = d.getUTCFullYear() + '-';
    timestamp += ('0' + (d.getUTCMonth() + 1)).slice(-2) + '-';
    timestamp += ('0' + d.getUTCDate()).slice(-2) + 'T';
    timestamp += ('0' + d.getUTCHours()).slice(-2) + ':';
    timestamp += ('0' + d.getUTCMinutes()).slice(-2) + ':';
    timestamp += ('0' + d.getUTCSeconds()).slice(-2);
    return timestamp;
};
const getProgress = (completedTasks) => {
    let progressIndex = 0;
    const taskKeys = Object.keys(ProgressTask);
    taskKeys.forEach((taskKey, index) => {
        if (completedTasks.includes(ProgressTask[taskKey])) {
            progressIndex = index;
        }
    });
    return (progressIndex + 1) / taskKeys.length;
};
const ProgressTask = {
    emptyOutputTargets: {},
    transpileApp: {},
    generateStyles: {},
    generateOutputTargets: {},
    validateTypesBuild: {},
    writeBuildFiles: {},
};

class Cache {
    constructor(config, cacheFs) {
        this.config = config;
        this.cacheFs = cacheFs;
        this.failed = 0;
        this.skip = false;
        this.sys = config.sys;
        this.logger = config.logger;
    }
    async initCacheDir() {
        if (this.config._isTesting) {
            return;
        }
        if (!this.config.enableCache || !this.cacheFs) {
            this.config.logger.info(`cache optimizations disabled`);
            this.clearDiskCache();
            return;
        }
        this.config.logger.debug(`cache enabled, cacheDir: ${this.config.cacheDir}`);
        try {
            const readmeFilePath = path$1.join(this.config.cacheDir, '_README.log');
            await this.cacheFs.writeFile(readmeFilePath, CACHE_DIR_README);
        }
        catch (e) {
            this.logger.error(`Cache, initCacheDir: ${e}`);
            this.config.enableCache = false;
        }
    }
    async get(key) {
        if (!this.config.enableCache || this.skip) {
            return null;
        }
        if (this.failed >= MAX_FAILED) {
            if (!this.skip) {
                this.skip = true;
                this.logger.debug(`cache had ${this.failed} failed ops, skip disk ops for remander of build`);
            }
            return null;
        }
        let result;
        try {
            result = await this.cacheFs.readFile(this.getCacheFilePath(key));
            this.failed = 0;
            this.skip = false;
        }
        catch (e) {
            this.failed++;
            result = null;
        }
        return result;
    }
    async put(key, value) {
        if (!this.config.enableCache) {
            return false;
        }
        let result;
        try {
            await this.cacheFs.writeFile(this.getCacheFilePath(key), value);
            result = true;
        }
        catch (e) {
            this.failed++;
            result = false;
        }
        return result;
    }
    async has(key) {
        const val = await this.get(key);
        return typeof val === 'string';
    }
    async createKey(domain, ...args) {
        if (!this.config.enableCache) {
            return domain + Math.random() * 9999999;
        }
        const hash = await this.sys.generateContentHash(JSON.stringify(args), 32);
        return domain + '_' + hash;
    }
    async commit() {
        if (this.config.enableCache) {
            this.skip = false;
            this.failed = 0;
            await this.cacheFs.commit();
            await this.clearExpiredCache();
        }
    }
    clear() {
        if (this.cacheFs != null) {
            this.cacheFs.clearCache();
        }
    }
    async clearExpiredCache() {
        if (this.cacheFs == null || this.sys.cacheStorage == null) {
            return;
        }
        const now = Date.now();
        const lastClear = (await this.sys.cacheStorage.get(EXP_STORAGE_KEY));
        if (lastClear != null) {
            const diff = now - lastClear;
            if (diff < ONE_DAY) {
                return;
            }
            const fs = this.cacheFs.sys;
            const cachedFileNames = await fs.readdir(this.config.cacheDir);
            const cachedFilePaths = cachedFileNames.map(f => path$1.join(this.config.cacheDir, f));
            let totalCleared = 0;
            const promises = cachedFilePaths.map(async (filePath) => {
                const stat = await fs.stat(filePath);
                const lastModified = stat.mtime.getTime();
                const diff = now - lastModified;
                if (diff > ONE_WEEK) {
                    await fs.unlink(filePath);
                    totalCleared++;
                }
            });
            await Promise.all(promises);
            this.logger.debug(`clearExpiredCache, cachedFileNames: ${cachedFileNames.length}, totalCleared: ${totalCleared}`);
        }
        this.logger.debug(`clearExpiredCache, set last clear`);
        await this.sys.cacheStorage.set(EXP_STORAGE_KEY, now);
    }
    async clearDiskCache() {
        if (this.cacheFs != null) {
            const hasAccess = await this.cacheFs.access(this.config.cacheDir);
            if (hasAccess) {
                await this.cacheFs.remove(this.config.cacheDir);
                await this.cacheFs.commit();
            }
        }
    }
    getCacheFilePath(key) {
        return path$1.join(this.config.cacheDir, key) + '.log';
    }
    getMemoryStats() {
        if (this.cacheFs != null) {
            return this.cacheFs.getMemoryStats();
        }
        return null;
    }
}
const MAX_FAILED = 100;
const ONE_DAY = 1000 * 60 * 60 * 24;
const ONE_WEEK = ONE_DAY * 7;
const EXP_STORAGE_KEY = `last_clear_expired_cache`;
const CACHE_DIR_README = `# Stencil Cache Directory

This directory contains files which the compiler has
cached for faster builds. To disable caching, please set
"enableCache: false" within the stencil config.

To change the cache directory, please update the
"cacheDir" property within the stencil config.
`;

const createInMemoryFs = (sys) => {
    const items = new Map();
    const outputTargetTypes = new Map();
    const accessData = async (filePath) => {
        const item = getItem(filePath);
        if (typeof item.exists === 'boolean') {
            return {
                exists: item.exists,
                isDirectory: item.isDirectory,
                isFile: item.isFile,
            };
        }
        const data = {
            exists: false,
            isDirectory: false,
            isFile: false,
        };
        const s = await stat(filePath);
        if (s) {
            item.exists = s.exists;
            item.isDirectory = s.isDirectory;
            item.isFile = s.isFile;
            data.exists = item.exists;
            data.isDirectory = item.isDirectory;
            data.isFile = item.isFile;
        }
        else {
            item.exists = false;
        }
        return data;
    };
    const access = async (filePath) => {
        const data = await accessData(filePath);
        return data.exists;
    };
    /**
     * Synchronous!!! Do not use!!!
     * (Only typescript transpiling is allowed to use)
     * @param filePath
     */
    const accessSync = (filePath) => {
        const item = getItem(filePath);
        if (typeof item.exists !== 'boolean') {
            const s = statSync(filePath);
            item.exists = s.exists;
            item.isDirectory = s.isDirectory;
            item.isFile = s.isFile;
        }
        return item.exists;
    };
    const copyFile = async (src, dest) => {
        const item = getItem(src);
        item.queueCopyFileToDest = dest;
    };
    const emptyDir = async (dirPath) => {
        const item = getItem(dirPath);
        await removeDir(dirPath);
        item.isFile = false;
        item.isDirectory = true;
        item.queueWriteToDisk = true;
        item.queueDeleteFromDisk = false;
    };
    const readdir = async (dirPath, opts = {}) => {
        dirPath = normalizePath(dirPath);
        const collectedPaths = [];
        if (opts.inMemoryOnly === true) {
            let inMemoryDir = dirPath;
            if (!inMemoryDir.endsWith('/')) {
                inMemoryDir += '/';
            }
            const inMemoryDirs = dirPath.split('/');
            items.forEach((d, filePath) => {
                if (!filePath.startsWith(dirPath)) {
                    return;
                }
                const parts = filePath.split('/');
                if (parts.length === inMemoryDirs.length + 1 || (opts.recursive && parts.length > inMemoryDirs.length)) {
                    if (d.exists) {
                        const item = {
                            absPath: filePath,
                            relPath: parts[inMemoryDirs.length],
                            isDirectory: d.isDirectory,
                            isFile: d.isFile,
                        };
                        if (!shouldExcludeFromReaddir(opts, item)) {
                            collectedPaths.push(item);
                        }
                    }
                }
            });
        }
        else {
            // always a disk read
            await readDirectory(dirPath, dirPath, opts, collectedPaths);
        }
        return collectedPaths.sort((a, b) => {
            if (a.absPath < b.absPath)
                return -1;
            if (a.absPath > b.absPath)
                return 1;
            return 0;
        });
    };
    const readDirectory = async (initPath, dirPath, opts, collectedPaths) => {
        // used internally only so we could easily recursively drill down
        // loop through this directory and sub directories
        // always a disk read!!
        const dirItems = await sys.readdir(dirPath);
        if (dirItems.length > 0) {
            // cache some facts about this path
            const item = getItem(dirPath);
            item.exists = true;
            item.isFile = false;
            item.isDirectory = true;
            await Promise.all(dirItems.map(async (dirItem) => {
                // let's loop through each of the files we've found so far
                // create an absolute path of the item inside of this directory
                const absPath = normalizePath(dirItem);
                const relPath = normalizePath(path$1.relative(initPath, absPath));
                // get the fs stats for the item, could be either a file or directory
                const stats = await stat(absPath);
                const childItem = {
                    absPath: absPath,
                    relPath: relPath,
                    isDirectory: stats.isDirectory,
                    isFile: stats.isFile,
                };
                if (shouldExcludeFromReaddir(opts, childItem)) {
                    return;
                }
                collectedPaths.push(childItem);
                if (opts.recursive === true && stats.isDirectory === true) {
                    // looks like it's yet another directory
                    // let's keep drilling down
                    await readDirectory(initPath, absPath, opts, collectedPaths);
                }
            }));
        }
    };
    const shouldExcludeFromReaddir = (opts, item) => {
        if (item.isDirectory) {
            if (Array.isArray(opts.excludeDirNames)) {
                const base = path$1.basename(item.absPath);
                if (opts.excludeDirNames.some(dir => base === dir)) {
                    return true;
                }
            }
        }
        else {
            if (Array.isArray(opts.excludeExtensions)) {
                const p = item.relPath.toLowerCase();
                if (opts.excludeExtensions.some(ext => p.endsWith(ext))) {
                    return true;
                }
            }
        }
        return false;
    };
    const readFile = async (filePath, opts) => {
        if (opts == null || opts.useCache === true || opts.useCache === undefined) {
            const item = getItem(filePath);
            if (item.exists && typeof item.fileText === 'string') {
                return item.fileText;
            }
        }
        const fileText = await sys.readFile(filePath);
        const item = getItem(filePath);
        if (typeof fileText === 'string') {
            if (fileText.length < MAX_TEXT_CACHE) {
                item.exists = true;
                item.isFile = true;
                item.isDirectory = false;
                item.fileText = fileText;
            }
        }
        else {
            item.exists = false;
        }
        return fileText;
    };
    /**
     * Synchronous!!! Do not use!!!
     * (Only typescript transpiling is allowed to use)
     * @param filePath
     */
    const readFileSync = (filePath, opts) => {
        if (opts == null || opts.useCache === true || opts.useCache === undefined) {
            const item = getItem(filePath);
            if (item.exists && typeof item.fileText === 'string') {
                return item.fileText;
            }
        }
        const fileText = sys.readFileSync(filePath);
        const item = getItem(filePath);
        if (typeof fileText === 'string') {
            if (fileText.length < MAX_TEXT_CACHE) {
                item.exists = true;
                item.isFile = true;
                item.isDirectory = false;
                item.fileText = fileText;
            }
        }
        else {
            item.exists = false;
        }
        return fileText;
    };
    const remove = async (itemPath) => {
        const stats = await stat(itemPath);
        if (stats.isDirectory === true) {
            await removeDir(itemPath);
        }
        else if (stats.isFile === true) {
            await removeItem(itemPath);
        }
    };
    const removeDir = async (dirPath) => {
        const item = getItem(dirPath);
        item.isFile = false;
        item.isDirectory = true;
        if (!item.queueWriteToDisk) {
            item.queueDeleteFromDisk = true;
        }
        try {
            const dirItems = await readdir(dirPath, { recursive: true });
            await Promise.all(dirItems.map(item => removeItem(item.absPath)));
        }
        catch (e) {
            // do not throw error if the directory never existed
        }
    };
    const removeItem = async (filePath) => {
        const item = getItem(filePath);
        if (!item.queueWriteToDisk) {
            item.queueDeleteFromDisk = true;
        }
    };
    const stat = async (itemPath) => {
        const item = getItem(itemPath);
        if (typeof item.isDirectory !== 'boolean' || typeof item.isFile !== 'boolean') {
            const s = await sys.stat(itemPath);
            if (s) {
                item.exists = true;
                if (s.isFile()) {
                    item.isFile = true;
                    item.isDirectory = false;
                    item.size = s.size;
                }
                else if (s.isDirectory()) {
                    item.isFile = false;
                    item.isDirectory = true;
                    item.size = s.size;
                }
                else {
                    item.isFile = false;
                    item.isDirectory = false;
                    item.size = null;
                }
            }
            else {
                item.exists = false;
            }
        }
        return {
            exists: !!item.exists,
            isFile: !!item.isFile,
            isDirectory: !!item.isDirectory,
            size: typeof item.size === 'number' ? item.size : 0,
        };
    };
    /**
     * Synchronous!!! Do not use!!!
     * Always returns an object, does not throw errors.
     * (Only typescript transpiling is allowed to use)
     * @param itemPath
     */
    const statSync = (itemPath) => {
        const item = getItem(itemPath);
        if (typeof item.isDirectory !== 'boolean' || typeof item.isFile !== 'boolean') {
            const s = sys.statSync(itemPath);
            if (s) {
                item.exists = true;
                if (s.isFile()) {
                    item.isFile = true;
                    item.isDirectory = false;
                    item.size = s.size;
                }
                else if (s.isDirectory()) {
                    item.isFile = false;
                    item.isDirectory = true;
                    item.size = s.size;
                }
                else {
                    item.isFile = false;
                    item.isDirectory = false;
                    item.size = null;
                }
            }
            else {
                item.exists = false;
            }
        }
        return {
            exists: !!item.exists,
            isFile: !!item.isFile,
            isDirectory: !!item.isDirectory,
        };
    };
    const writeFile = async (filePath, content, opts) => {
        if (typeof filePath !== 'string') {
            throw new Error(`writeFile, invalid filePath: ${filePath}`);
        }
        if (typeof content !== 'string') {
            throw new Error(`writeFile, invalid content: ${filePath}`);
        }
        const results = {
            ignored: false,
            changedContent: false,
            queuedWrite: false,
        };
        if (shouldIgnore(filePath) === true) {
            results.ignored = true;
            return results;
        }
        const item = getItem(filePath);
        item.exists = true;
        item.isFile = true;
        item.isDirectory = false;
        item.queueDeleteFromDisk = false;
        if (typeof item.fileText === 'string') {
            // compare strings but replace Windows CR to rule out any
            // insignificant new line differences
            results.changedContent = item.fileText.replace(/\r/g, '') !== content.replace(/\r/g, '');
        }
        else {
            results.changedContent = true;
        }
        item.fileText = content;
        results.queuedWrite = false;
        if (opts != null) {
            if (typeof opts.outputTargetType === 'string') {
                outputTargetTypes.set(filePath, opts.outputTargetType);
            }
            if (opts.useCache === false) {
                item.useCache = false;
            }
        }
        if (opts != null && opts.inMemoryOnly === true) {
            // we don't want to actually write this to disk
            // just keep it in memory
            if (item.queueWriteToDisk) {
                // we already queued this file to write to disk
                // in that case we still need to do it
                results.queuedWrite = true;
            }
            else {
                // we only want this in memory and
                // it wasn't already queued to be written
                item.queueWriteToDisk = false;
            }
            // ensure in-memory directories are created
            await ensureDir(filePath, true);
        }
        else if (opts != null && opts.immediateWrite === true) {
            // if this is an immediate write then write the file
            // now and do not add it to the queue
            if (results.changedContent || opts.useCache !== true) {
                // writing the file to disk is a big deal and kicks off fs watchers
                // so let's just double check that the file is actually different first
                const existingFile = await sys.readFile(filePath);
                if (typeof existingFile === 'string') {
                    results.changedContent = item.fileText.replace(/\r/g, '') !== existingFile.replace(/\r/g, '');
                }
                if (results.changedContent) {
                    await ensureDir(filePath, false);
                    await sys.writeFile(filePath, item.fileText);
                }
            }
        }
        else {
            // we want to write this to disk (eventually)
            // but only if the content is different
            // from our existing cached content
            if (!item.queueWriteToDisk && results.changedContent === true) {
                // not already queued to be written
                // and the content is different
                item.queueWriteToDisk = true;
                results.queuedWrite = true;
            }
        }
        return results;
    };
    const writeFiles = (files, opts) => {
        const writes = [];
        if (isIterable(files)) {
            files.forEach((content, filePath) => {
                writes.push(writeFile(filePath, content, opts));
            });
        }
        else {
            Object.keys(files).map(filePath => {
                writes.push(writeFile(filePath, files[filePath], opts));
            });
        }
        return Promise.all(writes);
    };
    const commit = async () => {
        const instructions = getCommitInstructions(items);
        // ensure directories we need exist
        const dirsAdded = await commitEnsureDirs(instructions.dirsToEnsure, false);
        // write all queued the files
        const filesWritten = await commitWriteFiles(instructions.filesToWrite);
        // write all queued the files to copy
        const filesCopied = await commitCopyFiles(instructions.filesToCopy);
        // remove all the queued files to be deleted
        const filesDeleted = await commitDeleteFiles(instructions.filesToDelete);
        // remove all the queued dirs to be deleted
        const dirsDeleted = await commitDeleteDirs(instructions.dirsToDelete);
        instructions.filesToDelete.forEach(clearFileCache);
        instructions.dirsToDelete.forEach(clearDirCache);
        // return only the files that were
        return {
            filesCopied,
            filesWritten,
            filesDeleted,
            dirsDeleted,
            dirsAdded,
        };
    };
    const ensureDir = async (p, inMemoryOnly) => {
        const allDirs = [];
        while (true) {
            p = path$1.dirname(p);
            if (typeof p === 'string' && p.length > 0 && p !== '/' && p.endsWith(':/') === false && p.endsWith(':\\') === false) {
                allDirs.push(p);
            }
            else {
                break;
            }
        }
        allDirs.reverse();
        await commitEnsureDirs(allDirs, inMemoryOnly);
    };
    const commitEnsureDirs = async (dirsToEnsure, inMemoryOnly) => {
        const dirsAdded = [];
        for (const dirPath of dirsToEnsure) {
            const item = getItem(dirPath);
            if (item.exists === true && item.isDirectory === true) {
                // already cached that this path is indeed an existing directory
                continue;
            }
            try {
                // cache that we know this is a directory on disk
                item.exists = true;
                item.isDirectory = true;
                item.isFile = false;
                if (!inMemoryOnly) {
                    await sys.mkdir(dirPath);
                }
                dirsAdded.push(dirPath);
            }
            catch (e) { }
        }
        return dirsAdded;
    };
    const commitCopyFiles = (filesToCopy) => {
        const copiedFiles = Promise.all(filesToCopy.map(async (data) => {
            const src = data[0];
            const dest = data[1];
            await sys.copyFile(src, dest);
            return [src, dest];
        }));
        return copiedFiles;
    };
    const commitWriteFiles = (filesToWrite) => {
        const writtenFiles = Promise.all(filesToWrite.map(async (filePath) => {
            if (typeof filePath !== 'string') {
                throw new Error(`unable to writeFile without filePath`);
            }
            return commitWriteFile(filePath);
        }));
        return writtenFiles;
    };
    const commitWriteFile = async (filePath) => {
        const item = getItem(filePath);
        if (item.fileText == null) {
            throw new Error(`unable to find item fileText to write: ${filePath}`);
        }
        await sys.writeFile(filePath, item.fileText);
        if (item.useCache === false) {
            clearFileCache(filePath);
        }
        return filePath;
    };
    const commitDeleteFiles = async (filesToDelete) => {
        const deletedFiles = await Promise.all(filesToDelete.map(async (filePath) => {
            if (typeof filePath !== 'string') {
                throw new Error(`unable to unlink without filePath`);
            }
            await sys.unlink(filePath);
            return filePath;
        }));
        return deletedFiles;
    };
    const commitDeleteDirs = async (dirsToDelete) => {
        const dirsDeleted = [];
        for (const dirPath of dirsToDelete) {
            await sys.rmdir(dirPath);
            dirsDeleted.push(dirPath);
        }
        return dirsDeleted;
    };
    const clearDirCache = (dirPath) => {
        dirPath = normalizePath(dirPath);
        items.forEach((_, f) => {
            const filePath = path$1.relative(dirPath, f).split('/')[0];
            if (!filePath.startsWith('.') && !filePath.startsWith('/')) {
                clearFileCache(f);
            }
        });
    };
    const clearFileCache = (filePath) => {
        filePath = normalizePath(filePath);
        const item = items.get(filePath);
        if (item != null && !item.queueWriteToDisk) {
            items.delete(filePath);
        }
    };
    const cancelDeleteFilesFromDisk = (filePaths) => {
        for (const filePath of filePaths) {
            const item = getItem(filePath);
            if (item.isFile === true && item.queueDeleteFromDisk === true) {
                item.queueDeleteFromDisk = false;
            }
        }
    };
    const cancelDeleteDirectoriesFromDisk = (dirPaths) => {
        for (const dirPath of dirPaths) {
            const item = getItem(dirPath);
            if (item.queueDeleteFromDisk === true) {
                item.queueDeleteFromDisk = false;
            }
        }
    };
    const getItem = (itemPath) => {
        itemPath = normalizePath(itemPath);
        let item = items.get(itemPath);
        if (item != null) {
            return item;
        }
        items.set(itemPath, (item = {
            exists: null,
            fileText: null,
            size: null,
            mtimeMs: null,
            isDirectory: null,
            isFile: null,
            queueCopyFileToDest: null,
            queueDeleteFromDisk: null,
            queueWriteToDisk: null,
            useCache: null,
        }));
        return item;
    };
    const clearCache = () => items.clear();
    const keys = () => Array.from(items.keys()).sort();
    const getMemoryStats = () => `data length: ${items.size}`;
    const getBuildOutputs = () => {
        const outputs = [];
        outputTargetTypes.forEach((outputTargetType, filePath) => {
            const output = outputs.find(o => o.type === outputTargetType);
            if (output) {
                output.files.push(filePath);
            }
            else {
                outputs.push({
                    type: outputTargetType,
                    files: [filePath],
                });
            }
        });
        outputs.forEach(o => o.files.sort());
        return outputs.sort((a, b) => {
            if (a.type < b.type)
                return -1;
            if (a.type > b.type)
                return 1;
            return 0;
        });
    };
    // only cache if it's less than 5MB-ish (using .length as a rough guess)
    // why 5MB? idk, seems like a good number for source text
    // it's pretty darn large to cover almost ALL legitimate source files
    // and anything larger is probably a REALLY large file and a rare case
    // which we don't need to eat up memory for
    const MAX_TEXT_CACHE = 5242880;
    const fs = {
        access,
        accessSync,
        accessData,
        cancelDeleteDirectoriesFromDisk,
        cancelDeleteFilesFromDisk,
        clearCache,
        clearDirCache,
        clearFileCache,
        commit,
        copyFile,
        emptyDir,
        getBuildOutputs,
        getItem,
        getMemoryStats,
        keys,
        readFile,
        readFileSync,
        readdir,
        remove,
        stat,
        statSync,
        sys,
        writeFile,
        writeFiles,
    };
    return fs;
};
const getCommitInstructions = (items) => {
    const instructions = {
        filesToDelete: [],
        filesToWrite: [],
        filesToCopy: [],
        dirsToDelete: [],
        dirsToEnsure: [],
    };
    items.forEach((item, itemPath) => {
        if (item.queueWriteToDisk === true) {
            if (item.isFile === true) {
                instructions.filesToWrite.push(itemPath);
                const dir = normalizePath(path$1.dirname(itemPath));
                if (!instructions.dirsToEnsure.includes(dir)) {
                    instructions.dirsToEnsure.push(dir);
                }
                const dirDeleteIndex = instructions.dirsToDelete.indexOf(dir);
                if (dirDeleteIndex > -1) {
                    instructions.dirsToDelete.splice(dirDeleteIndex, 1);
                }
                const fileDeleteIndex = instructions.filesToDelete.indexOf(itemPath);
                if (fileDeleteIndex > -1) {
                    instructions.filesToDelete.splice(fileDeleteIndex, 1);
                }
            }
            else if (item.isDirectory === true) {
                if (!instructions.dirsToEnsure.includes(itemPath)) {
                    instructions.dirsToEnsure.push(itemPath);
                }
                const dirDeleteIndex = instructions.dirsToDelete.indexOf(itemPath);
                if (dirDeleteIndex > -1) {
                    instructions.dirsToDelete.splice(dirDeleteIndex, 1);
                }
            }
        }
        else if (item.queueDeleteFromDisk === true) {
            if (item.isDirectory && !instructions.dirsToEnsure.includes(itemPath)) {
                instructions.dirsToDelete.push(itemPath);
            }
            else if (item.isFile && !instructions.filesToWrite.includes(itemPath)) {
                instructions.filesToDelete.push(itemPath);
            }
        }
        else if (typeof item.queueCopyFileToDest === 'string') {
            const src = itemPath;
            const dest = item.queueCopyFileToDest;
            instructions.filesToCopy.push([src, dest]);
            const dir = normalizePath(path$1.dirname(dest));
            if (!instructions.dirsToEnsure.includes(dir)) {
                instructions.dirsToEnsure.push(dir);
            }
            const dirDeleteIndex = instructions.dirsToDelete.indexOf(dir);
            if (dirDeleteIndex > -1) {
                instructions.dirsToDelete.splice(dirDeleteIndex, 1);
            }
            const fileDeleteIndex = instructions.filesToDelete.indexOf(dest);
            if (fileDeleteIndex > -1) {
                instructions.filesToDelete.splice(fileDeleteIndex, 1);
            }
        }
        item.queueDeleteFromDisk = false;
        item.queueWriteToDisk = false;
    });
    // add all the ancestor directories for each directory too
    for (let i = 0, ilen = instructions.dirsToEnsure.length; i < ilen; i++) {
        const segments = instructions.dirsToEnsure[i].split('/');
        for (let j = 2; j < segments.length; j++) {
            const dir = segments.slice(0, j).join('/');
            if (instructions.dirsToEnsure.includes(dir) === false) {
                instructions.dirsToEnsure.push(dir);
            }
        }
    }
    // sort directories so shortest paths are ensured first
    instructions.dirsToEnsure.sort((a, b) => {
        const segmentsA = a.split('/').length;
        const segmentsB = b.split('/').length;
        if (segmentsA < segmentsB)
            return -1;
        if (segmentsA > segmentsB)
            return 1;
        if (a.length < b.length)
            return -1;
        if (a.length > b.length)
            return 1;
        return 0;
    });
    // sort directories so longest paths are removed first
    instructions.dirsToDelete.sort((a, b) => {
        const segmentsA = a.split('/').length;
        const segmentsB = b.split('/').length;
        if (segmentsA < segmentsB)
            return 1;
        if (segmentsA > segmentsB)
            return -1;
        if (a.length < b.length)
            return 1;
        if (a.length > b.length)
            return -1;
        return 0;
    });
    for (const dirToEnsure of instructions.dirsToEnsure) {
        const i = instructions.dirsToDelete.indexOf(dirToEnsure);
        if (i > -1) {
            instructions.dirsToDelete.splice(i, 1);
        }
    }
    instructions.dirsToDelete = instructions.dirsToDelete.filter(dir => {
        if (dir === '/' || dir.endsWith(':/') === true) {
            return false;
        }
        return true;
    });
    instructions.dirsToEnsure = instructions.dirsToEnsure.filter(dir => {
        const item = items.get(dir);
        if (item != null && item.exists === true && item.isDirectory === true) {
            return false;
        }
        if (dir === '/' || dir.endsWith(':/')) {
            return false;
        }
        return true;
    });
    return instructions;
};
const shouldIgnore = (filePath) => {
    filePath = filePath.trim().toLowerCase();
    return IGNORE.some(ignoreFile => filePath.endsWith(ignoreFile));
};
const IGNORE = ['.ds_store', '.gitignore', 'desktop.ini', 'thumbs.db'];

const buildEvents = () => {
    const evCallbacks = [];
    const off = (callback) => {
        const index = evCallbacks.findIndex(ev => ev.callback === callback);
        if (index > -1) {
            evCallbacks.splice(index, 1);
            return true;
        }
        return false;
    };
    const on = (arg0, arg1) => {
        if (typeof arg0 === 'function') {
            const eventName = null;
            const callback = arg0;
            evCallbacks.push({
                eventName,
                callback,
            });
            return () => off(callback);
        }
        else if (typeof arg0 === 'string' && typeof arg1 === 'function') {
            const eventName = arg0.toLowerCase().trim();
            const callback = arg1;
            evCallbacks.push({
                eventName,
                callback,
            });
            return () => off(callback);
        }
        return () => false;
    };
    const emit = (eventName, data) => {
        const normalizedEventName = eventName.toLowerCase().trim();
        const callbacks = evCallbacks.slice();
        for (const ev of callbacks) {
            if (ev.eventName == null) {
                try {
                    ev.callback(eventName, data);
                }
                catch (e) {
                    console.error(e);
                }
            }
            else if (ev.eventName === normalizedEventName) {
                try {
                    ev.callback(data);
                }
                catch (e) {
                    console.error(e);
                }
            }
        }
    };
    const unsubscribeAll = () => {
        evCallbacks.length = 0;
    };
    return {
        emit,
        on,
        unsubscribeAll,
    };
};

const createWebWorkerMainController = (workerUrl, maxConcurrentWorkers) => {
    let msgIds = 0;
    let isDestroyed = false;
    let isQueued = false;
    let workerIds = 0;
    let workerBlob;
    const tasks = new Map();
    const queuedSendMsgs = [];
    const workers = [];
    const hardwareConcurrency = navigator.hardwareConcurrency || 1;
    const totalWorkers = Math.max(Math.min(maxConcurrentWorkers, hardwareConcurrency), 2) - 1;
    const tick = Promise.resolve();
    const onMsgsFromWorker = (worker, ev) => {
        if (!isDestroyed) {
            const msgsFromWorker = ev.data;
            if (Array.isArray(msgsFromWorker)) {
                for (const msgFromWorker of msgsFromWorker) {
                    if (msgFromWorker) {
                        const task = tasks.get(msgFromWorker.stencilId);
                        if (task) {
                            tasks.delete(msgFromWorker.stencilId);
                            if (msgFromWorker.stencilRtnError) {
                                task.reject(msgFromWorker.stencilRtnError);
                            }
                            else {
                                task.resolve(msgFromWorker.stencilRtnValue);
                            }
                            worker.activeTasks--;
                            if (worker.activeTasks < 0 || worker.activeTasks > 50) {
                                worker.activeTasks = 0;
                            }
                        }
                        else if (msgFromWorker.stencilRtnError) {
                            console.error(msgFromWorker.stencilRtnError);
                        }
                    }
                }
            }
        }
    };
    const onError = (e) => console.error(e);
    const createWebWorkerMain = () => {
        let worker = null;
        const workerOpts = {
            name: `stencil.worker.${workerIds++}`,
        };
        try {
            // first try directly starting the worker with the URL
            worker = new Worker(workerUrl, workerOpts);
        }
        catch (e) {
            // probably a cross-origin issue, try using a Blob instead
            if (workerBlob == null) {
                workerBlob = new Blob([`importScripts('${workerUrl}');`], { type: 'application/javascript' });
            }
            worker = new Worker(URL.createObjectURL(workerBlob), workerOpts);
        }
        const workerChild = {
            worker,
            activeTasks: 0,
            sendQueue: [],
        };
        worker.onerror = onError;
        worker.onmessage = ev => onMsgsFromWorker(workerChild, ev);
        return workerChild;
    };
    const sendMsgsToWorkers = (w) => {
        if (w.sendQueue.length > 0) {
            w.worker.postMessage(w.sendQueue);
            w.sendQueue.length = 0;
        }
    };
    const queueMsgToWorker = (msg) => {
        let theChoseOne;
        if (workers.length > 0) {
            theChoseOne = workers[0];
            if (totalWorkers > 1) {
                for (const worker of workers) {
                    if (worker.activeTasks < theChoseOne.activeTasks) {
                        theChoseOne = worker;
                    }
                }
                if (theChoseOne.activeTasks > 0 && workers.length < totalWorkers) {
                    theChoseOne = createWebWorkerMain();
                    workers.push(theChoseOne);
                }
            }
        }
        else {
            theChoseOne = createWebWorkerMain();
            workers.push(theChoseOne);
        }
        theChoseOne.activeTasks++;
        theChoseOne.sendQueue.push(msg);
    };
    const flushSendQueue = () => {
        isQueued = false;
        queuedSendMsgs.forEach(queueMsgToWorker);
        queuedSendMsgs.length = 0;
        workers.forEach(sendMsgsToWorkers);
    };
    const send = (...args) => new Promise((resolve, reject) => {
        if (isDestroyed) {
            reject(TASK_CANCELED_MSG);
        }
        else {
            const msg = {
                stencilId: msgIds++,
                args,
            };
            queuedSendMsgs.push(msg);
            tasks.set(msg.stencilId, {
                resolve,
                reject,
            });
            if (!isQueued) {
                isQueued = true;
                tick.then(flushSendQueue);
            }
        }
    });
    const destroy = () => {
        isDestroyed = true;
        tasks.forEach(t => t.reject(TASK_CANCELED_MSG));
        tasks.clear();
        workers.forEach(w => w.worker.terminate());
        workers.length = 0;
    };
    const handler = (name) => {
        return function (...args) {
            return send(name, ...args);
        };
    };
    return {
        send,
        destroy,
        handler,
    };
};

const COMMON_DIR_MODULE_EXTS = ['.tsx', '.ts', '.mjs', '.js', '.jsx', '.json', '.md'];
const COMMON_DIR_FILENAMES = ['package.json', 'index.js', 'index.mjs'];
const isDtsFile = (p) => p.endsWith('.d.ts');
const isTsFile = (p) => !isDtsFile(p) && p.endsWith('.ts');
const isTsxFile = (p) => p.endsWith('.tsx');
const getCommonDirName = (dirPath, fileName) => dirPath + '/' + fileName;
const isCommonDirModuleFile = (p) => COMMON_DIR_MODULE_EXTS.some(ext => p.endsWith(ext));
const setPackageVersion = (pkgVersions, pkgName, pkgVersion) => {
    pkgVersions.set(pkgName, pkgVersion);
};
const setPackageVersionByContent = (pkgVersions, pkgContent) => {
    try {
        const pkg = JSON.parse(pkgContent);
        if (pkg.name && pkg.version) {
            setPackageVersion(pkgVersions, pkg.name, pkg.version);
        }
    }
    catch (e) { }
};
const shouldFetchModule = (p) => IS_FETCH_ENV && !IS_NODE_ENV && isNodeModulePath(p);
const isNodeModulePath = (p) => normalizePath(p)
    .split('/')
    .includes('node_modules');
const getPackageDirPath = (p, moduleId) => {
    const parts = normalizePath(p).split('/');
    for (let i = parts.length - 1; i >= 1; i--) {
        if (parts[i - 1] === 'node_modules' && parts[i] === moduleId) {
            return parts.slice(0, i + 1).join('/');
        }
    }
    return null;
};

const httpFetch = (sys, input, init) => {
    if (sys && isFunction(sys.fetch)) {
        return sys.fetch(input, init);
    }
    return fetch(input, init);
};
const packageVersions = new Map();
const known404Urls = new Set();
const getRemoteModuleUrl = (sys, module) => {
    if (sys && isFunction(sys.getRemoteModuleUrl)) {
        return sys.getRemoteModuleUrl(module);
    }
    const nmBaseUrl = 'https://cdn.jsdelivr.net/npm/';
    const path = `${module.moduleId}${module.version ? '@' + module.version : ''}/${module.path}`;
    return new URL(path, nmBaseUrl).href;
};
const getStencilRootUrl = (compilerExe) => new URL('../', compilerExe).href;
const getStencilModuleUrl = (compilerExe, p) => {
    p = normalizePath(p);
    let parts = p.split('/');
    const nmIndex = parts.lastIndexOf('node_modules');
    if (nmIndex > -1 && nmIndex < parts.length - 1) {
        parts = parts.slice(nmIndex + 1);
        if (parts[0].startsWith('@')) {
            parts = parts.slice(2);
        }
        else {
            parts = parts.slice(1);
        }
        p = parts.join('/');
    }
    return new URL('./' + p, getStencilRootUrl(compilerExe)).href;
};
const getCommonDirUrl = (sys, pkgVersions, dirPath, fileName) => getNodeModuleFetchUrl(sys, pkgVersions, dirPath) + '/' + fileName;
const getNodeModuleFetchUrl = (sys, pkgVersions, filePath) => {
    // /node_modules/lodash/package.json
    filePath = normalizePath(filePath);
    // ["node_modules", "lodash", "package.json"]
    let pathParts = filePath.split('/').filter(p => p.length);
    const nmIndex = pathParts.lastIndexOf('node_modules');
    if (nmIndex > -1 && nmIndex < pathParts.length - 1) {
        pathParts = pathParts.slice(nmIndex + 1);
    }
    let moduleId = pathParts.shift();
    if (moduleId.startsWith('@')) {
        moduleId += '/' + pathParts.shift();
    }
    const path = pathParts.join('/');
    if (moduleId === '@stencil/core') {
        const compilerExe = sys.getCompilerExecutingPath();
        return getStencilModuleUrl(compilerExe, path);
    }
    return getRemoteModuleUrl(sys, {
        moduleId,
        version: pkgVersions.get(moduleId),
        path,
    });
};
const skipFilePathFetch = (filePath) => {
    if (isTsFile(filePath) || isTsxFile(filePath)) {
        // don't bother trying to resolve  node_module packages w/ typescript files
        // they should already be .js files
        return true;
    }
    const pathParts = filePath.split('/');
    const secondToLast = pathParts[pathParts.length - 2];
    const lastPart = pathParts[pathParts.length - 1];
    if (secondToLast === 'node_modules' && isCommonDirModuleFile(lastPart)) {
        // /node_modules/index.js
        // /node_modules/lodash.js
        // we just already know this is bogus, so don't bother
        return true;
    }
    return false;
};
const skipUrlFetch = (url) => 
// files we just already know not to try to resolve request
knownUrlSkips.some(knownSkip => url.endsWith(knownSkip));
const knownUrlSkips = [
    '/@stencil/core/internal.js',
    '/@stencil/core/internal.json',
    '/@stencil/core/internal.mjs',
    '/@stencil/core/internal/stencil-core.js/index.json',
    '/@stencil/core/internal/stencil-core.js.json',
    '/@stencil/core/internal/stencil-core.js/package.json',
    '/@stencil/core.js',
    '/@stencil/core.json',
    '/@stencil/core.mjs',
    '/@stencil/core.css',
    '/@stencil/core/index.js',
    '/@stencil/core/index.json',
    '/@stencil/core/index.mjs',
    '/@stencil/core/index.css',
    '/@stencil/package.json',
];

const writeFetchSuccessAsync = async (sys, inMemoryFs, url, filePath, content, pkgVersions) => {
    if (url.endsWith('package.json')) {
        setPackageVersionByContent(pkgVersions, content);
    }
    let dir = path$1.dirname(filePath);
    while (dir !== '/' && dir !== '') {
        if (inMemoryFs) {
            inMemoryFs.clearFileCache(dir);
            await inMemoryFs.sys.mkdir(dir);
        }
        else {
            await sys.mkdir(dir);
        }
        dir = path$1.dirname(dir);
    }
    if (inMemoryFs) {
        inMemoryFs.clearFileCache(filePath);
        await inMemoryFs.sys.writeFile(filePath, content);
    }
    else {
        await sys.writeFile(filePath, content);
    }
};

const fetchModuleAsync = async (sys, inMemoryFs, pkgVersions, url, filePath) => {
    if (skipFilePathFetch(filePath) || known404Urls.has(url) || skipUrlFetch(url)) {
        return undefined;
    }
    try {
        const rsp = await httpFetch(sys, url);
        if (rsp) {
            if (rsp.ok) {
                const content = await rsp.clone().text();
                await writeFetchSuccessAsync(sys, inMemoryFs, url, filePath, content, pkgVersions);
                return content;
            }
            if (rsp.status === 404) {
                known404Urls.add(url);
            }
        }
    }
    catch (e) {
        console.error(e);
    }
    return undefined;
};

var caller = function () {
    // see https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
    var origPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) { return stack; };
    var stack = (new Error()).stack;
    Error.prepareStackTrace = origPrepareStackTrace;
    return stack[2].getFileName();
};

var pathParse = createCommonjsModule(function (module) {

var isWindows = process.platform === 'win32';

// Regex to split a windows path into three parts: [*, device, slash,
// tail] windows-only
var splitDeviceRe =
    /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;

// Regex to split the tail part of the above into [*, dir, basename, ext]
var splitTailRe =
    /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/;

var win32 = {};

// Function to split a filename into [root, dir, basename, ext]
function win32SplitPath(filename) {
  // Separate device+slash from tail
  var result = splitDeviceRe.exec(filename),
      device = (result[1] || '') + (result[2] || ''),
      tail = result[3] || '';
  // Split the tail into dir, basename and extension
  var result2 = splitTailRe.exec(tail),
      dir = result2[1],
      basename = result2[2],
      ext = result2[3];
  return [device, dir, basename, ext];
}

win32.parse = function(pathString) {
  if (typeof pathString !== 'string') {
    throw new TypeError(
        "Parameter 'pathString' must be a string, not " + typeof pathString
    );
  }
  var allParts = win32SplitPath(pathString);
  if (!allParts || allParts.length !== 4) {
    throw new TypeError("Invalid path '" + pathString + "'");
  }
  return {
    root: allParts[0],
    dir: allParts[0] + allParts[1].slice(0, -1),
    base: allParts[2],
    ext: allParts[3],
    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
  };
};



// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var posix = {};


function posixSplitPath(filename) {
  return splitPathRe.exec(filename).slice(1);
}


posix.parse = function(pathString) {
  if (typeof pathString !== 'string') {
    throw new TypeError(
        "Parameter 'pathString' must be a string, not " + typeof pathString
    );
  }
  var allParts = posixSplitPath(pathString);
  if (!allParts || allParts.length !== 4) {
    throw new TypeError("Invalid path '" + pathString + "'");
  }
  allParts[1] = allParts[1] || '';
  allParts[2] = allParts[2] || '';
  allParts[3] = allParts[3] || '';

  return {
    root: allParts[0],
    dir: allParts[0] + allParts[1].slice(0, -1),
    base: allParts[2],
    ext: allParts[3],
    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
  };
};


if (isWindows)
  module.exports = win32.parse;
else /* posix */
  module.exports = posix.parse;

module.exports.posix = posix.parse;
module.exports.win32 = win32.parse;
});
var pathParse_1 = pathParse.posix;
var pathParse_2 = pathParse.win32;

var parse$1 = path$1__default.parse || pathParse;

var getNodeModulesDirs = function getNodeModulesDirs(absoluteStart, modules) {
    var prefix = '/';
    if ((/^([A-Za-z]:)/).test(absoluteStart)) {
        prefix = '';
    } else if ((/^\\\\/).test(absoluteStart)) {
        prefix = '\\\\';
    }

    var paths = [absoluteStart];
    var parsed = parse$1(absoluteStart);
    while (parsed.dir !== paths[paths.length - 1]) {
        paths.push(parsed.dir);
        parsed = parse$1(parsed.dir);
    }

    return paths.reduce(function (dirs, aPath) {
        return dirs.concat(modules.map(function (moduleDir) {
            return path$1__default.resolve(prefix, aPath, moduleDir);
        }));
    }, []);
};

var nodeModulesPaths = function nodeModulesPaths(start, opts, request) {
    var modules = opts && opts.moduleDirectory
        ? [].concat(opts.moduleDirectory)
        : ['node_modules'];

    if (opts && typeof opts.paths === 'function') {
        return opts.paths(
            request,
            start,
            function () { return getNodeModulesDirs(start, modules); },
            opts
        );
    }

    var dirs = getNodeModulesDirs(start, modules);
    return opts && opts.paths ? dirs.concat(opts.paths) : dirs;
};

var normalizeOptions = function (x, opts) {
    /**
     * This file is purposefully a passthrough. It's expected that third-party
     * environments will override it at runtime in order to inject special logic
     * into `resolve` (by manipulating the options). One such example is the PnP
     * code path in Yarn.
     */

    return opts || {};
};

const assert = true;
const async_hooks = ">= 8";
const buffer_ieee754 = "< 0.9.7";
const buffer = true;
const child_process = true;
const cluster = true;
const console$1 = true;
const constants = true;
const crypto$1 = true;
const _debug_agent = ">= 1 && < 8";
const _debugger = "< 8";
const dgram = true;
const dns = true;
const domain = true;
const events = true;
const freelist = "< 6";
const fs = true;
const _http_agent = ">= 0.11.1";
const _http_client = ">= 0.11.1";
const _http_common = ">= 0.11.1";
const _http_incoming = ">= 0.11.1";
const _http_outgoing = ">= 0.11.1";
const _http_server = ">= 0.11.1";
const http = true;
const http2 = ">= 8.8";
const https = true;
const inspector = ">= 8.0.0";
const _linklist = "< 8";
const module$1 = true;
const net = true;
const os = true;
const path = true;
const perf_hooks = ">= 8.5";
const process$1 = ">= 1";
const punycode = true;
const querystring = true;
const readline = true;
const repl = true;
const smalloc = ">= 0.11.5 && < 3";
const _stream_duplex = ">= 0.9.4";
const _stream_transform = ">= 0.9.4";
const _stream_wrap = ">= 1.4.1";
const _stream_passthrough = ">= 0.9.4";
const _stream_readable = ">= 0.9.4";
const _stream_writable = ">= 0.9.4";
const stream = true;
const string_decoder = true;
const sys = true;
const timers = true;
const _tls_common = ">= 0.11.13";
const _tls_legacy = ">= 0.11.3 && < 10";
const _tls_wrap = ">= 0.11.3";
const tls = true;
const trace_events = ">= 10";
const tty = true;
const url = true;
const util$2 = true;
const v8 = ">= 1";
const vm = true;
const worker_threads = ">= 11.7";
const zlib = true;
const core = {
	assert: assert,
	async_hooks: async_hooks,
	buffer_ieee754: buffer_ieee754,
	buffer: buffer,
	child_process: child_process,
	cluster: cluster,
	console: console$1,
	constants: constants,
	crypto: crypto$1,
	_debug_agent: _debug_agent,
	_debugger: _debugger,
	dgram: dgram,
	dns: dns,
	domain: domain,
	events: events,
	freelist: freelist,
	fs: fs,
	"fs/promises": ">= 10 && < 10.1",
	_http_agent: _http_agent,
	_http_client: _http_client,
	_http_common: _http_common,
	_http_incoming: _http_incoming,
	_http_outgoing: _http_outgoing,
	_http_server: _http_server,
	http: http,
	http2: http2,
	https: https,
	inspector: inspector,
	_linklist: _linklist,
	module: module$1,
	net: net,
	"node-inspect/lib/_inspect": ">= 7.6.0 && < 12",
	"node-inspect/lib/internal/inspect_client": ">= 7.6.0 && < 12",
	"node-inspect/lib/internal/inspect_repl": ">= 7.6.0 && < 12",
	os: os,
	path: path,
	perf_hooks: perf_hooks,
	process: process$1,
	punycode: punycode,
	querystring: querystring,
	readline: readline,
	repl: repl,
	smalloc: smalloc,
	_stream_duplex: _stream_duplex,
	_stream_transform: _stream_transform,
	_stream_wrap: _stream_wrap,
	_stream_passthrough: _stream_passthrough,
	_stream_readable: _stream_readable,
	_stream_writable: _stream_writable,
	stream: stream,
	string_decoder: string_decoder,
	sys: sys,
	timers: timers,
	_tls_common: _tls_common,
	_tls_legacy: _tls_legacy,
	_tls_wrap: _tls_wrap,
	tls: tls,
	trace_events: trace_events,
	tty: tty,
	url: url,
	util: util$2,
	"v8/tools/arguments": ">= 10 && < 12",
	"v8/tools/codemap": [
	">= 4.4.0 && < 5",
	">= 5.2.0 && < 12"
],
	"v8/tools/consarray": [
	">= 4.4.0 && < 5",
	">= 5.2.0 && < 12"
],
	"v8/tools/csvparser": [
	">= 4.4.0 && < 5",
	">= 5.2.0 && < 12"
],
	"v8/tools/logreader": [
	">= 4.4.0 && < 5",
	">= 5.2.0 && < 12"
],
	"v8/tools/profile_view": [
	">= 4.4.0 && < 5",
	">= 5.2.0 && < 12"
],
	"v8/tools/splaytree": [
	">= 4.4.0 && < 5",
	">= 5.2.0 && < 12"
],
	v8: v8,
	vm: vm,
	worker_threads: worker_threads,
	zlib: zlib
};

const core$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    assert: assert,
    async_hooks: async_hooks,
    buffer_ieee754: buffer_ieee754,
    buffer: buffer,
    child_process: child_process,
    cluster: cluster,
    console: console$1,
    constants: constants,
    crypto: crypto$1,
    _debug_agent: _debug_agent,
    _debugger: _debugger,
    dgram: dgram,
    dns: dns,
    domain: domain,
    events: events,
    freelist: freelist,
    fs: fs,
    _http_agent: _http_agent,
    _http_client: _http_client,
    _http_common: _http_common,
    _http_incoming: _http_incoming,
    _http_outgoing: _http_outgoing,
    _http_server: _http_server,
    http: http,
    http2: http2,
    https: https,
    inspector: inspector,
    _linklist: _linklist,
    module: module$1,
    net: net,
    os: os,
    path: path,
    perf_hooks: perf_hooks,
    process: process$1,
    punycode: punycode,
    querystring: querystring,
    readline: readline,
    repl: repl,
    smalloc: smalloc,
    _stream_duplex: _stream_duplex,
    _stream_transform: _stream_transform,
    _stream_wrap: _stream_wrap,
    _stream_passthrough: _stream_passthrough,
    _stream_readable: _stream_readable,
    _stream_writable: _stream_writable,
    stream: stream,
    string_decoder: string_decoder,
    sys: sys,
    timers: timers,
    _tls_common: _tls_common,
    _tls_legacy: _tls_legacy,
    _tls_wrap: _tls_wrap,
    tls: tls,
    trace_events: trace_events,
    tty: tty,
    url: url,
    util: util$2,
    v8: v8,
    vm: vm,
    worker_threads: worker_threads,
    zlib: zlib,
    'default': core
});

const data$1 = getCjsExportFromNamespace(core$1);

var current = (process.versions && process.versions.node && process.versions.node.split('.')) || [];

function specifierIncluded(specifier) {
    var parts = specifier.split(' ');
    var op = parts.length > 1 ? parts[0] : '=';
    var versionParts = (parts.length > 1 ? parts[1] : parts[0]).split('.');

    for (var i = 0; i < 3; ++i) {
        var cur = Number(current[i] || 0);
        var ver = Number(versionParts[i] || 0);
        if (cur === ver) {
            continue; // eslint-disable-line no-restricted-syntax, no-continue
        }
        if (op === '<') {
            return cur < ver;
        } else if (op === '>=') {
            return cur >= ver;
        } else {
            return false;
        }
    }
    return op === '>=';
}

function matchesRange(range) {
    var specifiers = range.split(/ ?&& ?/);
    if (specifiers.length === 0) { return false; }
    for (var i = 0; i < specifiers.length; ++i) {
        if (!specifierIncluded(specifiers[i])) { return false; }
    }
    return true;
}

function versionIncluded(specifierValue) {
    if (typeof specifierValue === 'boolean') { return specifierValue; }
    if (specifierValue && typeof specifierValue === 'object') {
        for (var i = 0; i < specifierValue.length; ++i) {
            if (matchesRange(specifierValue[i])) { return true; }
        }
        return false;
    }
    return matchesRange(specifierValue);
}



var core$2 = {};
for (var mod in data$1) { // eslint-disable-line no-restricted-syntax
    if (Object.prototype.hasOwnProperty.call(data$1, mod)) {
        core$2[mod] = versionIncluded(data$1[mod]);
    }
}
var core_1 = core$2;

var isCore = function isCore(x) {
    return Object.prototype.hasOwnProperty.call(core_1, x);
};

var defaultIsFile = function isFile(file, cb) {
    fs$1.stat(file, function (err, stat) {
        if (!err) {
            return cb(null, stat.isFile() || stat.isFIFO());
        }
        if (err.code === 'ENOENT' || err.code === 'ENOTDIR') return cb(null, false);
        return cb(err);
    });
};

var defaultIsDir = function isDirectory(dir, cb) {
    fs$1.stat(dir, function (err, stat) {
        if (!err) {
            return cb(null, stat.isDirectory());
        }
        if (err.code === 'ENOENT' || err.code === 'ENOTDIR') return cb(null, false);
        return cb(err);
    });
};

var maybeUnwrapSymlink = function maybeUnwrapSymlink(x, opts, cb) {
    if (opts && opts.preserveSymlinks === false) {
        fs$1.realpath(x, function (realPathErr, realPath) {
            if (realPathErr && realPathErr.code !== 'ENOENT') cb(realPathErr);
            else cb(null, realPathErr ? x : realPath);
        });
    } else {
        cb(null, x);
    }
};

var async = function resolve(x, options, callback) {
    var cb = callback;
    var opts = options;
    if (typeof options === 'function') {
        cb = opts;
        opts = {};
    }
    if (typeof x !== 'string') {
        var err = new TypeError('Path must be a string.');
        return process.nextTick(function () {
            cb(err);
        });
    }

    opts = normalizeOptions(x, opts);

    var isFile = opts.isFile || defaultIsFile;
    var isDirectory = opts.isDirectory || defaultIsDir;
    var readFile = opts.readFile || fs$1.readFile;

    var extensions = opts.extensions || ['.js'];
    var basedir = opts.basedir || path$1__default.dirname(caller());
    var parent = opts.filename || basedir;

    opts.paths = opts.paths || [];

    // ensure that `basedir` is an absolute path at this point, resolving against the process' current working directory
    var absoluteStart = path$1__default.resolve(basedir);

    maybeUnwrapSymlink(
        absoluteStart,
        opts,
        function (err, realStart) {
            if (err) cb(err);
            else init(realStart);
        }
    );

    var res;
    function init(basedir) {
        if ((/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/).test(x)) {
            res = path$1__default.resolve(basedir, x);
            if (x === '..' || x.slice(-1) === '/') res += '/';
            if ((/\/$/).test(x) && res === basedir) {
                loadAsDirectory(res, opts.package, onfile);
            } else loadAsFile(res, opts.package, onfile);
        } else loadNodeModules(x, basedir, function (err, n, pkg) {
            if (err) cb(err);
            else if (isCore(x)) return cb(null, x);
            else if (n) {
                return maybeUnwrapSymlink(n, opts, function (err, realN) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, realN, pkg);
                    }
                });
            } else {
                var moduleError = new Error("Cannot find module '" + x + "' from '" + parent + "'");
                moduleError.code = 'MODULE_NOT_FOUND';
                cb(moduleError);
            }
        });
    }

    function onfile(err, m, pkg) {
        if (err) cb(err);
        else if (m) cb(null, m, pkg);
        else loadAsDirectory(res, function (err, d, pkg) {
            if (err) cb(err);
            else if (d) {
                maybeUnwrapSymlink(d, opts, function (err, realD) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, realD, pkg);
                    }
                });
            } else {
                var moduleError = new Error("Cannot find module '" + x + "' from '" + parent + "'");
                moduleError.code = 'MODULE_NOT_FOUND';
                cb(moduleError);
            }
        });
    }

    function loadAsFile(x, thePackage, callback) {
        var loadAsFilePackage = thePackage;
        var cb = callback;
        if (typeof loadAsFilePackage === 'function') {
            cb = loadAsFilePackage;
            loadAsFilePackage = undefined;
        }

        var exts = [''].concat(extensions);
        load(exts, x, loadAsFilePackage);

        function load(exts, x, loadPackage) {
            if (exts.length === 0) return cb(null, undefined, loadPackage);
            var file = x + exts[0];

            var pkg = loadPackage;
            if (pkg) onpkg(null, pkg);
            else loadpkg(path$1__default.dirname(file), onpkg);

            function onpkg(err, pkg_, dir) {
                pkg = pkg_;
                if (err) return cb(err);
                if (dir && pkg && opts.pathFilter) {
                    var rfile = path$1__default.relative(dir, file);
                    var rel = rfile.slice(0, rfile.length - exts[0].length);
                    var r = opts.pathFilter(pkg, x, rel);
                    if (r) return load(
                        [''].concat(extensions.slice()),
                        path$1__default.resolve(dir, r),
                        pkg
                    );
                }
                isFile(file, onex);
            }
            function onex(err, ex) {
                if (err) return cb(err);
                if (ex) return cb(null, file, pkg);
                load(exts.slice(1), x, pkg);
            }
        }
    }

    function loadpkg(dir, cb) {
        if (dir === '' || dir === '/') return cb(null);
        if (process.platform === 'win32' && (/^\w:[/\\]*$/).test(dir)) {
            return cb(null);
        }
        if ((/[/\\]node_modules[/\\]*$/).test(dir)) return cb(null);

        maybeUnwrapSymlink(dir, opts, function (unwrapErr, pkgdir) {
            if (unwrapErr) return loadpkg(path$1__default.dirname(dir), cb);
            var pkgfile = path$1__default.join(pkgdir, 'package.json');
            isFile(pkgfile, function (err, ex) {
                // on err, ex is false
                if (!ex) return loadpkg(path$1__default.dirname(dir), cb);

                readFile(pkgfile, function (err, body) {
                    if (err) cb(err);
                    try { var pkg = JSON.parse(body); } catch (jsonErr) {}

                    if (pkg && opts.packageFilter) {
                        pkg = opts.packageFilter(pkg, pkgfile);
                    }
                    cb(null, pkg, dir);
                });
            });
        });
    }

    function loadAsDirectory(x, loadAsDirectoryPackage, callback) {
        var cb = callback;
        var fpkg = loadAsDirectoryPackage;
        if (typeof fpkg === 'function') {
            cb = fpkg;
            fpkg = opts.package;
        }

        maybeUnwrapSymlink(x, opts, function (unwrapErr, pkgdir) {
            if (unwrapErr) return cb(unwrapErr);
            var pkgfile = path$1__default.join(pkgdir, 'package.json');
            isFile(pkgfile, function (err, ex) {
                if (err) return cb(err);
                if (!ex) return loadAsFile(path$1__default.join(x, 'index'), fpkg, cb);

                readFile(pkgfile, function (err, body) {
                    if (err) return cb(err);
                    try {
                        var pkg = JSON.parse(body);
                    } catch (jsonErr) {}

                    if (pkg && opts.packageFilter) {
                        pkg = opts.packageFilter(pkg, pkgfile);
                    }

                    if (pkg && pkg.main) {
                        if (typeof pkg.main !== 'string') {
                            var mainError = new TypeError('package “' + pkg.name + '” `main` must be a string');
                            mainError.code = 'INVALID_PACKAGE_MAIN';
                            return cb(mainError);
                        }
                        if (pkg.main === '.' || pkg.main === './') {
                            pkg.main = 'index';
                        }
                        loadAsFile(path$1__default.resolve(x, pkg.main), pkg, function (err, m, pkg) {
                            if (err) return cb(err);
                            if (m) return cb(null, m, pkg);
                            if (!pkg) return loadAsFile(path$1__default.join(x, 'index'), pkg, cb);

                            var dir = path$1__default.resolve(x, pkg.main);
                            loadAsDirectory(dir, pkg, function (err, n, pkg) {
                                if (err) return cb(err);
                                if (n) return cb(null, n, pkg);
                                loadAsFile(path$1__default.join(x, 'index'), pkg, cb);
                            });
                        });
                        return;
                    }

                    loadAsFile(path$1__default.join(x, '/index'), pkg, cb);
                });
            });
        });
    }

    function processDirs(cb, dirs) {
        if (dirs.length === 0) return cb(null, undefined);
        var dir = dirs[0];

        isDirectory(dir, isdir);

        function isdir(err, isdir) {
            if (err) return cb(err);
            if (!isdir) return processDirs(cb, dirs.slice(1));
            var file = path$1__default.join(dir, x);
            loadAsFile(file, opts.package, onfile);
        }

        function onfile(err, m, pkg) {
            if (err) return cb(err);
            if (m) return cb(null, m, pkg);
            loadAsDirectory(path$1__default.join(dir, x), opts.package, ondir);
        }

        function ondir(err, n, pkg) {
            if (err) return cb(err);
            if (n) return cb(null, n, pkg);
            processDirs(cb, dirs.slice(1));
        }
    }
    function loadNodeModules(x, start, cb) {
        processDirs(cb, nodeModulesPaths(start, opts, x));
    }
};

var defaultIsFile$1 = function isFile(file) {
    try {
        var stat = fs$1.statSync(file);
    } catch (e) {
        if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) return false;
        throw e;
    }
    return stat.isFile() || stat.isFIFO();
};

var defaultIsDir$1 = function isDirectory(dir) {
    try {
        var stat = fs$1.statSync(dir);
    } catch (e) {
        if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) return false;
        throw e;
    }
    return stat.isDirectory();
};

var maybeUnwrapSymlink$1 = function maybeUnwrapSymlink(x, opts) {
    if (opts && opts.preserveSymlinks === false) {
        try {
            return fs$1.realpathSync(x);
        } catch (realPathErr) {
            if (realPathErr.code !== 'ENOENT') {
                throw realPathErr;
            }
        }
    }
    return x;
};

var sync = function (x, options) {
    if (typeof x !== 'string') {
        throw new TypeError('Path must be a string.');
    }
    var opts = normalizeOptions(x, options);

    var isFile = opts.isFile || defaultIsFile$1;
    var readFileSync = opts.readFileSync || fs$1.readFileSync;
    var isDirectory = opts.isDirectory || defaultIsDir$1;

    var extensions = opts.extensions || ['.js'];
    var basedir = opts.basedir || path$1__default.dirname(caller());
    var parent = opts.filename || basedir;

    opts.paths = opts.paths || [];

    // ensure that `basedir` is an absolute path at this point, resolving against the process' current working directory
    var absoluteStart = maybeUnwrapSymlink$1(path$1__default.resolve(basedir), opts);

    if ((/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/).test(x)) {
        var res = path$1__default.resolve(absoluteStart, x);
        if (x === '..' || x.slice(-1) === '/') res += '/';
        var m = loadAsFileSync(res) || loadAsDirectorySync(res);
        if (m) return maybeUnwrapSymlink$1(m, opts);
    } else if (isCore(x)) {
        return x;
    } else {
        var n = loadNodeModulesSync(x, absoluteStart);
        if (n) return maybeUnwrapSymlink$1(n, opts);
    }

    if (isCore(x)) return x;

    var err = new Error("Cannot find module '" + x + "' from '" + parent + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;

    function loadAsFileSync(x) {
        var pkg = loadpkg(path$1__default.dirname(x));

        if (pkg && pkg.dir && pkg.pkg && opts.pathFilter) {
            var rfile = path$1__default.relative(pkg.dir, x);
            var r = opts.pathFilter(pkg.pkg, x, rfile);
            if (r) {
                x = path$1__default.resolve(pkg.dir, r); // eslint-disable-line no-param-reassign
            }
        }

        if (isFile(x)) {
            return x;
        }

        for (var i = 0; i < extensions.length; i++) {
            var file = x + extensions[i];
            if (isFile(file)) {
                return file;
            }
        }
    }

    function loadpkg(dir) {
        if (dir === '' || dir === '/') return;
        if (process.platform === 'win32' && (/^\w:[/\\]*$/).test(dir)) {
            return;
        }
        if ((/[/\\]node_modules[/\\]*$/).test(dir)) return;

        var pkgfile = path$1__default.join(maybeUnwrapSymlink$1(dir, opts), 'package.json');

        if (!isFile(pkgfile)) {
            return loadpkg(path$1__default.dirname(dir));
        }

        var body = readFileSync(pkgfile);

        try {
            var pkg = JSON.parse(body);
        } catch (jsonErr) {}

        if (pkg && opts.packageFilter) {
            // v2 will pass pkgfile
            pkg = opts.packageFilter(pkg, /*pkgfile,*/ dir); // eslint-disable-line spaced-comment
        }

        return { pkg: pkg, dir: dir };
    }

    function loadAsDirectorySync(x) {
        var pkgfile = path$1__default.join(maybeUnwrapSymlink$1(x, opts), '/package.json');
        if (isFile(pkgfile)) {
            try {
                var body = readFileSync(pkgfile, 'UTF8');
                var pkg = JSON.parse(body);
            } catch (e) {}

            if (pkg && opts.packageFilter) {
                // v2 will pass pkgfile
                pkg = opts.packageFilter(pkg, /*pkgfile,*/ x); // eslint-disable-line spaced-comment
            }

            if (pkg && pkg.main) {
                if (typeof pkg.main !== 'string') {
                    var mainError = new TypeError('package “' + pkg.name + '” `main` must be a string');
                    mainError.code = 'INVALID_PACKAGE_MAIN';
                    throw mainError;
                }
                if (pkg.main === '.' || pkg.main === './') {
                    pkg.main = 'index';
                }
                try {
                    var m = loadAsFileSync(path$1__default.resolve(x, pkg.main));
                    if (m) return m;
                    var n = loadAsDirectorySync(path$1__default.resolve(x, pkg.main));
                    if (n) return n;
                } catch (e) {}
            }
        }

        return loadAsFileSync(path$1__default.join(x, '/index'));
    }

    function loadNodeModulesSync(x, start) {
        var dirs = nodeModulesPaths(start, opts, x);
        for (var i = 0; i < dirs.length; i++) {
            var dir = dirs[i];
            if (isDirectory(dir)) {
                var m = loadAsFileSync(path$1__default.join(dir, '/', x));
                if (m) return m;
                var n = loadAsDirectorySync(path$1__default.join(dir, '/', x));
                if (n) return n;
            }
        }
    }
};

var resolve$1 = createCommonjsModule(function (module, exports) {
async.core = core_1;
async.isCore = isCore;
async.sync = sync;
module.exports = async;
});

const resolveModuleIdAsync = (sys, inMemoryFs, opts) => {
    const resolverOpts = createCustomResolverAsync(sys, inMemoryFs, opts.exts);
    resolverOpts.basedir = path$1.dirname(opts.containingFile);
    if (opts.packageFilter) {
        resolverOpts.packageFilter = opts.packageFilter;
    }
    else if (opts.packageFilter !== null) {
        resolverOpts.packageFilter = pkg => {
            if (!isString$2(pkg.main) || pkg.main === '') {
                pkg.main = 'package.json';
            }
            return pkg;
        };
    }
    return new Promise((resolvePromise, rejectPromise) => {
        resolve$1(opts.moduleId, resolverOpts, (err, resolveId, pkgData) => {
            if (err) {
                rejectPromise(err);
            }
            else {
                resolveId = normalizePath(resolveId);
                const results = {
                    moduleId: opts.moduleId,
                    resolveId,
                    pkgData,
                    pkgDirPath: getPackageDirPath(resolveId, opts.moduleId),
                };
                resolvePromise(results);
            }
        });
    });
};
const createCustomResolverAsync = (sys, inMemoryFs, exts) => {
    return {
        async isFile(filePath, cb) {
            const fsFilePath = normalizeFsPath(filePath);
            const stat = await inMemoryFs.stat(fsFilePath);
            if (stat.isFile) {
                cb(null, true);
                return;
            }
            if (shouldFetchModule(fsFilePath)) {
                const endsWithExt = exts.some(ext => fsFilePath.endsWith(ext));
                if (endsWithExt) {
                    const url = getNodeModuleFetchUrl(sys, packageVersions, fsFilePath);
                    const content = await fetchModuleAsync(sys, inMemoryFs, packageVersions, url, fsFilePath);
                    const checkFileExists = typeof content === 'string';
                    cb(null, checkFileExists);
                    return;
                }
            }
            cb(null, false);
        },
        async isDirectory(dirPath, cb) {
            const fsDirPath = normalizeFsPath(dirPath);
            const stat = await inMemoryFs.stat(fsDirPath);
            if (stat.isDirectory) {
                cb(null, true);
                return;
            }
            if (shouldFetchModule(fsDirPath)) {
                if (path$1.basename(fsDirPath) === 'node_modules') {
                    // just the /node_modules directory
                    inMemoryFs.sys.mkdirSync(fsDirPath);
                    inMemoryFs.clearFileCache(fsDirPath);
                    cb(null, true);
                    return;
                }
                if (isCommonDirModuleFile(fsDirPath)) {
                    // don't bother seeing if it's a directory if it has a common file extension
                    cb(null, false);
                    return;
                }
                for (const fileName of COMMON_DIR_FILENAMES) {
                    const url = getCommonDirUrl(sys, packageVersions, fsDirPath, fileName);
                    const filePath = getCommonDirName(fsDirPath, fileName);
                    const content = await fetchModuleAsync(sys, inMemoryFs, packageVersions, url, filePath);
                    if (isString$2(content)) {
                        cb(null, true);
                        return;
                    }
                }
            }
            cb(null, false);
        },
        async readFile(p, cb) {
            const fsFilePath = normalizeFsPath(p);
            const data = await inMemoryFs.readFile(fsFilePath);
            if (isString$2(data)) {
                return cb(null, data);
            }
            return cb(`readFile not found: ${p}`, undefined);
        },
        extensions: exts,
    };
};

const createSystem = () => {
    const items = new Map();
    const destroys = new Set();
    const addDestory = (cb) => destroys.add(cb);
    const removeDestory = (cb) => destroys.delete(cb);
    const events = buildEvents();
    const destroy = async () => {
        const waits = [];
        destroys.forEach(cb => {
            try {
                const rtn = cb();
                if (rtn && rtn.then) {
                    waits.push(rtn);
                }
            }
            catch (e) {
                console.error(`stencil sys destroy: ${e}`);
            }
        });
        await Promise.all(waits);
        destroys.clear();
    };
    const normalize = (p) => {
        if (p === '/' || p === '') {
            return '/';
        }
        const dir = path$1.dirname(p);
        const base = path$1.basename(p);
        if (dir.endsWith('/')) {
            return normalizePath(`${dir}${base}`);
        }
        return normalizePath(`${dir}/${base}`);
    };
    const accessSync = (p) => {
        const item = items.get(normalize(p));
        return !!(item && (item.isDirectory || item.isFile));
    };
    const access = async (p) => accessSync(p);
    const copyFile = async (src, dest) => {
        writeFileSync(dest, readFileSync(src));
        return true;
    };
    const encodeToBase64 = (str) => btoa(unescape(encodeURIComponent(str)));
    const getCurrentDirectory = () => {
        if (IS_NODE_ENV) {
            return global['process'].cwd();
        }
        return '/';
    };
    const getCompilerExecutingPath = () => {
        if (IS_NODE_ENV) {
            return __filename;
        }
        if (IS_WEB_WORKER_ENV) {
            return location.href;
        }
        throw new Error('unable to find executing path');
    };
    const isSymbolicLink = async (_p) => false;
    const mkdirSync = (p, opts) => {
        p = normalize(p);
        const results = {
            basename: path$1.basename(p),
            dirname: path$1.dirname(p),
            path: p,
            newDirs: [],
            error: null,
        };
        mkdirRecursiveSync(p, opts, results);
        return results;
    };
    const mkdirRecursiveSync = (p, opts, results) => {
        const parentDir = path$1.dirname(p);
        if (opts && opts.recursive && !isRootPath(parentDir)) {
            mkdirRecursiveSync(parentDir, opts, results);
        }
        const item = items.get(p);
        if (!item) {
            items.set(p, {
                basename: path$1.basename(p),
                dirname: parentDir,
                isDirectory: true,
                isFile: false,
                watcherCallbacks: null,
                data: undefined,
            });
            results.newDirs.push(p);
            emitDirectoryWatch(p, new Set());
        }
        else {
            item.isDirectory = true;
            item.isFile = false;
        }
    };
    const mkdir = async (p, opts) => mkdirSync(p, opts);
    const readdirSync = (p) => {
        p = normalize(p);
        const dirItems = [];
        const dir = items.get(p);
        if (dir && dir.isDirectory) {
            items.forEach((item, itemPath) => {
                if (itemPath !== '/') {
                    if (p.endsWith('/') && `${p}${item.basename}` === itemPath) {
                        dirItems.push(itemPath);
                    }
                    else if (`${p}/${item.basename}` === itemPath) {
                        dirItems.push(itemPath);
                    }
                }
            });
        }
        return dirItems.sort();
    };
    const readdir = async (p) => readdirSync(p);
    const readFileSync = (p) => {
        p = normalize(p);
        const item = items.get(p);
        if (item && item.isFile) {
            return item.data;
        }
        return undefined;
    };
    const readFile = async (p) => readFileSync(p);
    const realpathSync = (p) => normalize(p);
    const realpath = async (p) => realpathSync(p);
    const rename = async (oldPath, newPath) => {
        oldPath = normalizePath(oldPath);
        newPath = normalizePath(newPath);
        const results = {
            oldPath,
            newPath,
            renamed: [],
            oldDirs: [],
            oldFiles: [],
            newDirs: [],
            newFiles: [],
            isFile: false,
            isDirectory: false,
            error: null,
        };
        const stats = statSync(oldPath);
        if (stats) {
            if (stats.isFile()) {
                results.isFile = true;
            }
            else if (stats.isDirectory()) {
                results.isDirectory = true;
            }
            renameNewRecursiveSync(oldPath, newPath, results);
            if (!results.error) {
                if (results.isDirectory) {
                    const rmdirResults = rmdirSync(oldPath, { recursive: true });
                    if (rmdirResults.error) {
                        results.error = rmdirResults.error;
                    }
                    else {
                        results.oldDirs.push(...rmdirResults.removedDirs);
                        results.oldFiles.push(...rmdirResults.removedFiles);
                    }
                }
                else if (results.isFile) {
                    const unlinkResults = unlinkSync(oldPath);
                    if (unlinkResults.error) {
                        results.error = unlinkResults.error;
                    }
                    else {
                        results.oldFiles.push(oldPath);
                    }
                }
            }
        }
        else {
            results.error = `${oldPath} does not exist`;
        }
        return results;
    };
    const renameNewRecursiveSync = (oldPath, newPath, results) => {
        const itemStat = statSync(oldPath);
        if (itemStat && !results.error) {
            if (itemStat.isFile()) {
                const newFileParentDir = path$1.dirname(newPath);
                const mkdirResults = mkdirSync(newFileParentDir, { recursive: true });
                const fileContent = items.get(oldPath).data;
                const writeResults = writeFileSync(newPath, fileContent);
                results.newDirs.push(...mkdirResults.newDirs);
                results.renamed.push({
                    oldPath,
                    newPath,
                    isDirectory: false,
                    isFile: true,
                });
                if (writeResults.error) {
                    results.error = writeResults.error;
                }
                else {
                    results.newFiles.push(newPath);
                }
            }
            else if (itemStat.isDirectory()) {
                const oldDirItemChildPaths = readdirSync(oldPath);
                const mkdirResults = mkdirSync(newPath, { recursive: true });
                results.newDirs.push(...mkdirResults.newDirs);
                results.renamed.push({
                    oldPath,
                    newPath,
                    isDirectory: true,
                    isFile: false,
                });
                for (const oldDirItemChildPath of oldDirItemChildPaths) {
                    const newDirItemChildPath = oldDirItemChildPath.replace(oldPath, newPath);
                    renameNewRecursiveSync(oldDirItemChildPath, newDirItemChildPath, results);
                }
            }
        }
    };
    const resolvePath = (p) => normalize(p);
    const rmdirSync = (p, opts = {}) => {
        const results = {
            basename: path$1.basename(p),
            dirname: path$1.dirname(p),
            path: p,
            removedDirs: [],
            removedFiles: [],
            error: null,
        };
        rmdirSyncRecursive(p, opts, results);
        return results;
    };
    const rmdirSyncRecursive = (p, opts, results) => {
        if (!results.error) {
            p = normalize(p);
            const dirItemPaths = readdirSync(p);
            if (opts && opts.recursive) {
                for (const dirItemPath of dirItemPaths) {
                    const item = items.get(dirItemPath);
                    if (item) {
                        if (item.isDirectory) {
                            rmdirSyncRecursive(dirItemPath, opts, results);
                        }
                        else if (item.isFile) {
                            const unlinkResults = unlinkSync(dirItemPath);
                            if (unlinkResults.error) {
                                results.error = unlinkResults.error;
                            }
                            else {
                                results.removedFiles.push(dirItemPath);
                            }
                        }
                    }
                }
            }
            else {
                if (dirItemPaths.length > 0) {
                    results.error = `cannot delete directory that contains files/subdirectories`;
                    return;
                }
            }
            items.delete(p);
            emitDirectoryWatch(p, new Set());
            results.removedDirs.push(p);
        }
    };
    const rmdir = async (p, opts = {}) => rmdirSync(p, opts);
    const statSync = (p) => {
        p = normalize(p);
        const item = items.get(p);
        if (item && (item.isDirectory || item.isFile)) {
            const s = {
                isDirectory: () => item.isDirectory,
                isFile: () => item.isFile,
                isSymbolicLink: () => false,
                size: item.isFile ? item.data.length : 0,
            };
            return s;
        }
        return undefined;
    };
    const stat = async (p) => statSync(p);
    const unlinkSync = (p) => {
        p = normalize(p);
        const results = {
            basename: path$1.basename(p),
            dirname: path$1.dirname(p),
            path: p,
            error: null,
        };
        const item = items.get(p);
        if (item) {
            if (item.watcherCallbacks) {
                for (const watcherCallback of item.watcherCallbacks) {
                    watcherCallback(p, 'fileDelete');
                }
            }
            items.delete(p);
            emitDirectoryWatch(p, new Set());
        }
        return results;
    };
    const unlink = async (p) => unlinkSync(p);
    const watchDirectory = (p, dirWatcherCallback) => {
        p = normalize(p);
        const item = items.get(p);
        const close = () => {
            const closeItem = items.get(p);
            if (closeItem && closeItem.watcherCallbacks) {
                const index = closeItem.watcherCallbacks.indexOf(dirWatcherCallback);
                if (index > -1) {
                    closeItem.watcherCallbacks.splice(index, 1);
                }
            }
        };
        addDestory(close);
        if (item) {
            item.isDirectory = true;
            item.isFile = false;
            item.watcherCallbacks = item.watcherCallbacks || [];
            item.watcherCallbacks.push(dirWatcherCallback);
        }
        else {
            items.set(p, {
                basename: path$1.basename(p),
                dirname: path$1.dirname(p),
                isDirectory: true,
                isFile: false,
                watcherCallbacks: [dirWatcherCallback],
                data: undefined,
            });
        }
        return {
            close() {
                removeDestory(close);
                close();
            },
        };
    };
    const watchFile = (p, fileWatcherCallback) => {
        p = normalize(p);
        const item = items.get(p);
        const close = () => {
            const closeItem = items.get(p);
            if (closeItem && closeItem.watcherCallbacks) {
                const index = closeItem.watcherCallbacks.indexOf(fileWatcherCallback);
                if (index > -1) {
                    closeItem.watcherCallbacks.splice(index, 1);
                }
            }
        };
        addDestory(close);
        if (item) {
            item.isDirectory = false;
            item.isFile = true;
            item.watcherCallbacks = item.watcherCallbacks || [];
            item.watcherCallbacks.push(fileWatcherCallback);
        }
        else {
            items.set(p, {
                basename: path$1.basename(p),
                dirname: path$1.dirname(p),
                isDirectory: true,
                isFile: false,
                watcherCallbacks: [fileWatcherCallback],
                data: undefined,
            });
        }
        return {
            close() {
                removeDestory(close);
                close();
            },
        };
    };
    const emitDirectoryWatch = (p, emitted) => {
        const parentDir = normalize(path$1.dirname(p));
        const dirItem = items.get(parentDir);
        if (dirItem && dirItem.isDirectory && dirItem.watcherCallbacks) {
            for (const watcherCallback of dirItem.watcherCallbacks) {
                watcherCallback(p, null);
            }
        }
        if (!emitted.has(parentDir)) {
            emitted.add(parentDir);
            emitDirectoryWatch(parentDir, emitted);
        }
    };
    const writeFileSync = (p, data) => {
        p = normalize(p);
        const results = {
            path: p,
            error: null,
        };
        const item = items.get(p);
        if (item) {
            const hasChanged = item.data !== data;
            item.data = data;
            if (hasChanged && item.watcherCallbacks) {
                for (const watcherCallback of item.watcherCallbacks) {
                    watcherCallback(p, 'fileUpdate');
                }
            }
        }
        else {
            items.set(p, {
                basename: path$1.basename(p),
                dirname: path$1.dirname(p),
                isDirectory: false,
                isFile: true,
                watcherCallbacks: null,
                data,
            });
            emitDirectoryWatch(p, new Set());
        }
        return results;
    };
    const writeFile = async (p, data) => writeFileSync(p, data);
    const generateContentHash = async (content) => {
        const arrayBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(content));
        const hashArray = Array.from(new Uint8Array(arrayBuffer)); // convert buffer to byte array
        let hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
        if (typeof length === 'number') {
            hashHex = hashHex.substr(0, length);
        }
        return hashHex;
    };
    const copy = async (copyTasks, srcDir) => {
        const results = {
            diagnostics: [],
            dirPaths: [],
            filePaths: [],
        };
        console.log('todo, copy task', copyTasks.length, srcDir);
        return results;
    };
    const fileWatchTimeout = 32;
    mkdirSync('/');
    const sys = {
        events,
        access,
        accessSync,
        addDestory,
        copyFile,
        destroy,
        encodeToBase64,
        watchTimeout: fileWatchTimeout,
        getCurrentDirectory,
        getCompilerExecutingPath,
        isSymbolicLink,
        mkdir,
        mkdirSync,
        normalizePath: normalize,
        readdir,
        readdirSync,
        readFile,
        readFileSync,
        realpath,
        realpathSync,
        removeDestory,
        rename,
        resolvePath,
        rmdir,
        rmdirSync,
        stat,
        statSync,
        unlink,
        unlinkSync,
        watchDirectory,
        watchFile,
        writeFile,
        writeFileSync,
        generateContentHash,
        createWorkerController: HAS_WEB_WORKER ? createWebWorkerMainController : null,
        details: getDetails(),
        copy,
    };
    sys.resolveModuleId = opts => resolveModuleIdAsync(sys, null, opts);
    return sys;
};
const getDetails = () => {
    const details = {
        cpuModel: '',
        cpus: -1,
        freemem() {
            return 0;
        },
        platform: '',
        release: '',
        runtime: 'node',
        runtimeVersion: '',
        tmpDir: '/.tmp',
        totalmem: -1,
    };
    return details;
};

const createTestingSystem = () => {
    let diskReads = 0;
    let diskWrites = 0;
    const sys = createSystem();
    sys.generateContentHash = (content, length) => {
        let hash = crypto$2.createHash('sha1')
            .update(content)
            .digest('hex')
            .toLowerCase();
        if (typeof length === 'number') {
            hash = hash.substr(0, length);
        }
        return Promise.resolve(hash);
    };
    const wrapRead = (fn) => {
        const orgFn = fn;
        return (...args) => {
            diskReads++;
            return orgFn.apply(orgFn, args);
        };
    };
    const wrapWrite = (fn) => {
        const orgFn = fn;
        return (...args) => {
            diskWrites++;
            return orgFn.apply(orgFn, args);
        };
    };
    sys.access = wrapRead(sys.access);
    sys.accessSync = wrapRead(sys.accessSync);
    sys.readFile = wrapRead(sys.readFile);
    sys.readFileSync = wrapRead(sys.readFileSync);
    sys.readdir = wrapRead(sys.readdir);
    sys.readdirSync = wrapRead(sys.readdirSync);
    sys.stat = wrapRead(sys.stat);
    sys.statSync = wrapRead(sys.statSync);
    sys.copyFile = wrapWrite(sys.copyFile);
    sys.mkdir = wrapWrite(sys.mkdir);
    sys.mkdirSync = wrapWrite(sys.mkdirSync);
    sys.unlink = wrapWrite(sys.unlink);
    sys.unlinkSync = wrapWrite(sys.unlinkSync);
    sys.writeFile = wrapWrite(sys.writeFile);
    sys.writeFileSync = wrapWrite(sys.writeFileSync);
    return Object.defineProperties(sys, {
        diskReads: {
            get() {
                return diskReads;
            },
            set(val) {
                diskReads = val;
            },
        },
        diskWrites: {
            get() {
                return diskWrites;
            },
            set(val) {
                diskWrites = val;
            },
        },
    });
};

class TestingLogger {
    constructor() {
        this.colors = false;
        this.enable = false;
        this.buildLogFilePath = null;
    }
    info(...msg) {
        if (this.enable) {
            console.log.apply(console, msg);
        }
    }
    warn(...msg) {
        if (this.enable) {
            console.warn.apply(console, msg);
        }
    }
    error(...msg) {
        if (this.enable) {
            console.error.apply(console, msg);
        }
    }
    debug(...msg) {
        if (this.enable) {
            console.log.apply(console, msg);
        }
    }
    color(_msg, _color) {
        /* */
    }
    red(msg) {
        return msg;
    }
    green(msg) {
        return msg;
    }
    yellow(msg) {
        return msg;
    }
    blue(msg) {
        return msg;
    }
    magenta(msg) {
        return msg;
    }
    cyan(msg) {
        return msg;
    }
    gray(msg) {
        return msg;
    }
    bold(msg) {
        return msg;
    }
    dim(msg) {
        return msg;
    }
    bgRed(msg) {
        return msg;
    }
    createTimeSpan(_startMsg, _debug = false) {
        return {
            duration() {
                return 0;
            },
            finish() {
                return 0;
            },
        };
    }
    printDiagnostics(_diagnostics) {
        /* */
    }
    writeLogs(_) {
        /**/
    }
}

function mockConfig(sys) {
    if (!sys) {
        sys = createTestingSystem();
    }
    const rootDir = path$1__default.resolve('/');
    const config = {
        _isTesting: true,
        namespace: 'Testing',
        rootDir: rootDir,
        cwd: rootDir,
        globalScript: null,
        devMode: true,
        enableCache: false,
        buildAppCore: false,
        buildDist: true,
        flags: {},
        bundles: null,
        outputTargets: null,
        buildEs5: false,
        hashFileNames: false,
        logger: new TestingLogger(),
        maxConcurrentWorkers: 0,
        minifyCss: false,
        minifyJs: false,
        sys,
        testing: null,
        validateTypes: false,
        extras: {},
        nodeResolve: {
            customResolveOptions: {},
        },
    };
    return config;
}
function mockCompilerCtx(config) {
    const compilerCtx = {
        version: 1,
        activeBuildId: 0,
        activeDirsAdded: [],
        activeDirsDeleted: [],
        activeFilesAdded: [],
        activeFilesDeleted: [],
        activeFilesUpdated: [],
        fs: null,
        cachedGlobalStyle: null,
        collections: [],
        compilerOptions: null,
        cache: null,
        cachedStyleMeta: new Map(),
        events: null,
        fsWatcher: null,
        hasSuccessfulBuild: false,
        isActivelyBuilding: false,
        lastComponentStyleInput: new Map(),
        lastBuildResults: null,
        lastBuildStyles: null,
        moduleMap: new Map(),
        nodeMap: new WeakMap(),
        resolvedCollections: new Set(),
        rollupCacheHydrate: null,
        rollupCacheLazy: null,
        rollupCacheNative: null,
        rollupCache: new Map(),
        rootTsFiles: [],
        styleModeNames: new Set(),
        tsService: null,
        changedModules: new Set(),
        changedFiles: new Set(),
        reset: () => {
            /**/
        },
        worker: stencil_js.createWorkerContext(),
    };
    Object.defineProperty(compilerCtx, 'fs', {
        get() {
            if (this._fs == null) {
                this._fs = createInMemoryFs(config.sys);
            }
            return this._fs;
        },
    });
    Object.defineProperty(compilerCtx, 'cache', {
        get() {
            if (this._cache == null) {
                this._cache = mockCache(config, compilerCtx);
            }
            return this._cache;
        },
    });
    return compilerCtx;
}
function mockBuildCtx(config, compilerCtx) {
    if (!config) {
        config = mockConfig();
    }
    if (!compilerCtx) {
        compilerCtx = mockCompilerCtx(config);
    }
    const buildCtx = new BuildContext(config, compilerCtx);
    return buildCtx;
}
function mockCache(config, compilerCtx) {
    if (!config) {
        config = mockConfig();
    }
    if (!compilerCtx) {
        compilerCtx = mockCompilerCtx(config);
    }
    config.enableCache = true;
    const cache = new Cache(config, compilerCtx.fs);
    cache.initCacheDir();
    return cache;
}
function mockLogger() {
    return new TestingLogger();
}
function mockStencilSystem() {
    return createTestingSystem();
}
function mockDocument(html = null) {
    const win = new index_js$1.MockWindow(html);
    return win.document;
}
function mockWindow(html = null) {
    const win = new index_js$1.MockWindow(html);
    return win;
}

const getBuildFeatures = (cmps) => {
    const slot = cmps.some(c => c.htmlTagNames.includes('slot'));
    const shadowDom = cmps.some(c => c.encapsulation === 'shadow');
    const slotRelocation = cmps.some(c => c.encapsulation !== 'shadow' && c.htmlTagNames.includes('slot'));
    const f = {
        allRenderFn: cmps.every(c => c.hasRenderFn),
        cmpDidLoad: cmps.some(c => c.hasComponentDidLoadFn),
        cmpShouldUpdate: cmps.some(c => c.hasComponentShouldUpdateFn),
        cmpDidUnload: cmps.some(c => c.hasComponentDidUnloadFn),
        cmpDidUpdate: cmps.some(c => c.hasComponentDidUpdateFn),
        cmpDidRender: cmps.some(c => c.hasComponentDidRenderFn),
        cmpWillLoad: cmps.some(c => c.hasComponentWillLoadFn),
        cmpWillUpdate: cmps.some(c => c.hasComponentWillUpdateFn),
        cmpWillRender: cmps.some(c => c.hasComponentWillRenderFn),
        connectedCallback: cmps.some(c => c.hasConnectedCallbackFn),
        disconnectedCallback: cmps.some(c => c.hasDisconnectedCallbackFn),
        element: cmps.some(c => c.hasElement),
        event: cmps.some(c => c.hasEvent),
        hasRenderFn: cmps.some(c => c.hasRenderFn),
        lifecycle: cmps.some(c => c.hasLifecycle),
        asyncLoading: false,
        hostListener: cmps.some(c => c.hasListener),
        hostListenerTargetWindow: cmps.some(c => c.hasListenerTargetWindow),
        hostListenerTargetDocument: cmps.some(c => c.hasListenerTargetDocument),
        hostListenerTargetBody: cmps.some(c => c.hasListenerTargetBody),
        hostListenerTargetParent: cmps.some(c => c.hasListenerTargetParent),
        hostListenerTarget: cmps.some(c => c.hasListenerTarget),
        member: cmps.some(c => c.hasMember),
        method: cmps.some(c => c.hasMethod),
        mode: cmps.some(c => c.hasMode),
        observeAttribute: cmps.some(c => c.hasAttribute),
        prop: cmps.some(c => c.hasProp),
        propBoolean: cmps.some(c => c.hasPropBoolean),
        propNumber: cmps.some(c => c.hasPropNumber),
        propString: cmps.some(c => c.hasPropString),
        propMutable: cmps.some(c => c.hasPropMutable),
        reflect: cmps.some(c => c.hasReflect),
        scoped: cmps.some(c => c.encapsulation === 'scoped'),
        shadowDom,
        shadowDelegatesFocus: shadowDom && cmps.some(c => c.shadowDelegatesFocus),
        slot,
        slotRelocation,
        state: cmps.some(c => c.hasState),
        style: cmps.some(c => c.hasStyle),
        svg: cmps.some(c => c.htmlTagNames.includes('svg')),
        updatable: cmps.some(c => c.isUpdateable),
        vdomAttribute: cmps.some(c => c.hasVdomAttribute),
        vdomXlink: cmps.some(c => c.hasVdomXlink),
        vdomClass: cmps.some(c => c.hasVdomClass),
        vdomFunctional: cmps.some(c => c.hasVdomFunctional),
        vdomKey: cmps.some(c => c.hasVdomKey),
        vdomListener: cmps.some(c => c.hasVdomListener),
        vdomPropOrAttr: cmps.some(c => c.hasVdomPropOrAttr),
        vdomRef: cmps.some(c => c.hasVdomRef),
        vdomRender: cmps.some(c => c.hasVdomRender),
        vdomStyle: cmps.some(c => c.hasVdomStyle),
        vdomText: cmps.some(c => c.hasVdomText),
        watchCallback: cmps.some(c => c.hasWatchCallback),
        taskQueue: true,
    };
    f.asyncLoading = f.cmpWillUpdate || f.cmpWillLoad || f.cmpWillRender;
    f.vdomAttribute = f.vdomAttribute || f.reflect;
    f.vdomPropOrAttr = f.vdomPropOrAttr || f.reflect;
    return f;
};

async function newSpecPage(opts) {
    if (opts == null) {
        throw new Error(`NewSpecPageOptions required`);
    }
    // reset the platform for this new test
    testing.resetPlatform();
    resetBuildConditionals(appData.BUILD);
    testing.registerContext(opts.context);
    if (Array.isArray(opts.components)) {
        testing.registerComponents(opts.components);
    }
    if (opts.hydrateClientSide) {
        opts.includeAnnotations = true;
    }
    if (opts.hydrateServerSide) {
        opts.includeAnnotations = true;
        testing.setSupportsShadowDom(false);
    }
    else {
        opts.includeAnnotations = !!opts.includeAnnotations;
        if (opts.supportsShadowDom === false) {
            testing.setSupportsShadowDom(false);
        }
        else {
            testing.setSupportsShadowDom(true);
        }
    }
    appData.BUILD.cssAnnotations = opts.includeAnnotations;
    const cmpTags = new Set();
    testing.win['__stencil_spec_options'] = opts;
    const doc = testing.win.document;
    const page = {
        win: testing.win,
        doc: doc,
        body: doc.body,
        build: appData.BUILD,
        styles: testing.styles,
        setContent: html => {
            doc.body.innerHTML = html;
            return testing.flushAll();
        },
        waitForChanges: testing.flushAll,
        flushLoadModule: testing.flushLoadModule,
        flushQueue: testing.flushQueue,
    };
    const lazyBundles = opts.components.map((Cstr) => {
        if (Cstr.COMPILER_META == null) {
            throw new Error(`Invalid component class: Missing static "COMPILER_META" property.`);
        }
        cmpTags.add(Cstr.COMPILER_META.tagName);
        Cstr.isProxied = false;
        proxyComponentLifeCycles(Cstr);
        const textBundleId = `${Cstr.COMPILER_META.tagName}.${(Math.round(Math.random() * 899999) + 100000)}`;
        const stylesMeta = Cstr.COMPILER_META.styles;
        let bundleId = textBundleId;
        if (Array.isArray(stylesMeta)) {
            stylesMeta.forEach(style => {
                testing.styles.set(style.styleId, style.styleStr);
            });
            if (stylesMeta.length > 1) {
                bundleId = {};
                stylesMeta.forEach(style => {
                    bundleId[style.styleId] = textBundleId;
                });
            }
        }
        testing.registerModule(bundleId, Cstr);
        const lazyBundleRuntimeMeta = formatLazyBundleRuntimeMeta(bundleId, [Cstr.COMPILER_META]);
        return lazyBundleRuntimeMeta;
    });
    const cmpCompilerMeta = opts.components.map(Cstr => Cstr.COMPILER_META);
    const cmpBuild = getBuildFeatures(cmpCompilerMeta);
    if (opts.strictBuild) {
        Object.assign(appData.BUILD, cmpBuild);
    }
    else {
        Object.keys(cmpBuild).forEach(key => {
            if (cmpBuild[key] === true) {
                appData.BUILD[key] = true;
            }
        });
    }
    appData.BUILD.asyncLoading = true;
    if (opts.hydrateClientSide) {
        appData.BUILD.hydrateClientSide = true;
        appData.BUILD.hydrateServerSide = false;
    }
    else if (opts.hydrateServerSide) {
        appData.BUILD.hydrateServerSide = true;
        appData.BUILD.hydrateClientSide = false;
    }
    appData.BUILD.cloneNodeFix = false;
    appData.BUILD.shadowDomShim = false;
    appData.BUILD.safari10 = false;
    page.flush = () => {
        console.warn(`DEPRECATED: page.flush(), please use page.waitForChanges() instead`);
        return page.waitForChanges();
    };
    if (typeof opts.url === 'string') {
        page.win.location.href = opts.url;
    }
    if (typeof opts.direction === 'string') {
        page.doc.documentElement.setAttribute('dir', opts.direction);
    }
    if (typeof opts.language === 'string') {
        page.doc.documentElement.setAttribute('lang', opts.language);
    }
    if (typeof opts.cookie === 'string') {
        try {
            page.doc.cookie = opts.cookie;
        }
        catch (e) { }
    }
    if (typeof opts.referrer === 'string') {
        try {
            page.doc.referrer = opts.referrer;
        }
        catch (e) { }
    }
    if (typeof opts.userAgent === 'string') {
        try {
            page.win.navigator.userAgent = opts.userAgent;
        }
        catch (e) { }
    }
    testing.bootstrapLazy(lazyBundles);
    if (typeof opts.template === 'function') {
        const cmpMeta = {
            $flags$: 0,
            $tagName$: 'body',
        };
        const ref = {
            $ancestorComponent$: undefined,
            $flags$: 0,
            $modeName$: undefined,
            $cmpMeta$: cmpMeta,
            $hostElement$: page.body,
        };
        testing.renderVdom(ref, opts.template());
    }
    else if (typeof opts.html === 'string') {
        page.body.innerHTML = opts.html;
    }
    if (opts.flushQueue !== false) {
        await page.waitForChanges();
    }
    let rootComponent = null;
    Object.defineProperty(page, 'root', {
        get() {
            if (rootComponent == null) {
                rootComponent = findRootComponent(cmpTags, page.body);
            }
            if (rootComponent != null) {
                return rootComponent;
            }
            const firstElementChild = page.body.firstElementChild;
            if (firstElementChild != null) {
                return firstElementChild;
            }
            return null;
        },
    });
    Object.defineProperty(page, 'rootInstance', {
        get() {
            const hostRef = testing.getHostRef(page.root);
            if (hostRef != null) {
                return hostRef.$lazyInstance$;
            }
            return null;
        },
    });
    if (opts.hydrateServerSide) {
        testing.insertVdomAnnotations(doc);
    }
    if (opts.autoApplyChanges) {
        testing.startAutoApplyChanges();
        page.waitForChanges = () => {
            console.error('waitForChanges() cannot be used manually if the "startAutoApplyChanges" option is enabled');
            return Promise.resolve();
        };
    }
    return page;
}
function proxyComponentLifeCycles(Cstr) {
    if (typeof Cstr.prototype.__componentWillLoad === 'function') {
        Cstr.prototype.componentWillLoad = Cstr.prototype.__componentWillLoad;
        Cstr.prototype.__componentWillLoad = null;
    }
    if (typeof Cstr.prototype.__componentWillUpdate === 'function') {
        Cstr.prototype.componentWillUpdate = Cstr.prototype.__componentWillUpdate;
        Cstr.prototype.__componentWillUpdate = null;
    }
    if (typeof Cstr.prototype.__componentWillRender === 'function') {
        Cstr.prototype.componentWillRender = Cstr.prototype.__componentWillRender;
        Cstr.prototype.__componentWillRender = null;
    }
    if (typeof Cstr.prototype.componentWillLoad === 'function') {
        Cstr.prototype.__componentWillLoad = Cstr.prototype.componentWillLoad;
        Cstr.prototype.componentWillLoad = function () {
            const result = this.__componentWillLoad();
            if (result != null && typeof result.then === 'function') {
                testing.writeTask(() => result);
            }
            else {
                testing.writeTask(() => Promise.resolve());
            }
            return result;
        };
    }
    if (typeof Cstr.prototype.componentWillUpdate === 'function') {
        Cstr.prototype.__componentWillUpdate = Cstr.prototype.componentWillUpdate;
        Cstr.prototype.componentWillUpdate = function () {
            const result = this.__componentWillUpdate();
            if (result != null && typeof result.then === 'function') {
                testing.writeTask(() => result);
            }
            else {
                testing.writeTask(() => Promise.resolve());
            }
            return result;
        };
    }
    if (typeof Cstr.prototype.componentWillRender === 'function') {
        Cstr.prototype.__componentWillRender = Cstr.prototype.componentWillRender;
        Cstr.prototype.componentWillRender = function () {
            const result = this.__componentWillRender();
            if (result != null && typeof result.then === 'function') {
                testing.writeTask(() => result);
            }
            else {
                testing.writeTask(() => Promise.resolve());
            }
            return result;
        };
    }
}
function findRootComponent(cmpTags, node) {
    if (node != null) {
        const children = node.children;
        const childrenLength = children.length;
        for (let i = 0; i < childrenLength; i++) {
            const elm = children[i];
            if (cmpTags.has(elm.nodeName.toLowerCase())) {
                return elm;
            }
        }
        for (let i = 0; i < childrenLength; i++) {
            const r = findRootComponent(cmpTags, children[i]);
            if (r != null) {
                return r;
            }
        }
    }
    return null;
}

async function initPageEvents(page) {
    page._e2eEvents = new Map();
    page._e2eEventIds = 0;
    page.spyOnEvent = pageSpyOnEvent.bind(page, page);
    await page.exposeFunction('stencilOnEvent', (id, ev) => {
        // NODE CONTEXT
        nodeContextEvents(page._e2eEvents, id, ev);
    });
    await page.evaluateOnNewDocument(browserContextEvents);
}
async function pageSpyOnEvent(page, eventName, selector) {
    const eventSpy = new EventSpy(eventName);
    const handler = selector !== 'document' ? () => window : () => document;
    const handle = await page.evaluateHandle(handler);
    await addE2EListener(page, handle, eventName, ev => {
        eventSpy.push(ev);
    });
    return eventSpy;
}
async function waitForEvent(page, eventName, elementHandle) {
    const timeoutMs = jasmine.DEFAULT_TIMEOUT_INTERVAL * 0.5;
    const ev = await page.evaluate((element, eventName, timeoutMs) => {
        return new Promise((resolve, reject) => {
            const tmr = setTimeout(() => {
                reject(new Error(`waitForEvent() timeout, eventName: ${eventName}`));
            }, timeoutMs);
            element.addEventListener(eventName, ev => {
                clearTimeout(tmr);
                resolve(window.stencilSerializeEvent(ev));
            }, { once: true });
        });
    }, elementHandle, eventName, timeoutMs);
    await page.waitForChanges();
    return ev;
}
class EventSpy {
    constructor(eventName) {
        this.eventName = eventName;
        this.events = [];
        this.cursor = 0;
        this.queuedHandler = [];
    }
    get length() {
        return this.events.length;
    }
    get firstEvent() {
        return this.events[0] || null;
    }
    get lastEvent() {
        return this.events[this.events.length - 1] || null;
    }
    next() {
        const cursor = this.cursor;
        this.cursor++;
        const next = this.events[cursor];
        if (next) {
            return Promise.resolve({
                done: false,
                value: next,
            });
        }
        else {
            let resolve;
            const promise = new Promise(r => (resolve = r));
            this.queuedHandler.push(resolve);
            return promise.then(() => ({
                done: false,
                value: this.events[cursor],
            }));
        }
    }
    push(ev) {
        this.events.push(ev);
        const next = this.queuedHandler.shift();
        if (next) {
            next();
        }
    }
}
async function addE2EListener(page, elmHandle, eventName, callback) {
    // NODE CONTEXT
    const id = page._e2eEventIds++;
    page._e2eEvents.set(id, {
        eventName,
        callback,
    });
    const executionContext = elmHandle.executionContext();
    // add element event listener
    await executionContext.evaluate((elm, id, eventName) => {
        elm.addEventListener(eventName, (ev) => {
            window.stencilOnEvent(id, window.stencilSerializeEvent(ev));
        });
    }, elmHandle, id, eventName);
}
function nodeContextEvents(waitForEvents, eventId, ev) {
    // NODE CONTEXT
    const waitForEventData = waitForEvents.get(eventId);
    if (waitForEventData) {
        waitForEventData.callback(ev);
    }
}
function browserContextEvents() {
    // BROWSER CONTEXT
    const waitFrame = () => {
        return new Promise(resolve => {
            requestAnimationFrame(resolve);
        });
    };
    const allReady = () => {
        const promises = [];
        const waitForDidLoad = (promises, elm) => {
            if (elm != null && elm.nodeType === 1) {
                for (let i = 0; i < elm.children.length; i++) {
                    const childElm = elm.children[i];
                    if (childElm.tagName.includes('-') && typeof childElm.componentOnReady === 'function') {
                        promises.push(childElm.componentOnReady());
                    }
                    waitForDidLoad(promises, childElm);
                }
            }
        };
        waitForDidLoad(promises, window.document.documentElement);
        return Promise.all(promises).catch(e => console.error(e));
    };
    const stencilReady = () => {
        return allReady()
            .then(() => waitFrame())
            .then(() => allReady())
            .then(() => {
            window.stencilAppLoaded = true;
        });
    };
    window.stencilSerializeEventTarget = (target) => {
        // BROWSER CONTEXT
        if (!target) {
            return null;
        }
        if (target === window) {
            return { serializedWindow: true };
        }
        if (target === document) {
            return { serializedDocument: true };
        }
        if (target.nodeType != null) {
            const serializedElement = {
                serializedElement: true,
                nodeName: target.nodeName,
                nodeValue: target.nodeValue,
                nodeType: target.nodeType,
                tagName: target.tagName,
                className: target.className,
                id: target.id,
            };
            return serializedElement;
        }
        return null;
    };
    window.stencilSerializeEvent = (orgEv) => {
        // BROWSER CONTEXT
        const serializedEvent = {
            bubbles: orgEv.bubbles,
            cancelBubble: orgEv.cancelBubble,
            cancelable: orgEv.cancelable,
            composed: orgEv.composed,
            currentTarget: window.stencilSerializeEventTarget(orgEv.currentTarget),
            defaultPrevented: orgEv.defaultPrevented,
            detail: orgEv.detail,
            eventPhase: orgEv.eventPhase,
            isTrusted: orgEv.isTrusted,
            returnValue: orgEv.returnValue,
            srcElement: window.stencilSerializeEventTarget(orgEv.srcElement),
            target: window.stencilSerializeEventTarget(orgEv.target),
            timeStamp: orgEv.timeStamp,
            type: orgEv.type,
            isSerializedEvent: true,
        };
        return serializedEvent;
    };
    if (window.document.readyState === 'complete') {
        stencilReady();
    }
    else {
        window.addEventListener('load', stencilReady);
    }
}

class E2EElement extends index_js$1.MockHTMLElement {
    constructor(_page, _elmHandle) {
        super(null, null);
        this._page = _page;
        this._elmHandle = _elmHandle;
        this._queuedActions = [];
        _page._e2eElements.push(this);
    }
    _queueAction(action) {
        this._queuedActions.push(action);
    }
    find(selector) {
        return find(this._page, this._elmHandle, selector);
    }
    findAll(selector) {
        return findAll(this._page, this._elmHandle, selector);
    }
    callMethod(methodName, ...methodArgs) {
        this._queueAction({
            methodName: methodName,
            methodArgs: methodArgs,
        });
        return this.e2eRunActions();
    }
    triggerEvent(eventName, eventInitDict) {
        this._queueAction({
            eventName: eventName,
            eventInitDict: eventInitDict,
        });
    }
    async spyOnEvent(eventName) {
        const eventSpy = new EventSpy(eventName);
        await addE2EListener(this._page, this._elmHandle, eventName, (ev) => {
            eventSpy.push(ev);
        });
        return eventSpy;
    }
    async click(options) {
        await this._elmHandle.click(options);
        await this._page.waitForChanges();
    }
    async focus() {
        await this._elmHandle.focus();
        await this._page.waitForChanges();
    }
    async hover() {
        await this._elmHandle.hover();
        await this._page.waitForChanges();
    }
    async isVisible() {
        this._validate();
        let isVisible = false;
        try {
            const executionContext = this._elmHandle.executionContext();
            isVisible = await executionContext.evaluate((elm) => {
                return new Promise(resolve => {
                    window.requestAnimationFrame(() => {
                        if (elm.isConnected) {
                            const style = window.getComputedStyle(elm);
                            const isVisible = !!style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
                            if (isVisible) {
                                window.requestAnimationFrame(() => {
                                    elm.clientWidth;
                                    resolve(true);
                                });
                            }
                            else {
                                resolve(false);
                            }
                        }
                        else {
                            resolve(false);
                        }
                    });
                });
            }, this._elmHandle);
        }
        catch (e) { }
        return isVisible;
    }
    waitForEvent(eventName) {
        return waitForEvent(this._page, eventName, this._elmHandle);
    }
    waitForVisible() {
        return new Promise((resolve, reject) => {
            const checkVisible = async () => {
                const isVisible = await this.isVisible();
                if (isVisible) {
                    clearInterval(resolveTmr);
                    clearTimeout(rejectTmr);
                    resolve();
                }
            };
            const resolveTmr = setInterval(checkVisible, 10);
            const timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL * 0.5;
            const timeoutError = new Error(`waitForVisible timed out: ${timeout}ms`);
            const rejectTmr = setTimeout(() => {
                clearTimeout(resolveTmr);
                reject(timeoutError);
            }, timeout);
        });
    }
    waitForNotVisible() {
        return new Promise((resolve, reject) => {
            const checkVisible = async () => {
                const isVisible = await this.isVisible();
                if (!isVisible) {
                    clearInterval(resolveTmr);
                    clearTimeout(rejectTmr);
                    resolve();
                }
            };
            const resolveTmr = setInterval(checkVisible, 10);
            const timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL * 0.5;
            const timeoutError = new Error(`waitForNotVisible timed out: ${timeout}ms`);
            const rejectTmr = setTimeout(() => {
                clearTimeout(resolveTmr);
                reject(timeoutError);
            }, timeout);
        });
    }
    isIntersectingViewport() {
        return this._elmHandle.isIntersectingViewport();
    }
    async press(key, options) {
        await this._elmHandle.press(key, options);
        await this._page.waitForChanges();
    }
    async tap() {
        await this._elmHandle.tap();
        await this._page.waitForChanges();
    }
    async type(text, options) {
        await this._elmHandle.type(text, options);
        await this._page.waitForChanges();
    }
    async getProperty(propertyName) {
        this._validate();
        const executionContext = this._elmHandle.executionContext();
        const propValue = await executionContext.evaluate((elm, propertyName) => {
            return elm[propertyName];
        }, this._elmHandle, propertyName);
        return propValue;
    }
    setProperty(propertyName, value) {
        this._queueAction({
            setPropertyName: propertyName,
            setPropertyValue: value,
        });
    }
    getAttribute(name) {
        this._validate();
        return super.getAttribute(name);
    }
    setAttribute(name, value) {
        this._queueAction({
            setAttributeName: name,
            setAttributeValue: value,
        });
    }
    removeAttribute(name) {
        this._queueAction({
            removeAttribute: name,
        });
    }
    toggleAttribute(name, force) {
        this._queueAction({
            toggleAttributeName: name,
            toggleAttributeForce: force,
        });
    }
    get classList() {
        const api = {
            add: (...classNames) => {
                classNames.forEach(className => {
                    this._queueAction({
                        classAdd: className,
                    });
                });
            },
            remove: (...classNames) => {
                classNames.forEach(className => {
                    this._queueAction({
                        classRemove: className,
                    });
                });
            },
            toggle: (className) => {
                this._queueAction({
                    classToggle: className,
                });
            },
            contains: (className) => {
                this._validate();
                return super.className.split(' ').includes(className);
            },
        };
        return api;
    }
    get className() {
        this._validate();
        return super.className;
    }
    set className(value) {
        this._queueAction({
            setPropertyName: 'className',
            setPropertyValue: value,
        });
    }
    get id() {
        this._validate();
        return super.id;
    }
    set id(value) {
        this._queueAction({
            setPropertyName: 'id',
            setPropertyValue: value,
        });
    }
    get innerHTML() {
        this._validate();
        return super.innerHTML;
    }
    set innerHTML(value) {
        this._queueAction({
            setPropertyName: 'innerHTML',
            setPropertyValue: value,
        });
    }
    get innerText() {
        this._validate();
        return super.innerText;
    }
    set innerText(value) {
        this._queueAction({
            setPropertyName: 'innerText',
            setPropertyValue: value,
        });
    }
    get nodeValue() {
        this._validate();
        return super.nodeValue;
    }
    set nodeValue(value) {
        if (typeof value === 'string') {
            this._queueAction({
                setPropertyName: 'nodeValue',
                setPropertyValue: value,
            });
        }
    }
    get outerHTML() {
        this._validate();
        return super.outerHTML;
    }
    set outerHTML(_) {
        throw new Error(`outerHTML is read-only`);
    }
    get shadowRoot() {
        this._validate();
        return super.shadowRoot;
    }
    set shadowRoot(value) {
        super.shadowRoot = value;
    }
    get tabIndex() {
        this._validate();
        return super.tabIndex;
    }
    set tabIndex(value) {
        this._queueAction({
            setPropertyName: 'tabIndex',
            setPropertyValue: value,
        });
    }
    get textContent() {
        this._validate();
        return super.textContent;
    }
    set textContent(value) {
        this._queueAction({
            setPropertyName: 'textContent',
            setPropertyValue: value,
        });
    }
    get title() {
        this._validate();
        return super.title;
    }
    set title(value) {
        this._queueAction({
            setPropertyName: 'title',
            setPropertyValue: value,
        });
    }
    async getComputedStyle(pseudoElt) {
        const style = await this._page.evaluate((elm, pseudoElt) => {
            const rtn = {};
            const computedStyle = window.getComputedStyle(elm, pseudoElt);
            const keys = Object.keys(computedStyle);
            keys.forEach(key => {
                if (isNaN(key)) {
                    const value = computedStyle[key];
                    if (value != null) {
                        rtn[key] = value;
                    }
                }
                else {
                    const dashProp = computedStyle[key];
                    if (dashProp.includes('-')) {
                        const value = computedStyle.getPropertyValue(dashProp);
                        if (value != null) {
                            rtn[dashProp] = value;
                        }
                    }
                }
            });
            return rtn;
        }, this._elmHandle, pseudoElt);
        style.getPropertyValue = (propName) => {
            return style[propName];
        };
        return style;
    }
    async e2eRunActions() {
        if (this._queuedActions.length === 0) {
            return;
        }
        const executionContext = this._elmHandle.executionContext();
        const rtn = await executionContext.evaluate((elm, queuedActions) => {
            // BROWSER CONTEXT
            // cannot use async/await in here cuz typescript transpiles it in the node context
            return elm.componentOnReady().then(() => {
                let rtn = null;
                queuedActions.forEach(queuedAction => {
                    if (queuedAction.methodName) {
                        rtn = elm[queuedAction.methodName].apply(elm, queuedAction.methodArgs);
                    }
                    else if (queuedAction.setPropertyName) {
                        elm[queuedAction.setPropertyName] = queuedAction.setPropertyValue;
                    }
                    else if (queuedAction.setAttributeName) {
                        elm.setAttribute(queuedAction.setAttributeName, queuedAction.setAttributeValue);
                    }
                    else if (queuedAction.removeAttribute) {
                        elm.removeAttribute(queuedAction.removeAttribute);
                    }
                    else if (queuedAction.toggleAttributeName) {
                        if (typeof queuedAction.toggleAttributeForce === 'boolean') {
                            elm.toggleAttribute(queuedAction.toggleAttributeName, queuedAction.toggleAttributeForce);
                        }
                        else {
                            elm.toggleAttribute(queuedAction.toggleAttributeName);
                        }
                    }
                    else if (queuedAction.classAdd) {
                        elm.classList.add(queuedAction.classAdd);
                    }
                    else if (queuedAction.classRemove) {
                        elm.classList.remove(queuedAction.classRemove);
                    }
                    else if (queuedAction.classToggle) {
                        elm.classList.toggle(queuedAction.classToggle);
                    }
                    else if (queuedAction.eventName) {
                        const eventInitDict = queuedAction.eventInitDict || {};
                        if (typeof eventInitDict.bubbles !== 'boolean') {
                            eventInitDict.bubbles = true;
                        }
                        if (typeof eventInitDict.cancelable !== 'boolean') {
                            eventInitDict.cancelable = true;
                        }
                        if (typeof eventInitDict.composed !== 'boolean') {
                            eventInitDict.composed = true;
                        }
                        const ev = new CustomEvent(queuedAction.eventName, eventInitDict);
                        elm.dispatchEvent(ev);
                    }
                });
                if (rtn && typeof rtn.then === 'function') {
                    return rtn.then((value) => {
                        return value;
                    });
                }
                return rtn;
            });
        }, this._elmHandle, this._queuedActions);
        this._queuedActions.length = 0;
        return rtn;
    }
    async e2eSync() {
        const executionContext = this._elmHandle.executionContext();
        const { outerHTML, shadowRootHTML } = await executionContext.evaluate((elm) => {
            return {
                outerHTML: elm.outerHTML,
                shadowRootHTML: elm.shadowRoot ? elm.shadowRoot.innerHTML : null,
            };
        }, this._elmHandle);
        if (typeof shadowRootHTML === 'string') {
            this.shadowRoot = index_js$1.parseHtmlToFragment(shadowRootHTML);
            this.shadowRoot.host = this;
        }
        else {
            this.shadowRoot = null;
        }
        const frag = index_js$1.parseHtmlToFragment(outerHTML);
        const rootElm = frag.firstElementChild;
        this.nodeName = rootElm.nodeName;
        this.attributes = index_js$1.cloneAttributes(rootElm.attributes);
        while (this.childNodes.length > 0) {
            this.removeChild(this.childNodes[0]);
        }
        while (rootElm.childNodes.length > 0) {
            this.appendChild(rootElm.childNodes[0]);
        }
    }
    _validate() {
        if (this._queuedActions.length > 0) {
            throw new Error(`await page.waitForChanges() must be called before reading element information`);
        }
    }
    async e2eDispose() {
        if (this._elmHandle) {
            await this._elmHandle.dispose();
            this._elmHandle = null;
        }
        const index = this._page._e2eElements.indexOf(this);
        if (index > -1) {
            this._page._e2eElements.splice(index, 1);
        }
        this._page = null;
    }
}
async function find(page, rootHandle, selector) {
    const { lightSelector, shadowSelector, text, contains } = getSelector(selector);
    let elmHandle;
    if (typeof lightSelector === 'string') {
        elmHandle = await findWithCssSelector(page, rootHandle, lightSelector, shadowSelector);
    }
    else {
        elmHandle = await findWithText(page, rootHandle, text, contains);
    }
    if (!elmHandle) {
        return null;
    }
    const elm = new E2EElement(page, elmHandle);
    await elm.e2eSync();
    return elm;
}
async function findWithCssSelector(page, rootHandle, lightSelector, shadowSelector) {
    let elmHandle = await rootHandle.$(lightSelector);
    if (!elmHandle) {
        return null;
    }
    if (shadowSelector) {
        const shadowHandle = await page.evaluateHandle((elm, shadowSelector) => {
            if (!elm.shadowRoot) {
                throw new Error(`shadow root does not exist for element: ${elm.tagName.toLowerCase()}`);
            }
            return elm.shadowRoot.querySelector(shadowSelector);
        }, elmHandle, shadowSelector);
        await elmHandle.dispose();
        if (!shadowHandle) {
            return null;
        }
        elmHandle = shadowHandle.asElement();
    }
    return elmHandle;
}
async function findWithText(page, rootHandle, text, contains) {
    const jsHandle = await page.evaluateHandle((rootElm, text, contains) => {
        let foundElm = null;
        function checkContent(elm) {
            if (!elm || foundElm) {
                return;
            }
            if (elm.nodeType === 3) {
                if (typeof text === 'string' && elm.textContent.trim() === text) {
                    foundElm = elm.parentElement;
                    return;
                }
                if (typeof contains === 'string' && elm.textContent.includes(contains)) {
                    foundElm = elm.parentElement;
                    return;
                }
            }
            else {
                if (elm.nodeName === 'SCRIPT' || elm.nodeName === 'STYLE') {
                    return;
                }
                checkContent(elm.shadowRoot);
                if (elm.childNodes) {
                    for (let i = 0; i < elm.childNodes.length; i++) {
                        checkContent(elm.childNodes[i]);
                    }
                }
            }
        }
        checkContent(rootElm);
        return foundElm;
    }, rootHandle, text, contains);
    if (jsHandle) {
        return jsHandle.asElement();
    }
    return null;
}
async function findAll(page, rootHandle, selector) {
    const foundElms = [];
    const { lightSelector, shadowSelector } = getSelector(selector);
    const lightElmHandles = await rootHandle.$$(lightSelector);
    if (lightElmHandles.length === 0) {
        return foundElms;
    }
    if (shadowSelector) {
        // light dom selected, then shadow dom selected inside of light dom elements
        for (let i = 0; i < lightElmHandles.length; i++) {
            const executionContext = lightElmHandles[i].executionContext();
            const shadowJsHandle = await executionContext.evaluateHandle((elm, shadowSelector) => {
                if (!elm.shadowRoot) {
                    throw new Error(`shadow root does not exist for element: ${elm.tagName.toLowerCase()}`);
                }
                return elm.shadowRoot.querySelectorAll(shadowSelector);
            }, lightElmHandles[i], shadowSelector);
            await lightElmHandles[i].dispose();
            const shadowJsProperties = await shadowJsHandle.getProperties();
            await shadowJsHandle.dispose();
            for (const shadowJsProperty of shadowJsProperties.values()) {
                const shadowElmHandle = shadowJsProperty.asElement();
                if (shadowElmHandle) {
                    const elm = new E2EElement(page, shadowElmHandle);
                    await elm.e2eSync();
                    foundElms.push(elm);
                }
            }
        }
    }
    else {
        // light dom only
        for (let i = 0; i < lightElmHandles.length; i++) {
            const elm = new E2EElement(page, lightElmHandles[i]);
            await elm.e2eSync();
            foundElms.push(elm);
        }
    }
    return foundElms;
}
function getSelector(selector) {
    const rtn = {
        lightSelector: null,
        shadowSelector: null,
        text: null,
        contains: null,
    };
    if (typeof selector === 'string') {
        const splt = selector.split('>>>');
        rtn.lightSelector = splt[0].trim();
        rtn.shadowSelector = splt.length > 1 ? splt[1].trim() : null;
    }
    else if (typeof selector.text === 'string') {
        rtn.text = selector.text.trim();
    }
    else if (typeof selector.contains === 'string') {
        rtn.contains = selector.contains.trim();
    }
    else {
        throw new Error(`invalid find selector: ${selector}`);
    }
    return rtn;
}

async function writeScreenshotImage(imagePath, screenshotBuf) {
    const imageExists = await fileExists(imagePath);
    if (!imageExists) {
        await writeFile(imagePath, screenshotBuf);
    }
}
async function writeScreenshotData(dataDir, screenshotData) {
    const filePath = getDataFilePath(dataDir, screenshotData.id);
    const content = JSON.stringify(screenshotData, null, 2);
    await writeFile(filePath, content);
}
function getDataFilePath(dataDir, screenshotId) {
    const fileName = `${screenshotId}.json`;
    return path$1__default.join(dataDir, fileName);
}
function fileExists(filePath) {
    return new Promise(resolve => {
        fs$1.access(filePath, (err) => resolve(!err));
    });
}
function writeFile(filePath, data) {
    return new Promise((resolve, reject) => {
        fs$1.writeFile(filePath, data, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}

async function compareScreenshot(emulateConfig, screenshotBuildData, currentScreenshotBuf, desc, width, height, testPath, pixelmatchThreshold) {
    const currentImageHash = crypto$2.createHash('md5')
        .update(currentScreenshotBuf)
        .digest('hex');
    const currentImageName = `${currentImageHash}.png`;
    const currentImagePath = path$1.join(screenshotBuildData.imagesDir, currentImageName);
    await writeScreenshotImage(currentImagePath, currentScreenshotBuf);
    currentScreenshotBuf = null;
    if (testPath) {
        testPath = normalizePath(path$1.relative(screenshotBuildData.rootDir, testPath));
    }
    // create the data we'll be saving as json
    // the "id" is what we use as a key to compare to sets of data
    // the "image" is a hash of the image file name
    // and what we can use to quickly see if they're identical or not
    const screenshotId = getScreenshotId(emulateConfig, desc);
    const screenshot = {
        id: screenshotId,
        image: currentImageName,
        device: emulateConfig.device,
        userAgent: emulateConfig.userAgent,
        desc: desc,
        testPath: testPath,
        width: width,
        height: height,
        deviceScaleFactor: emulateConfig.viewport.deviceScaleFactor,
        hasTouch: emulateConfig.viewport.hasTouch,
        isLandscape: emulateConfig.viewport.isLandscape,
        isMobile: emulateConfig.viewport.isMobile,
        diff: {
            id: screenshotId,
            desc: desc,
            imageA: currentImageName,
            imageB: currentImageName,
            mismatchedPixels: 0,
            device: emulateConfig.device,
            userAgent: emulateConfig.userAgent,
            width: width,
            height: height,
            deviceScaleFactor: emulateConfig.viewport.deviceScaleFactor,
            hasTouch: emulateConfig.viewport.hasTouch,
            isLandscape: emulateConfig.viewport.isLandscape,
            isMobile: emulateConfig.viewport.isMobile,
            allowableMismatchedPixels: screenshotBuildData.allowableMismatchedPixels,
            allowableMismatchedRatio: screenshotBuildData.allowableMismatchedRatio,
            testPath: testPath,
        },
    };
    if (screenshotBuildData.updateMaster) {
        // this data is going to become the master data
        // so no need to compare with previous versions
        await writeScreenshotData(screenshotBuildData.currentBuildDir, screenshot);
        return screenshot.diff;
    }
    const masterScreenshotImage = screenshotBuildData.masterScreenshots[screenshot.id];
    if (!masterScreenshotImage) {
        // didn't find a master screenshot to compare it to
        await writeScreenshotData(screenshotBuildData.currentBuildDir, screenshot);
        return screenshot.diff;
    }
    // set that the master data image as the image we're going to compare the current image to
    // imageB is already set as the current image
    screenshot.diff.imageA = masterScreenshotImage;
    // compare only if the image hashes are different
    if (screenshot.diff.imageA !== screenshot.diff.imageB) {
        // we know the images are not identical since they have different hashes
        // create a cache key from the two hashes
        screenshot.diff.cacheKey = getCacheKey(screenshot.diff.imageA, screenshot.diff.imageB, pixelmatchThreshold);
        // let's see if we've already calculated the mismatched pixels already
        const cachedMismatchedPixels = screenshotBuildData.cache[screenshot.diff.cacheKey];
        if (typeof cachedMismatchedPixels === 'number' && !isNaN(cachedMismatchedPixels)) {
            // awesome, we've got cached data so we
            // can skip having to do the heavy pixelmatch comparison
            screenshot.diff.mismatchedPixels = cachedMismatchedPixels;
        }
        else {
            // images are not identical
            // and we don't have any cached data so let's
            // compare the two images pixel by pixel to
            // figure out a mismatch value
            // figure out the actual width and height of the screenshot
            const naturalWidth = Math.round(emulateConfig.viewport.width * emulateConfig.viewport.deviceScaleFactor);
            const naturalHeight = Math.round(emulateConfig.viewport.height * emulateConfig.viewport.deviceScaleFactor);
            const pixelMatchInput = {
                imageAPath: path$1.join(screenshotBuildData.imagesDir, screenshot.diff.imageA),
                imageBPath: path$1.join(screenshotBuildData.imagesDir, screenshot.diff.imageB),
                width: naturalWidth,
                height: naturalHeight,
                pixelmatchThreshold: pixelmatchThreshold,
            };
            screenshot.diff.mismatchedPixels = await getMismatchedPixels(screenshotBuildData.pixelmatchModulePath, pixelMatchInput);
        }
    }
    await writeScreenshotData(screenshotBuildData.currentBuildDir, screenshot);
    return screenshot.diff;
}
async function getMismatchedPixels(pixelmatchModulePath, pixelMatchInput) {
    return new Promise((resolve, reject) => {
        const timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL * 0.5;
        const tmr = setTimeout(() => {
            reject(`getMismatchedPixels timeout: ${timeout}ms`);
        }, timeout);
        try {
            const filteredExecArgs = process.execArgv.filter(v => !/^--(debug|inspect)/.test(v));
            const options = {
                execArgv: filteredExecArgs,
                env: process.env,
                cwd: process.cwd(),
                stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
            };
            const pixelMatchProcess = child_process$1.fork(pixelmatchModulePath, [], options);
            pixelMatchProcess.on('message', (data) => {
                pixelMatchProcess.kill();
                clearTimeout(tmr);
                resolve(data);
            });
            pixelMatchProcess.on('error', err => {
                clearTimeout(tmr);
                reject(err);
            });
            pixelMatchProcess.send(pixelMatchInput);
        }
        catch (e) {
            clearTimeout(tmr);
            reject(`getMismatchedPixels error: ${e}`);
        }
    });
}
function getCacheKey(imageA, imageB, pixelmatchThreshold) {
    const hash = crypto$2.createHash('md5');
    hash.update(`${imageA}:${imageB}:${pixelmatchThreshold}`);
    return hash.digest('hex').substr(0, 10);
}
function getScreenshotId(emulateConfig, uniqueDescription) {
    if (typeof uniqueDescription !== 'string' || uniqueDescription.trim().length === 0) {
        throw new Error(`invalid test description`);
    }
    const hash = crypto$2.createHash('md5');
    hash.update(uniqueDescription + ':');
    hash.update(emulateConfig.userAgent + ':');
    hash.update(emulateConfig.viewport.width + ':');
    hash.update(emulateConfig.viewport.height + ':');
    hash.update(emulateConfig.viewport.deviceScaleFactor + ':');
    hash.update(emulateConfig.viewport.hasTouch + ':');
    hash.update(emulateConfig.viewport.isMobile + ':');
    return hash
        .digest('hex')
        .substr(0, 8)
        .toLowerCase();
}

function initPageScreenshot(page) {
    const env = process.env;
    if (env.__STENCIL_SCREENSHOT__ === 'true') {
        page.compareScreenshot = (a, b) => {
            const jestEnv = global;
            let desc = '';
            let testPath = '';
            if (jestEnv.currentSpec) {
                if (typeof jestEnv.currentSpec.fullName === 'string') {
                    desc = jestEnv.currentSpec.fullName;
                }
                if (typeof jestEnv.currentSpec.testPath === 'string') {
                    testPath = jestEnv.currentSpec.testPath;
                }
            }
            let opts;
            if (typeof a === 'string') {
                if (desc.length > 0) {
                    desc += ', ' + a;
                }
                else {
                    desc = a;
                }
                if (typeof b === 'object') {
                    opts = b;
                }
            }
            else if (typeof a === 'object') {
                opts = a;
            }
            desc = desc.trim();
            opts = opts || {};
            if (!desc) {
                throw new Error(`Invalid screenshot description in "${testPath}"`);
            }
            if (jestEnv.screenshotDescriptions.has(desc)) {
                throw new Error(`Screenshot description "${desc}" found in "${testPath}" cannot be used for multiple screenshots and must be unique. To make screenshot descriptions unique within the same test, use the first argument to "compareScreenshot", such as "compareScreenshot('more to the description')".`);
            }
            jestEnv.screenshotDescriptions.add(desc);
            return pageCompareScreenshot(page, env, desc, testPath, opts);
        };
    }
    else {
        // screen shot not enabled, so just skip over all the logic
        page.compareScreenshot = async () => {
            const diff = {
                mismatchedPixels: 0,
                allowableMismatchedPixels: 1,
                allowableMismatchedRatio: 1,
                desc: '',
                width: 1,
                height: 1,
                deviceScaleFactor: 1,
            };
            return diff;
        };
    }
}
async function pageCompareScreenshot(page, env, desc, testPath, opts) {
    if (typeof env.__STENCIL_EMULATE__ !== 'string') {
        throw new Error(`compareScreenshot, missing screenshot emulate env var`);
    }
    if (typeof env.__STENCIL_SCREENSHOT_BUILD__ !== 'string') {
        throw new Error(`compareScreenshot, missing screen build env var`);
    }
    const emulateConfig = JSON.parse(env.__STENCIL_EMULATE__);
    const screenshotBuildData = JSON.parse(env.__STENCIL_SCREENSHOT_BUILD__);
    await wait(screenshotBuildData.timeoutBeforeScreenshot);
    await page.evaluate(() => {
        return new Promise(resolve => {
            window.requestAnimationFrame(() => {
                resolve();
            });
        });
    });
    const screenshotOpts = createPuppeteerScreenshopOptions(opts);
    const screenshotBuf = await page.screenshot(screenshotOpts);
    const pixelmatchThreshold = typeof opts.pixelmatchThreshold === 'number' ? opts.pixelmatchThreshold : screenshotBuildData.pixelmatchThreshold;
    let width = emulateConfig.viewport.width;
    let height = emulateConfig.viewport.height;
    if (opts && opts.clip) {
        if (typeof opts.clip.width === 'number') {
            width = opts.clip.width;
        }
        if (typeof opts.clip.height === 'number') {
            height = opts.clip.height;
        }
    }
    const results = await compareScreenshot(emulateConfig, screenshotBuildData, screenshotBuf, desc, width, height, testPath, pixelmatchThreshold);
    return results;
}
function createPuppeteerScreenshopOptions(opts) {
    const puppeteerOpts = {
        type: 'png',
        fullPage: opts.fullPage,
        omitBackground: opts.omitBackground,
        encoding: 'binary',
    };
    if (opts.clip) {
        puppeteerOpts.clip = {
            x: opts.clip.x,
            y: opts.clip.y,
            width: opts.clip.width,
            height: opts.clip.height,
        };
    }
    return puppeteerOpts;
}
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const env = process.env;
async function newE2EPage(opts = {}) {
    if (!global.__NEW_TEST_PAGE__) {
        throw new Error(`newE2EPage() is only available from E2E tests, and ran with the --e2e cmd line flag.`);
    }
    const page = await global.__NEW_TEST_PAGE__();
    const diagnostics = [];
    try {
        page._e2eElements = [];
        page._e2eGoto = page.goto;
        page._e2eClose = page.close;
        await setPageEmulate(page);
        await page.setCacheEnabled(false);
        await initPageEvents(page);
        initPageScreenshot(page);
        let docPromise = null;
        page.close = async (options) => {
            try {
                if (Array.isArray(page._e2eElements)) {
                    const disposes = page._e2eElements.map(async (elmHande) => {
                        if (typeof elmHande.e2eDispose === 'function') {
                            await elmHande.e2eDispose();
                        }
                    });
                    await Promise.all(disposes);
                }
            }
            catch (e) { }
            const noop = () => {
                throw new Error('The page was already closed');
            };
            page._e2eElements = noop;
            page._e2eEvents = noop;
            page._e2eGoto = noop;
            page.find = noop;
            page.debugger = noop;
            page.findAll = noop;
            page.compareScreenshot = noop;
            page.setContent = noop;
            page.spyOnEvent = noop;
            page.waitForChanges = noop;
            page.waitForEvent = noop;
            try {
                if (!page.isClosed()) {
                    await page._e2eClose(options);
                }
            }
            catch (e) { }
        };
        const getDocHandle = async () => {
            if (!docPromise) {
                docPromise = page.evaluateHandle(() => document);
            }
            const documentJsHandle = await docPromise;
            return documentJsHandle.asElement();
        };
        page.find = async (selector) => {
            const docHandle = await getDocHandle();
            return find(page, docHandle, selector);
        };
        page.findAll = async (selector) => {
            const docHandle = await getDocHandle();
            return findAll(page, docHandle, selector);
        };
        page.waitForEvent = async (eventName) => {
            const docHandle = await getDocHandle();
            return waitForEvent(page, eventName, docHandle);
        };
        page.getDiagnostics = () => {
            return diagnostics;
        };
        page.waitForChanges = waitForChanges.bind(null, page);
        page.debugger = () => {
            if (env.__STENCIL_E2E_DEVTOOLS__ !== 'true') {
                throw new Error('Set the --devtools flag in order to use E2EPage.debugger()');
            }
            return page.evaluate(() => {
                return new Promise(resolve => {
                    // tslint:disable-next-line: no-debugger
                    debugger;
                    resolve();
                });
            });
        };
        const failOnConsoleError = opts.failOnConsoleError === true;
        const failOnNetworkError = opts.failOnNetworkError === true;
        page.on('console', ev => {
            if (ev.type() === 'error') {
                diagnostics.push({
                    type: 'error',
                    message: ev.text(),
                    location: ev.location().url,
                });
                if (failOnConsoleError) {
                    fail(new Error(serializeConsoleMessage(ev)));
                }
            }
            consoleMessage(ev);
        });
        page.on('pageerror', (err) => {
            diagnostics.push({
                type: 'pageerror',
                message: err.message,
                location: err.stack,
            });
            fail(err);
        });
        page.on('requestfailed', req => {
            diagnostics.push({
                type: 'requestfailed',
                message: req.failure().errorText,
                location: req.url(),
            });
            if (failOnNetworkError) {
                fail(new Error(req.failure().errorText));
            }
            else {
                console.error('requestfailed', req.url());
            }
        });
        if (typeof opts.html === 'string') {
            await e2eSetContent(page, opts.html, { waitUntil: opts.waitUntil });
        }
        else if (typeof opts.url === 'string') {
            await e2eGoTo(page, opts.url, { waitUntil: opts.waitUntil });
        }
        else {
            page.goto = e2eGoTo.bind(null, page);
            page.setContent = e2eSetContent.bind(null, page);
        }
    }
    catch (e) {
        if (page) {
            if (!page.isClosed()) {
                await page.close();
            }
        }
        throw e;
    }
    return page;
}
async function e2eGoTo(page, url, options = {}) {
    if (page.isClosed()) {
        throw new Error('e2eGoTo unavailable: page already closed');
    }
    if (typeof url !== 'string') {
        throw new Error('invalid gotoTest() url');
    }
    if (!url.startsWith('/')) {
        throw new Error('gotoTest() url must start with /');
    }
    const browserUrl = env.__STENCIL_BROWSER_URL__;
    if (typeof browserUrl !== 'string') {
        throw new Error('invalid gotoTest() browser url');
    }
    const fullUrl = browserUrl + url.substring(1);
    if (!options.waitUntil) {
        options.waitUntil = env.__STENCIL_BROWSER_WAIT_UNTIL;
    }
    const rsp = await page._e2eGoto(fullUrl, options);
    if (!rsp.ok()) {
        throw new Error(`Testing unable to load ${url}, HTTP status: ${rsp.status()}`);
    }
    await waitForStencil(page);
    return rsp;
}
async function e2eSetContent(page, html, options = {}) {
    if (page.isClosed()) {
        throw new Error('e2eSetContent unavailable: page already closed');
    }
    if (typeof html !== 'string') {
        throw new Error('invalid e2eSetContent() html');
    }
    const output = [];
    const appScriptUrl = env.__STENCIL_APP_SCRIPT_URL__;
    if (typeof appScriptUrl !== 'string') {
        throw new Error('invalid e2eSetContent() app script url');
    }
    output.push(`<!doctype html>`);
    output.push(`<html>`);
    output.push(`<head>`);
    const appStyleUrl = env.__STENCIL_APP_STYLE_URL__;
    if (typeof appStyleUrl === 'string') {
        output.push(`<link rel="stylesheet" href="${appStyleUrl}">`);
    }
    output.push(`<script type="module" src="${appScriptUrl}"></script>`);
    output.push(`</head>`);
    output.push(`<body>`);
    output.push(html);
    output.push(`</body>`);
    output.push(`</html>`);
    const pageUrl = env.__STENCIL_BROWSER_URL__;
    await page.setRequestInterception(true);
    page.on('request', interceptedRequest => {
        if (pageUrl === interceptedRequest.url()) {
            interceptedRequest.respond({
                status: 200,
                contentType: 'text/html',
                body: output.join('\n'),
            });
        }
        else {
            interceptedRequest.continue();
        }
    });
    if (!options.waitUntil) {
        options.waitUntil = env.__STENCIL_BROWSER_WAIT_UNTIL;
    }
    const rsp = await page._e2eGoto(pageUrl, options);
    if (!rsp.ok()) {
        throw new Error(`Testing unable to load content`);
    }
    await waitForStencil(page);
    return rsp;
}
async function waitForStencil(page) {
    try {
        await page.waitForFunction('window.stencilAppLoaded', { timeout: 4750 });
    }
    catch (e) {
        throw new Error(`App did not load in allowed time. Please ensure the content loads a stencil application.`);
    }
}
async function setPageEmulate(page) {
    if (page.isClosed()) {
        return;
    }
    const emulateJsonContent = env.__STENCIL_EMULATE__;
    if (!emulateJsonContent) {
        return;
    }
    const screenshotEmulate = JSON.parse(emulateJsonContent);
    const emulateOptions = {
        viewport: screenshotEmulate.viewport,
        userAgent: screenshotEmulate.userAgent,
    };
    await page.emulate(emulateOptions);
}
async function waitForChanges(page) {
    try {
        if (page.isClosed()) {
            return;
        }
        await Promise.all(page._e2eElements.map(elm => elm.e2eRunActions()));
        if (page.isClosed()) {
            return;
        }
        await page.evaluate(() => {
            // BROWSER CONTEXT
            return new Promise(resolve => {
                requestAnimationFrame(() => {
                    const promises = [];
                    const waitComponentOnReady = (elm, promises) => {
                        if (elm != null) {
                            const children = elm.children;
                            const len = children.length;
                            for (let i = 0; i < len; i++) {
                                const childElm = children[i];
                                if (childElm != null) {
                                    if (childElm.tagName.includes('-') && typeof childElm.componentOnReady === 'function') {
                                        promises.push(childElm.componentOnReady());
                                    }
                                    waitComponentOnReady(childElm, promises);
                                }
                            }
                        }
                    };
                    waitComponentOnReady(document.documentElement, promises);
                    Promise.all(promises)
                        .then(() => {
                        resolve();
                    })
                        .catch(() => {
                        resolve();
                    });
                });
            });
        });
        if (page.isClosed()) {
            return;
        }
        await page.waitFor(100);
        await Promise.all(page._e2eElements.map(elm => elm.e2eSync()));
    }
    catch (e) { }
}
function consoleMessage(c) {
    const msg = serializeConsoleMessage(c);
    const type = c.type();
    const normalizedType = type === 'warning' ? 'warn' : type;
    if (normalizedType === 'debug') {
        // Skip debug messages
        return;
    }
    if (typeof console[normalizedType] === 'function') {
        console[normalizedType](msg);
    }
    else {
        console.log(type, msg);
    }
}
function serializeConsoleMessage(c) {
    return `${c.text()} ${serializeLocation(c.location())}`;
}
function serializeLocation(loc) {
    let locStr = '';
    if (loc && loc.url) {
        locStr = `\nLocation: ${loc.url}`;
        if (loc.lineNumber) {
            locStr += `:${loc.lineNumber}`;
        }
        if (loc.columnNumber) {
            locStr += `:${loc.columnNumber}`;
        }
    }
    return locStr;
}

if (typeof URL === 'undefined') {
    // polyfill global URL for Node version < 10.0.0
    global.URL = url$1.URL;
}

Object.defineProperty(exports, 'MockHeaders', {
    enumerable: true,
    get: function () {
        return index_js$1.MockHeaders;
    }
});
Object.defineProperty(exports, 'MockRequest', {
    enumerable: true,
    get: function () {
        return index_js$1.MockRequest;
    }
});
Object.defineProperty(exports, 'MockResponse', {
    enumerable: true,
    get: function () {
        return index_js$1.MockResponse;
    }
});
exports.createJestPuppeteerEnvironment = createJestPuppeteerEnvironment;
exports.createTestRunner = createTestRunner;
exports.createTesting = createTesting;
exports.jestPreprocessor = jestPreprocessor;
exports.jestSetupTestFramework = jestSetupTestFramework;
exports.mockBuildCtx = mockBuildCtx;
exports.mockCompilerCtx = mockCompilerCtx;
exports.mockConfig = mockConfig;
exports.mockDocument = mockDocument;
exports.mockFetch = mockFetch;
exports.mockLogger = mockLogger;
exports.mockStencilSystem = mockStencilSystem;
exports.mockWindow = mockWindow;
exports.newE2EPage = newE2EPage;
exports.newSpecPage = newSpecPage;
exports.shuffleArray = shuffleArray;
exports.transpile = transpile;
