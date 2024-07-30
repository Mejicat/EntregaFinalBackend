import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Función para asegurarse de que una carpeta existe
const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname, { recursive: true });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = 'uploads/';
    if (req.path.includes('documents')) {
      dest = path.resolve(__dirname, 'uploads/documents/');
    } else if (req.path.includes('products')) {
      dest = path.resolve(__dirname, 'uploads/products/');
    } else if (req.path.includes('profiles')) {
      dest = path.resolve(__dirname, 'uploads/profiles/');
    } else {
      dest = path.resolve(__dirname, 'uploads/');
    }

    ensureDirectoryExistence(dest);
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}-${Date.now()}`);
  }
});

export const uploader = multer({ storage: storage });
