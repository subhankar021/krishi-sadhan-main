var express = require('express');
const verifyUserSession = require('../middleware/auth');
const CategoryGroups = require('../database/models/category-groups');
var router = express.Router();

router.get('/list', verifyUserSession, async (req, res) => {
  try {

    const categories = await CategoryGroups.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categoryGroupId",
          foreignField: "categoryGroupId",
          as: "items"
        }
      },
      { $match: { isActive: true, isRemoved: false } },
      {
        $unwind: "$items"
      },
      {
        $match: { "items.isActive": true, "items.isRemoved": false }
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          categoryGroupId: { $first: "$categoryGroupId" },
          items: { 
            $push: {
              categoryId: "$items.categoryId",
              name: "$items.name",
              imageUrl: "$items.imageUrl"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          categoryGroupId: 1,
          name: 1,
          items: 1
        }
      },
      {
        $sort: { name: -1 }
      }
    ]);      
    
    

    return res.status(200).json(categories);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;