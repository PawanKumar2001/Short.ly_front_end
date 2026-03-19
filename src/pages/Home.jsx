import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import * as linkService from "../services/linkService";
import Footer from "./Footer";
import { BASE_URL } from "../config/api";

const BACKEND_BASE_URL = BASE_URL

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [history, setHistory] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(null);

  const navigate = useNavigate();

  // ================= LOAD USER + HISTORY =================
  const loadData = useCallback(async () => {
    try {
      const [userData, links] = await Promise.all([
        linkService.getUserDetails(),
        linkService.getLinks(),
      ]);

      // 🔥 Robust username handling
      const extractedUsername =
        userData?.username || userData?.user?.username || "";

      setUsername(extractedUsername);
      setHistory(links);
    } catch (err) {
      console.error("Auth error:", err);
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ================= USERNAME FORMATTING =================
  const formattedUsername = username
    ? username
        .trim()
        .split(" ")
        .filter(Boolean)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ")
    : "User";

  // ================= SHORTEN =================
  const handleShorten = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    try {
      setLoading(true);

      const newLink = await linkService.createLink(url);

      // 🔥 Format full short URL
      const fullShortUrl = `${BACKEND_BASE_URL}/${newLink.short_code}`;

      setShortUrl(fullShortUrl);

      await loadData();
      setUrl("");
    } catch (err) {
      console.error("Shorten error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await linkService.deleteLink(id);
      await loadData();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-black transition-colors duration-500 flex flex-col overflow-hidden pt-24">
      <div className="pointer-events-none absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-red-500/20 blur-[120px] rounded-full -top-32 -left-32 animate-pulse"></div>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-blur backdrop-blur-md  border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex items-center justify-between">
          <h1
            className="text-3xl md:text-4xl font-black text-black dark:text-white tracking-tight"
            style={{ fontFamily: "'Darker Grotesque', sans-serif" }}
          >
            Short<span className="text-red-600">.</span>ly
          </h1>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm rounded-full bg-black text-white hover:bg-red-600 transition dark:bg-white dark:text-black dark:hover:bg-red-500"
            >
              Logout
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* USERNAME */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 my-8">
        <div
          className="
          text-center md:text-left
          text-5xl sm:text-6xl md:text-5xl
          font-semibold
          text-black dark:text-white
          my-6
        "
          style={{ fontFamily: "'Darker Grotesque', sans-serif" }}
        >
          Hi, <span className="text-[#ff4d4d]">{formattedUsername}</span>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {/* SHORTENER */}
          <div className="bg-gray-100 dark:bg-zinc-900 
            p-6 md:p-8 
            rounded-2xl 
            border border-gray-200 dark:border-zinc-800 
            flex flex-col justify-center
            md:aspect-square
          ">
            <form
              onSubmit={handleShorten}
              className="flex flex-col items-center gap-6"
            >
              {/* Large Multi-line URL Box */}
              <textarea
                placeholder="Enter your URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                rows={4}
                className="w-full max-w-md h-40 md:h-48 text-left text-base md:text-lg p-6 rounded-2xl bg-white dark:bg-black border border-gray-300 dark:border-zinc-700 text-black dark:text-white outline-none focus:ring-2 focus:ring-red-500 transition resize-none break-all"
              />

              {/*Button */}
              <button
                disabled={loading}
                className="w-full max-w-xs py-3 rounded-xl bg-black text-white hover:bg-red-600 transition dark:bg-white dark:text-black dark:hover:bg-red-500 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Shorten"}
              </button>
            </form>

            {shortUrl && (
              <div className="mt-8 p-4 rounded-xl bg-white dark:bg-black border border-gray-300 dark:border-zinc-700 flex flex-col items-center">
                <div className="text-gray-800 dark:text-gray-200 mb-4 break-all text-center">
                  <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black dark:text-white font-medium mt-1 break-all hover:text-red-500 transition-colors duration-200"
                    >
                      {shortUrl}
                    </a>
                </div>

                <button
                  onClick={() => copyToClipboard(shortUrl)}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition w-full sm:w-auto"
                >
                  Copy
                </button>
              </div>
            )}
          </div>

          {/* HISTORY */}
          <div className="bg-gray-100 dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 flex flex-col max-h-[500px] md:max-h-[600px]">
            <div className="px-6 md:px-8 pt-6 pb-4 border-b border-gray-200 dark:border-zinc-800">
              <h2 className="text-lg md:text-xl font-semibold text-black dark:text-white">
                Your URL History
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 flex flex-col gap-4 premium-scroll">
              {history.map((item) => {
                const fullUrl = `${BACKEND_BASE_URL}/${item.short_code}`;

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-white dark:bg-black border border-gray-300 dark:border-zinc-700 hover:shadow-md transition"
                  >
                    <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {item.original_url}
                    </div>

                    <a
                      href={fullUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black dark:text-white font-medium mt-1 break-all hover:text-red-500 transition-colors duration-200"
                    >
                      {fullUrl}
                    </a>

                    <div className="flex flex-wrap gap-3 mt-3">
                      <button
                        onClick={() => {
                          copyToClipboard(fullUrl);
                          setCopiedUrl(fullUrl);
                          setTimeout(() => setCopiedUrl(null), 2000);
                        }}
                        className="px-3 py-1 text-sm rounded-md bg-black text-white hover:bg-red-600 transition dark:bg-white dark:text-black dark:hover:bg-red-500"
                      >
                        {copiedUrl === fullUrl ? "Copied" : "Copy"}
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 text-sm rounded-md border border-black text-black hover:bg-black hover:text-white transition dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}

              {history.length === 0 && (
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  No URLs shortened yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
