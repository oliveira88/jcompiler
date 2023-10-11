const KeywordsConst = {
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
  Byte: "Byte",
  Int: "Int",
  Short: "Short",
  Long: "Long",
  Char: "Char",
  Float: "Float",
  Double: "Double",
  Boolean: "Boolean",
  Void: "Void",
  If: "If",
  Else: "Else",
  While: "While",
  Do: "Do",
  Break: "Break",
  Continue: "Continue",
  Return: "Return",
  Try: "Try",
  Catch: "Catch",
  Finally: "Finally",
  Super: "Super",
  New: "New",
  This: "This",
  Const: "Const",
  Default: "Default",
  Extends: "Extends",
  Implements: "Implements",
  Instanceof: "Instanceof",
  Interface: "Interface",
  Native: "Native",
  Synchronized: "Synchronized",
  Throw: "Throw",
  Throws: "Throws",
  Transient: "Transient",
  Volatile: "Volatile",
  Switch: "Switch",
  Case: "Case",
  Goto: "Goto"
} as const;

const SymbolsConst = {
  LBracket: "LBracket", //  {
  RBracket: "RBracket", //  }
  Semicolon: "Semicolon", //  ;
  Colon: "Colon", //  :
  Assign: "Assign", //  =
  Eq: "Eq", //  ==
  GreaterThan: "GreaterThan", //  >
  LowerThan: "LowerThan", //  <
  LParen: "LParen", //  (
  RParen: "RParen", //  )
  RParen: "RParen", //  )
  Division: "Division", //  /
  Mod: "Mod", //  %
  Plus: "Plus", //  +
  Increment: "Increment", //  ++
  Minus: "Minus", //  -
  Multiply: "Multiply", //  *

  MultiplyAssign: "MultiplyAssign", //  *=
  DivisionAssign: "DivisionAssign", //  /=
  ModAssign: "ModAssign", //  %=
  PlusAssign: "PlusAssign", //  +=
  MinusAssign: "MinusAssign" //  -=
} as const;
export const TokenConst = {
  ...KeywordsConst,
  ...SymbolsConst,

  //Number
  Number: "Number",
  Illegal: "Illegal"
  // Eof = "Eof",
} as const;
export type TokenKind = keyof typeof TokenConst;
export type Token = {
  tokenType: TokenKind;
  identifier: string;
};
