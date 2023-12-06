import { Token, TokenConst, TokenKind } from "./token";

export class Parser {
  private current: number = 0;
  private hasError: boolean = true;
  constructor(private tokens: Array<Token>) {}

  parse() {
    return this.parseProgram();
  }

  private matchClassModifier() {
    return (
      this.match(TokenConst.Public) ||
      this.match(TokenConst.Abstract) ||
      this.match(TokenConst.Final)
    );
  }

  private matchModifiers() {
    return (
      this.match(TokenConst.Public) ||
      this.match(TokenConst.Protected) ||
      this.match(TokenConst.Private) ||
      this.match(TokenConst.Static) ||
      this.match(TokenConst.Final)
    );
  }

  private checkType() {
    return (
      this.check(TokenConst.Byte) ||
      this.check(TokenConst.Short) ||
      this.check(TokenConst.Int) ||
      this.check(TokenConst.Long) ||
      this.check(TokenConst.Char) ||
      this.check(TokenConst.Float) ||
      this.check(TokenConst.Double) ||
      this.check(TokenConst.Boolean) ||
      this.check(TokenConst.Void)
    );
  }

  private checkAssignOp() {
    return (
      this.check(TokenConst.Assign) ||
      this.check(TokenConst.MultiplyAssign) ||
      this.check(TokenConst.DivisionAssign) ||
      this.check(TokenConst.ModAssign) ||
      this.check(TokenConst.PlusAssign) ||
      this.check(TokenConst.MinusAssign) ||
      this.check(TokenConst.LeftShiftAssign) ||
      this.check(TokenConst.RightShiftAssign) ||
      this.check(TokenConst.URightShiftAssign) ||
      this.check(TokenConst.ULeftShiftAssign) ||
      this.check(TokenConst.AndAssign) ||
      this.check(TokenConst.XorAssign)
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
    this.parsePackageDeclaration();
    this.parseImportDeclarations();
    this.parseClassDeclaration();
    if(this.hasError) {
        console.log("Error parsing program. Expected 'package', 'import' or 'class' declaration.");
    }
  }
  parsePackageDeclaration() {
    if (this.check(TokenConst.Package)) {
      this.hasError = false;
      this.consume(TokenConst.Package, "Expect 'package' keyword.");
      this.consume(TokenConst.Identifier, "Expect package name after 'package'.");
      this.consume(TokenConst.Semicolon, "Expect ';' after the name of the package.");
    }
  }
  parseImportDeclarations() {
    while (this.check(TokenConst.Import)) {
      this.hasError = false;
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
    this.parseClassModifier();
    if (this.check(TokenConst.Class)) {
      this.hasError = false;
      this.consume(TokenConst.Class, "Expect 'class' keyword.");
      this.consume(TokenConst.Identifier, "Expect class name after 'class'.");
      this.parseClassBody();
    }
  }
  parseClassModifier() {
    this.matchClassModifier();
  }
  parseClassBody() {
    this.consume(TokenConst.LBracket, "Expect '{' after class name.");
    while (!this.check(TokenConst.RBracket)) {
      this.parseClassBodyDeclaration();
    }
    this.consume(TokenConst.RBracket, "Expect '}' after class body.");
  }
  parseClassBodyDeclarations() {

  }
  parseClassBodyDeclaration() {
    this.matchModifiers();
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
    if (!this.check(TokenConst.LParen)) {
      this.parseVariableDeclarators();
      this.consume(TokenConst.Semicolon, "Expect ';' after variable declaration.");
    } else {
      this.parseMethodDeclaration();
    }
  }

  parseVariableDeclarators() {
    if (this.check(TokenConst.Assign)) {
      this.consume(TokenConst.Assign, "Expect '=' after variable name.");
      this.parseExpression();
    } else if(this.check(TokenConst.Comma)) {
      this.consume(TokenConst.Comma, "Expect ',' after variable declaration.");
      this.consume(TokenConst.Identifier, "Expect identifier name after ','.");
      this.parseVariableDeclarators();
    }
  }

  parseMethodDeclaration() {
    this.parseMethodDeclarator();
    this.parseBlock();

  }
  parseMethodDeclarator() {
    this.consume(TokenConst.LParen, "Expect '(' after method name.");
    this.parseFormalParameter();
    this.consume(TokenConst.RParen, "Expect ')' after method parameters.");
  }

  parseFormalParameter() {
    if(this.checkType()) {
      this.parseType();
      this.consume(TokenConst.Identifier, "Expect identifier name after type.");
      this.parseFormalParameterList()
    }
  }

  parseFormalParameterList() {
    while (this.check(TokenConst.Comma)) {
      this.consume(TokenConst.Comma, "Expect ',' after parameter.");
      this.consume(TokenConst.Identifier, "Expect identifier name after ','.");
      this.parseFormalParameterList();
    }
  }

  parseBlock() {
    this.consume(TokenConst.LBracket, "Expect '{' after method name.");
    this.parseBlockStatement();
    this.consume(TokenConst.RBracket, "Expect '}' after block.");
  }
  parseBlockStatement() {
    if(this.checkType()) {
      this.parseLocalVariableDeclaration();
      this.consume(TokenConst.Semicolon, "Expect ';' after variable declaration.");
      this.parseBlockStatement();
    } else if(this.check(TokenConst.LBracket)) {
      this.parseStatement()
      this.parseBlockStatement();
    }
  }
  parseLocalVariableDeclaration() {
    this.parseType();
    this.consume(TokenConst.Identifier, "Expect identifier name after type.");
    this.parseVariableDeclarators();
  }
  parseStatement() {
    switch (true) {
      case this.check(TokenConst.LBracket): {
        this.parseBlock();
        break;
      }
      case this.check(TokenConst.Semicolon): {
        this.parseEmptyStatement();
        break;
      }
      case this.check(TokenConst.Identifier): {
        this.consume(TokenConst.Identifier, "Expect identifier name after type.");
        this.parseStatementExpression();
        this.consume(TokenConst.Semicolon, "Expect ';' after statement.");
        break;
      }
      case this.check(TokenConst.Do): {
        this.parseDoStatement();
        break;
      }
      case this.check(TokenConst.Break): {
        this.parseBreakStatement();
        break;
      }
      case this.check(TokenConst.Continue): {
        this.parseContinueStatement();
        break;
      }
      case this.check(TokenConst.Return): {
        this.parseReturnStatement();
        break;
      }
      case this.check(TokenConst.If): {
        this.parseIfStatement();
        break;
      }
      case this.check(TokenConst.While): {
        this.parseWhileStatement();
        break;
      }
      case this.check(TokenConst.Try): {
        this.parseTryStatement();
        break;
      }
      case this.check(TokenConst.New): {
        this.parseClassInstanceCreationExpression();
        break;
      }
    }
  }

  parseEmptyStatement() {
    this.consume(TokenConst.Semicolon, "Expect ';' after statement.");
  }
  parseStatementExpression() {
    if(this.checkAssignOp()) {
      this.parseAssignment();
    } else if(this.check(TokenConst.LParen)) {
      this.parseMethodInvocation();
    } else if(this.check(TokenConst.Colon)) {
      this.parseLabeledStatement();
    }
  }
  parseLabeledStatement() {
    this.consume(TokenConst.Colon, "Expect ':' after label name.");
    this.parseStatement();
  }

  parseIfStatement() {
    this.consume(TokenConst.If, "Expect 'if' keyword.");
    this.consume(TokenConst.LParen, "Expect '(' after 'if'.");
    this.parseExpression();
    this.consume(TokenConst.RParen, "Expect ')' after expression.");
    this.parseStatement();
    if(this.check(TokenConst.Else)) {
      this.parseIfThenElseStatement();
    }
  }
  parseIfThenElseStatement() {
    this.consume(TokenConst.Else, "Expect 'else' keyword.");
    this.parseStatement();
  }
  parseWhileStatement() {
    this.consume(TokenConst.While, "Expect 'while' keyword.");
    this.consume(TokenConst.LParen, "Expect '(' after 'while'.");
    this.parseExpression();
    this.consume(TokenConst.RParen, "Expect ')' after expression.");
    this.parseStatement();
  }
  parseDoStatement() {
    this.consume(TokenConst.Do, "Expect 'do' keyword.");
    this.parseStatement();
    this.consume(TokenConst.While, "Expect 'while' keyword.");
    this.consume(TokenConst.LParen, "Expect '(' after 'while'.");
    this.parseExpression();
    this.consume(TokenConst.RParen, "Expect ')' after expression.");
    this.consume(TokenConst.Semicolon, "Expect ';' after statement.");
  }
  parseBreakStatement() {
    this.consume(TokenConst.Break, "Expect 'break' keyword.");
    if(this.check(TokenConst.Identifier)) {
      this.consume(TokenConst.Identifier, "Expect identifier name after 'break'.");
    }
    this.consume(TokenConst.Semicolon, "Expect ';' after statement.");
  }
  parseContinueStatement() {
    this.consume(TokenConst.Continue, "Expect 'continue' keyword.");
    if(this.check(TokenConst.Identifier)) {
      this.consume(TokenConst.Identifier, "Expect identifier name after 'continue'.");
    }
    this.consume(TokenConst.Semicolon, "Expect ';' after statement.");
  }
  parseReturnStatement() {
    this.consume(TokenConst.Return, "Expect 'return' keyword.");
    if(!this.check(TokenConst.Semicolon)) {
      this.parseExpression();
    }
    this.consume(TokenConst.Semicolon, "Expect ';' after statement.");
  }
  parseTryStatement() {
    this.consume(TokenConst.Try, "Expect 'try' keyword.");
    this.parseBlock();
    this.parseCatchesStatement();
  }
  parseCatchesStatement() {
    if(this.check(TokenConst.Catch)) {
      this.parseCatchClause();
      this.parseFinally();
    } else if(this.check(TokenConst.Finally)) {
      this.parseFinally();
    }
  }
  parseCatchClause() {
    if(this.check(TokenConst.Catch)) {
      this.consume(TokenConst.Catch, "Expect 'catch' keyword.");
      this.consume(TokenConst.LParen, "Expect '(' after 'catch'.");
      this.parseFormalParameter();
      this.consume(TokenConst.RParen, "Expect ')' after parameter.");
      this.parseBlock();
      this.parseCatchClause();
    }
  }
  parseFinally() {
    this.consume(TokenConst.Finally, "Expect 'finally' keyword.");
    this.parseBlock();
  }
  parseAssignment() {
    this.parseAssignmentOperator();
    this.parseExpression();
  }
  parseAssignmentOperator() {
    const allowedOperators: Array<Partial<TokenKind>> = [
      TokenConst.Assign,
      TokenConst.MultiplyAssign,
      TokenConst.DivisionAssign,
      TokenConst.ModAssign,
      TokenConst.PlusAssign,
      TokenConst.MinusAssign,
      TokenConst.LeftShiftAssign,
      TokenConst.RightShiftAssign,
      TokenConst.URightShiftAssign,
      TokenConst.ULeftShiftAssign,
      TokenConst.AndAssign,
      TokenConst.XorAssign,
    ];

    if (allowedOperators.includes(this.currentToken.tokenType)) {
      this.consume(this.currentToken.tokenType, `Expected a valid operator, but got ${this.currentToken.tokenType}.`);
    }
  }
  parseExpression() {
    this.parseComparationExpression();
    this.parseExpression2();
  }
  parseComparationExpression() {
    this.parseOperationalExpression();
    this.parseRelationalExpression();
  }
  parseExpression2() {
    if(this.check(TokenConst.Or)) {
      this.consume(TokenConst.Or, "Expect '||' after expression.");
      this.parseComparationExpression();
      this.parseExpression2();
    } else if(this.check(TokenConst.And)){
      this.consume(TokenConst.And, "Expect '&&' after expression.");
      this.parseComparationExpression();
      this.parseExpression2();
    }
  }
  parseRelationalExpression() {
    switch (true) {
      case this.check(TokenConst.Eq): {
        this.consume(TokenConst.Eq, "Expect '==' after expression.");
        this.parseOperationalExpression();
        this.parseRelationalExpression();
        break;
      }
      case this.check(TokenConst.NotEq): {
        this.consume(TokenConst.NotEq, "Expect '!=' after expression.");
        this.parseOperationalExpression();
        this.parseRelationalExpression();
        break;
      }
      case this.check(TokenConst.LowerThan): {
        this.consume(TokenConst.LowerThan, "Expect '<' after expression.");
        this.parseOperationalExpression();
        this.parseRelationalExpression();
        break;
      }
      case this.check(TokenConst.LowerOrEqualThan): {
        this.consume(TokenConst.LowerOrEqualThan, "Expect '<=' after expression.");
        this.parseOperationalExpression();
        this.parseRelationalExpression();
        break;
      }
      case this.check(TokenConst.GreaterThan): {
        this.consume(TokenConst.GreaterThan, "Expect '>' after expression.");
        this.parseOperationalExpression();
        this.parseRelationalExpression();
        break;
      }
      case this.check(TokenConst.GreaterOrEqualThan): {
        this.consume(TokenConst.GreaterOrEqualThan, "Expect '>=' after expression.");
        this.parseOperationalExpression();
        this.parseRelationalExpression();
        break;
      }
    }
  }
  parseOperationalExpression() {
    this.parseTerm();
    this.parseAdditiveExpression();
  }
  parseAdditiveExpression() {
    if(this.check(TokenConst.Plus)) {
      this.consume(TokenConst.Plus, "Expect '+' after unary expression.");
      this.parseAdditiveExpression();
    } else if(this.check(TokenConst.Minus)) {
      this.consume(TokenConst.Minus, "Expect '-' after unary expression.");
      this.parseAdditiveExpression();
    }
  }
  parseTerm() {
    this.parseUnaryExpression();
    this.parseMultiplicativeExpression();
  }
  parseMultiplicativeExpression() {
    switch (true) {
      case this.check(TokenConst.Multiply): {
        this.consume(TokenConst.Multiply, "Expect '*' after term.");
        this.parseUnaryExpression();
        break;
      }
      case this.check(TokenConst.Division): {
        this.consume(TokenConst.Division, "Expect '/' after term.");
        this.parseUnaryExpression();
        break;
      }
      case this.check(TokenConst.Mod): {
        this.parseMultiplicativeExpression();
        this.consume(TokenConst.Mod, "Expect '%' after term.");
        this.parseUnaryExpression();
        this.parseMultiplicativeExpression();
        break;
      }
    }
  }
  parseUnaryExpression() {
    if(this.check(TokenConst.Plus)) {
      this.consume(TokenConst.Plus, "Expect '+' after unary expression.");
      this.consume(TokenConst.Identifier, "Expect identifier name after unary expression.");
      this.parseMethodInvocation();
    } else if(this.check(TokenConst.Minus)) {
      this.consume(TokenConst.Minus, "Expect '-' after unary expression.");
      this.consume(TokenConst.Identifier, "Expect identifier name after unary expression.");
      this.parseMethodInvocation();
    } else {
      this.consume(TokenConst.Identifier, "Expect identifier name after unary expression.");
      this.parseMethodInvocation();
    }
  }
  parseMethodInvocation() {
    if(this.check(TokenConst.LParen)) {
      this.consume(TokenConst.LParen, "Expect '(' after method name.");
      this.parseArgumentList();
      this.consume(TokenConst.RParen, "Expect ')' after method parameters.");
    } else if(this.check(TokenConst.Super)) {
      this.consume(TokenConst.Super, "Expect 'super' keyword.");
      this.consume(TokenConst.Dot, "Expect '.' after super keyword.");
      this.consume(TokenConst.Identifier, "Expect identifier name after '.'.");
      this.consume(TokenConst.LParen, "Expect '(' after identifier.");
      this.parseArgumentList();
      this.consume(TokenConst.RParen, "Expect ')' after method parameters.");
    }
  }
  parseClassInstanceCreationExpression() {
    this.consume(TokenConst.New, "Expect 'new' keyword.");
    this.consume(TokenConst.Identifier, "Expect identifier name after 'new'.");
    this.consume(TokenConst.LParen, "Expect '(' after identifier.");
    this.parseArgumentList();
    this.consume(TokenConst.RParen, "Expect ')' after method parameters.");
  }
  parseArgumentList() {
    this.parseExpression();
    while(this.check(TokenConst.Comma)) {
      this.consume(TokenConst.Comma, "Expect ',' after argument.");
      this.parseArgumentList();
    }
  }
}
