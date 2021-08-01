exports.shapeArtData = ({ body, files, user }) => {
  var gallery = [];
//   var formats = new Set();
  files.forEach(({ filename, mimetype }) => {
    gallery.push(filename);
    // formats.add(mimetype.split("/")[1]);
  });
  body.gallery = gallery;
  body.artist = user._id;
//   body.formats = [...formats];
  return body;
};
