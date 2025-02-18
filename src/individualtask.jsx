import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import clsx from "clsx";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TaskCard from "./taskcard";
import { useNavigate } from "react-router-dom";

const IndividualTask = () => {
  const [taskInfo, settaskInfo] = useState([]);
  const [taskList, settaskList] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleApply = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    try {
      const response = await axios.post("http://localhost:3000/apply-task", {
        taskId: id,
        TaskerId: userId,
      });

      if (response.status === 200) {
        toast.success("task Applied Successfully 🎉");
        navigate("/home");
      } else {
        toast.error("Error Applying Job 😢");
      }
    } catch (error) {
      toast.error(error?.response?.data || "Something went wrong!");
      console.error(error);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/get-all-task")
      .then((response) => settaskList(response?.data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (id)
      axios
        .get(`http://localhost:3000/show-task/${id}`)
        .then((response) => settaskInfo(response?.data))
        .catch((error) => console.log(error));
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-gray-200 pt-20 px-20 pb-20">
      <h1 className="text-4xl font-bold ">Task Detail</h1>
      <div className="container mt-20 mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mb-4">
          <div className="p-4">
            <h2 className="text-xl font-semibold">{taskInfo.taskTitle}</h2>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Task Details</h3>
              <p>{taskInfo.taskInfo}</p>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Requirements</h3>
              <p>{taskInfo.requirements}</p>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Task Type</h3>
              <p>{taskInfo.taskStage}</p>
            </div>
            <div className="mt-4 mb-5">
              <h3 className="text-lg font-semibold">Price Range</h3>
              <p>{taskInfo.priceRange}</p>
            </div>

            <button
              className={clsx(
                "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700",
                dayjs(taskInfo.submitBy).isBefore(new Date())
                  ? "bg-gray-600 pointer-events-none"
                  : "bg-blue-700"
              )}
              disabled={
                dayjs(taskInfo.submitBy).isBefore(new Date()) ||
                localStorage.getItem("userRole") === "Task Poster"
              }
              onClick={handleApply}
            >
             Post Now
            </button>

            {localStorage.getItem("userRole") === "Task Poster" && (
              <p className="text-red-500 mt-4">
                Only Taskers can apply for tasks.
              </p>
            )}
          </div>
        </div>

        {localStorage.getItem("userRole") === "Tasker" && (
          <>
            <h1 className="text-4xl md:text-5xl lg:text-4xl font-bold text-black leading-tight mt-12 mb-8">
              Recommended tasks
            </h1>

            <div className="grid grid-cols-3 gap-5">
              {taskList.slice(0, 3).map((list) => (
                <TaskCard props={list} key={list.id} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default IndividualTask;
