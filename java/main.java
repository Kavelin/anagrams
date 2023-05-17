import java.util.*;
public class MyConsole {
  public static ArrayList<ArrayList<String>> fourList = new ArrayList<ArrayList<String>>();
  public static ArrayList<String> list;
  public static String word;
  public static int score = 0;
  public static void main(String[] args) {
    
    init();

    ArrayList<String> shuffled = shuffle(split(word));
    System.out.print("Rules: Enter a word between a length of 3 and 6 and try and form words from the given letters as fast as you can.\n");
    System.out.print(shuffled + "\nUnscramble a word (\"\\\" to shuffle): ");
    
    Scanner scan = new Scanner(System.in);
    while (true) {
      String input = scan.next();
      if (input.length() >= 3 && input.length() <= 6 && check(input) && hasWord(input)) {
        if (input.length() == 6) score += 10;
        else score += input.length();
      } 
      else if (input.equals("\\")) shuffled = shuffle(split(word));
      else if (input.length() < 3) System.out.print("Too short!\n");
      else if (input.length() > 6) System.out.print("Too long!\n");
      else System.out.print("Not a word (or you already entered it)!\n");
      
      System.out.print(shuffled + "\nScore: " + score + ", Unscramble a word (\"\\\" to shuffle): ");
    }
  }

  public static void init () {
    list = FileReader.getStringData("words.txt");
    word = list.get((int) (Math.random() * list.size()));
    while (word.length() != 6) word = list.get((int) (Math.random() * 10000));
    for (int i = 0; i < 4; i++) {
      ArrayList<String> temp = new ArrayList<String>();
      for (int j = 0; j < list.size(); j++) {
        String addTo = list.get(j);
        if (addTo.length() == i + 3 && check(addTo)) temp.add(addTo);
      }
      fourList.add(temp);
    }
    
  }
  public static boolean check (String input) {
    String temp = word + "";
    for (int i = 0; i < input.length(); i++) {
      int ind = temp.indexOf(input.substring(i, i+1));
      if (ind == -1) return false;
      temp = temp.substring(0, ind) + temp.substring(ind + 1);
    }
    return true;
  }
  public static boolean hasWord(String str) {
    ArrayList<String> curList = fourList.get(str.length() - 3);
    for (int i = 0; i < curList.size(); i++) {
      if (curList.get(i).equals(str)) {
        curList.remove(i);
        return true;
      }
    }
    return false;
  }
  public static ArrayList<String> split(String str) {
    ArrayList<String> ret = new ArrayList<String>();
    for (int i = 0; i < str.length(); i++) ret.add(str.substring(i, i+1));
    return ret;
  }
  public static ArrayList<String> shuffle(ArrayList<String> array) {
    for (int i = array.size() - 1; i > 0; i--) {
        int j = (int) (Math.random() * (i + 1));
        String temp = array.get(i);
        array.set(i, array.get(j));
        array.set(j, temp);
    }
    return array;
  }
}
