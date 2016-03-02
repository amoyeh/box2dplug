function addRemove() {
    var domain = new box2dp.Domain({ x: 0, y: 10 }, 0.1);
    var pixiRenderer = new box2dp.PixiRenderer({
        antialias: true, elementId: "pixiScreen", width: 900, height: 600
    });
    domain.addRenderer(pixiRenderer);
    pixiRenderer.drawFlags = box2dp.BaseRenderer.DRAW_SHAPE | box2dp.BaseRenderer.DRAW_CENTER | box2dp.BaseRenderer.DRAW_BOUNDARY;
    var threeRenderer = new box2dp.ThreeRenderer({
        elementId: "threeScreen", width: 900, height: 600, invertY: true
    });
    threeRenderer.drawFlags = box2dp.BaseRenderer.DRAW_SHAPE | box2dp.BaseRenderer.DRAW_CENTER | box2dp.BaseRenderer.DRAW_BOUNDARY;
    domain.addRenderer(threeRenderer);
    var cirInfo = new box2dp.MakeInfo({
        radius: 20, createType: box2dp.MakeInfo.MAKE_CIRCLE, itemType: box2dp.ItemBase.SHAPE
    });
    var polyInfo = new box2dp.MakeInfo({
        vertices: [{ x: -30, y: -20 }, { x: 25, y: -25 }, { x: 30, y: 10 }, { x: 0, y: 30 }],
        createType: box2dp.MakeInfo.MAKE_POLYGON, itemType: box2dp.ItemBase.SHAPE
    });
    var boxInfo = new box2dp.MakeInfo({
        w: 40, h: 30, angle: 0.25, createType: box2dp.MakeInfo.MAKE_BOX_CENTER, itemType: box2dp.ItemBase.SHAPE
    });
    var edgeInfo = new box2dp.MakeInfo({
        vertices: [{ x: -30, y: -20 }, { x: 25, y: -25 }, { x: 30, y: 10 }, { x: -50, y: 40 }, { x: -30, y: -20 }],
        createType: box2dp.MakeInfo.MAKE_EDGE, itemType: box2dp.ItemBase.SHAPE
    });
    var compound1 = new box2dp.MakeInfo({ w: 70, h: 20, createType: box2dp.MakeInfo.MAKE_BOX_CENTER });
    var compound2 = new box2dp.MakeInfo({ radius: 20, x: -20, createType: box2dp.MakeInfo.MAKE_CIRCLE });
    var compound3 = new box2dp.MakeInfo({
        vertices: [{ x: -30, y: -20 }, { x: 25, y: -25 }, { x: 30, y: 10 }, { x: 0, y: 30 }], x: 40, y: 20,
        createType: box2dp.MakeInfo.MAKE_POLYGON
    });
    var compoundInfo = new box2dp.MakeInfo({ createType: box2dp.MakeInfo.MAKE_COMPOUND, makeInfos: [compound1, compound2, compound3] });
    var useInfo = [cirInfo, polyInfo, boxInfo, edgeInfo, compoundInfo];
    function drop() {
        for (var t = 0; t < 1; t++) {
            var atPos = t % 5;
            useInfo[atPos].x = 100 + (atPos) * 150;
            useInfo[atPos].y = 100 + Math.floor(t / 5) * 200;
            domain.create(useInfo[atPos]);
        }
    }
    drop();
    var tcPixi = new box2dp.DragControl(pixiRenderer);
    tcPixi.createDragDrop();
    var tcThree = new box2dp.DragControl(threeRenderer);
    tcThree.createDragDrop();
    domain.run(50, 25);
    var GuiObj = function () {
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
            pixiRenderer.drawFlags |= box2dp.BaseRenderer.DRAW_BOUNDARY;
            threeRenderer.drawFlags |= box2dp.BaseRenderer.DRAW_BOUNDARY;
        }
        else {
            pixiRenderer.drawFlags &= ~box2dp.BaseRenderer.DRAW_BOUNDARY;
            threeRenderer.drawFlags &= ~box2dp.BaseRenderer.DRAW_BOUNDARY;
        }
    });
    var scCtrl = gui.add(obj, "showCenter");
    scCtrl.onFinishChange(function (value) {
        if (value) {
            pixiRenderer.drawFlags |= box2dp.BaseRenderer.DRAW_CENTER;
            threeRenderer.drawFlags |= box2dp.BaseRenderer.DRAW_CENTER;
        }
        else {
            pixiRenderer.drawFlags &= ~box2dp.BaseRenderer.DRAW_CENTER;
            threeRenderer.drawFlags &= ~box2dp.BaseRenderer.DRAW_CENTER;
        }
    });
    var stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.right = '265px';
    document.body.appendChild(stats.domElement);
    domain.addEvent(box2dp.Event.BEFORE_RENDER, function (e) {
        domain.eachItem(function (item, k) {
            if (item.iy > 150) {
                console.log("loop ON: " + item.name);
                domain.removeItem(item);
            }
        });
        stats.begin();
    });
    domain.addEvent(box2dp.Event.AFTER_RENDER, function (e) {
        stats.end();
    });
}
