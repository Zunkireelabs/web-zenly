const path = require("path");
const Image = require("@11ty/eleventy-img");
const { generateHTML } = Image;

// Converts local /assets/images/*.png|jpg screenshots to WebP at their native
// resolution (no downscaling) so visual quality/pixel dimensions are
// unchanged, but file weight drops sharply — this is what was causing slow /
// broken-looking image loads in production. Already-optimized remote URLs
// (e.g. Unsplash links with their own ?w=&q= params) are left untouched.
async function imageShortcode(src, alt, attrs = {}) {
  if (!src) return "";

  const isRemote = /^https?:\/\//.test(src);
  if (isRemote && src.includes("?")) {
    // Already served through an image CDN with its own sizing/quality params.
    const rest = Object.entries(attrs)
      .map(([key, value]) => (value === undefined || value === null ? "" : ` ${key}="${value}"`))
      .join("");
    return `<img src="${src}" alt="${alt || ""}"${rest}>`;
  }

  const inputPath = isRemote ? src : path.join(__dirname, "src", src);

  const metadata = await Image(inputPath, {
    widths: [null], // keep the original pixel dimensions — no resizing
    formats: ["webp"],
    outputDir: "./_site/assets/images/optimized/",
    urlPath: "/assets/images/optimized/",
    sharpWebpOptions: { quality: 90, effort: 6 },
    filenameFormat: (id, filePath, width, format) => {
      const name = path.basename(filePath, path.extname(filePath)).replace(/[^a-z0-9-]/gi, "-");
      return `${name}-${id}.${format}`;
    }
  });

  const imageAttributes = Object.assign(
    { alt: alt || "", loading: "lazy", decoding: "async" },
    attrs
  );

  return generateHTML(metadata, imageAttributes);
}

module.exports = function (eleventyConfig) {

  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  eleventyConfig.setServerPassthroughCopyBehavior("copy");

  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/videos");
  eleventyConfig.addPassthroughCopy("src/assets/images");

  eleventyConfig.addPassthroughCopy({
    "node_modules/alpinejs/dist/cdn.min.js": "assets/vendor/alpine.min.js"
  });
  eleventyConfig.addPassthroughCopy({
    "node_modules/gsap/dist/gsap.min.js": "assets/vendor/gsap.min.js"
  });
  eleventyConfig.addPassthroughCopy({
    "node_modules/gsap/dist/ScrollTrigger.min.js": "assets/vendor/ScrollTrigger.min.js"
  });
  eleventyConfig.addPassthroughCopy({
    "node_modules/gsap/dist/SplitText.min.js": "assets/vendor/SplitText.min.js"
  });
  eleventyConfig.addPassthroughCopy({
    "node_modules/lenis/dist/lenis.min.js": "assets/vendor/lenis.min.js"
  });
  eleventyConfig.addPassthroughCopy({
    "node_modules/three/build/three.module.js": "assets/vendor/three.module.js"
  });
  eleventyConfig.addPassthroughCopy({
    "node_modules/three/build/three.core.js": "assets/vendor/three.core.js"
  });

  eleventyConfig.addGlobalData("env", process.env.ELEVENTY_ENV || "production");

  eleventyConfig.setServerOptions({
    port: 8080,
    host: "0.0.0.0",
    showAllHosts: true,
    liveReload: true,
    watch: ["_site/assets/css/tailwind.css"]
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
