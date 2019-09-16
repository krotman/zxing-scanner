const maxSize = 350;
export function drawOnCanvas(
    content: HTMLVideoElement | HTMLImageElement,
    canvasEl: HTMLCanvasElement,
    width: number,
    height: number,
) {
    const newWidth = Math.min(maxSize, width);
    const newHeight = Math.min(maxSize, height);
    const canvas = canvasEl.getContext('2d');
    Object.assign(canvasEl, {
        width: newWidth,
        height: newHeight,
        hidden: false,
    });
    let xOffset = 0;
    let yOffset = 0;
    if (width > newWidth) {
        xOffset = (width - newWidth) / 2;
    }
    if (height > newHeight) {
        yOffset = (height - newHeight) / 2;
    }

    canvas.drawImage(content, xOffset, yOffset, newWidth, newHeight, 0, 0, newWidth, newWidth);
    return [newWidth, newHeight];
}
