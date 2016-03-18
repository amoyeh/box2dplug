module box2dp {

    export interface RendererOptions {
        width?: number;
        height?: number;
        antialias?: boolean;
        backgroundColor?: number; //by defualt uses Color.Background
        elementId?: string;
        invertY?: boolean; //used in three.js , default is true
        dragFlags?: number;
        transparent?: boolean;
        colorClass?: box2dp.Color;
    }

    export class BaseRenderer {

        public static DRAW_SHAPE: number = 1 << 1;
        public static DRAW_CENTER: number = 1 << 2;
        public static DRAW_BOUNDARY: number = 1 << 3;
        public static DRAW_QUAD_TREE: number = 1 << 4;
        public static DRAW_JOINT: number = 1 << 5;

        public static DRAW_ALL: number = BaseRenderer.DRAW_SHAPE | BaseRenderer.DRAW_CENTER | BaseRenderer.DRAW_BOUNDARY | BaseRenderer.DRAW_QUAD_TREE | BaseRenderer.DRAW_JOINT;

        public drawFlags: number = BaseRenderer.DRAW_SHAPE;
        public domain: Domain;
        public useElement: HTMLElement;
        public options: RendererOptions;
        public colorClass: Color;

        constructor(options?: RendererOptions) {
            if (options.width == null) options.width = 900;
            if (options.height == null) options.height = 600;
            if (options.antialias == null) options.antialias = true;
            if (options.invertY == null) options.invertY = true;
            if (options.elementId == null || document.getElementById(options.elementId) == null) {
                this.useElement = document.body;
            } else {
                this.useElement = document.getElementById(options.elementId);
            }
            if (options.dragFlags) this.drawFlags = options.dragFlags;
            if (options.colorClass == null) {
                this.colorClass = new Color();
            } else {
                this.colorClass = options.colorClass;
            }
            this.options = options;
        }

        public hasDrawType(checkType: any): boolean {
            return ((this.drawFlags & checkType) == checkType);
        }

        protected simpleJoinDraw(jt: box2d.b2Joint): boolean {
            var types = [box2d.b2RevoluteJoint, box2d.b2WeldJoint, box2d.b2PrismaticJoint, box2d.b2FrictionJoint,
                box2d.b2AreaJoint, box2d.b2WheelJoint, box2d.b2GearJoint, box2d.b2DistanceJoint, box2d.b2MotorJoint];
            for (var t: number = 0; t < types.length; t++) {
                if (jt instanceof types[t]) return true;
            }
            return false;
        }

        public beforeStep(): void { }
        public afterStep(): void { }
        public render(): void { }

        public onItemCreate(item: ItemEntity): void { };
        public onItemRemove(item: ItemEntity): void { };
        public onParticleSystemCreate(system: box2d.b2ParticleSystem, shapeType: number, color: number, alpha: number): void { };
        public onParticleCreate(item: ItemParticle): void { };
        public onParticleDestroy(removeOne: ItemParticle): void { };

    }


}