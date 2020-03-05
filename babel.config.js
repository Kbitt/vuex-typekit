module.exports = {
    presets: ['@babel/preset-env'],
    plugins: ['@babel/plugin-transform-modules-commonjs'],
    env: {
        test: {
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: {
                            node: 10, // jest seems to break without specifically setting this
                        },
                    },
                ],
            ],
        },
    },
}
