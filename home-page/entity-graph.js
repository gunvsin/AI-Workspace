// Entity graph — force-directed layout, zero deps.
// Renders typed objects (person / budget / blocker / project / topic)
// and their relations (blocks / funds / owns / works-for).
// Live mode: GET /api/entities -> { nodes, links }.
// Demo mode: built-in sample graph when endpoint unreachable.
(function () {
  "use strict";

  var DEMO_NODES = [
    { id: "user",    label: "You",          kind: "person"  },
    { id: "budget",  label: "Q4 Budget",    kind: "budget"  },
    { id: "roadmap", label: "Roadmap",      kind: "project" },
    { id: "hiring",  label: "Hiring",       kind: "blocker" },
    { id: "pricing", label: "Pricing",      kind: "project" },
    { id: "churn",   label: "Churn Risk",   kind: "blocker" },
    { id: "team",    label: "Team",         kind: "person"  },
    { id: "market",  label: "Market",       kind: "topic"   },
  ];
  var DEMO_LINKS = [
    { source: "user",    target: "roadmap", type: "owns" },
    { source: "user",    target: "budget",  type: "owns" },
    { source: "budget",  target: "hiring",  type: "funds" },
    { source: "budget",  target: "pricing", type: "funds" },
    { source: "hiring",  target: "roadmap", type: "blocks" },
    { source: "churn",   target: "pricing", type: "blocks" },
    { source: "team",    target: "roadmap", type: "works-for" },
    { source: "pricing", target: "market",  type: "affects" },
  ];

  var KIND_COLOR = {
    person:  "#7A8BFF",
    budget:  "#3FA03F",
    project: "#D9A428",
    blocker: "#C95A5A",
    topic:   "#8A8A8A",
  };

  function init(canvas, nodesData, linksData) {
    var ctx = canvas.getContext("2d");
    var W = (canvas.width = canvas.clientWidth || 640);
    var H = (canvas.height = canvas.clientHeight || 420);

    // initial positions: circle
    var nodes = nodesData.map(function (n, i) {
      var a = (i / nodesData.length) * Math.PI * 2;
      return {
        id: n.id, label: n.label, kind: n.kind,
        x: W / 2 + Math.cos(a) * 160,
        y: H / 2 + Math.sin(a) * 130,
        vx: 0, vy: 0, r: 18,
      };
    });
    var byId = {};
    nodes.forEach(function (n) { byId[n.id] = n; });
    var links = linksData.map(function (l) {
      return { source: byId[l.source], target: byId[l.target], type: l.type };
    });

    // simple force simulation (repulsion + spring + centering)
    function tick() {
      var i, j, dx, dy, d, f;
      for (i = 0; i < nodes.length; i++) {
        for (j = i + 1; j < nodes.length; j++) {
          dx = nodes[i].x - nodes[j].x;
          dy = nodes[i].y - nodes[j].y;
          d = Math.sqrt(dx * dx + dy * dy) || 1;
          f = 9000 / (d * d);
          nodes[i].vx += (dx / d) * f;
          nodes[i].vy += (dy / d) * f;
          nodes[j].vx -= (dx / d) * f;
          nodes[j].vy -= (dy / d) * f;
        }
      }
      links.forEach(function (l) {
        dx = l.target.x - l.source.x;
        dy = l.target.y - l.source.y;
        d = Math.sqrt(dx * dx + dy * dy) || 1;
        f = (d - 120) * 0.02;
        l.source.vx += (dx / d) * f;
        l.source.vy += (dy / d) * f;
        l.target.vx -= (dx / d) * f;
        l.target.vy -= (dy / d) * f;
      });
      nodes.forEach(function (n) {
        n.vx += (W / 2 - n.x) * 0.005;
        n.vy += (H / 2 - n.y) * 0.005;
        n.vx *= 0.85; n.vy *= 0.85;
        n.x += n.vx; n.y += n.vy;
      });
    }

    function draw() {
      tick();
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      ctx.font = "10px 'JetBrains Mono', monospace";
      links.forEach(function (l) {
        ctx.strokeStyle = "#2C2C2C";
        ctx.beginPath();
        ctx.moveTo(l.source.x, l.source.y);
        ctx.lineTo(l.target.x, l.target.y);
        ctx.stroke();
        var mx = (l.source.x + l.target.x) / 2;
        var my = (l.source.y + l.target.y) / 2;
        ctx.fillStyle = "#5C5C5C";
        ctx.fillText(l.type, mx + 4, my - 2);
      });
      nodes.forEach(function (n) {
        ctx.fillStyle = KIND_COLOR[n.kind] || "#8A8A8A";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#E6E6E6";
        ctx.textAlign = "center";
        ctx.fillText(n.label, n.x, n.y + 4);
        ctx.fillStyle = "#5C5C5C";
        ctx.fillText(n.kind, n.x, n.y + n.r + 12);
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  function mount() {
    var mountEl = document.getElementById("entity-graph");
    if (!mountEl) return;
    var canvas = document.createElement("canvas");
    canvas.id = "entity-canvas";
    mountEl.appendChild(canvas);

    // try live endpoint; fall back to demo graph
    fetch("/api/entities")
      .then(function (r) { if (!r.ok) throw new Error("not live"); return r.json(); })
      .then(function (data) {
        var status = document.getElementById("status");
        if (status) { status.textContent = "live"; status.classList.add("live"); }
        init(canvas, data.nodes, data.links);
      })
      .catch(function () {
        init(canvas, DEMO_NODES, DEMO_LINKS);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
