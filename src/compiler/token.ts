const KeywordsConst = {
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
//prettier-ignore
const SymbolsConst = {
  LBracket: "LBracket",               //  {
  RBracket: "RBracket",               //  }
  Semicolon: "Semicolon",             //  ;
  Dot: "Dot",                         //  .
  Colon: "Colon",                     //  :
  Assign: "Assign",                   //  =
  Eq: "Eq",                           //  ==
  GreaterThan: "GreaterThan",         //  >
  LowerThan: "LowerThan",             //  <
  LParen: "LParen",                   //  (
  RParen: "RParen",                   //  )
  Division: "Division",               //  /
  Mod: "Mod",                         //  %
  Plus: "Plus",                       //  +
  Increment: "Increment",             //  ++
  Minus: "Minus",                     //  -
  Multiply: "Multiply",               //  *
  MultiplyAssign: "MultiplyAssign",   //  *=
  DivisionAssign: "DivisionAssign",   //  /=
  ModAssign: "ModAssign",             //  %=
  PlusAssign: "PlusAssign",           //  +=
  MinusAssign: "MinusAssign",         //  -=
  Quote: "Quote",                     //  "
  SingleQuote: "SingleQuote",         //  '
} as const;

export const Keywords = {
  package: "Package",
  import: "Import",
  class: "Class",
  public: "Public",
  protected: "Protected",
  private: "Private",
  static: "Static",
  abstract: "Abstract",
  final: "Final",
  byte: "Byte",
  short: "Short",
  int: "Int",
  long: "Long",
  char: "Char",
  float: "Float",
  double: "Double",
  boolean: "Boolean",
  void: "Void",
  if: "If",
  else: "Else",
  do: "Do",
  while: "While",
  switch: "Switch",
  case: "Case",
  goto: "Goto",
  continue: "Continue",
  const: "Const",
  default: "Default",
  extends: "Extends",
  implements: "Implements",
  instanceof: "Instanceof",
  interface: "Interface",
  native: "Native",
  synchronized: "Sychronized",
  this: "This",
  throw: "Throw",
  throws: "Throws",
  transient: "Transient"
} as const;

export const TokenConst = {
  ...KeywordsConst,
  ...SymbolsConst,
  Identifier: "Identifier",
  Number: "Number",
  Literal: "Literal",
  Illegal: "Illegal",
  Eof: "Eof",
  Ignore: "Ignore"
} as const;
export type TokenKind = keyof typeof TokenConst;
export type Token = {
  tokenType: TokenKind;
  lexeme?: string;
  literal: string | null;
  line?: number;
};
