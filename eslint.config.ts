import kdt from '@kdtlabs/eslint-config'

export default kdt({}, [
    {
        ignores: ['.gitnexus/**', 'docs/superpowers/**', 'bench/**'],
    },
    {
        files: ['src/system/graceful-exit.ts'],
        rules: {
            'n/no-process-exit': 'off',
        },
    },
])
