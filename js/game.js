(function() {
    'use strict'
    window.addEventListener('load', init, false);
    var canvas = null,
        ctx = null,
        lastPress = null,
        bgColor = '#000',
        mousex = 0,
        mousey = 0,
        score = 0,
        counter = 0,
        pause = true,
        gameOVer = true;
        lastUpdate = 0;
    var player = new Circle(0, 0, 5);
    var target = new Circle(100, 100, 10);

        function init() {
            canvas = document.getElementById('canvas');
            ctx = canvas.getContext('2d');
            canvas.height = 300;
            canvas.width = 200;

            enabledInputs();
            run();
        }

        function random (max) {
            return ~~(Math.random()*max);
        }

        function run() {
            requestAnimationFrame(run);
            act();
            paint(ctx);
        }

        function act(deltaTime) {
            counter += deltaTime;
        }

        function act() {
            var now = Date.now();
            var deltaTime = (now - lastUpdate) / 1000;
            if (deltaTime > 1) deltaTime = 0;
            lastUpdate = now;

            act(deltaTime);

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
            if (lastPress == 1) {
                if(gameOVer) {
                    gameOVer = false;
                    counter = 5;
                }
                else
                    pause = false;
                    lastPress = null;
            }
                if (!pause) {
                    counter -= deltaTime;
                    if (counter <= 0) {
                        counter = 0;
                        gameOVer = true;
                        pause = true;
                    }
                }
                if (pause) {
                    ctx.font = '10px arial';
                    if (gameOVer) 
                        ctx.fillText('Click to reset', 150, 120);
                    else
                        ctx.fillText('Click to start', 150, 120);
                }
                bgColor = '#333';
                if (player.distance(target) < 0) {
                    score++;
                    target.x = random(canvas.width/10 - 1)* 10 + target.radius;
                    target.y = random(canvas.height/10 - 1)* 10 + target.radius;
                }
            }
            else
                bgColor = '#000';
        }

        function paint(ctx) {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = '#f00';
            target.stroke(ctx);
            ctx.strokeStyle='#0f0';
            player.stroke(ctx);

            ctx.fillStyle = '#fff';
            ctx.fillText = ('Distance: ' +player.distance(target).toFixed(1), 10, 10);
            ctx.fillText('Score: ' +score, 0, 20);
            lastPress = null;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.font = '20px arial';
            ctx.fillText(counter, 150, 100);
            ctx.fillText(counter.toFixed(1),150,100);
        }

        function enabledInputs(){
            document.addEventListener('mousemove',function(evt) {
                mousex=evt.pageX-canvas.offsetLeft;
                mousey=evt.pageY-canvas.offsetTop;
            },false);
            canvas.addEventListener('mousedown',function(evt) {
                lastPress=evt.which;
            },false);
        }
        
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