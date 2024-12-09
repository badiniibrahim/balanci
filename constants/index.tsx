import { UserCircle } from "lucide-react";

import {
  FaDollarSign,
  FaFileInvoice,
  FaPiggyBank,
  FaRegCreditCard,
  FaRegStar,
  FaUserCircle,
} from "react-icons/fa";
import { AiOutlineAppstore } from "react-icons/ai";

export const sidebarLinks = [
  {
    icon: AiOutlineAppstore,
    route: "/dashboard",
    label: "Dashboard",
  },
  {
    icon: FaDollarSign,
    route: "/dashboard/income",
    label: "Income",
  },
  {
    icon: FaFileInvoice,
    route: "/dashboard/charges",
    label: "Charges",
  },
  {
    icon: FaPiggyBank,
    route: "/dashboard/savings",
    label: "Savings and Investments",
  },
  {
    icon: FaRegCreditCard,
    route: "/dashboard/debts",
    label: "Debts",
  },
  {
    icon: FaRegStar,
    route: "/dashboard/upgrade",
    label: "Upgrade",
  },
  {
    icon: FaUserCircle,
    route: "/dashboard/profile",
    label: "Profile",
  },
];

export const Options = [
  {
    icon: "/images/exam.jpg",
    name: "Exam",
  },
  {
    icon: "/images/job.jpg",
    name: "Job Interview",
  },
  {
    icon: "/images/practice.jpg",
    name: "Practice",
  },
  {
    icon: "/images/code.jpg",
    name: "Coding Prep",
  },
  {
    icon: "/images/exam.jpg",
    name: "Other",
  },
];

export const earningData = [
  {
    icon: UserCircle,
    amount: "39,354",
    percentage: "-4%",
    title: "Customers",
    iconColor: "#03C9D7",
    iconBg: "#E5FAFB",
    pcColor: "red-600",
  },
  {
    icon: UserCircle,
    amount: "4,396",
    percentage: "+23%",
    title: "Products",
    iconColor: "rgb(255, 244, 229)",
    iconBg: "rgb(254, 201, 15)",
    pcColor: "green-600",
  },
  {
    icon: UserCircle,
    amount: "423,39",
    percentage: "+38%",
    title: "Sales",
    iconColor: "rgb(228, 106, 118)",
    iconBg: "rgb(255, 244, 229)",

    pcColor: "green-600",
  },
  {
    icon: UserCircle,
    amount: "39,354",
    percentage: "-12%",
    title: "Refunds",
    iconColor: "rgb(0, 194, 146)",
    iconBg: "rgb(235, 250, 242)",
    pcColor: "red-600",
  },
];

export const Currencies = [
  { value: "USD", label: "$ Dollar", locale: "en-US" },
  { value: "EUR", label: "€ Euro", locale: "de-DE" },
];

export type Currency = (typeof Currencies)[0];

export const plans = [
  {
    _id: 1,
    name: "5 Credits",
    icon: "/icons/free-plan.svg",
    price: "$0,99",
    priceId: "price_1QFePLGB8tyiLObDikhka6TW",
  },
  {
    _id: 2,
    name: "10 Credits",
    icon: "/icons/free-plan.svg",
    price: "$1.99",
    priceId: "price_1QFeQCGB8tyiLObDX39gy3QD",
  },
  {
    _id: 3,
    name: "25 Credits",
    icon: "/icons/free-plan.svg",
    price: "$3.99",
    priceId: "price_1QFeQqGB8tyiLObDRaahBIWc",
  },

  {
    _id: 4,
    name: "50 Credits",
    icon: "/icons/free-plan.svg",
    price: "$6.99",
    priceId: "price_1QFeRRGB8tyiLObDogjCVrxP",
  },

  {
    _id: 5,
    name: "100 Credits",
    icon: "/icons/free-plan.svg",
    price: "$9.99",
    priceId: "price_1QFeRvGB8tyiLObDiXAM6WjZ",
  },
];
