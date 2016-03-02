﻿module box2dp {

    export class DragControl {

        private domain: Domain;
        private world: box2d.b2World;
        private useElement: HTMLElement;
        private renderer: BaseRenderer;
        public mouseJoint: any;
        public trackCtrl: THREE.TrackballControls;
        public orbCtrl: THREE.OrbitControls;

        constructor(renderer: BaseRenderer) {
            this.domain = renderer.domain;
            this.world = this.domain.world;
            this.renderer = renderer;
        }

        public createDragDrop(): void {
            if (this.renderer.constructor === box2dp.PixiRenderer) {
                this.createPixiDragDrop();
            }
            if (this.renderer.constructor === box2dp.ThreeRenderer) {
                this.createThreeDragDrop();
            }
        }

        public removeDragDrop(): void {
            this.renderer.useElement.removeEventListener("mousedown", this["mousedownObj"]);
            document.removeEventListener("mousemove", this["mouseMoveObj"]);
            document.removeEventListener("mouseup", this["mouseUpObj"]);
        }


        ////////////////////////////////////////////////////////////////
        //pixi drag and drop
        ////////////////////////////////////////////////////////////////
        private createPixiDragDrop(): void {
            this.renderer.useElement.addEventListener("mousedown", this["mousedownObj"] = (e) => { this.ddPress(e); });
        }
        private ddPress(e): void {
            var lx = box2dp.MakeInfo.round((e.pageX - this.renderer.useElement.offsetLeft) / 30);
            var ly = box2dp.MakeInfo.round((e.pageY - this.renderer.useElement.offsetTop) / 30);
            var items = this.domain.itemUnderPoint(lx, ly);
            if (items.length > 0) {
                var clickBody: box2d.b2Body = items[0].GetBody();
                var mjDef: box2d.b2MouseJointDef = new box2d.b2MouseJointDef();
                mjDef.bodyA = this.domain.groundBody;
                mjDef.bodyB = clickBody;
                mjDef.target.Copy(new box2d.b2Vec2(lx, ly));
                mjDef.maxForce = 1000 * clickBody.GetMass();
                this.mouseJoint = this.domain.world.CreateJoint(mjDef);
                clickBody.SetAwake(true);
            }
            document.addEventListener("mousemove", this["mouseMoveObj"] = (e) => { this.ddMove(e); });
            document.addEventListener("mouseup", this["mouseUpObj"] = (e) => { this.ddUp(e); });
        }
        private ddMove(e): void {
            var lx = box2dp.MakeInfo.round((e.pageX - this.renderer.useElement.offsetLeft) / 30);
            var ly = box2dp.MakeInfo.round((e.pageY - this.renderer.useElement.offsetTop) / 30);
            if (this.mouseJoint) {
                this.mouseJoint.SetTarget(new box2d.b2Vec2(lx, ly));
            }
        }
        private ddUp(e): void {
            if (this.mouseJoint) {
                this.domain.world.DestroyJoint(this.mouseJoint);
                this.mouseJoint = null;
            }
            document.removeEventListener("mousemove", this["mouseMoveObj"]);
            document.removeEventListener("mouseup", this["mouseUpObj"]);
        }


        ////////////////////////////////////////////////////////////////
        //three.js drag and drop
        ////////////////////////////////////////////////////////////////
        private tjPress(e): void {
            //var lx = box2dp.MakeInfo.round((e.pageX - this.renderer.useElement.offsetLeft) / 30);
            //var ly = box2dp.MakeInfo.round((e.pageY - this.renderer.useElement.offsetTop) / 30);
            var mx: number = e.pageX - this.renderer.useElement.offsetLeft;
            var my: number = e.pageY - this.renderer.useElement.offsetTop;
            var mousePt: THREE.Vector3 = (<ThreeRenderer>this.renderer).getXYFromCamera(mx, my);
            var lx = box2dp.MakeInfo.round(mousePt.x / 30);
            var ly = box2dp.MakeInfo.round(mousePt.y / 30);
            var items = this.domain.itemUnderPoint(lx, ly);
            if (items.length > 0) {
                var clickBody: box2d.b2Body = items[0].GetBody();
                var mjDef: box2d.b2MouseJointDef = new box2d.b2MouseJointDef();
                mjDef.bodyA = this.domain.groundBody;
                mjDef.bodyB = clickBody;
                mjDef.target.Copy(new box2d.b2Vec2(lx, ly));
                mjDef.maxForce = 1000 * clickBody.GetMass();
                this.mouseJoint = this.domain.world.CreateJoint(mjDef);
                clickBody.SetAwake(true);
                console.log(clickBody);
            }
            document.addEventListener("mousemove", this["mouseMoveObj"] = (e) => { this.tjMove(e); });
            document.addEventListener("mouseup", this["mouseUpObj"] = (e) => { this.tjUp(e); });
        }
        private createThreeDragDrop(): void {
            this.renderer.useElement.addEventListener("mousedown", this["mousedownObj"] = (e) => { this.tjPress(e); });
        }
        private tjMove(e): void {
            var mx: number = e.pageX - this.renderer.useElement.offsetLeft;
            var my: number = e.pageY - this.renderer.useElement.offsetTop;
            var mousePt: THREE.Vector3 = (<ThreeRenderer>this.renderer).getXYFromCamera(mx, my);
            var lx = box2dp.MakeInfo.round(mousePt.x / 30);
            var ly = box2dp.MakeInfo.round(mousePt.y / 30);
            if (this.mouseJoint) {
                this.mouseJoint.SetTarget(new box2d.b2Vec2(lx, ly));
            }
        }
        private tjUp(e): void {
            if (this.mouseJoint) {
                this.domain.world.DestroyJoint(this.mouseJoint);
                this.mouseJoint = null;
            }
            document.removeEventListener("mousemove", this["mouseMoveObj"]);
            document.removeEventListener("mouseup", this["mouseUpObj"]);
        }

   

        ////////////////////////////////////////////////////////////////
        //THREE.js TrackballControls
        ////////////////////////////////////////////////////////////////
        public trackCtrlUpdate(e: Event, caller: DragControl): void {
            caller.trackCtrl.update(e.values * 50);
        }
        public createTrackBallCtrl(): void {

            var tr: ThreeRenderer = <ThreeRenderer>this.renderer;
            tr.camera.position.x = 0;
            tr.camera.position.y = 0;

            this.trackCtrl = new THREE.TrackballControls(tr.camera, tr.useElement);
            this.trackCtrl.rotateSpeed = 2.0;
            this.trackCtrl.zoomSpeed = 2.0;
            this.trackCtrl.panSpeed = 2.0;
            this.trackCtrl.dynamicDampingFactor = 0.3;
            this.trackCtrl.staticMoving = true;

            //make it center on stage
            var offset: THREE.Vector3 = new THREE.Vector3(tr.options.width * .5, -tr.options.height * .5, 0);
            this.trackCtrl.object.position.add(offset);
            this.trackCtrl.target.add(offset);

            this.domain.addEvent(Event.AFTER_RENDER, this.trackCtrlUpdate, this);

        }
        public removeTrackBallCtrl(): void {
            this.domain.removeEvent(Event.AFTER_RENDER, this.trackCtrlUpdate);
            if (this.trackCtrl) {
                this.trackCtrl.enabled = false;
                this.trackCtrl = undefined;
            }
        }



        ////////////////////////////////////////////////////////////////
        //THREE.js OrbitControls
        ////////////////////////////////////////////////////////////////
        public orbitCtrlUpdate(e: Event, caller: DragControl): void {
            caller.orbCtrl.update();
        }
        public createOrbitCtrl(): void {
            var tr: ThreeRenderer = <ThreeRenderer>this.renderer;
            this.orbCtrl = new THREE.OrbitControls(tr.camera, tr.useElement);
            this.orbCtrl.enableDamping = true;
            this.orbCtrl.dampingFactor = 0.2;
            var offset: THREE.Vector3 = new THREE.Vector3(tr.options.width * .5, -tr.options.height * .5, 0);
            this.orbCtrl.target = offset;
            this.domain.addEvent(Event.AFTER_RENDER, this.orbitCtrlUpdate, this);
        }
        public removeOrbitCtrl(): void {
            this.domain.removeEvent(Event.AFTER_RENDER, this.orbitCtrlUpdate);
            if (this.orbCtrl) {
                console.log(this.orbCtrl);
                this.orbCtrl.enabled = false;
                this.orbCtrl = undefined;
                console.log(this.orbCtrl);
            }
        }


    }
}