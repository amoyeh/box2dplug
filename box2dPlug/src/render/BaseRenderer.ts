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


        public beforeStep(): void { }
        public afterStep(): void { }
        public render(): void { }

        public onItemCreate(item: ItemEntity): void { };
        public onItemRemove(item: ItemEntity): void { };

    }


}