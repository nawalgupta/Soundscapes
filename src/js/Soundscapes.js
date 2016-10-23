/**
 * Created by diakabanab on 10/22/2016.
 */
(function() {
    var Soundscapes,
        __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

    Soundscapes = (function() {
        function Soundscapes() {
            this.setProgress = __bind(this.setProgress, this);
            this.setCurrentTime = __bind(this.setCurrentTime, this);
            this.getEndTime = __bind(this.getEndTime, this);
            this.pause = __bind(this.pause, this);
            this.stop = __bind(this.stop, this);
            this.resume = __bind(this.resume, this);
            this.start = __bind(this.start, this);
            var _this = this;
            this.design = new PianoKeyboardDesign();
            this.keyboard = new PianoKeyboard(this.design);
            this.rain = new NoteTrails(this.design);
            this.particles = new NoteParticles(this.design);
            this.player = MIDI.Player;
            this.player.addListener(function(data) {
                var NOTE_OFF, NOTE_ON, message, note;
                NOTE_OFF = 128;
                NOTE_ON = 144;
                note = data.note, message = data.message;
                if (message === NOTE_ON) {
                    _this.keyboard.press(note);
                    return _this.particles.createParticles(note);
                } else if (message === NOTE_OFF) {
                    return _this.keyboard.release(note);
                }
            });
            this.player.setAnimation({
                delay: 20,
                callback: function(data) {
                    var end, now;
                    now = data.now, end = data.end;
                    if (typeof _this.onprogress === "function") {
                        _this.onprogress({
                            current: now,
                            total: end
                        });
                    }
                    return _this.rain.update(now * 1000);
                }
            });
        }

        Soundscapes.prototype.initScene = function() {
            var _this = this;
            this.scene = new Scene('#canvas');
            this.scene.add(this.keyboard.model);
            this.scene.add(this.rain.model);
            this.scene.add(this.particles.model);
            return this.scene.animate(function() {
                _this.keyboard.update();
                return _this.particles.update();
            });
        };

        Soundscapes.prototype.initMidi = function(callback) {
            return MIDI.loadPlugin(function() {
                MIDI.channels[9].mute = true;
                return typeof callback === "function" ? callback() : void 0;
            });
        };

        Soundscapes.prototype.loadBuiltinPlaylist = function(callback) {
            var _this = this;
            if (this.playlist) {
                return callback(this.playlist);
            }
            return $.getJSON('tracks/index.json', function(playlist) {
                _this.playlist = playlist;
                return callback(_this.playlist);
            });
        };

        Soundscapes.prototype.loadBuiltinMidi = function(id, callback) {
            var _this = this;
            if (!((0 <= id && id < this.playlist.length))) {
                return;
            }
            if (typeof localStorage !== "undefined" && localStorage !== null ? localStorage[id] : void 0) {
                return this.loadMidiFile(localStorage[id], callback);
            }
            return $.ajax({
                url: "tracks/" + this.playlist[id],
                dataType: 'text',
                success: function(data) {
                    var e;
                    _this.loadMidiFile(data, callback);
                    try {
                        return typeof localStorage !== "undefined" && localStorage !== null ? localStorage[id] = data : void 0;
                    } catch (_error) {
                        e = _error;
                        return typeof console !== "undefined" && console !== null ? console.error('localStorage quota limit reached') : void 0;
                    }
                }
            });
        };

        Soundscapes.prototype.loadMidiFile = function(midiFile, callback) {
            var _this = this;
            return this.player.loadFile(midiFile, function() {
                return _this.rain.setMidiData(_this.player.data, callback);
            });
        };

        Soundscapes.prototype.start = function() {
            this.player.start();
            return this.playing = true;
        };

        Soundscapes.prototype.resume = function() {
            this.player.currentTime += 1e-6;
            this.player.resume();
            return this.playing = true;
        };

        Soundscapes.prototype.stop = function() {
            this.player.stop();
            return this.playing = false;
        };

        Soundscapes.prototype.pause = function() {
            this.player.pause();
            return this.playing = false;
        };

        Soundscapes.prototype.getEndTime = function() {
            return this.player.endTime;
        };

        Soundscapes.prototype.setCurrentTime = function(currentTime) {
            this.player.pause();
            this.player.currentTime = currentTime;
            if (this.playing) {
                return this.player.resume();
            }
        };

        Soundscapes.prototype.setProgress = function(progress) {
            var currentTime;
            currentTime = this.player.endTime * progress;
            return this.setCurrentTime(currentTime);
        };

        Soundscapes.prototype.on = function(eventName, callback) {
            return this["on" + eventName] = callback;
        };

        return Soundscapes;

    })();

    this.Soundscapes = Soundscapes;

}).call(this);