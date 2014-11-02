/*
 * This file contains my definition of a DisplayList class that is used to 
 * manage a collection of interactive graphical objects. A new DisplayList is
 * assigned to the global variable dl, which can be used to reference the main
 * list. 
 * 
 * Before the list can be used it must be setup with your canvas. To do this 
 * simply pass a reference to your canvas into the DisplayList.set() function:
 * 
 * var canvas = document.getElementById("mainCanvas");
 * dl.setup(canvas);
 * 
 * Graphical objects are objects meant to be interactive shapes. The DisplayList
 * assumes that every graphical object has 4 functions:
 * 
 * draw(ctx) - this function takes 1 parameter of a CanvasRenderingContext and 
 *      draws a shape according to the graphical object's properties. The 
 *      DisplayList does NOT save and restore the context between drawing each
 *      graphical object.
 *      
 * contains(x,y) - this function takes 2 parmeters of an x and a y coordinate
 *      and returns true if that (x,y) coordinate lies within the bounds of the
 *      graphical object's shape and false otherwise. For complex shapes it is
 *      ok to assume the shape lies within an invisible square.
 *      
 * moveTo(x,y) - this function takes 2 parameters of an x and a y coordinate 
 *      and moves the graphical object to be centered at the corresponding 
 *      point. This function should also call dl.redraw() once the property
 *      change has been made.
 *      
 * setSize(size) - this function takes 1 parameter of a new size for the
 *      graphical object. The effect of this size change will be different based
 *      on the type of shape. This function should also call dl.redraw() once
 *      the property change as been made.
 *      
 * There should be no reason to edit this file. If you find an error in the code
 * please let me know so I can fix it.
 */
"use strict";
(function () {
    /*
     * This is the class defintion for the DisplayList object.
     */
    var DisplayList = (function () {
        /*
         * A reference to the canvas that the DisplayList will be operating on.
         */
        var can = null;
        
        /*
         * A reference to the canvas's context, this is to prevent having to 
         * call getContext() more than once.
         */
        var ctx = null;
        
        /*
         * This will be the actual list of graphical objects managed by the
         * DisplayList.
         */
        var dl = [];
        
        /*
         * This is the constructor function for display lists. All it does is
         * intiallize the log property to false. If you want to see the 
         * DisplayList log messages to the console when its methods get called
         * then set dl.log = true;
         */
        function DisplayList() {
            this.log = true;
        }
  
        /*
         * This function is used to setup the DisplayList. it must be called 
         * before any of the other functions will work.
         * 
         * DisplayLists need to know about the canvas they are operating on and
         * I didn't want to design it assuming the canvas would have a partiuclar
         * id so it must be provided. All of the DisplayList's other functions
         * will log errors if setup is not called first.
         */
        DisplayList.prototype.setup = function(canvas) {
            can = canvas;
            ctx = canvas.getContext("2d");
            if(this.log) {
               console.log("The display list is setup.");
            }
        };
        
        /*
         * This function adds a graphical object to the DisplayList and then
         * redraws the whole list.
         * 
         * The DisplayList assumes that all graphical objects have the 4 
         * required funntions - draw(), contains(), moveTo(), and setSize() -
         * defined.If you add an object without those 4 functions this function 
         * will log a warnings to the console for each undefined method.
         */
        DisplayList.prototype.addGraphicalObject = function (go) {
            if(this.log) {
                console.log("addGraphicalObject()");
            }    
            if(can) {
                checkObject(go);
                dl.push(go);
                this.redraw();
            }
            else {
                notSetup("addGraphicalObject");
            }
        };
        
        /*
         * This function erases the canvas and then redraws all of the elements
         * currently in the DisplayList. This function will draw objects in the
         * order in which they were inserted in the list. This will make new
         * objects draw on top of old ones as if they were in a physical stack.
         * 
         * This function should be called any time a property of any of the 
         * graphical objects changes. For example, if a graphical object moves, 
         * it will need to be redrawn in it's new location. Or if a graphical 
         * object changes size it will need to be redrawn to reflect it's new 
         * state.
         * 
         * If this function encounters an object in the list that does not have
         * a draw function it will log an error to the console.
         */
        DisplayList.prototype.redraw = function () {
            if(this.log) {
                console.log("redraw()");
            }   
            if(can) {
                ctx.clearRect(0, 0, can.width, can.height);
                for (var i = 0; i < dl.length; i++) {
                    if(dl[i].draw) {
                        dl[i].draw(ctx);
                    }
                    else {
                        console.error("An object in the display list does not have a draw() function.");
                    }
                }
            }
            else {
                notSetup("redraw");
            }
        };
        
        /*
         * This function searches through the list of graphical objects for
         * an object containing the point (x,y). If no object is found it will
         * return null. This function searches the list in reverse order from 
         * redraw, so it will return the first object on top of others, as if 
         * they were physically stacked.
         * 
         * This function works by going through each graphical object and 
         * calling their respective contains() functions. If it encounters an 
         * object without a contains() function it will log an error to the 
         * console.
         */
        DisplayList.prototype.getObjectContaining = function (x,y) {
            if(this.log) {
                console.log("getObjectContaining()");
            }
            if(can) {
                for (var i = dl.length-1; i >= 0; i--) {
                    if(dl[i].contains){
                        if(dl[i].contains(x,y)){
                            if(this.log)console.log("\t found object:"+dl[i].prototype);
                            return dl[i];
                        }
                    }
                    else {
                        console.error("An object in the display list does not have a constains() function.");
                    }
                }
            }
            else {
                notSetup("getObjectContaining");
            }
            if(this.log) console.log("\tno contianing object found.");
            return null;
        };
        
        /*
         * This function is used to remove a graphical object from the 
         * DisplayList and returns the object if it was successfuly removed
         * otherwise it returns null. It also calls redraw() after the 
         * object has been removed.
         */
        DisplayList.prototype.removeGraphicalObject = function(go) {
            if(this.log) {
                console.log("removeGraphicalObject()");
            }
            var dex = dl.indexOf(go);
            if(dex >= 0) {
                var ret = dl.splice(dex,1)[0];
                console.log("\tobject found:"+ret.prototype);
                this.redraw();
                return ret;
            }
            else {
                if(this.log) {
                    console.log("\tobject not found in list.");
                }
                return null;
            }
        };
        
         /*
         * This function checks that a graphical object defines all of the 
         * required functions to be used in the display list and logs warnings
         * for the functions that are missing.
         */
        function checkObject(go) {
            if(!(go.draw)){
                console.warn("A graphical object is being added without a draw function. This object will not work correctly in the DisplayList!");
            }
            if(!(go.contains)) {
                console.warn("A graphical object is being added without a contains function. This object will not work correctly in the DisplayList!");
            }
            if(!(go.moveTo)) {
                console.warn("A graphical object is being added without a moveTo function. This object will not work correctly in the DisplayList!");
            }
            if(!(go.setSize)) {
                console.warn("A graphical object is being added without a setSize function. This object will not work correctly in the DisplayList!");
            }
        }
        
        /*
         * This function just logs an error to the console if the DisplayList
         * is not setup correctly. I only included it to not have to write the
         * error message more than once.
         */
        function notSetup(functionName) {
            console.error("The display list hasn't been setup yet. You need to call the setup() function before you call "+functionName+"()!");
        }
        
        /*
         * This completes the class defintion by returning the function 
         * DisplayList.
         */
        return DisplayList;
    })();
    
    /*
     * This creates a new DisplayList and sets it to the global variable
     * dl. This allows you to access the display list from any other script as
     * a global variable.
     */
    window.dl = new DisplayList();
})();