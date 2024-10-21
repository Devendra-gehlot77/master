import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { Link } from "react-router-dom";
import axios from "axios";
import { Tooltip } from "react-tooltip";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import Modal from "react-responsive-modal";
import { FaTrash } from "react-icons/fa";
import { BiReceipt, BiRecycle } from "react-icons/bi";

const ViewSizes = () => {

  const [open, setOpen] = useState(false);

  const [Size, setSize] = useState([]);
  const [DeletedSizes, setDeletedSizes] = useState([]);
  const [isChildSelectChecked, setisChildSelectChecked] = useState([]);
  const [isMasterSelectChecked, setisMasterSelectChecked] = useState(false);

  const [checkedSizeIDs, setcheckedSizeIDs] = useState([]);

  const fetchSizes = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/admin-panel/size/read-sizes`)
      .then((response) => {
        console.log(response.data);
        setSize(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const fetchDeletedSizes = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/admin-panel/size/deleted-sizes`)
      .then((response) => {
        console.log(response.data);
        setDeletedSizes(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const updateStatus = (e) => {
    const status = (e.target.textContent !== 'Active');
    axios.put(`${process.env.REACT_APP_API_URL}/api/admin-panel/size/update-status/${e.target.value}`, { status })
      .then((response) => {
        console.log(response.data);
        setSize((prev) => (
          prev.map((size) => {
            if (size._id == e.target.value) {
              return { ...size, status };
            }
            else {
              return size;
            }
          })
        ))
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchSizes();
    fetchDeletedSizes();
  }, [])

  useEffect(() => {
    setisChildSelectChecked(new Array(Size.length).fill(false));
    if (Size.length === 0) setisMasterSelectChecked(false);
  }, [Size])

  useEffect(() => {
    console.log(checkedSizeIDs);
  }, [checkedSizeIDs])

  const handleMasterCheckbox = (e) => {
    const newMasterCheckedState = !isMasterSelectChecked;
    setisMasterSelectChecked(newMasterCheckedState);

    if (e.target.checked) setcheckedSizeIDs(Size.map((size) => size._id));
    if (!e.target.checked) setcheckedSizeIDs([]);

    // Set all checkboxes to the same state as master checkbox
    setisChildSelectChecked(new Array(Size.length).fill(newMasterCheckedState));
  }

  const handleChildCheckbox = (e, index) => {

    if (e.target.checked) setcheckedSizeIDs(((prev) => [...prev, e.target.value]));
    if (!e.target.checked) {
      const temp_array = checkedSizeIDs;
      const index = temp_array.indexOf(e.target.value);
      if (index > -1) temp_array.splice(index, 1);
      setcheckedSizeIDs(temp_array);
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

        axios.put(`${process.env.REACT_APP_API_URL}/api/admin-panel/size/delete-size/${id}`)
          .then((response) => {
            console.log(response.data);
            fetchSizes();
            fetchDeletedSizes();
            toast.success(`${name} Size Deleted Successfully`, {
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
    if (checkedSizeIDs.length > 0) {

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

          axios.put('http://localhost:4000/api/admin-panel/size/delete-sizes', { checkedSizeIDs })
            .then((response) => {
              console.log(response.data);
              fetchSizes();
              fetchDeletedSizes();
              toast.success(`All ${checkedSizeIDs.length} Sizes Deleted Successfully`, {
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
    axios.put(`http://localhost:4000/api/admin-panel/size/recover-size/${id}`)
      .then((response) => {
        console.log(response.data.data);
        fetchSizes();
        fetchDeletedSizes();
        toast.success(`${name} Size Recovered Successfully`, {
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
    <div className="w-[90%] bg-white mx-auto border rounded-[10px] my-[150px]">
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
      <span className="flex justify-between border-b rounded-[10px_10px_0_0] bg-[#f8f8f9] text-[#303640] h-[50px] p-[8px_16px] text-[23px] font-bold">
        View Size
        <FaTrash className="cursor-pointer" size={25} onClick={() => setOpen(true)} />

        <Modal open={open} onClose={() => setOpen(false)} center>
        <div className="w-[90%] mx-auto">
        <table className="w-full my-[20px]">
          <thead>
            <tr className="text-left border-b">
              <th>
                <button onClick={handleMultiDlt} className="bg-red-400 rounded-sm px-2 py-1">Empty Bin</button>
                <input onChange={handleMasterCheckbox} checked={isMasterSelectChecked} type="checkbox" name="deleteAll" className="m-[0_10px] accent-[#5351c9] cursor-pointer input"
                />
              </th>
              <th>Sno</th>
              <th>Size Name</th>
              <th>Size Order</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              DeletedSizes.map((size, index) => (
                <tr className="border-b">
                  <td>
                    <input value={size._id} checked={isChildSelectChecked[index]} onChange={(e) => handleChildCheckbox(e, index)}
                      type="checkbox"
                      name="delete"
                      className="accent-[#5351c9] cursor-pointer input"
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{size.name}</td>
                  <td>{size.order}</td>
                  <td className="flex gap-[5px]">
                    <MdDelete onClick={() => handleDlt(size._id, size.name)} className="my-[5px] text-red-500 cursor-pointer" /> |{" "}
                      <BiRecycle onClick={() => handleRecover(size._id,size.name)} className="my-[5px] text-yellow-500 cursor-pointer" />
                  </td>

                </tr>
              ))
            }

          </tbody>
        </table>
      </div>
        </Modal>
      </span>
      <div className="w-[90%] mx-auto">
        <table className="w-full my-[20px]">
          <thead>
            <tr className="text-left border-b">
              <th>
                <button onClick={handleMultiDlt} className="bg-red-400 rounded-sm px-2 py-1">Delete</button>
                <input onChange={handleMasterCheckbox} checked={isMasterSelectChecked} type="checkbox" name="deleteAll" className="m-[0_10px] accent-[#5351c9] cursor-pointer input"
                />
              </th>
              <th>Sno</th>
              <th>Size Name</th>
              <th>Size Order</th>
              <th>Action</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {
              Size.map((size, index) => (
                <tr className="border-b">
                  <td>
                    <input value={size._id} checked={isChildSelectChecked[index]} onChange={(e) => handleChildCheckbox(e, index)}
                      type="checkbox"
                      name="delete"
                      className="accent-[#5351c9] cursor-pointer input"
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{size.name}</td>
                  <td>{size.order}</td>
                  <td className="flex gap-[5px]">
                    <MdDelete onClick={() => handleDlt(size._id, size.name)} className="my-[5px] text-red-500 cursor-pointer" /> |{" "}
                    <Link to={`/dashboard/sizes/update-size/${size._id}`}>
                      <CiEdit className="my-[5px] text-yellow-500 cursor-pointer" />
                    </Link>
                  </td>
                  <td>
                    <button onClick={updateStatus} value={size._id} data-tooltip-id="btn-tooltip" data-tooltip-content={!size.status ? "Click to Active" : " Click to Inactive"} className={`${size.status ? "bg-green-600" : "bg-red-600"} text-white font-light rounded-md my-1 p-1 w-[80px] h-[35px] cursor-pointer`}>
                      {size.status ? "Active" : "Inactive"}
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

export default ViewSizes;
