"use strict";

//draws square
var Square = function(x,y,color,size) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
	// this function takes 1 parameter of a CanvasRenderingContext and 
	// draws a shape according to the graphical object's properties. The 
	// DisplayList does NOT save and restore the context between drawing each
	// graphical object.
    this.draw = function(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.fillRect(this.x-this.size/2,this.y-this.size/2, this.size, this.size);
        ctx.save();
    };
	 //this function takes 2 parmeters of an x and a y coordinate
	 //and returns true if that (x,y) coordinate lies within the bounds of the
	 //graphical object's shape and false otherwise. For complex shapes it is
	 //ok to assume the shape lies within an invisible square.
    this.contains = function(x,y) {
        return this.x - this.size/2 <= x && this.x + this.size/2 >= x
                    && this.y - this.size/2 <= y && this.y + this.size/2 >= y;
    };
	// this function takes 2 parameters of an x and a y coordinate 
	//and moves the graphical object to be centered at the corresponding 
	// point. This function should also call dl.redraw() once the property
	// change has been made.
    this.moveTo = function(x,y) {
    	this.x = x;
        this.y = y;
        dl.redraw();
    };
    // this function takes 1 parameter of a new size for the
	// graphical object. The effect of this size change will be different based
	// on the type of shape. This function should also call dl.redraw() once
	// the property change as been made.
    this.setSize = function(size) {
    	this.size = size;
        dl.redraw();
    }

    return this.Square;
};


//draws circle
var Circle = function(x,y,color,size) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;

    this.draw = function(ctx) {
        ctx.fillStyle=this.color; 
        ctx.strokeStyle=this.color; 
        ctx.lineWidth=1; 
        ctx.beginPath(); 
        ctx.save();
        ctx.arc(this.x,this.y,this.size/2,0,2*Math.PI); // draw a full cricle centered at the given position and with the given radius
        ctx.stroke(); // paint the circle's outline
        ctx.fill(); // paint the circle's fill
        ctx.restore();
    };

    this.contains = function(x,y) {
        var val1 = Math.pow((this.x - x), 2);
        var val2 = Math.pow((this.y - y), 2);
        var distance = (Math.sqrt(val1 + val2));     
        return distance <= this.size/2;
    };

    this.moveTo = function(x,y) {
    	this.x = x;
        this.y = y;
        dl.redraw();
    };

    this.setSize = function(size) {
    	this.size = size;
        dl.redraw();
    }

    return this.Circle;
};


//draws star
var Star = function(x,y,color,size) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    var deg2rad = Math.PI/180;

    this.draw = function(ctx) {
        ctx.fillStyle=this.color;
		ctx.strokeStyle=this.color;
		ctx.lineWidth=1;
		ctx.beginPath();
		ctx.save();
		ctx.moveTo(this.x-(this.size*Math.cos(deg2rad*54)), this.y+(this.size*Math.sin(deg2rad*54)));			
		ctx.lineTo(this.x, this.y-this.size);
		ctx.lineTo(this.x+(this.size*Math.cos(deg2rad*54)), this.y+(this.size*Math.sin(deg2rad*54)));			
		ctx.lineTo(this.x-(this.size*Math.cos(deg2rad*18)), this.y-(this.size*Math.sin(deg2rad*18)));
		ctx.lineTo(this.x+(this.size*Math.cos(deg2rad*18)), this.y-(this.size*Math.sin(deg2rad*18)));
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.restore();
    };

    this.contains = function(x,y) {
        return this.x - this.size <= x && this.x + this.size >= x
                    && this.y - this.size <= y && this.y + this.size >= y;
    };

    this.moveTo = function(x,y) {
    	this.x = x;
        this.y = y;
        dl.redraw();
    };

    this.setSize = function(size) {
    	this.size = size;
        dl.redraw();
    }

    return this.Star;
};
