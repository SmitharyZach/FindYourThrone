import { pool } from "../models/pool";
import { insertBathroom, removeBathroom } from "./queries";

export const executeQueryArray = async (arr) =>
  new Promise((resolve) => {
    const stop = arr.length;
    arr.forEach(async (q, index) => {
      await pool.query(q);
      if (index + 1 === stop) resolve();
    });
  });

export const createBathroom = () => executeQueryArray([insertBathroom]);
export const dropBathroom = () => executeQueryArray([removeBathroom]);
