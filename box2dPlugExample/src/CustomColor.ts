module box2dp {

    export class CustomColor extends Color {

        public unitColorCount: number = 0;

        public getWheelColor(frequency: number = 0.08, center: number = 128, width: number = 127): number {
            var red: number = Math.sin(frequency * this.unitColorCount + 0) * width + center;
            var green: number = Math.sin(frequency * this.unitColorCount + 2) * width + center;
            var blue: number = Math.sin(frequency * this.unitColorCount + 4) * width + center;
            this.unitColorCount += 1;
            return Math.round(red) + 256 * Math.round(green) + 65536 * Math.round(blue);
        }

        public getItemDynamicMat(): THREE.MeshBasicMaterial {
            var mat = new THREE.MeshBasicMaterial({
                color: this.getWheelColor(0.18, 152, 103), side: THREE.DoubleSide,
                opacity: this.ITEM_ALPHA, transparent: true
            });
            return mat;
        }

    }

}