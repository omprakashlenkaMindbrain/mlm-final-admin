import { useState } from "react";
import ChangeScanner from "../chnagescanner/ChangeScanner";
import AccountDetails from "../accountdetails/AccountDetails";


const COLORS = {
  activeTab: "#1976d2",
  inactiveTab: "#e3f2fd",
  tabText: "#0d47a1",
   bgGradientFrom: "#e0f2ff",
  bgGradientVia: "#ffffff",
  bgGradientTo: "#d9e8ff",
  btn: "#ffb74d",
  btnHover: "#ff9f1a",
  updateBtn: "#1976d2",
  updateBtnHover: "#1256a3",
  icon: "#1976d2",
  uploadBorder: "#90caf9",
  uploadBgFrom: "#e3f2fd",
  uploadBgTo: "#bbdefb",
  textMain: "#0d47a1",
  textSub: "#616161",
};

export default function AccountComponent() {
  const [activeTab, setActiveTab] = useState("add");

  return (
    <div className="min-h-screen p-4"
    style={{
        background: `linear-gradient(to bottom right, ${COLORS.bgGradientFrom}, ${COLORS.bgGradientVia}, ${COLORS.bgGradientTo})`,
      }}
    >

    
      <div className="flex gap-4 mb-6 justify-center">
        <button
          onClick={() => setActiveTab("add")}
          className="px-6 py-2 rounded-lg font-semibold"
          style={{
            background: activeTab === "add" ? COLORS.activeTab : COLORS.inactiveTab,
            color: activeTab === "add" ? "#fff" : COLORS.tabText,
          }}
        >
       Change-Scanner
        </button>

        <button
          onClick={() => setActiveTab("view")}
          className="px-6 py-2 rounded-lg font-semibold"
          style={{
            background: activeTab === "view" ? COLORS.activeTab : COLORS.inactiveTab,
            color: activeTab === "view" ? "#fff" : COLORS.tabText,
          }}
        >
          
         Add-Account-Details
        </button>
      </div>
      <div className="max-w-5xl mx-auto">
        {activeTab === "view" ? (
          <AccountDetails />
        ) : (
          <ChangeScanner/>
        )}
      </div>
    </div>
  );
}
