module box2dp {

    export class ThreeRenderer extends BaseRenderer {

        public static JOINT_PT_MAX: number = 100000;
        public static QUAD_PT_MAX: number = 10000;

        public camera: THREE.PerspectiveCamera;
        public renderer: THREE.WebGLRenderer;
        public scene: THREE.Scene;
        public container: THREE.Object3D;
        public quadGraphic: THREE.Object3D;
        public overGraphic: THREE.Object3D;
        public jointGraphic: THREE.Object3D;

        public jointLine: THREE.LineSegments;
        public jointVerticeCount: number = 0;
        public jointLastPt: box2d.b2Vec2;

        public quadLine: THREE.LineSegments;
        public quadVerticeCount: number = 0;
        public lastQuadPt: box2d.b2Vec2;
        public psGeometries: { geometry: THREE.Geometry, mat: THREE.MeshBasicMaterial }[];

        constructor(options?: RendererOptions) {

            super(options);

            this.camera = new THREE.PerspectiveCamera(45, options.width / options.height, 1, 10000);
            var fov = 45;
            var vFOV = fov * (Math.PI / 180); //convert to radians
            //pixel perfect position setup 
            this.camera.position.z = options.height / (2 * Math.tan(vFOV / 2));
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));

            this.renderer = new THREE.WebGLRenderer({ antialias: options.antialias, alpha: this.options.transparent });
            this.renderer.setSize(options.width, options.height);
            if (!this.options.transparent) {
                if (this.options.backgroundColor) this.renderer.setClearColor(this.options.backgroundColor, 1);
            }
            this.useElement.appendChild(this.renderer.domElement);

            this.scene = new THREE.Scene();
            this.container = new THREE.Object3D();
            this.scene.add(this.container);
            this.quadGraphic = new THREE.Object3D();
            this.jointGraphic = new THREE.Object3D();
            this.overGraphic = new THREE.Object3D();
            this.scene.add(this.quadGraphic);
            this.scene.add(this.overGraphic);
            this.scene.add(this.jointGraphic);

            //quadtree geometry
            var qGeo = new THREE.Geometry();
            for (var i: number = 0; i < ThreeRenderer.QUAD_PT_MAX; i++) qGeo.vertices.push(new THREE.Vector3(0, 0, 0));
            this.quadLine = new THREE.LineSegments(qGeo, this.colorClass.getLineQuadTree());
            qGeo.computeLineDistances();
            this.quadGraphic.add(this.quadLine);

            //joint ine geometry
            var jointGeo = new THREE.Geometry();
            for (var i: number = 0; i < ThreeRenderer.JOINT_PT_MAX; i++) jointGeo.vertices.push(new THREE.Vector3(0, 0, 0));
            this.jointLine = new THREE.LineSegments(jointGeo, this.colorClass.getLineJoint());
            jointGeo.computeLineDistances();
            this.jointGraphic.add(this.jointLine);

            this.renderer.render(this.scene, this.camera);
            if (options.invertY) this.invertYSetup();

            this.psGeometries = [];

        }

        public invertYSetup(): void {
            this.container.scale.set(1, -1, 1);
            this.quadGraphic.scale.set(1, -1, 1);
            this.overGraphic.scale.set(1, -1, 1);
            this.jointGraphic.scale.set(1, -1, 1);
            this.camera.position.x = this.options.width * .5;
            this.camera.position.y = this.options.height * -.5;
        }

        public beforeStep(): void { }
        public afterStep(): void { }

        public render(): void {

            var ilen: number = this.domain.items.length;

            //update global joints guide, reset lines
            var jgeo: THREE.Geometry = <THREE.Geometry>this.jointLine.geometry;
            this.jointVerticeCount = 0;
            this.jointLastPt = null;

            for (var p: number = 0; p < ilen; p++) {
                var litem: ItemEntity = this.domain.items[p];
                if (litem.display["three"]) {
                    this.itemDisplayUpdate(litem.display["three"], litem);
                }
            }


            for (var t: number = 0; t < this.domain.particleSystems.length; t++) {
                var lsys = this.domain.particleSystems[t];
                var useArray: ItemParticle[] = this.domain.particles[lsys.name];
                //update only this.particles size, since,lsys.GetPositionBuffer() get fixed buffer that might contain invalid null data
                for (var u: number = 0; u < useArray.length; u++) {
                    if (useArray[u].display["three"]) {
                        var display: THREE.Object3D = useArray[u].display["three"];
                        display.position.set(useArray[u].ix, useArray[u].iy, 0);
                    }
                }
            }
            
            //update rest of joint points to last position from item joints
            if (this.hasDrawType(BaseRenderer.DRAW_JOINT)) {
                this.jointLine.visible = true;
                if (this.jointLastPt) {
                    for (var j: number = this.jointVerticeCount; j < ThreeRenderer.JOINT_PT_MAX; j++) jgeo.vertices[j].set(this.jointLastPt.x, this.jointLastPt.y, 0);
                }
                jgeo.verticesNeedUpdate = true;
            } else {
                this.jointLine.visible = false;
            }

            if (this.hasDrawType(BaseRenderer.DRAW_QUAD_TREE) && this.domain.quadTree != null) {
                this.quadGraphic.visible = true;
                if (this.domain.quadTree.rootNode) {
                    this.quadVerticeCount = 0;
                    this.drawTreeNode(this.domain.quadTree.rootNode);
                }
                (<THREE.Geometry>this.quadLine.geometry).verticesNeedUpdate = true;
                //update rest of quad vertices 
                if (this.lastQuadPt) {
                    for (var q: number = this.quadVerticeCount; q < ThreeRenderer.QUAD_PT_MAX; q++) {
                        (<THREE.Geometry>this.quadLine.geometry).vertices[q].set(this.lastQuadPt.x, this.lastQuadPt.y, 0);
                    }
                }
            }
            if (!this.hasDrawType(BaseRenderer.DRAW_QUAD_TREE)) {
                this.quadGraphic.visible = false;
            }
            this.renderer.render(this.scene, this.camera);
        }

        private drawTreeNode(targetNode: box2dp.QuadNode): void {
            if (targetNode.nodes.length > 0) {
                for (var i = 0; i < targetNode.nodes.length; i++) this.drawTreeNode(targetNode.nodes[i]);
            }
            var ax = MakeInfo.mult30(targetNode.x);
            var ay = MakeInfo.mult30(targetNode.y);
            var aw = MakeInfo.mult30(targetNode.width);
            var ah = MakeInfo.mult30(targetNode.height);

            var si: number = this.quadVerticeCount;
            var geo: THREE.Geometry = <THREE.Geometry>this.quadLine.geometry;
            geo.vertices[si].set(ax, ay, 0);
            geo.vertices[si + 1].set(ax + aw, ay, 0);
            geo.vertices[si + 2].set(ax + aw, ay, 0);
            geo.vertices[si + 3].set(ax + aw, ay + ah, 0);
            geo.vertices[si + 4].set(ax + aw, ay + ah, 0);
            geo.vertices[si + 5].set(ax, ay + ah, 0);
            geo.vertices[si + 6].set(ax, ay + ah, 0);
            geo.vertices[si + 7].set(ax, ay, 0);
            this.lastQuadPt = new box2d.b2Vec2(ax, ay);
            this.quadVerticeCount += 8;

        }

        public clearOverShapes(): void {
            for (var s: number = this.overGraphic.children.length - 1; s > -1; s--) {
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
        }

        public onItemCreate(item: ItemEntity): void {
            /**** 
            === item structure ===
            display (Object3D)
                -shape (meshes) circle, rectangle, line..
                -clx (line)
                -cly (line)
                -boundary (line)
            *****/
            var it: ItemEntity = <ItemEntity>item;
            var display: THREE.Object3D = new THREE.Object3D();
            display.name = item.name;
            it.display["three"] = display;
            this.container.add(display);

            var shape3d: THREE.Object3D = new THREE.Object3D();
            shape3d.name = "shape";
            display.add(shape3d);

            var ft: box2d.b2Fixture = it.b2body.GetFixtureList();

            var useMat: THREE.MeshBasicMaterial = this.colorClass.getItemStaticMat();
            if (it.b2body.GetType() == box2d.b2BodyType.b2_dynamicBody) useMat = this.colorClass.getItemDynamicMat();
            if (item.isSensor) useMat = this.colorClass.getSensorMat();


            var useLineMat: THREE.LineBasicMaterial = this.colorClass.getLineMatStatic();
            if (it.b2body.GetType() == box2d.b2BodyType.b2_dynamicBody) useLineMat = this.colorClass.getLineMatDynamic();

            while (ft != null) {

                switch (ft.GetType()) {

                    case box2d.b2ShapeType.e_circleShape:
                        var cir: box2d.b2CircleShape = ft.GetShape();
                        var radius: number = MakeInfo.mult30(cir.m_radius);
                        var cirGeo: THREE.CircleGeometry = new THREE.CircleGeometry(radius, 24);
                        var circleMesh: THREE.Mesh = new THREE.Mesh(cirGeo, useMat);
                        var tox: number = MakeInfo.mult30(cir.m_p.x);
                        var toy: number = MakeInfo.mult30(cir.m_p.y);
                        circleMesh.position.set(tox, toy, 0);
                        shape3d.add(circleMesh);
                        //var circleLine: THREE.Line = new THREE.Line(
                        //var circleLineGeo: THREE.Geometry = new THREE.Geometry();
                        //circleLineGeo.vertices.push(new THREE.Vector3(0, 0, 0));
                        //circleLineGeo.vertices.push(new THREE.Vector3(radius, 0, 0));
                        //shape3d.add(new THREE.Line(circleLineGeo, useLineMat));

                        break;

                    case box2d.b2ShapeType.e_polygonShape:
                        var polyShape: THREE.Shape = new THREE.Shape();
                        var ps: box2d.b2PolygonShape = ft.GetShape();
                        var xtoAt0 = MakeInfo.mult30(ps.m_vertices[0].x);
                        var ytoAt0 = MakeInfo.mult30(ps.m_vertices[0].y);
                        polyShape.moveTo(xtoAt0, ytoAt0);
                        for (var m: number = 1; m < ps.m_count; m++) {
                            var xto = MakeInfo.mult30(ps.m_vertices[m].x);
                            var yto = MakeInfo.mult30(ps.m_vertices[m].y);
                            polyShape.lineTo(xto, yto);
                        }
                        polyShape.lineTo(xtoAt0, ytoAt0);
                        var polyGeometry: THREE.ShapeGeometry = new THREE.ShapeGeometry(polyShape);
                        var polyMesh = new THREE.Mesh(polyGeometry, useMat);
                        shape3d.add(polyMesh);
                        break;

                    case box2d.b2ShapeType.e_edgeShape:
                        var lineGeo: THREE.Geometry = new THREE.Geometry();
                        var eg: box2d.b2EdgeShape = ft.GetShape();
                        var x1 = MakeInfo.mult30(eg.m_vertex1.x), y1 = MakeInfo.mult30(eg.m_vertex1.y);
                        var x2 = MakeInfo.mult30(eg.m_vertex2.x), y2 = MakeInfo.mult30(eg.m_vertex2.y);
                        lineGeo.vertices.push(new THREE.Vector3(x1, y1, 0));
                        lineGeo.vertices.push(new THREE.Vector3(x2, y2, 0));
                        var edgeLine = new THREE.Line(lineGeo, useLineMat);
                        shape3d.add(edgeLine);
                        break;
                }
                ft = ft.GetNext();
            }

            //draw center
            //------------------------------------------------
            var ctx: number = MakeInfo.mult30(it.b2body.GetLocalCenter().x);
            var cty: number = MakeInfo.mult30(it.b2body.GetLocalCenter().y);
            
            var geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(ctx, cty, 1), new THREE.Vector3(ctx + 8, cty, 0));
            var line = new THREE.Line(geometry, this.colorClass.getLineCenterXMat());
            line.name = "clx";
            shape3d.add(line);

            geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(ctx, cty, 1), new THREE.Vector3(ctx, cty + 8, 0));
            var line = new THREE.Line(geometry, this.colorClass.getLineCenterYMat());
            line.name = "cly";
            shape3d.add(line);

            //draw local boundary
            //------------------------------------------------
            var bd = item.getBoundary(true, true);
            geometry = new THREE.Geometry();
            geometry.vertices.push(
                new THREE.Vector3(bd.x, bd.y, 0), new THREE.Vector3(bd.x + bd.w, bd.y, 0),
                new THREE.Vector3(bd.x + bd.w, bd.y + bd.h, 0), new THREE.Vector3(bd.x, bd.y + bd.h, 0),
                new THREE.Vector3(bd.x, bd.y, 0));
            var bdline = new THREE.Line(geometry, this.colorClass.getLineBoundary());
            bdline.name = "boundary";
            geometry.computeLineDistances();
            display.add(bdline);

            this.itemDisplayUpdate(display, it);

        }

        public onItemRemove(item: ItemEntity): void {
            if (item.display) {
                if (item.display["three"]) {
                    var threeObj: THREE.Object3D = item.display["three"];
                    
                    // delete child items 
                    /**** 
                    === item structure ===
                    display (Object3D)
                        -shape (meshes) circle, rectangle, line..
                        -clx (line)
                        -cly (line)
                        -boundary (line)
                    *****/
                    this.container.remove(threeObj);
                    this.disposeObj(threeObj.getObjectByName("shape"));
                    this.disposeObj(threeObj);
                    delete item.display["three"];
                }
            }
        }

        private disposeObj(object: THREE.Object3D): void {
            var clen = object.children.length;
            //console.log("remove item " + object.name + " len: " + object.children.length);
            for (var t: number = clen - 1; t > -1; t--) {
                var childObj = object.children[t];
                if (childObj["geometry"]) {
                    childObj["geometry"].dispose();
                    childObj["geometry"] = undefined;
                    //console.log("t: " + t + "     dispose geometry");
                }
                if (childObj["material"]) {
                    childObj["material"].dispose();
                    childObj["material"] = undefined;
                    //console.log("t: " + t + "     dispose material");
                }
                if (childObj.parent) childObj.parent.remove(childObj);
            }
        }

        private itemDisplayUpdate(display: THREE.Object3D, item: ItemEntity): void {

            display.position.set(item.ix, item.iy, 0);
            display.getObjectByName("shape").rotation.set(0, 0, item.ir);
            display.getObjectByName("shape").visible = this.hasDrawType(BaseRenderer.DRAW_SHAPE);
            display.getObjectByName("clx").visible = this.hasDrawType(BaseRenderer.DRAW_CENTER);
            display.getObjectByName("cly").visible = this.hasDrawType(BaseRenderer.DRAW_CENTER);
            display.getObjectByName("boundary").visible = this.hasDrawType(BaseRenderer.DRAW_BOUNDARY);

            //update local boundary
            var bd = item.getBoundary(true, true);
            var line: THREE.Line = <THREE.Line>display.getObjectByName("boundary");
            var geo: THREE.Geometry = <THREE.Geometry>line.geometry;
            geo.vertices[0].set(bd.x, bd.y, 0);
            geo.vertices[1].set(bd.x + bd.w, bd.y, 0);
            geo.vertices[2].set(bd.x + bd.w, bd.y + bd.h, 0);
            geo.vertices[3].set(bd.x, bd.y + bd.h, 0);
            geo.vertices[4].set(bd.x, bd.y, 0);
            geo.verticesNeedUpdate = true;

            //update joints
            if (this.hasDrawType(BaseRenderer.DRAW_JOINT)) {
                var je: box2d.b2JointEdge = item.b2body.GetJointList();
                if (je != null) {
                    var jgeo: THREE.Geometry = <THREE.Geometry>this.jointLine.geometry;
                    //update global joints guide
                    for (var jt: box2d.b2Joint = je.joint; jt; jt = jt.GetNext()) {
                        if (jt.GetBodyA().item && jt.GetBodyB().item) {
                            if (this.simpleJoinDraw(jt)) {
                                jgeo.vertices[this.jointVerticeCount].set(jt.GetBodyA().item.ix, jt.GetBodyA().item.iy, 0);
                                jgeo.vertices[this.jointVerticeCount + 1].set(jt.GetBodyB().item.ix, jt.GetBodyB().item.iy, 0);
                                this.jointLastPt = new box2d.b2Vec2(jt.GetBodyB().item.ix, jt.GetBodyB().item.iy);
                                this.jointVerticeCount += 2;
                            } else if (jt instanceof box2d.b2PulleyJoint) {
                                jgeo.vertices[this.jointVerticeCount].set(jt.GetBodyA().item.ix, jt.GetBodyA().item.iy, 0);
                                jgeo.vertices[this.jointVerticeCount + 1].set(MakeInfo.mult30(jt.m_groundAnchorA.x), MakeInfo.mult30(jt.m_groundAnchorA.y), 0);
                                jgeo.vertices[this.jointVerticeCount + 2].set(jt.GetBodyB().item.ix, jt.GetBodyB().item.iy, 0);
                                jgeo.vertices[this.jointVerticeCount + 3].set(MakeInfo.mult30(jt.m_groundAnchorB.x), MakeInfo.mult30(jt.m_groundAnchorB.y), 0);
                                jgeo.vertices[this.jointVerticeCount + 4].set(MakeInfo.mult30(jt.m_groundAnchorA.x), MakeInfo.mult30(jt.m_groundAnchorA.y), 0);
                                jgeo.vertices[this.jointVerticeCount + 5].set(MakeInfo.mult30(jt.m_groundAnchorB.x), MakeInfo.mult30(jt.m_groundAnchorB.y), 0);
                                this.jointLastPt = new box2d.b2Vec2(MakeInfo.mult30(jt.m_groundAnchorB.x), MakeInfo.mult30(jt.m_groundAnchorB.y));
                                this.jointVerticeCount += 6;
                            }
                        }

                    }
                }
            }

        }

        public getXYFromCamera(xto: number, yto: number): THREE.Vector3 {
            var vect3: THREE.Vector3 = new THREE.Vector3();
            vect3.set((xto / this.options.width) * 2 - 1, - (yto / this.options.height) * 2 + 1, 0.5);
            vect3.unproject(this.camera);
            var dir = vect3.sub(this.camera.position).normalize();
            var distance = - this.camera.position.z / dir.z;
            var pos: THREE.Vector3 = this.camera.position.clone().add(dir.multiplyScalar(distance));
            if (this.options.invertY) pos.y *= -1;
            return pos;
        }

        public onParticleSystemCreate(system: box2d.b2ParticleSystem, shapeType: number, color: number, alpha: number): void {
            var mat: THREE.Material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide, opacity: alpha, transparent: true });
            var psGeo: THREE.Geometry;
            var radius: number = MakeInfo.mult30(system.GetRadius());
            if (shapeType == MakeInfo.MAKE_BOX_CENTER) {
                psGeo = new THREE.PlaneGeometry(radius * 2, radius * 2, 1, 1);
            } else {
                psGeo = new THREE.CircleGeometry(radius, 24);
            }
            this.psGeometries[system.name] = { geometry: psGeo, material: mat };

        }

        public onParticleCreate(item: ItemParticle): void {
            var useGeo = this.psGeometries[item.system.name].geometry;
            var useMat = this.psGeometries[item.system.name].material;
            if (item.uniqueColor != null) {
                useMat = new THREE.MeshBasicMaterial({ color: item.uniqueColor, side: THREE.DoubleSide, opacity: item.uniqueAlpha, transparent: true });
            }
            var mesh: THREE.Mesh = new THREE.Mesh(useGeo, useMat);
            this.container.add(mesh);
            mesh.position.x = item.cx;
            mesh.position.y = item.cy;
            item.display["three"] = mesh;
        }

        public onParticleDestroy(removeOne: ItemParticle): void {
            if (removeOne.display["three"]) {
                var mesh: THREE.Mesh = removeOne.display["three"];
                this.container.remove(mesh);
                //if color is unique , dispose it
                if (removeOne.uniqueColor != null) mesh.material.dispose();
                mesh = null;
            }
        }

        //public onParticleDestroy(removeOne: ItemParticle): void {
        //if (removeOne.display["pixi"]) {
        //    this.container.removeChild(removeOne.display["pixi"]);
        //    removeOne.display["pixi"].destroy(true); //recursively destroy all children
        //    delete removeOne.display["pixi"];
        //}
        //}


    }

}