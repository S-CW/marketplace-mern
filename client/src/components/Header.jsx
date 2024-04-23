import {
  FaCog,
  FaSearch,
  FaSignOutAlt,
  FaThList,
  FaUser,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { clearUser, setErrorMessage } from "../redux/user/userSlice";
import toast from "react-hot-toast";
import { useOnClickOutside } from "../hooks/FocusHooks";

export default function Header() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdown = useRef();
  useOnClickOutside(dropdown, () => {
    setShowDropdown(false);
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/auth/signout");
      const data = res.json();
      if (data.success === false) {
        dispatch(setErrorMessage(data.message));
        return;
      }

      dispatch(clearUser());
      navigate("/sign-in");
      toast.success("Sign out successfully");
    } catch (error) {
      dispatch(setErrorMessage(error.message));
    }
  };

  const handleDropdown = (e) => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Trial</span>
            <span className="text-slate-700">Market</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center "
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="inline-flex items-center">
          {currentUser ? (
            <li
              className="inline-block text-slate-700 dropdown relative hover:bg-slate-300 rounded-md group"
              onClick={handleDropdown}
              ref={dropdown}
              onMouseEnter={() => {
                setShowDropdown(true);
              }}
              onMouseLeave={() => {
                setShowDropdown(false);
              }}
            >
              <button className="font-semibold py-1 px-2 rounded inline-flex items-center gap-1 hover:underline">
                <img
                  className="rounded-full h-7 w-7"
                  src={currentUser.avatar}
                  alt="profile"
                />
                <p className="hidden sm:inline truncate max-w-28">
                  {currentUser.username}
                </p>
                <svg
                  className="hidden sm:inline fill-current h-4 w-4 group-hover:animate-bounce"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />{" "}
                </svg>
              </button>
              {showDropdown && (
                <ul
                  className={
                    "dropdown-menu right-0 sm:left-0 absolute w-[250px]  sm:min-w-max bg-slate-100 shadow-xl items-center rounded"
                  }
                >
                  <Link to="/profile">
                    <li className="hover:bg-slate-200 py-2 px-4 block whitespace-no-wrap">
                      <div className="flex gap-3">
                        <div className="rounded-full h-7 w-7 flex justify-center items-center bg-slate-50 border-2">
                          <FaUser className="text-sky-800 h-4 w-4" />
                        </div>
                        <span>Profile</span>
                      </div>
                    </li>
                  </Link>
                  <Link to="/profile">
                    <li className="hover:bg-slate-200 py-2 px-4 block whitespace-no-wrap">
                      <div className="flex gap-3">
                        <div className="rounded-full h-7 w-7 flex justify-center items-center bg-slate-50 border-2">
                          <FaThList className="text-sky-800 h-4 w-4" />
                        </div>
                        <span>My listings</span>
                      </div>
                    </li>
                  </Link>
                  <Link to="/settings">
                    <li className="hover:bg-slate-200 py-2 px-4 block whitespace-no-wrap">
                      <div className="flex gap-3 items-center">
                        <div className="rounded-full h-7 w-7 flex justify-center items-center bg-slate-50 border-2">
                          <FaCog className="text-sky-800 h-4 w-4" />
                        </div>
                        <span>Settings</span>
                      </div>
                    </li>
                  </Link>
                  <li
                    onClick={handleSignOut}
                    className="hover:bg-slate-200 py-2 px-4 block whitespace-no-wrap hover:cursor-pointer"
                  >
                    <div className="flex gap-3">
                      <div className="rounded-full h-7 w-7 flex justify-center items-center bg-slate-50 border-2">
                        <FaSignOutAlt className="text-sky-800 h-4 w-4" />
                      </div>
                      <span>Log out</span>
                    </div>
                  </li>
                </ul>
              )}
            </li>
          ) : (
            <Link to="/sign-in">
              <li className="inline p-2 text-slate-700 hover:bg-slate-300 rounded-md">
                Sign In
              </li>
            </Link>
          )}
          <Link to="/">
            <li className="hidden p-2 sm:inline text-slate-700 hover:bg-slate-300 rounded-md">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden p-2 sm:inline text-slate-700 hover:bg-slate-300 rounded-md">
              About
            </li>
          </Link>
        </ul>
      </div>
    </header>
  );
}
