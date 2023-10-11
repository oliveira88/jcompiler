export const TokenConst = {
  Identifier: "Identifier",
  Package: "Package",
  Import: "Import",
  Class: "Class",
  Public: "Public",
  Protected: "Protected",
  Private: "Private",
  Static: "Static",
  Abstract: "Abstract",
  Final: "Final",
  LBracket: "LBracket",
  RBracket: "RBracket",
  Semicolon: "Semicolon", // ;
  Colon: "Colon", // :
  Eq: "Eq",
  Assign: "Assign",
  GreaterThan: "GreaterThan",
  LowerThan: "LowerThan",
  LParen: "LParen",
  RParen: "RParen",
  Byte: "Byte",
  Short: "Short",
  Int: "Int",
  Long: "Long",
  Char: "Char",
  Float: "Float",
  Double: "Double",
  Boolean: "Boolean",
  Void: "Void",
  If: "If",
  Illegal: "Illegal",
  // Eof = "Eof",
} as const;
export type TokenKind = keyof typeof TokenConst;
export type Token = {
  tokenType: TokenKind;
  identifier: string;
};
