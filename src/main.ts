import fs from "fs";
import { Lexer } from "./lexer";

const file = fs.readFileSync("example.java", "utf8");
const lexer = new Lexer(file);
const tokens = lexer.tokenize();
console.log(tokens);
