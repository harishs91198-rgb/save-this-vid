// 
import { useState } from "react";
import axios from "axios";

function detectPlatform(url) {

  if (
    url.includes("twitter.com") ||
    url.includes("x.com")
  ) {
    return "Twitter/X";
  }

  if (url.includes("instagram")) {
    return "Instagram";
  }

  return "Video";
}

export default function App() {

  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchVideo = async () => {
    setError("");
    if (!url) return;

    try {

      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/download",
        { url }
      );

      setData(res.data);

    } catch (err) {

      console.log(err);
      setError("Failed to fetch video");

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="
      min-h-screen
      bg-gradient-to-br
      from-black
      via-zinc-900
      to-zinc-800
      text-white
      flex
      items-center
      justify-center
      p-5
    ">

      <div className="
        w-full
        max-w-2xl
        bg-white/10
        backdrop-blur-lg
        rounded-3xl
        p-6
        shadow-2xl
        border
        border-white/10
      ">

        <h1 className="
          text-4xl
          font-bold
          text-center
          mb-8
        ">
          {detectPlatform(url)} Downloader
        </h1>

        <div className="flex gap-3">

          <input
            value={url}
            onChange={(e) =>
              setUrl(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchVideo();
              }
            }}
            placeholder="
              Paste Twitter/X or Instagram URL
            "
            className="
              flex-1
              bg-black/30
              border
              border-white/10
              rounded-xl
              px-4
              py-4
              outline-none
            "
          />
          <button
            onClick={async () => {

              const text =
                await navigator.clipboard.readText();

              setUrl(text);

            }}
            className="
    px-4
    rounded-xl
    bg-zinc-700
    hover:bg-zinc-600
    transition
  "
          >
            Paste
          </button>
          <button
            disabled={loading}
            onClick={fetchVideo}
            className="
              px-6
              rounded-xl
              bg-blue-600
              hover:bg-blue-500
              transition
              font-semibold
              disabled:opacity-50
            "
          >
            {
              loading ? (
                <div className="
    w-5
    h-5
    border-2
    border-white
    border-t-transparent
    rounded-full
    animate-spin
  " />
              ) : (
                "Fetch"
              )
            }
          </button>

        </div>
        {error && (
          <div className="
    mt-5
    bg-red-500/20
    border
    border-red-500/30
    text-red-300
    p-4
    rounded-xl
  ">
            {error}
          </div>
        )}
        {data && (

          <div className="
            mt-8
            bg-black/30
            rounded-2xl
            overflow-hidden
          ">

            <video
              controls
              poster={data.thumbnail}
              className="
    w-full
    object-cover
    max-h-[400px]
  "
            >

              <source
                src={data.formats[0]?.url}
                type="video/mp4"
              />

            </video>

            <div className="p-5">

              <h2 className="
                text-xl
                font-semibold
                mb-4
              ">
                {data.title}
              </h2>

              <div className="
                flex
                flex-wrap
                gap-3
              ">

                {data.formats.map((f, i) => (

                  <a
                    key={i}
                    href={`http://localhost:5000/api/file?url=${encodeURIComponent(url)}`} download
                    target="_blank"
                    rel="noreferrer"
                    className="
                      bg-white/10
                      hover:bg-white/20
                      transition
                      px-4
                      py-2
                      rounded-xl
                    "
                  >
                    {f.quality}
                  </a>

                ))}

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}