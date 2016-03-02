var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var box2dp;
(function (box2dp) {
    var CustomColor = (function (_super) {
        __extends(CustomColor, _super);
        function CustomColor() {
            _super.apply(this, arguments);
        }
        CustomColor.ITEM_STATIC = 0xAA0099;
        CustomColor.ITEM_DYNAMIC = 0x9900AA;
        return CustomColor;
    })(box2dp.Color);
    box2dp.CustomColor = CustomColor;
})(box2dp || (box2dp = {}));
