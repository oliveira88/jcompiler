import fs from "fs";
import { Lexer } from "./compiler/lexer";

const file = fs.readFileSync("examples/example.java", "utf8");
const lexer = new Lexer(file);
const tokens = lexer.tokenize();
console.log(tokens);
