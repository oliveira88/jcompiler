import fs from "fs";
import readline from "readline";
import { Lexer } from "./compiler/lexer";
import { Scanner } from "./compiler/scanner";
import { Parser } from "./compiler/parser";
const read = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export class JCompiler {
  private static hadError = false;
  static main() {
    const args = process.argv;
    if (args.length > 3) {
      process.stderr.write("Too many arguments");
      process.exit(64);
    } else if (args.length === 3) {
      this.runFile(args[2]);
    } else {
      // this.runFile("examples/Example.java");
      this.runPrompt();
    }
    return;
    const file = fs.readFileSync("examples/example.java", "utf8");
    const lexer = new Lexer(`String nçame = "Ola";
    `);
    const tokens = lexer.tokenize();
    console.log(tokens);
  }

  private static runFile(filePath: string) {
    const file = fs.readFileSync(filePath, "utf8");
    this.run(file);
    if (this.hadError) {
      process.exit(65);
    } else {
      process.exit(0);
    }
  }
  private static runPrompt() {
    read.question("> ", line => {
      if (line === null || line === "exit") {
        read.close();
        return;
      }
      this.run(line);
      this.hadError = false;
      this.runPrompt();
    });
  }

  private static run(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    parser.parse();
    // for (const token of tokens) {
    //   console.log(token);
    // }
  }

  static error(line: number, message: string) {
    this.report(line, "", message);
  }
  private static report(line: number, where: string, message: string) {
    console.log(`[line ${line}] Error ${where}: ${message}`);
    this.hadError = true;
  }
}

JCompiler.main();
