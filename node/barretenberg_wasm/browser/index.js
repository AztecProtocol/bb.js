import { wrap } from 'comlink';
import debug from 'debug';
export async function fetchCode(multithreading) {
    const wasmModuleUrl = multithreading
        ? new URL(`../../barretenberg-threads.wasm`, import.meta.url)
        : new URL(`../../barretenberg.wasm`, import.meta.url);
    const res = await fetch(wasmModuleUrl.href);
    return await res.arrayBuffer();
}
export function createWorker() {
    const worker = new Worker(new URL(`./worker.js`, import.meta.url));
    const debugStr = debug.disable();
    debug.enable(debugStr);
    worker.postMessage({ debug: debugStr });
    return worker;
}
export function getRemoteBarretenbergWasm(worker) {
    return wrap(worker);
}
export function getNumCpu() {
    return navigator.hardwareConcurrency;
}
export function threadLogger() {
    return undefined;
}
export function killSelf() {
    self.close();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYmFycmV0ZW5iZXJnX3dhc20vYnJvd3Nlci9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBRS9CLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUUxQixNQUFNLENBQUMsS0FBSyxVQUFVLFNBQVMsQ0FBQyxjQUF1QjtJQUNyRCxNQUFNLGFBQWEsR0FBRyxjQUFjO1FBQ2xDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxpQ0FBaUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUM3RCxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMseUJBQXlCLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN4RCxNQUFNLEdBQUcsR0FBRyxNQUFNLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUMsT0FBTyxNQUFNLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNqQyxDQUFDO0FBRUQsTUFBTSxVQUFVLFlBQVk7SUFDMUIsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNuRSxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDakMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN2QixNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFDeEMsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVELE1BQU0sVUFBVSx5QkFBeUIsQ0FBQyxNQUFjO0lBQ3RELE9BQU8sSUFBSSxDQUFtQixNQUFNLENBQUMsQ0FBQztBQUN4QyxDQUFDO0FBRUQsTUFBTSxVQUFVLFNBQVM7SUFDdkIsT0FBTyxTQUFTLENBQUMsbUJBQW1CLENBQUM7QUFDdkMsQ0FBQztBQUVELE1BQU0sVUFBVSxZQUFZO0lBQzFCLE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFFRCxNQUFNLFVBQVUsUUFBUTtJQUN0QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDZixDQUFDIn0=