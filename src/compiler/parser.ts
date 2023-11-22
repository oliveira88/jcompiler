import { Token, TokenConst, TokenKind } from "./token";

export class Parser {
  private current: number = 0;
  constructor(private tokens: Array<Token>) {}

  parse() {
    return this.parseProgram();
  }

  private matchClassModifier() {
    return (
      this.match(TokenConst.Public) ||
      this.match(TokenConst.Protected) ||
      this.match(TokenConst.Private) ||
      this.match(TokenConst.Static) ||
      this.match(TokenConst.Abstract) ||
      this.match(TokenConst.Final)
    );
  }

  private matchModifier() {
    return (
      this.match(TokenConst.Public) ||
      this.match(TokenConst.Protected) ||
      this.match(TokenConst.Private) ||
      this.match(TokenConst.Static) ||
      this.match(TokenConst.Final)
    );
  }

  private match(...types: Array<TokenKind>) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenKind) {
    if (this.isAtEnd()) {
      return false;
    }
    return this.peek().tokenType === type;
  }

  private advance() {
    if (!this.isAtEnd()) {
      this.current++;
    }
    return this.previous();
  }

  private consume(type: TokenKind, message: string = "") {
    if (this.check(type)) {
      return this.advance();
    }
    console.error(message);
  }
  private isAtEnd() {
    return this.currentToken.tokenType === TokenConst.Eof;
  }

  get currentToken() {
    return this.peek();
  }
  private peek() {
    return this.tokens[this.current];
  }

  private previous() {
    return this.tokens[this.current - 1];
  }

  parseProgram() {
    let erro = true;
    this.parsePackageDeclaration();
    this.parseImportDeclarations();
    this.parseClassDeclaration();
  }
  parsePackageDeclaration() {
    if (this.check(TokenConst.Package)) {
      this.consume(TokenConst.Package, "Expect 'package' keyword.");
      this.consume(TokenConst.Identifier, "Expect package name after 'package'.");
      this.consume(TokenConst.Semicolon, "Expect ';' after the name of the package.");
    }
  }
  parseImportDeclarations() {
    while (this.check(TokenConst.Import)) {
      this.parseImportDeclaration();
    }
  }
  parseImportDeclaration() {
    this.consume(TokenConst.Import, "Expect 'import' keyword.");
    this.consume(TokenConst.Identifier, "Expect identifier name after 'import'.");
    while (this.check(TokenConst.Dot)) {
      this.consume(TokenConst.Dot, "Expect '.' after the name of the package.");
      this.consume(TokenConst.Identifier, "Expect identifier name after '.'");
    }
    this.consume(TokenConst.Semicolon, "Expect ';' after the name of the package.");
  }
  parseClassDeclaration() {
    if (this.check(TokenConst.Class)) {
      this.parseClassModifier();
      this.consume(TokenConst.Class, "Expect 'class' keyword.");
      this.consume(TokenConst.Identifier, "Expect class name after 'class'.");
      this.parseClassBody();
    }
  }
  parseClassModifier() {
    if (this.matchClassModifier()) {
      this.parseClassModifier();
    }
  }
  parseClassBody() {
    this.consume(TokenConst.LBracket, "Expect '{' after class name.");
    this.parseClassBodyDeclarations();
    this.consume(TokenConst.RBracket, "Expect '}' after class body.");
  }
  parseClassBodyDeclarations() {
    while (!this.check(TokenConst.RBracket)) {
      this.parseClassBodyDeclaration();
    }
  }
  parseClassBodyDeclaration() {
    this.parseModifiers();
    this.parseType();
    this.consume(TokenConst.Identifier, "Expect identifier name after type.");
    this.parseFieldMethodDeclaration();
  }
  parseModifiers() {
    const allowedModifiers: Array<Partial<TokenKind>> = [
      TokenConst.Public,
      TokenConst.Protected,
      TokenConst.Private,
      TokenConst.Static,
      TokenConst.Final
    ];
    while (allowedModifiers.includes(this.currentToken.tokenType)) {
      this.consume(this.currentToken.tokenType);
    }
  }
  parseModifier() {}
  parseType() {
    const allowedTypes: Array<Partial<TokenKind>> = [
      TokenConst.Byte,
      TokenConst.Short,
      TokenConst.Int,
      TokenConst.Long,
      TokenConst.Char,
      TokenConst.Float,
      TokenConst.Double,
      TokenConst.Boolean,
      TokenConst.Void
    ];

    if (allowedTypes.includes(this.currentToken.tokenType)) {
      this.consume(this.currentToken.tokenType, `Expected a valid type, but got ${this.currentToken.tokenType}.`);
    }
  }
  parseFieldMethodDeclaration() {
    if (this.check(TokenConst.LParen)) {
      this.parseMethodDeclaration();
    } else {
      this.parseFieldDeclaration();
    }
  }
  parseFieldDeclaration() {
    this.parseVariableDeclarators();
    this.consume(TokenConst.Semicolon, "Expect ';' after variable declaration.");
  }
  parseVariableDeclarators() {
    this.parseVariableDeclarator();
    while (this.check(TokenConst.Comma)) {
      this.consume(TokenConst.Comma, "Expect ',' after variable declaration.");
      this.parseVariableDeclarators();
    }
  }
  parseVariableDeclarator() {
    if (this.check(TokenConst.Assign)) {
      this.consume(TokenConst.Assign, "Expect '=' after variable name.");
      this.parseExpression();
    }
  }
  parseMethodDeclaration() {
    this.consume(TokenConst.LParen, "Expect '(' after method name.");
    this.parseFormalParameterList();
    this.consume(TokenConst.RParen, "Expect ')' after method parameters.");
    this.parseBlock();
  }
  parseMethodDeclarator() {}
  parseFormalParameterList() {
    this.parseFormalParameter();
    while (this.check(TokenConst.Comma)) {
      this.consume(TokenConst.Comma, "Expect ',' after parameter.");
      this.parseFormalParameterList();
    }
  }
  parseFormalParameter() {
    this.parseType();
    this.consume(TokenConst.Identifier, "Expect identifier name after type.");
  }
  parseBlock() {}
  parseBlockStatements() {}
  parseBlockStatement() {}
  parseLocalVariableDeclaration() {}
  parseStatement() {}
  parseEmptyStatement() {}
  parseLabeledStatement() {}
  parseStatementExpression() {}
  parseIfStatement() {}
  parseIfThenElseStatement() {}
  parseWhileStatement() {}
  parseDoStatement() {}
  parseBreakStatement() {}
  parseContinueStatement() {}
  parseReturnStatement() {}
  parseTryStatement() {}
  parseCatchesStatement() {}
  parseCatchClause() {}
  parseFinally() {}
  parseAssignment() {}
  parseAssignmentOperator() {}
  parseExpression() {
    this.parseComparationExpression();
    this.parseExpression2();
  }
  parseComparationExpression() {
    this.parseOperationalExpression();
    this.parseRelationalExpression();
  }
  parseExpression2() {}
  parseRelationalExpression() {}
  parseOperationalExpression() {}
  parseAdditiveExpression() {}
  parseTerm() {}
  parseMultiplicativeExpression() {}
  parseUnaryExpression() {}
  parseMethodInvocation() {}
  parseClassInstanceCreationExpression() {}
  parseArgumentList() {}
}
