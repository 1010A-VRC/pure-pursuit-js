const debug_path = new Object();


/**
 * Canvas DOM setup
 */
const canvas = document.getElementById("c");
const danvas = document.getElementById("d");
const danvas2 = document.getElementById("d");
const leftVelC = document.getElementById("l");
const rightVelC = document.getElementById("r");
const leftVelCL = document.getElementById("leftVelGraphLabel");
const rightVelCL = document.getElementById("rightVelGraphLabel");
const buttonContainer = document.getElementById("buttonContainer");
const c = canvas.getContext("2d");
const d2 = danvas.getContext("2d");
const d3 = danvas2.getContext("2d");
const lC = leftVelC.getContext("2d");
const rC = rightVelC.getContext("2d");

const field = new Image();
field.src = './images/field.png';

var slider1_div = document.getElementById('slider1');
var slider2_div = document.getElementById('slider2');
var slider3_div = document.getElementById('slider3');
var slider4_div = document.getElementById('slider4');
var slider5_div = document.getElementById('slider5');
var slider6_div = document.getElementById('slider6');
var slider7_div = document.getElementById('slider7');
var slider8_div = document.getElementById('slider8');
var slider9_div = document.getElementById('slider9');

const slider1_val_d = document.getElementById('slider1_val');
const slider2_val_d = document.getElementById('slider2_val');
const slider3_val_d = document.getElementById('slider3_val');
const slider4_val_d = document.getElementById('slider4_val');
const slider5_val_d = document.getElementById('slider5_val');
const slider6_val_d = document.getElementById('slider6_val');
const slider7_val_d = document.getElementById('slider7_val');
const slider8_val_d = document.getElementById('slider8_val');
const slider9_val_d = document.getElementById('slider9_val');

const slider1_label_d = document.getElementById('slider1_label');
const slider2_label_d = document.getElementById('slider2_label');
const slider3_label_d = document.getElementById('slider3_label');
const slider4_label_d = document.getElementById('slider4_label');
const slider5_label_d = document.getElementById('slider5_label');
const slider6_label_d = document.getElementById('slider6_label');
const slider7_label_d = document.getElementById('slider7_label');
const slider8_label_d = document.getElementById('slider8_label');
const slider9_label_d = document.getElementById('slider9_label');

const kv_label = document.getElementById('kv_label');
const kv_val = document.getElementById('kv_val');
const ka_label = document.getElementById('ka_label');
const ka_val = document.getElementById('ka_val');
const kp_label = document.getElementById('kp_label');
const kp_val = document.getElementById('kp_val');

var tooltip = document.getElementById('tooltip-span');
var slider_container = document.getElementById('sliderContainerDiv');

canvas.addEventListener("mousedown", click);
canvas.addEventListener("mousemove", move);
canvas.addEventListener("mouseup", end);
canvas.addEventListener("contextmenu", right);
window.addEventListener("keydown", keydown);
window.addEventListener("keyup", keyup);
$(window).bind('mousewheel DOMMouseScroll', zoom);
window.focus();


//////////////////////////////////
// Canvas Constants and Globals //
//////////////////////////////////
let canvasScale = 6.215; //ratio between simulated position and canvas position
const marginOffset = 9; //correction for canvas choords vs window choords. related to margin

const waypointWidth = 4;
const pointWidth = 2;

let sliders = {resolution: 0, scalar: 0, lookahead: 0, turnD: 0, maxDecel: 0, maxAccel: 0, kV: 0, kA: 0, kP: 0};
let bottom_style1;
let bottom_style2;
let bottom_style3;
let bottom_style4;
let bottom_style5;
let bottom_style6;
let bottom_style7;
let bottom_style8;
let left_style;













