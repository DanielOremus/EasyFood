import fs from "fs/promises"
import { __dirname } from "./path.mjs"
import path from "path"

class UploadsManager {
  static uploadsFolderPath = path.join(__dirname, "../uploads")
  static uploadSubfolders = {
    avatars: path.join(UploadsManager.uploadsFolderPath, "./avatars"),
    dishes: path.join(UploadsManager.uploadsFolderPath, "./dishes"),
    restaurants: path.join(UploadsManager.uploadsFolderPath, "./restaurants"),
  }
  static checkSubfolder(subfolder) {
    const folderPath = UploadsManager.uploadSubfolders[subfolder]
    if (!folderPath) {
      throw new Error(`Subfolder: ${subfolder} is not supported`)
    }
    return folderPath
  }
  static async deleteFromSubfolder(subfolder, fileName) {
    try {
      const fullPath = UploadsManager.getFilePathInSubfolder(
        subfolder,
        fileName
      )
      await fs.access(fullPath)
      await fs.unlink(fullPath)
    } catch (error) {
      if (error.code === "ENOENT") return false

      console.log(error)
      throw error
    }
  }
  static async deleteAbsolute(path) {
    try {
      if (!path) return
      await fs.access(path)
      await fs.unlink(path)
    } catch (error) {
      if (error.code === "ENOENT") return false
      console.log(error)
      throw error
    }
  }
  static getFilePathInSubfolder(subfolder, fileName) {
    try {
      const folderPath = UploadsManager.checkSubfolder(subfolder)
      return `${folderPath}/${fileName}`
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  static async uploadToSubfolder(subfolder, fileName, buffer) {
    try {
      const fullPath = UploadsManager.getFilePathInSubfolder(
        subfolder,
        fileName
      )
      await fs.writeFile(fullPath, buffer)

      const relativePath = `uploads/${subfolder}/${fileName}`

      return relativePath
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  static async initUploadFolder() {
    const folders = ["avatars", "dishes", "restaurants"]

    try {
      await fs.mkdir(UploadsManager.uploadsFolderPath, { recursive: true })
      const paths = folders.map(
        (folder) => `${UploadsManager.uploadsFolderPath}/${folder}`
      )
      const promises = paths.map((path) => fs.mkdir(path, { recursive: true }))
      await Promise.all(promises)

      console.log("All upload folders were created successfully")
    } catch (error) {
      throw new Error(`Failed to create upload folders: ${error.message}`)
    }
  }
}

export default UploadsManager
