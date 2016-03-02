/// <reference path="event.ts" />
//reference to event.ts must appear in order for right compile order

module box2dp {

    export class Domain extends EventDispatcher {

        // static
        // ================================================================================================
        public static UPDATE_FIXED: number = 1;
        public static UPDATE_TIME_BASED: number = 2;

        //automatic id counter for every item types
        private static uniqueNameCounters: { [type: string]: number } = {};
        private static addCounter(type: string): string {
            if (Domain.uniqueNameCounters[type] == null) Domain.uniqueNameCounters[type] = 0;
            Domain.uniqueNameCounters[type]++;
            return Domain.uniqueNameCounters[type].toString(36);
        }
        // ================================================================================================

        public world: box2d.b2World;
        public maker: BoxMaker;
        private renderers: BaseRenderer[];
        private rlen: number;

        public items: ItemEntity[];
        public lastStepTime: number;

        //if in fixed update mode , the time value to simulate physic
        public physicFixStepTime: number;
        public stepTime: number;
        public renderTime: number;

        private stepInterval: number;
        private renderInterval: number;
        private updateMode: number;

        //used on mouseJoint
        public groundBody: box2d.b2Body;


        //used for default debugDraw Object
        private debugDrawCanvas: HTMLCanvasElement;
        private debugDrawCtx: CanvasRenderingContext2D;
        public debugDraw: box2d.DebugDraw;
        public quadTree: QuadTree;

        private contactManager: ContactManager;

        constructor(gravity: { x: number, y: number }, physicFixStepTime: number, updateMode: number = Domain.UPDATE_FIXED) {
            super();
            this.world = new box2d.b2World(new box2d.b2Vec2(gravity.x, gravity.y));
            this.maker = new BoxMaker(this.world);
            this.physicFixStepTime = physicFixStepTime;
            this.renderers = [];
            this.items = [];
            this.updateMode = updateMode;
            this.groundBody = this.world.CreateBody(new box2d.b2BodyDef());
            //contact setup
            this.contactManager = new ContactManager(this);
            this.world.SetContactListener(this.contactManager);
        }

        public setDebugDrawElements(canvasId: string, width: number, height: number): void {
            this.debugDrawCanvas = <HTMLCanvasElement>document.getElementById(canvasId);
            this.debugDrawCtx = this.debugDrawCanvas.getContext("2d");
            this.debugDraw = new box2d.DebugDraw(this.debugDrawCanvas);
            this.debugDraw.SetFlags(box2d.b2DrawFlags.e_all);
            //this.debugDraw.SetFlags(box2d.b2DrawFlags.e_shapeBit | box2d.b2DrawFlags.e_jointBit);
            this.world.SetDebugDraw(this.debugDraw);
            this.debugDrawCanvas.width = width;
            this.debugDrawCanvas.height = height;
        }

        public addRenderer(renderer: BaseRenderer) {
            this.renderers.push(renderer);
            renderer.domain = this;
            this.rlen = this.renderers.length;
            
        }

        private getUniqueName(name: string): string {
            //var nameData: string[] = [];
            var exist = false;
            for (var k = 0; k < this.items.length; k++) {
                if (this.items[k].name == name) {
                    exist = true;
                    break;
                }
            }
            if (!exist) {
                //if name is unique , return directly
                return name;
            } else {
                //make the name unique by adding dash & digits in the end
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
                    if (ck > 100) break; //prevent endless loop
                    if (checkExist == false) success = true;
                }
                return checkName;
            }
        }

        public create(makeInfo: MakeInfo): ItemEntity {
            var name: string = makeInfo.name;
            if (makeInfo.name == null) {
                name = "ItemEntity-" + Domain.addCounter("ItemEntity");
            } else {
                name = this.getUniqueName(name);
            }
            var newItem: ItemEntity = new ItemEntity(this.maker.create(makeInfo), makeInfo.itemType, name);
            this.items.push(newItem);
            for (var k: number = 0; k < this.rlen; k++) this.renderers[k].onItemCreate(newItem);
            this.fireEvent(new Event(Event.ITEM_CREATED, this, newItem));
            return newItem;
        }

