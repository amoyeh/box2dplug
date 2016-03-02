var box2dp;
(function (box2dp) {
    var Color = (function () {
        function Color() {
            this.BACKGROUND = 0xF4F4F4;
            this.ITEM_STATIC = 0x555555;
            this.ITEM_DYNAMIC = 0x888888;
            this.ITEM_ALPHA = 1;
            this.LINE_CENTER_X = 0xffb9b2;
            this.LINE_CENTER_Y = 0xc3ffb2;
            this.LINE_BOUNDARY = 0xBBBBBB;
            this.PATH_LINE = 0x9650A0;
            this.PATH_LINEA = 0.4;
            this.PATH_FORCE = 0xde7717;
            this.PATH_FORCEA = 0.4;
            this.SELECTION_LINE_SIZE = 1;
            this.SELECTION_LINE_COLOR = 0xEFEFEF;
            this.SELECTION_LINE_ALPHA = .4;
            this.VELOCITY = 0xFFFFFF;
            this.VELOCITY_ALPHA = 0.6;
            this.ALIGNMENT = 0x50825A;
            this.ALIGNMENT_ALPHA = 0.3;
            this.COHESION = 0x5A8282;
            this.COHESION_ALPHA = 0.3;
            this.SEPARATION = 0xE65050;
            this.SEPARATION_ALPHA = 0.3;
            this.RAYCAST = 0xFFFFFF;
            this.RAYCAST_ALPHA = 0.1;
            this.AVOID_SHAPE = 0xCC6666;
            this.AVOID_SHAPE_ALPHA = 1;
            this.GRID = 0x66FFFF;
            this.GRID_ALPHA = 0.1;
            this.SENSOR = 0xFFDD88;
            this.SENSOR_ALPHA = 0.3;
            this.BOUND = 0x55CCCC;
            this.BOUND_ALPHA = 0.5;
            this.WANDER = 0x969696;
            this.WANDER_ALPHA = 0.3;
            this.QUADTREE = 0x55CCCC;
            this.QUADTREE_A = 0.2;
        }
        Color.DarkTheme = function () {
            var color = new Color();
            color.BACKGROUND = 0x181818;
            color.ITEM_STATIC = 0x494949;
            color.ITEM_DYNAMIC = 0x808080;
            color.ITEM_ALPHA = 1;
            color.LINE_CENTER_X = 0xFFAD99;
            color.LINE_CENTER_Y = 0xADFF99;
            color.LINE_BOUNDARY = 0x6F586F;
            color.PATH_LINE = 0x9650A0;
            color.PATH_LINEA = 0.4;
            color.PATH_FORCE = 0xde7717;
            color.PATH_FORCEA = 0.4;
            color.SELECTION_LINE_SIZE = 1;
            color.SELECTION_LINE_COLOR = 0xEFEFEF;
            color.SELECTION_LINE_ALPHA = .4;
            color.VELOCITY = 0xFFFFFF;
            color.VELOCITY_ALPHA = 0.6;
            color.ALIGNMENT = 0x50825A;
            color.ALIGNMENT_ALPHA = 0.3;
            color.COHESION = 0x5A8282;
            color.COHESION_ALPHA = 0.3;
            color.SEPARATION = 0xE65050;
            color.SEPARATION_ALPHA = 0.3;
            color.RAYCAST = 0xFFFFFF;
            color.RAYCAST_ALPHA = 0.1;
            color.AVOID_SHAPE = 0xCC6666;
            color.AVOID_SHAPE_ALPHA = 1;
            color.GRID = 0x66FFFF;
            color.GRID_ALPHA = 0.1;
            color.SENSOR = 0xFFDD88;
            color.SENSOR_ALPHA = 0.3;
            color.BOUND = 0x55CCCC;
            color.BOUND_ALPHA = 0.5;
            color.WANDER = 0x969696;
            color.WANDER_ALPHA = 0.3;
            color.QUADTREE = 0x55CCCC;
            color.QUADTREE_A = 0.2;
            return color;
        };
        Color.prototype.getItemStaticColor = function () {
            return this.ITEM_STATIC;
        };
        Color.prototype.getItemDynamicColor = function () {
            return this.ITEM_DYNAMIC;
        };
        Color.prototype.getItemStaticMat = function () {
            if (!this.itemStaticMat) {
                this.itemStaticMat = new THREE.MeshBasicMaterial({ color: this.ITEM_STATIC, side: THREE.DoubleSide, opacity: this.ITEM_ALPHA, transparent: true });
            }
            return this.itemStaticMat;
        };
        Color.prototype.getItemDynamicMat = function () {
            if (!this.itemDynamicMat) {
                this.itemDynamicMat = new THREE.MeshBasicMaterial({ color: this.ITEM_DYNAMIC, side: THREE.DoubleSide, opacity: this.ITEM_ALPHA, transparent: true });
            }
            return this.itemDynamicMat;
        };
        Color.prototype.getLineMatStatic = function () {
            if (!this.lineStaticMat) {
                this.lineStaticMat = new THREE.LineBasicMaterial({ color: this.ITEM_STATIC, side: THREE.DoubleSide, opacity: this.ITEM_ALPHA, transparent: true, linewidth: 1 });
            }
            return this.lineStaticMat;
        };
        Color.prototype.getLineMatDynamic = function () {
            if (!this.lineDynamicMat) {
                this.lineDynamicMat = new THREE.LineBasicMaterial({ color: this.ITEM_DYNAMIC, side: THREE.DoubleSide, opacity: this.ITEM_ALPHA, transparent: true, linewidth: 1 });
            }
            return this.lineDynamicMat;
        };
        Color.prototype.getSensorMat = function () {
            if (!this.sensorMat) {
                this.sensorMat = new THREE.MeshBasicMaterial({ color: this.SENSOR, side: THREE.DoubleSide, opacity: this.SENSOR_ALPHA, transparent: true });
            }
            return this.sensorMat;
        };
        Color.prototype.getLineCenterXMat = function () {
            if (!this.lineCenterX) {
                this.lineCenterX = new THREE.LineBasicMaterial({ color: this.LINE_CENTER_X });
            }
            return this.lineCenterX;
        };
        Color.prototype.getLineCenterYMat = function () {
            if (!this.lineCenterY) {
                this.lineCenterY = new THREE.LineBasicMaterial({ color: this.LINE_CENTER_Y });
            }
            return this.lineCenterY;
        };
        Color.prototype.getLineBoundary = function () {
            if (!this.lineBoundary) {
                this.lineBoundary = new THREE.LineDashedMaterial({
                    color: this.LINE_BOUNDARY, linewidth: 2, dashSize: 10, gapSize: 5
                });
            }
            return this.lineBoundary;
        };
        Color.prototype.getLineQuadTree = function () {
            if (!this.lineQuadTree) {
                this.lineQuadTree = new THREE.LineBasicMaterial({ color: this.QUADTREE, side: THREE.DoubleSide, opacity: this.QUADTREE_A, transparent: true });
            }
            return this.lineQuadTree;
        };
        return Color;
    })();
    box2dp.Color = Color;
})(box2dp || (box2dp = {}));
var box2dp;
(function (box2dp) {
    var Event = (function () {
        function Event(type, target, values) {
            this.type = type;
            if (target)
                this.target = target;
            if (values)
                this.values = values;
        }
        Event.prototype.toString = function () {
            return "[event] type: " + this.type + " target: " + this.target + " values: " + this.values;
        };
        Event.ITEM_CREATED = "item_created";
        Event.BEFORE_STEP = "before_step";
        Event.AFTER_STEP = "after_step";
        Event.BEFORE_RENDER = "before_render";
        Event.AFTER_RENDER = "after_render";
        Event.BEGIN_CONTACT = "begin_contact";
        Event.END_CONTACT = "end_contact";
        return Event;
    })();
    box2dp.Event = Event;
    var EventDispatcher = (function () {
        function EventDispatcher() {
            this.callBacks = [];
        }
        EventDispatcher.prototype.addEvent = function (type, func, caller) {
            if (this.callBacks[type] == null) {
                this.callBacks[type] = [];
            }
            this.callBacks[type].push({ func: func, caller: caller });
        };
        EventDispatcher.prototype.removeEvent = function (type, func) {
            if (this.callBacks[type] != null) {
                var callbackLen = this.callBacks[type].length;
                for (var k = 0; k < callbackLen; k++) {
                    if (this.callBacks[type][k].func === func) {
                        this.callBacks[type].splice(k, 1);
                        break;
                    }
                }
            }
        };
        EventDispatcher.prototype.fireEvent = function (event) {
            if (this.callBacks[event.type] != null) {
                var callbackLen = this.callBacks[event.type].length;
                for (var k = 0; k < callbackLen; k++) {
                    this.callBacks[event.type][k].func(event, this.callBacks[event.type][k].caller);
                }
            }
        };
        return EventDispatcher;
    })();
    box2dp.EventDispatcher = EventDispatcher;
})(box2dp || (box2dp = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var box2dp;
(function (box2dp) {
    var Domain = (function (_super) {
        __extends(Domain, _super);
        function Domain(gravity, physicFixStepTime, updateMode) {
            if (updateMode === void 0) { updateMode = Domain.UPDATE_FIXED; }
            _super.call(this);
            this.world = new box2d.b2World(new box2d.b2Vec2(gravity.x, gravity.y));
            this.maker = new box2dp.BoxMaker(this.world);
            this.physicFixStepTime = physicFixStepTime;
            this.renderers = [];
            this.items = [];
            this.updateMode = updateMode;
            this.groundBody = this.world.CreateBody(new box2d.b2BodyDef());
            this.contactManager = new ContactManager(this);
            this.world.SetContactListener(this.contactManager);
        }
        Domain.addCounter = function (type) {
            if (Domain.uniqueNameCounters[type] == null)
                Domain.uniqueNameCounters[type] = 0;
            Domain.uniqueNameCounters[type]++;
            return Domain.uniqueNameCounters[type].toString(36);
        };
        Domain.prototype.setDebugDrawElements = function (canvasId, width, height) {
            this.debugDrawCanvas = document.getElementById(canvasId);
            this.debugDrawCtx = this.debugDrawCanvas.getContext("2d");
            this.debugDraw = new box2d.DebugDraw(this.debugDrawCanvas);
            this.debugDraw.SetFlags(box2d.b2DrawFlags.e_all);
            this.world.SetDebugDraw(this.debugDraw);
            this.debugDrawCanvas.width = width;
            this.debugDrawCanvas.height = height;
        };
        Domain.prototype.addRenderer = function (renderer) {
            this.renderers.push(renderer);
            renderer.domain = this;
            this.rlen = this.renderers.length;
        };
        Domain.prototype.getUniqueName = function (name) {
            var exist = false;
            for (var k = 0; k < this.items.length; k++) {
                if (this.items[k].name == name) {
                    exist = true;
                    break;
                }
            }
            if (!exist) {
                return name;
            }
            else {
                var checkName = "", addn = 1, success = false, ck = 0;
                while (!success) {
                    checkName = name + "-" + addn;
                    var checkExist = false;
                    for (var k = 0; k < this.items.length; k++) {
                        if (this.items[k].name == checkName) {
                            addn += 1;
                            checkExist = true;
                            break;
                        }
                    }
                    ck++;
                    if (ck > 100)
                        break;
                    if (checkExist == false)
                        success = true;
                }
                return checkName;
            }
        };
        Domain.prototype.create = function (makeInfo) {
            var name = makeInfo.name;
            if (makeInfo.name == null) {
                name = "ItemEntity-" + Domain.addCounter("ItemEntity");
            }
            else {
                name = this.getUniqueName(name);
            }
            var newItem = new box2dp.ItemEntity(this.maker.create(makeInfo), makeInfo.itemType, name);
            this.items.push(newItem);
            for (var k = 0; k < this.rlen; k++)
                this.renderers[k].onItemCreate(newItem);
            this.fireEvent(new box2dp.Event(box2dp.Event.ITEM_CREATED, this, newItem));
            return newItem;
        };
        Domain.prototype.step = function () {
            var ilen = this.items.length;
            if (this.quadTree) {
                this.quadTree.clear();
                for (var p = 0; p < ilen; p++) {
                    var itemSel = this.quadTree.getItemSelector(this.items[p]);
                    if (itemSel) {
                        this.quadTree.insert(itemSel);
                        this.items[p].selector = itemSel;
                    }
                }
            }
            for (var p = 0; p < ilen; p++) {
                this.items[p].integratePos(1);
                this.items[p].setOldPos();
            }
            this.fireEvent(new box2dp.Event(box2dp.Event.BEFORE_STEP, this));
            if (this.updateMode == Domain.UPDATE_FIXED) {
                this.world.Step(this.physicFixStepTime, 10, 5, 1);
            }
            else {
                if (this.lastStepTime) {
                    var timeDiff = Math.round((new Date().getTime() - this.lastStepTime) / 10) / 100;
                    this.world.Step(timeDiff, 10, 5, 1);
                }
            }
            if (this.debugDrawCtx) {
                this.debugDrawCtx.clearRect(0, 0, this.debugDrawCanvas.width, this.debugDrawCanvas.height);
                this.world.DrawDebugData();
            }
            for (var p = 0; p < ilen; p++) {
                this.items[p].setCurrentPos();
                this.items[p].updateBoundary();
            }
            this.fireEvent(new box2dp.Event(box2dp.Event.AFTER_STEP, this));
            this.lastStepTime = new Date().getTime();
        };
        Domain.prototype.render = function () {
            var timePassed = new Date().getTime() - this.lastStepTime;
            var percent;
            if (isNaN(timePassed)) {
                percent = 1;
            }
            else {
                percent = timePassed / this.stepTime;
                if (percent > 1)
                    percent = 1;
            }
            if (percent != 0 && percent != 1) {
                var ilen = this.items.length;
                for (var p = 0; p < ilen; p++)
                    this.items[p].integratePos(percent);
            }
            this.fireEvent(new box2dp.Event(box2dp.Event.BEFORE_RENDER, this, timePassed));
            for (var k = 0; k < this.rlen; k++)
                this.renderers[k].render();
            this.fireEvent(new box2dp.Event(box2dp.Event.AFTER_RENDER, this, timePassed));
        };
        Domain.prototype.run = function (stepTime, renderTime) {
            var _this = this;
            this.stepTime = stepTime;
            this.renderTime = renderTime;
            this.stepInterval = setInterval(function () { _this.step(); }, this.stepTime);
            this.renderInterval = setInterval(function () { _this.render(); }, this.renderTime);
        };
        Domain.prototype.stop = function () {
            clearInterval(this.stepInterval);
            clearInterval(this.renderInterval);
        };
        Domain.prototype.updateInterval = function (stepTime, renderTime) {
            var _this = this;
            this.stop();
            this.stepTime = stepTime;
            this.renderTime = renderTime;
            this.stepInterval = setInterval(function () { _this.step(); }, this.stepTime);
            this.renderInterval = setInterval(function () { _this.render(); }, this.renderTime);
        };
        Domain.prototype.setUpdateMode = function (mode) {
            this.updateMode = mode;
        };
        Domain.prototype.itemUnderPoint = function (lx, ly) {
            var qcb = new QueryCallBack();
            var aabb = new box2d.b2AABB();
            aabb.lowerBound.Set(lx, ly);
            aabb.upperBound.Set(lx + 0.001, ly + 0.001);
            this.world.QueryAABB(qcb, aabb);
            return qcb.itemList;
        };
        Domain.prototype.eachItem = function (callback) {
            var tempItems = this.items.concat();
            var ilen = tempItems.length;
            for (var k = ilen - 1; k > -1; k--) {
                if (callback)
                    callback(tempItems[k], k);
            }
        };
        Domain.prototype.removeItem = function (item) {
            for (var k = 0; k < this.rlen; k++)
                this.renderers[k].onItemRemove(item);
            var plen = this.items.length;
            for (var p = plen - 1; p > -1; p--) {
                if (this.items[p] === item) {
                    this.items.splice(p, 1);
                    break;
                }
            }
            item.removePhysic();
            item = null;
        };
        Domain.UPDATE_FIXED = 1;
        Domain.UPDATE_TIME_BASED = 2;
        Domain.uniqueNameCounters = {};
        return Domain;
    })(box2dp.EventDispatcher);
    box2dp.Domain = Domain;
    var ContactManager = (function () {
        function ContactManager(domain) {
            this.domain = domain;
            box2d.b2ContactListener.call(this);
        }
        ContactManager.prototype.PreSolve = function (contact, oldManifold) {
        };
        ContactManager.prototype.PostSolve = function (contact, impulse) {
        };
        ContactManager.prototype.BeginContact = function (contact) {
            var iA = contact.GetFixtureA().GetBody().item;
            var iB = contact.GetFixtureB().GetBody().item;
            if (iA && iB) {
                if (iA.enableContactEvent)
                    iA.fireEvent(new box2dp.Event(box2dp.Event.BEGIN_CONTACT, iA, { otherItem: iB }));
                if (iB.enableContactEvent)
                    iB.fireEvent(new box2dp.Event(box2dp.Event.BEGIN_CONTACT, iB, { otherItem: iA }));
            }
        };
        ContactManager.prototype.EndContact = function (contact) {
            var iA = contact.GetFixtureA().GetBody().item;
            var iB = contact.GetFixtureB().GetBody().item;
            if (iA && iB) {
                if (iA.enableContactEvent)
                    iA.fireEvent(new box2dp.Event(box2dp.Event.END_CONTACT, iA, { otherItem: iB }));
                if (iB.enableContactEvent)
                    iB.fireEvent(new box2dp.Event(box2dp.Event.END_CONTACT, iB, { otherItem: iA }));
            }
        };
        ContactManager.prototype.BeginContactFixtureParticle = function (particleSystem, particleBodyContact) {
        };
        ContactManager.prototype.EndContactFixtureParticle = function (fixture, particleSystem, particleIndex) {
        };
        ContactManager.prototype.BeginContactParticleParticle = function (particleSystem, particleContact) {
        };
        ContactManager.prototype.EndContactParticleParticle = function (particleSystem, particleIndexA, particleIndexB) {
        };
        return ContactManager;
    })();
})(box2dp || (box2dp = {}));
var DestructionListener = function () {
    this.itemList = [];
    this.particleData = [];
};
window["goog"].inherits(DestructionListener, box2d.b2DestructionListener);
DestructionListener.prototype.SayGoodbyeJoint = function (joint) { };
DestructionListener.prototype.SayGoodbyeFixture = function (fixture) { };
DestructionListener.prototype.SayGoodbyeParticleGroup = function (group) { };
DestructionListener.prototype.SayGoodbyeJoint = function (joint) { };
DestructionListener.prototype.SayGoodbyeParticle = function (particleSystem, particleIndex) { };
var QueryCallBack = function () {
    this.itemList = [];
    this.particleData = [];
};
window["goog"].inherits(QueryCallBack, box2d.b2QueryCallback);
QueryCallBack.prototype.ReportFixture = function (fixture) {
    this.itemList.push(fixture);
    return true;
};
QueryCallBack.prototype.ReportParticle = function (particleSystem, index) {
    this.particleData.push({ index: index, system: particleSystem });
    return true;
};
var RayCastCallback = function () {
    box2d.b2RayCastCallback.call(this);
    this.itemList = [];
};
window["goog"].inherits(RayCastCallback, box2d.b2RayCastCallback);
RayCastCallback.prototype.ReportFixture = function (fixture, point, normal, fraction) {
    this.itemList.push({ "fixture": fixture, "point": point.Clone(), "normal": normal.Clone(), "fraction": fraction });
};
var box2dp;
(function (box2dp) {
    var ItemBase = (function (_super) {
        __extends(ItemBase, _super);
        function ItemBase(name) {
            _super.call(this);
            this.name = name;
        }
        ItemBase.prototype.remove = function () { };
        ItemBase.SHAPE = 1;
        ItemBase.SENSOR = 2;
        ItemBase.UNIT = 3;
        ItemBase.PATH = 4;
        return ItemBase;
    })(box2dp.EventDispatcher);
    box2dp.ItemBase = ItemBase;
})(box2dp || (box2dp = {}));
var box2dp;
(function (box2dp) {
    var ItemEntity = (function (_super) {
        __extends(ItemEntity, _super);
        function ItemEntity(b2body, type, name) {
            _super.call(this, name);
            this.enableContactEvent = false;
            this.type = type;
            this.b2body = b2body;
            this.b2body.item = this;
            this.setOldPos();
            this.setCurrentPos();
            this.updateBoundary();
            this.display = {};
            this.enableContactEvent = (this.type == box2dp.ItemBase.SENSOR);
        }
        ItemEntity.prototype.setOldPos = function () {
            this.oldx = box2dp.MakeInfo.mult30(this.b2body.GetPosition().x);
            this.oldy = box2dp.MakeInfo.mult30(this.b2body.GetPosition().y);
            this.oldr = this.b2body.GetAngle();
        };
        ItemEntity.prototype.setCurrentPos = function () {
            this.cx = box2dp.MakeInfo.mult30(this.b2body.GetPosition().x);
            this.cy = box2dp.MakeInfo.mult30(this.b2body.GetPosition().y);
            this.cr = this.b2body.GetAngle();
        };
        ItemEntity.prototype.integratePos = function (percent) {
            this.ix = Math.round(this.oldx + ((this.cx - this.oldx) * percent));
            this.iy = Math.round(this.oldy + ((this.cy - this.oldy) * percent));
            this.ir = this.oldr + ((this.cr - this.oldr) * percent);
        };
        ItemEntity.prototype.getb2X = function () {
            return this.b2body.GetPosition().x;
        };
        ItemEntity.prototype.getb2Y = function () {
            return this.b2body.GetPosition().y;
        };
        ItemEntity.prototype.getPixelX = function () {
            return Math.round(this.b2body.GetPosition().x * 30);
        };
        ItemEntity.prototype.getPixelY = function () {
            return Math.round(this.b2body.GetPosition().y * 30);
        };
        ItemEntity.prototype.updateBoundary = function () {
            var bodyAABB = new box2d.b2AABB();
            bodyAABB.lowerBound = new box2d.b2Vec2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
            bodyAABB.upperBound = new box2d.b2Vec2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
            for (var f = this.b2body.GetFixtureList(); f; f = f.GetNext()) {
                var shape = f.GetShape();
                for (var c = 0; c < shape.GetChildCount(); c++)
                    bodyAABB.Combine1(f.GetAABB(c));
            }
            var tx = bodyAABB.lowerBound.x;
            var ty = bodyAABB.lowerBound.y;
            var tw = bodyAABB.upperBound.x - bodyAABB.lowerBound.x;
            var th = bodyAABB.upperBound.y - bodyAABB.lowerBound.y;
            this.boundary = { x: tx, y: ty, w: tw, h: th };
            this.boundaryMult = { x: box2dp.MakeInfo.mult30(tx), y: box2dp.MakeInfo.mult30(ty), w: box2dp.MakeInfo.mult30(tw), h: box2dp.MakeInfo.mult30(th) };
        };
        ItemEntity.prototype.getBoundary = function (mult30, useLocal) {
            var useb = this.boundary;
            if (mult30)
                useb = this.boundaryMult;
            var rb = { x: useb.x, y: useb.y, w: useb.w, h: useb.h };
            if (useLocal) {
                if (mult30) {
                    rb.x -= box2dp.MakeInfo.mult30(this.b2body.GetPosition().x);
                    rb.y -= box2dp.MakeInfo.mult30(this.b2body.GetPosition().y);
                }
                else {
                    rb.x -= this.b2body.GetPosition().x;
                    rb.y -= this.b2body.GetPosition().y;
                }
            }
            return rb;
        };
        ItemEntity.prototype.setb2Position = function (x, y) {
            this.b2body.SetPosition(new box2d.b2Vec2(x, y));
        };
        ItemEntity.prototype.setPixelPosition = function (x, y) {
            this.b2body.SetPosition(new box2d.b2Vec2(x / 30, y / 30));
        };
        ItemEntity.prototype.setDynamic = function (isDynamic) {
            if (this.b2body) {
                if (this.b2body.GetType() === box2d.b2BodyType.b2_dynamicBody) {
                    this.b2body.SetType(box2d.b2BodyType.b2_staticBody);
                }
                else if (this.b2body.GetType() === box2d.b2BodyType.b2_staticBody) {
                    this.b2body.SetType(box2d.b2BodyType.b2_dynamicBody);
                }
                this.dynamic = isDynamic;
            }
        };
        ItemEntity.prototype.setCollisionMask = function (maskBits) {
            var fixture = this.b2body.GetFixtureList();
            while (fixture != null) {
                var b2Filter = fixture.GetFilterData();
                b2Filter.maskBits = maskBits;
                fixture.SetFilterData(b2Filter);
                fixture = fixture.GetNext();
            }
        };
        ItemEntity.prototype.removePhysic = function () {
            this.b2body.SetUserData(undefined);
            this.b2body.GetWorld().DestroyBody(this.b2body);
            this.b2body.item = undefined;
            this.b2body = undefined;
            this.display = undefined;
        };
        return ItemEntity;
    })(box2dp.ItemBase);
    box2dp.ItemEntity = ItemEntity;
})(box2dp || (box2dp = {}));
var box2dp;
(function (box2dp) {
    var QuadNode = (function () {
        function QuadNode(x, y, w, h, depth, maxChildren, maxDepth) {
            if (maxChildren === void 0) { maxChildren = 3; }
            if (maxDepth === void 0) { maxDepth = 4; }
            this.items = [];
            this.nodes = [];
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
            this.depth = depth;
            this.maxChildren = maxChildren;
            this.maxDepth = maxDepth;
        }
        QuadNode.prototype.retrieve = function (selector, callback, instance) {
            var _this = this;
            var itemsLen = this.items.length;
            for (var i = 0; i < itemsLen; ++i) {
                (instance) ? callback.call(instance, this.items[i]) : callback(this.items[i]);
            }
            if (this.nodes.length) {
                this.findOverlappingNodes(selector, function (dir) {
                    _this.nodes[dir].retrieve(selector, callback, instance);
                });
            }
        };
        QuadNode.prototype.findOverlappingNodes = function (item, callback) {
            if (item.x < this.x + (this.width / 2)) {
                if (item.y < this.y + (this.height / 2)) {
                    callback(QuadNode.TOP_LEFT);
                }
                if (item.y + item.height >= this.y + this.height / 2) {
                    callback(QuadNode.BOTTOM_LEFT);
                }
            }
            if (item.x + item.width >= this.x + (this.width / 2)) {
                if (item.y < this.y + (this.height / 2)) {
                    callback(QuadNode.TOP_RIGHT);
                }
                if (item.y + item.height >= this.y + this.height / 2) {
                    callback(QuadNode.BOTTOM_RIGHT);
                }
            }
        };
        QuadNode.prototype.findInsertNode = function (item) {
            if (item.x + item.width < this.x + (this.width / 2)) {
                if (item.y + item.height < this.y + (this.height / 2)) {
                    return QuadNode.TOP_LEFT;
                }
                if (item.y >= this.y + (this.height / 2)) {
                    return QuadNode.BOTTOM_LEFT;
                }
                return QuadNode.PARENT;
            }
            if (item.x >= this.x + (this.width / 2)) {
                if (item.y + item.height < this.y + (this.height / 2)) {
                    return QuadNode.TOP_RIGHT;
                }
                if (item.y >= this.y + (this.height / 2)) {
                    return QuadNode.BOTTOM_RIGHT;
                }
                return QuadNode.PARENT;
            }
            return QuadNode.PARENT;
        };
        QuadNode.prototype.insert = function (item) {
            var dirType;
            if (this.nodes.length > 0) {
                dirType = this.findInsertNode(item);
                if (dirType === QuadNode.PARENT) {
                    this.items.push(item);
                    item.parent = this;
                }
                else {
                    this.nodes[dirType].insert(item);
                    item.parent = this.nodes[dirType];
                }
            }
            else {
                this.items.push(item);
                item.parent = this;
                if (this.items.length > this.maxChildren && this.depth < this.maxDepth) {
                    this.divide();
                }
            }
        };
        QuadNode.prototype.divide = function () {
            var tw, th, i, oldChildren;
            var childrenDepth = this.depth + 1;
            tw = (this.width / 2);
            th = (this.height / 2);
            this.nodes.push(new QuadNode(this.x, this.y, tw, th, childrenDepth, this.maxChildren, this.maxDepth));
            this.nodes.push(new QuadNode(this.x + tw, this.y, tw, th, childrenDepth, this.maxChildren, this.maxDepth));
            this.nodes.push(new QuadNode(this.x, this.y + th, tw, th, childrenDepth, this.maxChildren, this.maxDepth));
            this.nodes.push(new QuadNode(this.x + tw, this.y + th, tw, th, childrenDepth, this.maxChildren, this.maxDepth));
            oldChildren = this.items;
            this.items = [];
            for (i = 0; i < oldChildren.length; i++) {
                this.insert(oldChildren[i]);
            }
        };
        QuadNode.prototype.clear = function () {
            var nodeLen = this.nodes.length;
            while (nodeLen--)
                this.nodes[nodeLen].clear();
            this.items = [];
            this.nodes = [];
        };
        QuadNode.TOP_LEFT = 0;
        QuadNode.TOP_RIGHT = 1;
        QuadNode.BOTTOM_LEFT = 2;
        QuadNode.BOTTOM_RIGHT = 3;
        QuadNode.PARENT = 4;
        return QuadNode;
    })();
    box2dp.QuadNode = QuadNode;
    var QuadSelector = (function () {
        function QuadSelector(x, y, width, height, data) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.data = data;
        }
        QuadSelector.prototype.toString = function () {
            return "x:" + this.x + " y:" + this.y + " w: " + this.width + " h: " + this.height;
        };
        return QuadSelector;
    })();
    box2dp.QuadSelector = QuadSelector;
    var QuadTree = (function () {
        function QuadTree(x, y, w, h, maxChildren, maxDepth) {
            if (maxChildren === void 0) { maxChildren = 3; }
            if (maxDepth === void 0) { maxDepth = 4; }
            this.drawDebug = false;
            this.rootNode = new QuadNode(x, y, w, h, 0, maxChildren, maxDepth);
        }
        QuadTree.prototype.insert = function (item) {
            this.rootNode.insert(item);
        };
        QuadTree.prototype.retrieve = function (selector, callback, instance) {
            return this.rootNode.retrieve(selector, callback, instance);
        };
        QuadTree.prototype.clear = function () {
            this.rootNode.clear();
        };
        QuadTree.prototype.getItemSelector = function (itemIn) {
            var result;
            if (itemIn["b2body"] != null) {
                var item = itemIn;
                var bbox = item.getBoundary(false, false);
                result = new QuadSelector(bbox.x, bbox.y, bbox.w, bbox.h, itemIn);
            }
            return result;
        };
        QuadTree.prototype.quadTreeSelect = function (item) {
            var result = [];
            var useSelector = item.selector;
            this.retrieve(useSelector, function (itemFound) {
                if (itemFound.data != item) {
                    result.push(itemFound);
                }
            });
            return (result.length > 0) ? result : null;
        };
        return QuadTree;
    })();
    box2dp.QuadTree = QuadTree;
})(box2dp || (box2dp = {}));
var box2dp;
(function (box2dp) {
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
                case box2dp.MakeInfo.MAKE_BOX_TOP_LEFT:
                case box2dp.MakeInfo.MAKE_BOX_CENTER:
                    this.createBoxDef(body, useInfo);
                    break;
                case box2dp.MakeInfo.MAKE_CIRCLE:
                    this.createCircleDef(body, useInfo);
                    break;
                case box2dp.MakeInfo.MAKE_POLYGON:
                    this.createPolygonDef(body, useInfo);
                    break;
                case box2dp.MakeInfo.MAKE_EDGE:
                    this.createEdge(body, useInfo);
                    break;
                case box2dp.MakeInfo.MAKE_COMPOUND:
                    for (var p = 0; p < useInfo.makeInfos.length; p++) {
                        switch (useInfo.makeInfos[p].createType) {
                            case box2dp.MakeInfo.MAKE_BOX_TOP_LEFT:
                            case box2dp.MakeInfo.MAKE_BOX_CENTER:
                                var loopClone = useInfo.makeInfos[p].clone();
                                var newFixture = this.createBoxDef(body, loopClone, loopClone.x, loopClone.y);
                                if (loopClone.fixtureData)
                                    newFixture.fixtureData = loopClone.fixtureData;
                                break;
                            case box2dp.MakeInfo.MAKE_CIRCLE:
                                var loopClone = useInfo.makeInfos[p].clone();
                                var newFixture = this.createCircleDef(body, loopClone, loopClone.x, loopClone.y);
                                if (loopClone.fixtureData)
                                    newFixture.fixtureData = loopClone.fixtureData;
                                break;
                            case box2dp.MakeInfo.MAKE_POLYGON:
                                var loopClone = useInfo.makeInfos[p].clone(true);
                                var newFixture = this.createPolygonDef(body, loopClone);
                                if (loopClone.fixtureData)
                                    newFixture.fixtureData = loopClone.fixtureData;
                                break;
                            case box2dp.MakeInfo.MAKE_EDGE:
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
            if (useInfo.createType == box2dp.MakeInfo.MAKE_BOX_TOP_LEFT) {
                center.x += useInfo.w * .5;
                center.y += useInfo.h * .5;
            }
            poly.SetAsBox(useInfo.w * .5, useInfo.h * .5, center);
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
            if (info.angle)
                bodyDef.angle = info.angle;
            if (info.isStatic)
                bodyDef.type = box2d.b2BodyType.b2_staticBody;
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
            var boxInfo = new box2dp.MakeInfo({ w: info.h, h: info.w, angle: angle, createType: box2dp.MakeInfo.MAKE_BOX_CENTER, density: info.density });
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
            ropeJointD.maxLength = box2dp.MakeInfo.round((info.h - info.overLapGap) * info.amt / 30);
            ropeJointD.bodyB = lastBody;
            result.ropeJoint = this.world.CreateJoint(ropeJointD);
            if (info.pinHead) {
                var cirInfo = new box2dp.MakeInfo({ x: info.x, y: info.y, radius: 4, createType: box2dp.MakeInfo.MAKE_CIRCLE, isStatic: true });
                var headCircle = this.create(cirInfo);
                ropeRevoluteD.Initialize(headCircle, firstBody, headCircle.GetPosition().Clone());
                result.headPin = headCircle;
                result.headJoint = this.world.CreateJoint(ropeRevoluteD);
            }
            if (info.pinTail) {
                var lx = lastBody.GetPosition().x * 30;
                var ly = lastBody.GetPosition().y * 30;
                var cirInfo = new box2dp.MakeInfo({ x: lx, y: ly, radius: 4, createType: box2dp.MakeInfo.MAKE_CIRCLE, isStatic: true });
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
    box2dp.BoxMaker = BoxMaker;
})(box2dp || (box2dp = {}));
var box2dp;
(function (box2dp) {
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
        MakeInfo.mult30 = function (value) {
            return Math.round(value * 30);
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
        MakeInfo.MAKE_BOX_TOP_LEFT = 1;
        MakeInfo.MAKE_BOX_CENTER = 2;
        MakeInfo.MAKE_POLYGON = 3;
        MakeInfo.MAKE_CIRCLE = 4;
        MakeInfo.MAKE_EDGE = 5;
        MakeInfo.MAKE_COMPOUND = 6;
        return MakeInfo;
    })();
    box2dp.MakeInfo = MakeInfo;
})(box2dp || (box2dp = {}));
var box2dp;
(function (box2dp) {
    var BaseRenderer = (function () {
        function BaseRenderer(options) {
            this.drawFlags = BaseRenderer.DRAW_SHAPE;
            if (options.width == null)
                options.width = 900;
            if (options.height == null)
                options.height = 600;
            if (options.antialias == null)
                options.antialias = true;
            if (options.invertY == null)
                options.invertY = true;
            if (options.elementId == null || document.getElementById(options.elementId) == null) {
                this.useElement = document.body;
            }
            else {
                this.useElement = document.getElementById(options.elementId);
            }
            if (options.dragFlags)
                this.drawFlags = options.dragFlags;
            if (options.colorClass == null) {
                this.colorClass = new box2dp.Color();
            }
            else {
                this.colorClass = options.colorClass;
            }
            this.options = options;
        }
        BaseRenderer.prototype.hasDrawType = function (checkType) {
            return ((this.drawFlags & checkType) == checkType);
        };
        BaseRenderer.prototype.beforeStep = function () { };
        BaseRenderer.prototype.afterStep = function () { };
        BaseRenderer.prototype.render = function () { };
        BaseRenderer.prototype.onItemCreate = function (item) { };
        ;
        BaseRenderer.prototype.onItemRemove = function (item) { };
        ;
        BaseRenderer.DRAW_SHAPE = 1 << 1;
        BaseRenderer.DRAW_CENTER = 1 << 2;
        BaseRenderer.DRAW_BOUNDARY = 1 << 3;
        BaseRenderer.DRAW_QUAD_TREE = 1 << 4;
        return BaseRenderer;
    })();
    box2dp.BaseRenderer = BaseRenderer;
})(box2dp || (box2dp = {}));
var box2dp;
(function (box2dp) {
    var DragControl = (function () {
        function DragControl(renderer) {
            this.domain = renderer.domain;
            this.world = this.domain.world;
            this.renderer = renderer;
        }
        DragControl.prototype.createDragDrop = function () {
            if (this.renderer.constructor["name"] == "PixiRenderer") {
                this.createPixiDragDrop();
            }
            if (this.renderer.constructor["name"] == "ThreeRenderer") {
                this.createThreeDragDrop();
            }
        };
        DragControl.prototype.removeDragDrop = function () {
            this.renderer.useElement.removeEventListener("mousedown", this["mousedownObj"]);
            document.removeEventListener("mousemove", this["mouseMoveObj"]);
            document.removeEventListener("mouseup", this["mouseUpObj"]);
        };
        DragControl.prototype.createPixiDragDrop = function () {
            var _this = this;
            this.renderer.useElement.addEventListener("mousedown", this["mousedownObj"] = function (e) { _this.ddPress(e); });
        };
        DragControl.prototype.ddPress = function (e) {
            var _this = this;
            var lx = box2dp.MakeInfo.round((e.pageX - this.renderer.useElement.offsetLeft) / 30);
            var ly = box2dp.MakeInfo.round((e.pageY - this.renderer.useElement.offsetTop) / 30);
            var items = this.domain.itemUnderPoint(lx, ly);
            if (items.length > 0) {
                var clickBody = items[0].GetBody();
                var mjDef = new box2d.b2MouseJointDef();
                mjDef.bodyA = this.domain.groundBody;
                mjDef.bodyB = clickBody;
                mjDef.target.Copy(new box2d.b2Vec2(lx, ly));
                mjDef.maxForce = 1000 * clickBody.GetMass();
                this.mouseJoint = this.domain.world.CreateJoint(mjDef);
                clickBody.SetAwake(true);
            }
            document.addEventListener("mousemove", this["mouseMoveObj"] = function (e) { _this.ddMove(e); });
            document.addEventListener("mouseup", this["mouseUpObj"] = function (e) { _this.ddUp(e); });
        };
        DragControl.prototype.ddMove = function (e) {
            var lx = box2dp.MakeInfo.round((e.pageX - this.renderer.useElement.offsetLeft) / 30);
            var ly = box2dp.MakeInfo.round((e.pageY - this.renderer.useElement.offsetTop) / 30);
            if (this.mouseJoint) {
                this.mouseJoint.SetTarget(new box2d.b2Vec2(lx, ly));
            }
        };
        DragControl.prototype.ddUp = function (e) {
            if (this.mouseJoint) {
                this.domain.world.DestroyJoint(this.mouseJoint);
                this.mouseJoint = null;
            }
            document.removeEventListener("mousemove", this["mouseMoveObj"]);
            document.removeEventListener("mouseup", this["mouseUpObj"]);
        };
        DragControl.prototype.tjPress = function (e) {
            var _this = this;
            var mx = e.pageX - this.renderer.useElement.offsetLeft;
            var my = e.pageY - this.renderer.useElement.offsetTop;
            var mousePt = this.renderer.getXYFromCamera(mx, my);
            var lx = box2dp.MakeInfo.round(mousePt.x / 30);
            var ly = box2dp.MakeInfo.round(mousePt.y / 30);
            var items = this.domain.itemUnderPoint(lx, ly);
            if (items.length > 0) {
                var clickBody = items[0].GetBody();
                var mjDef = new box2d.b2MouseJointDef();
                mjDef.bodyA = this.domain.groundBody;
                mjDef.bodyB = clickBody;
                mjDef.target.Copy(new box2d.b2Vec2(lx, ly));
                mjDef.maxForce = 1000 * clickBody.GetMass();
                this.mouseJoint = this.domain.world.CreateJoint(mjDef);
                clickBody.SetAwake(true);
                console.log(clickBody);
            }
            document.addEventListener("mousemove", this["mouseMoveObj"] = function (e) { _this.tjMove(e); });
            document.addEventListener("mouseup", this["mouseUpObj"] = function (e) { _this.tjUp(e); });
        };
        DragControl.prototype.createThreeDragDrop = function () {
            var _this = this;
            this.renderer.useElement.addEventListener("mousedown", this["mousedownObj"] = function (e) { _this.tjPress(e); });
        };
        DragControl.prototype.tjMove = function (e) {
            var mx = e.pageX - this.renderer.useElement.offsetLeft;
            var my = e.pageY - this.renderer.useElement.offsetTop;
            var mousePt = this.renderer.getXYFromCamera(mx, my);
            var lx = box2dp.MakeInfo.round(mousePt.x / 30);
            var ly = box2dp.MakeInfo.round(mousePt.y / 30);
            if (this.mouseJoint) {
                this.mouseJoint.SetTarget(new box2d.b2Vec2(lx, ly));
            }
        };
        DragControl.prototype.tjUp = function (e) {
            if (this.mouseJoint) {
                this.domain.world.DestroyJoint(this.mouseJoint);
                this.mouseJoint = null;
            }
            document.removeEventListener("mousemove", this["mouseMoveObj"]);
            document.removeEventListener("mouseup", this["mouseUpObj"]);
        };
        DragControl.prototype.trackCtrlUpdate = function (e, caller) {
            caller.trackCtrl.update(e.values * 50);
        };
        DragControl.prototype.createTrackBallCtrl = function () {
            var tr = this.renderer;
            tr.camera.position.x = 0;
            tr.camera.position.y = 0;
            this.trackCtrl = new THREE.TrackballControls(tr.camera, tr.useElement);
            this.trackCtrl.rotateSpeed = 2.0;
            this.trackCtrl.zoomSpeed = 2.0;
            this.trackCtrl.panSpeed = 2.0;
            this.trackCtrl.dynamicDampingFactor = 0.3;
            this.trackCtrl.staticMoving = true;
            var offset = new THREE.Vector3(tr.options.width * .5, -tr.options.height * .5, 0);
            this.trackCtrl.object.position.add(offset);
            this.trackCtrl.target.add(offset);
            this.domain.addEvent(box2dp.Event.AFTER_RENDER, this.trackCtrlUpdate, this);
        };
        DragControl.prototype.removeTrackBallCtrl = function () {
            this.domain.removeEvent(box2dp.Event.AFTER_RENDER, this.trackCtrlUpdate);
            if (this.trackCtrl) {
                this.trackCtrl.enabled = false;
                this.trackCtrl = undefined;
            }
        };
        DragControl.prototype.orbitCtrlUpdate = function (e, caller) {
            caller.orbCtrl.update();
        };
        DragControl.prototype.createOrbitCtrl = function () {
            var tr = this.renderer;
            this.orbCtrl = new THREE.OrbitControls(tr.camera, tr.useElement);
            this.orbCtrl.enableDamping = true;
            this.orbCtrl.dampingFactor = 0.2;
            var offset = new THREE.Vector3(tr.options.width * .5, -tr.options.height * .5, 0);
            this.orbCtrl.target = offset;
            this.domain.addEvent(box2dp.Event.AFTER_RENDER, this.orbitCtrlUpdate, this);
        };
        DragControl.prototype.removeOrbitCtrl = function () {
            this.domain.removeEvent(box2dp.Event.AFTER_RENDER, this.orbitCtrlUpdate);
            if (this.orbCtrl) {
                console.log(this.orbCtrl);
                this.orbCtrl.enabled = false;
                this.orbCtrl = undefined;
                console.log(this.orbCtrl);
            }
        };
        return DragControl;
    })();
    box2dp.DragControl = DragControl;
})(box2dp || (box2dp = {}));
var box2dp;
(function (box2dp) {
    var PixiRenderer = (function (_super) {
        __extends(PixiRenderer, _super);
        function PixiRenderer(options) {
            _super.call(this, options);
            var renderObj = { antialias: options.antialias, transparent: options.transparent };
            if (options.transparent == false && options.backgroundColor)
                renderObj.backgroundColor = options.backgroundColor;
            this.renderer = PIXI.autoDetectRenderer(options.width, options.height, renderObj);
            this.renderer.backgroundColor = this.colorClass.BACKGROUND;
            this.useElement.appendChild(this.renderer.view);
            this.scene = new PIXI.Container();
            this.container = new PIXI.Container();
            this.scene.addChild(this.container);
            this.quadGraphic = new PIXI.Graphics();
            this.scene.addChild(this.quadGraphic);
            this.overGraphic = new PIXI.Graphics();
            this.scene.addChild(this.overGraphic);
        }
        PixiRenderer.prototype.beforeStep = function () { };
        PixiRenderer.prototype.afterStep = function () { };
        PixiRenderer.prototype.render = function () {
            var ilen = this.domain.items.length;
            for (var p = 0; p < ilen; p++) {
                var litem = this.domain.items[p];
                if (litem.display["pixi"]) {
                    this.itemDisplayUpdate(litem.display["pixi"], litem);
                }
            }
            if (this.hasDrawType(box2dp.BaseRenderer.DRAW_QUAD_TREE) && this.domain.quadTree != null) {
                this.quadGraphic.visible = true;
                this.quadGraphic.clear();
                if (this.domain.quadTree.rootNode) {
                    this.drawTreeNode(this.domain.quadTree.rootNode);
                }
            }
            if (!this.hasDrawType(box2dp.BaseRenderer.DRAW_QUAD_TREE)) {
                this.quadGraphic.clear();
                this.quadGraphic.visible = false;
            }
            this.renderer.render(this.scene);
        };
        PixiRenderer.prototype.drawTreeNode = function (targetNode) {
            if (targetNode.nodes.length > 0) {
                for (var i = 0; i < targetNode.nodes.length; i++) {
                    this.drawTreeNode(targetNode.nodes[i]);
                }
            }
            var g = this.quadGraphic;
            g.lineStyle(2, this.colorClass.QUADTREE, this.colorClass.QUADTREE_A);
            g.drawRect(box2dp.MakeInfo.mult30(targetNode.x), box2dp.MakeInfo.mult30(targetNode.y), box2dp.MakeInfo.mult30(targetNode.width), box2dp.MakeInfo.mult30(targetNode.height));
        };
        PixiRenderer.prototype.onItemCreate = function (item) {
            var it = item;
            var display = new PIXI.Container();
            var gshape = new PIXI.Graphics();
            gshape.name = "shape";
            var gcenter = new PIXI.Graphics();
            gcenter.name = "center";
            var gboundary = new PIXI.Graphics();
            gboundary.name = "boundary";
            display.addChild(gshape);
            gshape.addChild(gcenter);
            display.addChild(gboundary);
            it.display["pixi"] = display;
            this.container.addChild(display);
            var ft = it.b2body.GetFixtureList();
            var useColor = this.colorClass.ITEM_STATIC;
            var useAlpha = this.colorClass.ITEM_ALPHA;
            if (it.b2body.GetType() == box2d.b2BodyType.b2_dynamicBody) {
                useColor = this.colorClass.ITEM_DYNAMIC;
            }
            if (item.type == box2dp.ItemBase.SENSOR) {
                useColor = this.colorClass.SENSOR;
                useAlpha = this.colorClass.SENSOR_ALPHA;
            }
            while (ft != null) {
                switch (ft.GetType()) {
                    case box2d.b2ShapeType.e_circleShape:
                        var cir = ft.GetShape();
                        var radius = box2dp.MakeInfo.mult30(cir.m_radius);
                        gshape.lineWidth = 0;
                        gshape.beginFill(useColor, useAlpha);
                        var tox = box2dp.MakeInfo.mult30(cir.m_p.x);
                        var toy = box2dp.MakeInfo.mult30(cir.m_p.y);
                        gshape.drawCircle(tox, toy, radius);
                        gshape.endFill();
                        break;
                    case box2d.b2ShapeType.e_polygonShape:
                        var ps = ft.GetShape();
                        gshape.lineWidth = 0;
                        gshape.beginFill(useColor, useAlpha);
                        var xtoAt0 = box2dp.MakeInfo.mult30(ps.m_vertices[0].x);
                        var ytoAt0 = box2dp.MakeInfo.mult30(ps.m_vertices[0].y);
                        gshape.moveTo(xtoAt0, ytoAt0);
                        for (var m = 0; m < ps.m_count; m++) {
                            var xto = box2dp.MakeInfo.mult30(ps.m_vertices[m].x);
                            var yto = box2dp.MakeInfo.mult30(ps.m_vertices[m].y);
                            gshape.lineTo(xto, yto);
                        }
                        gshape.lineTo(xtoAt0, ytoAt0);
                        gshape.endFill();
                        break;
                    case box2d.b2ShapeType.e_edgeShape:
                        var eg = ft.GetShape();
                        gshape.lineStyle(1, useColor, useAlpha);
                        gshape.lineWidth = 2;
                        var x1 = box2dp.MakeInfo.mult30(eg.m_vertex1.x), y1 = box2dp.MakeInfo.mult30(eg.m_vertex1.y);
                        var x2 = box2dp.MakeInfo.mult30(eg.m_vertex2.x), y2 = box2dp.MakeInfo.mult30(eg.m_vertex2.y);
                        gshape.moveTo(x1, y1);
                        gshape.lineTo(x2, y2);
                        break;
                }
                ft = ft.GetNext();
            }
            var ctx = box2dp.MakeInfo.mult30(it.b2body.GetLocalCenter().x);
            var cty = box2dp.MakeInfo.mult30(it.b2body.GetLocalCenter().y);
            gcenter.moveTo(ctx, cty);
            gcenter.lineStyle(1, 0xFFAD99, 1);
            gcenter.lineTo(ctx + 8, cty);
            gcenter.moveTo(ctx, cty);
            gcenter.lineStyle(1, 0xADFF99, 1);
            gcenter.lineTo(ctx, cty + 8);
            var bd = item.getBoundary(true, true);
            gboundary.lineStyle(1, 0x6f586f, 1);
            this.dashLine(gboundary, bd.x, bd.y, bd.x + bd.w, bd.y);
            this.dashLine(gboundary, bd.x, bd.y + bd.h, bd.x + bd.w, bd.y + bd.h);
            this.dashLine(gboundary, bd.x, bd.y, bd.x, bd.y + bd.h);
            this.dashLine(gboundary, bd.x + bd.w, bd.y, bd.x + bd.w, bd.y + bd.h);
            this.itemDisplayUpdate(display, it);
        };
        PixiRenderer.prototype.onItemRemove = function (item) {
            if (item.display) {
                if (item.display["pixi"]) {
                    this.container.removeChild(item.display["pixi"]);
                    item.display["pixi"].destroy(true);
                    delete item.display["pixi"];
                }
            }
        };
        PixiRenderer.prototype.itemDisplayUpdate = function (display, item) {
            display.x = item.ix;
            display.y = item.iy;
            display.getChildByName("shape").rotation = item.ir;
            display.getChildByName("shape").visible = this.hasDrawType(box2dp.BaseRenderer.DRAW_SHAPE);
            display.getChildByName("shape").getChildByName("center").visible = this.hasDrawType(box2dp.BaseRenderer.DRAW_CENTER);
            display.getChildByName("boundary").visible = this.hasDrawType(box2dp.BaseRenderer.DRAW_BOUNDARY);
            var gb = display.getChildByName("boundary");
            gb.clear();
            var bd = item.getBoundary(true, true);
            gb.lineStyle(1, 0x6f586f, 1);
            this.dashLine(gb, bd.x, bd.y, bd.x + bd.w, bd.y);
            this.dashLine(gb, bd.x, bd.y + bd.h, bd.x + bd.w, bd.y + bd.h);
            this.dashLine(gb, bd.x, bd.y, bd.x, bd.y + bd.h);
            this.dashLine(gb, bd.x + bd.w, bd.y, bd.x + bd.w, bd.y + bd.h);
        };
        PixiRenderer.prototype.dashLine = function (g, x, y, x2, y2, dashArray) {
            if (!dashArray)
                dashArray = [10, 5];
            var dashCount = dashArray.length;
            g.moveTo(x, y);
            var dx = (x2 - x), dy = (y2 - y);
            var slope = dx ? dy / dx : 1e15;
            var distRemaining = Math.sqrt(dx * dx + dy * dy);
            var dashIndex = 0, draw = true;
            while (distRemaining >= 0.1) {
                var dashLength = dashArray[dashIndex++ % dashCount];
                if (dashLength > distRemaining)
                    dashLength = distRemaining;
                var xStep = Math.sqrt(dashLength * dashLength / (1 + slope * slope));
                if (dx < 0)
                    xStep = -xStep;
                x += xStep;
                y += slope * xStep;
                if (draw) {
                    g.lineTo(x, y);
                }
                else {
                    g.moveTo(x, y);
                }
                distRemaining -= dashLength;
                draw = !draw;
            }
        };
        return PixiRenderer;
    })(box2dp.BaseRenderer);
    box2dp.PixiRenderer = PixiRenderer;
})(box2dp || (box2dp = {}));
var box2dp;
(function (box2dp) {
    var ThreeRenderer = (function (_super) {
        __extends(ThreeRenderer, _super);
        function ThreeRenderer(options) {
            _super.call(this, options);
            this.camera = new THREE.PerspectiveCamera(45, options.width / options.height, 1, 10000);
            var fov = 45;
            var vFOV = fov * (Math.PI / 180);
            this.camera.position.z = options.height / (2 * Math.tan(vFOV / 2));
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));
            this.renderer = new THREE.WebGLRenderer({ antialias: options.antialias });
            this.renderer.setSize(options.width, options.height);
            this.renderer.setClearColor(this.colorClass.BACKGROUND, 1);
            this.useElement.appendChild(this.renderer.domElement);
            this.scene = new THREE.Scene();
            this.container = new THREE.Object3D();
            this.scene.add(this.container);
            this.quadGraphic = new THREE.Object3D();
            this.overGraphic = new THREE.Object3D();
            this.scene.add(this.quadGraphic);
            this.scene.add(this.overGraphic);
            this.renderer.render(this.scene, this.camera);
            if (options.invertY)
                this.invertYSetup();
        }
        ThreeRenderer.prototype.invertYSetup = function () {
            this.container.scale.set(1, -1, 1);
            this.quadGraphic.scale.set(1, -1, 1);
            this.overGraphic.scale.set(1, -1, 1);
            this.camera.position.x = this.options.width * .5;
            this.camera.position.y = this.options.height * -.5;
        };
        ThreeRenderer.prototype.beforeStep = function () { };
        ThreeRenderer.prototype.afterStep = function () { };
        ThreeRenderer.prototype.render = function () {
            var ilen = this.domain.items.length;
            for (var p = 0; p < ilen; p++) {
                var litem = this.domain.items[p];
                if (litem.display["three"]) {
                    this.itemDisplayUpdate(litem.display["three"], litem);
                }
            }
            if (this.hasDrawType(box2dp.BaseRenderer.DRAW_QUAD_TREE) && this.domain.quadTree != null) {
                this.quadGraphic.visible = true;
                this.clearQuadTreeGuide();
                if (this.domain.quadTree.rootNode) {
                    this.drawTreeNode(this.domain.quadTree.rootNode);
                }
            }
            if (!this.hasDrawType(box2dp.BaseRenderer.DRAW_QUAD_TREE)) {
                this.quadGraphic.visible = false;
            }
            this.renderer.render(this.scene, this.camera);
        };
        ThreeRenderer.prototype.drawTreeNode = function (targetNode) {
            if (targetNode.nodes.length > 0) {
                for (var i = 0; i < targetNode.nodes.length; i++) {
                    this.drawTreeNode(targetNode.nodes[i]);
                }
            }
            var ax = box2dp.MakeInfo.mult30(targetNode.x);
            var ay = box2dp.MakeInfo.mult30(targetNode.y);
            var aw = box2dp.MakeInfo.mult30(targetNode.width);
            var ah = box2dp.MakeInfo.mult30(targetNode.height);
            var lg = new THREE.Geometry();
            lg.vertices.push(new THREE.Vector3(ax, ay, 0), new THREE.Vector3(ax + aw, ay, 0), new THREE.Vector3(ax + aw, ay + ah, 0), new THREE.Vector3(ax, ay + ah, 0), new THREE.Vector3(ax, ay, 0));
            var line = new THREE.Line(lg, this.colorClass.getLineQuadTree(), THREE.LineStrip);
            this.quadGraphic.add(line);
        };
        ThreeRenderer.prototype.clearQuadTreeGuide = function () {
            for (var s = this.quadGraphic.children.length - 1; s > -1; s--) {
                var loopOne = this.quadGraphic.children[s];
                this.quadGraphic.remove(loopOne);
                loopOne["geometry"].dispose();
                loopOne["geometry"] = undefined;
            }
        };
        ThreeRenderer.prototype.clearOverShapes = function () {
            for (var s = this.overGraphic.children.length - 1; s > -1; s--) {
                var loopOne = this.overGraphic.children[s];
                this.overGraphic.remove(loopOne);
                if (loopOne["geometry"]) {
                    loopOne["geometry"].dispose();
                    loopOne["geometry"] = undefined;
                }
                if (loopOne["material"]) {
                    loopOne["material"].dispose();
                    loopOne["material"] = undefined;
                }
            }
        };
        ThreeRenderer.prototype.onItemCreate = function (item) {
            var it = item;
            var display = new THREE.Object3D();
            display.name = item.name;
            var gshape = new THREE.Object3D();
            gshape.name = "shape";
            var gcenter = new THREE.Object3D();
            gcenter.position.z = 0.1;
            gcenter.name = "center";
            var gboundary = new THREE.Object3D();
            gboundary.name = "boundary";
            gboundary.position.z = 0.2;
            display.add(gshape);
            gshape.add(gcenter);
            display.add(gboundary);
            it.display["three"] = display;
            this.container.add(display);
            var ft = it.b2body.GetFixtureList();
            var useMat = this.colorClass.getItemStaticMat();
            if (it.b2body.GetType() == box2d.b2BodyType.b2_dynamicBody) {
                useMat = this.colorClass.getItemDynamicMat();
            }
            if (item.type == box2dp.ItemBase.SENSOR)
                useMat = this.colorClass.getSensorMat();
            var useLineMat = this.colorClass.getLineMatStatic();
            if (it.b2body.GetType() == box2d.b2BodyType.b2_dynamicBody) {
                useLineMat = this.colorClass.getLineMatDynamic();
            }
            while (ft != null) {
                switch (ft.GetType()) {
                    case box2d.b2ShapeType.e_circleShape:
                        var cir = ft.GetShape();
                        var radius = box2dp.MakeInfo.mult30(cir.m_radius);
                        var cirGeo = new THREE.CircleGeometry(radius, 24);
                        var circleMesh = new THREE.Mesh(cirGeo, useMat);
                        circleMesh.name = "circleMesh";
                        var tox = box2dp.MakeInfo.mult30(cir.m_p.x);
                        var toy = box2dp.MakeInfo.mult30(cir.m_p.y);
                        circleMesh.position.set(tox, toy, 0);
                        gshape.add(circleMesh);
                        break;
                    case box2d.b2ShapeType.e_polygonShape:
                        var polyShape = new THREE.Shape();
                        var ps = ft.GetShape();
                        var xtoAt0 = box2dp.MakeInfo.mult30(ps.m_vertices[0].x);
                        var ytoAt0 = box2dp.MakeInfo.mult30(ps.m_vertices[0].y);
                        polyShape.moveTo(xtoAt0, ytoAt0);
                        for (var m = 1; m < ps.m_count; m++) {
                            var xto = box2dp.MakeInfo.mult30(ps.m_vertices[m].x);
                            var yto = box2dp.MakeInfo.mult30(ps.m_vertices[m].y);
                            polyShape.lineTo(xto, yto);
                        }
                        polyShape.lineTo(xtoAt0, ytoAt0);
                        var polyGeometry = new THREE.ShapeGeometry(polyShape);
                        polyGeometry.name = "polyGeometry";
                        var polyMesh = new THREE.Mesh(polyGeometry, useMat);
                        polyMesh.name = "polyMesh";
                        gshape.add(polyMesh);
                        break;
                    case box2d.b2ShapeType.e_edgeShape:
                        var lineGeo = new THREE.Geometry();
                        var eg = ft.GetShape();
                        var x1 = box2dp.MakeInfo.mult30(eg.m_vertex1.x), y1 = box2dp.MakeInfo.mult30(eg.m_vertex1.y);
                        var x2 = box2dp.MakeInfo.mult30(eg.m_vertex2.x), y2 = box2dp.MakeInfo.mult30(eg.m_vertex2.y);
                        lineGeo.vertices.push(new THREE.Vector3(x1, y1, 0));
                        lineGeo.vertices.push(new THREE.Vector3(x2, y2, 0));
                        var line = new THREE.Line(lineGeo, useLineMat);
                        line.name = "edgeLine";
                        gshape.add(line);
                        break;
                }
                ft = ft.GetNext();
            }
            var ctx = box2dp.MakeInfo.mult30(it.b2body.GetLocalCenter().x);
            var cty = box2dp.MakeInfo.mult30(it.b2body.GetLocalCenter().y);
            var geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(ctx, cty, 0), new THREE.Vector3(ctx + 8, cty, 0));
            var line = new THREE.Line(geometry, this.colorClass.getLineCenterXMat());
            line.name = "centerLineX";
            gcenter.add(line);
            geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(ctx, cty, 0), new THREE.Vector3(ctx, cty + 8, 0));
            var line = new THREE.Line(geometry, this.colorClass.getLineCenterYMat());
            line.name = "centerLineY";
            gcenter.add(line);
            var bd = item.getBoundary(true, true);
            geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(bd.x, bd.y, 0), new THREE.Vector3(bd.x + bd.w, bd.y, 0), new THREE.Vector3(bd.x + bd.w, bd.y + bd.h, 0), new THREE.Vector3(bd.x, bd.y + bd.h, 0), new THREE.Vector3(bd.x, bd.y, 0));
            var line = new THREE.Line(geometry, this.colorClass.getLineBoundary(), THREE.LineStrip);
            line.name = "boundaryLine";
            geometry.computeLineDistances();
            gboundary.add(line);
            this.itemDisplayUpdate(display, it);
        };
        ThreeRenderer.prototype.onItemRemove = function (item) {
            if (item.display) {
                if (item.display["three"]) {
                    var threeObj = item.display["three"];
                    this.disposeShape(threeObj, 0);
                    this.container.remove(threeObj);
                    delete item.display["three"];
                }
            }
        };
        ThreeRenderer.prototype.itemDisplayUpdate = function (display, it) {
            display.position.set(it.ix, it.iy, 0);
            display.getObjectByName("shape").rotation.set(0, 0, it.ir);
            display.getObjectByName("shape").visible = this.hasDrawType(box2dp.BaseRenderer.DRAW_SHAPE);
            display.getObjectByName("center").visible = this.hasDrawType(box2dp.BaseRenderer.DRAW_CENTER);
            display.getObjectByName("boundary").visible = this.hasDrawType(box2dp.BaseRenderer.DRAW_BOUNDARY);
            var bd = it.getBoundary(true, true);
            var line = display.getObjectByName("boundary").getObjectByName("boundaryLine");
            var geo = line.geometry;
            geo.vertices[0].set(bd.x, bd.y, 0);
            geo.vertices[1].set(bd.x + bd.w, bd.y, 0);
            geo.vertices[2].set(bd.x + bd.w, bd.y + bd.h, 0);
            geo.vertices[3].set(bd.x, bd.y + bd.h, 0);
            geo.vertices[4].set(bd.x, bd.y, 0);
            geo.verticesNeedUpdate = true;
        };
        ThreeRenderer.prototype.getXYFromCamera = function (xto, yto) {
            var vect3 = new THREE.Vector3();
            vect3.set((xto / this.options.width) * 2 - 1, -(yto / this.options.height) * 2 + 1, 0.5);
            vect3.unproject(this.camera);
            var dir = vect3.sub(this.camera.position).normalize();
            var distance = -this.camera.position.z / dir.z;
            var pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
            if (this.options.invertY)
                pos.y *= -1;
            return pos;
        };
        ThreeRenderer.prototype.disposeShape = function (obj, depth) {
            if (obj["geometry"]) {
                obj["geometry"].dispose();
                obj["geometry"] = undefined;
            }
            if (obj instanceof THREE.Object3D) {
                depth++;
                for (var s = 0; s < obj.children.length; s++) {
                    this.disposeShape(obj.children[s], depth);
                }
            }
        };
        return ThreeRenderer;
    })(box2dp.BaseRenderer);
    box2dp.ThreeRenderer = ThreeRenderer;
})(box2dp || (box2dp = {}));
