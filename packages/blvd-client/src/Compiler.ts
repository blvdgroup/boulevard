interface Compiler {
  (path: string): Promise<string>
}

export default Compiler
