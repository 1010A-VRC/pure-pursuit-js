
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





function save_user_data(filename) {
    let out = "";

    out += ("lookahead: " + sliders.lookahead + ", acceleration: " + maxAccel2 + "\n")

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

    out += ("" + sliders.lookahead + ", " + maxAccel2 + "\n")

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
    d.style.display = "block";
    debug = true;
  } else {
    d.style.display = "none";
    c2.style.display = "block";
    slider_contain.style.display = "flex";
    debug = false;
  }

};












































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

	    document.querySelector("#file-contents").textContent = text;
	});

	// event fired when file reading failed
	reader.addEventListener('error', function() {
	    alert('Error : Failed to read file');
	});

	// read file as text file
	reader.readAsText(file);
});









function main() {



  // set the background color
  document.body.style.backgroundColor = "gray";

  // i dont know about these things...1
  maintainCanvas();

  points.push(new WayPoint(1, 1, Math.PI/2), new WayPoint(4, 4, Math.PI/2), new WayPoint(6, 2, 2*Math.PI/2)); // this draws the default path. Every new waypoint is one of the waypoints displayed at the start
  bots.push(new PurePursuit(new Vector(1, 1))); // this creates the robot you see at the start of the program

  animate();
}


function animate() {

  maintainCanvas(); // deleting this seems to stop the program from deleting stuff it was supposed to delete

  let ipoints = calculateAngles(points);
  let test = new QuinticPathPlanner(ipoints, sliders.resolution, sliders.scalar);
  path = test.getPath();

  /**
   * Pure Pursuit Algorithm
   */

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
