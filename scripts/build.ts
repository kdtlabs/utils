import { cp } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { Glob } from 'bun'

console.log('🔍 Scanning modules...')

const rootPath = resolve(import.meta.dir, '..')
const distPath = join(rootPath, 'dist')

const glob = new Glob('src/*/index.ts')
const files: string[] = []

for await (const path of glob.scan({ absolute: true, cwd: rootPath, onlyFiles: true })) {
    files.push(path)
}

console.log(`📦 Bundling ${files.length} modules...`)

const result = await Bun.build({
    drop: ['console', 'debugger'],
    entrypoints: [...files, join(rootPath, 'src/index.ts')],
    env: 'disable',
    format: 'esm',

    // @ts-expect-error bun not export valid type for metafile field
    metafile: {
        json: 'meta.json',
        markdown: 'meta.md',
    },
    minify: true,
    outdir: 'dist',
    packages: 'external',
    root: 'src',
    sourcemap: 'linked',
    splitting: true,
    target: 'node',
})

const formatter = new Intl.NumberFormat()
const modules: string[] = []

for (const output of result.outputs) {
    const path = output.path.slice(distPath.length + 1)
    const meta = result.metafile?.outputs[path]

    if (meta) {
        modules.push(dirname(path))
        console.log(`   📄 ${path.slice(0, -9)} (${formatter.format(meta.bytes)} bytes)`)
    }
}

console.log(`📝 Generating package.json with ${modules.length} module exports...`)

const packageJson = (await import('../package.json').then((m) => m.default)) as Record<string, unknown> & {
    exports: Record<string, unknown>
}

for (const m of modules) {
    packageJson.exports[`./${m}`] = {
        default: `./${m}/index.js`,
        types: `./${m}/index.d.ts`,
    }
}

await Bun.write(join(rootPath, 'dist', 'package.json'), JSON.stringify(packageJson, undefined, 4))

console.log('📂 Copying assets to dist...')

for (const file of ['README.md', 'LICENSE', 'LICENSE.md', 'CHANGELOG.md']) {
    const original = join(rootPath, file)

    if (await Bun.file(original).exists()) {
        console.log(`   📋 ${file}`)
        await cp(original, join(distPath, file))
    }
}

const skillMd = join(rootPath, 'docs', 'SKILL.md')

if (await Bun.file(skillMd).exists()) {
    console.log('   📋 SKILL.md')
    await cp(skillMd, join(distPath, 'SKILL.md'))
}

if (result.logs.length > 0) {
    console.warn(`⚠️  Build completed with ${result.logs.length} warning(s):`)

    for (const log of result.logs) {
        console.warn(log)
    }
} else {
    console.log('✅ Build complete!')
}
