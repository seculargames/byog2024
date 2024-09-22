<script lang="ts">
    import { onMount } from 'svelte';
    import { Button, Modal } from 'flowbite-svelte';

    export let buttonLabel = "";
    export let modalLabel = "";
    export let triad = [];
    export let values = [];

    let colorWheel;
    let p;
    let canvas;
    let canvasClone;
    let hide = false;
    let colorPoints = [];
    let openModal = false;
// from this Stackoverflow answer - https://stackoverflow.com/questions/46214072/color-wheel-picker-canvas-javascript
/**
 * degreesToRadians
 *
 * @param {number} degrees
 * @returns {number}  radians
 */
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}
/**
 * generateColorWheel
 *
 * @param {number} [size=400]
 * @param {string} [centerColor="white"]
 * @returns {HTMLCanvasElement}
 */
function generateColorWheel(size, centerColor) {
    if (size === void 0) { size = 400; }
    if (centerColor === void 0) { centerColor = "white"; }
    //Generate main canvas to return
    //var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = canvas.height = size;
    //Generate canvas clone to draw increments on
    //var canvasClone = document.createElement("canvas");
    canvasClone.width = canvasClone.height = size;
    var canvasCloneCtx = canvasClone.getContext("2d");
    //Initiate variables
    var angle = 0;
    var hexCode = [255, 0, 0];
    var pivotPointer = 0;
    var colorOffsetByDegree = 4.322;
    //For each degree in circle, perform operation
    while (angle++ < 360) {
        //find index immediately before and after our pivot
        var pivotPointerbefore = (pivotPointer + 3 - 1) % 3;
        var pivotPointerAfter = (pivotPointer + 3 + 1) % 3;
        //Modify colors
        if (hexCode[pivotPointer] < 255) {
            //If main points isn't full, add to main pointer
            hexCode[pivotPointer] = (hexCode[pivotPointer] + colorOffsetByDegree > 255 ? 255 : hexCode[pivotPointer] + colorOffsetByDegree);
        }
        else if (hexCode[pivotPointerbefore] > 0) {
            //If color before main isn't zero, subtract
            hexCode[pivotPointerbefore] = (hexCode[pivotPointerbefore] > colorOffsetByDegree ? hexCode[pivotPointerbefore] - colorOffsetByDegree : 0);
        }
        else if (hexCode[pivotPointer] >= 255) {
            //If main color is full, move pivot
            hexCode[pivotPointer] = 255;
            pivotPointer = (pivotPointer + 1) % 3;
        }
        //clear clone
        canvasCloneCtx.clearRect(0, 0, size, size);
        //Generate gradient and set as fillstyle
        var grad = canvasCloneCtx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        grad.addColorStop(0, centerColor);
        grad.addColorStop(1, "rgb(" + hexCode.map(function (h) { return Math.floor(h); }).join(",") + ")");
        canvasCloneCtx.fillStyle = grad;
        //draw full circle with new gradient
        canvasCloneCtx.globalCompositeOperation = "source-over";
        canvasCloneCtx.beginPath();
        canvasCloneCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        canvasCloneCtx.closePath();
        canvasCloneCtx.fill();
        //Switch to "Erase mode"
        canvasCloneCtx.globalCompositeOperation = "destination-out";
        //Carve out the piece of the circle we need for this angle
        canvasCloneCtx.beginPath();
        canvasCloneCtx.arc(size / 2, size / 2, 0, degreesToRadians(angle + 1), degreesToRadians(angle + 1));
        canvasCloneCtx.arc(size / 2, size / 2, size / 2 + 1, degreesToRadians(angle + 1), degreesToRadians(angle + 1));
        canvasCloneCtx.arc(size / 2, size / 2, size / 2 + 1, degreesToRadians(angle + 1), degreesToRadians(angle - 1));
        canvasCloneCtx.arc(size / 2, size / 2, 0, degreesToRadians(angle + 1), degreesToRadians(angle - 1));
        canvasCloneCtx.closePath();
        canvasCloneCtx.fill();
        //Draw carved-put piece on main canvas
        ctx.drawImage(canvasClone, 0, 0);
    }
    const canvasHtml = document.getElementById("canvas");
    for (const i in triad) {
        console.log(triad[i]);
        render_html_to_canvas(`<p class="text-base text-white">${triad[i]}</p>`, ctx, 100, 100, 20, 20);
    }
    //return main canvas
    //return canvas;
}

function render_html_to_canvas(html, ctx, x, y, width, height) {
    var xml = html_to_xml(html);
    xml = xml.replace(/\#/g, '%23');
    var data = "data:image/svg+xml;charset=utf-8,"+'<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'">' +
                        '<foreignObject width="100%" height="100%">' +
                        xml+
                        '</foreignObject>' +
                        '</svg>';

    var img = new Image();
    img.onload = function () {
        ctx.drawImage(img, x, y);
    }
    img.src = data;
}

function html_to_xml(html) {
    var doc = document.implementation.createHTMLDocument('');
    doc.write(html);

    // You must manually set the xmlns if you intend to immediately serialize
    // the HTML document to a string as opposed to appending it to a
    // <foreignObject> in the DOM
    doc.documentElement.setAttribute('xmlns', doc.documentElement.namespaceURI);

    // Get well-formed markup
    html = (new XMLSerializer).serializeToString(doc.body);
    return html;
}

//TEST
//Get color wheel canvas
onMount(async () => {
    console.log("Inside Wheel.svelte's onMount call");
    generateColorWheel(320, 'black');
});

    function handleMessage(evt) {
        //generateColorWheel(320);
    }
//Add color wheel canvas to document
//Add ouput field
/**
 * colorWheelMouse
 *
 * @param {MouseEvent} evt
 */
function colorWheelMouse(evt) {
    var ctx = canvas.getContext("2d");
    var data = ctx.getImageData(evt.offsetX, evt.offsetY, 1, 1);
    //p.innerHTML = "RGB: " + data.data.slice(0, 3).join(',');
    colorPoints = data.data.slice(0, 3);
}
//Bind mouse event

function colorWheelClick(evt) {
    values = colorPoints;
}

</script>

<!-- <Button on:click={toggleHide}>{buttonLabel}</Button> -->
<!--    <Modal color="black" title={modalLabel} bind:open={openModal} on:open={handleMessage} autoclose> -->
<canvas id="canvas" bind:this={canvas} width={320} height={320} on:mousemove={colorWheelMouse} on:click={colorWheelClick} />
<canvas id="clone" bind:this={canvasClone} width={320} height={320} />
<p bind:this={p}>
    {#if colorPoints.length > 0 }
        {#each colorPoints as pt, i }
            <p class="text-base bg-dark text-white">{triad[i]}:{pt}</p>
        {/each}
    {/if}
</p>
<!-- </Modal> -->

<style>
    p {
        color: white;
        background-color: chocolate;
    }

    #clone {
        visibility: hidden;
        display: none;;
    }
</style>
