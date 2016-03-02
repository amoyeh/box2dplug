module box2dp {

    export class ItemEntity extends ItemBase {

        public b2body: box2d.b2Body;
        public dynamic: boolean;

        public oldx: number;
        public oldy: number;
        public oldr: number;
        public cx: number;
        public cy: number;
        public cr: number;
        public ix: number;
        public iy: number;
        public ir: number;
        public enableContactEvent: boolean = false;
        private boundary: { x: number, y: number, w: number, h: number };
        private boundaryMult: { x: number, y: number, w: number, h: number };


        //display object contains 
        //ItemEntity.display["pixi"] > refer to pixi object
        //ItemEntity.display["three"] > refer to three.js object
        public display: any;

        public selector: QuadSelector;

        constructor(b2body: box2d.b2Body, type: number, name?: string) {
            super(name);
            this.type = type;
            this.b2body = b2body;
            this.b2body.item = this;
            this.setOldPos();
            this.setCurrentPos();
            this.updateBoundary();
            this.display = {};
            this.enableContactEvent = (this.type == ItemBase.SENSOR);
        }

        public setOldPos(): void {
            this.oldx = MakeInfo.mult30(this.b2body.GetPosition().x);
            this.oldy = MakeInfo.mult30(this.b2body.GetPosition().y);
            this.oldr = this.b2body.GetAngle();
        }

        public setCurrentPos(): void {
            this.cx = MakeInfo.mult30(this.b2body.GetPosition().x);
            this.cy = MakeInfo.mult30(this.b2body.GetPosition().y);
            this.cr = this.b2body.GetAngle();
        }

        public integratePos(percent: number): void {
            this.ix = Math.round(this.oldx + ((this.cx - this.oldx) * percent));
            this.iy = Math.round(this.oldy + ((this.cy - this.oldy) * percent));
            this.ir = this.oldr + ((this.cr - this.oldr) * percent);
        }

        public getb2X(): number {
            return this.b2body.GetPosition().x;
        }
        public getb2Y(): number {
            return this.b2body.GetPosition().y;
        }
        public getPixelX(): number {
            return Math.round(this.b2body.GetPosition().x * 30);
        }
        public getPixelY(): number {
            return Math.round(this.b2body.GetPosition().y * 30);
        }

        //public getb2Position(): { x: number, y: number } {
        //    return new Vector(this.b2body.GetPosition().x, this.b2body.GetPosition().y);
        //}

        //public getPixelPosition(): { x: number, y: number } {
        //    return new Vector(this.b2body.GetPosition().x * 30, this.b2body.GetPosition().y * 30);
        //}

        public updateBoundary(): void {
            var bodyAABB: any = new box2d.b2AABB();
            bodyAABB.lowerBound = new box2d.b2Vec2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
            bodyAABB.upperBound = new box2d.b2Vec2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
            for (var f = this.b2body.GetFixtureList(); f; f = f.GetNext()) {
                var shape: any = f.GetShape();
                for (var c: number = 0; c < shape.GetChildCount(); c++) bodyAABB.Combine1(f.GetAABB(c));
            }
            var tx: number = bodyAABB.lowerBound.x;
            var ty: number = bodyAABB.lowerBound.y;
            var tw: number = bodyAABB.upperBound.x - bodyAABB.lowerBound.x;
            var th: number = bodyAABB.upperBound.y - bodyAABB.lowerBound.y;
            this.boundary = { x: tx, y: ty, w: tw, h: th };
            this.boundaryMult = { x: MakeInfo.mult30(tx), y: MakeInfo.mult30(ty), w: MakeInfo.mult30(tw), h: MakeInfo.mult30(th) };
        }

        public getBoundary(mult30: boolean, useLocal: boolean): { x: number; y: number; w: number; h: number } {
            var useb = this.boundary;
            if (mult30) useb = this.boundaryMult;
            var rb = { x: useb.x, y: useb.y, w: useb.w, h: useb.h };
            if (useLocal) {
                if (mult30) {
                    rb.x -= MakeInfo.mult30(this.b2body.GetPosition().x);
                    rb.y -= MakeInfo.mult30(this.b2body.GetPosition().y);
                } else {
                    rb.x -= this.b2body.GetPosition().x;
                    rb.y -= this.b2body.GetPosition().y;
                }
            }
            return rb;
        }

        public setb2Position(x: number, y: number): void {
            this.b2body.SetPosition(new box2d.b2Vec2(x, y));
        }
        public setPixelPosition(x: number, y: number): void {
            this.b2body.SetPosition(new box2d.b2Vec2(x / 30, y / 30));
        }

        public setDynamic(isDynamic: boolean): void {
            if (this.b2body) {
                if (this.b2body.GetType() === box2d.b2BodyType.b2_dynamicBody) {
                    this.b2body.SetType(box2d.b2BodyType.b2_staticBody);
                } else if (this.b2body.GetType() === box2d.b2BodyType.b2_staticBody) {
                    this.b2body.SetType(box2d.b2BodyType.b2_dynamicBody);
                }
                this.dynamic = isDynamic;
            }
        }

        public setCollisionMask(maskBits: number): void {
            var fixture: box2d.b2Fixture = this.b2body.GetFixtureList();
            while (fixture != null) {
                var b2Filter = fixture.GetFilterData();
                b2Filter.maskBits = maskBits;
                fixture.SetFilterData(b2Filter);
                fixture = fixture.GetNext();
            }
        }

        public removePhysic(): void {
            this.b2body.SetUserData(undefined);
            this.b2body.GetWorld().DestroyBody(this.b2body);
            this.b2body.item = undefined;
            this.b2body = undefined;
            this.display = undefined;
        }

        //public setBodyAngle(radian: number, toDegree: boolean = true): void {
        //    if (this.b2body) {
        //        if (toDegree) {
        //            this.b2body.SetAngle(MakeInfo.radian(radian));
        //        } else {
        //            this.b2body.SetAngle(radian);
        //        }
        //    }
        //}

    }
}