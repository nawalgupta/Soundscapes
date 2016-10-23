/**
 * Created by diakabanab on 10/23/2016.
 */
(function() {
    var Player,
        __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

    Player = (function() {
        function Player(container) {
            this.displayProgress = __bind(this.displayProgress, this);
            this.getRandomTrack = __bind(this.getRandomTrack, this);
            this.setTrackFromHash = __bind(this.setTrackFromHash, this);
            this.setTrack = __bind(this.setTrack, this);
            this.ontrackchange = __bind(this.ontrackchange, this);
            this.onnext = __bind(this.onnext, this);
            this.onprev = __bind(this.onprev, this);
            this.onstop = __bind(this.onstop, this);
            this.onresume = __bind(this.onresume, this);
            this.onpause = __bind(this.onpause, this);
            this.onplay = __bind(this.onplay, this);
            this.hide = __bind(this.hide, this);
            this.show = __bind(this.show, this);
            this.updateSize = __bind(this.updateSize, this);
            this.autoHide = __bind(this.autoHide, this);
            var _this = this;
            this.$container = $(container);
            this.$controlsContainer = $('.player-controls', this.$container);
            this.$playlistContainer = $('.player-playlist-container', this.$container);
            this.$progressContainer = $('.player-progress-container', this.$container);
            this.$progressBar = $('.player-progress-bar', this.$container);
            this.$progressText = $('.player-progress-text', this.$container);
            this.$playlist = $('.player-playlist', this.$container);
            this.$prevBtn = $('.player-prev', this.$container);
            this.$nextBtn = $('.player-next', this.$container);
            this.$playBtn = $('.player-play', this.$container);
            this.$stopBtn = $('.player-stop', this.$container);
            this.$pauseBtn = $('.player-pause', this.$container);
            this.$prevBtn.click(function() {
                return _this.onprev();
            });
            this.$nextBtn.click(function() {
                return _this.onnext();
            });
            this.$stopBtn.click(function() {
                return _this.stop();
            });
            this.$pauseBtn.click(function() {
                return _this.pause();
            });
            this.$playBtn.click(function() {
                if (_this.current === 'paused') {
                    return _this.resume();
                } else {
                    return _this.play();
                }
            });
            this.$progressContainer.click(function(event) {
                var progress;
                progress = (event.clientX - _this.$progressContainer.offset().left) / _this.$progressContainer.width();
                return typeof _this.progressCallback === "function" ? _this.progressCallback(progress) : void 0;
            });
            this.$playlist.click(function(event) {
                var $list, $target;
                $target = $(event.target);
                if ($target.is('li')) {
                    $list = $('li', _this.$playlist);
                    return _this.setTrack($list.index($target));
                }
            });
            this.$container.on('mousewheel', function(event) {
                return event.stopPropagation();
            });
            this.updateSize();
            $(window).resize(this.updateSize);
            $(window).on('hashchange', this.setTrackFromHash);
        }

        Player.prototype.autoHide = function() {
            var onmousemove,
                _this = this;
            onmousemove = function(event) {
                if (event.pageX < 400) {
                    return _this.show();
                } else {
                    return _this.hide();
                }
            };
            return $(document).on('mousemove', onmousemove).on('mousedown', function() {
                return $(this).off('mousemove', onmousemove);
            }).on('mouseup', function() {
                return $(this).on('mousemove', onmousemove);
            });
        };

        Player.prototype.updateSize = function() {
            return this.$playlistContainer.height(this.$container.innerHeight() - this.$controlsContainer.outerHeight(true) - this.$progressContainer.outerHeight(true) - 15).nanoScroller();
        };

        Player.prototype.show = function(callback) {
            var _this = this;
            if (this.visible || this.animating) {
                return;
            }
            this.visible = true;
            this.animating = true;
            return this.$container.animate({
                left: '0px'
            }, {
                duration: 500,
                easing: 'easeInOutCubic',
                complete: function() {
                    _this.animating = false;
                    return typeof callback === "function" ? callback() : void 0;
                }
            });
        };

        Player.prototype.hide = function(callback) {
            var _this = this;
            if (!this.visible || this.animating) {
                return;
            }
            this.visible = false;
            this.animating = true;
            return this.$container.animate({
                left: "" + (-this.$container.width()) + "px"
            }, {
                duration: 500,
                easing: 'easeInOutCubic',
                complete: function() {
                    _this.animating = false;
                    return typeof callback === "function" ? callback() : void 0;
                }
            });
        };

        Player.prototype.setPlaylist = function(playlist) {
            var trackName, _i, _len;
            this.playlist = playlist;
            this.$playlist.html('');
            for (_i = 0, _len = playlist.length; _i < _len; _i++) {
                trackName = playlist[_i];
                this.$playlist.append($('<li>').text(trackName));
            }
            return this.$playlistContainer.nanoScroller();
        };

        Player.prototype.on = function(eventName, callback) {
            return this["" + eventName + "Callback"] = callback;
        };

        Player.prototype.onplay = function() {
            this.$playBtn.hide();
            this.$pauseBtn.show();
            return typeof this.playCallback === "function" ? this.playCallback() : void 0;
        };

        Player.prototype.onpause = function() {
            this.$pauseBtn.hide();
            this.$playBtn.show();
            return typeof this.pauseCallback === "function" ? this.pauseCallback() : void 0;
        };

        Player.prototype.onresume = function() {
            this.$playBtn.hide();
            this.$pauseBtn.show();
            return typeof this.resumeCallback === "function" ? this.resumeCallback() : void 0;
        };

        Player.prototype.onstop = function() {
            this.$pauseBtn.hide();
            this.$playBtn.show();
            return typeof this.stopCallback === "function" ? this.stopCallback() : void 0;
        };

        Player.prototype.onprev = function() {
            if (!(this.currentTrackId > 0)) {
                return;
            }
            this.currentTrackId -= 1;
            return this.setTrack(this.currentTrackId);
        };

        Player.prototype.onnext = function() {
            if (!(this.currentTrackId < this.playlist.length - 1)) {
                return;
            }
            this.currentTrackId += 1;
            return this.setTrack(this.currentTrackId);
        };

        Player.prototype.ontrackchange = function(trackId) {
            var _ref;
            if (!((0 <= trackId && trackId < this.playlist.length))) {
                return;
            }
            this.stop();
            if ((_ref = this.$currentTrack) != null) {
                _ref.removeClass('player-current-track');
            }
            this.$currentTrack = this.$playlist.find("li").eq(trackId).addClass('player-current-track');
            if (typeof this.trackchangeCallback === "function") {
                this.trackchangeCallback(trackId);
            }
            return this.currentTrackId = trackId;
        };

        Player.prototype.setTrack = function(trackId) {
            return window.location.hash = trackId + 1;
        };

        Player.prototype.setTrackFromHash = function() {
            var hash;
            hash = window.location.hash.slice(1);
            if (hash) {
                return this.ontrackchange(parseInt(hash, 10) - 1);
            }
        };

        Player.prototype.getRandomTrack = function() {
            return this.playlist[Math.floor(Math.random() * this.playlist.length)];
        };

        Player.prototype.displayProgress = function(event) {
            var curTime, current, progress, totTime, total;
            current = event.current, total = event.total;
            current = Math.min(current, total);
            progress = current / total;
            this.$progressBar.width(this.$progressContainer.width() * progress);
            curTime = this._formatTime(current);
            totTime = this._formatTime(total);
            return this.$progressText.text("" + curTime + " / " + totTime);
        };

        Player.prototype._formatTime = function(time) {
            var minutes, seconds;
            minutes = time / 60 >> 0;
            seconds = String(time - (minutes * 60) >> 0);
            if (seconds.length === 1) {
                seconds = "0" + seconds;
            }
            return "" + minutes + ":" + seconds;
        };

        return Player;

    })();

    StateMachine.create({
        target: Player.prototype,
        events: [
            {
                name: 'init',
                from: 'none',
                to: 'ready'
            }, {
                name: 'play',
                from: 'ready',
                to: 'playing'
            }, {
                name: 'pause',
                from: 'playing',
                to: 'paused'
            }, {
                name: 'resume',
                from: 'paused',
                to: 'playing'
            }, {
                name: 'stop',
                from: '*',
                to: 'ready'
            }
        ]
    });

    this.Player = Player;

}).call(this);