const { getPrimaryKey } = require("./database");
const Categories = require("./database/models/categories");
const CategoryGroups = require("./database/models/category-groups");

const categoriesData = [
    {
      category_group_title: "Seeding & Planting",
      categories: [
        { id: 1, title: "Semi Automatic Potato Planter", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" },
        { id: 2, title: "8 Row Self Propelled Rice Transplanter", image: "https://imagizer.imageshack.com/v2/240x160q70/c/922/eVH6bE.jpg" },
        { id: 3, title: "Brass Knapsack Sprayer", image: "https://imagizer.imageshack.com/v2/240x240q70/c/924/dzDsXt.jpg" },
        { id: 4, title: "Tree Guard", image: "https://imagizer.imageshack.com/v2/240x240q70/c/923/FpmW9X.jpg" },
        { id: 5, title: "Ground Nut Decorticator", image: "https://imagizer.imageshack.com/v2/240x240q70/c/924/tlgKxR.jpg" },
        { id: 6, title: "Sugar Cane Planter / Cutter", image: "https://imagizer.imageshack.com/v2/240x159q70/c/923/MbIWoS.jpg" },
        { id: 7, title: "Vertical Automatic Potato Planter", image: "https://imagizer.imageshack.com/v2/240x240q70/c/923/gPIbGs.jpg" }
      ]
    },
    {
      category_group_title: "Harvesting",
      categories: [
        { id: 8, title: "Paddy Thrasher", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" },
        { id: 9, title: "Sugar Fan", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" },
        { id: 10, title: "Pneumatic Planner", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" },
        { id: 11, title: "Drum Cedar", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" },
        { id: 12, title: "Reaper Binder", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" },
        { id: 13, title: "Maze Thresher", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" },
        { id: 14, title: "Paddy Reaper", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" },
        { id: 15, title: "Rice Transplanter", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" },
        { id: 16, title: "Sunflower Power Thrasher", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" },
        { id: 17, title: "Multicrop Thrasher", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" }
      ]
    },
    {
      category_group_title: "Cultivation & Weeding",
      categories: [
        { id: 18, title: "5 Tine Cultivator", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" },
        { id: 19, title: "Shabash Plau (6)", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" },
        { id: 20, title: "3 Tine Cultivator", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" },
        { id: 21, title: "Spring Loaded 9 Tine Cultivator", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" },
        { id: 22, title: "7 Tine Ridge Cultivator", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" },
        { id: 23, title: "Trailing harrow (10 disk heavy type)", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" },
        { id: 24, title: "Ridge (3 Farrow)", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" },
        { id: 25, title: "3 Tine Cultivator", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" },
        { id: 26, title: "Harrow (6 discs)", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" },
        { id: 27, title: "Harrow 8 disk T.T.", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" },
        { id: 28, title: "Zero Tillage Seed Low Fertile Drill", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" }
      ]
    },
    {
      category_group_title: "Post-harvest processing",
      categories: [
        { id: 29, title: "Baler", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" },
        { id: 30, title: "Power Thresher (10 HP) Bagging Type", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" },
        { id: 31, title: "Power Vinoing and disk harrow 12 discs", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" },
        { id: 32, title: "Rotary Cedar", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" },
        { id: 33, title: "Happy Cedar", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" },
        { id: 34, title: "Power Sprayer", image: "https://imagizer.imageshack.com/v2/240x229q70/c/923/ndWqwV.jpg" }
      ]
    }
  ];

async function createCategories() {
    // drop categories and category groups
    // await CategoryGroups.deleteMany();
    // await Categories.deleteMany();
    for (const categoryGroup of categoriesData) {
        const newCategoryGroup = await CategoryGroups.create({
            categoryGroupId: await getPrimaryKey("category-groups"),
            name: categoryGroup.category_group_title,
            isActive: true,
            isRemoved: false
        });

        for (const category of categoryGroup.categories) {
            await Categories.create({
                categoryId: await getPrimaryKey("categories"),
                categoryGroupId: newCategoryGroup.categoryGroupId,
                name: category.title,
                imageUrl: category.image,
                isActive: true,
                isRemoved: false
            });
        }
    }
}

module.exports = { createCategories }