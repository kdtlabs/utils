import kdt from '@kdtlabs/eslint-config'

export default kdt({}, [
    {
        ignores: ['docs/superpowers/**', 'bench/**'],
    },
    {
        rules: {
            'no-promise-executor-return': 'off',
            'security/detect-non-literal-regexp': 'off',
        },
    },
    {
        files: ['src/system/graceful-exit.ts'],
        rules: {
            'n/no-process-exit': 'off',
        },
    },
])
