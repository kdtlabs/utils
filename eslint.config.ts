import kdt from '@kdtlabs/eslint-config'

export default kdt({}, [
    {
        ignores: ['.gitnexus/**', 'docs/superpowers/**', 'bench/**', 'CHANGELOG.md'],
    },
    {
        rules: {
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
