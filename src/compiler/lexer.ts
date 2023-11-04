import { Token, TokenConst, TokenKind } from "./token";

export class Lexer {
  private position: number = 0;
  private readPosition: number = 0;
  private charAtMoment!: string;
  private keywords = {
    package: this.newToken(TokenConst.Package, "package", false),
    import: this.newToken(TokenConst.Import, "import", false),
    class: this.newToken(TokenConst.Class, "class", false),
    public: this.newToken(TokenConst.Public, "public", false),
    protected: this.newToken(TokenConst.Protected, "protected", false),
    private: this.newToken(TokenConst.Private, "private", false),
    static: this.newToken(TokenConst.Static, "static", false),
    abstract: this.newToken(TokenConst.Abstract, "abstract", false),
    final: this.newToken(TokenConst.Final, "final", false),
    byte: this.newToken(TokenConst.Byte, "byte", false),
    short: this.newToken(TokenConst.Short, "short", false),
    int: this.newToken(TokenConst.Int, "int", false),
    long: this.newToken(TokenConst.Long, "long", false),
    char: this.newToken(TokenConst.Char, "char", false),
    float: this.newToken(TokenConst.Float, "float", false),
    double: this.newToken(TokenConst.Double, "double", false),
    boolean: this.newToken(TokenConst.Boolean, "boolean", false),
    void: this.newToken(TokenConst.Void, "void", false),
    if: this.newToken(TokenConst.If, "if", false),
    else: this.newToken(TokenConst.Else, "else", false),
    do: this.newToken(TokenConst.Do, "do", false),
    while: this.newToken(TokenConst.While, "while", false),
    switch: this.newToken(TokenConst.Switch, "switch", false),
    case: this.newToken(TokenConst.Case, "case", false),
    goto: this.newToken(TokenConst.Goto, "goto", false),
    continue: this.newToken(TokenConst.Continue, "continue", false),
    const: this.newToken(TokenConst.Const, "const", false),
    default: this.newToken(TokenConst.Default, "default", false),
    extends: this.newToken(TokenConst.Extends, "extends", false),
    implements: this.newToken(TokenConst.Implements, "implements", false),
    instanceof: this.newToken(TokenConst.Instanceof, "instanceof", false),
    interface: this.newToken(TokenConst.Interface, "interface", false),
    native: this.newToken(TokenConst.Native, "native", false),
    synchronized: this.newToken(TokenConst.Synchronized, "sychronized", false),
    this: this.newToken(TokenConst.This, "this", false),
    throw: this.newToken(TokenConst.This, "throw", false),
    throws: this.newToken(TokenConst.This, "throws", false),
    transient: this.newToken(TokenConst.Transient, "transient", false),
    new: this.newToken(TokenConst.New, "new", false),
    return: this.newToken(TokenConst.Return, "return", false),
    break: this.newToken(TokenConst.Break, "break", false),
    try: this.newToken(TokenConst.Try, "try", false),
    catch: this.newToken(TokenConst.Catch, "catch", false),
    finally: this.newToken(TokenConst.Finally, "finally", false),
    super: this.newToken(TokenConst.Super, "super", false),
    volatile: this.newToken(TokenConst.Volatile, "volatile", false)
  } as const;
  constructor(private input: string) {
    this.nextChar();
  }
  tokenize(): Array<Token> {
    const tokens: Array<Token> = [];
    let token: Token | undefined;
    do {
      token = this.nextToken();
      if (token !== undefined && token.tokenType !== TokenConst.Ignore) {
        tokens.push(token);
      }
    } while (token?.tokenType !== TokenConst.Eof);

    return tokens;
  }
  private nextToken() {
    switch (this.charAtMoment) {
      case "{":
        return this.newToken(TokenConst.LBracket, this.charAtMoment);
      case "}":
        return this.newToken(TokenConst.RBracket, this.charAtMoment);
      case ";":
        return this.newToken(TokenConst.Semicolon, this.charAtMoment);
      case ":":
        return this.newToken(TokenConst.Colon, this.charAtMoment);
      case "(":
        return this.newToken(TokenConst.LParen, this.charAtMoment);
      case ")":
        return this.newToken(TokenConst.RParen, this.charAtMoment);
      case '"':
        const { literal, valid } = this.readLiteral();
        if (valid) {
          return this.newToken(TokenConst.Literal, literal);
        } else {
          return this.newToken(TokenConst.Illegal, literal, false);
        }
      case "'":
        return this.newToken(TokenConst.SingleQuote, this.charAtMoment);
      case "=": {
        if (this.peekChar() === "=") {
          this.nextChar();
          return this.newToken(TokenConst.Eq, "==");
        }
        return this.newToken(TokenConst.Assign, this.charAtMoment);
      }
      case "/": {
        if (this.peekChar() === "/") {
          this.skipComments();
          return this.newToken(TokenConst.Ignore, null, false);
        } else if (this.peekChar() === "*") {
          this.skipMultilineComments();
          return this.newToken(TokenConst.Ignore, null, false);
        }
        return this.newToken(TokenConst.Division, this.charAtMoment);
      }
      case ">":
        return this.newToken(TokenConst.GreaterThan, this.charAtMoment);
      case "<":
        return this.newToken(TokenConst.LowerThan, this.charAtMoment);
      case ".":
        return this.newToken(TokenConst.Dot, this.charAtMoment);
      case " ":
      case "\n":
      case "\t":
      case "\r": {
        this.skipWhitespace();
        return this.newToken(TokenConst.Ignore, null, false);
      }
      case "\0":
        return this.newToken(TokenConst.Eof, this.charAtMoment);
    }

    if (this.isNumber(this.charAtMoment)) {
      if (this.isAlphabetic(this.peekChar())) {
        const identifier = this.readIdentifier();
        return this.newToken(TokenConst.Illegal, identifier, false);
      }
      const num = this.readNumber();
      return this.newToken(TokenConst.Number, num, false);
    }
    if (this.isAlphabetic(this.charAtMoment)) {
      const identifier = this.readIdentifier();
      // if (this.isIllegalIdentifier(identifier)) {
      //   return this.newToken(TokenConst.Illegal, identifier);
      // }
      const keyword = this.keywords[identifier as keyof typeof this.keywords];
      if (keyword) {
        return keyword;
      }
      return this.newToken(TokenConst.Identifier, identifier, false);
    }
    this.nextChar();
    return this.newToken(TokenConst.Illegal, this.charAtMoment);
  }

