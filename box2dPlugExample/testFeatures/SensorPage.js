function SensorPage() {
    var domain = new box2dp.Domain({ x: 0, y: 0 }, 0.1);
    domain.setDebugDrawElements("canvasScreen", 900, 600);
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
    var tcThree = new box2dp.DragControl(threeRenderer);
    tcThree.createDragDrop();
    var wallInfo = new box2dp.MakeInfo({
        x: 450, y: 15, w: 900, h: 30, createType: box2dp.MakeInfo.MAKE_BOX_CENTER, fixedRotation: true,
        isStatic: true, friction: 0, name: "wall", itemType: box2dp.ItemBase.SHAPE
    });
    domain.create(wallInfo);
    wallInfo.y = 585;
    domain.create(wallInfo);
    wallInfo.x = 15;
    wallInfo.y = 300;
    wallInfo.w = 30;
    wallInfo.h = 600;
    domain.create(wallInfo);
    wallInfo.x = 885;
    domain.create(wallInfo);
    var sensorInfo = new box2dp.MakeInfo({
        x: 100, y: 60, w: 80, h: 80, angle: 0.9, createType: box2dp.MakeInfo.MAKE_BOX_CENTER,
        isSensor: true, itemType: box2dp.ItemBase.SENSOR, name: "sensor"
    });
    var sensorEntity = domain.create(sensorInfo);
    sensorEntity.addEvent(box2dp.Event.BEGIN_CONTACT, function (e) {
        console.log("sensor BEGIN_CONTACT");
        console.log(e.target);
    });
    sensorEntity.addEvent(box2dp.Event.END_CONTACT, function (e) {
        console.log("sensor END_CONTACT");
        console.log(e.target);
    });
    var boxInfo = new box2dp.MakeInfo({
        w: 30, h: 30, angle: 0.9, createType: box2dp.MakeInfo.MAKE_BOX_CENTER, restitution: 0.5, itemType: box2dp.ItemBase.SHAPE,
        name: "box"
    });
    boxInfo.y = 200;
    boxInfo.x = 100;
    var box = domain.create(boxInfo);
    box.enableContactEvent = true;
    box.addEvent(box2dp.Event.BEGIN_CONTACT, function (e) {
        console.log("box BEGIN_CONTACT");
        console.log(e.target);
    });
    box.addEvent(box2dp.Event.END_CONTACT, function (e) {
        console.log("box END_CONTACT");
        console.log(e.target);
    });
    var tcPixi = new box2dp.DragControl(pixiRenderer);
    tcPixi.createDragDrop();
    domain.run(50, 25);
    var GuiObj = function () {
        this.showBoundary = true;
        this.showCenter = true;
    };
    var obj = new GuiObj();
    obj.atItemPos = 0;
    var gui = new dat.GUI();
    var sbCtrl = gui.add(obj, "showBoundary");
    sbCtrl.onFinishChange(function (value) {
        if (value) {
            pixiRenderer.drawFlags |= box2dp.BaseRenderer.DRAW_BOUNDARY;
        }
        else {
            pixiRenderer.drawFlags &= ~box2dp.BaseRenderer.DRAW_BOUNDARY;
        }
    });
    var scCtrl = gui.add(obj, "showCenter");
    scCtrl.onFinishChange(function (value) {
        if (value) {
            pixiRenderer.drawFlags |= box2dp.BaseRenderer.DRAW_CENTER;
        }
        else {
            pixiRenderer.drawFlags &= ~box2dp.BaseRenderer.DRAW_CENTER;
        }
    });
    var stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.right = '265px';
    document.body.appendChild(stats.domElement);
    domain.addEvent(box2dp.Event.BEFORE_RENDER, function (e) { stats.begin(); });
    domain.addEvent(box2dp.Event.AFTER_RENDER, function (e) { stats.end(); });
}
