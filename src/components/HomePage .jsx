import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function HomePage() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const q = query(collection(db, "videos"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const videoData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setVideos(videoData);
    };
    fetchVideos();
  }, []);

  if (videos.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">No videos uploaded yet.</p>
      </div>
    );
  }

  const [featured, ...rest] = videos;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-4xl mb-8 font-bold text-red-500">IAIWAF Video Hub</h1>

      {/* Featured video */}
      <div className="w-full max-w-4xl mb-10">
        <h2 className="text-2xl mb-2 font-semibold">{featured.title}</h2>
        <video
          src={featured.url}
          controls
          autoPlay
          muted
          className="w-full rounded-2xl border border-gray-700 shadow-lg"
        />
      </div>

      {/* Other videos */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((video) => (
          <div
            key={video.id}
            className="bg-gray-900 rounded-2xl p-4 shadow-md flex flex-col items-center"
          >
            <video
              src={video.url}
              controls
              className="rounded-lg w-full mb-2"
            />
            <h2 className="text-lg font-semibold text-center">{video.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