  private newToken(tokenType: TokenKind, identifier: string | null, walk = true): Token {
    if (walk) {
      this.nextChar();
    }
    return { tokenType, identifier };
  }
  private skipWhitespace() {
    while (
      this.charAtMoment === " " ||
      this.charAtMoment === "\n" ||
      this.charAtMoment === "\t" ||
      this.charAtMoment === "\r"
    ) {
      this.nextChar();
    }
  }

  private skipComments() {
    this.nextChar();
    this.nextChar();
    while (this.charAtMoment !== "\n") {
      this.nextChar();
    }
  }

  private skipMultilineComments() {
    this.nextChar();
    this.nextChar();
    while (this.charAtMoment !== "*" && this.peekChar() !== "/") {
      this.nextChar();
    }
    this.nextChar();
    this.nextChar();
  }

  private peekChar(): string {
    if (this.readPosition >= this.input.length) {
      return "\0";
    }
    return this.input[this.readPosition];
  }

  private isNumber(ch: string): boolean {
    const char = ch.charCodeAt(0);
    return "0".charCodeAt(0) <= char && char <= "9".charCodeAt(0);
  }

  private isAlphabetic(character: string): boolean {
    const char = character.charCodeAt(0);
    return (
      ("a".charCodeAt(0) <= char && "z".charCodeAt(0) >= char) ||
      ("A".charCodeAt(0) <= char && "Z".charCodeAt(0) >= char) ||
      char === "$".charCodeAt(0) ||
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

  private readLiteral(): { literal: string; valid: boolean } {
    this.nextChar();
    const initial = this.position;
    while (this.charAtMoment !== '"') {
      if (this.charAtMoment === "\n") {
        return { literal: this.input.slice(initial, this.position), valid: false };
      }
      this.nextChar();
    }
    return { literal: this.input.slice(initial, this.position), valid: true };
  }

  private isIllegalIdentifier(identifier: string): boolean {
    for (let i = 0; i < identifier.length; i++) {
      if (!this.isAlphabetic(identifier[i])) return true;
    }
    return false;
  }
}
