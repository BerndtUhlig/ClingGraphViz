import { ModuleWithProviders } from '@angular/core';
import { InlineSVGConfig } from './inline-svg.config';
import * as i0 from "@angular/core";
import * as i1 from "./inline-svg.directive";
import * as i2 from "./inline-svg.component";
export declare class InlineSVGModule {
    static forRoot(config?: InlineSVGConfig): ModuleWithProviders<InlineSVGModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<InlineSVGModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<InlineSVGModule, [typeof i1.InlineSVGDirective, typeof i2.InlineSVGComponent], never, [typeof i1.InlineSVGDirective]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<InlineSVGModule>;
}
