declare global {
    /**
     * Window with STFB
     */
    interface Window {
        STFB: {
            core: any;
            stdlib: any;
            inject: (into: any) => void;
        };
    }
}
export {};
