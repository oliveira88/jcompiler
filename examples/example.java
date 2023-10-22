name1 == name2;
int num3r0 = 5;
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
