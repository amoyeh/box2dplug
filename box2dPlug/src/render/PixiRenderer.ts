module box2dp {

    export class PixiRenderer extends BaseRenderer {

        public renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
        public scene: PIXI.Container;
        public container: PIXI.Container;
        public quadGraphic: PIXI.Graphics;
        public overGraphic: PIXI.Graphics;

        constructor(options?: RendererOptions) {

            //by pass options to super, default values are set if null
            super(options);

            var renderObj: any = { antialias: options.antialias, transparent: options.transparent };
            if (options.transparent == false && options.backgroundColor) renderObj.backgroundColor = options.backgroundColor;

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

        public beforeStep(): void { }
        public afterStep(): void { }

        public render(): void {
            var ilen: number = this.domain.items.length;
            for (var p: number = 0; p < ilen; p++) {
                var litem: ItemEntity = this.domain.items[p];
                if (litem.display["pixi"]) {
                    this.itemDisplayUpdate(litem.display["pixi"], litem);
                }
            }

            if (this.hasDrawType(BaseRenderer.DRAW_QUAD_TREE) && this.domain.quadTree != null) {
                this.quadGraphic.visible = true;
                this.quadGraphic.clear();
                if (this.domain.quadTree.rootNode) {
                    this.drawTreeNode(this.domain.quadTree.rootNode);
                }
            }
            if (!this.hasDrawType(BaseRenderer.DRAW_QUAD_TREE)) {
                this.quadGraphic.clear();
                this.quadGraphic.visible = false;
            }

            this.renderer.render(this.scene);
        }

        private drawTreeNode(targetNode: box2dp.QuadNode): void {
            if (targetNode.nodes.length > 0) {
                for (var i = 0; i < targetNode.nodes.length; i++) {
                    this.drawTreeNode(targetNode.nodes[i]);
                }
            }
            var g: PIXI.Graphics = this.quadGraphic;
            g.lineStyle(2, this.colorClass.QUADTREE, this.colorClass.QUADTREE_A);
            g.drawRect(MakeInfo.mult30(targetNode.x), MakeInfo.mult30(targetNode.y), MakeInfo.mult30(targetNode.width), MakeInfo.mult30(targetNode.height));
        }

        public onItemCreate(item: ItemEntity): void {

            var it: ItemEntity = <ItemEntity>item;
            var display: PIXI.Container = new PIXI.Container();
            var gshape: PIXI.Graphics = new PIXI.Graphics();
            gshape.name = "shape";
            var gcenter: PIXI.Graphics = new PIXI.Graphics();
            gcenter.name = "center";
            var gboundary: PIXI.Graphics = new PIXI.Graphics();
            gboundary.name = "boundary";
            display.addChild(gshape);
            gshape.addChild(gcenter);
            display.addChild(gboundary);
            it.display["pixi"] = display;
            this.container.addChild(display);
            var ft: box2d.b2Fixture = it.b2body.GetFixtureList();
            var useColor: number = this.colorClass.ITEM_STATIC;
            var useAlpha: number = this.colorClass.ITEM_ALPHA;
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
                        var cir: box2d.b2CircleShape = ft.GetShape();
                        var radius: number = MakeInfo.mult30(cir.m_radius);
                        gshape.lineWidth = 0;
                        gshape.beginFill(useColor, useAlpha);
                        var tox: number = MakeInfo.mult30(cir.m_p.x);
                        var toy: number = MakeInfo.mult30(cir.m_p.y);
                        gshape.drawCircle(tox, toy, radius);
                        gshape.endFill();
                        break;

                    case box2d.b2ShapeType.e_polygonShape:
                        var ps: box2d.b2PolygonShape = ft.GetShape();
                        gshape.lineWidth = 0;
                        gshape.beginFill(useColor, useAlpha);
                        var xtoAt0 = MakeInfo.mult30(ps.m_vertices[0].x);
                        var ytoAt0 = MakeInfo.mult30(ps.m_vertices[0].y);
                        gshape.moveTo(xtoAt0, ytoAt0);
                        for (var m: number = 0; m < ps.m_count; m++) {
                            var xto = MakeInfo.mult30(ps.m_vertices[m].x);
                            var yto = MakeInfo.mult30(ps.m_vertices[m].y);
                            gshape.lineTo(xto, yto);
                        }
                        gshape.lineTo(xtoAt0, ytoAt0);
                        gshape.endFill();
                        break;
                    case box2d.b2ShapeType.e_edgeShape:
                        var eg: box2d.b2EdgeShape = ft.GetShape();
                        gshape.lineStyle(1, useColor, useAlpha);
                        gshape.lineWidth = 2;
                        var x1 = MakeInfo.mult30(eg.m_vertex1.x), y1 = MakeInfo.mult30(eg.m_vertex1.y);
                        var x2 = MakeInfo.mult30(eg.m_vertex2.x), y2 = MakeInfo.mult30(eg.m_vertex2.y);
                        gshape.moveTo(x1, y1);
                        gshape.lineTo(x2, y2);
                        break;
                }
                ft = ft.GetNext();
            }


            //draw center
            //------------------------------------------------
            var ctx: number = MakeInfo.mult30(it.b2body.GetLocalCenter().x);
            var cty: number = MakeInfo.mult30(it.b2body.GetLocalCenter().y);
            //X being R color
            gcenter.moveTo(ctx, cty);
            gcenter.lineStyle(1, 0xFFAD99, 1);
            gcenter.lineTo(ctx + 8, cty);
            //Y being G color
            gcenter.moveTo(ctx, cty);
            gcenter.lineStyle(1, 0xADFF99, 1);
            gcenter.lineTo(ctx, cty + 8);


            //draw local boundary
            //------------------------------------------------
            var bd = item.getBoundary(true, true);
            gboundary.lineStyle(1, 0x6f586f, 1);
            //upper line
            this.dashLine(gboundary, bd.x, bd.y, bd.x + bd.w, bd.y);
            //lower line
            this.dashLine(gboundary, bd.x, bd.y + bd.h, bd.x + bd.w, bd.y + bd.h);
            //left
            this.dashLine(gboundary, bd.x, bd.y, bd.x, bd.y + bd.h);
            //right
            this.dashLine(gboundary, bd.x + bd.w, bd.y, bd.x + bd.w, bd.y + bd.h);
            //gboundary.drawRect(bd.x, bd.y, bd.w, bd.h);

            this.itemDisplayUpdate(display, it);

        }

        public onItemRemove(item: ItemEntity): void {
            if (item.display) {
                if (item.display["pixi"]) {
                    this.container.removeChild(item.display["pixi"]);
                    item.display["pixi"].destroy(true); //recursively destroy all children
                    delete item.display["pixi"];
                }
            }
        }

        protected itemDisplayUpdate(display: PIXI.Container, item: ItemEntity): void {

            display.x = item.ix;
            display.y = item.iy;
            display.getChildByName("shape").rotation = item.ir;
            display.getChildByName("shape").visible = this.hasDrawType(BaseRenderer.DRAW_SHAPE);
            display.getChildByName("shape").getChildByName("center").visible = this.hasDrawType(BaseRenderer.DRAW_CENTER);
            display.getChildByName("boundary").visible = this.hasDrawType(BaseRenderer.DRAW_BOUNDARY);

            //update local boundary
            var gb: PIXI.Graphics = <PIXI.Graphics>display.getChildByName("boundary");
            gb.clear();
            var bd = item.getBoundary(true, true);
            gb.lineStyle(1, 0x6f586f, 1);
            //upper line
            this.dashLine(gb, bd.x, bd.y, bd.x + bd.w, bd.y);
            //lower line
            this.dashLine(gb, bd.x, bd.y + bd.h, bd.x + bd.w, bd.y + bd.h);
            //left
            this.dashLine(gb, bd.x, bd.y, bd.x, bd.y + bd.h);
            //right
            this.dashLine(gb, bd.x + bd.w, bd.y, bd.x + bd.w, bd.y + bd.h);

        }

        protected dashLine(g: PIXI.Graphics, x, y, x2, y2, dashArray?: number[]) {
            if (!dashArray) dashArray = [10, 5];
            var dashCount = dashArray.length;
            g.moveTo(x, y);
            var dx = (x2 - x), dy = (y2 - y);
            var slope = dx ? dy / dx : 1e15;
            var distRemaining = Math.sqrt(dx * dx + dy * dy);
            var dashIndex = 0, draw = true;
            while (distRemaining >= 0.1) {
                var dashLength = dashArray[dashIndex++ % dashCount];
                if (dashLength > distRemaining) dashLength = distRemaining;
                var xStep = Math.sqrt(dashLength * dashLength / (1 + slope * slope));
                if (dx < 0) xStep = -xStep;
                x += xStep
                y += slope * xStep;
                if (draw) { g.lineTo(x, y); } else { g.moveTo(x, y); }
                distRemaining -= dashLength;
                draw = !draw;
            }
        }

    }

}