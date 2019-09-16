export function base64toPNG(base64) {
    const bits = new Uint8Array(base64.length);
    for (let i = 0; i < base64.length; i++) {
        bits[i] = base64.charCodeAt(i);
    }
    return new File([new Blob([bits], { type: 'image/png' })], 'image.png', {
        type: 'image/png',
    });
}
