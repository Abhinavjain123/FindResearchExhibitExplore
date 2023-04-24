const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi)=>({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if(clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.paperSchema = Joi.object({
    paper: Joi.object({
        title: Joi.string().required().escapeHTML(),
        link: Joi.string(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.suggestionSchema = Joi.object({
    suggestion: Joi.object({
        body: Joi.string().required().escapeHTML()
    }).required()
})

module.exports.webinarSchema = Joi.object({
    webinar: Joi.object({
        title: Joi.string().required().escapeHTML(),
        link: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    })
})

module.exports.seminarSchema = Joi.object({
    seminar: Joi.object({
        title: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
        speaker: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required()
})