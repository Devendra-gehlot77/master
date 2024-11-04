import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiRecycle } from "react-icons/bi";
import { CiEdit, CiWarning } from "react-icons/ci";
import { FaTrash } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Modal from "react-responsive-modal";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Tooltip } from "react-tooltip";
import Swal from "sweetalert2";

const ViewProduct = () => {
  let [showDesc1, setShowDesc1] = useState(false);
  let [showShortDesc1, setShowShortDesc1] = useState(false);
  const [Products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [DetailesOpen, setDetailesOpen] = useState(false);
  // const [DetailsProduct, setDetailsProduct] = useState({});
  const [isChildSelectChecked, setisChildSelectChecked] = useState([]);
  const [isMasterSelectChecked, setisMasterSelectChecked] = useState(false);
  const [checkedProductsIDs, setcheckedProductsIDs] = useState([]);
  const [DeletedProducts, setDeletedProducts] = useState([]);
  const [filepath, setfilepath] = useState('');

  const fetchProducts = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/admin-panel/product/read-products`)
      .then((response) => {
        setfilepath(response.data.filepath);
        setProducts(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const fetchDeletedProducts = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/admin-panel/product/deleted-products`)
      .then((response) => {
        setDeletedProducts(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchProducts();
    fetchDeletedProducts();
  }, [])

  useEffect(() => {
    console.log(Products);
  }, [Products])


  useEffect(() => {
    console.log('Deleted Products', DeletedProducts);
  }, [DeletedProducts])

  const updateStatus = (e) => {
    const status = (e.target.textContent !== 'Active');
    axios.put(`${process.env.REACT_APP_API_URL}/api/admin-panel/product/update-status/${e.target.value}`, { status })
      .then((response) => {
        console.log(response.data);
        setProducts((prev) => (
          prev.map((product) => {
            if (product._id == e.target.value) {
              return { ...product, status };
            }
            else {
              return product;
            }
          })
        ))
      })
      .catch((error) => {
        console.log(error);
      });
  }


  useEffect(() => {
    setisChildSelectChecked(new Array(Products.length).fill(false));
    if (Products.length === 0) setisMasterSelectChecked(false);
  }, [Products])

  const handleMasterCheckbox = (e) => {
    const newMasterCheckedState = !isMasterSelectChecked;
    setisMasterSelectChecked(newMasterCheckedState);

    if (e.target.checked) setcheckedProductsIDs(Products.map((product) => product._id));
    if (!e.target.checked) setcheckedProductsIDs([]);

    // Set all checkboxes to the same state as master checkbox
    setisChildSelectChecked(new Array(Products.length).fill(newMasterCheckedState));
  }


  const handleChildCheckbox = (e, index) => {

    if (e.target.checked) setcheckedProductsIDs(((prev) => [...prev, e.target.value]));
    if (!e.target.checked) {
      const temp_array = checkedProductsIDs;
      const index = temp_array.indexOf(e.target.value);
      if (index > -1) temp_array.splice(index, 1);
      setcheckedProductsIDs(temp_array);
    }

    const updatedCheckedStates = isChildSelectChecked.map((checked, i) => i === index ? !checked : checked);
    setisChildSelectChecked(updatedCheckedStates);
    // If all checkboxes are checked, set master checkbox to true, otherwise false
    const allChecked = updatedCheckedStates.every((checked) => checked === true);
    setisMasterSelectChecked(allChecked);
  }

  const handleDlt = (id, name) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Deleted item will be moved to Recycle bin!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`${process.env.REACT_APP_API_URL}/api/admin-panel/product/delete-product/${id}`)
          .then((response) => {
            console.log(response.data);
            fetchProducts();
            fetchDeletedProducts();
            toast.success(`${name} Product Deleted Successfully`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          })
          .catch((error) => {
            console.log(error);
          })

        Swal.fire({
          title: "Deleted!",
          text: "deleted successfully.",
          icon: "success"
        });
      }
    });


  }

  const handleMultiDlt = () => {
    if (checkedProductsIDs.length > 0) {
      Swal.fire({
        title: "Are you sure?",
        text: "Deleted items will be moved to Recycle bin!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {

          axios.put(`${process.env.REACT_APP_API_URL}/api/admin-panel/product/delete-products`, { checkedProductsIDs })
            .then((response) => {
              console.log(response.data);
              fetchProducts();
              fetchDeletedProducts();
              toast.success(`All ${checkedProductsIDs.length} Categories Deleted Successfully`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });
            })
            .catch((error) => {
              console.log(error);
            })

          Swal.fire({
            title: "Deleted!",
            text: "delted succefully.",
            icon: "success"
          });
        }
      });
    }
  }

  const handleRecover = (id, name) => {
    axios.put(`${process.env.REACT_APP_API_URL}/api/admin-panel/product/recover-product/${id}`)
      .then((response) => {
        fetchProducts();
        fetchDeletedProducts();
        toast.success(`${name} Product Recovered Successfully`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .catch((error) => {
        console.log(error);
      })
  }


  const handlePermanentDlt = (id, name) => {

    Swal.fire({
      title: "Are you sure?",
      text: "Deleting this Product will permanently remove it.!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {

        axios.delete(`${process.env.REACT_APP_API_URL}/api/admin-panel/product/permanent-delete-product/${id}`)
          .then((response) => {
            console.log(response.data.data);
            fetchProducts();
            fetchDeletedProducts();
            toast.success(`${name} Product Deleted Permanently`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          })
          .catch((error) => {
            console.log(error);
          })

        Swal.fire({
          title: "Deleted!",
          text: "Product deleted successfully",
          icon: "success"
        });
      }
    });


  }
  return (
    <div className="w-[90%] mx-auto my-[150px] rounded-[10px] bg-white border">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <span className="flex  justify-between h-[40px] bg-[#f8f8f9] text-[20px] text-[#303640] font-bold p-[8px_16px] border-b rounded-[10px_10px_0_0]">
        View Product
        <FaTrash className="cursor-pointer" size={25} onClick={() => setOpen(true)} />
        <Modal classNames='TrashBin' open={open} onClose={() => setOpen(false)} center >
          <div className="w-[90%] mx-auto my-[20px]">
            <table className=" w-full">
              <thead>
                <tr className="border-b text-left">
                  <th>Sno</th>
                  <th>Product Name</th>
                  <th>Parent Category</th>
                  <th>Product Category</th>
                  <th>Thumbnail</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  DeletedProducts.map((product, index) => (
                    <tr className="border-b">

                      <td>{index + 1}</td>
                      <td>{product.name}</td>
                      <td className="w-[200px] p-2">
                        {product.parent_category.name}
                      </td>
                      <td className="w-[200px] p-2">
                        {product.product_category.name}
                      </td>
                      <td className="object-contain cursor-pointer"
                        onClick={() => setDetailesOpen(true)} data-tooltip-id="details-tooltip" data-tooltip-content='Click for Details'>
                        <Tooltip id="details-tooltip" />
                        {product.thumbnail ?
                          <img
                            src={filepath + product.thumbnail}
                            alt="men's t-shirt"
                            width={80}
                            height={80}
                            className="rounded-[5px]"
                          /> :
                          <span className="flex align-middle"> <CiWarning color="orange" size={25} /> Image Not Found</span>
                        }

                      </td>
                      <td>
                        <MdDelete onClick={() => handlePermanentDlt(product._id, product.name)} className="my-[5px] text-red-500 cursor-pointer inline" />{" "}
                        |{" "}
                        <BiRecycle onClick={() => handleRecover(product._id, product.name)} className="my-[5px] text-yellow-500 cursor-pointer inline" />
                      </td>

                    </tr>
                  ))
                }

              </tbody>
            </table>
          </div>
        </Modal>

        <Modal classNames='DetailedBox' open={DetailesOpen} onClose={() => setDetailesOpen(false)} center >

        </Modal>
      </span>

      <div className="w-[90%] mx-auto my-[20px]">
        <table className="w-full">
          <thead>
            <tr className="border-b text-center">
              <th className="flex gap-[5px]">
                <button onClick={handleMultiDlt} className="bg-red-400 rounded-sm px-2 py-1">Delete</button>
                <input onChange={handleMasterCheckbox} checked={isMasterSelectChecked}
                  type="checkbox"
                  id="deleteAll"
                  name="delete"
                  className="input accent-[#5351c9] cursor-pointer h-[fit-content] m-[5px]"
                />
              </th>
              <th>Sno</th>
              <th>Product <br /> Name</th>
              <th>Parent <br /> Category</th>
              <th>Product <br /> Category</th>
              <th>Thumbnail</th>
              <th>Price</th>
              <th>MRP</th>
              <th>Action</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {
              Products.map((product, index) => (
                <tr className="border-b text-center">
                  <td>
                    <input value={product._id} checked={isChildSelectChecked[index]} onChange={(e) => handleChildCheckbox(e, index)}
                      type="checkbox"
                      id="delete"
                      name="delete"
                      className="input accent-[#5351c9] cursor"
                    />
                  </td>
                  <td className="w-[50px] p-2">{index + 1}</td>
                  <td>{product.name}</td>
                  <td className="w-[100px] p-2">
                    {product.parent_category.name}
                  </td>
                  <td className="w-[130px] p-2">
                    {product.product_category.name}
                  </td>
                  <td className="object-contain text-center cursor-pointer"
                    onClick={() => setDetailesOpen(true)} data-tooltip-id={`details-tooltip-of-${product._id}`}>
                    <Tooltip
                      className="z-50"
                      id={`details-tooltip-of-${product._id}`}
                      content={
                        <DetailedProduct
                          name={product.name}
                          id={product._id}
                          description={product.description}
                          short_description={product.short_description}
                          color={product.color}
                          size={product.size}
                          image_on_hover={product.image_on_hover}
                          gallery={product.gallery}
                          stock={product.isStockAvail}
                          brand={product.brand}
                          filepath={filepath} />}
                    />
                    {product.thumbnail ?
                      <img
                        src={filepath + product.thumbnail}
                        alt="men's t-shirt"
                        width={80}
                        height={80}
                        className="rounded-[5px] inline"
                      /> :
                      <span className="flex align-middle text-center"> <CiWarning color="orange" size={25} /> Image Not Found</span>
                    }
                  </td>
                  <td className="px-4">{product.price}&#8377;</td>
                  <td className="px-4">{product.mrp}&#8377;</td>
                  <td>
                    <MdDelete onClick={() => handleDlt(product._id, product.name)} className="my-[5px] text-red-500 cursor-pointer inline" />{" "}
                    |{" "}
                    <Link to={`/dashboard/products/update-product/${product._id}`}>
                      <CiEdit className="my-[5px] text-yellow-500 cursor-pointer inline" />
                    </Link>
                  </td>
                  <td>
                    <button onClick={updateStatus} value={product._id} data-tooltip-id="btn-tooltip" data-tooltip-content={!product.status ? "Click to Active" : " Click to Inactive"} className={`${product.status ? "bg-green-600" : "bg-red-600"} text-white font-light rounded-md my-1 p-1 w-[80px] h-[35px] cursor-pointer`}>
                      {product.status ? "Active" : "Inactive"}
                    </button>
                    <Tooltip id="btn-tooltip" />
                  </td>
                </tr>
              ))

            }

          </tbody>
        </table>
      </div>
    </div>
  );
};

const DetailedProduct = (props) => {
  return (
    <div className="bg-black w-[95vw]" >
      <div className="w-[90%] mx-auto my-[20px]">
        <table className=" w-full">
          <thead>
            <tr className="border-b text-center">
              <th>Product Name</th>
              <th>Description</th>
              <th>Short Description</th>
              <th>Image On Hover</th>
              <th>Sizes</th>
              <th>Colors</th>
              <th>Gallery</th>
              <th>Stock</th>
              <th>Brand</th>
            </tr>
          </thead>
          <tbody>
            {

              <tr className="border-b w-[95vw]">
                <td className="w-[100px] break-all p-2">
                  {props.name}
                </td>
                <td className="w-[200px] break-all p-2">
                  {props.description}
                </td>
                <td className="w-[200px] break-all p-2">
                  {props.short_description}
                </td>
                <td className="object-contain cursor-pointer">
                  <div>
                    {props.image_on_hover ?
                      <img
                        src={props.filepath + props.image_on_hover}
                        alt="men's t-shirt"
                        width={80}
                        height={80}
                        className="rounded-[5px] inline"
                      /> :
                      <span className="flex text-center align-middle"> <CiWarning color="orange" size={25} /> Image Not Found</span>
                    }
                  </div>
                </td>
                <td>
                  {props.size.map((size) => (size.name)).join(' , ')}
                </td>
                <td>
                  {props.color.map((color) => (color.name)).join(' , ')}
                </td>
                <td className="flex justify-around flex-wrap">
                  {
                    props.gallery ? props.gallery.map((img) => (
                      <img
                        src={props.filepath + img}
                        alt="men's t-shirt"
                        width={80}
                        height={80}
                        className="rounded-[5px] self-center"
                      />
                    )) : <span className="flex text-center align-middle"> <CiWarning color="orange" size={25} /> Images Not Found</span>
                  }
                </td>
                <td>
                  {props.stock ? 'Available' : 'Out of Stock'}
                </td>
                <td>
                  {props.brand}
                </td>
              </tr>
            }

          </tbody>
        </table>
      </div>

    </div>
  )
}

export default ViewProduct;
