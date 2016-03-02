module box2dp {

    interface CreateChainResult {
        bodies?: box2d.b2Body[];
        revoulteJoints?: box2d.b2Joint[];
        ropeJoint?: box2d.b2Joint;
        headPin?: box2d.b2Body;
        headJoint?: box2d.b2RevoluteJoint;
        tailPin?: box2d.b2Body;
        tailJoint?: box2d.b2RevoluteJoint;
    }

    export class BoxMaker {

        //world reference
        public world: box2d.b2World;

        constructor(world: box2d.b2World) {
            this.world = world;
        }

        public create(info: MakeInfo): box2d.b2Body {
            if (info.createType == null) {
                console.error("createType not defined");
                return;
            }
            var useInfo = info.clone();
            var body: box2d.b2Body = this.createbody(info);
            switch (info.createType) {
                case MakeInfo.MAKE_BOX_TOP_LEFT:
                case MakeInfo.MAKE_BOX_CENTER:
                    this.createBoxDef(body, useInfo);
                    break;
                case MakeInfo.MAKE_CIRCLE:
                    this.createCircleDef(body, useInfo);
                    break;
                case MakeInfo.MAKE_POLYGON:
                    this.createPolygonDef(body, useInfo);
                    break;
                case MakeInfo.MAKE_EDGE:
                    this.createEdge(body, useInfo);
                    break;
                case MakeInfo.MAKE_COMPOUND:
                    //loop every makeInfo and create a clone of its info , set offset so the position is relative to its parent
                    for (var p: number = 0; p < useInfo.makeInfos.length; p++) {
                        switch (useInfo.makeInfos[p].createType) {
                            case MakeInfo.MAKE_BOX_TOP_LEFT:
                            case MakeInfo.MAKE_BOX_CENTER:
                                var loopClone: MakeInfo = useInfo.makeInfos[p].clone();
                                var newFixture = this.createBoxDef(body, loopClone, loopClone.x, loopClone.y);
                                if (loopClone.fixtureData) newFixture.fixtureData = loopClone.fixtureData;
                                break;
                            case MakeInfo.MAKE_CIRCLE:
                                var loopClone: MakeInfo = useInfo.makeInfos[p].clone();
                                var newFixture = this.createCircleDef(body, loopClone, loopClone.x, loopClone.y);
                                if (loopClone.fixtureData) newFixture.fixtureData = loopClone.fixtureData;
                                break;
                            case MakeInfo.MAKE_POLYGON:
                                var loopClone: MakeInfo = useInfo.makeInfos[p].clone(true);
                                var newFixture = this.createPolygonDef(body, loopClone);
                                if (loopClone.fixtureData) newFixture.fixtureData = loopClone.fixtureData;
                                break;
                            case MakeInfo.MAKE_EDGE:
                                var loopClone: MakeInfo = useInfo.makeInfos[p].clone(true);
                                var newFixtures = this.createEdge(body, loopClone);
                                if (loopClone.fixtureData) {
                                    for (var k: number = 0; k < newFixtures.length; k++) {
                                        newFixtures[k].fixtureData = loopClone.fixtureData;
                                    }
                                }
                                break;
                        }
                    }
                    break;
            }
            if (useInfo.userData) body.SetUserData(useInfo.userData);
            body.SetPositionXY(useInfo.x, useInfo.y);
            return body;
            
        }

        public createEdge(body: box2d.b2Body, useInfo: MakeInfo): box2d.b2Fixture[] {
            var fixtureDef: box2d.b2FixtureDef = this.createFixtureDef(useInfo);
            var edge: box2d.b2EdgeShape = new box2d.b2EdgeShape();
            //2 vertices only , create edge directly
            var fixtures: box2d.b2Fixture[] = [];
            if (useInfo.b2Vertices.length == 2) {
                edge.SetAsEdge(useInfo.b2Vertices[0], useInfo.b2Vertices[1]);
                fixtureDef.shape = edge;
                fixtures.push(body.CreateFixture(fixtureDef));
            } else {
                if (!useInfo.loopEdge) {
                    //if not looping edges, create first edge
                    edge.SetAsEdge(useInfo.b2Vertices[0], useInfo.b2Vertices[1]);
                    edge.m_hasVertex3 = true;
                    edge.m_vertex3.Copy(useInfo.b2Vertices[2]);
                    fixtureDef.shape = edge;
                    fixtures.push(body.CreateFixture(fixtureDef));
                    //create rest of edges
                    for (var p: number = 1; p < useInfo.b2Vertices.length - 1; p++) {
                        var current: box2d.b2Vec2 = useInfo.b2Vertices[p];
                        var next: box2d.b2Vec2 = useInfo.b2Vertices[p + 1];
                        edge.SetAsEdge(current, next);
                        //console.log(" -- on  " + p + " - " + (p + 1));
                        if (useInfo.b2Vertices[p - 1]) {
                            edge.m_hasVertex0 = true;
                            edge.m_vertex0.Copy(useInfo.b2Vertices[p - 1]);
                            //console.log("   weld  prev  " + (p - 1));
                        }
                        if (useInfo.b2Vertices[p + 2]) {
                            edge.m_hasVertex3 = true;
                            edge.m_vertex3.Copy(useInfo.b2Vertices[p + 2]);
                            //console.log("   weld  next  " + (p + 2));
                        }
                        fixtureDef.shape = edge;
                        fixtures.push(body.CreateFixture(fixtureDef));
                    }
                } else {
                    edge.SetAsEdge(useInfo.b2Vertices[0], useInfo.b2Vertices[1]);
                    edge.m_hasVertex0 = true;
                    edge.m_vertex3.Copy(useInfo.b2Vertices[useInfo.b2Vertices.length - 1]);
                    edge.m_hasVertex3 = true;
                    edge.m_vertex3.Copy(useInfo.b2Vertices[2]);
                    fixtureDef.shape = edge;
                    fixtures.push(body.CreateFixture(fixtureDef));
                    //create rest of edges
                    for (var p: number = 1; p < useInfo.b2Vertices.length; p++) {
                        var current: box2d.b2Vec2 = useInfo.b2Vertices[p];
                        var next: box2d.b2Vec2 = useInfo.b2Vertices[p + 1];
                        if (next == null) {
                            next = useInfo.b2Vertices[0];
                            //console.log(" -- on  " + p + " - " + 0);
                        } else {
                            //console.log(" -- on  " + p + " - " + (p + 1));
                        }
                        edge.SetAsEdge(current, next);
                        if (useInfo.b2Vertices[p - 1]) {
                            edge.m_hasVertex0 = true;
                            edge.m_vertex0.Copy(useInfo.b2Vertices[p - 1]);
                            //console.log("   weld  prev  " + (p - 1));
                        }
                        var weldNext = useInfo.b2Vertices[p + 2];
                        if (weldNext == null) {
                            weldNext = useInfo.b2Vertices[(p + 2) % useInfo.b2Vertices.length];
                            //console.log("   weld  next  " + (p + 2) % useInfo.b2Vertices.length);
                        } else {
                            //console.log("   weld  next  " + (p + 2));
                        }
                        edge.m_hasVertex3 = true;
                        edge.m_vertex3.Copy(weldNext);
                        fixtureDef.shape = edge;
                        fixtures.push(body.CreateFixture(fixtureDef));
                    }
                }
            }
            return fixtures;
        }

        public createBoxDef(body: box2d.b2Body, useInfo: MakeInfo, offsetX: number = 0, offsetY: number = 0): box2d.b2Fixture {
            var fixtureDef: box2d.b2FixtureDef = this.createFixtureDef(useInfo);
            var poly: box2d.b2PolygonShape = new box2d.b2PolygonShape();
            var center = new box2d.b2Vec2(offsetX, offsetY);
            if (useInfo.createType == MakeInfo.MAKE_BOX_TOP_LEFT) {
                center.x += useInfo.w * .5;
                center.y += useInfo.h * .5;
            }
            poly.SetAsBox(useInfo.w * .5, useInfo.h * .5, center);
            fixtureDef.shape = poly;
            return body.CreateFixture(fixtureDef);
        }

        public createCircleDef(body: box2d.b2Body, useInfo: MakeInfo, offsetX: number = 0, offsetY: number = 0): box2d.b2Fixture {
            var fixtureDef: box2d.b2FixtureDef = this.createFixtureDef(useInfo);
            var circle: box2d.b2CircleShape = new box2d.b2CircleShape();
            circle.m_radius = useInfo.radius;
            circle.m_p.Set(offsetX, offsetY);
            fixtureDef.shape = circle;
            return body.CreateFixture(fixtureDef);
        }

        public createPolygonDef(body: box2d.b2Body, useInfo: MakeInfo): box2d.b2Fixture {
            var fixtureDef: box2d.b2FixtureDef = this.createFixtureDef(useInfo);
            var polyv: box2d.b2PolygonShape = new box2d.b2PolygonShape();
            polyv.Set(useInfo.b2Vertices);
            fixtureDef.shape = polyv;
            return body.CreateFixture(fixtureDef);
        }

        public createFixtureDef(info: MakeInfo): box2d.b2FixtureDef {
            var fixDef: box2d.b2FixtureDef = new box2d.b2FixtureDef();
            fixDef.density = info.density;
            fixDef.friction = info.friction;
            fixDef.restitution = info.restitution;
            fixDef.isSensor = info.isSensor;
            if (info.maskBits) fixDef.filter.maskBits = info.maskBits;
            if (info.categoryBits) fixDef.filter.categoryBits = info.categoryBits;
            return fixDef;
        }

        public createbody(info: MakeInfo): box2d.b2Body {
            var bodyDef: box2d.b2BodyDef = new box2d.b2BodyDef();
            bodyDef.type = box2d.b2BodyType.b2_dynamicBody;
            bodyDef.allowSleep = info.allowSleep;
            bodyDef.fixedRotation = info.fixedRotation;
            if (info.angle) bodyDef.angle = info.angle;
            if (info.isStatic) bodyDef.type = box2d.b2BodyType.b2_staticBody;
            if (info.bullet == true) bodyDef.bullet = true;
            var body: box2d.b2Body = this.world.CreateBody(bodyDef);
            return body;
        }

        public createChain(info: {
            w: number, h: number, amt: number, x: number, y: number, degree: number,
            pinHead?: boolean, pinTail?: boolean, collideConnected?: boolean, density?: number, overLapGap?: number
        }): any {

            var angle: number = info.degree * 0.0174533;
            if (!info.overLapGap) info.overLapGap = 5;
            if (!info.pinHead) info.pinHead = false;
            if (!info.pinTail) info.pinTail = false;
            if (!info.collideConnected) info.collideConnected = false;
            if (!info.density) info.density = 1;

            //revolute join to connect entire rope sections
            var ropeRevoluteD: box2d.b2RevoluteJointDef = new box2d.b2RevoluteJointDef();
            ropeRevoluteD.collideConnected = info.collideConnected;

            var previous: box2d.b2Body;
            var boxInfo: MakeInfo = new MakeInfo({ w: info.h, h: info.w, angle: angle, createType: MakeInfo.MAKE_BOX_CENTER, density: info.density });

            var result: CreateChainResult = {};
            var firstBody: box2d.b2Body;
            var lastBody: box2d.b2Body;
            result.bodies = [];
            result.revoulteJoints = [];

            for (var k: number = 0; k < info.amt; k++) {

                var angleAddX: number = (Math.cos(angle) * (info.h - info.overLapGap));
                var angleAddY: number = (Math.sin(angle) * (info.h - info.overLapGap));
                boxInfo.x = info.x + angleAddX * k;
                boxInfo.y = info.y + angleAddY * k;

                var madeBody = this.create(boxInfo);
                result.bodies.push(madeBody);
                if (k == 0) firstBody = madeBody;
                if (k == info.amt - 1) lastBody = madeBody;

                if (previous) {
                    var anchor = madeBody.GetPosition().Clone();
                    anchor.x -= (Math.cos(angle) * info.h) / 60; //half of the rope height plus angle offset
                    anchor.y -= (Math.sin(angle) * info.h) / 60; //half of the rope height plus angle offset
                    ropeRevoluteD.Initialize(previous, madeBody, anchor);
                    this.world.CreateJoint(ropeRevoluteD);
                    result.revoulteJoints.push(this.world.CreateJoint(ropeRevoluteD));
                }
                previous = madeBody;

            }

            //use a rope joint to ensure the length of the rope stay constant
            var ropeJointD: box2d.b2RopeJointDef = new box2d.b2RopeJointDef();
            ropeJointD.bodyA = firstBody;
            //first local anchor is the ropeTop circle, location zero 
            ropeJointD.localAnchorA = new box2d.b2Vec2(0, 0);
            //second anchor is the last part of the rope body, add half of its height
            ropeJointD.localAnchorB = new box2d.b2Vec2(0, 0);
            //maxLength = distance between ropeTop and last part of the rope, plus half of the rope body height
            ropeJointD.maxLength = MakeInfo.round((info.h - info.overLapGap) * info.amt / 30);
            //last rope part
            ropeJointD.bodyB = lastBody;
            result.ropeJoint = this.world.CreateJoint(ropeJointD);

            if (info.pinHead) {
                //create a static item to pin on the head
                var cirInfo: MakeInfo = new MakeInfo({ x: info.x, y: info.y, radius: 4, createType: MakeInfo.MAKE_CIRCLE, isStatic: true });
                var headCircle = this.create(cirInfo);
                ropeRevoluteD.Initialize(headCircle, firstBody, headCircle.GetPosition().Clone());
                result.headPin = headCircle;
                result.headJoint = <box2d.b2RevoluteJoint> this.world.CreateJoint(ropeRevoluteD);
            }

            if (info.pinTail) {
                //create a static item to pin on the head
                var lx: number = lastBody.GetPosition().x * 30;
                var ly: number = lastBody.GetPosition().y * 30;
                var cirInfo: MakeInfo = new MakeInfo({ x: lx, y: ly, radius: 4, createType: MakeInfo.MAKE_CIRCLE, isStatic: true });
                var tailCircle = this.create(cirInfo);
                ropeRevoluteD.Initialize(tailCircle, lastBody, tailCircle.GetPosition().Clone());
                this.world.CreateJoint(ropeRevoluteD);
                result.tailPin = tailCircle;
                result.tailJoint = <box2d.b2RevoluteJoint> this.world.CreateJoint(ropeRevoluteD);
            }

            return result;

        }

    }
}

