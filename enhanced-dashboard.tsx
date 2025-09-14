// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import Header from "../components/Header";
// import Footer from "../components/Footer";

// // ✅ Configure axios defaults
// axios.defaults.withCredentials = true;
// axios.defaults.timeout = 30000;

// const API_BASE_URL = "http://localhost:8080";

// interface UserData {
//   id: number;
//   fullName: string;
//   email: string;
//   phone: string;
//   age: number;
//   gender: string;
//   status: string;
// }

// interface DashboardData {
//   totalBookings: number;
//   recentBookings: any[];
//   lastLoginTime: string;
// }

// interface ProfileEditData {
//   fullName: string;
//   email: string;
//   phone: string;
//   age: number;
//   gender: string;
// }

// export default function UserDashboard() {
//   const [user, setUser] = useState<UserData | null>(null);
//   const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editFormData, setEditFormData] = useState<ProfileEditData>({
//     fullName: "",
//     email: "",
//     phone: "",
//     age: 0,
//     gender: "",
//   });
//   const [saveLoading, setSaveLoading] = useState(false);
//   const [saveMessage, setSaveMessage] = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     checkSessionAndLoadDashboard();
//   }, []);

//   const checkSessionAndLoadDashboard = async () => {
//     try {
//       console.log("🔍 Checking user session...");
      
//       // First check session
//       const sessionResponse = await axios.get(`${API_BASE_URL}/user/check-session`);
      
//       if (!sessionResponse.data.isLoggedIn) {
//         console.log("❌ No active session, redirecting to login");
//         router.push('/');
//         return;
//       }
      
//       console.log("✅ Session active, loading dashboard...");
      
//       // Load dashboard data
//       const dashboardResponse = await axios.get(`${API_BASE_URL}/user/dashboard`);
      
//       setUser(dashboardResponse.data.user);
//       setDashboardData(dashboardResponse.data.dashboardData);
      
//       // Initialize edit form with current user data
//       if (dashboardResponse.data.user) {
//         setEditFormData({
//           fullName: dashboardResponse.data.user.fullName,
//           email: dashboardResponse.data.user.email,
//           phone: dashboardResponse.data.user.phone.toString(),
//           age: dashboardResponse.data.user.age,
//           gender: dashboardResponse.data.user.gender,
//         });
//       }
      
//       console.log("✅ Dashboard loaded:", dashboardResponse.data);
      
//     } catch (error: any) {
//       console.error("❌ Dashboard loading error:", error);
      
//       if (error.response?.status === 401) {
//         setError("Please login to access dashboard");
//         router.push('/');
//       } else {
//         setError("Failed to load dashboard. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditProfile = () => {
//     setIsEditing(true);
//     setSaveMessage(null);
//   };

