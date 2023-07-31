import { RawBuffer } from '../types/raw_buffer.js';
// For serializing bool.
export function boolToBuffer(b) {
    const buf = new Uint8Array(1);
    buf[0] = b ? 1 : 0;
    return buf;
}
// For serializing numbers to 32 bit little-endian form.
export function numToUInt32LE(n, bufferSize = 4) {
    const buf = new Uint8Array(bufferSize);
    new DataView(buf.buffer).setUint32(buf.byteLength - 4, n, true);
    return buf;
}
// For serializing numbers to 32 bit big-endian form.
export function numToUInt32BE(n, bufferSize = 4) {
    const buf = new Uint8Array(bufferSize);
    new DataView(buf.buffer).setUint32(buf.byteLength - 4, n, false);
    return buf;
}
// For serializing signed numbers to 32 bit big-endian form.
export function numToInt32BE(n, bufferSize = 4) {
    const buf = new Uint8Array(bufferSize);
    new DataView(buf.buffer).setInt32(buf.byteLength - 4, n, false);
    return buf;
}
// For serializing numbers to 8 bit form.
export function numToUInt8(n) {
    const buf = new Uint8Array(1);
    buf[0] = n;
    return buf;
}
export function concatenateUint8Arrays(arrayOfUint8Arrays) {
    const totalLength = arrayOfUint8Arrays.reduce((prev, curr) => prev + curr.length, 0);
    const result = new Uint8Array(totalLength);
    let length = 0;
    for (const array of arrayOfUint8Arrays) {
        result.set(array, length);
        length += array.length;
    }
    return result;
}
export function uint8ArrayToHexString(uint8Array) {
    return uint8Array.reduce((accumulator, byte) => accumulator + byte.toString(16).padStart(2, '0'), '');
}
// For serializing a buffer as a vector.
export function serializeBufferToVector(buf) {
    return concatenateUint8Arrays([numToInt32BE(buf.length), buf]);
}
export function serializeBigInt(n, width = 32) {
    const buf = new Uint8Array(width);
    for (let i = 0; i < width; i++) {
        buf[width - i - 1] = Number((n >> BigInt(i * 8)) & 0xffn);
    }
    return buf;
}
export function deserializeBigInt(buf, offset = 0, width = 32) {
    let result = 0n;
    for (let i = 0; i < width; i++) {
        result = (result << BigInt(8)) | BigInt(buf[offset + i]);
    }
    return { elem: result, adv: width };
}
export function serializeDate(date) {
    return serializeBigInt(BigInt(date.getTime()), 8);
}
export function deserializeBufferFromVector(vector, offset = 0) {
    const length = new DataView(vector.buffer, vector.byteOffset + offset, 4).getUint32(0, false);
    const adv = 4 + length;
    const elem = vector.slice(offset + 4, offset + adv);
    return { elem, adv };
}
export function deserializeBool(buf, offset = 0) {
    const adv = 1;
    const elem = buf[offset] !== 0;
    return { elem, adv };
}
export function deserializeUInt32(buf, offset = 0) {
    const adv = 4;
    const elem = new DataView(buf.buffer, buf.byteOffset + offset, adv).getUint32(0, false);
    return { elem, adv };
}
export function deserializeInt32(buf, offset = 0) {
    const adv = 4;
    const elem = new DataView(buf.buffer, buf.byteOffset + offset, adv).getInt32(0, false);
    return { elem, adv };
}
export function deserializeField(buf, offset = 0) {
    const adv = 32;
    const elem = buf.slice(offset, offset + adv);
    return { elem, adv };
}
// For serializing an array of fixed length elements.
export function serializeBufferArrayToVector(arr) {
    return concatenateUint8Arrays([numToUInt32BE(arr.length), ...arr.flat()]);
}
export function deserializeArrayFromVector(deserialize, vector, offset = 0) {
    let pos = offset;
    const size = new DataView(vector.buffer, vector.byteOffset + pos, 4).getUint32(0, false);
    pos += 4;
    const arr = new Array(size);
    for (let i = 0; i < size; ++i) {
        const { elem, adv } = deserialize(vector, pos);
        pos += adv;
        arr[i] = elem;
    }
    return { elem: arr, adv: pos - offset };
}
/**
 * Serializes a list of objects contiguously for calling into wasm.
 * @param objs - Objects to serialize.
 * @returns A buffer list with the concatenation of all fields.
 */
export function serializeBufferable(obj) {
    if (Array.isArray(obj)) {
        return serializeBufferArrayToVector(obj.map(serializeBufferable));
    }
    else if (obj instanceof RawBuffer) {
        return obj;
    }
    else if (obj instanceof Uint8Array) {
        return serializeBufferToVector(obj);
    }
    else if (typeof obj === 'boolean') {
        return boolToBuffer(obj);
    }
    else if (typeof obj === 'number') {
        return numToUInt32BE(obj);
    }
    else if (typeof obj === 'bigint') {
        return serializeBigInt(obj);
    }
    else if (typeof obj === 'string') {
        return serializeBufferToVector(new TextEncoder().encode(obj));
    }
    else {
        return obj.toBuffer();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXplLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcmlhbGl6ZS9zZXJpYWxpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRW5ELHdCQUF3QjtBQUN4QixNQUFNLFVBQVUsWUFBWSxDQUFDLENBQVU7SUFDckMsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkIsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBRUQsd0RBQXdEO0FBQ3hELE1BQU0sVUFBVSxhQUFhLENBQUMsQ0FBUyxFQUFFLFVBQVUsR0FBRyxDQUFDO0lBQ3JELE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3ZDLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2hFLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQUVELHFEQUFxRDtBQUNyRCxNQUFNLFVBQVUsYUFBYSxDQUFDLENBQVMsRUFBRSxVQUFVLEdBQUcsQ0FBQztJQUNyRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN2QyxJQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNqRSxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRCw0REFBNEQ7QUFD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