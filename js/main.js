"use strict";
(function() {
	var canvas = document.getElementById("mainCanvas");
	var ctx = canvas.getContext("2d");
	var shape;
    var initX;
    var initY;
	dl.log = true; 
	dl.setup(canvas);

	window.addEventListener('resize', resizeCanvas,false);
	resizeCanvas();

	function resizeCanvas() {
	    canvas.height= window.innerHeight;
	    canvas.width= window.innerWidth;
        dl.redraw();
	}

    var states = {
      IDLE: 0,
      DRAW: 1,
      DRAG: 2,
      DELETE: 3
    };
    
    var Graphic = function(element) {
        var state = states.IDLE;
        this.onDown = function(event) {
            initX = event.clientX;
            initY = event.clientY;
            switch(state) {
            	case states.IDLE:
                    // grabbing existing shape
                    var obj = dl.getObjectContaining(event.clientX, event.clientY);
	                if (obj !== null) {
                        shape = obj;
                        state = states.DRAG;
                        break;
                    } else {
                        //drawing new shape
                        drawShape(event.clientX, event.clientY);
                        dl.addGraphicalObject(shape);
                        state = states.DRAW;
                        break;
	                }
                case states.DELETE:
                    var obj = dl.getObjectContaining(event.clientX, event.clientY);
                    if (obj !== null) {
                        shape = obj;
                        dl.removeGraphicalObject(shape);
                        state = states.DELETE;
                    } else {
                        state = states.DELETE;
                        break;
                    }
                    break;

                case states.DRAW:
                case states.DRAG:
                    return;

                default :
                    break;
            }
        };

        this.onMove = function(event) {
        	switch(state) {
                // moving an existing shape
                case states.DRAG:    
                    shape.moveTo(event.clientX, event.clientY);
                    state = states.DRAG;
                    break;          
                //drawing shape based on end point
                case states.DRAW:
                    //this is setting the brushsize for the shape based on the end points
                    var val1 = Math.pow((initX - event.clientX), 2);
                    var val2 = Math.pow((initY - event.clientY), 2);
                    var brushsize = (Math.sqrt(val1 + val2))*2;                   
                    shape.setSize(brushsize); 
                    state = states.DRAW;
                    break;

                case states.DELETE:
                case states.IDLE:
                    return;
		        default :
		        	break;
        	}
        }

        this.onUp = function(event) {
            switch(state) {
                case states.DRAG:
                    shape = null;
                    state = states.IDLE;
                    break;

                case states.DRAW:                 
                    shape = null;               
                    state = states.IDLE;
                    break;

                case states.DELETE: 
                    state = states.DELETE;
                    break;

                case states.IDLE:
                    return;

                default :
                    break;
            }
        };

        this.onChangeBrush = function(event) {
            switch(brushType.value) {
                case "delete":
                    state = states.DELETE;
                    break;

                case "square":
                case "circle":
                case "star":
                    state = states.IDLE;
                    break;

                default :
                    break;
            }
        };


    }; 
    function drawShape(x,y) {
    	var color = brushColor.value;
    	switch (brushType.value) {
    		case "square":
    			shape = new Square(x,y,color,5);
                shape.draw(ctx);
    			break;
            case "circle":
                shape = new Circle(x,y,color,5);
                shape.draw(ctx);
                break;
    		case "star":
    			shape = new Star(x,y,color,5);
                shape.draw(ctx);
    			break;
    		default :
    			alert("You've done something invalid.");
                break;
    	}
    };

    window.canvasObj = new Graphic(canvas);    
    canvas.addEventListener("mousedown",canvasObj.onDown,false);
    canvas.addEventListener("mouseup",canvasObj.onUp, false);
    canvas.addEventListener("mousemove",canvasObj.onMove, false);
    var brush = document.getElementById("brushType");
    brush.addEventListener("change", canvasObj.onChangeBrush, false);
})();