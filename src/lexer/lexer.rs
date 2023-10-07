use anyhow::Result;

#[derive(Debug, PartialEq)]
pub enum Token {
    Identifier,
    Package,
    Import(String),
    Class(String),
    Public(String),
    Protected(String),
    Private(String),
    Static(String),
    Abstract(String),
    Final(String),
    LBracket,
    RBracket,
    Semicolon, // ;
    Colon,     // :
    Eq,
    Assign,
    LParen,
    RParen,
    Byte(String),
    Short(String),
    Int(String),
    Long(String),
    Char(String),
    Float(String),
    Double(String),
    Boolean(String),
    Void(String),
    If(String),
}

pub struct Lexer {
    position: usize,
    read_position: usize,
    char: u8,
    input: Vec<u8>,
}

impl Lexer {
    fn new(input: String) -> Lexer {
        return Lexer {
            position: 0,
            read_position: 0,
            char: 0,
            input: input.into_bytes(),
        };
    }

    fn next_token(&mut self) -> Result<Token> {
        let token = match self.char {
            b'{' => Token::LBracket,
            b'}' => Token::RBracket,
            b';' => Token::Semicolon,
            b':' => Token::Colon,
            b'=' => Token::Assign,
            b'(' => Token::LParen,
            b')' => Token::RParen,
            _ => todo!("Precisa ver isso aí"),
        };
        return Ok(token);
    }
}

#[cfg(test)]
mod test {
    use anyhow::Result;

    use super::{Lexer, Token};

    #[test]
    fn get_next_token() -> Result<()> {
        let s = String::from("package main;");
        let input = r#"
          package example;
          import java.util.ArrayList;
          import java.util.List;

          public class Example {
            private ArrayList<String> names;

            public Example() {
              names = new ArrayList<>();
            }

            public void addName(String name) {
              names.add(name);
            }

            public List<String> getNames() {
              return new ArrayList<>(names);
            }
          }
          "#;
        let lex = Lexer::new(input.into());
        let tokens: Vec<Token> = vec![Token::Package, Token::Identifier];

        return Ok(());
    }
}