        public step(): void {

            var ilen: number = this.items.length;

            //if we have QuadTree selector, update it
            if (this.quadTree) {
                this.quadTree.clear();
                for (var p: number = 0; p < ilen; p++) {
                    //intergate old value at a full 100 percent old x,y and rotation
                    var itemSel: QuadSelector = this.quadTree.getItemSelector(this.items[p]);
                    if (itemSel) {
                        this.quadTree.insert(itemSel);
                        this.items[p].selector = itemSel;
                    }
                }
            }

            for (var p: number = 0; p < ilen; p++) {
                //intergate old value at a full 100 percent old x,y and rotation
                this.items[p].integratePos(1);
                this.items[p].setOldPos();
            }
            this.fireEvent(new Event(Event.BEFORE_STEP, this));

            if (this.updateMode == Domain.UPDATE_FIXED) {
                this.world.Step(this.physicFixStepTime, 10, 5, 1);
            } else {
                if (this.lastStepTime) {
                    var timeDiff: number = Math.round((new Date().getTime() - this.lastStepTime) / 10) / 100;
                    this.world.Step(timeDiff, 10, 5, 1);
                }

            }
            if (this.debugDrawCtx) {
                this.debugDrawCtx.clearRect(0, 0, this.debugDrawCanvas.width, this.debugDrawCanvas.height);
                this.world.DrawDebugData();
            }
            for (var p: number = 0; p < ilen; p++) {
                this.items[p].setCurrentPos();
                this.items[p].updateBoundary();
            }
            this.fireEvent(new Event(Event.AFTER_STEP, this));
            this.lastStepTime = new Date().getTime();

        }

        public render(): void {
            var timePassed: number = new Date().getTime() - this.lastStepTime;
            var percent: number;
            if (isNaN(timePassed)) {
                percent = 1;
            } else {
                percent = timePassed / this.stepTime;
                if (percent > 1) percent = 1;
            }
            if (percent != 0 && percent != 1) {
                var ilen: number = this.items.length;
                //intergate between old value and current value
                for (var p: number = 0; p < ilen; p++) this.items[p].integratePos(percent);
            }
            this.fireEvent(new Event(Event.BEFORE_RENDER, this, timePassed));
            for (var k: number = 0; k < this.rlen; k++) this.renderers[k].render();
            this.fireEvent(new Event(Event.AFTER_RENDER, this, timePassed));
        }

        public run(stepTime: number, renderTime: number): void {
            this.stepTime = stepTime;
            this.renderTime = renderTime;
            this.stepInterval = setInterval(() => { this.step(); }, this.stepTime);
            this.renderInterval = setInterval(() => { this.render() }, this.renderTime);
        }

        public stop(): void {
            clearInterval(this.stepInterval);
            clearInterval(this.renderInterval);
        }

        public updateInterval(stepTime: number, renderTime: number): void {
            this.stop();
            this.stepTime = stepTime;
            this.renderTime = renderTime;
            this.stepInterval = setInterval(() => { this.step(); }, this.stepTime);
            this.renderInterval = setInterval(() => { this.render() }, this.renderTime);
        }

        public setUpdateMode(mode: number): void {
            this.updateMode = mode;
        }

        public itemUnderPoint(lx: number, ly: number): box2d.b2Fixture[] {
            var qcb: any = new QueryCallBack();
            var aabb = new box2d.b2AABB();
            aabb.lowerBound.Set(lx, ly);
            aabb.upperBound.Set(lx + 0.001, ly + 0.001);
            this.world.QueryAABB(qcb, aabb);
            return qcb.itemList;
        }

        public eachItem(callback: Function): void {
            var tempItems: ItemEntity[] = this.items.concat();
            var ilen: number = tempItems.length;
            for (var k: number = ilen - 1; k > -1; k--) {
                if (callback) callback(tempItems[k], k);
            }
        }

