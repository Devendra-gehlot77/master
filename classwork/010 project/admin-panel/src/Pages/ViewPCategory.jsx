import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiRecycle } from "react-icons/bi";
import { CiEdit } from "react-icons/ci";
import { FaTrash } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Modal from "react-responsive-modal";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Tooltip } from "react-tooltip";
import Swal from "sweetalert2";

const ViewCategory = () => {
  let [show1, setShow1] = useState(false);
  let [show2, setShow2] = useState(false);
  const [ProductCategories, setProductCategories] = useState([]);
  const [isChildSelectChecked, setisChildSelectChecked] = useState([]);
  const [isMasterSelectChecked, setisMasterSelectChecked] = useState(false);
  const [checkedCategoriesIDs, setcheckedCategoriesIDs] = useState([]);
  const [DeletedProductCategories, setDeletedProductCategories] = useState([]);
  const [filepath, setfilepath] = useState('');
  const [open, setOpen] = useState(false);

  const fetchProductCategories = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/admin-panel/product-category/read-category`)
      .then((response) => {
        setfilepath(response.data.filepath);
        setProductCategories(response.data.data);
        console.log(response.data.data)
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const fetchDeletedProductCategories = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/admin-panel/product-category/deleted-categories`)
      .then((response) => {
        console.log('Deleted Product Categories');
        console.log(response.data.data);
        setDeletedProductCategories(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchProductCategories();
    fetchDeletedProductCategories();
  }, [])


  useEffect(() => {
    setisChildSelectChecked(new Array(ProductCategories.length).fill(false));
    if (ProductCategories.length === 0) setisMasterSelectChecked(false);
  }, [ProductCategories])

  const updateStatus = (e) => {
    const status = (e.target.textContent !== 'Active');
    axios.put(`${process.env.REACT_APP_API_URL}/api/admin-panel/product-category/update-status/${e.target.value}`, { status })
      .then((response) => {
        console.log(response.data);
        setProductCategories((prev) => (
          prev.map((productCategory) => {
            if (productCategory._id == e.target.value) {
              return { ...productCategory, status };
            }
            else {
              return productCategory;
            }
          })
        ))
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const updateIsFeatured = (e) => {
    const is_featured = (e.target.textContent !== 'Featured');
    console.log(is_featured);
    axios.put(`${process.env.REACT_APP_API_URL}/api/admin-panel/product-category/update-IsFeatured/${e.target.value}`, { is_featured })
      .then((response) => {
        console.log(response.data);
        setProductCategories((prev) => (
          prev.map((productCategory) => {
            if (productCategory._id == e.target.value) {
              return { ...productCategory, is_featured };
            }
            else {
              return productCategory;
            }
          })
        ))
      })
      .catch((error) => {
        console.log(error);
      });
  }


  const handleMasterCheckbox = (e) => {
    const newMasterCheckedState = !isMasterSelectChecked;
    setisMasterSelectChecked(newMasterCheckedState);

    if (e.target.checked) setcheckedCategoriesIDs(ProductCategories.map((parentCategory) => parentCategory._id));
    if (!e.target.checked) setcheckedCategoriesIDs([]);

    // Set all checkboxes to the same state as master checkbox
    setisChildSelectChecked(new Array(ProductCategories.length).fill(newMasterCheckedState));
  }


  const handleChildCheckbox = (e, index) => {

    if (e.target.checked) setcheckedCategoriesIDs(((prev) => [...prev, e.target.value]));
    if (!e.target.checked) {
      const temp_array = checkedCategoriesIDs;
      const index = temp_array.indexOf(e.target.value);
      if (index > -1) temp_array.splice(index, 1);
      setcheckedCategoriesIDs(temp_array);
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
        axios.put(`${process.env.REACT_APP_API_URL}/api/admin-panel/product-category/delete-category/${id}`)
          .then((response) => {
            console.log(response.data);
            fetchProductCategories();
            fetchDeletedProductCategories();
            toast.success(`${name} Category Deleted Successfully`, {
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
    if (checkedCategoriesIDs.length > 0) {
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

          axios.put(`${process.env.REACT_APP_API_URL}/api/admin-panel/product-category/delete-categories`, { checkedCategoriesIDs })
            .then((response) => {
              console.log(response.data);
              fetchProductCategories();
              fetchDeletedProductCategories();
              toast.success(`All ${checkedCategoriesIDs.length} Categories Deleted Successfully`, {
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
    axios.put(`${process.env.REACT_APP_API_URL}/api/admin-panel/product-category/recover-category/${id}`)
      .then((response) => {
        console.log(response.data.data);
        fetchProductCategories();
        fetchDeletedProductCategories();
        toast.success(`${name} Categories Recovered Successfully`, {
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

  return (
    <div className="w-[90%] mx-auto my-[150px] bg-white rounded-[10px] border">
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
      <span className="flex  justify-between h-[40px] bg-[#f8f8f9] text-[20px] text-[#303640] p-[8px_16px] border-b rounded-[10px_10px_0_0]">
        View Category
        <FaTrash className="cursor-pointer" size={25} onClick={() => setOpen(true)} />
        <Modal open={open} onClose={() => setOpen(false)} center>
          <div className="w-[90%] mx-auto my-[20px]">
            <table className="w-full">
              <thead>
                <tr className="text-center border-b">
                  <th>Sno</th>
                  <th>Category Name</th>
                  <th>Parent Category</th>
                  <th>Slug</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {

                  DeletedProductCategories.map((category, index) => (
                    <tr className="border-b">
                      <td>{index + 1}</td>
                      <td>{category.name}</td>
                      <td>{category.parent_category.name}</td>
                      <td>{category.slug}</td>
                      <td className="object-contain p-2">
                        <img
                          src={`${filepath + category.thumbnail}`}
                          alt="product men's t-shirt"
                          width={80}
                          height={80}
                        />
                      </td>

                      <td>
                        <MdDelete className="my-[5px] text-red-500 cursor-pointer inline" />{" "}
                        |{" "}
                        <BiRecycle onClick={() => handleRecover(category._id, category.name)} className="my-[5px] text-yellow-500 cursor-pointer inline" />
                      </td>

                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </Modal>
      </span>
      <div className="w-[90%] mx-auto my-[20px]">
        <table className="w-full">
          <thead>
            <tr className="text-center border-b">
              <th>
                <button onClick={handleMultiDlt} className="bg-red-400 rounded-sm px-2 py-1">Delete</button>
                <input onChange={handleMasterCheckbox} checked={isMasterSelectChecked}
                  type="checkbox"
                  name="deleteAll"
                  id="deleteAllCat"
                  className="accent-[#5351c9]"
                />
              </th>
              <th>Sno</th>
              <th>Category Name</th>
              <th>Parent Category</th>
              <th>Slug</th>
              <th>Image</th>
              <th>Description</th>
              <th>Action</th>
              <th>Status</th>
              <th className="text-center">Is Featured</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {
              ProductCategories.map((category, index) => (
                <tr className="border-b">
                  <td>
                    <input value={category._id} checked={isChildSelectChecked[index]} onChange={(e) => handleChildCheckbox(e, index)}
                      type="checkbox"
                      name="delete"
                      id="delete1"
                      className="accent-[#5351c9] cursor-pointer"
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{category.name}</td>
                  <td>{category.parent_category.name}</td>
                  <td>{category.slug}</td>
                  <td className="object-contain p-2">
                    <img
                      src={`${filepath + category.thumbnail}`}
                      alt="product men's t-shirt"
                      width={80}
                      height={80}
                    />
                  </td>
                  <td className="w-[100px] flex-wrap p-1">
                    {category.description}
                  </td>
                  <td>
                    <MdDelete onClick={() => handleDlt(category._id, category.name)} className="my-[5px] text-red-500 cursor-pointer inline" />{" "}
                    |{" "}
                    <Link to={`/dashboard/products/update-category/${category._id}`}>
                      <CiEdit className="my-[5px] text-yellow-500 cursor-pointer inline" />
                    </Link>
                  </td>
                  <td>
                    <button onClick={updateStatus} value={category._id} data-tooltip-id="btn-tooltip" data-tooltip-content={!category.status ? "Click to Active" : " Click to Inactive"} className={`${category.status ? "bg-green-600" : "bg-red-600"} text-white font-light rounded-md my-1 p-1 w-[80px] h-[35px] cursor-pointer`}>
                      {category.status ? "Active" : "Inactive"}
                    </button>
                    <Tooltip id="btn-tooltip" />
                  </td>
                  <td className="text-center">
                    <button onClick={updateIsFeatured} value={category._id} data-tooltip-id="btn-isfeatured" data-tooltip-content={!category.is_featured ? "Click to set Featured" : " Click to remove from Featured"} className={`${category.is_featured ? "bg-green-600" : "bg-red-600"} text-white font-light rounded-md my-1 p-1  h-[35px] cursor-pointer`}>
                      {category.is_featured ? "Featured" : "Not Featured"}
                    </button>
                    <Tooltip id="btn-isfeatured" />
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

export default ViewCategory;
