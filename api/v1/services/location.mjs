import GeneralModel from "./general.mjs"

class LocationModel extends GeneralModel {
  static TABLE = "locations"
}

export default new LocationModel(LocationModel.TABLE)
