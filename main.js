
/**
 * Pursuit Constants
 */
let minVel = 20;
let maxVel = 40;
let maxAccel = 1000;
let maxAccel2 = 100; // max increase in inches/s/s
let turnK = 20;

/**
 * Starting points
 */
let points = [];
let bots = [];
let path = [];

let c2 = document.getElementById("c");
let d = document.getElementById("d");
let slider_contain = document.getElementById("sliderContainerDiv");

//const debug_path = new Object();





function save_user_data(filename) {
    let out = "";

    // format: lookahead, maxAccel, kV, kA, kP
    out += ("lookahead: " + sliders.lookahead + ", acceleration: " + maxAccel2 + ", kV: " + sliders.kV + ", kA: " + sliders.kA + ", kP: " + sliders.kP + "\n");

    path.forEach(function (value, index) {
      out += (index + ": (" + value.loc[0] + ", " + value.loc[1] + ", " + value.velocity + ")\n");
    });

    const blob = new Blob([out], {type: 'text/csv'});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(out, filename);
    }
    else{
        const elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}


function save_robot_data(filename) {

    let out = "";

    // format: lookahead, maxAccel, kV, kA, kP
    out += ("" + sliders.lookahead + ", " + maxAccel2 + ", " + sliders.kV + ", " + sliders.kA + ", " + sliders.kP + "\n");

    path.forEach(function (value, index) {
      out += ("" + value.loc[0] + ", " + value.loc[1] + ", " + value.velocity + "\n");
    });

    const blob = new Blob([out], {type: 'text/csv'});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(out, filename);
    }
    else{
        const elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}








// download user data button
var btn = document.getElementById("download_user");
btn.onclick = function () {
  save_user_data("user_path.txt", path);
};

// download robot data
var btn2 = document.getElementById("download_data");
btn2.onclick = function () {
  save_robot_data("robot_path.txt", path);
};


var btn3 = document.getElementById("toggle_mode");
var debug = false;
btn3.onclick = function () {
  if (debug == false) {
    c2.style.display = "none";
    slider_contain.style.display = "none";
    leftVelC.style.display = "block";
    leftVelCL.style.display = "block";
    rightVelC.style.display = "block";
    rightVelCL.style.display = "block";
    d.style.display = "block";
    kv_label.style.display = "inline";
    kv_val.style.display = "inline";
    ka_label.style.display = "inline";
    ka_val.style.display = "inline";
    kp_label.style.display = "inline";
    kp_val.style.display = "inline";
    debug = true;
  } else {
    d.style.display = "none";
    c2.style.display = "block";
    slider_contain.style.display = "flex";
    leftVelC.style.display = "none";
    leftVelCL.style.display = "none";
    rightVelC.style.display = "none";
    rightVelCL.style.display = "none";
    kv_label.style.display = "none";
    kv_val.style.display = "none";
    ka_label.style.display = "none";
    ka_val.style.display = "none";
    kp_label.style.display = "none";
    kp_val.style.display = "none";
    debug = false;
  }

};






















































function main() {



  // set the background color
  document.body.style.backgroundColor = "gray";

  // i dont know about these things...1
  maintainCanvas();

  points.push(new WayPoint(1, 1, Math.PI/2), new WayPoint(4, 4, Math.PI/2), new WayPoint(6, 2, 2*Math.PI/2)); // this draws the default path. Every new waypoint is one of the waypoints displayed at the start
  bots.push(new PurePursuit(new Vector(1, 1))); // this creates the robot you see at the start of the program

  animate();
}




let dx = 2;
let dy = -2;
let x = danvas.width/2;
let y = -danvas.height/2;

let debug_index = 0;



