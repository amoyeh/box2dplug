/// <reference path="../dts/dat-gui.d.ts" />

function basicCreate() {

    //create a domain that contain the physic world
    var domain: box2dp.Domain = new box2dp.Domain({ x: 0, y: 10 }, 0.1);

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
        antialias: false, elementId: "threeScreen", width: 900, height: 600, invertY: true
    });
    //add renderer before adding any items
    threeRenderer.drawFlags = box2dp.BaseRenderer.DRAW_SHAPE | box2dp.BaseRenderer.DRAW_CENTER | box2dp.BaseRenderer.DRAW_BOUNDARY;
    domain.addRenderer(threeRenderer);

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
    var boxInfo: box2dp.MakeInfo = new box2dp.MakeInfo({
        x: 100, y: 100, w: 30, h: 30, angle: 0.9, createType: box2dp.MakeInfo.MAKE_BOX_CENTER, restitution: 0.5,
        name: "myBox", itemType: box2dp.ItemBase.SHAPE
    });
    domain.create(boxInfo);
    for (var b: number = 1; b < 5; b++) {
        boxInfo.x = 100 + b * 20;
        boxInfo.y = 100 + b * 50;
        domain.create(boxInfo);
    }

    var cirInfo: box2dp.MakeInfo = new box2dp.MakeInfo({
        x: 300, y: 100, radius: 20, angle: 0.9, createType: box2dp.MakeInfo.MAKE_CIRCLE, restitution: 0.5,
        name: "myCircle", itemType: box2dp.ItemBase.SHAPE
    });
    domain.create(cirInfo);
    for (var b: number = 1; b < 5; b++) {
        cirInfo.x = 300 + b * 30;
        cirInfo.y = 100 + b * 30;
        domain.create(cirInfo);
    }

    //create an box2d edge object
    var edgeInfo: box2dp.MakeInfo = new box2dp.MakeInfo({
        x: 500, y: 100, vertices: [{ x: 0, y: 0 }, { x: 50, y: 10 }, { x: 40, y: 60 }, { x: 5, y: 45 }, { x: 0, y: 0 }], createType: box2dp.MakeInfo.MAKE_EDGE, restitution: 0.5,
        name: "myEdge", itemType: box2dp.ItemBase.SHAPE, angle: 0.9
    });
    domain.create(edgeInfo);

   
    //create a polygon shape
    var polyInfo: box2dp.MakeInfo = new box2dp.MakeInfo({
        x: 650, y: 50,
        //vertices: [{ x: -30, y: -30 }, { x: 30, y: -20 }, { x: 25, y: 25 }, { x: -25, y: 40 }],
        vertices: [{ x: 0, y: 0 }, { x: 50, y: 10 }, { x: 60, y: 45 }, { x: 0, y: 40 }],
        createType: box2dp.MakeInfo.MAKE_POLYGON, restitution: 0.5, angle: 0.9,
        name: "myPolygon", itemType: box2dp.ItemBase.SHAPE
    });
    domain.create(polyInfo);


    //compound shape that combines different shapes
    var compound1: box2dp.MakeInfo = new box2dp.MakeInfo(
        { x: 0, y: 0, w: 100, h: 20, restitution: 0.5, createType: box2dp.MakeInfo.MAKE_BOX_CENTER });
    var compound2: box2dp.MakeInfo = new box2dp.MakeInfo(
        { x: 50, y: 15, radius: 40, restitution: 0.5, createType: box2dp.MakeInfo.MAKE_CIRCLE });
    var compound3: box2dp.MakeInfo = new box2dp.MakeInfo({
        x: -80, y: -30, restitution: 0.5, createType: box2dp.MakeInfo.MAKE_POLYGON,
        vertices: [{ x: 0, y: 0 }, { x: 50, y: 10 }, { x: 40, y: 60 }, { x: 5, y: 45 }]
    });
    var compoundInfo = new box2dp.MakeInfo({
        x: 450, y: 400, isStatic: false, createType: box2dp.MakeInfo.MAKE_COMPOUND, angle: 0.9,
        makeInfos: [compound1, compound2, compound3]
    });
    domain.create(compoundInfo);

    
    //enable drag & drop on testing environment on pixi
    var tcPixi: box2dp.DragControl = new box2dp.DragControl(pixiRenderer);
    tcPixi.createDragDrop();

    var tcThree: box2dp.DragControl = new box2dp.DragControl(threeRenderer);
    //threeRenderer.camera.rotation.x = 0.25;
    //threeRenderer.camera.rotation.y = 0.25;
    //threeRenderer.camera.position.x = 650;
    //threeRenderer.camera.position.y = -450;
    tcThree.createDragDrop();

    //tcThree.createTrackBallCtrl();
    //setTimeout(function () { tcThree.removeTrackBallCtrl() }, 3000);

    //tcThree.createOrbitCtrl();
    //setTimeout(function () { tcThree.removeOrbitCtrl() }, 3000);

    //start running the simulation, physic updates per 100 millisecond , render updates per 25 millisecond 
    domain.run(100, 25);



    //dat gui testing setup
    var GuiObj = function () {
        this.reverseGravity = function () {
            var gravity: box2d.b2Vec2 = domain.world.GetGravity();
            gravity.y *= -1;
            domain.world.SetGravity(gravity, true);
        };
        this.stepInterval = 100;
        this.renderInterval = 25;
        this.updateIntervalInfo = function () {
            domain.updateInterval(this.stepInterval, this.renderInterval);
        }
        this.fixedTimeMode = true;
        this.showBoundary = true;
        this.showCenter = true;
    };

    var obj = new GuiObj();
    var gui: dat.GUI = new dat.GUI();
    gui.add(obj, "reverseGravity");
    var sctrl = gui.add(obj, "stepInterval", 20, 300).step(20);
    sctrl.onFinishChange(function (value) { obj.updateIntervalInfo(); });
    var rctrl = gui.add(obj, "renderInterval", 10, 300).step(10);
    rctrl.onFinishChange(function (value) { obj.updateIntervalInfo(); });
    var pctrl = gui.add(obj, "fixedTimeMode");
    pctrl.onFinishChange(function (value) {
        if (obj.fixedTimeMode == true) {
            domain.setUpdateMode(box2dp.Domain.UPDATE_FIXED);
        } else {
            domain.setUpdateMode(box2dp.Domain.UPDATE_TIME_BASED);
        }
    });

    var sbCtrl = gui.add(obj, "showBoundary");
    sbCtrl.onFinishChange(function (value) {
        if (value) {
            pixiRenderer.drawFlags |= box2dp.BaseRenderer.DRAW_BOUNDARY;
            threeRenderer.drawFlags |= box2dp.BaseRenderer.DRAW_BOUNDARY;
        } else {
            pixiRenderer.drawFlags &= ~box2dp.BaseRenderer.DRAW_BOUNDARY;
            threeRenderer.drawFlags &= ~box2dp.BaseRenderer.DRAW_BOUNDARY;
        }
    });

    var scCtrl = gui.add(obj, "showCenter");
    scCtrl.onFinishChange(function (value) {
        if (value) {
            pixiRenderer.drawFlags |= box2dp.BaseRenderer.DRAW_CENTER;
            threeRenderer.drawFlags |= box2dp.BaseRenderer.DRAW_CENTER;
        } else {
            pixiRenderer.drawFlags &= ~box2dp.BaseRenderer.DRAW_CENTER;
            threeRenderer.drawFlags &= ~box2dp.BaseRenderer.DRAW_CENTER;
        }
    });
    setInterval(function () { obj.reverseGravity() }, 3000);


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