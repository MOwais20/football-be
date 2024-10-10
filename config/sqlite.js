module.exports = function (app, upload, storage) {
    const sqlite3 = require('sqlite3').verbose();
    // Set up SQLite database
    const db = new sqlite3.Database('./config/ad-manager.db');

    // Create ads table
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS ads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image BLOB,
    contentType TEXT,
    redirectUrl TEXT,
    uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
    });


    // Route to handle file upload
    app.post('/upload', upload.single('image'), (req, res) => {
        if (!req.file) {
            console.error('No file uploaded');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { buffer, mimetype } = req.file;
        const redirectUrl = req.body.redirectUrl || '';

        // console.log('File buffer length:', buffer?.length); // Check buffer length
        // console.log('File mimetype:', mimetype);

        // Insert the new ad into the database
        db.run(
            `INSERT INTO ads (image, contentType, redirectUrl) VALUES (?, ?, ?)`,
            [buffer, mimetype, redirectUrl],
            function (err) {
                if (err) {
                    console.error('Failed to save ad:', err);
                    return res.status(500).json({ error: 'Failed to save ad' });
                }

                console.log('Ad uploaded successfully with ID:', this.lastID);
                res.json({ message: 'Ad uploaded successfully' });
            }
        );
    });

    // Route to get the latest ads
    app.get('/ads', (req, res) => {
        db.all(`SELECT id, image, contentType, redirectUrl, uploadedAt FROM ads ORDER BY uploadedAt DESC LIMIT 3`, (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch ads' });
            }

            // Convert the image buffer to a base64 string for display
            const ads = rows.map(row => ({
                id: row.id,
                imageUrl: row.image
                    ? `data:${row.contentType};base64,${row.image.toString('base64')}`
                    : null,
                redirectUrl: row.redirectUrl,
                uploadedAt: row.uploadedAt
            }));

            res.json(ads);
        });
    });

    // Update the redirect URL for a specific ad
    app.put('/ads/:id', (req, res) => {
        const { id } = req.params;
        const { redirectUrl } = req.body;

        if (!redirectUrl) {
            return res.status(400).json({ error: 'Redirect URL is required' });
        }

        db.run(
            `UPDATE ads SET redirectUrl = ? WHERE id = ?`,
            [redirectUrl, id],
            function (err) {
                if (err) {
                    console.error('Failed to update redirect URL:', err);
                    return res.status(500).json({ error: 'Failed to update redirect URL' });
                }
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Ad not found' });
                }

                res.json({ message: 'Redirect URL updated successfully' });
            }
        );
    });

    // Delete a specific ad (and its image)
    app.delete('/ads/:id', (req, res) => {
        const { id } = req.params;

        db.run(`DELETE FROM ads WHERE id = ?`, [id], function (err) {
            if (err) {
                console.error('Failed to delete ad:', err);
                return res.status(500).json({ error: 'Failed to delete ad' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Ad not found' });
            }

            res.json({ message: 'Ad deleted successfully' });
        });
    });

    module.exports = db;
};