document.querySelector("#read-button").addEventListener('click', function() {
	if(document.querySelector("#file-input").files.length == 0) {
		alert('Error : No file selected');
		return;
	}

	// file selected by user
	let file = document.querySelector("#file-input").files[0];

  // new FileReader object
	let reader = new FileReader();

	// event fired when file reading finished
	reader.addEventListener('load', function(e) {
	   // contents of the file
	    let text = e.target.result;
      var inputArray = text.split('\n');

      // save all the points on the path
      for (var i = 0; i < inputArray.length-1; i++) {
        var inputArrayFiltered = inputArray[i].split(", ");
        if (inputArrayFiltered.length == 5) {
          var firstInputArrayFiltered = inputArray[0].split(", ");
          debug_path['lookahead'] = firstInputArrayFiltered[0];
					debug_path['maxspeed'] = firstInputArrayFiltered[1];
					debug_path['kv'] = firstInputArrayFiltered[2];
					debug_path['ka'] = firstInputArrayFiltered[3];
					debug_path['kp'] = firstInputArrayFiltered[4]/*.slice(0, firstInputArrayFiltered[4].length - 1)*/;
          debug_path['path_points'] = [];
          debug_path['timestamp'] = [];
					kv_val.innerHTML = debug_path['kv'];
					ka_val.innerHTML = debug_path['ka'];
					kp_val.innerHTML = debug_path['kp'];
        } else if (inputArrayFiltered.length == 3) {
          debug_path['path_points'][i-1] = {};
          debug_path['path_points'][i-1]['x'] = inputArrayFiltered[0];
          debug_path['path_points'][i-1]['y'] = inputArrayFiltered[1];
          debug_path['path_points'][i-1]['vel'] = inputArrayFiltered[2].slice(0, inputArrayFiltered[2].length - 1);
        } else {
          // format: timestamp, robotx, roboty, roboth lookaheadx, lookaheady, curvature, leftvel, leftactualvel, rightvel, rightactualvel
          debug_path['timestamp'][debug_path['timestamp'].length] = {};
          debug_path['timestamp'][debug_path['timestamp'].length-1]['timestamp'] = inputArrayFiltered[0];
          debug_path['timestamp'][debug_path['timestamp'].length-1]['robotx'] = inputArrayFiltered[1];
          debug_path['timestamp'][debug_path['timestamp'].length-1]['roboty'] = inputArrayFiltered[2];
					debug_path['timestamp'][debug_path['timestamp'].length-1]['roboth'] = inputArrayFiltered[3]
          debug_path['timestamp'][debug_path['timestamp'].length-1]['lookaheadx'] = inputArrayFiltered[4];
          debug_path['timestamp'][debug_path['timestamp'].length-1]['lookaheady'] = inputArrayFiltered[5];
          debug_path['timestamp'][debug_path['timestamp'].length-1]['curvature'] = inputArrayFiltered[6];
					debug_path['timestamp'][debug_path['timestamp'].length-1]['leftvel'] = inputArrayFiltered[7];
					debug_path['timestamp'][debug_path['timestamp'].length-1]['leftactualvel'] = inputArrayFiltered[8];
					debug_path['timestamp'][debug_path['timestamp'].length-1]['rightvel'] = inputArrayFiltered[9];
					debug_path['timestamp'][debug_path['timestamp'].length-1]['rightactualvel'] = inputArrayFiltered[10]/*.slice(0, inputArrayFiltered[10].length - 1)*/;
        }
      }

	});

	// read file as text file
	reader.readAsText(file);
});













var update_left_vel = true;

var prev_window_innerwidth = -1;
var prev_window_innerheight = -1;


