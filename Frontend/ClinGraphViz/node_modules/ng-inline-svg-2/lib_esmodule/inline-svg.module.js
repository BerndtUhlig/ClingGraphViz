import { NgModule } from '@angular/core';
import { InlineSVGComponent } from './inline-svg.component';
import { InlineSVGConfig } from './inline-svg.config';
import { InlineSVGDirective } from './inline-svg.directive';
import * as i0 from "@angular/core";
var InlineSVGModule = (function () {
    function InlineSVGModule() {
    }
    InlineSVGModule.forRoot = function (config) {
        return {
            ngModule: InlineSVGModule,
            providers: [
                { provide: InlineSVGConfig, useValue: config }
            ]
        };
    };
    InlineSVGModule.ɵfac = function InlineSVGModule_Factory(t) { return new (t || InlineSVGModule)(); };
    InlineSVGModule.ɵmod = i0.ɵɵdefineNgModule({ type: InlineSVGModule });
    InlineSVGModule.ɵinj = i0.ɵɵdefineInjector({});
    return InlineSVGModule;
}());
export { InlineSVGModule };
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(InlineSVGModule, [{
        type: NgModule,
        args: [{
                declarations: [InlineSVGDirective, InlineSVGComponent],
                exports: [InlineSVGDirective],
                entryComponents: [InlineSVGComponent]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(InlineSVGModule, { declarations: [InlineSVGDirective, InlineSVGComponent], exports: [InlineSVGDirective] }); })();
