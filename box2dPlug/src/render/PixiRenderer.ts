module box2dp {

    export class PixiRenderer extends BaseRenderer {

        public renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
        public scene: PIXI.Container;
        public container: PIXI.Container;
        public quadGraphic: PIXI.Graphics;
        public overGraphic: PIXI.Graphics;
        public jointGraphic: PIXI.Graphics;

        public psGeometries: { shapeType: number, color: number, alpha: number }[];

        constructor(options?: RendererOptions) {

            //by pass options to super, default values are set if null
            super(options);

            var renderObj: any = { antialias: false, transparent: false };
            if (options.antialias) renderObj.antialias = true;
            if (options.transparent) renderObj.transparent = true;
            this.renderer = PIXI.autoDetectRenderer(options.width, options.height, renderObj);
            if ((!options.transparent) && options.backgroundColor) {
                this.renderer.backgroundColor = options.backgroundColor;
            }

            this.useElement.appendChild(this.renderer.view);
            this.scene = new PIXI.Container();
            this.container = new PIXI.Container();
            this.scene.addChild(this.container);
            this.quadGraphic = new PIXI.Graphics();
            this.scene.addChild(this.quadGraphic);
            this.overGraphic = new PIXI.Graphics();
            this.scene.addChild(this.overGraphic);
            this.jointGraphic = new PIXI.Graphics();
            this.scene.addChild(this.jointGraphic);

            this.psGeometries = [];

        }

        public beforeStep(): void { }
        public afterStep(): void { }

        public render(): void {

            //update global joints guide, reset lines
            this.jointGraphic.clear();
            this.jointGraphic.lineStyle(1, this.colorClass.LINE_JOINT, 1);

            var ilen: number = this.domain.items.length;
            for (var p: number = 0; p < ilen; p++) {
                var litem: ItemEntity = this.domain.items[p];
                if (litem.display["pixi"]) {
                    this.itemDisplayUpdate(litem.display["pixi"], litem);
                }
            }

            for (var t: number = 0; t < this.domain.particleSystems.length; t++) {
                var lsys = this.domain.particleSystems[t];
                var useArray: ItemParticle[] = this.domain.particles[lsys.name];
                //update only this.particles size, since,lsys.GetPositionBuffer() get fixed buffer that might contain invalid null data
                for (var u: number = 0; u < useArray.length; u++) {
                    if (useArray[u].display["pixi"]) {
                        var grapic: PIXI.Graphics = useArray[u].display["pixi"];
                        grapic.x = useArray[u].ix;
                        grapic.y = useArray[u].iy;
                    }
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
                for (var i = 0; i < targetNode.nodes.length; i++) this.drawTreeNode(targetNode.nodes[i]);
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
            if (item.isSensor) {
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
                        //gshape.lineStyle(1, useColor, useAlpha);
                        //gshape.moveTo(tox, toy);
                        //gshape.lineTo(tox + radius, 0);
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

        public onParticleSystemCreate(system: box2d.b2ParticleSystem, shapeType: number, color: number, alpha: number): void {
            this.psGeometries[system.name] = { shapeType: shapeType, color: color, alpha: alpha };
        }

        public onParticleCreate(item: ItemParticle): void {
            var graphic: PIXI.Graphics = new PIXI.Graphics();
            var useInfo = this.psGeometries[item.system.name];
            var useColor = useInfo.color;
            var useAlpha = useInfo.alpha;
            if (item.uniqueColor != null) {
                useColor = item.uniqueColor;
                useAlpha = item.uniqueAlpha;
            }
            var radius = MakeInfo.mult30(item.system.GetRadius());
            if (useInfo.shapeType == box2dp.MakeInfo.MAKE_BOX_CENTER) {
                graphic.beginFill(useColor, useAlpha);
                graphic.drawRect(-radius, -radius, radius * 2, radius * 2);
                graphic.endFill();
            } else {
                graphic.beginFill(useColor, useAlpha);
                graphic.drawCircle(0, 0, radius);
                graphic.endFill();
            }
            graphic.x = item.cx;
            graphic.y = item.cy;
            this.container.addChild(graphic);
            item.display["pixi"] = graphic;
            graphic.name = item.name;
        }

        public onParticleDestroy(removeOne: ItemParticle): void {
            if (removeOne.display["pixi"]) {
                this.container.removeChild(removeOne.display["pixi"]);
                removeOne.display["pixi"].destroy(true); //recursively destroy all children
                delete removeOne.display["pixi"];
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

            //update joints
            if (this.hasDrawType(BaseRenderer.DRAW_JOINT)) {
                var je: box2d.b2JointEdge = item.b2body.GetJointList();
                if (je != null) {
                    for (var jt: box2d.b2Joint = je.joint; jt; jt = jt.GetNext()) {
                        if (jt.GetBodyA().item && jt.GetBodyB().item) {

                            if (this.simpleJoinDraw(jt)) {
                                this.jointGraphic.moveTo(jt.GetBodyA().item.ix, jt.GetBodyA().item.iy);
                                this.jointGraphic.lineTo(jt.GetBodyB().item.ix, jt.GetBodyB().item.iy);
                            } else if (jt instanceof box2d.b2PulleyJoint) {
                                this.jointGraphic.moveTo(jt.GetBodyA().item.ix, jt.GetBodyA().item.iy);
                                this.jointGraphic.lineTo(MakeInfo.mult30(jt.m_groundAnchorA.x), MakeInfo.mult30(jt.m_groundAnchorA.y));
                                this.jointGraphic.moveTo(jt.GetBodyB().item.ix, jt.GetBodyB().item.iy);
                                this.jointGraphic.lineTo(MakeInfo.mult30(jt.m_groundAnchorB.x), MakeInfo.mult30(jt.m_groundAnchorB.y));
                                this.jointGraphic.moveTo(MakeInfo.mult30(jt.m_groundAnchorA.x), MakeInfo.mult30(jt.m_groundAnchorA.y));
                                this.jointGraphic.lineTo(MakeInfo.mult30(jt.m_groundAnchorB.x), MakeInfo.mult30(jt.m_groundAnchorB.y));
                            }

                        }
                    }
                }
            }

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