//   const handleCancelEdit = () => {
//     setIsEditing(false);
//     setSaveMessage(null);
//     // Reset form data to original user data
//     if (user) {
//       setEditFormData({
//         fullName: user.fullName,
//         email: user.email,
//         phone: user.phone.toString(),
//         age: user.age,
//         gender: user.gender,
//       });
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setEditFormData(prev => ({
//       ...prev,
//       [name]: name === 'age' ? parseInt(value) || 0 : value
//     }));
//   };

//   const handleSaveProfile = async () => {
//     setSaveLoading(true);
//     setSaveMessage(null);
    
//     try {
//       console.log("💾 Saving profile updates...", editFormData);
      
//       const response = await axios.put(`${API_BASE_URL}/user/my-profile/update`, editFormData);
      
//       if (response.data.success) {
//         // Update local user state
//         setUser(response.data.user);
//         setIsEditing(false);
//         setSaveMessage("✅ Profile updated successfully!");
        
//         console.log("✅ Profile updated:", response.data);
        
//         // Clear success message after 3 seconds
//         setTimeout(() => setSaveMessage(null), 3000);
//       } else {
//         setSaveMessage("❌ Failed to update profile");
//       }
      
//     } catch (error: any) {
//       console.error("❌ Profile update error:", error);
      
//       if (error.response?.data?.message) {
//         setSaveMessage(`❌ ${error.response.data.message}`);
//       } else {
//         setSaveMessage("❌ Failed to update profile. Please try again.");
//       }
//     } finally {
//       setSaveLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       console.log("🔐 Logging out...");
      
//       await axios.post(`${API_BASE_URL}/user/logout`);
      
//       console.log("✅ Logout successful");
      
//       // Clear local state
//       setUser(null);
//       setDashboardData(null);
      
//       // Redirect to home
//       router.push('/');
      
//     } catch (error: any) {
//       console.error("❌ Logout error:", error);
//       alert("Logout failed. Please try again.");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//         <Header />
//         <main className="min-h-screen flex items-center justify-center">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
//             <p className="text-xl text-gray-600">Loading dashboard...</p>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//         <Header />
//         <main className="min-h-screen flex items-center justify-center">
//           <div className="text-center">
//             <div className="text-red-500 text-xl mb-4">❌ {error}</div>
//             <button
//               onClick={() => router.push('/')}
//               className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//             >
//               Go to Home
//             </button>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       <Header />
      
//       <main className="container mx-auto px-4 py-8">
//         {/* Welcome Section */}
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800 mb-2">
//                 Welcome back, {user?.fullName}!
//               </h1>
//               <p className="text-gray-600">
//                 Manage your bus bookings and account settings
//               </p>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300"
//             >
//               🚪 Logout
//             </button>
//           </div>
//         </div>

//         {/* Save Message */}
//         {saveMessage && (
//           <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
//             <div className={`text-center font-medium ${
//               saveMessage.includes('✅') ? 'text-green-600' : 'text-red-600'
//             }`}>
//               {saveMessage}
//             </div>
//           </div>
//         )}

//         {/* Dashboard Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-xl shadow-lg p-6 text-center">
//             <div className="text-3xl font-bold text-blue-600 mb-2">
//               {dashboardData?.totalBookings || 0}
//             </div>
//             <div className="text-gray-600">Total Bookings</div>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-lg p-6 text-center">
//             <div className="text-3xl font-bold text-green-600 mb-2">
//               {user?.status === 'active' ? '✅' : '❌'}
//             </div>
//             <div className="text-gray-600">Account Status</div>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-lg p-6 text-center">
//             <div className="text-3xl font-bold text-purple-600 mb-2">
//               📅
//             </div>
//             <div className="text-gray-600">Last Login</div>
//             <div className="text-sm text-gray-500 mt-1">
//               {dashboardData?.lastLoginTime ? new Date(dashboardData.lastLoginTime).toLocaleString() : 'Now'}
//             </div>
//           </div>
//         </div>

//         {/* User Information - Editable */}
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-800">👤 Your Information</h2>
            
//             {!isEditing ? (
//               <button
//                 onClick={handleEditProfile}
//                 className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center gap-2"
//               >
//                 ✏️ Edit Profile
//               </button>
//             ) : (
//               <div className="flex gap-2">
//                 <button
//                   onClick={handleSaveProfile}
//                   disabled={saveLoading}
//                   className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 disabled:opacity-50 flex items-center gap-2"
//                 >
//                   {saveLoading ? (
//                     <>
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                       Saving...
//                     </>
//                   ) : (
//                     <>💾 Save</>
//                   )}
//                 </button>
//                 <button
//                   onClick={handleCancelEdit}
//                   disabled={saveLoading}
//                   className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300 disabled:opacity-50"
//                 >
//                   ❌ Cancel
//                 </button>
//               </div>
//             )}
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
//               {isEditing ? (
//                 <input
//                   type="text"
//                   name="fullName"
//                   value={editFormData.fullName}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter your full name"
//                 />
//               ) : (
//                 <div className="bg-gray-50 p-3 rounded-lg">{user?.fullName}</div>
//               )}
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
//               {isEditing ? (
//                 <input
//                   type="email"
//                   name="email"
//                   value={editFormData.email}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter your email"
//                 />
//               ) : (
//                 <div className="bg-gray-50 p-3 rounded-lg">{user?.email}</div>
//               )}
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
//               {isEditing ? (
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={editFormData.phone}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter your phone number"
//                 />
//               ) : (
//                 <div className="bg-gray-50 p-3 rounded-lg">{user?.phone}</div>
//               )}
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Age</label>
//               {isEditing ? (
//                 <input
//                   type="number"
//                   name="age"
//                   value={editFormData.age}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter your age"
//                   min="1"
//                   max="120"
//                 />
//               ) : (
//                 <div className="bg-gray-50 p-3 rounded-lg">{user?.age}</div>
//               )}
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
//               {isEditing ? (
//                 <select
//                   name="gender"
//                   value={editFormData.gender}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                   <option value="other">Other</option>
//                 </select>
//               ) : (
//                 <div className="bg-gray-50 p-3 rounded-lg capitalize">{user?.gender}</div>
//               )}
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
//               <div className={`p-3 rounded-lg font-medium ${
//                 user?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//               }`}>
//                 {user?.status === 'active' ? '✅ Active' : '❌ Inactive'}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">🚀 Quick Actions</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <button 
//               onClick={() => router.push('/booking')}
//               className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition duration-300 text-center"
//             >
//               🎫 Book New Ticket
//             </button>
            
//             <button 
//               onClick={() => router.push('/my-bookings')}
//               className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition duration-300 text-center"
//             >
//               📋 My Bookings
//             </button>
            
//             <button 
//               onClick={() => setIsEditing(true)}
//               className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 transition duration-300 text-center"
//             >
//               ⚙️ Edit Profile
//             </button>
//           </div>
//         </div>

//         {/* Recent Bookings */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Recent Bookings</h2>
          
//           {dashboardData?.recentBookings && dashboardData.recentBookings.length > 0 ? (
//             <div className="space-y-4">
//               {dashboardData.recentBookings.map((booking, index) => (
//                 <div key={index} className="border border-gray-200 rounded-lg p-4">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <div className="font-medium">Booking #{booking.id}</div>
//                       <div className="text-gray-600">{booking.route}</div>
//                     </div>
//                     <div className="text-right">
//                       <div className="font-medium text-green-600">{booking.status}</div>
//                       <div className="text-gray-600">{booking.date}</div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8">
//               <div className="text-gray-400 text-lg mb-4">📝 No bookings yet</div>
//               <p className="text-gray-600">Your recent bookings will appear here</p>
//               <button 
//                 onClick={() => router.push('/booking')}
//                 className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
//               >
//                 📅 Book Your First Trip
//               </button>
//             </div>
//           )}
//         </div>
//       </main>
      
//       <Footer />
//     </div>
//   );
// }