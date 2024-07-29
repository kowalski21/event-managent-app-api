import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const storeJsonArrayToFile = async (jsonArray, filePath = "./files.json") => {
  try {
    // Ensure the directory exists
    const dir = path.dirname(filePath);
    await mkdir(dir, { recursive: true });

    // Write JSON array to file
    await writeFile(filePath, JSON.stringify(jsonArray, null, 2));
    console.log("Data successfully written to file");
  } catch (error) {
    console.error("Error writing to file", error);
  }
};

// Example usage
// const jsonArray = [
//   { id: 1, name: "Item 1", price: 10 },
//   { id: 2, name: "Item 2", price: 20 },
//   { id: 3, name: "Item 3", price: 30 },
// ];

// storeJsonArrayToFile(jsonArray);
