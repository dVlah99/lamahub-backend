import { Router, Request, Response, NextFunction } from "express";
import fs from "fs";

const router = Router();

// Skupi sve podatke iz storage JSON-a
router.get("", (req: Request, res: Response) => {
  const jsonFile = readJsonFile("./src/urlStorage.json");
  res.status(500).json(jsonFile);
});

//Dodaj novi red u vec postojeceg klijenta - RADI
router.post(
  "/:key",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("dummy console log za test");
      const { key } = req.params;
      const bodies: LamaProduct[] = req.body;

      for (const body of bodies) {
        await checkData(body);
      }

      const jsonFile: Record<string, LamaProduct[]> = readJsonFile(
        "./src/urlStorage.json"
      );

      if (!jsonFile.hasOwnProperty(key)) {
        throw new Error("Key not found in JSON file");
      }

      const dataToEdit: LamaProduct[] = jsonFile[key] || [];

      for (const body of bodies) {
        dataToEdit.push(body);
      }

      jsonFile[key] = bodies;
      writeJsonFile("./src/urlStorage.json", jsonFile);
      res.status(200).send("Data added successfully");
    } catch (error) {
      next(error);
    }
  }
);

//Dodaj novi key
router.put("/:key", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key } = req.params;
    const keyInUpper = key.toUpperCase();

    await checkKey(keyInUpper);
    const jsonFile: Record<string, LamaProduct[]> = readJsonFile(
      "./src/urlStorage.json"
    );
    checkForKeyCollision(keyInUpper, jsonFile);

    const dataToEdit: LamaProduct[] = jsonFile[keyInUpper] || [];

    jsonFile[keyInUpper] = dataToEdit;
    writeJsonFile("./src/urlStorage.json", jsonFile);
    res.status(200).send("Data added successfully");
  } catch (error) {
    next(error);
  }
});

//Izbrisi key i sve njegove podatke
router.delete(
  "/removeKey/:key",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { key } = req.params;

      await checkKey(key);
      const jsonFile = readJsonFile("./src/urlStorage.json");

      if (!jsonFile.hasOwnProperty(key)) {
        return res.status(404).send("Key not found");
      }

      delete jsonFile[key];

      writeJsonFile("./src/urlStorage.json", jsonFile);

      res.status(200).send("Key and associated data successfully deleted");
    } catch (error) {
      next(error);
    }
  }
);

async function checkData(data: LamaProduct) {
  if (!data.name || !data.url) {
    throw new Error("Body data is not valid");
  }
}

const readJsonFile = (filePath: string): Record<string, LamaProduct[]> => {
  const fileString = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileString);
};

const writeJsonFile = (
  filePath: string,
  data: Record<string, LamaProduct[]>
): void => {
  fs.writeFileSync(filePath, JSON.stringify(data), "utf8");
};

async function checkKey(key: string | undefined) {
  if (!key) {
    throw new Error("Invalid key");
  }
}

function checkForKeyCollision(
  value: string,
  jsonFile: Record<string, LamaProduct[]>
): void {
  for (const key in jsonFile) {
    if (Object.prototype.hasOwnProperty.call(jsonFile, key)) {
      if (key === value) {
        throw new Error(`Key collision detected: ${value}`);
      }
    }
  }
}

interface LamaProduct {
  name: string;
  url: string;
}

export default router;
