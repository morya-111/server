import { Language } from "../entity/Language";
import ApiFeatures from "../utils/ApiFeatures";

export const getAllLanguages = async (req, res, next) => {
  try {
    const features = new ApiFeatures(req.query, {
      select: false,
      pagination: false,
    });

    const languages = await Language.find({
      ...features.builtQuery,
    });

    res.status(200).json({
      status: "success",
      data: {
        languages,
      },
    });
  } catch (error) {
    next(error);
  }
};
