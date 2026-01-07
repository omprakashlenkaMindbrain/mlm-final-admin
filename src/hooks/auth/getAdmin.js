import BASE_URL from "../../config/api";

export const getAdmin = () => {
  const getAdminInfo = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/sessions`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data=await res.json();
      
      if (res.status === 401) {
        throw new Error("Unauthorized. Please login again.");
      }

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      return data
    } catch (err) {
      console.error("Failed to fetch admin info:", err.message);
      throw err;
    }
  };

  return { getAdminInfo };
};
