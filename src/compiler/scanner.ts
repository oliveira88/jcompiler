import { JCompiler } from "../main";
import { Token, TokenConst, TokenKind } from "./token";

export class Scanner {
  private tokens: Token[] = [];
  private start: number = 0;
  private current: number = 0;
  private line: number = 1;
  private keywords: Record<string, TokenKind> = {
    package: TokenConst.Package,
    import: TokenConst.Import,
    class: TokenConst.Class,
    public: TokenConst.Public,
    protected: TokenConst.Protected,
    private: TokenConst.Private,
    static: TokenConst.Static,
    abstract: TokenConst.Abstract,
    final: TokenConst.Final,
    byte: TokenConst.Byte,
    short: TokenConst.Short,
    int: TokenConst.Int,
    long: TokenConst.Long,
    char: TokenConst.Char,
    float: TokenConst.Float,
    double: TokenConst.Double,
    boolean: TokenConst.Boolean,
    void: TokenConst.Void,
    if: TokenConst.If,
    else: TokenConst.Else,
    do: TokenConst.Do,
    while: TokenConst.While,
    switch: TokenConst.Switch,
    case: TokenConst.Case,
    goto: TokenConst.Goto,
    continue: TokenConst.Continue,
    const: TokenConst.Const,
    default: TokenConst.Default,
    extends: TokenConst.Extends,
    implements: TokenConst.Implements,
    instanceof: TokenConst.Instanceof,
    interface: TokenConst.Interface,
    native: TokenConst.Native,
    synchronized: TokenConst.Synchronized,
    this: TokenConst.This,
    throw: TokenConst.This,
    throws: TokenConst.This,
    transient: TokenConst.Transient,
    new: TokenConst.New,
    return: TokenConst.Return,
    break: TokenConst.Break,
    try: TokenConst.Try,
    catch: TokenConst.Catch,
    finally: TokenConst.Finally,
    super: TokenConst.Super,
    volatile: TokenConst.Volatile
  } as const;
  constructor(private source: string) {}
  scanTokens() {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }
    this.tokens.push({
      tokenType: "Eof",
      lexeme: "",
      literal: null,
      line: this.line
    });
    return this.tokens;
  }
  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private scanToken() {
    const c = this.advance();
    switch (c) {
      case "{":
        this.addToken(TokenConst.LBracket);
        break;
      case "}":
        this.addToken(TokenConst.RBracket);
        break;
      case ";":
        this.addToken(TokenConst.Semicolon);
        break;
      case ":":
        this.addToken(TokenConst.Colon);
        break;
      case "(":
        this.addToken(TokenConst.LParen);
        break;
      case ")":
        this.addToken(TokenConst.RParen);
        break;
      case '"':
        this.literal();
        break;
      case ">":
        this.addToken(TokenConst.GreaterThan);
        break;
      case "<":
        this.addToken(TokenConst.LowerThan);
        break;
      case ".":
        this.addToken(TokenConst.Dot);
        break;
      case "/": {
        if (this.match("/")) {
          this.skipSingleLineComment();
        } else if (this.match("*")) {
          this.skipMultilineComment();
        } else {
          this.addToken(TokenConst.Division);
        }
        break;
      }
      case "=": {
        this.addToken(this.match("=") ? TokenConst.Eq : TokenConst.Assign);
        break;
      }

      case " ":
      case "\t":
      case "\r":
        break;
      case "\n":
        this.line++;
        break;
      case "\0":
        this.addToken(TokenConst.Eof);
        break;
      default:
        if (this.isNumber(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          JCompiler.error(this.line, `Unexpected character ${c}.`);
        }
        break;
    }
  }

  private skipSingleLineComment() {
    while (this.peek() !== "\n" && !this.isAtEnd()) {
      this.advance();
    }
  }

  private skipMultilineComment() {
    while (this.peek() !== "*" && this.peekNext() !== "/" && !this.isAtEnd()) {
      this.advance();
    }
  }

  private advance(): string {
    return this.source.charAt(this.current++);
  }

  private addToken(tokenType: Token["tokenType"], literal: string | null = null) {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push({
      tokenType,
      lexeme: text,
      literal,
      line: this.line
    });
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) {
      return false;
    }
    if (this.source.charAt(this.current) !== expected) {
      return false;
    }
    this.current++;
    return true;
  }

  private peek(): string {
    if (this.isAtEnd()) {
      return "\0";
    }
    return this.source.charAt(this.current);
  }

  private peekNext() {
    if (this.current + 1 >= this.source.length) {
      return "\0";
    }
    return this.source.charAt(this.current + 1);
  }
  private literal() {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === "\n") {
        this.line++;
      }
      this.advance();
    }

    if (this.isAtEnd()) {
      JCompiler.error(this.line, "Unterminated string.");
      return;
    }
    this.advance();

    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenConst.Literal, value);
  }
  private isNumber(c: string) {
    const char = c.charCodeAt(0);
    return "0".charCodeAt(0) <= char && char <= "9".charCodeAt(0);
  }

  private number() {
    while (this.isNumber(this.peek())) {
      this.advance();
    }
    if (this.peek() === "." && this.isNumber(this.peekNext())) {
      this.advance();
      while (this.isNumber(this.peek())) {
        this.advance();
      }
    }
    const value = this.source.substring(this.start, this.current);
    this.addToken(TokenConst.Number, value);
  }

  private isAlpha(c: string) {
    const char = c.charCodeAt(0);
    return (
      ("a".charCodeAt(0) <= char && "z".charCodeAt(0) >= char) ||
      ("A".charCodeAt(0) <= char && "Z".charCodeAt(0) >= char) ||
      char === "$".charCodeAt(0) ||
      char === "_".charCodeAt(0)
    );
  }
  private identifier() {
    while (this.isAlpha(this.peek()) || this.isNumber(this.peek())) {
      this.advance();
    }
    const text = this.source.substring(this.start, this.current);
    const type = this.keywords[text] || TokenConst.Identifier;
    this.addToken(type);
  }
}
