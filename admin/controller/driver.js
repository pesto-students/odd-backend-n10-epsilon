import { Driver } from "@odd_common/common";

const defaultResponseObject = {
  success: true,
  data: null, //{},[] or null
  message: "",
  error: null,
};
export const getAllDriverList = async (req, res) => {
  try {
    let where = {},
      data = req.query,
      sortBy = {},
      mobile_number;

    if (data.query) {
      console.log(data.query);
      // mobile_number = data.;
      where = {
        $or: [{ mobile_number: { $regex: data.query, $options: "i" } }],
      };
    }

    if (data.status) {
      where.status = data.status;
    }

    if (data.sort_field) {
      sortBy[data.sort_field] =
        data.order_by && data.order_by == "asc" ? 1 : -1;
    } else {
      sortBy.created_at = -1;
    }

    const driver = await Driver.aggregate([
      {
        $match: where,
      },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "driver_id",
          as: "orders",
        },
      },
      {
        $project: {
          total_order: { $size: "$orders" },
          mobile_number: true,
          image: true,
          first_name: true,
          last_name: true,
          driver_status: true,
          isOnline: true,
        },
      },

      {
        $skip: parseInt(req.query.skip || 0),
      },
      {
        $limit: parseInt(req.query.limit || 10),
      },
      {
        $sort: sortBy,
      },
    ]);
    let response = { ...defaultResponseObject };
    response.data = driver;
    res.status(200).send(response);
  } catch (e) {
    let response = { ...defaultResponseObject };
    response.error = e.message || e;
    response.success = false;
    res.status(400).send(response);
  }
};
