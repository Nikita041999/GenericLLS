import Layout from "components/Layout";
import { deleteUser, getUserDetail, toggleBlockUser } from "lib/network/apis";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import viewIcon from "assets/images/viewIcon.svg";
import deleteIcon from "assets/images/delete_ico.svg";
import activeIcon from "assets/images/activeIcon.svg";
import deactiveIcon from "assets/images/deactiveIcon.svg";
import pendingIcon from "assets/images/pendingIcon.svg";
import backIcon from "assets/images/back-icon.svg";
import userImg from "assets/images/userImg.svg";
import Pagination from "components/Pagination";
import DeleteModal from "components/Modals/DeleteModal";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Loader from "components/Loader";
import { toast } from "react-toastify";
export default function UserDetail() {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [blockLoader, setBlockLoader] = useState(false);
  const [error, setError] = useState(false);

  const [searchParam] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    getData();
  }, []);
  const params = useParams();

  const getData = (paginationParams = {}) => {
    // let params = { page: paginationParams.page || 1, limit: data.limit };
    setLoading(true);
    try {
      getUserDetail(params)
        .then((res) => {
          setData(res.data.data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.response.data.message);
          setLoading(false);
        });
    } catch (error) {
    }
  };
  
  const toggleUserActive = (status, user) => () => {
    let toggleObj = { user_id: user._id, block_status: status };
    setBlockLoader(true);
    toggleBlockUser(toggleObj).then((res) => {
      setBlockLoader(false);
      let user = { ...data };

      user.is_active = status;

      setData({ ...user });
    });
  };

  const handleToggleDeleteModal = (status, user) => {
    setShowDeleteModal(status);
  };
  const handleDelete = () => {
    setDeleteLoader(true);
    deleteUser({ user_id: data._id }).then(() => {
      toast("User Deleted Successfully", { type: "success" });
      setDeleteLoader(false);
      navigate("/users", {
        state: { currentPage: searchParam.get("currentPage") },
      });
    });

    handleToggleDeleteModal(false);
  };

  const handleBack = () => {
    navigate("/users", {
      state: { currentPage: searchParam.get("currentPage") },
    });
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
      return data?.events?.length ? (
        data.events.map((event, i) => {
          return (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{event.title}</td>
              <td>{event.event_host_details[0]?.username}</td>
              <td className="text-center"> {event.member_list.length}</td>
              <td className="text-center">{event.moonaru_count}</td>

              <td className="text-center">
                {event.is_reported == 0 ? (
                  // <img
                  //   src={pendingIcon}
                  //   alt="Pending"
                  //   title="Pending"
                  //   height="17"
                  // />
                  <>{/* <i Classname="fab fa-font-awesome-flag"></i> */}</>
                ) : (
                  // <img
                  //   src={activeIcon}
                  //   alt="Active"
                  //   title="Active"
                  //   height="17"
                  // />
                  <i
                    className="fa fa-flag"
                    aria-hidden="true"
                    style={{ color: "red" }}
                  ></i>
                )}
              </td>
              <td className="text-center">
                {dayjs(event.createdAt).format("DD-MM-YYYY")}
              </td>
              <td className="text-center">
                <div className="">
                  <a href={`/events/${event._id}`} className="me-2">
                    <img src={viewIcon} alt="edit" />
                  </a>
                </div>
              </td>
            </tr>
          );
        })
      ) : (
        <tr>
          <td colSpan="20" align="center">
            No events found
          </td>
        </tr>
      );
    }
  };
  return (
    <Layout>
      <DeleteModal
        showModal={showDeleteModal}
        data={data}
        handleToggleDeleteModal={handleToggleDeleteModal}
        handleDelete={handleDelete}
      />
      <main className="main-body">
        <div className="content">
          <div className="row flex-fill justify-content-between">
            <div className="col-md-12">
              <span className="backtopage" onClick={handleBack}>
                <img src={backIcon} /> Back
              </span>

              <div className="white-box mt-2">
                {isLoading ? (
                  <div className="row mt-4 d-block">
                    <Loader />
                  </div>
                ) : error ? (
                  <div className="col-md-12 text-center py-5 my-5 ">
                    {error}
                  </div>
                ) : (
                  <>
                    <div className="white-box-header mb-0 ">
                      {/* <h1>{data.username}</h1> */}
                      <h1></h1>
                      {deleteLoader ? (
                        <Loader />
                      ) : (
                        <span
                          className="btn btn-primary btn-sm c-pointer"
                          onClick={() => handleToggleDeleteModal(true, data)}
                        >
                          <i className="fa-solid fa-trash "></i>&nbsp; Delete
                        </span>
                      )}
                    </div>

                    <div className="row mt-4">
                      <div className="col-md-4 mobilecenter">
                        <div className="userimage">
                          <img
                            src={
                              data.profile_photo ? data.profile_photo : userImg
                            }
                            alt="image"
                            height={"100px"}
                          />
                        </div>
                        <h4
                          className="mt-3 mb-1"
                          style={{ wordBreak: "break-all" }}
                        >
                          {data.username}
                          <div className="userStatus">
                            ({data.status == 1 ? "Verified" : "Pending"})
                          </div>
                        </h4>
                        <br />
                      </div>

                      <div className="col-md-8">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3 detail_info">
                              <label className="form-label">
                                Email Address
                              </label>
                              <div>{data.email ? data.email : "NA"}</div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3 detail_info">
                              <label className="form-label">
                                Registered On
                              </label>
                              <div>
                                {dayjs(data.createdAt).format("DD-MM-YYYY")}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3 detail_info">
                              <label className="form-label">
                                Total Participant Events
                              </label>
                              <div>{data.participant_event_count}</div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3 detail_info">
                              <label className="form-label">
                                Total Created Events
                              </label>
                              <div>{data.created_event_count}</div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3 detail_info">
                              <label className="form-label">Total Videos</label>
                              <div>{data.individual_videos_count}</div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3 detail_info">
                              <label className="form-label">
                                Total Videos
                              </label>
                              <div>
                                {data.moonaru_videos_count}{" "}
                                {/* <a href="#" style={{ fontSize: "12px" }}>
                              View
                            </a> */}
                              </div>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="mb-3 detail_info">
                              <div className="mb-3 detail_info">
                                <label className="form-label">Active</label>
                                <div>
                                  {blockLoader ? (
                                    <Loader />
                                  ) : data.is_active == 1 ? (
                                    <span
                                      className="badge bg-success c-pointer"
                                      onClick={toggleUserActive(2, data)}
                                    >
                                      <i className="fa-solid fa-check "></i>
                                      &nbsp; Yes
                                    </span>
                                  ) : (
                                    <span
                                      className="badge bg-danger c-pointer"
                                      onClick={toggleUserActive(1, data)}
                                    >
                                      <i className="fa-solid fa-ban "></i>
                                      &nbsp; No
                                    </span>
                                  )}
                                </div>
                              </div>
                              {/* {blockLoader ? (
                                <Loader />
                              ) : data.is_active == 1 ? (
                                <span
                                  className="badge bg-primary c-pointer"
                                  onClick={toggleUserActive(2, data)}
                                >
                                  <i className="fa-solid fa-check "></i>
                                  &nbsp; Unblock
                                </span>
                              ) : (
                                <span
                                  className="badge bg-danger c-pointer"
                                  onClick={toggleUserActive(1, data)}
                                >
                                  <i className="fa-solid fa-ban "></i>
                                  &nbsp; Block
                                </span>
                              )} */}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-12">
                        <h5>All Participated Events</h5>
                        <div className="table-responsive mt-4">
                          <table className="table">
                            <thead>
                              <tr>
                                <th width="40">#</th>
                                <th>Title</th>
                                <th>Host Username</th>
                                <th className="text-center">Members Count</th>
                                <th className="text-center">Count</th>
                                <th className="text-center">Is Reported</th>
                                <th className="text-center">Created On</th>
                                <th className="text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody>{getList()}</tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
