declare module '*.vue' {
    import Vue from 'vue'
    export default Vue
}

declare module '*.json' {
    const defaultExport: any
    export default defaultExport
}

declare module '*.png' {
    const defaultExport: string
    export default defaultExport
}
