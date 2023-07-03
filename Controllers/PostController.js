import PostModel from "../models/Post.js ";

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "məqalələri əldə etmək mümkün olmadı",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    //Bize bütün məqalələri geri qaytar
    const posts = await PostModel.find().populate('user').exec();

    //və mənə nə lazım olduğunu söylə
    //ve bu makalelerden oluşan bir dizi döndürmem gerektiğini belir
    res.json(posts);
  } catch (err) {
    //Eger  error bas verse, mongo db ve ya her hansisa basqa bir sebebden
    console.log(err);
    res.status(500).json({
      message: "məqalələri əldə etmək mümkün olmadı",
    });
  }
};
export const getOne = async(req, res) => {
  try {
    const postId = req.params.id;
    //Mən onu qaytarmaq üçün məqalələr tapmalıyam ve onu geri qaytarmaliyam
   const post = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      }
    ).populate('user').exec();

    if (!post) {
      return res.status(404).json({
        message: "Məqalə tapılmadı",
      });
    }
  
    res.json(post);
  } catch (err) {
    //Eger  error bas verse, mongo db ve ya her hansisa basqa bir sebebden
    console.log(err);
    res.status(500).json({
      message: "məqalələri əldə etmək mümkün olmadı",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    //Mən onu qaytarmaq üçün məqalələr tapmalıyam ve onu geri qaytarmaliyam

    PostModel.findOneAndDelete({
      _id: postId,
    }).then((doc, err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Meqaline silmek mumkun olmadi",
        });
      }

      if (!doc) {
        return res.status(404).json({
          message: "Meqale tapilmadi",
        });
      }

      // Eger meqalede bir problem olmadisa tapildi ve silindi ise
      res.json({
        success: true,
      });
    });
  } catch (err) {
    //Eger  error bas verse, mongo db ve ya her hansisa basqa bir sebebden
    console.log(err);
    res.status(500).json({
      message: "məqalələri silmek    mümkün olmadı",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    });

    //Eger document hazirdirsa onu yaratmaq lazimdir.
    const post = await doc.save();

    //Cavabida qaytaririq
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "məqalə yarada bilmədi",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user:req.userId,
        tags: req.body.tags.split(','),
      }
    ).then(() => {
      res.json({
        success: true,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "məqalələri yenilemek  mümkün olmadı",
    });
  }
};
