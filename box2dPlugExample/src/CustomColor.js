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
            this.unitColorCount = 0;
        }
        CustomColor.prototype.getWheelColor = function (frequency, center, width) {
            if (frequency === void 0) { frequency = 0.08; }
            if (center === void 0) { center = 128; }
            if (width === void 0) { width = 127; }
            var red = Math.sin(frequency * this.unitColorCount + 0) * width + center;
            var green = Math.sin(frequency * this.unitColorCount + 2) * width + center;
            var blue = Math.sin(frequency * this.unitColorCount + 4) * width + center;
            this.unitColorCount += 1;
            return Math.round(red) + 256 * Math.round(green) + 65536 * Math.round(blue);
        };
        CustomColor.prototype.getItemDynamicMat = function () {
            var mat = new THREE.MeshBasicMaterial({
                color: this.getWheelColor(0.18, 152, 103), side: THREE.DoubleSide,
                opacity: this.ITEM_ALPHA, transparent: true
            });
            return mat;
        };
        return CustomColor;
    })(box2dp.Color);
    box2dp.CustomColor = CustomColor;
})(box2dp || (box2dp = {}));
