import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import BASE_URL from "../../config/api";
import { useAuth } from "../../context/Authcontext";
import { useAccountDetails } from "../../hooks/accountdetails/AccountDetails";
import { useBankDetailsEdit } from "../../hooks/accountdetails/editBankDetails";

const AccountDetails = () => {
  const { accessToken } = useAuth();
  const { saveAccountDetails, loading: saveLoading, error: saveError } = useAccountDetails();
  const { editBankDetails, loading: editLoading, error: editError } = useBankDetailsEdit();

  const [formData, setFormData] = useState({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });

  const [recordId, setRecordId] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/admin/getbankdetails`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();

        console.log(data);


        if (data?.data && data.data.length > 0) {
          const bank = data.data[0];
          setFormData({
            accountHolderName: bank.accountholder_name || "",
            bankName: bank.bankname || "",
            accountNumber: bank.account_no || "",
            ifscCode: bank.ifsc_code || "",
          });
          setRecordId(bank._id);
        }
      } catch (err) {
        console.error("Failed to fetch bank details:", err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchBankDetails();
  }, [accessToken]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save new account
  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      account_no: formData.accountNumber,
      ifsc_code: formData.ifscCode,
      accountholder_name: formData.accountHolderName,
      bankname: formData.bankName, // ✅ CORRECT
    };


    const response = await saveAccountDetails(payload);

    if (!response) return;

    if (response?.data?.id) setRecordId(response.data.id);

    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Account details saved successfully",
      confirmButtonColor: "#1976d2",
    });
  };

  const handleEdit = async () => {
    if (!recordId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No bank record found. Please save first!",
      });
      return;
    }

    const payload = {
      account_no: formData.accountNumber,
      ifsc_code: formData.ifscCode,
      accountholder_name: formData.accountHolderName,
      bankname: formData.bankName, // ✅ FIXED
    };

    const response = await editBankDetails(recordId, payload);
    if (!response) return;

    Swal.fire({
      icon: "success",
      title: "Updated",
      text: "Account details updated successfully",
      confirmButtonColor: "#1976d2",
    });
  };


  // Show errors
  useEffect(() => {
    if (saveError || editError) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: saveError || editError,
      });
    }
  }, [saveError, editError]);

  if (loadingData) {
    return <div className="text-center p-4">Loading account details...</div>;
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Add / Edit Account Details</h2>

      <form className="space-y-4" onSubmit={handleSave}>
        {[
          { label: "Account Holder Name", name: "accountHolderName" },
          { label: "Bank Name", name: "bankName" },
          { label: "Account Number", name: "accountNumber" },
          { label: "IFSC Code", name: "ifscCode" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-1">{field.label}</label>
            <input
              type="text"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
        ))}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saveLoading}
            className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {saveLoading ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            disabled={editLoading}
            onClick={handleEdit}
            className="flex-1 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-60"
          >
            {editLoading ? "Updating..." : "Edit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountDetails;