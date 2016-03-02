module box2dp {

    export class ThreeRenderer extends BaseRenderer {

        public camera: THREE.PerspectiveCamera;
        public renderer: THREE.WebGLRenderer;
        public scene: THREE.Scene;
        public container: THREE.Object3D;
        public quadGraphic: THREE.Object3D;
        public overGraphic: THREE.Object3D;

        constructor(options?: RendererOptions) {

            super(options);

            this.camera = new THREE.PerspectiveCamera(45, options.width / options.height, 1, 10000);
            var fov = 45;
            var vFOV = fov * (Math.PI / 180); //convert to radians
            //pixel perfect position setup 
            this.camera.position.z = options.height / (2 * Math.tan(vFOV / 2));
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));

            this.renderer = new THREE.WebGLRenderer({ antialias: options.antialias });
            this.renderer.setSize(options.width, options.height);
            this.renderer.setClearColor(this.colorClass.BACKGROUND, 1);
            this.useElement.appendChild(this.renderer.domElement);

            this.scene = new THREE.Scene();
            this.container = new THREE.Object3D();
            this.scene.add(this.container);
            this.quadGraphic = new THREE.Object3D();
            this.overGraphic = new THREE.Object3D();
            this.scene.add(this.quadGraphic);
            this.scene.add(this.overGraphic);

            this.renderer.render(this.scene, this.camera);
            if (options.invertY) this.invertYSetup();

        }

        public invertYSetup(): void {
            this.container.scale.set(1, -1, 1);
            this.quadGraphic.scale.set(1, -1, 1);
            this.overGraphic.scale.set(1, -1, 1);
            this.camera.position.x = this.options.width * .5;
            this.camera.position.y = this.options.height * -.5;
        }

        public beforeStep(): void { }
        public afterStep(): void { }

        public render(): void {

            var ilen: number = this.domain.items.length;
            for (var p: number = 0; p < ilen; p++) {
                var litem: ItemEntity = this.domain.items[p];
                if (litem.display["three"]) {
                    this.itemDisplayUpdate(litem.display["three"], litem);
                }
            }

            if (this.hasDrawType(BaseRenderer.DRAW_QUAD_TREE) && this.domain.quadTree != null) {
                this.quadGraphic.visible = true;
                this.clearQuadTreeGuide();
                if (this.domain.quadTree.rootNode) {
                    this.drawTreeNode(this.domain.quadTree.rootNode);
                }

            }
            if (!this.hasDrawType(BaseRenderer.DRAW_QUAD_TREE)) {
                this.quadGraphic.visible = false;
            }
            this.renderer.render(this.scene, this.camera);
        }

        private drawTreeNode(targetNode: box2dp.QuadNode): void {
            if (targetNode.nodes.length > 0) {
                for (var i = 0; i < targetNode.nodes.length; i++) {
                    this.drawTreeNode(targetNode.nodes[i]);
                }
            }
            var ax = MakeInfo.mult30(targetNode.x);
            var ay = MakeInfo.mult30(targetNode.y);
            var aw = MakeInfo.mult30(targetNode.width);
            var ah = MakeInfo.mult30(targetNode.height);
            var lg: THREE.Geometry = new THREE.Geometry();
            lg.vertices.push(
                new THREE.Vector3(ax, ay, 0), new THREE.Vector3(ax + aw, ay, 0),
                new THREE.Vector3(ax + aw, ay + ah, 0), new THREE.Vector3(ax, ay + ah, 0),
                new THREE.Vector3(ax, ay, 0));
            var line = new THREE.Line(lg, this.colorClass.getLineQuadTree(), THREE.LineStrip);
            this.quadGraphic.add(line);
        }

        private clearQuadTreeGuide(): void {
            for (var s: number = this.quadGraphic.children.length - 1; s > -1; s--) {
                var loopOne = this.quadGraphic.children[s];
                this.quadGraphic.remove(loopOne);
                loopOne["geometry"].dispose();
                loopOne["geometry"] = undefined;
            }
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
            display
                -shape
                    -center
                        -linesx2
                    -circleMesh
                    -polyMesh
                    -line
                -boundary
                    -line
            *****/
            var it: ItemEntity = <ItemEntity>item;
            var display: THREE.Object3D = new THREE.Object3D();
            display.name = item.name;
            var gshape: THREE.Object3D = new THREE.Object3D();
            gshape.name = "shape";
            var gcenter: THREE.Object3D = new THREE.Object3D();
            gcenter.position.z = 0.1;
            gcenter.name = "center";
            var gboundary: THREE.Object3D = new THREE.Object3D();
            gboundary.name = "boundary";
            gboundary.position.z = 0.2;
            display.add(gshape);
            gshape.add(gcenter);
            display.add(gboundary);
            it.display["three"] = display;
            this.container.add(display);
            var ft: box2d.b2Fixture = it.b2body.GetFixtureList();

            var useMat: THREE.MeshBasicMaterial = this.colorClass.getItemStaticMat();
            if (it.b2body.GetType() == box2d.b2BodyType.b2_dynamicBody) {
                useMat = this.colorClass.getItemDynamicMat();
            }
            if (item.type == box2dp.ItemBase.SENSOR) useMat = this.colorClass.getSensorMat();
            var useLineMat: THREE.LineBasicMaterial = this.colorClass.getLineMatStatic();
            if (it.b2body.GetType() == box2d.b2BodyType.b2_dynamicBody) {
                useLineMat = this.colorClass.getLineMatDynamic();
            }

            while (ft != null) {

                switch (ft.GetType()) {

                    case box2d.b2ShapeType.e_circleShape:
                        var cir: box2d.b2CircleShape = ft.GetShape();
                        var radius: number = MakeInfo.mult30(cir.m_radius);
                        var cirGeo: THREE.CircleGeometry = new THREE.CircleGeometry(radius, 24);
                        var circleMesh: THREE.Mesh = new THREE.Mesh(cirGeo, useMat);
                        circleMesh.name = "circleMesh";
                        var tox: number = MakeInfo.mult30(cir.m_p.x);
                        var toy: number = MakeInfo.mult30(cir.m_p.y);
                        circleMesh.position.set(tox, toy, 0);
                        gshape.add(circleMesh);
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
                        polyGeometry.name = "polyGeometry";
                        var polyMesh = new THREE.Mesh(polyGeometry, useMat);
                        polyMesh.name = "polyMesh";
                        gshape.add(polyMesh);
                        break;

                    case box2d.b2ShapeType.e_edgeShape:
                        var lineGeo: THREE.Geometry = new THREE.Geometry();
                        var eg: box2d.b2EdgeShape = ft.GetShape();
                        var x1 = MakeInfo.mult30(eg.m_vertex1.x), y1 = MakeInfo.mult30(eg.m_vertex1.y);
                        var x2 = MakeInfo.mult30(eg.m_vertex2.x), y2 = MakeInfo.mult30(eg.m_vertex2.y);
                        lineGeo.vertices.push(new THREE.Vector3(x1, y1, 0));
                        lineGeo.vertices.push(new THREE.Vector3(x2, y2, 0));
                        var line = new THREE.Line(lineGeo, useLineMat);
                        line.name = "edgeLine";
                        gshape.add(line);
                        break;

                }
                ft = ft.GetNext();
            }

            //draw center
            //------------------------------------------------
            var ctx: number = MakeInfo.mult30(it.b2body.GetLocalCenter().x);
            var cty: number = MakeInfo.mult30(it.b2body.GetLocalCenter().y);
            //X being R color
            var geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(ctx, cty, 0), new THREE.Vector3(ctx + 8, cty, 0));
            var line = new THREE.Line(geometry, this.colorClass.getLineCenterXMat());
            line.name = "centerLineX";
            gcenter.add(line);
            //Y being G color
            geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(ctx, cty, 0), new THREE.Vector3(ctx, cty + 8, 0));
            var line = new THREE.Line(geometry, this.colorClass.getLineCenterYMat());
            line.name = "centerLineY";
            gcenter.add(line);


            //draw local boundary
            //------------------------------------------------
            var bd = item.getBoundary(true, true);
            geometry = new THREE.Geometry();
            geometry.vertices.push(
                new THREE.Vector3(bd.x, bd.y, 0), new THREE.Vector3(bd.x + bd.w, bd.y, 0),
                new THREE.Vector3(bd.x + bd.w, bd.y + bd.h, 0), new THREE.Vector3(bd.x, bd.y + bd.h, 0),
                new THREE.Vector3(bd.x, bd.y, 0));
            var line = new THREE.Line(geometry, this.colorClass.getLineBoundary(), THREE.LineStrip);
            line.name = "boundaryLine";
            geometry.computeLineDistances();
            gboundary.add(line);
            this.itemDisplayUpdate(display, it);

        }

        public onItemRemove(item: ItemEntity): void {
            if (item.display) {
                if (item.display["three"]) {
                    var threeObj: THREE.Object3D = item.display["three"];
                    //recursively delete items 
                    this.disposeShape(threeObj, 0);
                    /**** 
                    === item structure ===
                    display
                        -shape
                            -center
                                -linesx2
                            -circleMesh
                            -polyMesh
                            -line
                        -boundary
                            -line
                    *****/
                    this.container.remove(threeObj);
                    delete item.display["three"];
                }
            }
        }

        private itemDisplayUpdate(display: THREE.Object3D, it: ItemEntity): void {
            display.position.set(it.ix, it.iy, 0);
            display.getObjectByName("shape").rotation.set(0, 0, it.ir);
            display.getObjectByName("shape").visible = this.hasDrawType(BaseRenderer.DRAW_SHAPE);
            display.getObjectByName("center").visible = this.hasDrawType(BaseRenderer.DRAW_CENTER);
            display.getObjectByName("boundary").visible = this.hasDrawType(BaseRenderer.DRAW_BOUNDARY);

            //update local boundary
            var bd = it.getBoundary(true, true);
            var line: THREE.Line = <THREE.Line>display.getObjectByName("boundary").getObjectByName("boundaryLine");
            var geo: THREE.Geometry = <THREE.Geometry>line.geometry;
            geo.vertices[0].set(bd.x, bd.y, 0);
            geo.vertices[1].set(bd.x + bd.w, bd.y, 0);
            geo.vertices[2].set(bd.x + bd.w, bd.y + bd.h, 0);
            geo.vertices[3].set(bd.x, bd.y + bd.h, 0);
            geo.vertices[4].set(bd.x, bd.y, 0);
            geo.verticesNeedUpdate = true;
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

        public disposeShape(obj: THREE.Object3D, depth: number): void {
            //var pname = obj.name;
            //if (obj.parent.name) pname = obj.parent.name + " > " + obj.name;
            //console.log("pname>   " + pname);
            //console.log("has geometry? " + (obj["geometry"] != undefined));
            //console.log("has material? " + (obj["material"] != undefined));
            //console.log(obj["dispose"]);
            if (obj["geometry"]) {
                obj["geometry"].dispose();
                obj["geometry"] = undefined;
                //console.log("  ===> dispose geometry ");
            }
            //TODO? probably support texture and material for general objects?
            //ThreeRenderer use shared material, don't need to be removed
            if (obj instanceof THREE.Object3D) {
                depth++;
                for (var s: number = 0; s < obj.children.length; s++) {
                    this.disposeShape(obj.children[s], depth);
                }
            }
        }

        

    
        //dispose function reference
        //    function disposeNode(node) {
        //    if (node instanceof THREE.Camera) {
        //        node = undefined;
        //    }
        //    else if (node instanceof THREE.Light) {
        //        node.dispose();
        //        node = undefined;
        //    }
        //    else if (node instanceof THREE.Mesh) {
        //        if (node.geometry) {
        //            node.geometry.dispose();
        //            node.geometry = undefined;
        //        }
        //        if (node.material) {
        //            if (node.material instanceof THREE.MeshFaceMaterial) {
        //                $.each(node.material.materials, function (idx, mtrl) {
        //                    if (mtrl.map) mtrl.map.dispose();
        //                    if (mtrl.lightMap) mtrl.lightMap.dispose();
        //                    if (mtrl.bumpMap) mtrl.bumpMap.dispose();
        //                    if (mtrl.normalMap) mtrl.normalMap.dispose();
        //                    if (mtrl.specularMap) mtrl.specularMap.dispose();
        //                    if (mtrl.envMap) mtrl.envMap.dispose();
        //                    mtrl.dispose();    // disposes any programs associated with the material
        //                    mtrl = undefined;
        //                });
        //            }
        //            else {
        //                if (node.material.map) node.material.map.dispose();
        //                if (node.material.lightMap) node.material.lightMap.dispose();
        //                if (node.material.bumpMap) node.material.bumpMap.dispose();
        //                if (node.material.normalMap) node.material.normalMap.dispose();
        //                if (node.material.specularMap) node.material.specularMap.dispose();
        //                if (node.material.envMap) node.material.envMap.dispose();
        //                node.material.dispose();   // disposes any programs associated with the material
        //                node.material = undefined;
        //            }
        //        }
        //        node = undefined;
        //    }
        //    else if (node instanceof THREE.Object3D) {
        //        node = undefined;
        //    }
        //}   // disposeNode


    }

}