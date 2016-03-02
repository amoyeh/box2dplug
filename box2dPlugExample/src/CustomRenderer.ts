module box2dp {

    export class CustomRenderer extends ThreeRenderer {

        constructor(options?: RendererOptions) {

            super(options);
            var gridHelper = new THREE.GridHelper(1000, 50);
            gridHelper.rotation.set(1.5708, 0.785398, 0);
            gridHelper.position.set(450, 300, -2);
            gridHelper.setColors(0xDDDDDD, 0xDDDDDD);
            this.container.add(gridHelper);

            window.addEventListener('resize', () => { this.resizeWindow(); }, false);
            this.resizeWindow();


        }

        public resizeWindow(): void {
            this.camera.aspect = window.innerWidth / 600;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, 600);
            //this.camera.position.z = window.innerWidth;
        }

    }

} 