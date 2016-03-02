var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var box2dp;
(function (box2dp) {
    var CustomRenderer = (function (_super) {
        __extends(CustomRenderer, _super);
        function CustomRenderer() {
            _super.apply(this, arguments);
        }
        return CustomRenderer;
    })(box2dp.ThreeRenderer);
    box2dp.CustomRenderer = CustomRenderer;
})(box2dp || (box2dp = {}));
