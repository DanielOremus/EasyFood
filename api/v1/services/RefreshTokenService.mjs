import CRUDManager from "../models/CRUDManager/index.mjs"
import RefreshToken from "../models/RefreshToken.mjs"
class RefreshTokenService extends CRUDManager {}

export default new RefreshTokenService(RefreshToken)
