/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import Event from "@material-ui/icons/Event";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import Unarchive from "@material-ui/icons/Unarchive";
import Language from "@material-ui/icons/Language";
// core components/views for Admin layout
import DashboardCo from "views/Dashboard/Dashboard.js";
import SetInterview from "views/SetInterview/SetInterview.js";
import ScheduleInterview from "views/ScheduleInterview/ScheduleInterview.js";
import ScheduleName from "views/ScheduleName/ScheduleName.js";
import UserProfile from "views/UserProfile/UserProfile.js";
//import TableList from "views/TableList/TableList.js";
import Typography from "views/Typography/Typography.js";
import Icons from "views/Icons/Icons.js";
import Maps from "views/Maps/Maps.js";
import NotificationsPage from "views/Notifications/Notifications.js";
import UpgradeToPro from "views/UpgradeToPro/UpgradeToPro.js";
// core components/views for RTL layout
import RTLPage from "views/RTLPage/RTLPage.js";
import Open_Chatbot from "views/Open_Chatbot/Open_Chatbot.js";
import CandidateResult from "views/CandidateResult/CandidateResult.js"


const dashboardRoutes = [
    {
    path: "/schedule",
    name: "Your Interviews",
    rtlName: "لوحة القيادة",
    icon: Event,
    component: ScheduleInterview,
    layout: "/adminco"
  },

  {
    path: "/setinterview",
    name: "Set Interview",
    rtlName: "لوحة القيادة",
    icon: Event,
    component: SetInterview,
    layout: "/adminco"
  },

      {
    path: "/results",
    name: "Candidate Results",
    rtlName: "لوحة القيادة",
    icon: Event,
    component: CandidateResult,
    layout: "/adminco"
  },
  {
    path: "/nameschedule",
    rtlName: "قائمة الجدول",
    name: "Names",
    icon : Event,
    //variable : "name",
    component: ScheduleName,
    layout: "/adminco"
  }
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   rtlName: "طباعة",
  //   icon: LibraryBooks,
  //   component: Typography,
  //   layout: "/admin"
  // },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   rtlName: "الرموز",
  //   icon: BubbleChart,
  //   component: Icons,
  //   layout: "/admin"
  // },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   rtlName: "خرائط",
  //   icon: LocationOn,
  //   component: Maps,
  //   layout: "/admin"
  // },

  // {
  //   path: "/rtl-page",
  //   name: "RTL Support",
  //   rtlName: "پشتیبانی از راست به چپ",
  //   icon: Language,
  //   component: RTLPage,
  //   layout: "/rtl"
  // },
  // {
  //   path: "/upgrade-to-pro",
  //   name: "Upgrade To PRO",
  //   rtlName: "التطور للاحترافية",
  //   icon: Unarchive,
  //   component: UpgradeToPro,
  //   layout: "/admin"
  // }

];

export default dashboardRoutes;
