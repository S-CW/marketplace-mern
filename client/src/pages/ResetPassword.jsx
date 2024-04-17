import React, { useEffect, useState } from "react";
import * as jwt from "jose";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tokenFromUrl = urlParams.get("token");
    setToken(tokenFromUrl);

    const verifyToken = async () => {
      try {
        const secret = new TextEncoder().encode(
          import.meta.env.VITE_JWT_SECRET
        );

        await jwt.jwtVerify(tokenFromUrl, secret);
        setIsExpired(false);
        setLoading(false);
      } catch (error) {
        setIsExpired(true);
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, isExpired]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/auth/reset-password?token=${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        setIsExpired(true);
        return;
      }

      toast.success("Password updated!");
      navigate("/sign-in");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-lg p-8 sm:m-28 sm:border border-slate-300 rounded-md w-full">
        <h1 className="text-3xl text-center font-semibold m-10">
          Reset Password
        </h1>
        {!loading &&
          (!isExpired ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col flex-1 gap-6"
            >
              <input
                className="border p-3 rounded-lg"
                type="password"
                placeholder="New password"
                id="newPassword"
                onChange={handleChange}
              />
              <input
                className="border p-3 rounded-lg"
                type="password"
                placeholder="Confirm password"
                id="confirmPassword"
                onChange={handleChange}
              />
              <button className="bg-green-600 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80">
                Confirm
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="flex gap-3 items-center p-3 rounded-lg bg-red-200 text-slate-800">
                <FaExclamationTriangle />
                The password reset link has expired
              </p>
              <Link
                to={"/forgot-password"}
                className="text-sm text-slate-600 hover:underline mt-1"
              >
                Request for password change.
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
