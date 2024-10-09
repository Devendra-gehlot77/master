const { Products } = require("../model/product");

const addProduct = async (req, res) => {
  try {
    const data = req.body;

    if (req.files) {
      if (req.files.thumbnail) data.thumbnail = req.files.thumbnail[0].filename;

      if (req.files.images)
        data.images = req.files.images.map((file) => file.filename);
    }

    const dataToSave = new Products(data);

    const response = dataToSave.save();
    res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

const readproducts = async (req, res) => {
  try {
    const response = await Products.find();

    const filepath = `${req.protocol}://${req.get("host")}/api-files/`;

    res.status(200).json({ message: "sucess", data: response, filepath });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};


const updateProduct = async(req,res)=>{

  console.log( req.params)
  try{
        console.log(req.body)
    // const response = await products.updateOne(
    //   {
    //     _id: req.params._id
    //   },
    //   {

    //   })
    res.status(200).json({message:'success'})
  }
  catch(error){
      res.status(500).json({message:'internal server error'})
  }
}

module.exports = {
  addProduct,
  readproducts,
  updateProduct
};
