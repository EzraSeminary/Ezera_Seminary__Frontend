import { useMemo, useState } from "react";
import { useGetContactsQuery, useSendContactReplyMutation } from "@/redux/api-slices/apiSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "@/components/LoadingSpinner";

const defaultReplyTemplate = (firstName: string) => `Dear ${firstName},

Thank you for reaching out to Ezra Seminary. We appreciate you taking the time to contact us.

[Write your response here]

Warm regards,
Ezra Seminary Support
seminaryezra@gmail.com`;

const FeedbackCenter = () => {
  const { data = [], isLoading, isError, refetch } = useGetContactsQuery();
  const [sendReply, { isLoading: isSending }] = useSendContactReplyMutation();

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [subject, setSubject] = useState<string>("Thank you for contacting Ezra Seminary");
  const [replyBody, setReplyBody] = useState<string>("");

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return data;
    return data.filter((c: { firstName: string; lastName: string; email: string; message: string }) =>
      [c.firstName, c.lastName, c.email, c.message]
        .filter(Boolean)
        .some((v: string) => String(v).toLowerCase().includes(s))
    );
  }, [data, search]);

  const selected = useMemo(() => {
    return filtered.find((c: { _id: string }) => c._id === selectedId) || filtered[0];
  }, [filtered, selectedId]);

  // Initialize reply body when selection changes
  const onSelect = (id: string, item: { firstName: string }) => {
    setSelectedId(id);
    setSubject("Thank you for contacting Ezra Seminary");
    setReplyBody(defaultReplyTemplate(item.firstName));
  };

  const handleSend = async () => {
    if (!selected) return;
    if (!subject.trim() || !replyBody.trim()) {
      toast.error("Subject and message are required.");
      return;
    }
    try {
      await sendReply({ id: selected._id, subject: subject.trim(), message: replyBody }).unwrap();
      toast.success("Reply sent successfully.");
      refetch();
    } catch (e: any) {
      console.error("Error sending reply:", e);
      const errorMessage = e?.data?.error || e?.message || "Failed to send reply.";
      const errorDetails = e?.data?.details;
      
      // Check if it's an email service error (503) vs authentication error (401)
      if (e?.status === 503) {
        let message = errorMessage;
        if (errorDetails) {
          if (typeof errorDetails === 'object') {
            message += ` Details: ${JSON.stringify(errorDetails)}`;
          } else {
            message += ` Details: ${errorDetails}`;
          }
        }
        toast.error(message || "Email service is not configured. Please check EMAIL_USER and EMAIL_PASS in backend environment variables.");
      } else if (e?.status === 401) {
        toast.error("Authentication failed. Please log out and log back in.");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 min-h-[400px]">
        <LoadingSpinner text="Loading feedback..." size="md" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="p-6 font-nokia-bold text-red-700 bg-red-50 border border-red-200 rounded-lg">
        Failed to load feedback. <button onClick={() => refetch()} className="underline">Retry</button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ToastContainer />
      <div className="mb-6">
        <h1 className="text-3xl font-nokia-bold text-secondary-8">Feedback Center</h1>
        <p className="text-secondary-6">Messages submitted by users</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: List */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow border border-accent-2">
          <div className="p-4 border-b border-accent-1">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, or message..."
              className="w-full border font-nokia-bold border-accent-2 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6 bg-white text-secondary-6"
            />
          </div>
          <div className="max-h-[70vh] overflow-auto">
            {filtered.map((item: { _id: string; firstName: string; lastName: string; email: string; message: string; createdAt: string; repliedAt?: string }) => (
              <button
                key={item._id}
                onClick={() => onSelect(item._id, item)}
                className={`w-full text-left p-4 border-b border-accent-1 hover:bg-accent-1/50 transition ${
                  selected && selected._id === item._id ? "bg-accent-1" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-nokia-bold text-accent-8">
                      {item.firstName} {item.lastName}
                    </p>
                    <p className="text-xs text-secondary-6">{item.email}</p>
                  </div>
                  <div className="text-xs text-secondary-5 font-nokia-light">
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>
                <p className="mt-2 text-sm text-secondary-7 font-nokia-bold line-clamp-2">{item.message}</p>
                {item.repliedAt && (
                  <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 border border-green-200">
                    Replied {new Date(item.repliedAt).toLocaleDateString()}
                  </span>
                )}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="p-6 text-secondary-6">No messages found.</div>
            )}
          </div>
        </div>

        {/* Right: Detail + Reply */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detail card */}
          {selected ? (
            <div className="bg-white rounded-2xl shadow border border-accent-2 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-nokia-bold text-accent-8">
                    {selected.firstName} {selected.lastName}
                  </h2>
                  <p className="text-secondary-6 font-nokia-light">{selected.email}</p>
                </div>
                <div className="text-xs text-secondary-5 font-nokia-light">
                  {new Date(selected.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-nokia-bold text-secondary-8 mb-2">Message</h3>
                <p className="text-secondary-7 font-nokia-bold whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow border border-accent-2 p-6 text-secondary-6">Select a message to view details.</div>
          )}

          {/* Reply card */}
          {selected && (
            <div className="bg-white rounded-2xl shadow border border-accent-2 p-6 font-nokia-bold">
              <h3 className="text-xl font-nokia-bold text-secondary-8 mb-4">Reply as Ezra Seminary</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-secondary-7 mb-1">Subject</label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full border border-accent-2 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6 bg-white text-secondary-6"
                  />
                </div>
                <div>
                  <label className="block text-sm text-secondary-7 mb-1">Message</label>
                  <textarea
                    rows={10}
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    className="w-full border border-accent-2 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6 bg-white text-secondary-6"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSend}
                    disabled={isSending}
                    className="px-6 py-2 rounded-xl bg-accent-6 hover:bg-accent-7 text-white font-nokia-bold disabled:opacity-60"
                  >
                    {isSending ? "Sending..." : "Send Reply"}
                  </button>
                  <button
                    onClick={() => setReplyBody(defaultReplyTemplate(selected.firstName))}
                    className="px-6 py-2 rounded-xl bg-secondary-5 hover:bg-secondary-6 text-secondary-9 font-nokia-bold"
                  >
                    Reset to Template
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackCenter;


