import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ExchangeIcon } from "../../components/Icons/icon.exchange";
import { LogoutIcon } from "../../components/Icons/icon.logout";
import { UploadIcon } from "../../components/Icons/icon.upload";
import { Link } from "react-router-dom";
import useAuth from "../../hook/useAuth";
import { BackendURL } from "../../components/untile";
import { toast } from "react-toastify";
import Result from "./Result";

const Manuscript = () => {
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [filename, setFileName] = useState();
  const [workflowResult, setWorkflowResult] = useState("");
  const [credit, setCredit] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, logout } = useAuth();
  const uploadUrl = process.env.REACT_APP_UPLOAD_API_URL;
  const workflowUrl = process.env.REACT_APP_WORKFLOWRUN_API_URL;

  const headers = {
    Authorization: process.env.REACT_APP_AUTHORIZATION,
    "Content-Type": "application/json",
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const extension = selectedFile.name.split(".").pop().toLowerCase();
      const supportedFileTypes = [
        "txt", "md", "mdx", "pdf", "html", "xlsx", "xls", "docx", 
        "csv", "eml", "msg", "pptx", "xml", "epub", "ppt", "htm"
      ];

      if (!supportedFileTypes.includes(extension)) {
        toast.error("Unsupported file type!");
        return;
      }

      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("File size must be less than 10MB!");
        return;
      }

      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first!");
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file, file.name);

      const response = await axios.post(uploadUrl, formData, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
        params: {
          user: "difyuser",
          type: file.name.split(".").pop().toUpperCase(),
        },
      });

      if (response.status === 201) {
        setFileId(response.data.id);
        toast.success("Successfully uploaded!");
      } else {
        toast.error("Upload failed!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Server error during upload!");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle streaming response
  const onNext = useCallback((response) => {
    const data = response.data;
    if ((data.event === "node_finished" || data.event === "workflow_finished") && data.data.text !== null)      
      setWorkflowResult(prev => prev + data.data.text);
    if (data.event === "workflow_finished") {
      discountUserCredit();
      toast.success("Successfully generated!");
      setIsProcessing(false);
    }
  }, []);

  const onError = useCallback((error) => {
    console.error("Stream error:", error);
    toast.error("Error processing document!");
    setIsProcessing(false);
  }, []);

  // Process uploaded file
  useEffect(() => {
    const processFile = async () => {
      if (!fileId) return;

      setIsProcessing(true);
      try {
        const requestData = {
          inputs: {
            knowledge: {
              transfer_method: "local_file",
              upload_file_id: fileId,
              type: "document",
              url: "",
            },
          },
          files: [],
          user: "difyuser",
          response_mode: "streaming",
        };

        setWorkflowResult("");
        const response = await fetch(workflowUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestData),
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(Boolean);
          
          lines.forEach(line => {
            try {
              // Handle SSE format by removing "data: " prefix
              if (line.startsWith('data: ')) {
                const jsonStr = line.slice(6);
                const data = JSON.parse(jsonStr);
                onNext({ data });
              }
            } catch (e) {
              console.debug('Non-JSON line received:', line);
            }
          });
        }
      } catch (error) {
        onError(error);
      }
    };

    processFile();
  }, [fileId]);

  const updateUserCredit = async () => {
    try {
      const response = await axios.get(BackendURL + `/auth/getcredit/${user.username}`);
      if (response.data.state) {
        setCredit(response.data.credit);
      }
    } catch (error) {
      console.error("Error updating credit:", error);
    }
  };

  const discountUserCredit = async () => {
    try {
      const response = await axios.get(BackendURL + `/auth/discount/${user.username}`);
      if (response.data.state) {
        setCredit(response.data.credit);
      }
    } catch (error) {
      console.error("Error updating credit:", error);
    }
  };

  // Initial credit fetch
  useEffect(() => {
    updateUserCredit();
  }, []);

  return (
    <div>
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 shadow-lg sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="flex justify-between flex-col h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <div>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-[88px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition duration-200 ease-in-out"
              >
                <div className="flex flex-col items-center justify-center">
                  <UploadIcon />
                  <p className="p-[1px] text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    TXT, PDF, DOC or DOCX (MAX. 10MB)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isProcessing}
                />
              </label>
            </div>
            <div className="flex mt-3 justify-center text-[18px] border-2 items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              {filename || "No file selected"}
            </div>
            <button
              type="submit"
              onClick={handleUpload}
              disabled={!file || isProcessing}
              className={`w-full mt-4 font-semibold py-[6px] rounded-md shadow-md transition duration-200 ease-in-out ${
                !file || isProcessing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-700 text-white hover:bg-[#1d42d8EE]"
              }`}
            >
              {isProcessing ? "Processing..." : `Run (${credit})`}
            </button>
          </div>
          <ul className="mb-96 border-t-2 pt-2 space-y-2 font-medium">
            <li>
              <Link
                to="/plan"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <ExchangeIcon />
                <span className="flex-1 ms-3 whitespace-nowrap">Update Plan</span>
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                onClick={logout}
              >
                <LogoutIcon />
                <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg shadow-lg dark:border-gray-700 mt-14">
          <Result inputString={workflowResult} />
        </div>
      </div>
    </div>
  );
};

export default Manuscript;
