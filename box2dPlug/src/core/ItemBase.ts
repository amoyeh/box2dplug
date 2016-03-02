module box2dp {

    export class ItemBase extends EventDispatcher {

        //bitwise properties
        //public static NO_UNIT_COLLIDE: number = 1;
        //public static DYNAMIC: number = 2;
        //public static FILTER_UNIT: number = 1;
        //public static FILTER_STATIC: number = 2;

        public static SHAPE: number = 1;
        public static SENSOR: number = 2;
        public static UNIT: number = 3;
        public static PATH: number = 4;

        name: string;
        type: number;


        constructor(name: string) {
            super();
            this.name = name;
        }

        //override at child
        public remove(): void { }

    }

}