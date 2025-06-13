const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: 'URL missing' });
  }

  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return res.json({
      message: 'For YouTube videos, please visit ovdownloader.com'
    });
  }

  const command = `yt-dlp -g "${url}"`;

  exec(command, (err, stdout, stderr) => {
    if (err || !stdout) {
      return res.status(500).json({ error: 'Failed to fetch video URL' });
    }

    const lines = stdout.trim().split('\n');
    if (lines.length < 1) {
      return res.status(404).json({ error: 'Video link not found' });
    }

    res.json({ download: lines[0] });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
