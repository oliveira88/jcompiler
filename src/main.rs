use jcompiler::lexer::lexer::Lexer;

fn main() {
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
    let mut lex = Lexer::new(input.into());
    lex.next_token();
}
