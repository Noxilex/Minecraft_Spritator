let canvasFrom = document.querySelector("#fromImage");
let canvasTo = document.querySelector("#toImage");
let ctxFrom = canvasFrom.getContext("2d");
let ctxTo = canvasTo.getContext("2d");
let pixels;

setup();

function setup() {
	console.log("setup");
	//Set dimensions for canvas
	canvasFrom.width = 512;
	canvasFrom.height = 512;
	canvasTo.width = 512;
	canvasTo.height = 512;
}

function loadImageFromFile(input) {
	loadImage(URL.createObjectURL(input.files[0]), image => {
		ctxFrom.drawImage(image, 0, 0, canvasFrom.width, canvasFrom.height);
	});
}

function getPixelsFromCanvasCtx(ctx) {
	ctx.getImageData(0, 0);
	return pixels;
}

/**
 * Previews the result of the left canvas to the right canvas
 * depending on dimensions
 */
function preview() {
	//Get the dimension from select
	let select = document.querySelector("#dimensions");
	let dimensions = select.options[select.selectedIndex].value;
	console.log("Dimensions selected:", dimensions);

	//Split image width & height by dimension to get tile size
	let tileW = canvasTo.width / dimensions;
	let tileH = canvasTo.height / dimensions;

	console.log("Tile Size:", tileW, tileH);

    let start = new Date();
	//Iterate over canvasFrom to get pixel data of image for each tile
	for (let h = 0; h < dimensions; h++) {
		for (let w = 0; w < dimensions; w++) {
			let tilePixels = ctxFrom.getImageData(
				tileW * w,
				tileH * h,
				tileW,
				tileH
            );
            
            let color = getMeanColorOfPixels(tilePixels.data);
            ctxTo.fillStyle = "rgba("+color.r+","+color.g+","+color.b+","+color.a+")";
            ctxTo.fillRect(w*tileW, h*tileH, tileW, tileH);
		}
    }
    let endColorDraw = new Date();

    console.log("Start", start);
    console.log("color draw", (endColorDraw-start)/1000)+"sec";

}

function getMeanColorOfPixels(pixels) {
    let color = {
        r:0,
        g:0,
        b:0,
        a:0
    };
    let nbColor = 0;
	for (let i = 0; i < pixels.length; i++) {
		//0 red, 1 vert, 2 blue, 3 alpha
		let current_comp = pixels[i];
		let pixelColor = i % 4;
		switch (pixelColor) {
			case 0:
				color.r += current_comp;
				break;
			case 1:
				color.g += current_comp;
				break;
			case 2:
				color.b += current_comp;
				break;
			case 3:
				color.a += current_comp;
				nbColor++;
				break;
			default:
                console.error("Not a pixel color component");
				break;
		}
    }
    return {
        r:Math.floor(color.r/nbColor),
        g:Math.floor(color.g/nbColor),
        b:Math.floor(color.b/nbColor),
        a:Math.floor((color.a/nbColor)/255)
    };
}

function loadImage(src, callback) {
	let img = document.createElement("img");
	img.onload = () => {
		callback(img);
	};
	img.src = src;
}
