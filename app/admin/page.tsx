export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <p className="mt-2 text-sm text-gray-500">
        Welcome to your admin dashboard
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-gray-500">Books</p>
          <h2 className="text-2xl font-bold">120</h2>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-gray-500">Authors</p>
          <h2 className="text-2xl font-bold">34</h2>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-gray-500">Orders</p>
          <h2 className="text-2xl font-bold">89</h2>
        </div>
      </div>
    </div>
  );
}