///////////////////////
// Utility Functions //
///////////////////////
function maintainCanvas() {
  if (window.innerWidth < window.innerHeight) {
		// maintain height
    canvas.height = window.innerWidth - marginOffset * 2;
    danvas.height = window.innerWidth - marginOffset * 2;
		if (window.innerWidth != prev_window_innerwidth || window.innerHeight != prev_window_innerheight) {
			leftVelC.height = window.innerWidth/4;
			rightVelC.height = window.innerWidth/4;
			leftVelC.width = leftVelC.height*1.3;
			rightVelC.width = rightVelC.height*1.3;
		}

		// maintain width
    canvas.width = canvas.height;
    danvas.width = canvas.height;


  } else {
		// maintain height
    canvas.height = window.innerHeight - marginOffset * 2;
    danvas.height = window.innerHeight - marginOffset * 2;

		// maintain width
    canvas.width = canvas.height;
    danvas.width = canvas.height;
		if (window.innerWidth != prev_window_innerwidth || window.innerHeight != prev_window_innerheight) {
			leftVelC.height = window.innerHeight/2.5;
			rightVelC.height = window.innerHeight/2.5;
			leftVelC.width = window.innerWidth/3;
			rightVelC.width = window.innerWidth/3;
		}
  }
	//leftVelC.style.top = (canvas.height*1.2).toString().concat("px");

	if (window.innerWidth != prev_window_innerwidth || window.innerHeight != prev_window_innerheight) {
		rightVelC.style.top = (canvas.height/7).toString().concat("px");
		rightVelC.style.right = (10).toString().concat("px");
		rightVelCL.style.top = (canvas.height/7).toString().concat("px");
		rightVelCL.style.right = (rightVelC.width + 20).toString().concat("px");
		leftVelC.style.top = (canvas.height/7 + rightVelC.height + 20).toString().concat("px");
		leftVelC.style.right = (10).toString().concat("px");
		leftVelCL.style.top = (canvas.height/7 + rightVelC.height + 20).toString().concat("px");
		leftVelCL.style.right = (leftVelC.width + 20).toString().concat("px");
	}
//	rightVelC.style.position =

	// update previous window height and width
	prev_window_innerwidth = window.innerWidth;
	prev_window_innerheight = window.innerHeight;

  canvasScale = (canvas.height * 6.215)/871;

  c.lineWidth = 1;

  /* slider value calculations */
  sliders.resolution = slider1.value / 1; // this seems to be the value for how many points there are on the path. This is for the first slider
  slider1_val.innerHTML = sliders.resolution;

  sliders.scalar = slider2.value / 500; // this seems to be the value for how curvy the path is
  slider2_val.innerHTML = sliders.scalar;

  sliders.lookahead = slider3.value / 1000; // this seems to be the value for the lookahead point
  slider3_val.innerHTML = sliders.lookahead;

  sliders.turnD = slider4.value / 10; // this is the value for turnKD
  slider4_val.innerHTML = sliders.turnD;
  turnK = sliders.turnD;

  sliders.maxDecel = slider5.value /100; // this is the value for turnKD
  slider5_val.innerHTML = sliders.maxDecel;
  maxAccel = sliders.maxDecel;

  sliders.maxAccel = slider6.value; // this is the value for turnKD
  slider6_val.innerHTML = sliders.maxAccel;
  maxAccel2 = sliders.maxAccel;

	sliders.kV = slider7.value / 10000; // this is the value for KV
	slider7_val.innerHTML = sliders.kV;

	sliders.kA = slider8.value / 10000; // this is the value for KA
	slider8_val.innerHTML = sliders.kA;

	sliders.kP = slider9.value / 10000; // this is the value for KP
	slider9_val.innerHTML = sliders.kP;


  left_style = ("%d", canvas.width + 20 + "px");
  slider_container.style.left = left_style;

  c.drawImage(field, 0, 0, canvas.height, canvas.width);
  d2.drawImage(field, 0, 0, danvas.height, danvas.width);

  if (showRect) {
    c.beginPath(); // i think this is part of a library of some sort: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/beginPath
    c.lineWidth = "2";
    c.strokeStyle = "#000";
    c.rect(rectangle[0].x, rectangle[0].y, rectangle[1].x - rectangle[0].x, rectangle[1].y - rectangle[0].y);
    c.stroke();
  }



	// draw the graphs
	if (typeof debug_path['path_points'] !== 'undefined') {
		if (update_left_vel == true) {
			lC.translate(0, leftVelC.height);
			rC.translate(0, leftVelC.height);
			for (var debug_index = 1; debug_index < debug_path['timestamp'].length; debug_index++) {
				var lCHeightScale = leftVelC.height/debug_path['maxspeed'];
				var lCWidthScale = leftVelC.width/debug_path['timestamp'].length;
				// draw the target left velocity
				lC.beginPath();
				lC.moveTo((debug_index-1)*lCWidthScale, -debug_path['timestamp'][debug_index-1]['leftvel']*lCHeightScale);
				lC.lineTo(debug_index*lCWidthScale, -debug_path['timestamp'][debug_index]['leftvel']*lCHeightScale);
				lC.strokeStyle = "blue";
				lC.stroke();
				lC.closePath();
				// draw the actual left velocity
				lC.beginPath();
				lC.moveTo((debug_index-1)*lCWidthScale, -debug_path['timestamp'][debug_index-1]['leftactualvel']*lCHeightScale);
				lC.lineTo(debug_index*lCWidthScale, -debug_path['timestamp'][debug_index]['leftactualvel']*lCHeightScale);
				lC.strokeStyle = "yellow";
				lC.stroke();
				lC.closePath();
				// draw the target right velocity
				rC.beginPath();
				rC.moveTo((debug_index-1)*lCWidthScale, -debug_path['timestamp'][debug_index-1]['rightvel']*lCHeightScale);
				rC.lineTo(debug_index*lCWidthScale, -debug_path['timestamp'][debug_index]['rightvel']*lCHeightScale);
				rC.strokeStyle = "blue";
				rC.stroke();
				rC.closePath();
				// draw the actual right velocity
				rC.beginPath();
				rC.moveTo((debug_index-1)*lCWidthScale, -debug_path['timestamp'][debug_index-1]['rightactualvel']*lCHeightScale);
				rC.lineTo(debug_index*lCWidthScale, -debug_path['timestamp'][debug_index]['rightactualvel']*lCHeightScale);
				rC.strokeStyle = "yellow";
				rC.stroke();
				rC.closePath();
			}
			update_left_vel = false;
		}
	}





  // danvas stuff over here
  // set the zero point to the bottom left of the canvas
  d2.translate(0, danvas.height);

  //d2.moveTo(0, 0);
  //d2.lineTo(200, -500);
  //d2.stroke();

  // draw the path

  if (typeof debug_path['path_points'] !== 'undefined') {
    d2.fillStyle = "red";
    d2.beginPath();
    d2.arc(debug_path['path_points'][0]['x']*canvasScale, -(debug_path['path_points'][0]['y']*canvasScale), 0.5*canvasScale, 0, Math.PI*2);
    d2.closePath();
    d2.fill();
    d2.stroke();


    for (var i = 1; i < debug_path['path_points'].length; i++) {
      d2.beginPath();
      d2.moveTo(debug_path['path_points'][i-1]['x']*canvasScale, -(debug_path['path_points'][i-1]['y']*canvasScale)); // debug_path['path_points'][i-1]['x']*canvasScale, danvas.height - (debug_path['path_points'][i-1]['y']*canvasScale)
      d2.lineTo(debug_path['path_points'][i]['x']*canvasScale, -(debug_path['path_points'][i]['y']*canvasScale)); //
      d2.stroke();
      d2.closePath();
      d2.beginPath();
      d2.arc(debug_path['path_points'][i]['x']*canvasScale, -(debug_path['path_points'][i]['y']*canvasScale), 0.5*canvasScale, 0, Math.PI*2);
      d2.closePath();
      d2.fill();
      d2.stroke();

    }
  }





}

