export async function asyncPool (poolLimit, array, iteratorFn) {
    const result = [];
    const executing = [];

    for (const item of array) {
        const p = Promise.resolve().then(() => iteratorFn(item));
        result.push(p);

        const e = p.finally(() => executing.splice(executing.indexOf(e), 1));
        executing.push(e);

        if (executing.length >= poolLimit) {
            await Promise.race(executing);
        }
    }
    return Promise.all(result);
}