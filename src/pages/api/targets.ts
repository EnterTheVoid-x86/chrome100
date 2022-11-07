import type { NextApiRequest, NextApiResponse } from "next";
import Database from "better-sqlite3";
import type { cros_brand, cros_target } from "chrome-versions";
import { chromeDBPath } from "chrome-versions/db";

const db = new Database(chromeDBPath);

const getTargets = db.prepare<[]>(
  "SELECT * FROM cros_target ORDER BY board COLLATE NOCASE ASC;"
);
const getBrands = db.prepare<[board: string]>(
  "SELECT * FROM cros_brand WHERE board = ? ORDER BY brand COLLATE NOCASE ASC;"
);

export type Targets = [target: cros_target, brands: cros_brand[]][];

const targetsAPI = (req: NextApiRequest, res: NextApiResponse) => {
  res.json(
    (getTargets.all() as cros_target[]).map((target) => [
      target,
      getBrands.all(target.board) as cros_brand[],
    ]) as Targets
  );
};

export default targetsAPI;