/**
 * Turn percentage into RGB range from yellow to red
 * @param  {Number} perc value between min and max
 * @param  {Number} min
 * @param  {Number} max
 * @return {String} RGB hex code
 */
function perc2color(perc, min, max) {
  let base = max - min;
  if (base == 0) {
    perc = 0;
  } else {
    perc = (perc - min) / base * 100;
  }
  let r, g, b = 0;
  if (perc < 50) {
    r = 255;
    g = Math.round(5.1 * perc);
  } else {
    g = 255;
    r = Math.round(510 - 5.10 * perc);
  }
  let h = r * 0x10000 + g * 0x100 + b * 0x1;
  return '#' + ('000000' + h.toString(16)).slice(-6);
}

/**
 * Turn percentage into RGB range rainbow
 * @param  {Number} perc value between min and max
 * @param  {Number} min
 * @param  {Number} max
 * @return {String} RGB hex code
 */
function perc2multcolor(perc, min, max) {
  let base = max - min;
  if (base == 0) {
    perc = 0;
  } else {
    perc = (perc - min) / base * 100;
  }
  let r, g, b = 0;
  if (perc >= 0 && perc <= 20) {
    r = 255;
    g = Math.round(12.75 * perc);
    b = 0;
  } else if (perc > 20 && perc <= 40) {
    r = Math.round(-12.75 * perc + 510);
    g = 255;
    b = 0;
  } else if (perc > 40 && perc <= 60) {
    r = 0;
    g = 255;
    b = Math.round(12.75 * perc) - 510;
  } else if (perc > 60 && perc <= 80) {
    r = 0;
    g = Math.round(-12.75 * perc + 1020);
    b = 255;
  } else {
    r = Math.round(12.75 * perc - 1020);
    g = 0;
    b = 255;
  }
  let h = r * 0x10000 + g * 0x100 + b * 0x1;
  return '#' + ('000000' + h.toString(16)).slice(-6);
}

