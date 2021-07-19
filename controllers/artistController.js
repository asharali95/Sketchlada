var Artist = require("../models/artistModel");

exports.fetchArtist = async (artistId) => {
  try {
    var artist = await Artist.findOne({ userId: artistId });
    return artist;
  } catch (error) {
    return new Error(error.message);
  }
};

exports.addArtist = async (artistProfile) => {
  try {
    var artist = await Artist.create(artistProfile);
    return artist;
  } catch (error) {
    return new Error(error.message);
  }
};
