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

const ViewColor = () => {

  const [open, setOpen] = useState(false);

  const [Color, setColor] = useState([]);
  const [DeletedColors, setDeletedColors] = useState([]);
  const [isChildSelectChecked, setisChildSelectChecked] = useState([]);
  const [isMasterSelectChecked, setisMasterSelectChecked] = useState(false);

  const [checkedColorsIDs, setcheckedColorsIDs] = useState([]);

  const fetchColor = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/admin-panel/color/read-color`)
      .then((response) => {
        console.log(response.data);
        setColor(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const fetchDeletedColors = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/admin-panel/color/deleted-colors`)
      .then((response) => {
        console.log(response.data);
        setDeletedColors(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const updateStatus = (e) => {
    const status = (e.target.textContent !== 'Active');
    axios.put(`${process.env.REACT_APP_API_URL}/api/admin-panel/color/update-status/${e.target.value}`, { status })
      .then((response) => {
        console.log(response.data);
        setColor((prev) => (
          prev.map((color) => {
            if (color._id == e.target.value) {
              return { ...color, status };
            }
            else {
              return color;
            }
          })
        ))
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchColor();
    fetchDeletedColors();
  }, [])

  useEffect(() => {
    setisChildSelectChecked(new Array(Color.length).fill(false));
    if (Color.length === 0) setisMasterSelectChecked(false);
  }, [Color])

  const handleMasterCheckbox = (e) => {
    const newMasterCheckedState = !isMasterSelectChecked;
    setisMasterSelectChecked(newMasterCheckedState);

    if (e.target.checked) setcheckedColorsIDs(Color.map((color) => color._id));
    if (!e.target.checked) setcheckedColorsIDs([]);

    // Set all checkboxes to the same state as master checkbox
    setisChildSelectChecked(new Array(Color.length).fill(newMasterCheckedState));
  }

  const handleChildCheckbox = (e, index) => {

    if (e.target.checked) setcheckedColorsIDs(((prev) => [...prev, e.target.value]));
    if (!e.target.checked) {
      const temp_array = checkedColorsIDs;
      const index = temp_array.indexOf(e.target.value);
      if (index > -1) temp_array.splice(index, 1);
      setcheckedColorsIDs(temp_array);
    }

    const updatedCheckedStates = isChildSelectChecked.map((checked, i) => i === index ? !checked : checked);
    setisChildSelectChecked(updatedCheckedStates);
    // If all checkboxes are checked, set master checkbox to true, otherwise false
    const allChecked = updatedCheckedStates.every((checked) => checked === true);
    setisMasterSelectChecked(allChecked);
  }

  const handleDlt = (id, name) => {
    console.log(name);
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

        axios.put(`http://localhost:4000/api/admin-panel/color/delete-color/${id}`)
          .then((response) => {
            console.log(response.data);
            fetchColor();
            fetchDeletedColors();
            toast.success(`${name} Color Deleted Successfully`, {
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
    if (checkedColorsIDs.length > 0) {

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

          axios.put('http://localhost:4000/api/admin-panel/color/delete-colors', { checkedColorsIDs })
            .then((response) => {
              console.log(response.data);
              fetchColor();
              fetchDeletedColors();
              toast.success(`${checkedColorsIDs.length} Color/s Deleted Successfully`, {
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
    axios.put(`${process.env.REACT_APP_API_URL}/api/admin-panel/color/recover-color/${id}`)
      .then((response) => {
        console.log(response.data.data);
        fetchColor();
        fetchDeletedColors();
        toast.success(`${name} Color Recovered Successfully`, {
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
      text: "Deleting this Color will permanently remove it.!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {

        axios.delete(`${process.env.REACT_APP_API_URL}/api/admin-panel/color/permanent-delete-color/${id}`)
          .then((response) => {
            console.log(response.data.data);
            fetchColor();
            fetchDeletedColors();
            toast.success(`${name} Color Deleted Permanently`, {
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
          text: "Color deleted successfully",
          icon: "success"
        });
      }
    });


  }


  return (
    <div className="w-[90%] bg-white rounded-[10px] border mx-auto my-[150px]">
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
      <span className="flex justify-between h-[40px] border-b rounded-[10px_10px_0_0] bg-[#f8f8f9] text-[#303640] p-[8px_16px] text-[20px]">
        View Color
        <FaTrash className="cursor-pointer" size={25} onClick={() => setOpen(true)} />

        <Modal open={open} onClose={() => setOpen(false)} center>
          <div className="w-[90%] mx-auto my-[20px]">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  
                  <th className="p-2">Sno.</th>
                  <th className="p-2">Color Name</th>
                  <th className="p-2">Color</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  DeletedColors.map((color, index) => (
                    <tr className="border-b">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{color.name}</td>
                      <td className="p-2">
                        <div style={{ backgroundColor: color.code }}
                          className={`w-[90%] mx-auto h-[20px] border`}></div>
                      </td>
                      <td className="p-2">
                        <MdDelete onClick={(e) => handlePermanentDlt(color._id, color.name)} className="my-[5px] text-red-500 cursor-pointer inline" />{" "}
                        |{" "}
                        <BiRecycle onClick={() => handleRecover(color._id, color.name)} className="my-[5px] text-yellow-500 cursor-pointer inline" />
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
            <tr className="border-b text-left">
              <th className="flex p-2">
                <button onClick={handleMultiDlt} className="bg-[#5351c9] font-light text-white rounded-md p-1 w-[80px] h-[35px] my-[10px] mr-[10px]">
                  Delete
                </button>
                <input onChange={handleMasterCheckbox} checked={isMasterSelectChecked}
                  type="checkbox"
                  name="deleteAll"
                  className="cursor-pointer accent-[#5351c9] input"
                />
              </th>
              <th className="p-2">Sno.</th>
              <th className="p-2">Color Name</th>
              <th className="p-2">Color</th>
              <th className="p-2">Action</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {
              Color.map((color, index) => (
                <tr className="border-b">
                  <td className="p-2">
                    <input value={color._id} checked={isChildSelectChecked[index]} onChange={(e) => handleChildCheckbox(e, index)}
                      type="checkbox"
                      name="delete"
                      className="cursor-pointer accent-[#5351c9] input"
                    />
                  </td>
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{color.name}</td>
                  <td className="p-2">
                    <div style={{ backgroundColor: color.code }}
                      className={`w-[90%] mx-auto h-[20px] border`}></div>
                  </td>
                  <td className="p-2">
                    <MdDelete onClick={(e) => handleDlt(color._id, color.name)} className="my-[5px] text-red-500 cursor-pointer inline" />{" "}
                    |{" "}
                    <Link to={`/dashboard/color/update-colors/${color._id}`}>
                      <CiEdit className="my-[5px] text-yellow-500 cursor-pointer inline" />
                    </Link>
                  </td>
                  <td className="p-2">
                    <button onClick={updateStatus} value={color._id} data-tooltip-id="btn-tooltip" data-tooltip-content={!color.status ? "Click to Active" : " Click to Inactive"} className={`${color.status ? "bg-green-600" : "bg-red-600"} text-white font-light rounded-md my-1 p-1 w-[80px] h-[35px] cursor-pointer`}>
                      {color.status ? "Active" : "Inactive"}
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

export default ViewColor;
