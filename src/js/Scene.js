/**
 * Created by diakabanab on 10/22/2016.
 */
(function() {
    var Scene,
        __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

    Scene = (function() {
        function Scene(container) {
            this.animate = __bind(this.animate, this);
            this.onresize = __bind(this.onresize, this);
            var $container, ambientLight, auxLight, camera, controls, height, mainLight, renderer, scene, width;
            $container = $(container);
            width = $container.width();
            height = $container.height();
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(60, width / height, 0.001, 100000);
            camera.lookAt(new THREE.Vector3());
            scene.add(camera);
            renderer = new THREE.WebGLRenderer({
                antialias: true
            });
            renderer.setSize(width, height);
            renderer.setClearColor(0x000000, 1);
            renderer.autoClear = false;
            $container.append(renderer.domElement);
            ambientLight = new THREE.AmbientLight(0x222222);
            scene.add(ambientLight);
            mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
            mainLight.position.set(1, 2, 4).normalize();
            scene.add(mainLight);
            auxLight = new THREE.DirectionalLight(0xffffff, 0.3);
            auxLight.position.set(-4, -1, -2).normalize();
            scene.add(auxLight);
            controls = new THREE.OrbitControls(camera);
            controls.center.set(8.73, 0, 0);
            controls.autoRotateSpeed = 1.0;
            controls.autoRotate = false;
            camera.position.copy(controls.center).add(new THREE.Vector3(2, 6, 9));
            $(window).resize(this.onresize);
            this.$container = $container;
            this.camera = camera;
            this.scene = scene;
            this.renderer = renderer;
            this.controls = controls;
        }

        Scene.prototype.onresize = function() {
            var height, width, _ref;
            _ref = [this.$container.width(), this.$container.height()], width = _ref[0], height = _ref[1];
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            return this.renderer.setSize(width, height);
        };

        Scene.prototype.add = function(object) {
            return this.scene.add(object);
        };

        Scene.prototype.remove = function(object) {
            return this.scene.remove(object);
        };

        Scene.prototype.animate = function(callback) {
            var _this = this;
            requestAnimationFrame(function() {
                return _this.animate(callback);
            });
            if (typeof callback === "function") {
                callback();
            }
            this.controls.update();
            this.renderer.clear();
            return this.renderer.render(this.scene, this.camera);
        };

        return Scene;

    })();

    this.Scene = Scene;

}).call(this);