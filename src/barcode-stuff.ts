import { drawOnCanvas, drawCornerPart, scanBarcode, base64toPNG } from './helpers/index';
export const main = async () => {
    const video: HTMLVideoElement = document.createElement('video');
    const canvasEl: HTMLCanvasElement = document.createElement('canvas');
    const canvas = canvasEl.getContext('2d');
    // Request video stream
    const stream = await navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: 'environment', // We want main camera
        },
    });

    // We will use video element to get canvas from it
    video.srcObject = stream;
    video.setAttribute('playsinline', 'true');
    video.play();

    // On each animation tich, out `videoTick` callback function is called
    requestAnimationFrame(videoTick);

    const overlayBorder = 50;
    let finished = false;
    let readyToCheck = true;

    function videoTick() {
        // Wait until video is fully loaded
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const { width, height } = {
                width: video.videoWidth,
                height: video.videoHeight,
            };
            // Draw video frame on out canvas
            const [fixedWidth, fixedHeight] = drawOnCanvas(video, canvasEl, width, height);

            // Draw a rectangle inside of our video element where user will try to put his code
            // Actually this one can be skipped ;)
            const [topLeft, topRigth, bottomRight, bottomLeft] = [
                {
                    x: overlayBorder + 3,
                    y: overlayBorder + 2,
                },
                {
                    x: fixedWidth - overlayBorder - 3,
                    y: overlayBorder + 2,
                },
                {
                    x: fixedWidth - overlayBorder - 3,
                    y: fixedHeight - overlayBorder + 3,
                },
                {
                    x: overlayBorder + 3,
                    y: fixedHeight - overlayBorder + 3,
                },
            ];
            drawCornerPart(canvas, topLeft, 'bottom');
            drawCornerPart(canvas, topLeft, 'right');

            drawCornerPart(canvas, topRigth, 'left');
            drawCornerPart(canvas, topRigth, 'bottom');

            drawCornerPart(canvas, bottomRight, 'top');
            drawCornerPart(canvas, bottomRight, 'left');

            drawCornerPart(canvas, bottomLeft, 'right');
            drawCornerPart(canvas, bottomLeft, 'top');
            // End of rectangle draw

            if (readyToCheck) {
                // we don't want to overheat our phone, doing the check every 50ms
                const imageData = canvas.getImageData(topLeft.x, topLeft.y, bottomRight.x, bottomRight.y);
                const [newWidth, newHight] = [bottomRight.x - topLeft.x, bottomRight.y - topLeft.y];
                const temporaryCanvasEl: HTMLCanvasElement = document.createElement('canvas');
                const temporaryCanvas = temporaryCanvasEl.getContext('2d');

                Object.assign(temporaryCanvasEl, {
                    wigth: newWidth,
                    height: newHight,
                });
                temporaryCanvas.putImageData(imageData, 0, 0);
                const base64 = atob(temporaryCanvasEl.toDataURL('image/png', 1).split(',')[1]);
                checkImage(base64);
                readyToCheck = false;
            }
        }
        if (!finished) {
            requestAnimationFrame(videoTick);
        }
    }
    const callbacks: Array<(result: string) => void> = [];
    async function checkImage(base64) {
        try {
            const res = await scanBarcode(base64toPNG(base64));
            if (res.text) {
                callbacks.forEach(cb => {
                    try {
                        cb(res.text);
                    } catch {}
                });
            }
        } catch {
            /* ignored */
        }
        setTimeout(() => (readyToCheck = true), 50);
    }
    return {
        canvas: canvasEl,
        found(callback: (result: string) => any) {
            callbacks.push(callback);
        },
        stop() {
            finished = true;
            canvasEl.remove();
            stream.getTracks().forEach(t => t.stop());
        },
    };
};
