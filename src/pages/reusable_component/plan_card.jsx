import { useState } from "react";
import axios from "axios";
import { BackendURL } from "../../components/untile";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hook/useAuth";

const Plan_card = (props) => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const choosePlan = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (props.state) {
        response = await axios.post(BackendURL + "/auth/setplan", {
          username: user.username,
          planname: "PRO",
          credit: 30,
        });
      } else {
        response = await axios.post(BackendURL + "/auth/setplan", {
          username: user.username,
          planname: "FREE",
          credit: 10,
        });
      }
      if (response.data.state) {
        navigate("/manuscript");
      }
    } catch (err) {
      console.log("plan err!");
    }
  };
  return (
    <div className="w-80 max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
      <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
        {props.plan}
      </h5>
      <div className="flex items-baseline text-gray-900 dark:text-white">
        <span className="text-3xl font-semibold">$</span>
        <span className="text-5xl font-extrabold tracking-tight">
          {props.price}
        </span>
        <span className="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">
          /month
        </span>
      </div>
      <ul role="list" className="space-y-5 my-7">
        <li className="flex items-center">
          <svg
            className="flex-shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
          <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
            Generate {props.count} times
          </span>
        </li>
      </ul>
      <button
        type="button"
        onClick={choosePlan}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center"
      >
        Choose Plan
      </button>
    </div>
  );
};

export default Plan_card;
