import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import Contact from '../models/Contact.js';
import { contactAddSchema, contactUpdateFavoriteSchema } from "../models/Contact.js";


const getAllContacts = async (req, res ) => {
        const result = await Contact.find();
        res.json(result)
};

const getContactById = async (req, res ) => {
        const { contactId } = req.params;
        const result = await Contact.findById(contactId);
        if (!result) {
            throw HttpError(404);
        }
        res.json(result)
};

const addContact = async (req, res ) => {
        const { error } = contactAddSchema.validate(req.body)
        if (error) {
            throw HttpError(400, error.message)
        }
        const result = await Contact.create(req.body);
        res.status(201).json(result)
};

const deleteContact = async (req, res ) => {
        const { contactId } = req.params;
        const result = await Contact.findByIdAndDelete(contactId);
        if (!result) {
            throw HttpError(404);
        }
        res.json({
            message: "contact deleted"
        })
};

const updateContact = async (req, res ) => {
        const { error } = contactAddSchema.validate(req.body)
        if (error) {
            throw HttpError(400, error.message)
        }

        const { contactId } = req.params;

        const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});

        if (!result) {
            throw HttpError(404, `Contatct with id ${contactId} not found.`);
        }

        res.json(result)
};

const updateStatusContact = async (req, res ) => {
        const { error } = contactUpdateFavoriteSchema.validate(req.body)
        if (error) {
            throw HttpError(400, error.message)
        }

        const { contactId } = req.params;

        const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});

        if (!result) {
            throw HttpError(404, `Contatct with id ${contactId} not found.`);
        }

        res.json(result)
};


export default {
    getAllContacts: ctrlWrapper(getAllContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    deleteContact: ctrlWrapper(deleteContact),
    updateContact: ctrlWrapper(updateContact),
    updateStatusContact: ctrlWrapper(updateStatusContact),
}