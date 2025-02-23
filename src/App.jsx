import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Signup from "./signup";
import Homepage from "./homepage";
import Login from "./Login";
import LandingPage from "./landingpage";
import Auth from "./auth";
import Task from "./task";
import Collab from "./collab";
import Explore from "./explore";
import Mytasks from "./mytasks";
import Archive from "./archivetask";
import TaskCard from "./taskcard";
import IndividualTask from "./individualtask";
import Chat from "./Chat";
import AcceptedTasks from "./acceptedtasks";

function App() {
  const router = createBrowserRouter([
    { path: "/home", element: <Homepage /> },
    { path: "/", element: <LandingPage /> },
    { path: "/authentication", element: <Auth /> },
    { path: "/signup", element: <Signup /> },
    { path: "/login", element: <Login /> },
    { path: "/create-task", element: <Task /> },
    { path: "/taskcard", element: <TaskCard /> },
    { path: "/task/:id", element: <IndividualTask /> },
    { path: "/collab-task", element: <Collab /> },
    { path: "/explore", element: <Explore /> },
    { path: "/my-tasks", element: <Mytasks /> },
    { path: "/archive", element: <Archive /> },
    { path: "/chat", element: <Chat /> },
    { path: "/accepted-tasks", element: <AcceptedTasks /> },
  ]);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <ToastContainer position="top-right" autoClose={3000} />
      <RouterProvider router={router} />
    </MantineProvider>
  );
}

export default App;
