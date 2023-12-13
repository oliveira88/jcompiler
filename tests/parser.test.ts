import { describe, expect, test } from "@jest/globals";
import { Lexer } from "../src/compiler/lexer";
import fs from "fs";
import { Token, TokenConst } from "../src/compiler/token";
import { Parser } from "../src/compiler/parser";

let file: string = "";

describe("Parser", () => {
  beforeAll(() => {
    file = fs.readFileSync("examples/Example.java", "utf8");
  });
  test("Should return a list of tokens", () => {
    const lexer = new Lexer(file);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const astExpected = {
      Program: {
        PackageDeclaration: { Name: "example" },
        ImportDeclaration: [{ Name: "java.util.ArrayList" }, { Name: "java.util.List" }]
        ClassDeclaration: {
          Name: "Example",
          Modifier: "public",
          Body: [
            
          ]
        }
      }
    };
    expect(tokens).toStrictEqual(tokensExpected);
  });
});
