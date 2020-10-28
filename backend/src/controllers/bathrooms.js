import Model from "../models/model";

const bathroomsModel = new Model("bathrooms");

export const bathroomsPage = async (req, res) => {
  try {
    const data = await bathroomsModel.select("bathroom_name");
    res.status(200).json({ bathrooms: data.rows });
  } catch (err) {
    res.status(400).json({ bathrooms: err.stack });
  }
};

export const addBathroom = async (req, res) => {
  const { bathroom_name } = req.body;
  const { google_id } = req.body;
  console.log(bathroom_name, google_id);
  const columns = "bathroom_name, google_id";
  const values = `${bathroom_name}', '${google_id}`;
  try {
    const data = await bathroomsModel.insertWithReturn(columns, values);
    res.status(200).json({ bathrooms: data.rows });
  } catch (err) {
    res.status(400).json({ bathrooms: err.stack });
  }
};

export const findBathroom = async (req, res) => {
  const google_id = req.params.id;
  const columns = "id";
  const clause = ` WHERE google_id = '${google_id}'`;
  try {
    const data = await bathroomsModel.select(columns, clause);
    console.log("res", data);
    res.status(200).json({ bathrooms: data.rows });
  } catch (err) {
    res.status(400).json({ bathrooms: err.stack });
  }
};

export const findOrCreateBathroom = async (req, res) => {
  const id = req.params.id;
  const { bathroom_name } = req.body;
  const { google_id } = req.body;
  const columns = "google_id";
  const clause = ` WHERE google_id = '${id}'`;
  const values = `${id}`;
  try {
    const data = await bathroomsModel.select(columns, clause);
    console.log("rows", data.rows);
    if (data.rowCount === 0) {
      const data2 = await bathroomsModel.insertWithReturn(columns, values);
      console.log("rows 2", data2.rows);
      res.status(200).json({ bathrooms: data2.rows });
    } else {
      res.status(200).json({ bathrooms: data.rows });
    }
  } catch (err) {
    res.status(400).json({ bathrooms: err.stack });
  }
};

export const findAverage = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await bathroomsModel.average(id);
    console.log("res", data);
    res.status(200).json({ bathrooms: data.rows });
  } catch (err) {
    res.status(400).json({ bathrooms: err.stack });
  }
};
