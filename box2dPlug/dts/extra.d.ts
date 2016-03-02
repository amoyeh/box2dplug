/// <reference path="three.d.ts" />

declare module THREE {

    export class TrackballControls {
        constructor(camera: any, element: HTMLElement);
        rotateSpeed: number;
        zoomSpeed: number;
        panSpeed: number;
        noZoom: boolean;
        noPan: boolean;
        staticMoving: boolean;
        dynamicDampingFactor: number;
        update(delta: number);
        reset();
        enabled: boolean;
        mouseup(): void;
        object: THREE.Object3D;
        target: THREE.Vector3;
    }

    export class OrbitControls {
        constructor(camera: any, element: HTMLElement);
        object: any;
        target: any;
        minDistance: number;
        maxDistance: number;
        minZoom: number;
        maxZoom: number;
        minPolarAngle: number;
        maxPolarAngle: number;
        minAzimuthAngle: number;
        maxAzimuthAngle: number;
        enableDamping: boolean;
        dampingFactor: number;
        noZoom: boolean;
        noRotate: boolean;
        noPan: boolean;
        noKeys: boolean;
        staticMoving: boolean;
        dynamicDampingFactor: number;
        enabled: boolean;
        update();
    }

    export var EffectComposer: any;
    export var RenderPass: any;
    export var ShaderPass: any;
    export var FilmPass: any;
    export var BloomPass: any;
    export var DotScreenPass: any;
    export var CopyShader: any;
    export var DotScreenShader: any;
    export var RGBShiftShader: any;
    export var FXAAShader: any;
    export var VignetteShader: any;
    export var FilmShader: any;
    export var DotMatrixShader: any;

}