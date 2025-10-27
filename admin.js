import { useState } from "react";
import { storage, db } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

export default function AdminPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("video");
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file || !title) return alert("Please add a title and select a file.");

    setStatus("Uploading...");
    const storageRef = ref(storage, `${type}s/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, type + "s"), {
      title,
      url,
      createdAt: new Date(),
    });

    setStatus("✅ Uploaded successfully!");
    setFile(null);
    setTitle("");
  };

  return (
    <div className="min-h-screen bg-black text-red-500 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl mb-6">IAIWAF Admin Upload</h1>
      <input
        className="bg-gray-800 text-white p-2 mb-4 rounded"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        className="bg-gray-800 text-white p-2 mb-4 rounded"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="video">Video</option>
        <option value="story">Story</option>
        <option value="marketplace">Marketplace</option>
      </select>
      <input
        type="file"
        className="mb-4"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button
        onClick={handleUpload}
        className="bg-red-700 hover:bg-red-900 text-white py-2 px-6 rounded"
      >
        Upload
      </button>
      <p className="mt-4">{status}</p>
    </div>
  );
}
