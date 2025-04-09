import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Signup from "./signup";
import Homepage from "./homepage";
import Login from "./login";
import LandingPage from "./landingpage";
import Auth from "./auth";
import Task from "./task";
import Collab from "./collab";
import Explore from "./explore";
import Mytasks from "./mytasks";
import Archive from "./archivetask";
import TaskCard from "./taskcard";
import IndividualTask from "./individualtask";
import Messages from "./messages";
import AcceptedTasks from "./acceptedtasks";
import Payment from "./payment";
import Success from "./escrow";
import BiddingFormOverlay from "./biddingform";
import Rejectedtasks from "./rejectedtasks";
import ClientPage from "./clientpage";
import PaymentPage from "./paymentpage";
import ReviewForm from "./rating";
import ForgetPassword from "./forgotpassword";
import AdminHomepage from "./adminhomepage";
import AdminTms from "./admintms";
import AdminExplore from "./adminexplore";
import AdminRejectedtasks from "./adminreject";


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
    { path: "/chat", element: <Messages /> },
    { path: "/accepted-tasks", element: <AcceptedTasks /> },
    { path: "/payment", element: <Payment /> },
    { path: "/success", element: <Success /> },
    { path: "/bidding-form", element: <BiddingFormOverlay /> },
    { path: "/rejected-tasks", element: <Rejectedtasks /> },
    { path: "/client", element: <ClientPage /> },
    { path: "/paymentpage", element: <PaymentPage /> },
    { path: "/review", element: <ReviewForm /> },
    { path: "/forgot-password", element: <ForgetPassword /> },
    { path: "/admin-homepage", element: <AdminHomepage /> },
    { path: "/admin-tms", element: <AdminTms /> },
    { path: "/admin-explore", element: <AdminExplore /> },
    { path: "/rejectedTasks", element: <AdminRejectedtasks /> },
    // { path: "/admin-ums", element: <AdminUms /> },
  ]);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <ToastContainer position="top-right" autoClose={3000} />
      <RouterProvider router={router} />
    </MantineProvider>
  );
}

export default App;
