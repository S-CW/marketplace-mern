import React from "react";

export default function App() {
  return (
    <div className="py-20 px-4 max-w-6xl my-auto">
      <h1 className="text-3xl font-bold mb-4 text-slate-800">
        About Trial Market
      </h1>
      <p className="mb-4 text-slate-700">
        This is just a website example build using MERN Stack that demonstrate
        the functionality of a website as a marketplace that allows user to view
        through the marketplace.
      </p>
      <p className="mb-4 text-slate-700">
        User has the power to post their own listing to the marketplace to be
        viewed by other user using the website. If there is a need to change the
        listing detail posted, an edit listing function is available at the
        profile page located at the top right of the page. User can choose to
        delete the posted listing via the profile page as well.
      </p>
      <p className="mb-4 text-slate-700">
        Please be aware that this is open to public meaning anyone visiting the
        website is able to view the listing and details that you have created.
      </p>
    </div>
  );
}
