module.exports = {
    preset: 'ts-jest',
    transform: {
        '^.+\\.js$': 'babel-jest',
        // process `*.vue` files with `vue-jest`
        '.*\\.(vue)$': 'vue-jest',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/(?!lodash-es)'],
    moduleFileExtensions: [
        'js',
        'ts',
        // tell Jest to handle `*.vue` files
        'vue',
    ],
    globals: {
        'ts-jest': {
            babelConfig: true,
        },
    },
}
