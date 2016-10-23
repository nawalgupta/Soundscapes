/**
 * Created by diakabanab on 10/23/2016.
 */
(function() {
    var Loader,
        __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

    Loader = (function() {
        Loader.prototype.opts = {
            color: '#aaaaaa',
            width: 4
        };

        function Loader() {
            this.stop = __bind(this.stop, this);
            this.start = __bind(this.start, this);
            this.message = __bind(this.message, this);
            this.onresize = __bind(this.onresize, this);
            this.window = $(window);
            this.overlay = $('<div>').width(this.window.width()).height(this.window.height()).hide().css({
                position: 'absolute',
                top: 0,
                left: 0,
                'z-index': 10000,
                background: 'rgba(0, 0, 0, 0.7)',
                'text-align': 'center'
            }).appendTo(document.body).on('selectstart', (function() {
                return false;
            }));
            this.box = $('<div>').width(300).height(200).appendTo(this.overlay);
            this.canvas = $('<div>').height(100).appendTo(this.box);
            this.text = $('<div>').css({
                color: '#ddd',
                'font-size': '12px',
                cursor: 'default'
            }).appendTo(this.box);
            this.onresize();
            this.window.resize(this.onresize);
        }

        Loader.prototype.onresize = function() {
            var height, width, _ref;
            _ref = [this.window.width(), this.window.height()], width = _ref[0], height = _ref[1];
            this.box.css({
                position: 'absolute',
                top: (height - 200) / 2,
                left: (width - 300) / 2
            });
            return this.overlay.width(width).height(height);
        };

        Loader.prototype.message = function(msg, callback) {
            if (msg != null) {
                this.text.html(msg);
            }
            if (this.isActive) {
                return typeof callback === "function" ? callback() : void 0;
            } else {
                return this.start(callback);
            }
        };

        Loader.prototype.start = function(callback) {
            var _this = this;
            this.overlay.fadeIn(function() {
                return typeof callback === "function" ? callback() : void 0;
            });
            if (this.spin) {
                this.spin.spin(this.canvas[0]);
            } else {
                this.spin = new Spinner(this.opts);
                this.spin.spin(this.canvas[0]);
            }
            return this.isActive = true;
        };

        Loader.prototype.stop = function(callback) {
            var _this = this;
            return this.overlay.fadeOut('slow', function() {
                var _ref;
                if ((_ref = _this.spin) != null) {
                    _ref.stop();
                }
                _this.isActive = false;
                return typeof callback === "function" ? callback() : void 0;
            });
        };

        return Loader;

    })();

    this.Loader = Loader;

}).call(this);