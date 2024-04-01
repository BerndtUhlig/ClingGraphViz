import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional, RendererFactory2 } from '@angular/core';
import { of, throwError } from 'rxjs';
import { catchError, map, share, tap } from 'rxjs/operators';
import { InlineSVGConfig } from './inline-svg.config';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "./inline-svg.config";
import * as i3 from "@angular/common/http";
var SVGCacheService = (function () {
    function SVGCacheService(_appBase, _location, _config, httpClient, httpBackend, rendererFactory) {
        this._appBase = _appBase;
        this._location = _location;
        this._config = _config;
        this._http = _config && !_config.bypassHttpClientInterceptorChain
            ? httpClient
            : new HttpClient(httpBackend);
        this._renderer = rendererFactory.createRenderer(null, null);
        this.setBaseUrl();
        if (!SVGCacheService._cache) {
            SVGCacheService._cache = new Map();
        }
        if (!SVGCacheService._inProgressReqs) {
            SVGCacheService._inProgressReqs = new Map();
        }
    }
    SVGCacheService.prototype.getSVG = function (url, resolveSVGUrl, cache) {
        var _this = this;
        if (cache === void 0) { cache = true; }
        var svgUrl = (resolveSVGUrl
            ? this.getAbsoluteUrl(url)
            : url).replace(/#.+$/, '');
        if (cache && SVGCacheService._cache.has(svgUrl)) {
            return of(this._cloneSVG(SVGCacheService._cache.get(svgUrl)));
        }
        if (SVGCacheService._inProgressReqs.has(svgUrl)) {
            return SVGCacheService._inProgressReqs.get(svgUrl);
        }
        var req = this._http.get(svgUrl, { responseType: 'text' })
            .pipe(tap(function () {
            SVGCacheService._inProgressReqs.delete(svgUrl);
        }), catchError(function (error) {
            SVGCacheService._inProgressReqs.delete(svgUrl);
            return throwError(error.message);
        }), share(), map(function (svgText) {
            var svgEl = _this._svgElementFromString(svgText);
            SVGCacheService._cache.set(svgUrl, svgEl);
            return _this._cloneSVG(svgEl);
        }));
        SVGCacheService._inProgressReqs.set(svgUrl, req);
        return req;
    };
    SVGCacheService.prototype.setBaseUrl = function () {
        if (this._config) {
            this._baseUrl = this._config.baseUrl;
        }
        else if (this._appBase !== null) {
            this._baseUrl = this._appBase;
        }
        else if (this._location !== null) {
            this._baseUrl = this._location.getBaseHrefFromDOM();
        }
    };
    SVGCacheService.prototype.getAbsoluteUrl = function (url) {
        if (this._baseUrl && !/^https?:\/\//i.test(url)) {
            url = this._baseUrl + url;
            if (url.indexOf('//') === 0) {
                url = url.substring(1);
            }
        }
        var base = this._renderer.createElement('BASE');
        base.href = url;
        return base.href;
    };
    SVGCacheService.prototype._svgElementFromString = function (str) {
        var div = this._renderer.createElement('DIV');
        div.innerHTML = str;
        var svg = div.querySelector('svg');
        if (!svg) {
            throw new Error('No SVG found in loaded contents');
        }
        return svg;
    };
    SVGCacheService.prototype._cloneSVG = function (svg) {
        return svg.cloneNode(true);
    };
    SVGCacheService.ɵfac = function SVGCacheService_Factory(t) { return new (t || SVGCacheService)(i0.ɵɵinject(APP_BASE_HREF, 8), i0.ɵɵinject(i1.PlatformLocation, 8), i0.ɵɵinject(i2.InlineSVGConfig, 8), i0.ɵɵinject(i3.HttpClient), i0.ɵɵinject(i3.HttpBackend), i0.ɵɵinject(i0.RendererFactory2)); };
    SVGCacheService.ɵprov = i0.ɵɵdefineInjectable({ token: SVGCacheService, factory: SVGCacheService.ɵfac, providedIn: 'root' });
    return SVGCacheService;
}());
export { SVGCacheService };
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SVGCacheService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [APP_BASE_HREF]
            }] }, { type: i1.PlatformLocation, decorators: [{
                type: Optional
            }] }, { type: i2.InlineSVGConfig, decorators: [{
                type: Optional
            }] }, { type: i3.HttpClient }, { type: i3.HttpBackend }, { type: i0.RendererFactory2 }]; }, null); })();
