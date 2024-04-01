"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineSVGModule = void 0;
var core_1 = require("@angular/core");
var inline_svg_component_1 = require("./inline-svg.component");
var inline_svg_config_1 = require("./inline-svg.config");
var inline_svg_directive_1 = require("./inline-svg.directive");
var i0 = require("@angular/core");
var InlineSVGModule = (function () {
    function InlineSVGModule() {
    }
    InlineSVGModule.forRoot = function (config) {
        return {
            ngModule: InlineSVGModule,
            providers: [
                { provide: inline_svg_config_1.InlineSVGConfig, useValue: config }
            ]
        };
    };
    InlineSVGModule.ɵfac = function InlineSVGModule_Factory(t) { return new (t || InlineSVGModule)(); };
    InlineSVGModule.ɵmod = i0.ɵɵdefineNgModule({ type: InlineSVGModule });
    InlineSVGModule.ɵinj = i0.ɵɵdefineInjector({});
    return InlineSVGModule;
}());
exports.InlineSVGModule = InlineSVGModule;
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(InlineSVGModule, [{
        type: core_1.NgModule,
        args: [{
                declarations: [inline_svg_directive_1.InlineSVGDirective, inline_svg_component_1.InlineSVGComponent],
                exports: [inline_svg_directive_1.InlineSVGDirective],
                entryComponents: [inline_svg_component_1.InlineSVGComponent]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(InlineSVGModule, { declarations: [inline_svg_directive_1.InlineSVGDirective, inline_svg_component_1.InlineSVGComponent], exports: [inline_svg_directive_1.InlineSVGDirective] }); })();
