import SelectionHelper from "../../../utils/selectionHelpers/SelectionHelper.mjs"

class CRUDManager {
  constructor(model) {
    this.model = model
  }
  async getAll(
    filters = {},
    projection = null,
    populateParams = null,
    options = {}
  ) {
    try {
      return await this.model.findAll({
        where: filters,
        attributes: projection,
        include: populateParams,
        ...options,
      })
    } catch (error) {
      console.log("Error while getting list: " + error.message)
      return []
    }
  }

  async getById(id, projection = null, populateParams = null, options = {}) {
    try {
      return await this.model.findByPk(id, {
        attributes: projection,
        include: populateParams,
        ...options,
      })
    } catch (error) {
      console.log("Error while getting item by id: " + error.message)
      return null
    }
  }
  async getOne(
    filters = {},
    projection = null,
    populateParams = null,
    options = {}
  ) {
    try {
      return await this.model.findOne({
        where: filters,
        attributes: projection,
        include: populateParams,
        ...options,
      })
    } catch (error) {
      console.log("Error while getting item by id: " + error.message)
      return null
    }
  }
  async create(data, options = {}) {
    try {
      return await this.model.create(data, options)
    } catch (error) {
      throw new Error("Error while creating item: " + error)
    }
  }
  async update(id, data, options = {}) {
    try {
      const [affectedRows] = await this.model.update(data, {
        where: {
          id,
        },
        ...options,
      })
      return affectedRows
    } catch (error) {
      throw new Error("Error while updating item by id: " + error)
    }
  }

  async updateOne(filters, data, options = {}) {
    try {
      const [affectedRows] = await this.model.update(data, {
        where: filters,
        ...options,
      })
      return affectedRows
    } catch (error) {
      throw new Error("Error while updating item: " + error)
    }
  }
  async delete(id, options = {}) {
    try {
      const affectedRows = await this.model.destroy({
        where: {
          id: id,
        },
        ...options,
      })

      return affectedRows
    } catch (error) {
      throw new Error("Error while deleting item by id: " + error)
    }
  }
}

export default CRUDManager
