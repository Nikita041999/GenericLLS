import { useRef } from "react";
import Layout from "components/Layout";
import userSvg from "assets/images/users.svg";
import dropdownSvg from "../../src/assets/images/dropdown-arrow.svg";
// import '../../src/assets/css/style.css';
import styles from "./Users.module.css";

import menuImg from "assets/images/download_icon.svg";
import {
  deleteUser,
  getUsers,
  toggleBlockUser,
  getUsersByDateFilter,
  getValuesBySearchFilter,
} from "lib/network/apis";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import viewIcon from "assets/images/viewIcon.svg";
import deleteIcon from "assets/images/delete_ico.svg";
import activeIcon from "assets/images/activeIcon.svg";
import pendingIcon from "assets/images/pendingIcon.svg";
import Pagination from "components/Pagination";
import DeleteModal from "components/Modals/DeleteModal";
import { useLocation } from "react-router-dom";
import Loader from "components/Loader";
import { toast } from "react-toastify";
import { useDownloadExcel } from "react-export-table-to-excel";
import JsonToExcelConverter from "components/TradeshowComps/Admin/JsonToExcelConverter";
// import DateFilter from "./DateFilter";

const quizDropdown = [
  { id: 1, label: "Completed" },
  { id: 0, label: "Incompleted" },
];
export default function Users() {
  const location = useLocation();
  const [data, setData] = useState({
    currentPage: location?.state?.currentPage || 1,
    // limit: 2,
    limit: 10,
  });
  const [isLoading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userObject, setUserObject] = useState({});
  const [blockLoader, setBlockLoader] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  // const [quizComplteted, setQuizComplteted] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [items, setItem] = useState(quizDropdown);
  const [selectedItem, setSelectedItem] = useState("");
  const [totalQuiz, setTotalQuiz] = useState(0);
  const [playersData, setPlayersData] = useState([])
  const [exportData , setExportData] = useState([])
  const tableRef = useRef(null);


  function removeTimeProperties(obj,i) {
    // Create a copy of the object to avoid modifying the original object
    const newObj = { ...obj };
    // Remove the start_time and end_time properties
    delete newObj.start_time;
    delete newObj.end_time;
    delete newObj.updated_at;
    newObj.created_at = convertDatetime(newObj.created_at);
    newObj.id = i+1 
    return newObj;
  }

  // useEffect(() => {
  //   if(playersData.length > 0){
  //     playerData()
  //   }
   
  // }, [playersData.length]);


const playerData =()=>{
  playersData.map((data,i) => {
    let obj = removeTimeProperties( data,i)
    setExportData(
      (prev) => {
       return [...prev, obj]
    }
    )
  });
}

  const toggleDropdown = () => {
    setOpen(!isOpen);
  };

  const handleItemClick = (event) => {
    event.preventDefault();
    // console.log(event.target.id);
    selectedItem == event.target.id
      ? setSelectedItem(null)
      : setSelectedItem(event.target.id);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    // handleFilter();
  };

  useEffect(() => {
    let params = {};
    if (location) {
      params.page = location?.state?.currentPage;
    }
    getData(params);
  }, [location, endDate, startDate, searchKeyword, selectedItem]);

  const getData = (paginationParams = {}) => {
    let params = {
      page: paginationParams.page || 1,
      limit: data.limit,
      search: paginationParams.search || "",
      fromDate: startDate ? startDate + "T00:00:00Z" : "2023-08-01T00:00:00Z",
      toDate: endDate ? endDate + "T23:59:59Z" : "2023-12-01T00:00:00Z",
      isSearchKeyword: paginationParams.search,
      isPresentStatus: selectedItem ? selectedItem : null,
    };

    setLoading(true);
    try {
      getUsers(params)
        .then(async (res) => {
          res.data.limit = data.limit;
          // console.log("---------res.data.data.length----->",res.data.data.length,res.data.data);
          if (res.data.data.length) {
            setData(res.data);
            setPlayersData(res.data.totalData)
            setTotalQuiz(res.data.totalItems);
            setLoading(false);
          } else {
            if (params.search === "" && paginationParams.page > 1) {
              // getData({ page: res.data.totalPages });
            } else {
              setData(res.data);
              setPlayersData(res.data)
              setLoading(false);
            }
          }
        })
        .catch((er) => {
          setLoading(false);
          // console.log("er", er);
        });
    } catch (error) {
      // console.log("error", error);
    }
  };


  const toggleUserActive = (status, user) => () => {
    let toggleObj = { user_id: user._id, block_status: status };
    setBlockLoader(user._id);
    toggleBlockUser(toggleObj).then((res) => {
      let usersArr = [...data.usersData];
      let objWithIdIndex = usersArr.findIndex((obj) => obj._id === user._id);
      // console.log("objWithIdIndex", objWithIdIndex);
      usersArr[objWithIdIndex].is_active = status;

      // console.log("usersArr", usersArr);

      setData({ ...data, usersData: [...usersArr] });
      setBlockLoader(false);
    });
  };

  const handleToggleDeleteModal = (status, user) => {
    setShowDeleteModal(status);
    setUserObject(status ? user : {});
  };

  const convertDatetime = (datetime) => {
    let date = new Date(datetime).toLocaleDateString('en-GB');
    // let hours = new Date(datetime).toLocaleTimeString();
    // return `${date} ${hours}`;
    return `${date}`;
  };

  const handleDelete = () => {
    deleteUser({ user_id: userObject._id }).then(() => {
      toast("User Deleted Successfully", { type: "success" });
      getData({ page: data.currentPage });
    });
    handleToggleDeleteModal(false);
  };

  const getList = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan="20" align="center">
            <Loader />
          </td>
        </tr>
      );
    } else {
      return data.data?.length ? (
        data.data.map((user, i) => {
          return (
            <tr key={i}>
              <td className={styles.textPcenter}>
                {(data.currentPage - 1) * data.limit + i + 1}
              </td>
              <td>{user.firstname}</td>
              <td>{user.lastname || "NA"}</td>
              <td>{user.email_address || "NA"}</td>
              <td>{user.institute || "NA"}</td>
              <td>{user.city || "NA"}</td>
              <td>{user.country || "NA"}</td>
              <td>{user.total_time || "NA"}</td>
              <td>{user.questions_attempted || "NA"}</td>
              <td>{user.correct_answers || "NA"}</td>
              {/* <td>{user.present_status || "NA"}</td> */}
              <td>{convertDatetime(user.created_at) || "NA"}</td>
            </tr>
          );
        })
      ) : (
        <tr>
          <td colSpan="20" align="center">
            No Players found
          </td>
        </tr>
      );
    }
  };

  const handleSearch = (event) => {
    const { value } = event.target;
    getData({ search: value.trim() });
  };
  return (
    <Layout>
      <DeleteModal
        showModal={showDeleteModal}
        data={userObject}
        handleToggleDeleteModal={handleToggleDeleteModal}
        handleDelete={handleDelete}
      />
      <main className={styles.main_body}>
        <div className={styles.content}>
          <div className={`${styles.dashboardData} row`}>
            <div className="col-md-4 col-lg-4 col-xl-4">
              <div>
                <div className={`mb-3 ${styles.card_dash}`}>
                  <div className={styles.cardinfo}>
                    <label>Total Quizes Conducted</label>
                    <strong>{totalQuiz}</strong>
                  </div>
                  <div className={styles.cardIcon}>
                    <img src={userSvg} alt="icon" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <hr />
            </div>
          </div>
          <div className="row flex-fill justify-content-between">
            <div className="col-md-12">
              <div className={`${styles.filterSection} row`}>
                <div className="col-md-3">
                  <div className="mb-3">
                    <label htmlFor="" className={`form-lable`}>
                      From Date:{" "}
                    </label>
                    <input
                      type="date"
                      placeholder=""
                      name=""
                      className={` form-control`}
                      value={startDate}
                      onChange={handleStartDateChange}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="mb-3">
                    <label htmlFor="" className={`form-lable`}>
                      To Date:{" "}
                    </label>
                    <input
                      type="date"
                      placeholder=""
                      name=""
                      className={` form-control`}
                      value={endDate}
                      onChange={handleEndDateChange}
                    ></input>
                  </div>
                </div>
                <div className="col-md-3 align-self-end mb-3">
                  <div className={`${styles.serachbar}`}>
                    <input
                      type="search"
                      className={`form-control`}
                      // className= {`${styles.form_control} ${styles.search_input}`}
                      placeholder="Search"
                      onChange={handleSearch}
                      maxLength={12}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <label
                    className={`${styles.form_label} ${styles.exportButton} w-100`}
                  >
                    &nbsp;
                  </label>
                  <JsonToExcelConverter jsonData={playersData} convertDatetime={convertDatetime}/>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className={`${styles.white_box}`}>
                {/* <div className={`${styles.white_box_header}  mb-0 border-0`}>
                  <h1>Players List</h1>
                </div> */}
                <div
                  className={`${styles.table_searchbar} d-flex align-items-center`}
                >
                  <div
                    className={`${styles.show_item} d-flex align-items-center me-auto`}
                  ></div>
                </div>
                <div className="table-responsive">
                  <table className="table" ref={tableRef}>
                    <thead>
                      <tr>
                        <th className={styles.textcenter}>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th className="text-center">Hospital/Institution</th>
                        <th className="text-center">City</th>
                        <th className="text-center">Country</th>
                        <th className="text-center">Time Taken</th>
                        <th className="text-center">Questions Attempted</th>
                        <th className="text-center">Correct Answers</th>
                        <th className="text-center">Attended On(date)</th>
                      </tr>
                    </thead>
                    <tbody>{getList()}</tbody>
                  </table>
                </div>

                <Pagination
                  totalItems={data.totalItems}
                  currentPage={data.currentPage}
                  totalPages={data.totalPages}
                  getData={getData}
                  limit={data.limit}
                  loading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