/**
 * gets a value from an variable nested in an array such as the min curvature
 * @param  {Array} Array
 * @param  {Function} compare min or max
 * @param  {Function} get     get nested element
 * @return {Number}           get final value
 */
function getAttr(array, compare, get) {
  return array.reduce((a, b) => {
    return compare(a, get(b));
  }, get(array[0]));
}

//////////////////////
// Canvas Functions //
//////////////////////

/**
 * Scales coordenates from simulation coordenates to canvas coordenates
 */
function localToCanvas(point) {
  return { x: point.x * canvasScale, y: canvas.height - (point.y * canvasScale)};
}
/**
 * Scales coordenates from canvas coordenates to simulation coordenates
 */
function canvasToLocal(point) {
  return { x: point.x / canvasScale, y: (canvas.height - point.y) / canvasScale};
}

/**
 * Draws a line from origin to point, then draws a point
 */
function drawLineToPoint(origin, point, width) {
  c.beginPath();
  c.arc(point.x, point.y, width, 0, Math.PI * 2);
  c.closePath();
  c.fill();
  c.beginPath();
  c.moveTo(origin.x, origin.y);
  c.lineTo(point.x, point.y);
  c.closePath();
  c.stroke();
}

/**
 * Draws array of points
 */
function drawWaypoints(points) {
  c.fillStyle = "#ff7f00";
  points.forEach((node, i) => {
    let cPoint = localToCanvas(node);
    c.beginPath();
    c.arc(cPoint.x, cPoint.y, waypointWidth, 0, Math.PI * 2);
    c.closePath();
    c.fill();
  });
}

let fullMin = Infinity;
let fullMax = 0;

//ommit min and max OR min = false : iterative min and max calculation
//min = true : historical min and max calculation
//min + max = number  : static min and max
function drawPath(path, colorGet, min, max) {

  //curvature color calculations
  if(min === true) {
    fullMin = Math.min(fullMin, getAttr(path, Math.min, colorGet));
    fullMax = Math.max(fullMax, getAttr(path, Math.max, colorGet));
  } else if (min === undefined || min === false) {
    //if min is not provided or is false
    fullMin = getAttr(path, Math.min, colorGet);
    fullMax = getAttr(path, Math.max, colorGet);
  } else {
    fullMin = min;
    fullMax = max;
  }
  c.lineWidth = "2";
  path.forEach((node, i) => {
   let canvasX = node.x() * canvasScale;
   let canvasY = node.y() * canvasScale;
   let style = perc2multcolor(colorGet(node), fullMin, fullMax);
   c.fillStyle = style;
   c.strokeStyle = style;
    //draw points
    c.beginPath();
    if(nodeIndex == i) {
      c.arc(canvasX, canvas.height - canvasY, pointWidth * 2, 0, Math.PI * 2);
    } else {
      c.arc(canvasX, canvas.height - canvasY, pointWidth, 0, Math.PI * 2);
    }
    c.closePath();
    c.fill();
    //draw lines
    if (i < path.length - 1) {
      let lastX = path[i + 1].x() * canvasScale;
      let lastY = path[i + 1].y() * canvasScale;
      c.beginPath();
      c.moveTo(canvasX, canvas.height - canvasY);
      c.lineTo(lastX, canvas.height - lastY);
      c.closePath();
      c.stroke();
    }
  });
}


