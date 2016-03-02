function SensorPage() {

    //create a domain that contain the physic world
    var domain: box2dp.Domain = new box2dp.Domain({ x: 0, y: 0 }, 0.1);

    //set DebugDraw canvas, using the box2d way
    domain.setDebugDrawElements("canvasScreen", 900, 600);

    //add a pixi renderer in div id pixiScreen
    var pixiRenderer: box2dp.PixiRenderer = new box2dp.PixiRenderer({
        antialias: true, elementId: "pixiScreen", width: 900, height: 600
    });
    //add renderer before adding any items
    domain.addRenderer(pixiRenderer);
    pixiRenderer.drawFlags = box2dp.BaseRenderer.DRAW_SHAPE | box2dp.BaseRenderer.DRAW_CENTER | box2dp.BaseRenderer.DRAW_BOUNDARY;

    //add a three.js renderer in div id threeScreen
    var threeRenderer: box2dp.ThreeRenderer = new box2dp.ThreeRenderer({
        elementId: "threeScreen", width: 900, height: 600, invertY: true
    });
    //add renderer before adding any items
    threeRenderer.drawFlags = box2dp.BaseRenderer.DRAW_SHAPE | box2dp.BaseRenderer.DRAW_CENTER | box2dp.BaseRenderer.DRAW_BOUNDARY;
    domain.addRenderer(threeRenderer);
    var tcThree: box2dp.DragControl = new box2dp.DragControl(threeRenderer);
    tcThree.createDragDrop();

    //create static surrounding wall
    var wallInfo: box2dp.MakeInfo = new box2dp.MakeInfo({
        x: 450, y: 15, w: 900, h: 30, createType: box2dp.MakeInfo.MAKE_BOX_CENTER, fixedRotation: true,
        isStatic: true, friction: 0, name: "wall", itemType: box2dp.ItemBase.SHAPE
    });
    //actually create the physic object in domain
    domain.create(wallInfo);
   
    //These wall objects share similar properties, MakeInfo object can be reused for such task.
    wallInfo.y = 585;
    domain.create(wallInfo);

    wallInfo.x = 15; wallInfo.y = 300; wallInfo.w = 30; wallInfo.h = 600;
    domain.create(wallInfo);
    wallInfo.x = 885;
    domain.create(wallInfo);

    //create few boxes and circles
    var sensorInfo: box2dp.MakeInfo = new box2dp.MakeInfo({
        x: 100, y: 60, w: 80, h: 80, angle: 0.9, createType: box2dp.MakeInfo.MAKE_BOX_CENTER,
        isSensor: true, itemType: box2dp.ItemBase.SENSOR, name: "sensor"
    });

    //sensor automatically enables contact events
    var sensorEntity: box2dp.ItemEntity = domain.create(sensorInfo);
    sensorEntity.addEvent(box2dp.Event.BEGIN_CONTACT, function (e) {
        console.log("sensor BEGIN_CONTACT");
        console.log(e.target);
    });

    sensorEntity.addEvent(box2dp.Event.END_CONTACT, function (e) {
        console.log("sensor END_CONTACT");
        console.log(e.target);
    });


    var boxInfo: box2dp.MakeInfo = new box2dp.MakeInfo({
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


    //enable contact event on items

    //enable drag & drop on testing environment on pixi
    var tcPixi: box2dp.DragControl = new box2dp.DragControl(pixiRenderer);
    tcPixi.createDragDrop();

    //start running the simulation, physic updates per 100 millisecond , render updates per 25 millisecond 
    domain.run(50, 25);

    //dat gui testing setup
    var GuiObj = function () {
        this.showBoundary = true;
        this.showCenter = true;
    };

    var obj = new GuiObj();
    obj.atItemPos = 0;
    var gui: dat.GUI = new dat.GUI();


    var sbCtrl = gui.add(obj, "showBoundary");
    sbCtrl.onFinishChange(function (value) {
        if (value) {
            pixiRenderer.drawFlags |= box2dp.BaseRenderer.DRAW_BOUNDARY;
        } else {
            pixiRenderer.drawFlags &= ~box2dp.BaseRenderer.DRAW_BOUNDARY;
        }
    });
    var scCtrl = gui.add(obj, "showCenter");
    scCtrl.onFinishChange(function (value) {
        if (value) {
            pixiRenderer.drawFlags |= box2dp.BaseRenderer.DRAW_CENTER;
        } else {
            pixiRenderer.drawFlags &= ~box2dp.BaseRenderer.DRAW_CENTER;
        }
    });


    //stats
    var stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms, 2: mb
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.right = '265px';
    document.body.appendChild(stats.domElement);
    domain.addEvent(box2dp.Event.BEFORE_RENDER, (e) => { stats.begin(); });
    domain.addEvent(box2dp.Event.AFTER_RENDER, (e) => { stats.end(); });



}