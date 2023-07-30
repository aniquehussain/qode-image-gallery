import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/db/connectDb";

const uploadImage = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  try {
    const { db } = await connectToDatabase();
    console.log(req.body);

    const imagesCollection = db.collection("images");
    const result = await imagesCollection.insertOne(
      {
        ...req.body,
        createdAt: new Date(),
      }
    );


    if (result.acknowledged) {
      return res.status(200).json({
        status: "success",
        message: "Image uploaded successfully",
        data: {
          ...req.body,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: "Error uploading image",
    });
  }
};

// Retrieve all images from the "images" collection
const getAllImages = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const { db } = await connectToDatabase();
  try {
    // Connect to the database

    const imagesCollection = db.collection("images");
    const images = await imagesCollection.find({}).toArray();
    res.status(200).json({
      status: "success",
      message: "Images retrieved successfully",
      data: images,
    });
    // Get the images collection
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: "Error retrieving images",
      data: [],
    });
  }
};

const addComments = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  try {
    const { db } = await connectToDatabase();
    const { imageId, comment } = req.body;
    const imagesCollection = db.collection("images");
    const addComment = await imagesCollection.updateOne(
      { imageId: imageId },
      {
        $push: {
          comments: {
            comment,
            createdAt: new Date(),
          },
        },
      }
    );

    console.log(addComment);

    if (addComment.acknowledged) {
      return res.status(200).json({
        status: "success",
        message: "Comment added successfully",
        data: req.body.comment,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: "Error adding comment",
    });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // switch the methods
  switch (req.method) {
    case "POST": {
      return uploadImage(req, res);
    }
    case "GET": {
      return getAllImages(req, res);
    }
    case "PATCH": {
      return addComments(req, res);
      }

    default: {
      return res.status(405).end(); // Method Not Allowed
    }
  }
}
