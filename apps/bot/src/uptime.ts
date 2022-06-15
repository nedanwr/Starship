let start: number = 0;

export const startUptimeCounter = () => {
    start = Date.now();
}

export const getCurrentUptime = () => {
    return Date.now() - start;
}