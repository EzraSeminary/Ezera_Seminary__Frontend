import { useGetContactsQuery } from "@/redux/api-slices/apiSlice";

const FeedbackCenter = () => {
  const { data, isLoading, isError, refetch } = useGetContactsQuery();

  if (isLoading) {
    return <div className="p-6">Loading feedback...</div>;
  }
  if (isError) {
    return (
      <div className="p-6 text-red-700 bg-red-50 border border-red-200 rounded-lg">
        Failed to load feedback. <button onClick={() => refetch()} className="underline">Retry</button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow border border-accent-2">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-secondary-8">Feedback Center</h1>
        <p className="text-secondary-6">Messages submitted by users</p>
      </div>
      <div className="divide-y divide-accent-1">
        {(data || []).map((item) => (
          <div key={item._id} className="py-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-secondary-8">
                  {item.firstName} {item.lastName}
                </p>
                <p className="text-sm text-secondary-6">{item.email}</p>
              </div>
              <p className="text-xs text-secondary-5">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
            <p className="mt-2 text-primary-7 whitespace-pre-wrap">{item.message}</p>
          </div>
        ))}
        {(!data || data.length === 0) && (
          <div className="py-8 text-center text-secondary-6">No messages yet.</div>
        )}
      </div>
    </div>
  );
};

export default FeedbackCenter;


