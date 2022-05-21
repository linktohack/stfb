declare global {
    /**
     * Window with STFB
     */
    interface Window {
        STFB: {} & ((into?: any) => void);
    }
}
export {};
