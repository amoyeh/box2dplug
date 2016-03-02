var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var example;
(function (example) {
    var CustomRenderer = (function (_super) {
        __extends(CustomRenderer, _super);
        function CustomRenderer(options) {
            _super.call(this, options);
        }
        CustomRenderer.prototype.beforeStep = function () { };
        CustomRenderer.prototype.afterStep = function () { };
        CustomRenderer.prototype.render = function () {
            _super.prototype.render.call(this);
        };
        CustomRenderer.prototype.onItemCreate = function (item) {
            _super.prototype.onItemCreate.call(this, item);
        };
        CustomRenderer.prototype.onItemRemove = function (item) {
            _super.prototype.onItemRemove.call(this, item);
        };
        CustomRenderer.prototype.itemDisplayUpdate = function (display, item) {
            _super.prototype.itemDisplayUpdate.call(this, display, item);
        };
        return CustomRenderer;
    })(box2dp.PixiRenderer);
    example.CustomRenderer = CustomRenderer;
})(example || (example = {}));
