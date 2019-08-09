(function() {
    'use strict'
    window.addEventListener('load', init, false);
    var canvas = null,
        ctx = null,
        x = 0,
        y = 0,
        mousex = 0,
        mousey = 0;

    var player = new Circle(0, 0, 5);
    var target = new Circle(100, 100, 10);

        document.addEventListener('mousemove', function(evt) {
            mousex = evt.pageX - canvas.offsetLeft;
            mousey = evt.pageY - canvas.offsetTop;
        }, false);

        function init() {
            canvas = document.getElementById('canvas');
            ctx = canvas.getContext('2d');
            canvas.height = 300;
            canvas.width = 200;

            run();
        }

        function Circle (x, y, radius) {
            this.x = (x == null) ?0 : x;
            this.y = (y == null) ?0 : y;
            this.radius = (radius == null) ?0 : radius;

            Circle.prototype.stroke = function(ctx) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
                ctx.stroke();
            }
            Circle.prototype.distance = function(circle) {
                if (circle != null) {
                    var dx = this.x - circle.x;
                    var dy = this.y - circle.y;
                    return (Math.sqrt(dx * dx + dy * dy)-(this.radius + circle.radius));
                }
            }
        }
        function run() {
            requestAnimationFrame(run);
            act();
            paint(ctx);
        }

        function act() {
            x = mousex;
            y = mousey;

            if (x < 0) 
                x = 0;
            if (x > canvas.width)
                x = canvas.width;
            if (y < 0)
                y = 0;
            if (y > canvas.height)
                y = canvas.height;
        }

        function paint(ctx) {
            ctx.fillStyle = '#000';
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle='#0f0';
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI*2, true);
            ctx.stroke();
        }
        window.requestAnimationFrame=(function(){
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {window.setTimeout(callback, 17);};
        })();
})();
