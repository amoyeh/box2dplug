function CustomRenderPage() {
    var domain = new box2dp.Domain({ x: 0, y: 0 }, 0.1);
    domain.setDebugDrawElements("canvasScreen", 900, 600);
    var customRenderer = new example.CustomRenderer({
        antialias: true, elementId: "pixiScreen", width: 900, height: 600
    });
    domain.addRenderer(customRenderer);
    customRenderer.drawFlags = box2dp.BaseRenderer.DRAW_SHAPE | box2dp.BaseRenderer.DRAW_CENTER | box2dp.BaseRenderer.DRAW_BOUNDARY;
    domain.quadTree = new box2dp.QuadTree(0, 0, 900 / 30, 600 / 30, 2, 4);
    domain.quadTree.drawDebug = true;
    var boxInfo = new box2dp.MakeInfo({
        x: 100, y: 100, w: 30, h: 30, angle: 0.9, createType: box2dp.MakeInfo.MAKE_BOX_CENTER, restitution: 0.5,
        name: "myBox", itemType: box2dp.ItemBase.SHAPE
    });
    domain.create(boxInfo);
    for (var b = 1; b < 3; b++) {
        boxInfo.x = 100 + b * 30;
        boxInfo.y = 100 + b * 30;
        domain.create(boxInfo);
    }
    var tcPixi = new box2dp.DragControl(customRenderer);
    tcPixi.createDragDrop();
    domain.run(100, 25);
    var GuiObj = function () {
        this.reverseGravity = function () {
            var gravity = domain.world.GetGravity();
            gravity.y *= -1;
            domain.world.SetGravity(gravity, true);
        };
        this.stepInterval = 100;
        this.renderInterval = 25;
        this.updateIntervalInfo = function () {
            domain.updateInterval(this.stepInterval, this.renderInterval);
        };
        this.fixedTimeMode = true;
        this.showBoundary = true;
        this.showCenter = true;
    };
    var obj = new GuiObj();
    var gui = new dat.GUI();
    gui.add(obj, "reverseGravity");
    var sctrl = gui.add(obj, "stepInterval", 20, 300).step(20);
    sctrl.onFinishChange(function (value) { obj.updateIntervalInfo(); });
    var rctrl = gui.add(obj, "renderInterval", 10, 300).step(10);
    rctrl.onFinishChange(function (value) { obj.updateIntervalInfo(); });
    var pctrl = gui.add(obj, "fixedTimeMode");
    pctrl.onFinishChange(function (value) {
        if (obj.fixedTimeMode == true) {
            domain.setUpdateMode(box2dp.Domain.UPDATE_FIXED);
        }
        else {
            domain.setUpdateMode(box2dp.Domain.UPDATE_TIME_BASED);
        }
    });
    var sbCtrl = gui.add(obj, "showBoundary");
    sbCtrl.onFinishChange(function (value) {
        if (value) {
            customRenderer.drawFlags |= box2dp.BaseRenderer.DRAW_BOUNDARY;
        }
        else {
            customRenderer.drawFlags &= ~box2dp.BaseRenderer.DRAW_BOUNDARY;
        }
    });
    var scCtrl = gui.add(obj, "showCenter");
    scCtrl.onFinishChange(function (value) {
        if (value) {
            customRenderer.drawFlags |= box2dp.BaseRenderer.DRAW_CENTER;
        }
        else {
            customRenderer.drawFlags &= ~box2dp.BaseRenderer.DRAW_CENTER;
        }
    });
    setInterval(function () { obj.reverseGravity(); }, 3000);
    var stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.right = '265px';
    document.body.appendChild(stats.domElement);
    domain.addEvent(box2dp.Event.BEFORE_RENDER, function (e) { stats.begin(); });
    domain.addEvent(box2dp.Event.AFTER_RENDER, function (e) { stats.end(); });
}
