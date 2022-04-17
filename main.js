
/**
 * Pursuit Constants
 */
let minVel = 2;
let maxVel = 100;
let maxAccel = 1000;
let maxAccel2 = 100; // max increase in inches/s/s
let turnK = 20;

/**
 * Starting points
 */
let points = [];
let bots = [];
let path = [];



function save(filename) {
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



function main() {

  // create a button which downloads a file with the info
  let btn = document.createElement("button");
  btn.onclick = function () {
    save("path.txt", path);
  };
  btn.innerHTML = "output line points and their velocities";
  document.body.appendChild(btn);

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
    bot.setRobotTrack(1/12.8);

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
