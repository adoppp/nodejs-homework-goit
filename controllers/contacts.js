import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import Contact from '../models/Contact.js';

const getAllContacts = async (req, res) => {
    const { _id: owner } = req.user;

    const result = await Contact.find({ owner },
    //  "-crearedAt", "-updatedAt"
    )
    //  .populate("owner");
    res.json(result)
};

const getContactById = async (req, res) => {
    const { _id: owner } = req.user;

    const { contactId } = req.params;
    const result = await Contact.findOne({_id: contactId, owner});
    if (!result) {
        throw HttpError(404);
    }
    res.json(result)
};

const addContact = async (req, res) => {
    const { _id: owner } = req.user;
    const result = await Contact.create({ ...req.body, owner });
    res.status(201).json(result)
};

const deleteContact = async (req, res) => {
    const { _id: owner } = req.user; 

    const { contactId } = req.params;
    const result = await Contact.findOneAndDelete({_id: contactId, owner});
    if (!result) {
        throw HttpError(404);
    }
    res.json({
        message: "contact deleted"
    })
};

const updateContact = async (req, res) => {
    const { _id: owner } = req.user;
    const { contactId } = req.params;

    const result = await Contact.findOneAndUpdate({ _id: contactId, owner}, req.body, {new: true});

    if (!result) {
        throw HttpError(404, `Contatct with id ${contactId} not found.`);
    }

    res.json(result)
};

const updateStatusContact = async (req, res) => {
    const { _id: owner } = req.user;
    const { contactId } = req.params;

    const result = await Contact.findOneAndUpdate({ _id: contactId, owner }, req.body, {new: true});

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