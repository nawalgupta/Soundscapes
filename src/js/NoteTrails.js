/**
 * Created by diakabanab on 10/22/2016.
 */
(function() {
    var NoteTrails,
        __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

    NoteTrails = (function() {
        NoteTrails.prototype.lengthScale = 0.001;

        function NoteTrails(pianoDesign) {
            this.pianoDesign = pianoDesign;
            this.update = __bind(this.update, this);
            this.model = new THREE.Object3D();
        }

        NoteTrails.prototype.setMidiData = function(midiData, callback) {
            var noteInfos;
            this.clear();
            noteInfos = this._getNoteInfos(midiData);
            return this._buildNoteMeshes(noteInfos, callback);
        };

        NoteTrails.prototype.clear = function() {
            var child, _i, _len, _ref, _results;
            _ref = this.model.children.slice(0);
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                child = _ref[_i];
                _results.push(this.model.remove(child));
            }
            return _results;
        };

        NoteTrails.prototype._getNoteInfos = function(midiData) {
            var channel, currentTime, duration, event, interval, noteInfos, noteNumber, noteTimes, startTime, subtype, _i, _len, _ref, _ref1;
            currentTime = 0;
            noteInfos = [];
            noteTimes = [];
            for (_i = 0, _len = midiData.length; _i < _len; _i++) {
                _ref = midiData[_i], (_ref1 = _ref[0], event = _ref1.event), interval = _ref[1];
                currentTime += interval;
                subtype = event.subtype, noteNumber = event.noteNumber, channel = event.channel;
                if (channel === 9) {
                    continue;
                }
                if (subtype === 'noteOn') {
                    noteTimes[noteNumber] = currentTime;
                } else if (subtype === 'noteOff') {
                    startTime = noteTimes[noteNumber];
                    duration = currentTime - startTime;
                    noteInfos.push({
                        noteNumber: noteNumber,
                        startTime: startTime,
                        duration: duration
                    });
                }
            }
            return noteInfos;
        };

        NoteTrails.prototype._buildNoteMeshes = function(noteInfos, callback) {
            var Black, KeyType, SIZE_OF_EACH_GROUP, blackKeyHeight, blackKeyWidth, group, groups, keyInfo, noteToColor, sleepTask, splitToGroups, tasks, _i, _len, _ref,
                _this = this;
            _ref = this.pianoDesign, blackKeyWidth = _ref.blackKeyWidth, blackKeyHeight = _ref.blackKeyHeight, keyInfo = _ref.keyInfo, KeyType = _ref.KeyType, noteToColor = _ref.noteToColor;
            Black = KeyType.Black;
            splitToGroups = function(items, sizeOfEachGroup) {
                var groups, i, numGroups, start, _i;
                groups = [];
                numGroups = Math.ceil(items.length / sizeOfEachGroup);
                start = 0;
                for (i = _i = 0; 0 <= numGroups ? _i < numGroups : _i > numGroups; i = 0 <= numGroups ? ++_i : --_i) {
                    groups[i] = items.slice(start, start + sizeOfEachGroup);
                    start += sizeOfEachGroup;
                }
                return groups;
            };
            sleepTask = function(done) {
                return setTimeout((function() {
                    return done(null);
                }), 0);
            };
            tasks = [];
            SIZE_OF_EACH_GROUP = 100;
            groups = splitToGroups(noteInfos, SIZE_OF_EACH_GROUP);
            for (_i = 0, _len = groups.length; _i < _len; _i++) {
                group = groups[_i];
                tasks.push(sleepTask);
                tasks.push((function(group) {
                    return function(done) {
                        var color, duration, geometry, length, material, mesh, noteInfo, noteNumber, startTime, x, y, z, _j, _len1;
                        for (_j = 0, _len1 = group.length; _j < _len1; _j++) {
                            noteInfo = group[_j];
                            noteNumber = noteInfo.noteNumber, startTime = noteInfo.startTime, duration = noteInfo.duration;
                            length = duration * _this.lengthScale;
                            x = keyInfo[noteNumber].keyCenterPosX;
                            y = startTime * _this.lengthScale + (length / 2);
                            z = -0.2;
                            if (keyInfo[noteNumber].keyType === Black) {
                                y += blackKeyHeight / 2;
                            }
                            color = noteToColor(noteNumber);
                            geometry = new THREE.BoxGeometry(blackKeyWidth, length, blackKeyWidth);
                            material = new THREE.MeshPhongMaterial({
                                color: color,
                                emissive: color,
                                opacity: 0.7,
                                transparent: true
                            });
                            mesh = new THREE.Mesh(geometry, material);
                            mesh.position.set(x, y, z);
                            _this.model.add(mesh);
                        }
                        return done(null);
                    };
                })(group));
            }
            return async.series(tasks, function() {
                return typeof callback === "function" ? callback() : void 0;
            });
        };

        NoteTrails.prototype.update = function(playerCurrentTime) {
            return this.model.position.y = -playerCurrentTime * this.lengthScale;
        };

        return NoteTrails;

    })();

    this.NoteTrails = NoteTrails;

}).call(this);