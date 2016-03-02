declare module box2dp {
    class Color {
        static DarkTheme(): Color;
        BACKGROUND: number;
        ITEM_STATIC: number;
        ITEM_DYNAMIC: number;
        ITEM_ALPHA: number;
        LINE_CENTER_X: number;
        LINE_CENTER_Y: number;
        LINE_BOUNDARY: number;
        PATH_LINE: number;
        PATH_LINEA: number;
        PATH_FORCE: number;
        PATH_FORCEA: number;
        SELECTION_LINE_SIZE: number;
        SELECTION_LINE_COLOR: number;
        SELECTION_LINE_ALPHA: number;
        VELOCITY: number;
        VELOCITY_ALPHA: number;
        ALIGNMENT: number;
        ALIGNMENT_ALPHA: number;
        COHESION: number;
        COHESION_ALPHA: number;
        SEPARATION: number;
        SEPARATION_ALPHA: number;
        RAYCAST: number;
        RAYCAST_ALPHA: number;
        AVOID_SHAPE: number;
        AVOID_SHAPE_ALPHA: number;
        GRID: number;
        GRID_ALPHA: number;
        SENSOR: number;
        SENSOR_ALPHA: number;
        BOUND: number;
        BOUND_ALPHA: number;
        WANDER: number;
        WANDER_ALPHA: number;
        QUADTREE: number;
        QUADTREE_A: number;
        getItemStaticColor(): number;
        getItemDynamicColor(): number;
        protected itemStaticMat: THREE.MeshBasicMaterial;
        getItemStaticMat(): THREE.MeshBasicMaterial;
        protected itemDynamicMat: THREE.MeshBasicMaterial;
        getItemDynamicMat(): THREE.MeshBasicMaterial;
        protected lineStaticMat: THREE.LineBasicMaterial;
        getLineMatStatic(): THREE.LineBasicMaterial;
        protected lineDynamicMat: THREE.LineBasicMaterial;
        getLineMatDynamic(): THREE.LineBasicMaterial;
        protected sensorMat: THREE.MeshBasicMaterial;
        getSensorMat(): THREE.MeshBasicMaterial;
        protected lineCenterX: THREE.LineBasicMaterial;
        getLineCenterXMat(): THREE.LineBasicMaterial;
        protected lineCenterY: THREE.LineBasicMaterial;
        getLineCenterYMat(): THREE.LineBasicMaterial;
        protected lineBoundary: THREE.LineDashedMaterial;
        getLineBoundary(): THREE.LineDashedMaterial;
        protected lineQuadTree: THREE.LineBasicMaterial;
        getLineQuadTree(): THREE.LineBasicMaterial;
        LineQuadTreeMaterial: any;
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
        private renderers;
        private rlen;
        items: ItemEntity[];
        lastStepTime: number;
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
        constructor(gravity: {
            x: number;
            y: number;
        }, physicFixStepTime: number, updateMode?: number);
        setDebugDrawElements(canvasId: string, width: number, height: number): void;
        addRenderer(renderer: BaseRenderer): void;
        private getUniqueName(name);
        create(makeInfo: MakeInfo): ItemEntity;
        step(): void;
        render(): void;
        run(stepTime: number, renderTime: number): void;
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
        static SENSOR: number;
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
        enableContactEvent: boolean;
        private boundary;
        private boundaryMult;
        display: any;
        selector: QuadSelector;
        constructor(b2body: box2d.b2Body, type: number, name?: string);
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
        drawDebug: boolean;
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
        constructor(world: box2d.b2World);
        create(info: MakeInfo): box2d.b2Body;
        createEdge(body: box2d.b2Body, useInfo: MakeInfo): box2d.b2Fixture[];
        createBoxDef(body: box2d.b2Body, useInfo: MakeInfo, offsetX?: number, offsetY?: number): box2d.b2Fixture;
        createCircleDef(body: box2d.b2Body, useInfo: MakeInfo, offsetX?: number, offsetY?: number): box2d.b2Fixture;
        createPolygonDef(body: box2d.b2Body, useInfo: MakeInfo): box2d.b2Fixture;
        createFixtureDef(info: MakeInfo): box2d.b2FixtureDef;
        createbody(info: MakeInfo): box2d.b2Body;
        createChain(info: {
            w: number;
            h: number;
            amt: number;
            x: number;
            y: number;
            degree: number;
            pinHead?: boolean;
            pinTail?: boolean;
            collideConnected?: boolean;
            density?: number;
            overLapGap?: number;
        }): any;
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
        name: string;
        itemType: number;
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
        constructor(setting: {
            name?: string;
            itemType?: number;
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
        drawFlags: number;
        domain: Domain;
        useElement: HTMLElement;
        options: RendererOptions;
        colorClass: Color;
        constructor(options?: RendererOptions);
        hasDrawType(checkType: any): boolean;
        beforeStep(): void;
        afterStep(): void;
        render(): void;
        onItemCreate(item: ItemEntity): void;
        onItemRemove(item: ItemEntity): void;
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
    }
}
declare module box2dp {
    class PixiRenderer extends BaseRenderer {
        renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
        scene: PIXI.Container;
        container: PIXI.Container;
        quadGraphic: PIXI.Graphics;
        overGraphic: PIXI.Graphics;
        constructor(options?: RendererOptions);
        beforeStep(): void;
        afterStep(): void;
        render(): void;
        private drawTreeNode(targetNode);
        onItemCreate(item: ItemEntity): void;
        onItemRemove(item: ItemEntity): void;
        protected itemDisplayUpdate(display: PIXI.Container, item: ItemEntity): void;
        protected dashLine(g: PIXI.Graphics, x: any, y: any, x2: any, y2: any, dashArray?: number[]): void;
    }
}
declare module box2dp {
    class ThreeRenderer extends BaseRenderer {
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
        scene: THREE.Scene;
        container: THREE.Object3D;
        quadGraphic: THREE.Object3D;
        overGraphic: THREE.Object3D;
        constructor(options?: RendererOptions);
        invertYSetup(): void;
        beforeStep(): void;
        afterStep(): void;
        render(): void;
        private drawTreeNode(targetNode);
        private clearQuadTreeGuide();
        clearOverShapes(): void;
        onItemCreate(item: ItemEntity): void;
        onItemRemove(item: ItemEntity): void;
        private itemDisplayUpdate(display, it);
        getXYFromCamera(xto: number, yto: number): THREE.Vector3;
        disposeShape(obj: THREE.Object3D, depth: number): void;
    }
}
