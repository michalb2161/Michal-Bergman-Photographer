const Image = require('../models/Image');
const Category = require('../models/Category');
const BlogPost = require('../models/BlogPost');
const ContactMessage = require('../models/ContactMessage');
const Testimonial = require('../models/Testimonial');
const { asyncHandler } = require('../utils/asyncHandler');

const summary = asyncHandler(async (req, res) => {
  const [images, categories, posts, messages, testimonialsVisible, testimonialsTotal] =
    await Promise.all([
      Image.countDocuments(),
      Category.countDocuments(),
      BlogPost.countDocuments(),
      ContactMessage.countDocuments(),
      Testimonial.countDocuments({ visible: true }),
      Testimonial.countDocuments()
    ]);
  const unread = await ContactMessage.countDocuments({ read: false });
  res.json({
    success: true,
    data: {
      images,
      categories,
      posts,
      messages,
      unreadMessages: unread,
      testimonialsVisible,
      testimonialsTotal
    }
  });
});

module.exports = { summary };
