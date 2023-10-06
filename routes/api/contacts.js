import express from "express"

import contactsController from "./../../controllers/contacts-controller.js"
import { isEmptyBody } from "../../middlewares/isEmptyBody.js"
import { isValidId } from "../../middlewares/IsValidId.js"

const contactsRouter = express.Router()

contactsRouter.get('/',  contactsController.getAllContacts)

contactsRouter.get('/:contactId', isValidId, contactsController.getContactById)

contactsRouter.post('/', isEmptyBody, contactsController.addContact)

contactsRouter.delete('/:contactId', isValidId, contactsController.deleteContact)

contactsRouter.put('/:contactId', isValidId, isEmptyBody, contactsController.updateContact)

contactsRouter.patch('/:contactId/favorite', isValidId, isEmptyBody, contactsController.updateStatusContact)

export default contactsRouter;