function drawLookahead(currPos, lookahead, lookaheadDist, projectedLookahead) {
  c.fillStyle = "#ff0087";
  c.strokeStyle = "#ff0087";
  c.lineWidth = "3";
  drawLineToPoint(currPos, localToCanvas(lookahead), 5);
  c.fillStyle = "#fff";
  c.strokeStyle = "#fff";
  c.lineWidth = "1";
  drawLineToPoint(currPos, localToCanvas(projectedLookahead), 4);
  c.lineWidth = "1";
  c.beginPath();
  c.arc(currPos.x, currPos.y, lookaheadDist * canvasScale, 0, Math.PI * 2);
  c.closePath();
  c.stroke();
}

function drawClosest(currPos, closest) {
  c.fillStyle = "#2b00ba";
  c.strokeStyle = "#2b00ba";
  drawLineToPoint(currPos, localToCanvas(closest), 3);
}

function drawCurvature(curvature, p1, p2) {
  c.lineWidth = "0.5";
  c.strokeStyle = "#fff"
  if(Math.abs(curvature) < 0.005)
    curvature = 0.005;// * sgn(curvature);

  let radius = Math.abs(1/curvature);

  let x3 = (p1.x + p2.x) / 2;
  let y3 = (p1.y + p2.y) / 2;
  let q = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

  let b = Math.sqrt(Math.pow(radius, 2) - Math.pow(q / 2, 2));
  let x = x3 - b * (p1.y - p2.y)/q * sgn(curvature);
  let y = y3 - b * (p2.x - p1.x)/q * sgn(curvature);

  let canvasPoint = localToCanvas({ x: x, y: y});

  c.beginPath();
  c.arc(canvasPoint.x, canvasPoint.y, Math.abs(1/curvature*canvasScale), 0, Math.PI * 2);
  c.closePath();
  c.stroke();
}


////////////////////////
// Canvas Interaction //
////////////////////////
let showRect = false;
let rectangle = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
let deleteIndexes = [];

let hovering = false;
let dragging = false;
let dragIndex = -1;
let lastCoord = { x: 0, y: 0 };

let nodeIndex = -1;


function canvasEventToLocalCoord(e) {
  let screenX = e.clientX - marginOffset;
  let screenY = e.clientY - marginOffset;
  return canvasToLocal({ x: screenX, y: screenY });
}


function click(e) {
  window.focus();
  lastCoord = canvasEventToLocalCoord(e);
  //left click
  if (e.button == 0) {
    if (e.ctrlKey) {
      dragIndex = -2;
    } else if(nodeIndex != -1 && !hovering) {
      points.splice(path[nodeIndex].segmentIndex + 1, 0, new WayPoint(lastCoord.x, lastCoord.y, 1));
      move(e);
    } else if (!hovering) {
      points.push(new WayPoint(lastCoord.x, lastCoord.y, 1));
      // dragging = true;
      move(e);
    }
    dragging = true;
  } else if (e.button == 2) { //right click
    if (e.ctrlKey) {
      bots.push(new PurePursuit(lastCoord));
    } else if (hovering) {
      points.splice(dragIndex, 1);
      move(e);
    } else {
      dragIndex = -3;
      dragging = true;
    }
  }
}

