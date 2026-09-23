import { useState } from "react";
import { uploadPdf } from "../services/api";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a PDF first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const data = await uploadPdf(file);

      setMessage(
        `${data.filename} uploaded successfully • ${data.pages} pages • ${data.chunks} chunks`
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "774px",
        margin: "24px auto 0",
        padding: "0 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "10px",
          background: "#151e29",
          border: "1px solid #263444",
          borderRadius: "12px",
        }}
      >
        {/* Choose PDF */}
        <label
          style={{
            flexShrink: 0,
            padding: "10px 16px",
            background: "#202c3a",
            color: "#e6edf5",
            border: "1px solid #334457",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Choose PDF
          <input
            type="file"
            accept="application/pdf"
            style={{ display: "none" }}
            onChange={(e) => {
              setFile(e.target.files[0]);
              setMessage("");
            }}
          />
        </label>

        {/* File name */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            color: file ? "#d7e0ea" : "#718096",
            fontSize: "14px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {file ? file.name : "No PDF selected"}
        </div>

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            flexShrink: 0,
            padding: "10px 18px",
            background: loading ? "#6574b5" : "#8da2ff",
            color: "#10151c",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Upload PDF"}
        </button>
      </div>

      {message && (
        <p
          style={{
            margin: "10px 4px 0",
            color: "#8fa0b3",
            fontSize: "13px",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}