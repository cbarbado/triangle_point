class Point {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}

	static sub(p1, p2) {
		return new Point(p1.x - p2.x, p1.y - p2.y);
	}

	static cross(p1, p2) {
		return (p1.x * p2.y - p1.y * p2.x);
	}

	draw(context) {
		context.fillRect(point.x, point.y,3,3);
	}
}

class Triangle {
	constructor(vertexes = new Array()) {
		this.vertexes = vertexes;
	}

	addVertex(point) {
		if(3 > this.vertexes.length) {
			this.vertexes.push(point);
			return true;
		}
		return false;
	}

	draw(context) {
		if(3 > this.vertexes.length) {
			this.vertexes.forEach((v) => {
				context.fillRect(v.x, v.y,3,3)
			});
		}
		else {
			context.beginPath();
			context.moveTo(this.vertexes[0].x,this.vertexes[0].y);
			context.lineTo(this.vertexes[1].x,this.vertexes[1].y);
			context.lineTo(this.vertexes[2].x,this.vertexes[2].y);
			context.lineTo(this.vertexes[0].x,this.vertexes[0].y);
			context.closePath();
			context.stroke();
		}
	}

	checkSide(p1, p2, v1, v2) {
		var a1 = Point.sub(v2, v1);
		var a2 = Point.sub(p1, v1);
		var a3 = Point.sub(p2, v2);

		var cp1 = Point.cross(a1, a2);
		var cp2 = Point.cross(a1, a3);

		return (cp1 * cp2 >= 0);
	}
	
	checkPoint(point) {
		return(
			this.checkSide(point,this.vertexes[0], this.vertexes[1], this.vertexes[2]) && // P A B C
			this.checkSide(point,this.vertexes[1], this.vertexes[0], this.vertexes[2]) && // P B A C
			this.checkSide(point,this.vertexes[2], this.vertexes[1], this.vertexes[0])    // P C A B
		);
	}
}

var canvas;
var context;
const canvasWidth  = 800;
const canvasHeight = 600;

var triangle = new Triangle();
var point;

function prepareCanvas()
{
	var canvasDiv = document.getElementById('canvasDiv');
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'canvas');
	canvasDiv.appendChild(canvas);
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}

	context = document.getElementById('canvas').getContext("2d");

	context.strokeStyle = "#ff0000";
	context.fillStyle   = "#000000";
    context.lineWidth   = 1;
	context.font        = "30px Arial";

	$('#canvas').mousedown(function(e)
	{
		var clickPoint = new Point(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
		if(!triangle.addVertex(clickPoint)) {
			point = clickPoint;
		}
		redraw();
  	});
}

function clearCanvas()
{
	triangle.vertexes.length = 0;
	point = null;
	context.clearRect(0, 0, canvasWidth, canvasHeight);
}

function redraw()
{
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  triangle.draw(context);
  
  if(null != point) {
	point.draw(context);
	triangle.checkPoint(point) ? context.fillText("Inside", 10, 50) : context.fillText("Outside", 10, 50);
  }
}