function move(e) {
  e.preventDefault();

  /* waypoint interaction */
  if (!dragging) {
    lastCoord = canvasEventToLocalCoord(e);
    dragIndex = points.findIndex(function (node) {
      return lastCoord.x >= node.x - waypointWidth / canvasScale
      && lastCoord.x <= node.x + waypointWidth / canvasScale
      && lastCoord.y >= node.y - waypointWidth / canvasScale
      && lastCoord.y <= node.y + waypointWidth / canvasScale;
    });

    if (e.ctrlKey) {
      document.body.style.cursor = "move";
    } else if (dragIndex == -1) {
      document.body.style.cursor = "auto";
      hovering = false;
    } else {
      document.body.style.cursor = "pointer";
      hovering = true;
    }
    showRect = false;
  } else if (dragIndex == -2) {
    document.body.style.cursor = "move";
    let newCoord = canvasEventToLocalCoord(e);
    let offsetX = newCoord.x - lastCoord.x;
    let offsetY = newCoord.y - lastCoord.y;
    lastCoord = newCoord;
    points.forEach((node, i) => {
      node.x += offsetX;
      node.y += offsetY;
    });
  } else if (dragIndex == -3) {
    showRect = true;
    let goal = canvasEventToLocalCoord(e);
    rectangle[0] = localToCanvas(lastCoord);
    rectangle[1] = localToCanvas(goal);
    deleteIndexes = [];
    points.forEach(function (node, i) {
      let orginX = Math.min(lastCoord.x, goal.x);
      let orginY = Math.min(lastCoord.y, goal.y);
      let goalX = Math.max(lastCoord.x, goal.x);
      let goalY = Math.max(lastCoord.y, goal.y);
      if (goalX >= node.x
        && orginX <= node.x
        && goalY >= node.y
        && orginY <= node.y) {
        deleteIndexes.push(i);
    }
  });
  } else {
    lastCoord = canvasEventToLocalCoord(e);
    points[dragIndex].x = lastCoord.x;
    points[dragIndex].y = lastCoord.y;
  }


  /* node interaction */
  nodeIndex = path.findIndex(function (node) {
    return lastCoord.x >= node.x() - waypointWidth * 2 / canvasScale
    && lastCoord.x <= node.x() + waypointWidth * 2 / canvasScale
    && lastCoord.y >= node.y() - waypointWidth * 2 / canvasScale
    && lastCoord.y <= node.y() + waypointWidth * 2 / canvasScale;
  });
  if (nodeIndex == -1) {
    tooltip.style.opacity = "0";
  } else {
    tooltip.style.opacity = "1";
    tooltip.style.left = e.clientX + marginOffset + 'px';
    tooltip.style.top = e.clientY - marginOffset + 'px';

    tooltip.innerHTML =
    "curvature: " + path[nodeIndex].curvature.toFixed(4) +
    "\nvelocity: " + path[nodeIndex].velocity.toFixed(4);
  }
}

function end(e) {
  if (dragIndex == -3) {
    deleteIndexes.forEach(function (node) {
      points.splice(node, 1);
      deleteIndexes.forEach(function (val, i) {
        if (node <= val) deleteIndexes[i]--;
      });
    });
    deleteIndexes = [];
  }
  dragging = false;
  dragIndex = -1;
  move(e);
}

function right(e) {
  e.preventDefault();
}

let key = false;
function keydown(e) {
  if (e.code != "ControlLeft") return;
  if (!key && !dragging) {
    key = true;
    document.body.style.cursor = "move";
  }
}

function keyup(e) {
  if (e.code != "ControlLeft") return;
  key = false;
  if (dragIndex == -1 || dragIndex == -3) {
    document.body.style.cursor = "auto";
    hovering = false;
  } else if (dragIndex != -2) {
    document.body.style.cursor = "pointer";
    hovering = true;
  }
}



let scrollRatio = 5;

function zoom(e) {
  if (e.ctrlKey) {
    e.preventDefault();
    if (e.originalEvent.detail > 0) {
      canvasScale -= scrollRatio;
    } else {
      canvasScale += scrollRatio;
    }
  } else if (hovering) {
    e.preventDefault();
    points[dragIndex].theta += 0.2 * sgn(e.originalEvent.detail);
  }
}

/* zooming the points result in the smoothing being affected
let scrollRatio = 0.05;

function zoom(e) {
  if (e.ctrlKey) {
    e.preventDefault();
    if (e.originalEvent.detail > 0) {
      points.forEach((node, i) => {
        node.x += (lastCoord.x - node.x) * scrollRatio;
        node.y += (lastCoord.y - node.y) * scrollRatio;
      });
    } else {
      points.forEach((node, i) => {
        node.x -= (lastCoord.x - node.x) * scrollRatio;
        node.y -= (lastCoord.y - node.y) * scrollRatio;
      });
    }
  }
}
*/
