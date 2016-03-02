function QuadTreePage() {
    var domain = new box2dp.Domain({ x: 0, y: 0 }, 0.1);
    domain.setDebugDrawElements("canvasScreen", 900, 600);
    var pixiRenderer = new box2dp.PixiRenderer({
        antialias: true, elementId: "pixiScreen", width: 900, height: 600
    });
    domain.addRenderer(pixiRenderer);
    pixiRenderer.drawFlags = box2dp.BaseRenderer.DRAW_SHAPE | box2dp.BaseRenderer.DRAW_CENTER | box2dp.BaseRenderer.DRAW_BOUNDARY | box2dp.BaseRenderer.DRAW_QUAD_TREE;
    var threeRenderer = new box2dp.ThreeRenderer({
        elementId: "threeScreen", width: 900, height: 600, invertY: true
    });
    threeRenderer.drawFlags = box2dp.BaseRenderer.DRAW_SHAPE | box2dp.BaseRenderer.DRAW_CENTER | box2dp.BaseRenderer.DRAW_BOUNDARY | box2dp.BaseRenderer.DRAW_QUAD_TREE;
    domain.addRenderer(threeRenderer);
    var tcThree = new box2dp.DragControl(threeRenderer);
    tcThree.createDragDrop();
    domain.quadTree = new box2dp.QuadTree(0, 0, 900 / 30, 600 / 30, 2, 4);
    domain.quadTree.drawDebug = true;
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
    var boxInfo = new box2dp.MakeInfo({
        w: 30, h: 30, angle: 0.9, createType: box2dp.MakeInfo.MAKE_BOX_CENTER, restitution: 0.5, itemType: box2dp.ItemBase.SHAPE
    });
    for (var k = 0; k < 20; k++) {
        boxInfo.y = 200 + Math.floor(k / 10) * 200;
        boxInfo.x = 100 + (k % 10) * 80;
        domain.create(boxInfo);
    }
    var tcPixi = new box2dp.DragControl(pixiRenderer);
    tcPixi.createDragDrop();
    domain.addEvent(box2dp.Event.AFTER_RENDER, function () {
        var citem = domain.items[obj.atItemPos];
        var otherItems = domain.quadTree.quadTreeSelect(citem);
        if (otherItems) {
            pixiRenderer.overGraphic.clear();
            pixiRenderer.overGraphic.lineStyle(1, 0xFFFF00, 0.4);
            pixiRenderer.overGraphic.beginFill(0xFFFF00, 0.4);
            pixiRenderer.overGraphic.drawCircle(citem.ix, citem.iy, 4);
            pixiRenderer.overGraphic.endFill();
            for (var i = 0; i < otherItems.length; i++) {
                pixiRenderer.overGraphic.beginFill(0xFFFF00, 0.4);
                pixiRenderer.overGraphic.drawCircle(otherItems[i].data.ix, otherItems[i].data.iy, 4);
                pixiRenderer.overGraphic.endFill();
                pixiRenderer.overGraphic.moveTo(citem.ix, citem.iy);
                pixiRenderer.overGraphic.lineTo(otherItems[i].data.ix, otherItems[i].data.iy);
            }
            threeRenderer.clearOverShapes();
            var topMat = new THREE.MeshBasicMaterial({ color: 0xFFFF00, opacity: 0.4, transparent: true, side: THREE.DoubleSide });
            var lineMat = new THREE.LineBasicMaterial({ color: 0xFFFF00, opacity: 0.4, transparent: true, side: THREE.DoubleSide });
            var cirGeo = new THREE.CircleGeometry(4, 24);
            var cirMesh = new THREE.Mesh(cirGeo, topMat);
            cirMesh.position.set(citem.ix, citem.iy, 0);
            threeRenderer.overGraphic.add(cirMesh);
            for (var i = 0; i < otherItems.length; i++) {
                cirMesh = new THREE.Mesh(cirGeo, topMat);
                cirMesh.position.set(otherItems[i].data.ix, otherItems[i].data.iy, 0);
                threeRenderer.overGraphic.add(cirMesh);
                var lg = new THREE.Geometry();
                lg.vertices.push(new THREE.Vector3(citem.ix, citem.iy, 0), new THREE.Vector3(otherItems[i].data.ix, otherItems[i].data.iy, 0));
                var line = new THREE.Line(lg, lineMat);
                threeRenderer.overGraphic.add(line);
            }
        }
    });
    domain.run(50, 25);
    var GuiObj = function () {
        this.showBoundary = true;
        this.showCenter = true;
        this.showQuadTree = true;
    };
    var obj = new GuiObj();
    obj.atItemPos = 0;
    var gui = new dat.GUI();
    var aictrl = gui.add(obj, "atItemPos", 0, domain.items.length - 1).step(1);
    aictrl.onFinishChange(function (value) {
    });
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
    var stCtrl = gui.add(obj, "showQuadTree");
    stCtrl.onFinishChange(function (value) {
        if (value) {
            pixiRenderer.drawFlags |= box2dp.BaseRenderer.DRAW_QUAD_TREE;
        }
        else {
            pixiRenderer.drawFlags &= ~box2dp.BaseRenderer.DRAW_QUAD_TREE;
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
