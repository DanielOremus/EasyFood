class CRUDManager {
  constructor(model) {
    this.model = model
  }
  async getAll(filters = {}, projection = []) {
    try {
      return await this.model.findAll({
        where: filters,
        attributes: projection,
      })
    } catch (error) {
      console.log("Error while getting list: " + error.message)
      return []
    }
  }
  async getById(id, projection = []) {
    try {
      return await this.model.findByPk(id, { attributes: projection })
    } catch (error) {
      console.log("Error while getting item by id: " + error.message)
      return null
    }
  }
  async getOne(filters = {}, projection = []) {
    try {
      return await this.model.findOne({
        where: filters,
        attributes: projection,
      })
    } catch (error) {
      console.log("Error while getting item by id: " + error.message)
      return null
    }
  }
  async create(data) {
    try {
      return await this.model.create(data)
    } catch (error) {
      throw new Error("Error while creating item: " + error)
    }
  }
  async update(id, data) {
    try {
      const item = await this.model.findByPk(id)
      if (!item) return null
      await this.model.update(data, {
        where: {
          id,
        },
      })
      return true
    } catch (error) {
      throw new Error("Error while updating item by id: " + error)
    }
  }
  async delete(id) {
    try {
      const [affectedRows] = await this.model.destroy({ where: { id } })
      return affectedRows
    } catch (error) {
      throw new Error("Error while deleting item by id: " + error)
    }
  }
}

export default CRUDManager
