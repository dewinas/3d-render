export function drawPolygon(polygon, context) {
    polygon.forEach(point => {
        offsetToCenter(point, context.canvas);
    });
    context.beginPath();

    const first = polygon[0];
    context.moveTo(first.x, first.y);
    polygon.forEach(point => {
        context.lineTo(point.x, point.y);
    });
    context.lineTo(first.x, first.y);
    context.stroke();
}

function offsetToCenter(point, canvas) {
    point.x += canvas.width / 2;
    point.y += canvas.height /2;
}