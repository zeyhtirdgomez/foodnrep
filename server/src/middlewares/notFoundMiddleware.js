const notFoundMiddleware = (req, res) => {
    return res.status(404).json({message : `Page not found, ${req.url} is not existing`})
};

export default notFoundMiddleware;