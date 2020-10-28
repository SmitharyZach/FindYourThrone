import Model from "../models/model";

const reviewsModel = new Model("bathroom_reviews");

export const findReviews = async (req, res) => {
  const google_id = req.params.id;
  const columns = "*";
  const clause = ` WHERE google_id = '${google_id}'`;
  try {
    const data = await reviewsModel.select(columns, clause);
    res.status(200).json({ bathroom_reviews: data.rows });
  } catch (err) {
    res.status(400).json({ bathroom_reviews: err.stack });
  }
};

export const addReview = async (req, res) => {
  const bathroom_id = req.body.bathroom_id;
  const rating = req.body.rating;
  const review = req.body.review;
  const stocked = req.body.stocked;
  const key = req.body.key;
  const outside = req.body.outside;
  const google_id = req.body.google_id;
  const columns =
    "bathroom_id, rating, review, stocked, key, outside, google_id";
  const values = `${bathroom_id}, ${rating}, '${review}', ${stocked}, ${key}, ${outside}, '${google_id}'`;

  console.log(req.body);
  try {
    const data = await reviewsModel.insert(columns, values);
    res.status(200).json({ bathroom_reviews: data.rows });
  } catch (e) {
    res.status(400).json({ bathroom_reviews: e.stack });
  }
};
