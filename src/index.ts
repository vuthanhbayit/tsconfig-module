import { promises as fsp } from 'fs'
import { relative, resolve } from 'pathe'
import consola from 'consola'
import defu from 'defu'
import type { Module } from '@nuxt/types'
import type { TSConfig } from 'pkg-types'
import { name, version } from '../package.json'

const meta = { name, version }

declare module '@nuxt/types' {
  interface NuxtOptions {
    tsConfig: TSConfig
  }
}

const tsConfig: TSConfig = {
  compilerOptions: {
    target: 'ES2018',
    module: 'ESNext',
    moduleResolution: 'Node',
    lib: ['ESNext', 'ESNext.AsyncIterable', 'DOM'],
    esModuleInterop: true,
    allowJs: true,
    resolveJsonModule: true,
    sourceMap: true,
    strict: true,
    noEmit: true,
    experimentalDecorators: true,
    baseUrl: '.',
    paths: {},
    types: ['@nuxt/types', '@nuxtjs/axios', '@types/node']
  },
  exclude: ['node_modules', '.nuxt', 'dist']
}

const generateTsConfig: Module<TSConfig> = async function (moduleOptions) {
  const rootDir = this.options.rootDir
  const aliases = this.options.alias

  const options: TSConfig = defu(
    {},
    tsConfig,
    moduleOptions,
    this.options.tsConfig
  )

  console.log({ options })

  for (const alias in aliases) {
    if (alias === '~~' || alias === '~') { continue }

    const relativePath =
        relative(rootDir, aliases[alias]).replace(
          /(?<=\w)\.\w+$/g,
          ''
        ) /* remove extension */ || '.'

    try {
      const { isDirectory } = await fsp.stat(resolve(rootDir, relativePath))

      // @ts-ignore
      if (isDirectory && options.compilerOptions) {
        options.compilerOptions.paths[`${alias}/*`] = [`${relativePath}/*`]
      }
    } catch {}
  }

  await this.nuxt.hook('modules:before')

  const tsConfigPath = resolve('./', 'tsconfig.json')
  // await fsp.mkdir(this.options.buildDir, { recursive: true })
  await fsp.writeFile(tsConfigPath, JSON.stringify(options, null, 2))

  consola.success('Generated tsconfig.json')
}

// @ts-ignore
generateTsConfig.meta = meta
export default generateTsConfig
