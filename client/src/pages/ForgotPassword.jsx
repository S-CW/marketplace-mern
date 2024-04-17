import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearErrorMessage, setErrorMessage } from "../redux/user/userSlice";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(() => {
    const sentStatus = localStorage.getItem("sentStatus");
    return JSON.parse(sentStatus) ?? false;
  });
  const [timer, setTimer] = useState(() => {
    const targetTimer = localStorage.getItem("targetTime");
    return targetTimer ? targetTimer - new Date().getTime() : null;
  });

  useEffect(() => {
    if (sent && Math.floor(timer / 1000) > -1) {
      const interval = setInterval(() => {
        setTimer(localStorage.getItem("targetTime") - new Date().getTime());
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setSent(false);
    }

    dispatch(clearErrorMessage());
  }, [timer, sent]);

  // persist sent state
  useEffect(() => {
    localStorage.setItem("sentStatus", sent);
  }, [sent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSent(true);
      const countDown = new Date().getTime() + 2 * 60 * 1000;
      localStorage.setItem("targetTime", countDown);
      setTimer(countDown);

      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(setErrorMessage(data.message));
        setSent(false);
        return;
      }

      setEmail("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-lg p-8 sm:m-28 sm:border border-slate-300 rounded-md w-full">
        <div className="flex flex-col gap-6 mb-6 text-center">
          <h1 className="text-3xl font-semibold mt-10">Reset Password</h1>
          <p className="text-slate-500">
            Please enter the email to your account. A link will be sent to your
            email to reset password
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 gap-6 text-center"
        >
          <input
            className="border p-3 rounded-lg"
            type="text"
            placeholder={
              sent
                ? `Try again in ${Math.floor(timer / 1000)}s`
                : "Your email address"
            }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="bg-green-600 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80"
            disabled={sent}
          >
            {sent ? "An email has been sent" : "Recover password"}
          </button>
        </form>
        {error && <p className="text-red-500 mt-5">{error}</p>}
      </div>
    </div>
  );
}
