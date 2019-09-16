const cornerLineLength = 35;
const cornerColor = '#e04747';
const cornerFitOffset = 3;
function drawLine(canvas, begin, end, color) {
    canvas.beginPath();
    canvas.moveTo(begin.x, begin.y);
    canvas.lineTo(end.x, end.y);
    canvas.lineWidth = 6;
    canvas.strokeStyle = color;
    canvas.stroke();
}

export function drawCornerPart(
    canvas: CanvasRenderingContext2D,
    point: { x: number; y: number },
    direction: 'top' | 'bottom' | 'left' | 'right',
) {
    switch (direction) {
        case 'top':
            return drawLine(
                canvas,
                {
                    ...point,
                    y: point.y + cornerFitOffset,
                },
                {
                    ...point,
                    y: point.y - cornerLineLength,
                },
                cornerColor,
            );
        case 'bottom':
            return drawLine(
                canvas,
                {
                    ...point,
                    y: point.y - cornerFitOffset,
                },
                {
                    ...point,
                    y: point.y + cornerLineLength,
                },
                cornerColor,
            );
        case 'left':
            return drawLine(
                canvas,
                {
                    ...point,
                    x: point.x + cornerFitOffset,
                },
                {
                    ...point,
                    x: point.x - cornerLineLength,
                },
                cornerColor,
            );
        case 'right':
            return drawLine(
                canvas,
                {
                    ...point,
                    x: point.x - cornerFitOffset,
                },
                {
                    ...point,
                    x: point.x + cornerLineLength,
                },
                cornerColor,
            );
    }
}
