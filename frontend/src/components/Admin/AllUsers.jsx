import React from "react";

const AllUsers = ({ users = [] }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">All Users</h2>
      </div>

      {users.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No users found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">Email</th>
                <th className="text-left px-5 py-3">Phone</th>
                <th className="text-left px-5 py-3">Role</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-gray-200">
                  <td className="px-5 py-4">
                    {user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "-"}
                  </td>
                  <td className="px-5 py-4">{user.email || "-"}</td>
                  <td className="px-5 py-4">{user.phoneNumber || "-"}</td>
                  <td className="px-5 py-4">{user.role || "User"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllUsers;