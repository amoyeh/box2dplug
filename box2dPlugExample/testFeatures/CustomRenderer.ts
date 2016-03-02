module example {

    export class CustomRenderer extends box2dp.PixiRenderer {

        public renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
        public scene: PIXI.Container;
        public container: PIXI.Container;

        constructor(options?: box2dp.RendererOptions) {
            super(options);
        }

        public beforeStep(): void { }

        public afterStep(): void { }

        public render(): void {
            super.render();
        }

        public onItemCreate(item: box2dp.ItemEntity): void {
            super.onItemCreate(item);
        }

        public onItemRemove(item: box2dp.ItemEntity): void {
            super.onItemRemove(item);
            //console.log("onItemRemove > " + item.name);
        }

        protected itemDisplayUpdate(display: PIXI.Container, item: box2dp.ItemEntity): void {
            super.itemDisplayUpdate(display, item);
            //console.log("itemDisplayUpdate > " + item.name);
        }
    }

}