module box2dp {

    export class Color {

        //static theme
        //=====================================================================================================
        public static DarkTheme(): Color {

            var color = new Color();

            color.ITEM_STATIC = 0x494949;
            color.ITEM_DYNAMIC = 0x808080;
            color.ITEM_ALPHA = 0.5;

            color.LINE_CENTER_X = 0xFFAD99;
            color.LINE_CENTER_Y = 0xADFF99;
            color.LINE_BOUNDARY = 0x6F586F;

            color.PATH_LINE = 0x9650A0;
            color.PATH_LINEA = 0.4;

            color.PATH_FORCE = 0xde7717;
            color.PATH_FORCEA = 0.4;

            color.SELECTION_LINE_SIZE = 1;
            color.SELECTION_LINE_COLOR = 0xEFEFEF;
            color.SELECTION_LINE_ALPHA = .4;

            color.VELOCITY = 0xFFFFFF;
            color.VELOCITY_ALPHA = 0.6;

            color.ALIGNMENT = 0x50825A;
            color.ALIGNMENT_ALPHA = 0.3;

            color.COHESION = 0x5A8282;
            color.COHESION_ALPHA = 0.3;

            color.SEPARATION = 0xE65050;
            color.SEPARATION_ALPHA = 0.3;

            color.RAYCAST = 0xFFFFFF;
            color.RAYCAST_ALPHA = 0.1;

            color.AVOID_SHAPE = 0xCC6666;
            color.AVOID_SHAPE_ALPHA = 1;

            color.GRID = 0x66FFFF;
            color.GRID_ALPHA = 0.1;

            color.SENSOR = 0xFFDD88;
            color.SENSOR_ALPHA = 0.3;

            color.BOUND = 0x55CCCC;
            color.BOUND_ALPHA = 0.5;

            color.WANDER = 0x969696;
            color.WANDER_ALPHA = 0.3;

            color.QUADTREE = 0x55CCCC;
            color.QUADTREE_A = 0.2;

            return color;
        }
        //=====================================================================================================

        public ITEM_STATIC: number = 0x555555;
        public ITEM_DYNAMIC: number = 0x999999;
        public ITEM_ALPHA: number = 0.6;

        public LINE_CENTER_X: number = 0xffb9b2;
        public LINE_CENTER_Y: number = 0xc3ffb2;
        public LINE_BOUNDARY: number = 0xBBBBBB;

        public PATH_LINE: number = 0x9650A0;
        public PATH_LINEA: number = 0.4;

        public PATH_FORCE: number = 0xde7717;
        public PATH_FORCEA: number = 0.4;

        public SELECTION_LINE_SIZE: number = 1;
        public SELECTION_LINE_COLOR: number = 0xEFEFEF;
        public SELECTION_LINE_ALPHA: number = .4;

        public VELOCITY: number = 0xFFFFFF;
        public VELOCITY_ALPHA: number = 0.6;

        public ALIGNMENT: number = 0x50825A;
        public ALIGNMENT_ALPHA: number = 0.3;

        public COHESION: number = 0x5A8282;
        public COHESION_ALPHA: number = 0.3;

        public SEPARATION: number = 0xE65050;
        public SEPARATION_ALPHA: number = 0.3;

        public RAYCAST: number = 0xFFFFFF;
        public RAYCAST_ALPHA: number = 0.1;

        public AVOID_SHAPE: number = 0xCC6666;
        public AVOID_SHAPE_ALPHA: number = 1;

        public GRID: number = 0x66FFFF;
        public GRID_ALPHA: number = 0.1;

        public SENSOR: number = 0xFFDD88;
        public SENSOR_ALPHA: number = 0.3;

        public BOUND: number = 0x55CCCC;
        public BOUND_ALPHA: number = 0.5;

        public WANDER: number = 0x969696;
        public WANDER_ALPHA: number = 0.3;

        public QUADTREE: number = 0x55CCCC;
        public QUADTREE_A: number = 0.8;

        public LINE_JOINT: number = 0xCC3300;

        //public rgbaToHex(rgba: string): string {
        //    var rgbData = rgba.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        //    return (rgbData && rgbData.length === 4) ? "#" +
        //        ("0" + parseInt(rgbData[1], 10).toString(16)).slice(-2) +
        //        ("0" + parseInt(rgbData[2], 10).toString(16)).slice(-2) +
        //        ("0" + parseInt(rgbData[3], 10).toString(16)).slice(-2) : '';
        //}

        //public hexToRgba(hex: string, opacity: number): string {
        //    hex = hex.replace('#', '');
        //    var r: number = parseInt(hex.substring(0, 2), 16);
        //    var g: number = parseInt(hex.substring(2, 4), 16);
        //    var b: number = parseInt(hex.substring(4, 6), 16);
        //    var result: string = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
        //    return result;
        //}

        public getItemStaticColor(): number {
            return this.ITEM_STATIC;
        }

        public getItemDynamicColor(): number {
            return this.ITEM_DYNAMIC;
        }


        //static material buffer used for three.js
        //========================================================================================
        public getItemStaticMat(): THREE.MeshBasicMaterial {
            return new THREE.MeshBasicMaterial({ color: this.ITEM_STATIC, side: THREE.DoubleSide, opacity: this.ITEM_ALPHA, transparent: true });
        }
        public getItemDynamicMat(): THREE.MeshBasicMaterial {
            return new THREE.MeshBasicMaterial({ color: this.ITEM_DYNAMIC, side: THREE.DoubleSide, opacity: this.ITEM_ALPHA, transparent: true });
        }

        public getLineMatStatic(): THREE.LineBasicMaterial {
            return new THREE.LineBasicMaterial({ color: this.ITEM_STATIC, side: THREE.DoubleSide, opacity: this.ITEM_ALPHA, transparent: true, linewidth: 1 });
        }

        public getLineMatDynamic(): THREE.LineBasicMaterial {
            return new THREE.LineBasicMaterial({ color: this.ITEM_DYNAMIC, side: THREE.DoubleSide, opacity: this.ITEM_ALPHA, transparent: true, linewidth: 1 });
        }

        public getSensorMat(): THREE.MeshBasicMaterial {
            return new THREE.MeshBasicMaterial({ color: this.SENSOR, side: THREE.DoubleSide, opacity: this.SENSOR_ALPHA, transparent: true });
        }

        public getLineCenterXMat(): THREE.LineBasicMaterial {
            return new THREE.LineBasicMaterial({ color: this.LINE_CENTER_X });
        }

        public getLineCenterYMat(): THREE.LineBasicMaterial {
            return new THREE.LineBasicMaterial({ color: this.LINE_CENTER_Y });;
        }

        public getLineBoundary(): THREE.LineDashedMaterial {
            return new THREE.LineDashedMaterial({ color: this.LINE_BOUNDARY, dashSize: 10, gapSize: 5 });;
        }

        public getLineJoint(): THREE.LineBasicMaterial {
            return new THREE.LineBasicMaterial({ color: this.LINE_JOINT, side: THREE.DoubleSide, transparent: true });;
        }

        public getLineQuadTree(): THREE.LineBasicMaterial {
            return new THREE.LineBasicMaterial({ color: this.QUADTREE, side: THREE.DoubleSide, opacity: this.QUADTREE_A, transparent: true });
        }

    }

}