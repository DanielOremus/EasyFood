import pool from "../../../db/connectToDb.mjs"

class GeneralModel {
  constructor(tableName) {
    this.table = tableName
  }
  static getProjectionRow(projectionArr) {
    if (!projectionArr.length) return "*"
    return projectionArr.join(",")
  }
  async getList(projection = []) {
    try {
      const projectionRow = GeneralModel.getProjectionRow(projection)
      const sql = `SELECT ${projectionRow} FROM ${this.table}`
      const [rows] = await pool.query(sql)
      return rows
    } catch (error) {
      console.log("Error while getting list")
      console.log(error)
      return []
    }
  }
  async getById(id, projection = []) {
    try {
      const projectionRow = GeneralModel.getProjectionRow(projection)
      const sql = `SELECT ${projectionRow} FROM ${this.table} WHERE id = ?`
      const [rows] = await pool.query(sql, [id])
      return rows[0] || null
    } catch (error) {
      console.log("Error while getting item by id: ")
      console.log(error)
      return null
    }
  }
  async create(itemData) {
    try {
      const sql = `INSERT INTO ${this.table} SET ?`
      const [result] = await pool.query(sql, [itemData])
      return { id: result.insertId, ...itemData }
    } catch (error) {
      throw new Error("Error while creating item: " + error)
    }
  }
  async updateById(id, itemData) {
    const connection = await pool.getConnection()
    try {
      const updateSql = `UPDATE ${this.table} SET ? WHERE id = ?`
      const selectSql = `SELECT * FROM ${this.table} WHERE id = ?`
      connection.beginTransaction()

      const [result] = await connection.query(updateSql, [itemData, id])
      if (result.affectedRows === 0) {
        return null
      }

      const [rows] = await connection.query(selectSql, [id])
      return rows[0]
    } catch (error) {
      connection.rollback()
      throw new Error("Error while updating item by id: " + error)
    } finally {
      pool.releaseConnection(connection)
    }
  }
  async deleteById(id) {
    try {
      const sql = `DELETE FROM ${this.table} WHERE id = ?`
      const [result] = await pool.query(sql, [id])
      if (result.affectedRows === 0) {
        return null
      }
      return { id }
    } catch (error) {
      throw new Error("Error while deleting item by id: " + error)
    }
  }
}

export default GeneralModel
