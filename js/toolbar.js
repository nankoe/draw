/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
" use strict";
(function() {
    var canvas = document.getElementById("mainCanvas");
    var brushColor = document.getElementById("brushColor");
    var colorText = document.getElementById("colorText");
    var brushType = document.getElementById("brushType");
    var toolbar = document.getElementById("toolbar");
    
    canvas.addEventListener("mousemove",updateMouse,false);
    canvas.addEventListener("mouseout",clearMouse,false);
    brushColor.addEventListener("change",updateColor,false);
    brushType.addEventListener("change",changeType,false);
    
    
    function transformEvent(event) {
        var x = event.pageX - canvas.offsetLeft;
        var y = event.pageY - toolbar.clientHeight - 1;
        return {"x":x,"y":y,"event":event};
    }
 
    function updateMouse(event) {
        var ev = transformEvent(event);
        mousePosition.innerHTML = "X:" + ev.x + " | Y:"+ ev.y;
        mousePositionXS.innerHTML = "X:" + ev.x + " | Y:"+ ev.y;               
    }

    function clearMouse(event) {
        mousePosition.innerHTML = "X:? | Y:?";
        mousePositionXS.innerHTML =  "X:? | Y:?";
    }

    function updateColor() {
        colorText.innerHTML = brushColor.value;
        return false;
    }
    
    function changeType() {
        if(brushType.value === "delete") {
            brushColor.disabled = true;
            colorText.innerHTML = "N/A";
        }
        else {
            brushColor.disabled = false;
            colorText.innerHTML = brushColor.value;
        }
    }

    updateColor("#000000");
})();