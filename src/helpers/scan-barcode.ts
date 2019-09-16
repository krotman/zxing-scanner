declare var Module: any;
export function scanBarcode(file): Promise<any> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const format = '';
            const fileData = new Uint8Array(reader.result as ArrayBuffer);
            const buffer = Module._malloc(fileData.length);
            Module.HEAPU8.set(fileData, buffer);
            const result = Module.readBarcodeFromPng(buffer, fileData.length, true, format);
            Module._free(buffer);
            return resolve(result);
        };
        reader.onerror = function() {
            return reject(reader.error);
        };
        reader.readAsArrayBuffer(file);
    });
}
