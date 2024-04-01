import { PlatformLocation } from '@angular/common';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { RendererFactory2 } from '@angular/core';
import { Observable } from 'rxjs';
import { InlineSVGConfig } from './inline-svg.config';
import * as i0 from "@angular/core";
export declare class SVGCacheService {
    private _appBase;
    private _location;
    private _config;
    private static _cache;
    private static _inProgressReqs;
    private _baseUrl;
    private _http;
    private _renderer;
    constructor(_appBase: string, _location: PlatformLocation, _config: InlineSVGConfig, httpClient: HttpClient, httpBackend: HttpBackend, rendererFactory: RendererFactory2);
    getSVG(url: string, resolveSVGUrl: boolean, cache?: boolean): Observable<SVGElement>;
    setBaseUrl(): void;
    getAbsoluteUrl(url: string): string;
    private _svgElementFromString;
    private _cloneSVG;
    static ɵfac: i0.ɵɵFactoryDeclaration<SVGCacheService, [{ optional: true; }, { optional: true; }, { optional: true; }, null, null, null]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SVGCacheService>;
}
