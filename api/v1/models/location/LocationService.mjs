import Location from "./Location.mjs"
import CRUDManager from "../CRUDManager.mjs"

class LocationService extends CRUDManager {}

export default new LocationService(Location)
