(function() {
    'use strict'
    window.addEventListener('load', init, false);
    ParticleSystem.prototype = [];
    var canvas = null, 
        ctx = null, 
        lastPress = null, 
        lastUpdate = 0; 
        mousex = 0, 
        mousey = 0, 
        bgColor = '#000', 
        counter = 0,
        score = 0,
        lastKey = null,
        pause = true,
        gameOVer = true,
        eTimer = 0,
        bombs = [],
        ps = new ParticleSystem(); 
    var player = new Circle(0, 0, 5); 
    var target = new Circle(100, 100, 10);
    
    var iSight = new Image();
    iSight.src = 'assets/sight.png';
    var iTarget = new Image();
    iTarget.src = 'assets/target.png'

        function init() {
            canvas = document.getElementById('canvas');
            ctx = canvas.getContext('2d');
            canvas.height = 300;
            canvas.width = 200;

            enabledInputs();
            run();
        }

        function random(max) {
            return ~~(Math.random()*max);
        }

        function run() {
            requestAnimationFrame(run);

            var now = Date.now();
            var deltaTime = (now - lastUpdate) / 1000;
            if (deltaTime > 1) deltaTime = 0;
            lastUpdate = now;

            act(deltaTime);
            paint(ctx);
        }

        function reset() {
            score = 0;
            eTimer = 0;
            bombs.length = 0;
            gameOVer = false;
        }

        function act(deltaTime) {
            //if(!pause) {
            player.x=mousex;
            player.y=mousey;

            if(player.x<0)
                player.x=0;
            if(player.x>canvas.width)
                player.x=canvas.width;
            if(player.y<0)
                player.y=0;
            if(player.y>canvas.height)
                player.y=canvas.height;
            
            if (lastPress == 1) {
                bgColor = '#333';
                var color = 'rgb(' +random(255)+ ',' +random(255)+ ',' +random(255)+ ')';
                for (var i=0; i < 200; i++)
                ps.push(new Particle(player.x, player.y, 1, 0.5 + random(500)/1000, random(100), random(360),color));
            }
            
            // Generate new bomb
            eTimer -= deltaTime;
            if (eTimer < 0) {
                var bomb = new circle(random(2) *canvas.width, random(2) * canvas.height, 10);
                bomb.timer = 1.5 + random(2.5);
                bomb.speed = 100 +(random(score))*10;
                bombs.push(bomb);
                eTimer = 0.5 + random(2.5);
            } 
            // Bombs
            for (var i=0, l=bombs.length; i < l; i++) {
                if(bombs[i].timer < 0){
                score++; //bomb eliminated and score++;
                bombs.splice(i--, 1);
                l--;
                continue;
            }

            bombs[i].timer-=deltaTime;
            var angle=bombs[i].getAngle(player);
            bombs[i].move(angle,bombs[i].speed*deltaTime);

            if (bombs[i].timer < 0) {
                bombs[i].radius *= 2; //enlarge the bomb when it explodes
                if (bombs[i].distance(player) < 0) {
                    gameOVer = true;
                    pause = true;
                    }
               }
           }
       //}
       ps.move(deltaTime);     
        }


    

        function paint(ctx) {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (var i = 0, l = bombs.length; i < l; i++) {
                if (bombs[i].timer < 0) {
                    ctx.strokeStyle = '#fff';
                    bombs[i].fill(ctx);
                }
                else {
                    if (bombs[i].timer < 1 && ~~(bombs[i].timer*10)%2==0)
                        ctx.strokeStyle = '#fff';
                    else     
                        ctx.strokeStyle = '#f00';
                    bombs[i].stroke(ctx);
                }
            }
            ctx.strokeStyle = '0f0';
            player.stroke(ctx);

            /*ctx.strokeStyle = '#f00';
            target.stroke(ctx, iTarget);
            ctx.strokeStyle='#0f0';
            player.stroke(ctx, iSight);*/

            ps.fill(ctx);
            ctx.fillStyle = bgColor;
            player.stroke(ctx);

            ctx.fillStyle = '#0f0';
            ctx.fillText('Particles: ' +ps.length, 0, 20);
            lastpress = null;

            ctx.fillStyle = '#fff';
            //ctx.fillText('Distance: ' +player.distance(target).toFixed(1), 10);
            //ctx.fillText('Angle: ' +(player.getAngle(target) * (180/Math.PI)).toFixed(1), 10, 20);
            ctx.fillText('Score: ' +score, 0, 10);

            if (pause) {
                ctx.textAlign = 'center';
            if(gameOVer)
                ctx.fillText('GAME OVER ',150, 100);
            else
                ctx.fillText('PAUSE', 150, 100); 
            ctx.textAlign = 'left';
            }
        }
           

        function enabledInputs(){
            document.addEventListener('mousemove', function(evt) {
                mousex = evt.pageX - canvas.offsetLeft;
                mousey = evt.pageY - canvas.offsetTop;
            }, false);

            canvas.addEventListener('mousedown',function(evt) {
                pause = !pause;
                lastKey = 0;
                lastPress = evt.which;
            },false);
        }
        
        function ParticleSystem() {}

        ParticleSystem.prototype.fill = function (ctx) {
            for (var i = 0, l = this.length; i < l; i++) {
                ctx.fillStyle = this[i].color;
                ctx.beginPath();
                ctx.arc(this[i].x, this[i].y, this[i].radius, 0, Math.PI*2, true);
            }
        }

        ParticleSystem.prototype.move = function(deltaTime) {
            for (var i = 0, l = this.length; i < l; i++) {
                this[i].life -= deltaTime;
                if (this[i].life < 0) {
                    this.splice(i--, 1);
                    l--;
                }
                else {
                    this[i].x = Math.cos(this[i].angle)* this[i].speed * deltaTime;
                    this[i].y = Math.sin(this[i].angle)* this[i].speed * deltaTime;
                }
            }
        }

        function Particle(x,y,radius,life,speed,angle,color) {
            this.x = (x == null) ?0 : x;
            this.y = (y == null) ?0 : y;
            this.radius = (radius == null) ?1 : radius;
            this.life = (life == null) ?0 : life;
            this.speed = (speed == null) ?0 : speed;
            this.angle = (angle == null) ?0 : angle;
            this.color = (color == null) ?'#fff' : color;
        }
        
        function Circle (x, y, radius) {
            this.x = (x == null) ?0 : x;
            this.y = (y == null) ?0 : y;
            this.radius = (radius == null) ?0 : radius;
            this.timer = 0;
            this.speed = 0;
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
        
        Circle.prototype.fill=function(ctx){
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
            ctx.fill();
        }            
        /*circle.prototype.drawImage = function (ctx, img) {
            if (img.width)
                ctx.drawImage(img, this.x - this.radius, this.y - this.radius);
            else
                this.stroke(ctx);
        }*/
        circle.prototype.move = function(angle, speed) {
            if (speed != null) {
                this.x += Math.cos(angle) * speed;
                this.y += Math.sen(angle) * speed;
            }
        }
        circle.prototype.getAngle = function (circle) {
            if (circle != null)
                return (Math.atan2(circle.y - this.y, circl.x - this.x));
        }

        window.requestAnimationFrame=(function(){
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {window.setTimeout(callback, 17);};
    })();
})();