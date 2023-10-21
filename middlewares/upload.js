import multer from "multer";
import path from 'path';

import { HttpError } from '../helpers/HttpError.js'
import { nanoid } from "nanoid";

const destination = path.resolve('temp');

const storage = multer.diskStorage({
    destination,
    filename: (req, file, cb) => {
        const uniquePreffix = `${nanoid(10)}`;
        const fileName = `${uniquePreffix}__${file.originalname}`;

        cb(null, fileName);
    }
})

const limits = {
    fileSize: 5 * 1024* 1024,
}

const fileFilter = (req, file, cb) => {
    if (file.originalname.split('.').pop() === ('exe' || 'pdf')) {
        cb(new Error('File extention not allow'))
    }

    cb(null, true)
}

const upload = multer({
    storage,
    limits,
    //fileFilter
})

export default upload;