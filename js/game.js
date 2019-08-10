(function() {
    'use strict'
    window.addEventListener('load', init, false);
    var canvas = null,
        ctx = null,
        x = 0,
        bgColor = '#000',
        y = 0,
        mousex = 0,
        mousey = 0,
        lastPress = null,
        score = 0;

    var player = new Circle(0, 0, 5);
    var target = new Circle(100, 100, 10);

        function init() {
            canvas = document.getElementById('canvas');
            ctx = canvas.getContext('2d');
            canvas.height = 300;
            canvas.width = 200;

            run();
        }

        
        function run() {
            requestAnimationFrame(run);
            act();
            paint(ctx);

        function act() {
            player.x = mousex;
            player.y = mousey;

            if (player.x < 0) 
                player.x = 0;
            if (player.x > canvas.width)
                player.x = canvas.width;
            if (player.y < 0)
                player.y = 0;
            if (player.y > canvas.height)
                player.y = canvas.height;

            if (player.distance(target) < 0)
                bgColor = '#333';
            else
                bgColor = '#000';
        }

        function paint(ctx) {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle='#0f0';
            player.stroke(ctx);
            ctx.strokeStyle = '#f00';
            target.stroke(ctx);

            ctx.fillStyle = '#fff';
            ctx.fillText = ('Distance: ' +player.distance(target).toFixed(1), 10, 10);
        }

        document.addEventListener('mousemove', function(evt) {
            mousex = evt.pageX - canvas.offsetLeft;
            mousey = evt.pageY - canvas.offsetTop;
        }, false);
        
        function Circle (x, y, radius) {
            this.x = (x == null) ?0 : x;
            this.y = (y == null) ?0 : y;
            this.radius = (radius == null) ?0 : radius;
        }
            Circle.prototype.distance = function(circle) {
                if (circle != null) {
                    var dx = this.x - circle.x;
                    var dy = this.y - circle.y;
                    return (Math.sqrt(dx * dx + dy * dy)-(this.radius + circle.radius));
                }
            }
            Circle.prototype.stroke = function(ctx) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
                ctx.stroke();
            }
        

        window.requestAnimationFrame=(function(){
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {window.setTimeout(callback, 17);};
        })();
})();
