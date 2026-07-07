// BEKA — schematic pulse animation + footer year
(function () {
  document.getElementById("year").textContent = new Date().getFullYear();

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  var svg = document.getElementById("schematic");
  if (!svg) return;

  var wires = Array.prototype.slice.call(svg.querySelectorAll(".wire"));
  var pulses = Array.prototype.slice.call(svg.querySelectorAll(".pulse"));
  if (!wires.length || !pulses.length) return;

  var DURATION = 1600; // ms for a pulse to travel one wire

  function launch(pulse, startTime) {
    var wire = wires[Math.floor(Math.random() * wires.length)];
    var len = wire.getTotalLength();

    function frame(now) {
      var t = (now - startTime) / DURATION;
      if (t >= 1) {
        pulse.style.opacity = "0";
        // brief random rest, then relaunch on a new wire
        setTimeout(function () {
          launch(pulse, performance.now());
        }, 300 + Math.random() * 1200);
        return;
      }
      var p = wire.getPointAtLength(t * len);
      pulse.setAttribute("cx", p.x);
      pulse.setAttribute("cy", p.y);
      // ease opacity in/out at the ends of the run
      var fade = Math.min(1, t * 6, (1 - t) * 6);
      pulse.style.opacity = String(0.9 * fade);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // stagger the three pulses after the draw-in animation settles
  pulses.forEach(function (pulse, i) {
    setTimeout(function () {
      launch(pulse, performance.now());
    }, 1400 + i * 600);
  });
})();
