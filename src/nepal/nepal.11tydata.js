// Binds each page file in this folder to its item in src/_data/cities.json by file name, so a page can be its own file (with its own title,
// description and SEO markers) while its content still comes from the data. Replaces the pagination template that generated these pages.
module.exports = {
  eleventyComputed: {
    city: (data) => (data.cities || []).find((item) => item.slug === data.page.fileSlug),
  },
};
