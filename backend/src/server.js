require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDatabase } = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const blogRoutes = require('./routes/blogRoutes');
const contactRoutes = require('./routes/contactRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const homepageSectionRoutes = require('./routes/homepageSectionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const port = process.env.PORT || 4000;
const uploadRoot = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  })
);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '2mb' }));

app.use('/uploads', express.static(uploadRoot));

const projectImagesDir = path.join(__dirname, '..', '..', 'images');
if (fs.existsSync(projectImagesDir)) {
  app.use('/site-media', express.static(projectImagesDir));
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'michal-bregman-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/homepage-sections', homepageSectionRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'לא נמצא' });
});

app.use(errorHandler);

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`API listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Failed to connect MongoDB', err);
    process.exit(1);
  });