function animate() {

  maintainCanvas(); // deleting this seems to stop the program from deleting stuff it was supposed to delete


  let ipoints = calculateAngles(points);
  let test = new QuinticPathPlanner(ipoints, sliders.resolution, sliders.scalar);
  path = test.getPath();

  /**
   * Pure Pursuit Algorithm
   */


  // drawing code
  if (typeof debug_path['path_points'] !== 'undefined') {
    // draw the robot
    d2.beginPath();
    d2.arc(debug_path['timestamp'][debug_index]['robotx']*canvasScale, -(debug_path['timestamp'][debug_index]['roboty']*canvasScale), (2.5/2)*canvasScale, 0, Math.PI*2);
    d2.fillStyle = "#0095DD";
    d2.fill();
    d2.closePath();
    // draw the lookahead circle
    d2.beginPath();
    d2.strokeStyle = "blue";
    d2.arc(debug_path['timestamp'][debug_index]['robotx']*canvasScale, -(debug_path['timestamp'][debug_index]['roboty']*canvasScale), (debug_path['lookahead']/2)*canvasScale, 0, Math.PI*2);
    d2.stroke();
    d2.closePath();
    // draw the robot line
    var polar_theta = debug_path['timestamp'][debug_index]['roboth'];
    var polar_radius = debug_path['lookahead']*canvasScale;
    d2.beginPath();
    d2.strokeStyle = "red";
    d2.moveTo(debug_path['timestamp'][debug_index]['robotx']*canvasScale, -(debug_path['timestamp'][debug_index]['roboty']*canvasScale));
    d2.lineTo(debug_path['timestamp'][debug_index]['robotx']*canvasScale + polar_radius*Math.cos(polar_theta), -(debug_path['timestamp'][debug_index]['roboty']*canvasScale) + polar_radius*Math.sin(polar_theta));
    d2.stroke();
    d2.closePath();
    // draw the lookahead point
    d2.beginPath();
    d2.fillStyle = "pink";
    d2.arc(debug_path['timestamp'][debug_index]['lookaheadx']*canvasScale, -debug_path['timestamp'][debug_index]['lookaheady']*canvasScale, 1*canvasScale, 0, Math.PI*2);
    d2.fill();
    d2.closePath();
    // draw the curvature arc
    d2.beginPath();
    d2.strokeStyle = "gray";
    // calculate the radius of the circle
    var circle_radius = 1/debug_path['timestamp'][debug_index]['curvature'];
    // if curvature is positive
    if (debug_path['timestamp'][debug_index]['curvature'] > 0) {
      d2.arc(debug_path['timestamp'][debug_index]['robotx']*canvasScale + (circle_radius*canvasScale)*Math.cos(polar_theta+Math.PI/2), -(debug_path['timestamp'][debug_index]['roboty']*canvasScale) + (circle_radius*canvasScale)*Math.sin(polar_theta+Math.PI/2), Math.abs(circle_radius*canvasScale), 0, Math.PI*2);
    } else {
      d2.arc(debug_path['timestamp'][debug_index]['robotx']*canvasScale - (circle_radius*canvasScale)*Math.cos(polar_theta-Math.PI/2), -(debug_path['timestamp'][debug_index]['roboty']*canvasScale) - (circle_radius*canvasScale)*Math.sin(polar_theta-Math.PI/2), Math.abs(circle_radius*canvasScale), 0, Math.PI*2);
    }
    d2.stroke();
    d2.closePath();



    if (debug_index < debug_path['timestamp'].length-1) {
      debug_index++;
    }
  }


  path = computeCurvatures(path);
  path = computeVelocity(path, maxVel, maxAccel, turnK);


  bots.forEach((bot, i) => {
    bot.setPath(path);
    bot.setLookDistance(sliders.lookahead);
    bot.setRobotTrack(0.5);

    bot.update();
    if(bot.isFinished) {
      bots.splice(i, 1);
    }
  });

  /**
   * Canvas Drawing
   */
  drawWaypoints(points); // this draws the waypoints
  drawPath(path, a => a.velocity, minVel, maxVel); // this draws everything on the path

  // debugger;
  requestAnimationFrame(animate);
}



window.onload = main;
