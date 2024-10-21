import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiRecycle } from "react-icons/bi";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import Swal from "sweetalert2";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { FaTrash } from "react-icons/fa";

const ViewCategory = () => {
  let [show1, setShow1] = useState(false);
  let [show2, setShow2] = useState(false);
  let [show3, setShow3] = useState(false);
  let [show4, setShow4] = useState(false);

  const [open, setOpen] = useState(false);

  const [parentCategories, setparentCategories] = useState([]);
  const [DeletedParentCategories, setDeletedParentCategories] = useState([]);
  const [isChildSelectChecked, setisChildSelectChecked] = useState([]);
  const [isMasterSelectChecked, setisMasterSelectChecked] = useState(false);

  const [checkedCategoriesIDs, setcheckedCategoriesIDs] = useState([]);


  let fetchParentCategories = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/admin-panel/parent-category/read-category`)
      .then((response) => {
        setparentCategories(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const updateStatus = (e) => {
    const status = (e.target.textContent !== 'Active');
    axios.put(`${process.env.REACT_APP_API_URL}/api/admin-panel/parent-category/update-status/${e.target.value}`, { status })
      .then((response) => {
        console.log(response.data);
        setparentCategories((prev) => (
          prev.map((parentCategory) => {
            if (parentCategory._id == e.target.value) {
              return { ...parentCategory, status };
            }
            else {
              return parentCategory;
            }
          })
        ))
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const fetchDeletedParentCategories = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/admin-panel/parent-category/deleted-categories`)
      .then((response) => {
        console.log(response.data);
        setDeletedParentCategories(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchParentCategories();
    fetchDeletedParentCategories();
  }, [])

  useEffect(() => {
    setisChildSelectChecked(new Array(parentCategories.length).fill(false));
    if (parentCategories.length === 0) setisMasterSelectChecked(false);
  }, [parentCategories])

  const handleMasterCheckbox = (e) => {
    const newMasterCheckedState = !isMasterSelectChecked;
    setisMasterSelectChecked(newMasterCheckedState);

    if (e.target.checked) setcheckedCategoriesIDs(parentCategories.map((parentCategory) => parentCategory._id));
    if (!e.target.checked) setcheckedCategoriesIDs([]);

    // Set all checkboxes to the same state as master checkbox
    setisChildSelectChecked(new Array(parentCategories.length).fill(newMasterCheckedState));
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

        axios.put(`${process.env.REACT_APP_API_URL}/api/admin-panel/parent-category/delete-category/${id}`)
          .then((response) => {
            console.log(response.data);
            fetchParentCategories();
            fetchDeletedParentCategories();
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

          axios.put(`${process.env.REACT_APP_API_URL}/api/admin-panel/parent-category/delete-categories`, { checkedCategoriesIDs })
            .then((response) => {
              console.log(response.data);
              fetchParentCategories();
              fetchDeletedParentCategories();
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

  const handleRecover = (id,name) => {
    axios.put(`${process.env.REACT_APP_API_URL}/api/admin-panel/parent-category/recover-category/${id}`)
      .then((response) => {
        console.log(response.data.data);
        fetchParentCategories();
        fetchDeletedParentCategories();
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
      <span className="flex justify-between h-[40px] bg-[#f8f8f9] text-[20px] text-[#303640] p-[8px_16px] border-b rounded-[10px_10px_0_0]">
        View Category
        <FaTrash className="cursor-pointer" size={25} onClick={() => setOpen(true)} />

        <Modal open={open} onClose={() => setOpen(false)} center>
          <div className="w-[90%] mx-auto my-[20px]">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th>
                    <button className="bg-red-400 rounded-sm px-2 py-1">Empty Bin</button>
                    <input type="checkbox" name="deleteAll" id="deleteAllCat" className="accent-[#5351c9]" />
                  </th>
                  <th>Sno</th>
                  <th>Category Name</th>

                  <th>Action</th>

                </tr>
              </thead>
              <tbody>
                {
                  DeletedParentCategories.map((parentCategory, index) => (
                    <tr className="border-b">
                      <td>
                        <input type="checkbox" name={`checkbox${index}`} id="delete1" className="accent-[#5351c9] cursor-pointer" />
                      </td>
                      <td>{index + 1}</td>
                      <td>{parentCategory.name}</td>
                      <td>
                        <MdDelete className="my-[5px] text-red-500 cursor-pointer inline" />{" "}
                        |{" "}
                        <BiRecycle onClick={() => handleRecover(parentCategory._id,parentCategory.name)} className="my-[5px] text-yellow-500 cursor-pointer inline" />

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
            <tr className="text-left border-b">
              <th>
                <button onClick={handleMultiDlt} className="bg-red-400 rounded-sm px-2 py-1">Delete</button>
                <input onChange={handleMasterCheckbox} type="checkbox" name="deleteAll" id="deleteAllCat" className="accent-[#5351c9]" checked={isMasterSelectChecked} />
              </th>
              <th>Sno</th>
              <th>Category Name</th>
              <th>Description</th>
              <th>Action</th>
              <th>Status</th>
            </tr>
          </thead>


          <tbody>
            {
              parentCategories.map((parentCategory, index) => (
                <tr className="border-b">
                  <td>
                    <input value={parentCategory._id} checked={isChildSelectChecked[index]} onChange={(e) => handleChildCheckbox(e, index)} type="checkbox" name={`checkbox${index}`} id="delete1" className="accent-[#5351c9] cursor-pointer" />
                  </td>
                  <td>{index + 1}</td>
                  <td>{parentCategory.name}</td>
                  <td className="w-[200px] flex-wrap p-1">
                    {parentCategory.description}
                    <span onClick={() => setShow1(!show1)} className={show1 === true ? "hidden" : "font-bold cursor-pointer"}>
                      ...Read
                    </span>
                    {
                      show1 === false ? (" ") : (<span>Deserunt nam est delectus itaque sint harum architecto.</span>)
                    }
                  </td>
                  <td>
                    <MdDelete onClick={() => handleDlt(parentCategory._id, parentCategory.name)} className="my-[5px] text-red-500 cursor-pointer inline" />{" "}
                    |{" "}
                    <Link to={`/dashboard/category/update-category/${parentCategory._id}`}>
                      <CiEdit className="my-[5px] text-yellow-500 cursor-pointer inline" />
                    </Link>
                  </td>
                  <td>


                    <button onClick={updateStatus} value={parentCategory._id} data-tooltip-id="btn-tooltip" data-tooltip-content={!parentCategory.status ? "Click to Active" : " Click to Inactive"} className={`${parentCategory.status ? "bg-green-600" : "bg-red-600"} text-white font-light rounded-md my-1 p-1 w-[80px] h-[35px] cursor-pointer`}>
                      {parentCategory.status ? "Active" : "Inactive"}
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

export default ViewCategory;
