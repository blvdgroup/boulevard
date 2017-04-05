import { join as pathJoin, dirname } from 'path'

// My momma told me never to depend on random nodejs packages for simple tasks
// But then I tried copying folders recursively
import { ncp } from 'ncp'

import Compiler from './Compiler'

class Client {
  private compileSteps: Compiler[] = []

  constructor (public path: string = pathJoin(process.cwd(), 'client', 'index.js')) {}

  // TODO: Just define one "compiler" function and force programmers to `compose` it (i.e. redux) for clearer order mgmt?
  public addCompiler (c: Compiler): void {
    this.compileSteps.push(c)
  }

  public async compile (): Promise<string> {
    // First, we copy the client over to a build_intermediate directory.
    // We copy the entire directory over. TODO: This *shouldn't* mess up references to something like a `common`
    // folder which exists next door unless your current working directory is in a weird spot - look into?
    const intermediatePath = pathJoin(process.cwd(), 'client_build')
    ncp(dirname(this.path), intermediatePath, (err?: Error) => { if (err) throw err })

    // Start with a promise that just resolves to the path of this intermediate build directory.
    const buildPromise = Promise.resolve(pathJoin(intermediatePath, 'index.js'))

    // Each compile step takes in the path of the previous compile step and should pass that down to the next step.
    // It starts out with whatever the initial file was (by default the index of the client folder)
    // For, say, a webpack compile step, the promise would resolve to whatever the bundle was saved to - maybe
    // index.bundle.js of the same folder. Care should be taken that the Compiler function returns a FULL PATH -
    // none of this PANSY RELATIVE PATH SHIT - we are MEN and we can use the 'path' packagel ike MEN.
    this.compileSteps.forEach((step: Compiler) => { buildPromise.then(step) })

    // We wait for these to finish up, and get the path of the final build.
    return await buildPromise
  }
}

export default Client
