import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'
import { ShoppingCart, Heart, LogOut, Edit, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from 'axios'

export const Route = createFileRoute('/account')({
  component: RouteComponent,
})

type OrderItem = { id: number; product_name: string; price: number; status: string }
type WishlistItem = { id: number; product_name: string; price: number }
type CartItem = { id: number; product_name: string; price: number; quantity: number }

function RouteComponent() {
  const { user, logout, updateUser } = useAuth()
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [editProfile, setEditProfile] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [address, setAddress] = useState(user?.address || '')

  useEffect(() => {
    if (!user) return
    axios.get(`/api/orders/${user.id}`).then(res => setOrders(res.data)).catch(err => console.error(err))
    axios.get(`/api/wishlist/${user.id}`).then(res => setWishlist(res.data)).catch(err => console.error(err))
    axios.get(`/api/cart/${user.id}`).then(res => setCart(res.data)).catch(err => console.error(err))
  }, [user])

  const saveProfile = async () => {
    try {
      const res = await axios.put(`/api/user/${user.id}`, { name, email, address })
      updateUser(res.data)
      setEditProfile(false)
      alert('Profile updated successfully!')
    } catch (err) {
      console.error(err)
      alert('Failed to update profile')
    }
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6 mt-10 text-center">
        <p className="text-gray-700 mb-4 text-lg">You are not logged in.</p>
        <Link to="/login">
          <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transform transition">
            Login / Register
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8 mt-10 space-y-10">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 text-center sm:text-left">My Account</h1>

      {/* PROFILE SECTION */}
      <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col md:flex-row md:justify-between md:items-center gap-6 hover:shadow-2xl transition">
        <div className="flex flex-col sm:flex-row items-center gap-5 w-full md:w-auto">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-yellow-400 flex items-center justify-center text-white text-2xl md:text-3xl font-bold">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 w-full">
            {editProfile ? (
              <div className="space-y-3">
                <div>
                  <p className="text-gray-700 font-medium text-sm sm:text-base">Name</p>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium mt-2 text-sm sm:text-base">Email</p>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium mt-2 text-sm sm:text-base flex items-center gap-1"><MapPin className="w-4 h-4"/> Address</p>
                  <textarea value={address} onChange={e => setAddress(e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg" />
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm sm:text-base">
                <p className="text-gray-700 font-medium">Name</p>
                <p className="text-gray-900 text-base sm:text-lg md:text-xl">{user.name}</p>
                <p className="text-gray-700 font-medium mt-2">Email</p>
                <p className="text-gray-900 text-base sm:text-lg md:text-xl">{user.email}</p>
                <p className="text-gray-700 font-medium mt-2 flex items-center gap-1"><MapPin className="w-4 h-4"/> Address</p>
                <p className="text-gray-900 text-base sm:text-lg md:text-xl">{user.address || 'Not set'}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 w-full md:w-auto">
          {editProfile ? (
            <button onClick={saveProfile} className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 sm:py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:scale-105 transform transition text-sm sm:text-base">
              Save
            </button>
          ) : (
            <button onClick={() => setEditProfile(true)} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 sm:py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:scale-105 transform transition text-sm sm:text-base">
              <Edit className="w-5 h-5"/> Edit Profile
            </button>
          )}
          <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 sm:py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:scale-105 transform transition text-sm sm:text-base">
            <LogOut className="w-5 h-5"/> Logout
          </button>
        </div>
      </div>

      {/* Orders */}
      <SectionCard title="Recent Orders" icon={<ShoppingCart className="w-6 h-6 text-yellow-600"/>} items={orders} type="order" link="/orders" />

      {/* Wishlist */}
      <SectionCard title="Wishlist" icon={<Heart className="w-6 h-6 text-yellow-600"/>} items={wishlist} type="wishlist" link="/wishlist" />

      {/* Cart */}
      <SectionCard title="Cart" icon={<ShoppingCart className="w-6 h-6 text-yellow-600"/>} items={cart} type="cart" link="/cart" />
    </div>
  )
}

// Reusable SectionCard
function SectionCard({ title, icon, items, type, link }: any) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 md:p-8 hover:shadow-2xl transition overflow-x-auto">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 flex items-center gap-2">{icon}{title}</h2>
      {items.length === 0 ? (
        <p className="text-gray-500 text-sm sm:text-base">{type === 'order' ? 'No orders yet.' : type === 'wishlist' ? 'No items in wishlist.' : 'Your cart is empty.'}</p>
      ) : (
        <ul className="space-y-3 min-w-[300px]">
          {items.slice(-5).map((item: any) => (
            <li key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border p-3 rounded-xl hover:bg-yellow-50 transition">
              <p className="text-gray-900 font-medium text-sm sm:text-base">{item.product_name}</p>
              {type === 'cart' ? (
                <span className="text-yellow-600 font-semibold text-sm sm:text-base">₹{item.price} x {item.quantity}</span>
              ) : type === 'order' ? (
                <span className={`text-sm sm:text-base font-semibold ${item.status === 'Delivered' ? 'text-green-600' : 'text-yellow-600'}`}>{item.status}</span>
              ) : (
                <span className="text-yellow-600 font-semibold text-sm sm:text-base">₹{item.price}</span>
              )}
            </li>
          ))}
        </ul>
      )}
      <Link to={link} className="mt-3 inline-block text-yellow-600 font-medium hover:underline text-sm sm:text-base">View all →</Link>
    </div>
  )
}