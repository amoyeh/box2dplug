var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var example;
(function (example) {
    var CustomRender = (function (_super) {
        __extends(CustomRender, _super);
        function CustomRender(options) {
            _super.call(this, options);
        }
        return CustomRender;
    })(box2dts.PixiRenderer);
    example.CustomRender = CustomRender;
})(example || (example = {}));
