var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var box2dp;
(function (box2dp) {
    var CustomRenderer = (function (_super) {
        __extends(CustomRenderer, _super);
        function CustomRenderer(options) {
            var _this = this;
            _super.call(this, options);
            var gridHelper = new THREE.GridHelper(1000, 50);
            gridHelper.rotation.set(1.5708, 0.785398, 0);
            gridHelper.position.set(450, 300, -2);
            gridHelper.setColors(0xDDDDDD, 0xDDDDDD);
            this.container.add(gridHelper);
            window.addEventListener('resize', function () { _this.resizeWindow(); }, false);
            this.resizeWindow();
        }
        CustomRenderer.prototype.resizeWindow = function () {
            this.camera.aspect = window.innerWidth / 600;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, 600);
        };
        return CustomRenderer;
    })(box2dp.ThreeRenderer);
    box2dp.CustomRenderer = CustomRenderer;
})(box2dp || (box2dp = {}));
