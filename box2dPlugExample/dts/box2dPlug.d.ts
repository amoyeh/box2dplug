declare module box2dp {
    class Color {
        static DarkTheme(): Color;
        ITEM_STATIC: number;
        ITEM_DYNAMIC: number;
        ITEM_ALPHA: number;
        LINE_CENTER_X: number;
        LINE_CENTER_Y: number;
        LINE_BOUNDARY: number;
        SENSOR: number;
        SENSOR_ALPHA: number;
        QUADTREE: number;
        QUADTREE_A: number;
        LINE_JOINT: number;
        getItemStaticColor(): number;
        getItemDynamicColor(): number;
        getItemStaticMat(): THREE.MeshBasicMaterial;
        getItemDynamicMat(): THREE.MeshBasicMaterial;
        getLineMatStatic(): THREE.LineBasicMaterial;
        getLineMatDynamic(): THREE.LineBasicMaterial;
        getSensorMat(): THREE.MeshBasicMaterial;
        getLineCenterXMat(): THREE.LineBasicMaterial;
        getLineCenterYMat(): THREE.LineBasicMaterial;
        getLineBoundary(): THREE.LineDashedMaterial;
        getLineJoint(): THREE.LineBasicMaterial;
        getLineQuadTree(): THREE.LineBasicMaterial;
    }
}
declare module box2dp {
    class Event {
        static ITEM_CREATED: string;
        static BEFORE_STEP: string;
        static AFTER_STEP: string;
        static BEFORE_RENDER: string;
        static AFTER_RENDER: string;
        static BEGIN_CONTACT: string;
        static END_CONTACT: string;
        static PRESOLVE: string;
        static POSTSOLVE: string;
        static PARTICLE_REMOVED: string;
        static PARTICLE_CREATED: string;
        static PARTICLE_FIXTURE_CONTACT: string;
        static PARTICLE_PARTICLE_CONTACT: string;
        type: string;
        target: any;
        values: any;
        constructor(type: string, target?: any, values?: any);
        toString(): string;
    }
    class EventDispatcher {
        private callBacks;
        addEvent(type: string, func: any, caller?: any): void;
        removeEvent(type: string, func: any): void;
        fireEvent(event: Event): void;
    }
}
declare module box2dp {
    class Domain extends EventDispatcher {
        static UPDATE_FIXED: number;
        static UPDATE_TIME_BASED: number;
        private static uniqueNameCounters;
        private static addCounter(type);
        world: box2d.b2World;
        maker: BoxMaker;
        renderers: BaseRenderer[];
        rlen: number;
        particleSystems: box2d.b2ParticleSystem[];
        particles: {
            [systemName: string]: ItemParticle[];
        };
        items: ItemEntity[];
        lastStepTime: number;
        particleSystemUniqueCount: number;
        particleGroups: box2d.b2ParticleGroup[];
        physicFixStepTime: number;
        stepTime: number;
        renderTime: number;
        private stepInterval;
        private renderInterval;
        private updateMode;
        groundBody: box2d.b2Body;
        private debugDrawCanvas;
        private debugDrawCtx;
        debugDraw: box2d.DebugDraw;
        quadTree: QuadTree;
        private contactManager;
        destructionListener: any;
        constructor(gravity: {
            x: number;
            y: number;
        }, physicFixStepTime?: number, updateMode?: number);
        setDebugDrawElements(canvasId: string, width: number, height: number): void;
        addRenderer(renderer: BaseRenderer): void;
        eachRenderer(callback: Function): void;
        private getUniqueName(name);
        create(makeInfo: MakeInfo): ItemEntity;
        createChain(makeInfo: MakeInfo): {
            segments: ItemEntity[];
            pins: ItemEntity[];
        };
        createParticleSystem(info: box2d.b2ParticleSystemDef, shapeType: number, color: number, alpha: number): box2d.b2ParticleSystem;
        createParticle(system: box2d.b2ParticleSystem, def: box2d.b2ParticleDef, colorDef?: {
            color: number;
            alpha: number;
        }): ItemParticle;
        destroyParticle(system: box2d.b2ParticleSystem, index: number): void;
        createParticleGroup(system: box2d.b2ParticleSystem, def: box2d.b2ParticleGroupDef, beforeCreationCall?: Function): box2d.b2ParticleGroup;
        destroyParticleGroup(system: box2d.b2ParticleSystem, group: box2d.b2ParticleGroup): void;
        fillParticles(system: box2d.b2ParticleSystem, def: box2d.b2ParticleDef, w: number, h: number): ItemParticle[];
        createJoint(jointDef: box2d.b2JointDef): box2d.b2Joint;
        step(): void;
        render(): void;
        run(stepTime: number, renderTime: number): void;
        runAStep(stepTime: number, renderTime: number): void;
        stop(): void;
        updateInterval(stepTime: number, renderTime: number): void;
        setUpdateMode(mode: number): void;
        itemUnderPoint(lx: number, ly: number): box2d.b2Fixture[];
        eachItem(callback: Function): void;
        removeItem(item: ItemEntity): void;
    }
}
declare var DestructionListener: any;
declare var QueryCallBack: any;
declare var RayCastCallback: any;
declare module box2dp {
    class ItemBase extends EventDispatcher {
        static SHAPE: number;
        static UNIT: number;
        static PATH: number;
        name: string;
        type: number;
        constructor(name: string);
        remove(): void;
    }
}
declare module box2dp {
    class ItemEntity extends ItemBase {
        b2body: box2d.b2Body;
        dynamic: boolean;
        oldx: number;
        oldy: number;
        oldr: number;
        cx: number;
        cy: number;
        cr: number;
        ix: number;
        iy: number;
        ir: number;
        isSensor: boolean;
        enableContactEvent: boolean;
        enableSolveEvent: boolean;
        private boundary;
        private boundaryMult;
        display: any;
        selector: QuadSelector;
        constructor(b2body: box2d.b2Body, name?: string);
        setOldPos(): void;
        setCurrentPos(): void;
        integratePos(percent: number): void;
        getb2X(): number;
        getb2Y(): number;
        getPixelX(): number;
        getPixelY(): number;
        updateBoundary(): void;
        getBoundary(mult30: boolean, useLocal: boolean): {
            x: number;
            y: number;
            w: number;
            h: number;
        };
        setb2Position(x: number, y: number): void;
        setPixelPosition(x: number, y: number): void;
        setDynamic(isDynamic: boolean): void;
        setCollisionMask(maskBits: number): void;
        removePhysic(): void;
        removeJoints(): void;
    }
}
declare module box2dp {
    class ItemParticle {
        private static UNIQUE_COUNT;
        oldx: number;
        oldy: number;
        cx: number;
        cy: number;
        ix: number;
        iy: number;
        currentIndex: number;
        system: box2d.b2ParticleSystem;
        group: box2d.b2ParticleGroup;
        name: string;
        display: any;
        uniqueColor: number;
        uniqueAlpha: number;
        constructor();
        init(system: box2d.b2ParticleSystem, group: box2d.b2ParticleGroup, startIndex: number): void;
        setOldPos(x: number, y: number): void;
        setCurrentPos(x: number, y: number): void;
        integratePos(percent: number): void;
    }
}
declare module box2dp {
    class QuadNode {
        static TOP_LEFT: number;
        static TOP_RIGHT: number;
        static BOTTOM_LEFT: number;
        static BOTTOM_RIGHT: number;
        static PARENT: number;
        items: QuadSelector[];
        nodes: QuadNode[];
        x: number;
        y: number;
        width: number;
        height: number;
        depth: number;
        maxChildren: number;
        maxDepth: number;
        constructor(x: number, y: number, w: number, h: number, depth: number, maxChildren?: number, maxDepth?: number);
        retrieve(selector: QuadSelector, callback: any, instance?: any): void;
        findOverlappingNodes(item: QuadSelector, callback: any): void;
        findInsertNode(item: QuadSelector): any;
        insert(item: QuadSelector): void;
        divide(): void;
        clear(): void;
    }
    class QuadSelector {
        x: number;
        y: number;
        width: number;
        height: number;
        data: any;
        parent: any;
        constructor(x: number, y: number, width: number, height: number, data?: any);
        toString(): string;
    }
    class QuadTree {
        rootNode: QuadNode;
        constructor(x: number, y: number, w: number, h: number, maxChildren?: number, maxDepth?: number);
        insert(item: QuadSelector): void;
        retrieve(selector: QuadSelector, callback: any, instance?: any): void;
        clear(): void;
        getItemSelector(itemIn: any): QuadSelector;
        quadTreeSelect(item: ItemEntity): QuadSelector[];
    }
}
declare module box2dp {
    class BoxMaker {
        world: box2d.b2World;
        domain: Domain;
        constructor(world: box2d.b2World, domain: Domain);
        create(info: MakeInfo): box2d.b2Body;
        createEdge(body: box2d.b2Body, useInfo: MakeInfo): box2d.b2Fixture[];
        createBoxDef(body: box2d.b2Body, useInfo: MakeInfo, offsetX?: number, offsetY?: number): box2d.b2Fixture;
        createCircleDef(body: box2d.b2Body, useInfo: MakeInfo, offsetX?: number, offsetY?: number): box2d.b2Fixture;
        createPolygonDef(body: box2d.b2Body, useInfo: MakeInfo): box2d.b2Fixture;
        createFixtureDef(info: MakeInfo): box2d.b2FixtureDef;
        createbody(info: MakeInfo): box2d.b2Body;
        createItemEntity(makeInfo: MakeInfo, name: string): ItemEntity;
        createChain(baseName: string, info: MakeInfo): {
            segments: ItemEntity[];
            pins: ItemEntity[];
        };
        createParticle(system: box2d.b2ParticleSystem, def: box2d.b2ParticleDef, colorDef?: {
            color: number;
            alpha: number;
        }): ItemParticle;
        fillParticles(system: box2d.b2ParticleSystem, def: box2d.b2ParticleDef, w: number, h: number): ItemParticle[];
        createParticleGroup(system: box2d.b2ParticleSystem, def: box2d.b2ParticleGroupDef, beforeCreationCall?: Function): box2d.b2ParticleGroup;
    }
}
declare module box2dp {
    class MakeInfo {
        static ONED: number;
        static round(num: number): number;
        static random(min: number, max: number, round?: boolean): number;
        static usePixelScale: boolean;
        static div30(value: number): number;
        static mult30(value: number): number;
        static getb2Vec2(input: any | box2d.b2Vec2): box2d.b2Vec2;
        static MAKE_BOX_TOP_LEFT: number;
        static MAKE_BOX_CENTER: number;
        static MAKE_POLYGON: number;
        static MAKE_CIRCLE: number;
        static MAKE_EDGE: number;
        static MAKE_COMPOUND: number;
        static MAKE_CHAIN: number;
        name: string;
        x: number;
        y: number;
        w: number;
        h: number;
        radius: number;
        createType: number;
        allowSleep: boolean;
        isStatic: boolean;
        density: number;
        friction: number;
        restitution: number;
        fixedRotation: boolean;
        loopEdge: boolean;
        isSensor: boolean;
        categoryBits: number;
        maskBits: number;
        angle: number;
        bullet: boolean;
        vertices: {
            x: number;
            y: number;
        }[];
        makeInfos: MakeInfo[];
        b2Vertices: box2d.b2Vec2[];
        userData: any;
        fixtureData: any;
        chainAmt: number;
        chainPinHead: boolean;
        chainPinTail: boolean;
        chainCollideConnected: boolean;
        chainOverlap: number;
        constructor(setting: {
            name?: string;
            x?: number;
            y?: number;
            w?: number;
            h?: number;
            radius?: number;
            createType?: number;
            allowSleep?: boolean;
            isStatic?: boolean;
            density?: number;
            friction?: number;
            restitution?: number;
            fixedRotation?: boolean;
            angle?: number;
            bullet?: boolean;
            vertices?: {
                x: number;
                y: number;
            }[];
            loopEdge?: boolean;
            isSensor?: boolean;
            categoryBits?: number;
            maskBits?: number;
            makeInfos?: MakeInfo[];
            userData?: any;
            fixtureData?: any;
            chainAmt?: number;
            chainPinHead?: boolean;
            chainPinTail?: boolean;
            chainCollideConnected?: boolean;
            chainOverlap?: number;
        });
        clone(offset?: boolean): MakeInfo;
    }
}
declare module box2dp {
    interface RendererOptions {
        width?: number;
        height?: number;
        antialias?: boolean;
        backgroundColor?: number;
        elementId?: string;
        invertY?: boolean;
        dragFlags?: number;
        transparent?: boolean;
        colorClass?: box2dp.Color;
    }
    class BaseRenderer {
        static DRAW_SHAPE: number;
        static DRAW_CENTER: number;
        static DRAW_BOUNDARY: number;
        static DRAW_QUAD_TREE: number;
        static DRAW_JOINT: number;
        static DRAW_ALL: number;
        drawFlags: number;
        domain: Domain;
        useElement: HTMLElement;
        options: RendererOptions;
        colorClass: Color;
        constructor(options?: RendererOptions);
        hasDrawType(checkType: any): boolean;
        protected simpleJoinDraw(jt: box2d.b2Joint): boolean;
        beforeStep(): void;
        afterStep(): void;
        render(): void;
        onItemCreate(item: ItemEntity): void;
        onItemRemove(item: ItemEntity): void;
        onParticleSystemCreate(system: box2d.b2ParticleSystem, shapeType: number, color: number, alpha: number): void;
        onParticleCreate(item: ItemParticle): void;
        onParticleDestroy(removeOne: ItemParticle): void;
    }
}
declare module box2dp {
    class DragControl {
        private domain;
        private world;
        private useElement;
        private renderer;
        mouseJoint: any;
        trackCtrl: THREE.TrackballControls;
        orbCtrl: THREE.OrbitControls;
        private mousePt;
        private tweenPt;
        private dragging;
        constructor(renderer: BaseRenderer);
        createDragDrop(): void;
        removeDragDrop(): void;
        private createPixiDragDrop();
        private ddPress(e);
        private ddMove(e);
        private ddUp(e);
        private tjPress(e);
        private createThreeDragDrop();
        private tjMove(e);
        private tjUp(e);
        trackCtrlUpdate(e: Event, caller: DragControl): void;
        createTrackBallCtrl(): void;
        removeTrackBallCtrl(): void;
        orbitCtrlUpdate(e: Event, caller: DragControl): void;
        createOrbitCtrl(): void;
        removeOrbitCtrl(): void;
        beforeStepUpdate(): void;
    }
}
declare module box2dp {
    class PixiRenderer extends BaseRenderer {
        renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
        scene: PIXI.Container;
        container: PIXI.Container;
        quadGraphic: PIXI.Graphics;
        overGraphic: PIXI.Graphics;
        jointGraphic: PIXI.Graphics;
        psGeometries: {
            shapeType: number;
            color: number;
            alpha: number;
        }[];
        constructor(options?: RendererOptions);
        beforeStep(): void;
        afterStep(): void;
        render(): void;
        private drawTreeNode(targetNode);
        onItemCreate(item: ItemEntity): void;
        onItemRemove(item: ItemEntity): void;
        onParticleSystemCreate(system: box2d.b2ParticleSystem, shapeType: number, color: number, alpha: number): void;
        onParticleCreate(item: ItemParticle): void;
        onParticleDestroy(removeOne: ItemParticle): void;
        protected itemDisplayUpdate(display: PIXI.Container, item: ItemEntity): void;
        protected dashLine(g: PIXI.Graphics, x: any, y: any, x2: any, y2: any, dashArray?: number[]): void;
    }
}
declare module box2dp {
    class ThreeRenderer extends BaseRenderer {
        static JOINT_PT_MAX: number;
        static QUAD_PT_MAX: number;
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
        scene: THREE.Scene;
        container: THREE.Object3D;
        quadGraphic: THREE.Object3D;
        overGraphic: THREE.Object3D;
        jointGraphic: THREE.Object3D;
        jointLine: THREE.LineSegments;
        jointVerticeCount: number;
        jointLastPt: box2d.b2Vec2;
        quadLine: THREE.LineSegments;
        quadVerticeCount: number;
        lastQuadPt: box2d.b2Vec2;
        psGeometries: {
            geometry: THREE.Geometry;
            mat: THREE.MeshBasicMaterial;
        }[];
        constructor(options?: RendererOptions);
        invertYSetup(): void;
        beforeStep(): void;
        afterStep(): void;
        render(): void;
        private drawTreeNode(targetNode);
        clearOverShapes(): void;
        onItemCreate(item: ItemEntity): void;
        onItemRemove(item: ItemEntity): void;
        private disposeObj(object);
        private itemDisplayUpdate(display, item);
        getXYFromCamera(xto: number, yto: number): THREE.Vector3;
        onParticleSystemCreate(system: box2d.b2ParticleSystem, shapeType: number, color: number, alpha: number): void;
        onParticleCreate(item: ItemParticle): void;
        onParticleDestroy(removeOne: ItemParticle): void;
    }
}
