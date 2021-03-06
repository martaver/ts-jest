import { parse } from 'json5'
import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * A fault-tolerant way to load json files, that
 * won't throw on common artifacts such as comments
 * and trailing commas.
 *
 * @param path The path of the json file to load.
 */
export const getPackageJson = (dir: string): { main: string; name: string } => {
  const packageJsonPath = join(dir, 'package.json')
  const str = readFileSync(packageJsonPath, 'utf-8')

  return parse(str)
}
