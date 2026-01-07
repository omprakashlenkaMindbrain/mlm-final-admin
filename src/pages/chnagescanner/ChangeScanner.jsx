import { QrCode, RefreshCw, Upload } from "lucide-react";
import { useState,useEffect } from "react";
import Swal from "sweetalert2";
import { useSetQr } from "../../hooks/updateqr/useSetQr";
import { useUpdateQr } from "../../hooks/updateqr/useUpdateQr";

const COLORS = {
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

export default function ChangeScanner() {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const { uploadQr, loading: uploadLoading, error: uploadError, success: uploadSuccess } =
    useSetQr();

  

  const { updateAdminQr, loading: updateLoading, error: updateError, success: updateSuccess } =
    useUpdateQr();

  // 🔹 File Selection with SweetAlert
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setQrCodeUrl(URL.createObjectURL(file));
    setSelectedFile(file);

    Swal.fire({
      icon: "info",
      title: "File Selected",
      text: `Selected: ${file.name}`,
      confirmButtonColor: "#1976d2",
      showConfirmButton: false,
      timer: 1000,
    });
  };
  

  // 🔹 Upload QR with SweetAlert
  // const handleUpload = async () => {
  //   if (!selectedFile) {
  //     return Swal.fire({
  //       icon: "warning",
  //       title: "No File Selected",
  //       text: "Please choose an image before uploading.",
  //       confirmButtonColor: "#f39c12",
  //     });
  //   }

    
  //   await uploadQr(selectedFile);
  //   if (uploadSuccess) {
  //    return Swal.fire({
  //       icon: "success",
  //       title: "Upload Successful!",
  //       text: "QR Code uploaded successfully.",
  //       confirmButtonColor: "#0E562B",
  //     });
  //   }

  //   if (uploadError) {
  //    return Swal.fire({
  //       icon: "error",
  //       title: "Upload Failed",
  //       text: uploadError || "Something went wrong.",
  //       confirmButtonColor: "#d33",
  //     });
  //   }

    
  // };

  useEffect(() => {
  if (uploadError) {
    Swal.fire({
      icon: "error",
      title: "Upload Failed",
      text: uploadError || "Something went wrong.",
      confirmButtonColor: "#d33",
    });
  }

  if (uploadSuccess) {
    Swal.fire({
      icon: "success",
      title: "Upload Successful!",
      text: "QR Code uploaded successfully.",
      confirmButtonColor: "#0E562B",
    });
  }
}, [uploadError, uploadSuccess]);
const handleUpload = async () => {
  if (!selectedFile) {
    return Swal.fire({
      icon: "warning",
      title: "No File Selected",
      text: "Please choose an image before uploading.",
      confirmButtonColor: "#f39c12",
    });
  }

  await uploadQr(selectedFile);
};


  // 🔹 Update QR with SweetAlert
  // const handleUpdate = async () => {
  //   if (!selectedFile) {
  //     return Swal.fire({
  //       icon: "warning",
  //       title: "No File Selected",
  //       text: "Please choose an image before updating.",
  //       confirmButtonColor: "#f39c12",
  //     });
  //   }

  //   await updateAdminQr(selectedFile);

  //   if (updateError) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Update Failed",
  //       text: updateError || "Something went wrong.",
  //       confirmButtonColor: "#d33",
  //     });
  //   }
  const handleUpdate = async () => {
  if (!selectedFile) {
    return Swal.fire({
      icon: "warning",
      title: "No File Selected",
      text: "Please choose an image before updating.",
      confirmButtonColor: "#f39c12",
    });
  }

  const response = await updateAdminQr(selectedFile); 

  if (response?.error) {
    return Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: response.error || "Something went wrong.",
      confirmButtonColor: "#d33",
    });
  }

  Swal.fire({
    icon: "success",
    title: "QR Updated Successfully!",
    text: "QR Code updated successfully.",
    confirmButtonColor: "#0E562B",
  });


    if (updateSuccess) {
      Swal.fire({
        icon: "success",
        title: "QR Updated Successfully!",
        text: "QR Code updated successfully.",
        confirmButtonColor: "#0E562B",
      });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 -mt-20"
      // style={{
      //   background: `linear-gradient(to bottom right, ${COLORS.bgGradientFrom}, ${COLORS.bgGradientVia}, ${COLORS.bgGradientTo})`,
      // }}
    >
      <div className="w-full max-w-md sm:max-w-lg bg-white/90 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8">
        
        {/* Left Section */}
        <div className="flex-1 flex flex-col items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-full shadow-inner">
            <QrCode className="w-10 h-10" style={{ color: COLORS.icon }} />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-center" style={{ color: COLORS.textMain }}>
            Manage QR Code Scanner
          </h1>

          <p className="text-center text-sm" style={{ color: COLORS.textSub }}>
            Upload or update your QR code below
          </p>

          {/* Upload Area */}
          <label
            className="group relative flex flex-col items-center justify-center w-full h-36 sm:h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300"
            style={{
              borderColor: COLORS.uploadBorder,
              background: `linear-gradient(to br, ${COLORS.uploadBgFrom}, ${COLORS.uploadBgTo})`,
            }}
          >
            <Upload
              className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform duration-300"
              style={{ color: COLORS.icon }}
            />
            <span className="font-medium text-sm sm:text-base group-hover:text-blue-900" style={{ color: COLORS.textMain }}>
              Click to upload
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>

          {/* Buttons */}
          {selectedFile && (
            <div className="flex flex-col sm:flex-row gap-3 mt-3 w-full justify-center">
              
              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={uploadLoading}
                className="px-6 py-2 font-semibold rounded-lg transition-all duration-300 shadow-md"
                style={{ backgroundColor: COLORS.btn, color: "#fff" }}
              >
                {uploadLoading ? "Uploading..." : "Upload QR"}
              </button>

              {/* Update Button */}
              <button
                onClick={handleUpdate}
                disabled={updateLoading}
                className="px-6 py-2 font-semibold rounded-lg transition-all duration-300 shadow-md flex items-center gap-2"
                style={{ backgroundColor: COLORS.updateBtn, color: "#fff" }}
              >
                <RefreshCw className="w-4 h-4" />
                {updateLoading ? "Updating..." : "Update QR"}
              </button>
            </div>
          )}
        </div>

        {/* Right Preview Section */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          {qrCodeUrl ? (
            <div className="p-3 bg-white/80 border border-blue-100 rounded-xl shadow-inner w-full flex justify-center items-center transition-transform duration-300 hover:scale-105">
              <img
                src={qrCodeUrl}
                alt="Selected QR Code"
                className="object-contain w-48 h-48 sm:w-56 sm:h-56 rounded-lg shadow-md"
              />
            </div>
          ) : (
            <p className="text-gray-400 italic text-center text-sm">No QR code selected yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}