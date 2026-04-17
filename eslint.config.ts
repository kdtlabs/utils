import kdt from '@kdtlabs/eslint-config'

export default kdt({}, [
    {
        ignores: ['bench/**'],
    },
    {
        rules: {
            'n/no-process-exit': 'off',
        },
    },
])
