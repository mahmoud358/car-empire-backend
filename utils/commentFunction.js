const { default: mongoose } = require("mongoose");
const APIERROR = require("./apiError");
const Comment = require("../models/comment");
const getAllCommentByRequestID = async (requestID,limit,skip) => {

    try{
        const pipeline = [
            {
              $match: {
                requestId: new mongoose.Types.ObjectId(requestID),
              },
            },
            { $sort: { createdAt: -1 } },
            {
              $facet: {
                comments: [
                  { $skip: skip },
                  { $limit: limit },
                  { $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user", 
                  }},
                  { $unwind: "$user" },
                  {
                    $project: {
                      _id: 1,
                      text: 1,
                      createdAt: 1,
                      user: {
                        _id: 1,
                        name: 1,
                      },
                    },
                  },
                ],

                totalCount: [
                  { $count: "count" }
                ]
              }
            }
          ];
      
          const result = await Comment.aggregate(pipeline);
      
          return {
            comments: result[0].comments,
            totalItems: result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0,
            totalPages: result[0].totalCount.length > 0 ? Math.ceil(result[0].totalCount[0].count / limit) : 0,
          };

    }catch(error){
        throw new APIERROR(500, error.message)
    }

}

module.exports = {getAllCommentByRequestID};