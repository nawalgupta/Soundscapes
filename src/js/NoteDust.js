/**
 * Created by diakabanab on 10/23/2016.
 */
(function() {
    var NoteDust,
        __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

    NoteDust = (function() {
        NoteDust.prototype.count = 30;

        NoteDust.prototype.size = 0.2;

        NoteDust.prototype.life = 10;

        function NoteDust(pianoDesign) {
            var color, keyInfo, note, noteToColor, _i, _ref;
            this.pianoDesign = pianoDesign;
            this.createParticles = __bind(this.createParticles, this);
            this.update = __bind(this.update, this);
            noteToColor = pianoDesign.noteToColor, keyInfo = pianoDesign.keyInfo;
            this.model = new THREE.Object3D();
            this.materials = [];
            for (note = _i = 0, _ref = keyInfo.length; 0 <= _ref ? _i < _ref : _i > _ref; note = 0 <= _ref ? ++_i : --_i) {
                color = noteToColor(note);
                this.materials[note] = new THREE.PointsMaterial({
                    size: this.size,
                    map: this._generateTexture(color),
                    blending: THREE.AdditiveBlending,
                    transparent: true,
                    depthWrite: false,
                    color: color
                });
            }
        }

        NoteDust.prototype._generateTexture = function(hexColor) {
            var canvas, context, gradient, height, texture, width;
            width = 32;
            height = 32;
            canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            width = canvas.width, height = canvas.height;
            context = canvas.getContext('2d');
            gradient = context.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
            gradient.addColorStop(0, (new THREE.Color(hexColor)).getStyle());
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            context.fillStyle = gradient;
            context.fillRect(0, 0, width, height);
            texture = new THREE.Texture(canvas, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.NearestFilter, THREE.LinearMipMapLinearFilter);
            texture.needsUpdate = true;
            return texture;
        };

        NoteDust.prototype.update = function() {
            var particle, particleSystem, _i, _j, _len, _len1, _ref, _ref1, _results;
            _ref = this.model.children.slice(0);
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                particleSystem = _ref[_i];
                if (particleSystem.age++ > this.life) {
                    _results.push(this.model.remove(particleSystem));
                } else {
                    _ref1 = particleSystem.geometry.vertices;
                    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                        particle = _ref1[_j];
                        particle.add(particle.velocity);
                    }
                    _results.push(particleSystem.geometry.verticesNeedUpdate = true);
                }
            }
            return _results;
        };

        NoteDust.prototype.createParticles = function(note) {
            var Black, KeyType, geometry, i, keyCenterPosX, keyInfo, keyType, material, particle, particleSystem, posX, posY, posZ, _i, _ref, _ref1, _ref2;
            _ref = this.pianoDesign, keyInfo = _ref.keyInfo, KeyType = _ref.KeyType;
            Black = KeyType.Black;
            _ref1 = keyInfo[note], keyCenterPosX = _ref1.keyCenterPosX, keyType = _ref1.keyType;
            posX = keyCenterPosX;
            posY = keyType === Black ? 0.18 : 0.13;
            posZ = -0.2;
            geometry = new THREE.Geometry();
            for (i = _i = 0, _ref2 = this.count; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
                particle = new THREE.Vector3(posX, posY, posZ);
                particle.velocity = new THREE.Vector3((Math.random() - 0.5) * 0.04, (Math.random() - 0.3) * 0.01, (Math.random() - 0.5) * 0.04);
                geometry.vertices.push(particle);
            }
            material = this.materials[note];
            particleSystem = new THREE.PointCloud(geometry, material);
            particleSystem.age = 0;
            particleSystem.transparent = true;
            particleSystem.opacity = 0.8;
            return this.model.add(particleSystem);
        };
        return NoteDust;
    })();

    this.NoteParticles = NoteDust;

}).call(this);