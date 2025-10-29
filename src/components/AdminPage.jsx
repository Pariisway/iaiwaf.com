import { useState } from "react";
import { storage, db } from "../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

export default function AdminPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("video");
  const [status, setStatus] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // File type validation
    if (!["image/", "video/"].some((prefix) => selectedFile.type.startsWith(prefix))) {
      alert("Only image and video files are allowed.");
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file || !title) return alert("Please add a title and select a file.");

    const storageRef = ref(storage, `${type}s/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(prog);
        setStatus(`Uploading... ${prog}%`);
      },
      (error) => {
        console.error(error);
        setStatus("❌ Upload failed. Check console for details.");
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        await addDoc(collection(db, type + "s"), {
          title,
          url,
          createdAt: new Date(),
        });

        setStatus("✅ Uploaded successfully!");
        setProgress(0);
        setFile(null);
        setTitle("");
        setPreviewUrl("");
      }
    );
  };

  return (
    <div className="min-h-screen bg-black text-red-500 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl mb-6 font-bold">IAIWAF Admin Upload</h1>

      <input
        className="bg-gray-800 text-white p-2 mb-4 rounded w-full max-w-md"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select
        className="bg-gray-800 text-white p-2 mb-4 rounded w-full max-w-md"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="video">Video</option>
        <option value="story">Story</option>
        <option value="marketplace">Marketplace</option>
      </select>

      <input
        type="file"
        className="mb-4 text-white"
        onChange={handleFileChange}
      />

      {previewUrl && (
        <div className="mb-4">
          {file?.type.startsWith("video/") ? (
            <video
              src={previewUrl}
              controls
              className="max-w-md rounded-lg border border-gray-700"
            />
          ) : (
            <img
              src={previewUrl}
              alt="preview"
              className="max-w-md rounded-lg border border-gray-700"
            />
          )}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={status.includes("Uploading")}
        className={`${
          status.includes("Uploading")
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-red-700 hover:bg-red-900"
        } text-white py-2 px-6 rounded`}
      >
        {status.includes("Uploading") ? `Uploading ${progress}%` : "Upload"}
      </button>

      <p className="mt-4">{status}</p>
    </div>
  );
}
