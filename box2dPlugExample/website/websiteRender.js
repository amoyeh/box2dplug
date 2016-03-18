function websiteRender() {
    var domain = new box2dp.Domain({ x: 0, y: 1 }, 0.1);
    var customRenderer = new box2dp.CustomRenderer({
        antialias: false, elementId: "threeScreen", width: 900, height: 600, invertY: true, colorClass: new box2dp.CustomColor()
    });
    customRenderer.drawFlags = box2dp.BaseRenderer.DRAW_SHAPE | box2dp.BaseRenderer.DRAW_CENTER |
        box2dp.BaseRenderer.DRAW_BOUNDARY | box2dp.BaseRenderer.DRAW_JOINT;
    domain.addRenderer(customRenderer);
    var revoCenterInfo = new box2dp.MakeInfo({ x: 300, y: 200, w: 12, h: 12, createType: box2dp.MakeInfo.MAKE_BOX_CENTER, isStatic: true });
    var rvCenter = domain.create(revoCenterInfo);
    var revoBarInfo = new box2dp.MakeInfo({ x: 400, y: 200, w: 120, h: 30, createType: box2dp.MakeInfo.MAKE_BOX_CENTER, isStatic: false });
    var rvBar = domain.create(revoBarInfo);
    var rjd = new box2d.b2RevoluteJointDef();
    rjd.collideConnected = false;
    rjd.Initialize(rvCenter.b2body, rvBar.b2body, rvCenter.b2body.GetPosition());
    domain.createJoint(rjd);
    domain.run(50, 25);
    domain.addEvent(box2dp.Event.AFTER_RENDER, function () {
        domain.eachItem(function (item, index) {
        });
    });
}
