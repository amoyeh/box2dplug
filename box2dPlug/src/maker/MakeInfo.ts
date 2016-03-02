module box2dp {

    export class MakeInfo {

        //static members
        //===================================================================================
        public static ONED: number = Math.PI / 180;
        public static round(num: number): number { return Math.round(num * 1000) / 1000; }
        public static random(min: number, max: number, round: boolean = true): number {
            var range = Math.random() * (max - min) + min;
            if (round) range = MakeInfo.round(range);
            return range;
        }
        public static usePixelScale: boolean = true;
        //if use pixelScale , divide the value by 30
        public static div30(value: number): number {
            return MakeInfo.round(value / 30);
        }
        //get value rounded and multiply it by 30
        public static mult30(value: number): number {
            return Math.round(value * 30);
        }
        //if use pixelScale , divide the value by 30
        public static getb2Vec2(input: any | box2d.b2Vec2): box2d.b2Vec2 {
            if (this.usePixelScale) {
                var x = MakeInfo.round(input.x / 30);
                var y = MakeInfo.round(input.y / 30);
                return new box2d.b2Vec2(x, y);
            } else {
                return input;
            }
        }
        //creation type
        public static MAKE_BOX_TOP_LEFT: number = 1;
        public static MAKE_BOX_CENTER: number = 2;
        public static MAKE_POLYGON: number = 3;
        public static MAKE_CIRCLE: number = 4;
        public static MAKE_EDGE: number = 5;
        public static MAKE_COMPOUND: number = 6;
        //===================================================================================

        public name: string;
        public itemType: number;
        public x: number = 0;
        public y: number = 0;
        public w: number = 0;
        public h: number = 0;
        public radius: number = 0;
        public createType: number;
        public allowSleep: boolean = true;
        public isStatic: boolean = false;
        //default density set to 1 for physic to act properly
        public density: number = 1;
        //friction, 0 no sliding ~ 1 strong sliding (smooth surface)
        public friction: number = 0.2;
        //how bouncy the object is , 0 no bounce ~ 1 strong bounce 
        public restitution: number = 0;
        public fixedRotation: boolean = false;
        public loopEdge: boolean = false;
        public isSensor: boolean = false;
        public categoryBits: number;
        public maskBits: number;
        public angle: number;
        public bullet: boolean;
        public vertices: { x: number, y: number }[];
        //other MakeInfos by reference
        public makeInfos: MakeInfo[];
        //used internally to convert x, y points into b2Vec2, only created with clone function
        public b2Vertices: box2d.b2Vec2[];
        public userData: any;
        public fixtureData: any;

        constructor(setting: {
            name?: string, itemType?: number, x?: number, y?: number, w?: number, h?: number, radius?: number, createType?: number, allowSleep?: boolean,
            isStatic?: boolean, density?: number, friction?: number, restitution?: number, fixedRotation?: boolean, angle?: number,
            bullet?: boolean, vertices?: { x: number, y: number }[], loopEdge?: boolean, isSensor?: boolean, categoryBits?: number,
            maskBits?: number, makeInfos?: MakeInfo[], userData?: any, fixtureData?: any
        }) {
            for (var p in setting) {
                this[p] = setting[p];
            }
        }
        public clone(offset: boolean = false): MakeInfo {
            var newInfo = new MakeInfo(null);
            //copy every number, string, boolean to new type (value types can copy directly)
            for (var p in this) {
                if (typeof this[p] == "number" || typeof this[p] == "boolean" || typeof this[p] == "string") {
                    newInfo[p] = this[p];
                }
            }
            //reference other infos
            if (this.makeInfos) {
                newInfo.makeInfos = this.makeInfos;
            }
            //reference other userData
            if (this.userData) newInfo.userData = this.userData;
            if (this.fixtureData) newInfo.fixtureData = this.fixtureData;

            var ox = 0;
            var oy = 0;
            if (offset) ox += this.x;
            if (offset) oy += this.y;

            //copy every vertices, divide by 30 later if using pixel space
            if (this.vertices) {
                newInfo.vertices = [];
                newInfo.b2Vertices = [];
                for (var k: number = 0; k < this.vertices.length; k++) {
                    newInfo.vertices.push({ x: this.vertices[k].x + ox, y: this.vertices[k].y + oy });
                    newInfo.b2Vertices.push(new box2d.b2Vec2(this.vertices[k].x + ox, this.vertices[k].y + oy));
                }
            }
            //divide by 30 to box2d coordinate system
            var divNames: string[] = ["x", "y", "w", "h", "radius"];
            var arrayNames: string[] = ["vertices", "b2Vertices"];
            if (MakeInfo.usePixelScale) {
                for (var p in newInfo) {
                    //value that requires divisions
                    if (divNames.indexOf(p) > -1) {
                        newInfo[p] = MakeInfo.div30(newInfo[p]);
                    }
                    //array of polygon, require division
                    if (arrayNames.indexOf(p) > -1) {
                        for (var k: number = 0; k < newInfo[p].length; k++) {
                            newInfo[p][k].x = MakeInfo.div30(newInfo[p][k].x);
                            newInfo[p][k].y = MakeInfo.div30(newInfo[p][k].y);
                        }
                    }
                }
            }
            return newInfo;
        }
    }

}