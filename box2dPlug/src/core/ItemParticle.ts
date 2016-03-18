module box2dp {

    export class ItemParticle {

        private static UNIQUE_COUNT: number = 0;

        public oldx: number;
        public oldy: number;
        public cx: number;
        public cy: number;
        public ix: number;
        public iy: number;

        //at index of the particle system , updates at each step..
        public currentIndex: number;
        public system: box2d.b2ParticleSystem;
        public group: box2d.b2ParticleGroup;
        public name: string;

        //display object contains 
        //ItemEntity.display["pixi"] > refer to pixi object
        //ItemEntity.display["three"] > refer to three.js object
        public display: any;

        public uniqueColor: number;
        public uniqueAlpha: number;

        constructor() {
            this.name = "p." + ItemParticle.UNIQUE_COUNT;
            this.uniqueAlpha = this.uniqueColor = null;
            ItemParticle.UNIQUE_COUNT++;
        }

        init(system: box2d.b2ParticleSystem, group: box2d.b2ParticleGroup, startIndex: number) {
            this.system = system;
            this.group = group;
            var atPos = this.system.GetPositionBuffer()[startIndex];
            this.setOldPos(atPos.x, atPos.y);
            this.setCurrentPos(atPos.x, atPos.y);
            this.display = {};
            //console.log("created at index: " + startIndex + " name: " + this.name);
        }

        public setOldPos(x: number, y: number): void {
            this.oldx = MakeInfo.mult30(x);
            this.oldy = MakeInfo.mult30(y);
            //console.log(this.name + " setOldPos: " + this.oldx + " , " + this.oldy);
        }

        public setCurrentPos(x: number, y: number): void {
            this.cx = MakeInfo.mult30(x);
            this.cy = MakeInfo.mult30(y);
            //console.log(this.name + " setCurrentPos: " + this.cx + " , " + this.cy);
            //console.log(this.display);
        }

        public integratePos(percent: number): void {
            this.ix = Math.round(this.oldx + ((this.cx - this.oldx) * percent));
            this.iy = Math.round(this.oldy + ((this.cy - this.oldy) * percent));
            //console.log(this.name + " integratePos: " + this.ix + " , " + this.iy);
        }

    }
}