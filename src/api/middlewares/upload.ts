import multer from "multer"
import { Request, Response, NextFunction } from "express"

const ALLOWED_MIMES = [
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
  "image/tiff",
  "image/bmp",
  "image/svg+xml",
  // Videos
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  // Documents
  "application/pdf",
]

const storage = multer.memoryStorage()

const multerInstance = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMES.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error(`File type '${file.mimetype}' is not allowed`))
    }
  },
})

export const upload = multerInstance

// Single-file upload middleware — field name "file"
export const uploadSingle = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  multerInstance.single("file")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        res.status(413).json({ message: "File is too large. Maximum size is 50 MB." })
        return
      }
      res.status(400).json({ message: err.message })
      return
    }

    if (err) {
      res.status(400).json({ message: err.message })
      return
    }

    next()
  })
}
