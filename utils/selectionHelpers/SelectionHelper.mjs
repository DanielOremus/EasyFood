import QueryParser from "./QueryParser.mjs"
import { Op } from "sequelize"

class SelectionHelper {
  static applyFilters(whereOptions, filters) {
    for (const filterObj of filters) {
      switch (filterObj.filterType) {
        case "minValue":
          whereOptions[filterObj.fieldName] = {
            [Op.gte]: filterObj.filterValue,
          }
          break
        case "maxValue":
          whereOptions[filterObj.fieldName] = {
            [Op.lte]: filterObj.filterValue,
          }
          break
        case "in":
          whereOptions[filterObj.fieldName] = {
            [Op.in]: filterObj.filterValue,
          }
          break
        case "search":
          whereOptions[filterObj.fieldName] = {
            [Op.like]: `%${filterObj.filterValue}%`,
          }
          break

        default:
          console.log(`Unsupported filterType: ${filterObj.filterType}`)
      }
    }
    return whereOptions
  }
  static applyActions(options, actions) {
    actions.forEach((actionObj) => {
      switch (actionObj.type) {
        case "sort":
          options.order = [...options.order, [actionObj.field, actionObj.order]]
          break
        case "skip":
          options.offset = actionObj.value
          break
        case "limit":
          options.limit = actionObj.value
          break
        default:
          console.log(`Unsupported action type: ${actionObj.type}`)
          break
      }
    })
    return options
  }
  static applySelection(reqQuery, fieldsConfig) {
    const { actions, filters } = QueryParser.parse(reqQuery, fieldsConfig)

    let optionsObj = {}
    if (filters.length) optionsObj = this.applyFilters(optionsObj, filters)
    if (actions.length) optionsObj = this.applyActions(optionsObj, actions)

    return optionsObj
  }
  static applyFiltersSelection(reqQuery, fieldsConfig, filterOptions = {}) {
    const filters = QueryParser.parseFilters(reqQuery, fieldsConfig)
    console.log("filters-----------------")

    console.log(filters)
    if (filters.length) filterOptions = this.applyFilters(filterOptions, filters)
    return filterOptions
  }
  static applyActionsSelection(reqQuery) {
    const actions = QueryParser.parseActions(reqQuery)
    console.log("actions-----------------")

    console.log(actions)

    let actionsOptions = {}

    if (actions.length) actionsOptions = this.applyActions(actionsOptions, actions)
    return actionsOptions
  }
}

export default SelectionHelper
