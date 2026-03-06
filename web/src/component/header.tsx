import { Link } from '@tanstack/react-router'
import { useState, useEffect,useLayoutEffect } from 'react'
import { useRouterState } from "@tanstack/react-router"
import { useAuth } from "@/context/AuthContext"
import {
  Menu,
  X,
  ShoppingCart,
  User,
  ChevronDown,
  Heart,
  Plus,
  Minus,
  Trash2,
  Home,
} from 'lucide-react'

type CartItem = {
  id: number
  name: string
  price: number
  image: string
  qty: number
}

export default function Header() {
  const [megaOpen, setMegaOpen] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [setUser] = useState<{ name: string } | null>(null)
  const { user, logout } = useAuth()

  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: 'Premium Watch', price: 1999, image: '/w.jfif', qty: 1 },
    { id: 2, name: 'Luxury Shoes', price: 2999, image: '/s.jfif', qty: 1 },
  ])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = cartOpen || mobileOpen ? 'hidden' : 'auto'
  }, [cartOpen, mobileOpen])

  // ESC close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCartOpen(false)
        setMobileOpen(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Auto-update user from localStorage
  // useLayoutEffect(() => {
  //   const storedUser = localStorage.getItem('user')
  //   if (storedUser) setUser(JSON.parse(storedUser))
  //   const handleStorageChange = (e: StorageEvent) => {
  //     if (e.key === 'user') {
  //       if (e.newValue) setUser(JSON.parse(e.newValue))
  //       else setUser(null)
  //     }
  //   }
  //   window.addEventListener('storage', handleStorageChange)
  //   return () => window.removeEventListener('storage', handleStorageChange)
  // }, [])

  // const handleLogout = () => {
  //   localStorage.removeItem('user')
  //   setUser(null)
  //   setMobileOpen(false)
  // }

  const increaseQty = (id: number) => setCartItems(prev => prev.map(i => i.id === id ? {...i, qty: i.qty + 1} : i))
  const decreaseQty = (id: number) => setCartItems(prev => prev.map(i => i.id === id && i.qty > 1 ? {...i, qty: i.qty - 1} : i))
  const removeItem = (id: number) => setCartItems(prev => prev.filter(i => i.id !== id))
  const total = cartItems.reduce((acc, i) => acc + i.price * i.qty, 0)

  const categories = [
    { name: 'Men', path: '/men', image: '/m.jfif', sections: [
      { title: 'Clothing', links: ['Shirts','Jackets','T-Shirts'] },
      { title: 'Accessories', links: ['Watches','Belts','Shoes'] }
    ]},
    { name: 'Women', path: '/women', image: '/c.jfif', sections: [
      { title: 'Fashion', links: ['Dresses','Heels','Bags'] },
      { title: 'Beauty', links: ['Makeup','Perfume','Jewelry'] }
    ]}
  ]

  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const toggleCategory = (name: string) => setOpenCategory(openCategory === name ? null : name)
  const pathname = useRouterState({ select: s => s.location.pathname })
  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Categories", path: "/ProductCatgories", icon: ChevronDown },
    { name: "Wishlist", path: "/wishlist", icon: Heart },
    { name: "Account", path: "/account", icon: User },
    { name: "Cart", path: "/cart", icon: ShoppingCart },
  ]

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 bg-white shadow-md z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center py-3 md:py-4">
          {/* LEFT */}
          <div className="flex items-center gap-4 md:gap-10">
            <button onClick={() => setMobileOpen(true)} className="md:hidden">
              <Menu />
            </button>
            <Link to="/" className="text-xl md:text-xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent"></Link>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex gap-8 relative">
              {categories.map(cat => (
                <div key={cat.name} onMouseEnter={() => setMegaOpen(cat.name)} onMouseLeave={() => setMegaOpen(null)} className="relative">
                  <button className="flex items-center gap-1 font-medium hover:text-yellow-600">
                    {cat.name} <ChevronDown size={16}/>
                  </button>

                  {megaOpen === cat.name && (
                    <div className="absolute left-0 top-full mt-6 w-[900px] max-w-[90vw] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transition-all duration-300">
                      <div className="grid grid-cols-1 lg:grid-cols-3">
                        {/* LEFT IMAGE */}
                        <Link to={cat.path} className="relative col-span-1 group bg-gray-100 h-60 lg:h-full">
                          <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/40"></div>
                          <div className="absolute bottom-8 left-6 text-white">
                            <h2 className="text-2xl md:text-3xl font-bold tracking-wide">{cat.name}</h2>
                            <p className="text-sm opacity-90 mt-2">New Collection 2026</p>
                          </div>
                        </Link>
                        {/* RIGHT */}
                        <div className="col-span-2 p-6 md:p-10 bg-gradient-to-br from-white to-gray-50">
                          {cat.sections.map((sec,idx)=>(
                            <div key={sec.title} className="mb-6 md:mb-8">
                              <h4 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-gray-900">{sec.title}</h4>
                              <div className="grid grid-cols-2 gap-3 md:gap-4 text-sm md:text-base">
                                {sec.links.map(link=>(
                                  <Link key={link} to={`${cat.path}/${link.toLowerCase()}`} className="text-gray-600 hover:text-black hover:underline underline-offset-4 transition">{link}</Link>
                                ))}
                              </div>
                              {idx!==cat.sections.length-1 && <div className="mt-4 border-t border-gray-200"></div>}
                            </div>
                          ))}
                          <div className="mt-4 md:mt-6">
                            <Link to={cat.path} className="inline-block bg-black text-white px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base hover:bg-yellow-600 transition">View All {cat.name} →</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <Link to="/ProductCatgories" className="font-medium hover:text-yellow-600">Categories</Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3 md:gap-6">
            <Link to="/wishlist"><Heart size={22} /></Link>

            {user ? (
              <>
                <Link to="/account"><User size={22}/></Link>
                <button onClick={logout} className="bg-red-500 text-white font-semibold px-4 py-2 rounded-full hover:bg-red-600 transition text-sm md:text-base">Logout</button>
              </>
            ) : (
              <Link to="/login">
                <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold px-4 md:px-5 py-2 rounded-full shadow-lg hover:from-yellow-500 hover:to-yellow-700 hover:scale-105 transform transition-all duration-300 text-sm md:text-base">Login</button>
              </Link>
            )}

            <button onClick={()=>setCartOpen(true)} className="relative">
              <ShoppingCart className="w-7 h-7 md:w-8 md:h-8"/>
              {cartItems.length>0 && <span className="absolute -top-1 -right-1 bg-yellow-600 text-white text-[10px] md:text-xs w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full">{cartItems.length}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div className={`fixed top-0 left-0 h-full w-4/5 max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-xl shadow-xl transform ${mobileOpen?'translate-x-0':'-translate-x-full'} transition-transform duration-300 z-50 flex flex-col`}>
        {/* header */}
        <div className="flex justify-between items-center px-6 py-5 border-b">
          <h2 className="text-2xl font-bold tracking-wide">Explore</h2>
          <X onClick={()=>setMobileOpen(false)} className="cursor-pointer hover:rotate-90 transition duration-300"/>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {categories.map(cat=>(
            <div key={cat.name} className="rounded-2xl overflow-hidden shadow-md border border-gray-100">
              <div onClick={()=>toggleCategory(cat.name)} className="relative cursor-pointer group">
                <img src={cat.image} className="h-32 w-full object-cover transition duration-700 group-hover:scale-105"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
                <div className="absolute bottom-4 left-4 text-white flex justify-between items-center w-[85%]">
                  <h3 className="text-lg font-semibold">{cat.name}</h3>
                  <ChevronDown size={20} className={`transition-transform duration-300 ${openCategory===cat.name?'rotate-180':''}`}/>
                </div>
              </div>
              <div className={`transition-all duration-500 overflow-hidden ${openCategory===cat.name?'max-h-96 opacity-100':'max-h-0 opacity-0'}`}>
                <div className="bg-white px-5 py-4 space-y-3 text-sm">
                  {cat.sections.map(sec=>sec.links.map(link=>(
                    <Link key={link} to={`${cat.path}/${link.toLowerCase()}`} onClick={()=>setMobileOpen(false)} className="block text-gray-600 hover:text-yellow-600 hover:translate-x-1 transition-all duration-200">{link}</Link>
                  )))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* bottom mobile */}
        <div className="p-6 border-t bg-gray-50 space-y-4">
          {user?(
            <>
              <Link to="/account" onClick={()=>setMobileOpen(false)} className="flex items-center gap-2"><User size={22}/>Account</Link>
              <button onClick={logout} className="bg-red-500 text-white font-semibold px-4 py-2 rounded-full w-full hover:bg-red-600 transition">Logout</button>
            </>
          ):(
            <Link to="/login" onClick={()=>setMobileOpen(false)}>
              <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold px-4 py-2 rounded-full w-full shadow-lg hover:from-yellow-500 hover:to-yellow-700 hover:scale-105 transition">Login</button>
            </Link>
          )}
          <Link to="/wishlist" onClick={()=>setMobileOpen(false)} className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-full text-sm text-gray-700 hover:bg-yellow-600 hover:text-white transition"><Heart size={18}/>Wishlist</Link>
        </div>
      </div>

      {/* CART DRAWER */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl transform ${cartOpen?'translate-x-0':'translate-x-full'} transition-transform duration-300 z-50 p-6 flex flex-col`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Cart</h2>
          <X onClick={()=>setCartOpen(false)} className="cursor-pointer"/>
        </div>
        <div className="flex-1 overflow-y-auto space-y-6">
          {cartItems.length===0 && <p className="text-center text-gray-500">Your cart is empty.</p>}
          {cartItems.map(item=>(
            <div key={item.id} className="flex gap-4">
              <img src={item.image} className="w-20 h-20 rounded-lg object-cover"/>
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-yellow-600 font-semibold">₹{item.price}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={()=>decreaseQty(item.id)} className="p-1 border rounded"><Minus size={14}/></button>
                  <span>{item.qty}</span>
                  <button onClick={()=>increaseQty(item.id)} className="p-1 border rounded"><Plus size={14}/></button>
                  <button onClick={()=>removeItem(item.id)} className="ml-auto text-red-500"><Trash2 size={16}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cartItems.length>0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between font-semibold mb-4"><span>Total</span><span>₹{total}</span></div>
            <Link to="/cart"><button className="w-full bg-yellow-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition">Checkout</button></Link>
          </div>
        )}
      </div>

      {/* OVERLAY */}
      {(cartOpen || mobileOpen) && <div className="fixed inset-0 bg-black/40 z-40" onClick={()=>{setCartOpen(false);setMobileOpen(false)}}/>}
    </>
  )
}