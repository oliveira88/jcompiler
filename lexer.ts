import { match } from "ts-pattern";
const Keywords = [];
enum TokenKind {
  Identifier = "Identifier",
  Package = "Package",
  Import = "Import",
  Class = "Class",
  Public = "Public",
  Protected = "Protected",
  Private = "Private",
  Static = "Static",
  Abstract = "Abstract",
  Final = "Final",
  LBracket = "LBracket",
  RBracket = "RBracket",
  Semicolon = "Semicolon", // ;
  Colon = "Colon", // :
  Eq = "Eq",
  Assign = "Assign",
  GreaterThan = "GreaterThan",
  LowerThan = "LowerThan",
  LParen = "LParen",
  RParen = "RParen",
  Byte = "Byte",
  Short = "Short",
  Int = "Int",
  Long = "Long",
  Char = "Char",
  Float = "Float",
  Double = "Double",
  Boolean = "Boolean",
  Void = "Void",
  If = "If",
}
type Token = {
  tokenType: TokenKind;
  identifier: string;
};
export class Lexer {
  private position: number = 0;
  private readPosition: number = 0;
  private ch!: string;
  constructor(private input: string) {
    this.nextChar();
  }
  nextToken() {
    this.skipWhitespace();
    let token: Token | null = null;
    match(this.ch)
      .with("{", () => (token = this.newToken(TokenKind.LBracket, this.ch)))
      .with("}", () => (token = this.newToken(TokenKind.RBracket, this.ch)))
      .with(";", () => (token = this.newToken(TokenKind.Semicolon, this.ch)))
      .with(":", () => (token = this.newToken(TokenKind.Colon, this.ch)))
      .with("(", () => (token = this.newToken(TokenKind.LParen, this.ch)))
      .with(")", () => (token = this.newToken(TokenKind.RParen, this.ch)))
      .with("=", () => {
        if (this.peekChar() === "=") {
          token = this.newToken(TokenKind.Eq, "==");
        } else {
          token = this.newToken(TokenKind.Assign, this.ch);
        }
      })
      .with(">", () => (token = this.newToken(TokenKind.GreaterThan, this.ch)))
      .with("<", () => (token = this.newToken(TokenKind.LowerThan, this.ch)));

    if (this.isAlphabetic(this.ch)) {
      const identifier = this.readIdentifier();
      return this.newToken(TokenKind.Identifier, identifier);
    } else if (this.isNumber(this.ch)) {
      const num = this.readNumber();
      return this.newToken(TokenKind.Int, num);
    }
    this.nextChar();
    return token;
  }

  private newToken(tokenType: TokenKind, identifier: string): Token {
    return { tokenType, identifier };
  }
  private skipWhitespace() {
    do {
      this.nextChar();
    } while (
      this.ch === " " ||
      this.ch === "\n" ||
      this.ch === "\t" ||
      this.ch === "\r"
    );
  }

  private peekChar(): string {
    if (this.readPosition >= this.input.length) {
      return "\0";
    }
    return this.input[this.readPosition];
  }

  isNumber(ch: string): boolean {
    const char = ch.charCodeAt(0);
    return "0".charCodeAt(0) <= char && char <= "9".charCodeAt(0);
  }

  isAlphabetic(ch: string): boolean {
    const char = ch.charCodeAt(0);
    return (
      ("a".charCodeAt(0) <= char && "z".charCodeAt(0) >= char) ||
      ("A".charCodeAt(0) <= char && "Z".charCodeAt(0) >= char) ||
      char === "_".charCodeAt(0)
    );
  }

  private nextChar() {
    if (this.readPosition >= this.input.length) {
      this.ch = "\0";
    } else {
      this.ch = this.input[this.readPosition];
    }
    this.position = this.readPosition;
    this.readPosition += 1;
  }

  private readIdentifier(): string {
    while (this.isAlphabetic(this.ch)) {
      this.nextChar();
    }
    return this.input.substring(this.position, this.readPosition);
  }

  private readNumber(): string {
    while (this.isNumber(this.ch)) {
      this.nextChar();
    }
    return this.input.substring(this.position, this.readPosition);
  }
}
