import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrorMessage,
  clearUser,
  setErrorMessage,
  startLoading,
} from "../redux/user/userSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import DeleteConfirmation from "../components/DeleteConfirmation";
import toast from "react-hot-toast";
import ListingItem from "../components/ListingItem";
import { useOnClickOutside } from "../hooks/FocusHooks";
import { FaHandHoldingMedical, FaRegHeart } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

export default function UserProfile() {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const { currentUser, error } = useSelector((state) => state.user);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [openDialog, setOpenDialog] = useState(null);
  const [expand, setExpand] = useState(false);
  const [profile, setProfile] = useState(null);
  const [like, setLike] = useState(false);
  const dropdown = useRef();
  useOnClickOutside(dropdown, () => {
    setExpand(false);
  });

  useEffect(() => {
    const getListings = async () => {
      try {
        const res = await fetch(`/api/user/listings/${params.userId}`);
        const data = await res.json();

        if (data.success === false) {
          setShowListingsError(true);
          return;
        }

        setUserListings(data);
        setShowListingsError(false);
      } catch (error) {
        setShowListingsError(true);
      }
    };

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/user/${params.userId}`);
        const data = await res.json();

        if (data.success === false) {
          return;
        }
        setProfile(data);

        const profileLikes = data.likes;
        if (profileLikes.includes(currentUser._id)) {
          setLike(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getListings();
    fetchProfile();
    return () => {
      dispatch(clearErrorMessage());
    };
  }, [dispatch, params.userId, like]);

  const handleDeleteUser = async () => {
    try {
      dispatch(startLoading());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(setErrorMessage(data.message));
        return;
      }
      dispatch(clearUser());
      setOpenDialog(false);
      toast.success("Congratulation, you have successfully deleted yourself!");
    } catch (error) {
      dispatch(setErrorMessage(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(startLoading());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(setErrorMessage(data.message));
        return;
      }

      dispatch(clearUser());
      toast.success("Sign out successfully");
    } catch (error) {
      dispatch(setErrorMessage(error.message));
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      toast("You are not logged in, please sign in first");
      navigate("/sign-in");
    }

    const res = await fetch(`/api/user/like/${profile._id}`, {
      method: "POST",
    });

    const data = await res.json();

    if (data.success === false) {
      return;
    }

    setLike(!like);
  };

  const currentDate = new Date();
  function getJoinPeriod(startDate, endDate) {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    let years = end.getUTCFullYear() - start.getUTCFullYear();
    let months = end.getUTCMonth() - start.getUTCMonth();
    let duration = "";

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years !== 0) {
      duration += `${years} year${years !== 1 ? "s" : ""}`;
    }

    if (months !== 0) {
      if (years !== 0) {
        duration += ", ";
      }

      duration += `${months} month${months !== 1 ? "s" : ""}`;
    }

    return duration === "" ? "New user" : duration;
  }

  return (
    <main>
      <div className="p-3 max-w-7xl mx-auto flex flex-col">
        <div>
          <img
            className="object-cover w-full h-32"
            src="https://imgv3.fotor.com/images/share/Free-blue-gradient-pattern-background-from-Fotor.jpg"
            alt=""
          />
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="p-3 -mt-20 md:-mt-[76px]  md:w-[324px]">
            <div className="flex flex-col gap-4 text-slate-700">
              <div className="relative">
                <img
                  className="rounded-full h-36 w-36 object-cover border-4 border-slate-100"
                  src={
                    profile
                      ? profile.avatar
                      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  }
                  alt="profile"
                />
                {currentUser && currentUser._id === params.userId && (
                  <Link to="/settings">
                    <button className="bottom-0 right-5 absolute hover:underline border-solid border-spacing-2 border-red-500">
                      Edit Profile
                    </button>
                  </Link>
                )}
              </div>
              {profile ? (
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl font-semibold">
                    {profile.username}{" "}
                    {profile.contactInfo && (
                      <span className="text-sm text-gray-400">
                        {profile.contactInfo.phoneNumber}
                      </span>
                    )}
                  </h2>
                  <div className="flex gap-5">
                    <div className="flex gap-2 items-center">
                      <MdLocationOn />
                      <p>
                        {profile.contactInfo
                          ? profile.contactInfo.address.city ||
                            "No detail provided"
                          : "No detail provided"}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <FaHandHoldingMedical />
                      <p>
                        Joined {getJoinPeriod(profile.createdAt, currentDate)}
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm h-16">
                    {profile.description ??
                      "This user too lazy to include a description"}
                  </p>
                  <div className="flex items-center gap-1">
                    <FaRegHeart className="h-4 w-4 ms-auto" />
                    <p>{profile.likes.length}</p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-sm h-16">
                  No profile available
                </p>
              )}
            </div>

            {currentUser && currentUser._id === params.userId && (
              <div>
                <div className="flex justify-between mt-5">
                  <span
                    onClick={() => {
                      setId(currentUser._id);
                      setOpenDialog("user");
                    }}
                    className="text-red-700 cursor-pointer"
                  >
                    Delete account
                  </span>
                  <span
                    onClick={handleSignOut}
                    className="text-red-700 cursor-pointer"
                  >
                    Sign out
                  </span>
                </div>
                <p className="text-red-700 mt-5">{error ? error : ""}</p>
              </div>
            )}
          </div>

          <div className="flex-1 m-2 border-2 border-slate-300">
            <div className="flex flex-col gap-4 text-center">
              <div className="inline-flex mt-2">
                {currentUser && currentUser._id === params.userId ? (
                  <div className="flex ml-2">
                    <Link
                      className="p-2 hover:border-b-2 border-gray-300"
                      to={"/create-listing"}
                    >
                      <p>Create Listing</p>
                    </Link>
                    <Link
                      className="p-2 hover:border-b-2 border-gray-300"
                      to={"/profile"}
                    >
                      <p>Manage Listing</p>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-row items-center gap-2 ms-auto">
                    <button
                      onClick={handleLike}
                      className="outline outline-slate-300 rounded p-1 px-4 hover:bg-slate-200"
                    >
                      {like ? "Unlike" : "Like"}
                    </button>
                    <div
                      className="relative"
                      ref={dropdown}
                      onClick={() => {
                        setExpand(!expand);
                      }}
                    >
                      <button className="p-2">
                        <svg
                          className="h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 128 512"
                        >
                          <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                        </svg>
                      </button>
                      {expand && (
                        <ul className="right-0 absolute mt-2 shadow-xl">
                          <li className="">
                            <button className="bg-red-700 rounded p-1 px-4 text-white hover:text-opacity-85">
                              Report
                            </button>
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <h1 className="text-center text-2xl font-semibold">Listings</h1>
              {!showListingsError &&
                (userListings.length > 0 ? (
                  <div className="">
                    <div className="p-3 flex flex-wrap gap-4">
                      {userListings.map((listing) => (
                        <ListingItem
                          key={listing._id}
                          listing={listing}
                          containerClass="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg sm:w-[150px] w-full"
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="inline-block text-gray-400 h-64 place-content-center">
                    {currentUser && currentUser._id === params.userId ? (
                      <p>
                        Looks kinda empty here...{" "}
                        <Link to="/create-listing" className="text-blue-500">
                          add listing
                        </Link>
                      </p>
                    ) : (
                      <div>
                        {profile ? (
                          <p>User has not create a listing yet</p>
                        ) : (
                          <p className="text-red-700 mt-5">
                            User does not exist
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              <p className="text-red-700 mt-5">
                {showListingsError ? "Error showing listings" : ""}
              </p>
            </div>
            <DeleteConfirmation
              isOpen={openDialog === "user"}
              remove={handleDeleteUser}
              cancel={() => setOpenDialog(false)}
              messageTitle="Delete User"
              messageContent="Are you sure you want to delete your account?
          All data will be deleted. This action cannot be undone."
              id={currentUser ? currentUser._id : ""}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