        public removeItem(item: ItemEntity): void {
            for (var k: number = 0; k < this.rlen; k++) this.renderers[k].onItemRemove(item);
            var plen = this.items.length;
            for (var p: number = plen - 1; p > -1; p--) {
                if (this.items[p] === item) {
                    this.items.splice(p, 1);
                    break;
                }
            }
            item.removePhysic();
            item = null;
        }

    }



    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //mix box2d goog class with typescript, some functions require extended class with goog to work
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //=================================================================================================
    //custom class used to handle contact events
    //more info http://www.iforce2d.net/b2dtut/collision-anatomy
    //=================================================================================================
    class ContactManager {

        private domain: Domain;

        constructor(domain: Domain) {
            this.domain = domain;
            box2d.b2ContactListener.call(this);
        }

        public PreSolve(contact: box2d.b2Contact, oldManifold: box2d.b2Manifold): void {
            //console.log("PreSolve");
        }

        public PostSolve(contact: box2d.b2Contact, impulse: box2d.b2ContactImpulse): void {
            //console.log("PostSolve");
        }

        public BeginContact(contact: box2d.b2Contact): void {
            var iA = contact.GetFixtureA().GetBody().item;
            var iB = contact.GetFixtureB().GetBody().item;
            if (iA && iB) {
                if (iA.enableContactEvent) iA.fireEvent(new Event(Event.BEGIN_CONTACT, iA, { otherItem: iB }));
                if (iB.enableContactEvent) iB.fireEvent(new Event(Event.BEGIN_CONTACT, iB, { otherItem: iA }));
            }
        }

        public EndContact(contact: box2d.b2Contact): void {
            var iA = contact.GetFixtureA().GetBody().item;
            var iB = contact.GetFixtureB().GetBody().item;
            if (iA && iB) {
                if (iA.enableContactEvent) iA.fireEvent(new Event(Event.END_CONTACT, iA, { otherItem: iB }));
                if (iB.enableContactEvent) iB.fireEvent(new Event(Event.END_CONTACT, iB, { otherItem: iA }));
            }
        }

        //Called when a fixture and particle start touching if the b2_fixtureContactFilterParticle flag is set on the particle. 
        public BeginContactFixtureParticle(particleSystem, particleBodyContact): void {
            //console.log("BeginContactFixtureParticle");
        }
        //Called when a fixture and particle stop touching if the b2_fixtureContactFilterParticle flag is set on the particle. 
        public EndContactFixtureParticle(fixture, particleSystem, particleIndex): void {
            //console.log("EndContactFixtureParticle");
        }

        //Called when two particles start touching if b2_particleContactFilterParticle flag is set on either 
        public BeginContactParticleParticle(particleSystem, particleContact): void {
            //console.log("BeginContactParticleParticle");
        }

        //Called when two particles start touching if b2_particleContactFilterParticle flag is set on either 
        public EndContactParticleParticle(particleSystem, particleIndexA, particleIndexB): void {
            //console.log("EndContactParticleParticle");
        }

    }

}


//var ContactFilter: any = function () {
//}
//window["goog"].inherits(ContactFilter, box2d.b2ContactFilter);
//=================================================================================================




//=================================================================================================
//custom class used to handle destruction events
//=================================================================================================
var DestructionListener: any = function () {
    this.itemList = [];
    this.particleData = [];
}
window["goog"].inherits(DestructionListener, box2d.b2DestructionListener);
DestructionListener.prototype.SayGoodbyeJoint = function (joint) { }
DestructionListener.prototype.SayGoodbyeFixture = function (fixture) { }
DestructionListener.prototype.SayGoodbyeParticleGroup = function (group) { }
DestructionListener.prototype.SayGoodbyeJoint = function (joint) { }
DestructionListener.prototype.SayGoodbyeParticle = function (particleSystem, particleIndex) { }
//=================================================================================================



//=================================================================================================
//QueryCallBack for world.QueryAABB()
//=================================================================================================
var QueryCallBack: any = function () {
    this.itemList = [];
    this.particleData = [];
}
window["goog"].inherits(QueryCallBack, box2d.b2QueryCallback);
QueryCallBack.prototype.ReportFixture = function (fixture: box2d.b2Fixture) {
    this.itemList.push(fixture);
    return true;
}
QueryCallBack.prototype.ReportParticle = function (particleSystem: box2d.b2ParticleSystem, index: number) {
    this.particleData.push({ index: index, system: particleSystem });
    return true;
}
//=================================================================================================



//=================================================================================================
//QueryCallBack for world.QueryAABB()
//=================================================================================================
var RayCastCallback: any = function () {
    box2d.b2RayCastCallback.call(this);
    this.itemList = [];
}
window["goog"].inherits(RayCastCallback, box2d.b2RayCastCallback);
RayCastCallback.prototype.ReportFixture = function (fixture, point, normal, fraction) {
    this.itemList.push({ "fixture": fixture, "point": point.Clone(), "normal": normal.Clone(), "fraction": fraction });
}
