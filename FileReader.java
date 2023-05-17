import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.util.ArrayList;

/*
 * Reads data from a file
 */
public final class FileReader {

  private static File myFile;          // The File containing the data
  private static Scanner fileReader;
  
  public static ArrayList<String> getStringData(String filename) {
    createFile(filename);
    
    ArrayList<String> tempList = new ArrayList<String>();
    
    while (fileReader.hasNextLine()) {
      tempList.add(fileReader.nextLine());
    }

    fileReader.close();
    return tempList;
  }


  public static void createFile(String filename) {
    myFile = new File(filename);
    fileReader = createScanner(myFile);
  }
  
  public static Scanner createScanner(File theFile) {
    Scanner tempScanner = null;

    try {
      tempScanner = new Scanner(theFile);
    } catch(FileNotFoundException e) {
      System.out.println("File not found.");
    }

    return tempScanner;
  }
}
