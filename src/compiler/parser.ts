import { Token, TokenConst, TokenKind } from "./token";

export class Parser {
  private current: number = 0;
  constructor(private tokens: Array<Token>) {}

  parse() {
    this.parseProgram();
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

  private consume(type: TokenKind, message: string) {
    if (this.check(type)) {
      return this.advance();
    }
    throw new Error(message);
  }
  private isAtEnd() {
    return this.peek().tokenType === TokenConst.Eof;
  }

  private peek() {
    return this.tokens[this.current];
  }

  private previous() {
    return this.tokens[this.current - 1];
  }

  parseProgram() {
    if (this.match(TokenConst.Package)) {
      this.parsePackageDeclaration();
    } else if (this.match(TokenConst.Import)) {
      this.parseImportDeclaration();
    } else if (this.match(TokenConst.Class)) {
      this.parseClassDeclaration();
    } else {
      throw new Error("Erro de sintaxe: esperado 'package', 'import' ou 'class'");
    }
  }
  parsePackageDeclaration() {
    this.consume(TokenConst.Identifier, "Expect package name after 'package'.");
    this.consume(TokenConst.Semicolon, "Expect ';' after the name of the package.");
  }
  // parseImportDeclarations() {
  //   this.consume(TokenConst.Identifier, "Expect package name after 'import'.");
  //   this.consume(TokenConst.Semicolon, "Expect ';' after the name of the package.");
  // }
  parseImportDeclaration() {
    this.consume(TokenConst.Identifier, "Expect package name after 'import'.");
    this.consume(TokenConst.Semicolon, "Expect ';' after the name of the package.");
  }
  parseClassDeclaration() {}
  parseClassModifier() {}
  parseClassBody() {}
  parseClassBodyDeclarations() {}
  parseClassBodyDeclaration() {}
  parseFieldMethodDeclaration() {}
  parseFieldDeclaration() {}
  parseModifier() {}
  parseVariableDeclarators() {}
  parseVariableDeclarator() {}
  parseMethodDeclaration() {}
  parseMethodDeclarator() {}
  parseFormalParameterList() {}
  parseFormalParameter() {}
  parseType() {}
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
  parseExpression() {}
  parseExpression2() {}
  parseComparationExpression() {}
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
