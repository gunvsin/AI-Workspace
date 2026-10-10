/* Live Dashboard — animated explainers.
 * Zero deps. Two endpoints, both optional:
 *   GET  /api/metrics  -> [{ id, label, value, delta, spark: number[], explain }]
 *   POST /api/explain  -> { question } -> { answer }
 * If endpoints are missing, the dashboard runs in demo mode.
 */
(function () {
  "use strict";

  var DEMO_METRICS = [
    {
      id: "revenue",
      label: "Revenue",
      value: "$48.2k",
      delta: "+12.4%",
      up: true,
      spark: [12, 18, 14, 22, 26, 24, 31, 29, 38, 36, 44, 48],
      explain: "Revenue climbed 12.4% over 30 days. The steepest gain followed the Oct 6 pricing change; volume held steady, so the lift is price-driven, not traffic-driven.",
    },
    {
      id: "users",
      label: "Active users",
      value: "3,142",
      delta: "+3.1%",
      up: true,
      spark: [40, 42, 41, 45, 43, 47, 46, 48, 47, 49, 50, 51],
      explain: "Active users grew 3.1%. Weekday peaks at 10:00 UTC; weekend dip is normal for this audience. No campaign ran in this window — organic only.",
    },
    {
      id: "churn",
      label: "Churn",
      value: "1.9%",
      delta: "-0.4%",
      up: true,
      spark: [30, 28, 29, 26, 25, 24, 22, 23, 21, 20, 19, 19],
      explain: "Churn fell 0.4pt to 1.9%. Cancellation reasons shifted from 'price' to 'missing feature' — the win-back email sent Oct 3 likely kept price-sensitive users.",
    },
    {
      id: "latency",
      label: "P95 latency",
      value: "212ms",
      delta: "+18ms",
      up: false,
      spark: [10, 11, 12, 11, 13, 15, 14, 16, 18, 17, 19, 21],
      explain: "P95 latency rose 18ms to 212ms. The increase started after the 14:00 deploy; cache hit-rate dropped from 91% to 84% in the same window — suspect the new query path.",
    },
  ];

  var metricsEl = document.getElementById("metrics");
  var explainersEl = document.getElementById("explainers");
  var statusEl = document.getElementById("status");
  var askForm = document.getElementById("ask-form");
  var askInput = document.getElementById("ask-input");
  var answerEl = document.getElementById("answer");

  function sparkline(points) {
    var w = 120, h = 32, max = Math.max.apply(null, points), min = Math.min.apply(null, points);
    var span = max - min || 1;
    var step = w / (points.length - 1);
    var coords = points.map(function (p, i) {
      var x = (i * step).toFixed(1);
      var y = (h - 3 - ((p - min) / span) * (h - 6)).toFixed(1);
      return x + "," + y;
    });
    return (
      '<svg class="spark" viewBox="0 0 ' + w + " " + h + '" preserveAspectRatio="none">' +
      '<polyline points="' + coords.join(" ") + '" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"/>' +
      "</svg>"
    );
  }

  function render(metrics) {
    metricsEl.innerHTML = "";
    explainersEl.innerHTML = "";
    metrics.forEach(function (m, i) {
      var card = document.createElement("div");
      card.className = "metric";
      card.style.animationDelay = i * 60 + "ms";
      card.innerHTML =
        "<h3>" + m.label + "</h3>" +
        '<div class="value">' + m.value + "</div>" +
        '<div class="delta ' + (m.up ? "up" : "down") + '">' + m.delta + "</div>" +
        sparkline(m.spark);
      card.addEventListener("click", function () { toggleExplainer(m.id); });
      metricsEl.appendChild(card);

      var panel = document.createElement("div");
      panel.className = "explainer";
      panel.id = "exp-" + m.id;
      panel.innerHTML = "<h4>" + m.label + " — why?</h4><p>" + m.explain + "</p>";
      explainersEl.appendChild(panel);
    });
  }

  function toggleExplainer(id) {
    var panel = document.getElementById("exp-" + id);
    if (panel) panel.classList.toggle("open");
  }

  function fetchMetrics() {
    return fetch("/api/metrics")
      .then(function (r) {
        if (!r.ok) throw new Error("not live");
        return r.json();
      })
      .then(function (data) {
        statusEl.textContent = "live";
        statusEl.classList.add("live");
        render(data);
      })
      .catch(function () {
        statusEl.textContent = "demo mode";
        render(DEMO_METRICS);
      });
  }

  function ask(question) {
    answerEl.textContent = "";
    answerEl.classList.add("thinking");
    fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: question }),
    })
      .then(function (r) {
        if (!r.ok) throw new Error("no ai endpoint");
        return r.json();
      })
      .then(function (data) {
        answerEl.classList.remove("thinking");
        answerEl.classList.add("ai");
        answerEl.textContent = data.answer;
      })
      .catch(function () {
        // Demo fallback: echo the matching metric explainer if any, else a stub.
        answerEl.classList.remove("thinking");
        var hit = DEMO_METRICS.filter(function (m) {
          return question.toLowerCase().indexOf(m.label.toLowerCase().split(" ")[0]) !== -1;
        })[0];
        answerEl.textContent = hit
          ? hit.explain + " (demo)"
          : "No /api/explain endpoint connected. Wire one to Claude — see README.";
      });
  }

  askForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = askInput.value.trim();
    if (q) ask(q);
  });

  fetchMetrics();
})();
