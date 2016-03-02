//module steer {
var box2dts;
(function (box2dts) {
    var ItemBase = (function () {
        function ItemBase(name) {
            var objectName = this.constructor["name"];
            if (name == null)
                name = objectName + "_" + ItemBase.addCounter(objectName);
            this.name = name;
            this.type = objectName;
        }
        ItemBase.addCounter = function (type) {
            if (ItemBase.uniqueNameCounters[type] == null)
                ItemBase.uniqueNameCounters[type] = 0;
            ItemBase.uniqueNameCounters[type]++;
            return ItemBase.uniqueNameCounters[type].toString(36);
        };
        ItemBase.prototype.remove = function () { };
        ItemBase.uniqueNameCounters = {};
        return ItemBase;
    })();
    box2dts.ItemBase = ItemBase;
})(box2dts || (box2dts = {}));
var box2dts;
(function (box2dts) {
    var BoxMaker = (function () {
        function BoxMaker(world) {
            this.world = world;
        }
        BoxMaker.prototype.create = function (info) {
            if (info.createType == null) {
                console.error("createType not defined");
                return;
            }
            var useInfo = info.clone();
            var body = this.createbody(info);
            switch (info.createType) {
                case box2dts.MakeInfo.BOX_TOP_LEFT:
                case box2dts.MakeInfo.BOX_CENTER:
                    this.createBoxDef(body, useInfo);
                    break;
                case box2dts.MakeInfo.CIRCLE:
                    this.createCircleDef(body, useInfo);
                    break;
                case box2dts.MakeInfo.POLYGON:
                    this.createPolygonDef(body, useInfo);
                    break;
                case box2dts.MakeInfo.EDGE:
                    this.createEdge(body, useInfo);
                    break;
                case box2dts.MakeInfo.COMPOUND:
                    for (var p = 0; p < useInfo.makeInfos.length; p++) {
                        switch (useInfo.makeInfos[p].createType) {
                            case box2dts.MakeInfo.BOX_TOP_LEFT:
                            case box2dts.MakeInfo.BOX_CENTER:
                                var loopClone = useInfo.makeInfos[p].clone();
                                var newFixture = this.createBoxDef(body, loopClone, loopClone.x, loopClone.y);
                                if (loopClone.fixtureData)
                                    newFixture.fixtureData = loopClone.fixtureData;
                                break;
                            case box2dts.MakeInfo.CIRCLE:
                                var loopClone = useInfo.makeInfos[p].clone();
                                var newFixture = this.createCircleDef(body, loopClone, loopClone.x, loopClone.y);
                                if (loopClone.fixtureData)
                                    newFixture.fixtureData = loopClone.fixtureData;
                                break;
                            case box2dts.MakeInfo.POLYGON:
                                var loopClone = useInfo.makeInfos[p].clone(true);
                                var newFixture = this.createPolygonDef(body, loopClone);
                                if (loopClone.fixtureData)
                                    newFixture.fixtureData = loopClone.fixtureData;
                                break;
                            case box2dts.MakeInfo.EDGE:
                                var loopClone = useInfo.makeInfos[p].clone(true);
                                var newFixtures = this.createEdge(body, loopClone);
                                if (loopClone.fixtureData) {
                                    for (var k = 0; k < newFixtures.length; k++) {
                                        newFixtures[k].fixtureData = loopClone.fixtureData;
                                    }
                                }
                                break;
                        }
                    }
                    break;
            }
            if (useInfo.userData)
                body.SetUserData(useInfo.userData);
            body.SetPositionXY(useInfo.x, useInfo.y);
            return body;
        };
        BoxMaker.prototype.createEdge = function (body, useInfo) {
            var fixtureDef = this.createFixtureDef(useInfo);
            var edge = new box2d.b2EdgeShape();
            var fixtures = [];
            if (useInfo.b2Vertices.length == 2) {
                edge.SetAsEdge(useInfo.b2Vertices[0], useInfo.b2Vertices[1]);
                fixtureDef.shape = edge;
                fixtures.push(body.CreateFixture(fixtureDef));
            }
            else {
                if (!useInfo.loopEdge) {
                    edge.SetAsEdge(useInfo.b2Vertices[0], useInfo.b2Vertices[1]);
                    edge.m_hasVertex3 = true;
                    edge.m_vertex3.Copy(useInfo.b2Vertices[2]);
                    fixtureDef.shape = edge;
                    fixtures.push(body.CreateFixture(fixtureDef));
                    for (var p = 1; p < useInfo.b2Vertices.length - 1; p++) {
                        var current = useInfo.b2Vertices[p];
                        var next = useInfo.b2Vertices[p + 1];
                        edge.SetAsEdge(current, next);
                        if (useInfo.b2Vertices[p - 1]) {
                            edge.m_hasVertex0 = true;
                            edge.m_vertex0.Copy(useInfo.b2Vertices[p - 1]);
                        }
                        if (useInfo.b2Vertices[p + 2]) {
                            edge.m_hasVertex3 = true;
                            edge.m_vertex3.Copy(useInfo.b2Vertices[p + 2]);
                        }
                        fixtureDef.shape = edge;
                        fixtures.push(body.CreateFixture(fixtureDef));
                    }
                }
                else {
                    edge.SetAsEdge(useInfo.b2Vertices[0], useInfo.b2Vertices[1]);
                    edge.m_hasVertex0 = true;
                    edge.m_vertex3.Copy(useInfo.b2Vertices[useInfo.b2Vertices.length - 1]);
                    edge.m_hasVertex3 = true;
                    edge.m_vertex3.Copy(useInfo.b2Vertices[2]);
                    fixtureDef.shape = edge;
                    fixtures.push(body.CreateFixture(fixtureDef));
                    for (var p = 1; p < useInfo.b2Vertices.length; p++) {
                        var current = useInfo.b2Vertices[p];
                        var next = useInfo.b2Vertices[p + 1];
                        if (next == null) {
                            next = useInfo.b2Vertices[0];
                        }
                        else {
                        }
                        edge.SetAsEdge(current, next);
                        if (useInfo.b2Vertices[p - 1]) {
                            edge.m_hasVertex0 = true;
                            edge.m_vertex0.Copy(useInfo.b2Vertices[p - 1]);
                        }
                        var weldNext = useInfo.b2Vertices[p + 2];
                        if (weldNext == null) {
                            weldNext = useInfo.b2Vertices[(p + 2) % useInfo.b2Vertices.length];
                        }
                        else {
                        }
                        edge.m_hasVertex3 = true;
                        edge.m_vertex3.Copy(weldNext);
                        fixtureDef.shape = edge;
                        fixtures.push(body.CreateFixture(fixtureDef));
                    }
                }
            }
            return fixtures;
        };
        BoxMaker.prototype.createBoxDef = function (body, useInfo, offsetX, offsetY) {
            if (offsetX === void 0) { offsetX = 0; }
            if (offsetY === void 0) { offsetY = 0; }
            var fixtureDef = this.createFixtureDef(useInfo);
            var poly = new box2d.b2PolygonShape();
            var center = new box2d.b2Vec2(offsetX, offsetY);
            if (useInfo.createType == box2dts.MakeInfo.BOX_TOP_LEFT) {
                center.x += useInfo.w * .5;
                center.y += useInfo.h * .5;
            }
            poly.SetAsBox(useInfo.w * .5, useInfo.h * .5, center, 0);
            fixtureDef.shape = poly;
            return body.CreateFixture(fixtureDef);
        };
        BoxMaker.prototype.createCircleDef = function (body, useInfo, offsetX, offsetY) {
            if (offsetX === void 0) { offsetX = 0; }
            if (offsetY === void 0) { offsetY = 0; }
            var fixtureDef = this.createFixtureDef(useInfo);
            var circle = new box2d.b2CircleShape();
            circle.m_radius = useInfo.radius;
            circle.m_p.Set(offsetX, offsetY);
            fixtureDef.shape = circle;
            return body.CreateFixture(fixtureDef);
        };
        BoxMaker.prototype.createPolygonDef = function (body, useInfo) {
            var fixtureDef = this.createFixtureDef(useInfo);
            var polyv = new box2d.b2PolygonShape();
            polyv.Set(useInfo.b2Vertices);
            fixtureDef.shape = polyv;
            return body.CreateFixture(fixtureDef);
        };
        BoxMaker.prototype.createFixtureDef = function (info) {
            var fixDef = new box2d.b2FixtureDef();
            fixDef.density = info.density;
            fixDef.friction = info.friction;
            fixDef.restitution = info.restitution;
            fixDef.isSensor = info.isSensor;
            if (info.maskBits)
                fixDef.filter.maskBits = info.maskBits;
            if (info.categoryBits)
                fixDef.filter.categoryBits = info.categoryBits;
            return fixDef;
        };
        BoxMaker.prototype.createbody = function (info) {
            var bodyDef = new box2d.b2BodyDef();
            bodyDef.type = box2d.b2BodyType.b2_dynamicBody;
            bodyDef.allowSleep = info.allowSleep;
            bodyDef.fixedRotation = info.fixedRotation;
            if (info.isStatic)
                bodyDef.type = box2d.b2BodyType.b2_staticBody;
            if (info.angle)
                bodyDef.angle = info.angle;
            if (info.bullet == true)
                bodyDef.bullet = true;
            var body = this.world.CreateBody(bodyDef);
            return body;
        };
        BoxMaker.prototype.createChain = function (info) {
            var angle = info.degree * 0.0174533;
            if (!info.overLapGap)
                info.overLapGap = 5;
            if (!info.pinHead)
                info.pinHead = false;
            if (!info.pinTail)
                info.pinTail = false;
            if (!info.collideConnected)
                info.collideConnected = false;
            if (!info.density)
                info.density = 1;
            var ropeRevoluteD = new box2d.b2RevoluteJointDef();
            ropeRevoluteD.collideConnected = info.collideConnected;
            var previous;
            var boxInfo = new box2dts.MakeInfo({ w: info.h, h: info.w, angle: angle, createType: box2dts.MakeInfo.BOX_CENTER, density: info.density });
            var result = {};
            var firstBody;
            var lastBody;
            result.bodies = [];
            result.revoulteJoints = [];
            for (var k = 0; k < info.amt; k++) {
                var angleAddX = (Math.cos(angle) * (info.h - info.overLapGap));
                var angleAddY = (Math.sin(angle) * (info.h - info.overLapGap));
                boxInfo.x = info.x + angleAddX * k;
                boxInfo.y = info.y + angleAddY * k;
                var madeBody = this.create(boxInfo);
                result.bodies.push(madeBody);
                if (k == 0)
                    firstBody = madeBody;
                if (k == info.amt - 1)
                    lastBody = madeBody;
                if (previous) {
                    var anchor = madeBody.GetPosition().Clone();
                    anchor.x -= (Math.cos(angle) * info.h) / 60;
                    anchor.y -= (Math.sin(angle) * info.h) / 60;
                    ropeRevoluteD.Initialize(previous, madeBody, anchor);
                    this.world.CreateJoint(ropeRevoluteD);
                    result.revoulteJoints.push(this.world.CreateJoint(ropeRevoluteD));
                }
                previous = madeBody;
            }
            var ropeJointD = new box2d.b2RopeJointDef();
            ropeJointD.bodyA = firstBody;
            ropeJointD.localAnchorA = new box2d.b2Vec2(0, 0);
            ropeJointD.localAnchorB = new box2d.b2Vec2(0, 0);
            ropeJointD.maxLength = box2dts.MakeInfo.round((info.h - info.overLapGap) * info.amt / 30);
            ropeJointD.bodyB = lastBody;
            result.ropeJoint = this.world.CreateJoint(ropeJointD);
            if (info.pinHead) {
                var cirInfo = new box2dts.MakeInfo({ x: info.x, y: info.y, radius: 4, createType: box2dts.MakeInfo.CIRCLE, isStatic: true });
                var headCircle = this.create(cirInfo);
                ropeRevoluteD.Initialize(headCircle, firstBody, headCircle.GetPosition().Clone());
                result.headPin = headCircle;
                result.headJoint = this.world.CreateJoint(ropeRevoluteD);
            }
            if (info.pinTail) {
                var lx = lastBody.GetPosition().x * 30;
                var ly = lastBody.GetPosition().y * 30;
                var cirInfo = new box2dts.MakeInfo({ x: lx, y: ly, radius: 4, createType: box2dts.MakeInfo.CIRCLE, isStatic: true });
                var tailCircle = this.create(cirInfo);
                ropeRevoluteD.Initialize(tailCircle, lastBody, tailCircle.GetPosition().Clone());
                this.world.CreateJoint(ropeRevoluteD);
                result.tailPin = tailCircle;
                result.tailJoint = this.world.CreateJoint(ropeRevoluteD);
            }
            return result;
        };
        return BoxMaker;
    })();
    box2dts.BoxMaker = BoxMaker;
})(box2dts || (box2dts = {}));
var box2dts;
(function (box2dts) {
    var MakeInfo = (function () {
        function MakeInfo(setting) {
            this.x = 0;
            this.y = 0;
            this.w = 0;
            this.h = 0;
            this.radius = 0;
            this.allowSleep = true;
            this.isStatic = false;
            this.density = 1;
            this.friction = 0.2;
            this.restitution = 0;
            this.fixedRotation = false;
            this.loopEdge = false;
            this.isSensor = false;
            for (var p in setting) {
                this[p] = setting[p];
            }
        }
        MakeInfo.round = function (num) { return Math.round(num * 1000) / 1000; };
        MakeInfo.random = function (min, max, round) {
            if (round === void 0) { round = true; }
            var range = Math.random() * (max - min) + min;
            if (round)
                range = MakeInfo.round(range);
            return range;
        };
        MakeInfo.div30 = function (value) {
            return MakeInfo.round(value / 30);
        };
        MakeInfo.getb2Vec2 = function (input) {
            if (this.usePixelScale) {
                var x = MakeInfo.round(input.x / 30);
                var y = MakeInfo.round(input.y / 30);
                return new box2d.b2Vec2(x, y);
            }
            else {
                return input;
            }
        };
        MakeInfo.prototype.clone = function (offset) {
            if (offset === void 0) { offset = false; }
            var newInfo = new MakeInfo(null);
            for (var p in this) {
                if (typeof this[p] == "number" || typeof this[p] == "boolean" || typeof this[p] == "string") {
                    newInfo[p] = this[p];
                }
            }
            if (this.makeInfos) {
                newInfo.makeInfos = this.makeInfos;
            }
            if (this.userData)
                newInfo.userData = this.userData;
            if (this.fixtureData)
                newInfo.fixtureData = this.fixtureData;
            var ox = 0;
            var oy = 0;
            if (offset)
                ox += this.x;
            if (offset)
                oy += this.y;
            this.x += ox;
            this.y += oy;
            if (this.vertices) {
                newInfo.vertices = [];
                newInfo.b2Vertices = [];
                for (var k = 0; k < this.vertices.length; k++) {
                    newInfo.vertices.push({ x: this.vertices[k].x + ox, y: this.vertices[k].y + oy });
                    newInfo.b2Vertices.push(new box2d.b2Vec2(this.vertices[k].x + ox, this.vertices[k].y + oy));
                }
            }
            var divNames = ["x", "y", "w", "h", "radius"];
            var arrayNames = ["vertices", "b2Vertices"];
            if (MakeInfo.usePixelScale) {
                for (var p in newInfo) {
                    if (divNames.indexOf(p) > -1) {
                        newInfo[p] = MakeInfo.div30(newInfo[p]);
                    }
                    if (arrayNames.indexOf(p) > -1) {
                        for (var k = 0; k < newInfo[p].length; k++) {
                            newInfo[p][k].x = MakeInfo.div30(newInfo[p][k].x);
                            newInfo[p][k].y = MakeInfo.div30(newInfo[p][k].y);
                        }
                    }
                }
            }
            return newInfo;
        };
        MakeInfo.ONED = Math.PI / 180;
        MakeInfo.usePixelScale = true;
        MakeInfo.BOX_TOP_LEFT = 1;
        MakeInfo.BOX_CENTER = 2;
        MakeInfo.POLYGON = 3;
        MakeInfo.CIRCLE = 4;
        MakeInfo.EDGE = 5;
        MakeInfo.COMPOUND = 6;
        return MakeInfo;
    })();
    box2dts.MakeInfo = MakeInfo;
})(box2dts || (box2dts = {}));
var box2dts;
(function (box2dts) {
    var BaseRender = (function () {
        function BaseRender() {
        }
        return BaseRender;
    })();
    box2dts.BaseRender = BaseRender;
})(box2dts || (box2dts = {}));
