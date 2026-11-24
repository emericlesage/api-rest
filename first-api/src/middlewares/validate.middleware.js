const validateBody = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            error: 'Données invalides',
            details: error.details.map(({ path, type }) => ({
                field: path.join('.'),
                type
            }))
        });
    }

    req.body = value;
    next();
};

module.exports = validateBody;
