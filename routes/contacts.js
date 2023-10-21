import express from "express"

import contactsController from "../controllers/contacts.js"
import { isEmptyBody } from "../middlewares/isEmptyBody.js"
import { isValidId } from "../middlewares/IsValidId.js"
import authenticate from '../middlewares/authenticate.js'
import { contactAddSchema, contactFavotiteSchema } from "../models/Contact.js"
import { validateBody } from "../middlewares/validateBody.js"
import upload from "../middlewares/upload.js"

const validateAddSchema = validateBody(contactAddSchema);
const validateFavoriteSchema = validateBody(contactFavotiteSchema);

const contactsRouter = express.Router()

contactsRouter.use(authenticate)

contactsRouter.get('/',  contactsController.getAllContacts)

contactsRouter.get('/:contactId', isValidId, contactsController.getContactById)

contactsRouter.post('/', isEmptyBody, validateAddSchema, contactsController.addContact)

contactsRouter.delete('/:contactId', isValidId, contactsController.deleteContact)

contactsRouter.put('/:contactId', isValidId, isEmptyBody, validateAddSchema, contactsController.updateContact)

contactsRouter.patch('/:contactId/favorite', isValidId, isEmptyBody, validateFavoriteSchema, contactsController.updateStatusContact)

export default contactsRouter;