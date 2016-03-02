function websiteRender() {

    //create a domain that contain the physic world
    var domain: box2dp.Domain = new box2dp.Domain({ x: 0, y: 10 }, 0.1);

    //add a three.js renderer in div id threeScreen
    var customRenderer: box2dp.CustomRenderer = new box2dp.CustomRenderer({
        antialias: false, elementId: "threeScreen", width: 900, height: 600, invertY: true, colorClass: new box2dp.CustomColor()
    });
    //add renderer before adding any items
    customRenderer.drawFlags = box2dp.BaseRenderer.DRAW_SHAPE | box2dp.BaseRenderer.DRAW_CENTER;
    domain.addRenderer(customRenderer);

    ////create static surrounding wall
    var wallInfo: box2dp.MakeInfo = new box2dp.MakeInfo({
        x: 450, y: -15, w: 1920, h: 30, createType: box2dp.MakeInfo.MAKE_BOX_CENTER, fixedRotation: true,
        isStatic: true, friction: 0, name: "wall", itemType: box2dp.ItemBase.SHAPE
    });
    domain.create(wallInfo);
   
    wallInfo.y = 615;
    domain.create(wallInfo);

    wallInfo.x = -500; wallInfo.y = 300; wallInfo.w = 30; wallInfo.h = 600;
    domain.create(wallInfo);
    wallInfo.x = 1400;
    domain.create(wallInfo);


    var cirInfo: box2dp.MakeInfo = new box2dp.MakeInfo({
        radius: 20, createType: box2dp.MakeInfo.MAKE_CIRCLE, itemType: box2dp.ItemBase.SHAPE, restitution: 1
    });
    for (var b: number = 1; b <40; b++) {
        cirInfo.x = 100 + b * 10;
        cirInfo.y = 100 + b * 10;
        domain.create(cirInfo);
    }


    //start running the simulation, physic updates per 50 millisecond , render updates per 25 millisecond 
    domain.run(50, 25);

}