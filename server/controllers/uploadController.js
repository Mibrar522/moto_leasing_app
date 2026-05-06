const { getDatabaseUploadById } = require('../utils/storage');

exports.getUploadedFile = async (req, res) => {
    try {
        const upload = await getDatabaseUploadById(req.params.id);

        if (!upload) {
            return res.status(404).json({ message: 'Uploaded file not found' });
        }

        res.setHeader('Content-Type', upload.mime_type || 'application/octet-stream');
        res.setHeader('Content-Length', upload.file_size || upload.data.length);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.setHeader(
            'Content-Disposition',
            `inline; filename="${String(upload.original_name || upload.file_name || 'file').replace(/"/g, '')}"`
        );

        return res.status(200).send(upload.data);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to load uploaded file', error: error.message });
    }
};
