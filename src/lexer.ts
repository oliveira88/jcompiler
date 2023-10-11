import { match } from "ts-pattern";
import { Token, TokenConst, TokenKind } from "./token";

export class Lexer {
  private position: number = 0;
  private readPosition: number = 0;
  private charAtMoment!: string;
  private keywords = {
    package: this.newToken(TokenConst.Package, "package"),
    import: this.newToken(TokenConst.Import, "import"),
    class: this.newToken(TokenConst.Class, "class"),
    public: this.newToken(TokenConst.Public, "public"),
    protected: this.newToken(TokenConst.Protected, "protected"),
    private: this.newToken(TokenConst.Private, "private"),
    static: this.newToken(TokenConst.Static, "static"),
    abstract: this.newToken(TokenConst.Abstract, "abstract"),
    final: this.newToken(TokenConst.Final, "final")
  } as const;
  constructor(private input: string) {
    this.nextChar();
  }
  nextToken() {
    this.skipWhitespace();
    let token: Token | null = null;
    match(this.charAtMoment)
      .with("{", () => (token = this.newToken(TokenConst.LBracket, this.charAtMoment)))
      .with("}", () => (token = this.newToken(TokenConst.RBracket, this.charAtMoment)))
      .with(";", () => (token = this.newToken(TokenConst.Semicolon, this.charAtMoment)))
      .with(":", () => (token = this.newToken(TokenConst.Colon, this.charAtMoment)))
      .with("(", () => (token = this.newToken(TokenConst.LParen, this.charAtMoment)))
      .with(")", () => (token = this.newToken(TokenConst.RParen, this.charAtMoment)))
      .with("=", () => {
        if (this.peekChar() === "=") {
          token = this.newToken(TokenConst.Eq, "==");
        } else {
          token = this.newToken(TokenConst.Assign, this.charAtMoment);
        }
      })
      // .with("/", () => {
      //   if (this.peekChar() === "/") {
      //     this.ignoreComment(false);
      //     token = this.newToken(TokenConst.Eq, "==");
      //   } else if (this.peekChar() === "*") {
      //     this.ignoreComment(true);
      //   } else {
      //     token = this.newToken(TokenConst.Division, this.charAtMoment);
      //   }
      // })
      .with(">", () => (token = this.newToken(TokenConst.GreaterThan, this.charAtMoment)))
      .with("<", () => (token = this.newToken(TokenConst.LowerThan, this.charAtMoment)));
    // .with("\0", () => (token = this.newToken(TokenKind.Eof, this.ch)));

    if (this.isAlphabetic(this.charAtMoment)) {
      const identifier = this.readIdentifier();
      const keyword = this.keywords[identifier as keyof typeof this.keywords];
      if (keyword) {
        return keyword;
      }
      return this.newToken(TokenConst.Identifier, identifier);
    } else if (this.isNumber(this.charAtMoment)) {
      const num = this.readNumber();
      return this.newToken(TokenConst.Int, num);
    }
    this.nextChar();
    return token;
  }
  ignoreComment(isBlock: boolean) {}

  private newToken(tokenType: TokenKind, identifier: string): Token {
    return { tokenType, identifier };
  }
  private skipWhitespace() {
    do {
      this.nextChar();
    } while (
      this.charAtMoment === " " ||
      this.charAtMoment === "\n" ||
      this.charAtMoment === "\t" ||
      this.charAtMoment === "\r"
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

  isAlphabetic(character: string): boolean {
    const char = character.charCodeAt(0);
    return (
      ("a".charCodeAt(0) <= char && "z".charCodeAt(0) >= char) ||
      ("A".charCodeAt(0) <= char && "Z".charCodeAt(0) >= char) ||
      char === "_".charCodeAt(0)
    );
  }

  private nextChar() {
    if (this.readPosition >= this.input.length) {
      this.charAtMoment = "\0";
    } else {
      this.charAtMoment = this.input[this.readPosition];
    }
    this.position = this.readPosition++;
  }

  private readIdentifier(): string {
    const initial = this.position;
    while (this.isAlphabetic(this.charAtMoment) || this.isNumber(this.charAtMoment)) {
      this.nextChar();
    }
    return this.input.slice(initial, this.position);
  }

  private readNumber(): string {
    const initial = this.position;
    while (this.isNumber(this.charAtMoment)) {
      this.nextChar();
    }
    return this.input.slice(initial, this.position);
  }
}
