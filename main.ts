import { Lexer } from "./lexer";

const lexer = new Lexer(`
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
`);

while (true) {
  const token = lexer.nextToken();
  console.log({ token });
  if (token === null) {
    break;
  }
}
