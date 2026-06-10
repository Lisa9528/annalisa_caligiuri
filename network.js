const canvas = document.getElementById("network-canvas");
const ctx = canvas.getContext("2d");

let nodes = [];
const nodeCount = 75;
const maxDistance = 155;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createNodes() {
  nodes = [];
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.6 + 1.0,
      phase: Math.random() * Math.PI * 2
    });
  }
}

function drawBackgroundGlow() {
  const gradient = ctx.createRadialGradient(
    canvas.width * 0.5,
    canvas.height * 0.35,
    0,
    canvas.width * 0.5,
    canvas.height * 0.35,
    Math.max(canvas.width, canvas.height) * 0.75
  );

  gradient.addColorStop(0, "rgba(88, 180, 255, 0.09)");
  gradient.addColorStop(0.45, "rgba(7, 23, 43, 0.18)");
  gradient.addColorStop(1, "rgba(3, 7, 18, 0.95)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function updateNodes() {
  for (const node of nodes) {
    node.x += node.vx;
    node.y += node.vy;
    if (node.x < -20) node.x = canvas.width + 20;
    if (node.x > canvas.width + 20) node.x = -20;
    if (node.y < -20) node.y = canvas.height + 20;
    if (node.y > canvas.height + 20) node.y = -20;
  }
}

function drawEdges(time) {
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < maxDistance) {
        const baseOpacity = 1 - distance / maxDistance;
        const temporalPulse = 0.55 + 0.45 * Math.sin(time * 0.0012 + a.phase + b.phase);
        const opacity = baseOpacity * temporalPulse * 0.32;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(88, 180, 255, ${opacity})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }
    }
  }
}

function drawNodes(time) {
  for (const node of nodes) {
    const pulse = 0.65 + 0.35 * Math.sin(time * 0.002 + node.phase);
    const radius = node.r + pulse * 0.6;

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius + 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(88, 180, 255, ${0.08 * pulse})`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(155, 216, 255, ${0.75 + 0.25 * pulse})`;
    ctx.fill();
  }
}

function drawNetwork(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackgroundGlow();
  updateNodes();
  drawEdges(time);
  drawNodes(time);
  requestAnimationFrame(drawNetwork);
}

window.addEventListener("resize", () => {
  resizeCanvas();
  createNodes();
});

resizeCanvas();
createNodes();
requestAnimationFrame(drawNetwork);
