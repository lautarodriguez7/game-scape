var mousex = 0,
    mousey = 0;

    document.addEventListener('mousemove', function(evt) {
        mousex = evt.pageX - canvas.offsetLeft;
        mousey = evt.pageY - canvas.offsetTop;
    }, false);

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