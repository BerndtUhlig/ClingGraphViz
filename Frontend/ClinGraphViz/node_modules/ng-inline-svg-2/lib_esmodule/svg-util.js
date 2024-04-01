export function isUrlSymbol(url) {
    return url.charAt(0) === '#' || url.indexOf('.svg#') > -1;
}
export function isSvgSupported() {
    return typeof SVGRect !== 'undefined';
}
export function createSymbolSvg(renderer, svg, symbolId) {
    var symbol = svg.querySelector("[id=\"".concat(symbolId, "\"]"));
    if (!symbol) {
        throw new Error("Symbol \"".concat(symbolId, "\" not found"));
    }
    var elSvg = renderer.createElement('svg', 'svg');
    renderer.appendChild(elSvg, symbol);
    var elSvgUse = renderer.createElement('use', 'svg');
    renderer.setAttribute(elSvgUse, 'href', "#".concat(symbolId), 'xlink');
    renderer.appendChild(elSvg, elSvgUse);
    return elSvg;
}
export function removeAttributes(element, attrs) {
    for (var i = 0; i < attrs.length; i++) {
        var elAttr = element.getAttribute(attrs[i]);
        if (elAttr) {
            element.removeAttribute(attrs[i]);
        }
    }
    var innerEls = element.getElementsByTagName('*');
    for (var i = 0; i < innerEls.length; i++) {
        removeAttributes(innerEls[i], attrs);
    }
}
export function setAttributes(element, attrs) {
    for (var attr in attrs) {
        element.setAttribute(attr, attrs[attr]);
    }
}
