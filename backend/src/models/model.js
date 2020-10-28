import { pool } from "./pool";

class Model {
  constructor(table) {
    this.pool = pool;
    this.table = table;
    this.pool.on(
      "error",
      (err, client) => `Error, ${err}, on idle client${client}`
    );
  }

  async select(columns, clause) {
    let query = `SELECT id, ${columns} FROM ${this.table}`;
    if (clause) query += clause;
    console.log(query);
    return this.pool.query(query);
  }

  async selectWithReturn(columns, clause) {
    let query = `
    SELECT ${columns} FROM ${this.table}
    RETURNING ${columns}
    `;
    if (clause) query += clause;
    console.log(query);
    return this.pool.query(query);
  }

  async insertWithReturn(columns, values) {
    const query = `
      INSERT INTO ${this.table}(${columns})
      VALUES ('${values}')
      RETURNING id, ${columns} 
    `;
    console.log(query);
    return this.pool.query(query);
  }

  async insert(columns, values) {
    const query = `
    INSERT INTO ${this.table}(${columns})
    VALUES (${values})
  `;
    console.log(query);
    return this.pool.query(query);
  }

  async average(id) {
    const query = `
      SELECT ROUND(AVG(br.rating)) AS rating_average
      FROM bathroom_reviews br
      INNER JOIN bathrooms b
        ON br.google_id = b.google_id
        AND b.google_id = '${id}'
    `;
    console.log(query);
    return this.pool.query(query);
  }
}

export default Model;
