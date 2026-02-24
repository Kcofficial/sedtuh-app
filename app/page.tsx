'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Bike, 
  Car, 
  Pizza, 
  ShoppingBag, 
  ChevronRight, 
  ChevronLeft,
  Star,
  MapPin,
  Clock,
  LocateFixed,
  Loader2,
  X,
  CheckCircle2,
  ShieldCheck,
  Power,
  Navigation,
  FileText,
  UserPlus,
  ArrowRight,
  ShoppingCart,
  Flag,
  ChevronDown,
  KeyRound,
  Store,
  CheckCircle,
  PlusCircle
} from 'lucide-react'

const AVAILABLE_DISTRICTS = [
  { id: 'sep-surabaya', name: 'Seputih Surabaya', kab: 'Lampung Tengah' },
  { id: 'rumbia', name: 'Rumbia', kab: 'Lampung Tengah', status: 'Segera Hadir' },
]

const CONFIG = {
  MOTOR: { baseFare: 5000, extraPerKm: 1500, baseKm: 3 },
  CAR: { baseFare: 10000, extraPerKm: 3000, baseKm: 3 },
}

export default function HomePage() {
  const [role, setRole] = useState('user')
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [currentPage, setCurrentPage] = useState('home')
  const [isLoadingGps, setIsLoadingGps] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [mockDistance, setMockDistance] = useState(2)
  const [orderData, setOrderData] = useState({ pickup: '', destination: '' })
  const router = useRouter()

  const restaurants = [
    { 
      id: 'r1', 
      name: "Ayam Bakar Madu Spesial", 
      rating: 4.9, 
      distance: "0.8 km", 
      image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=400" 
    }
  ]

  const calculateTotalFare = (serviceId, distance) => {
    const cfg = (serviceId === 'mobil') ? CONFIG.CAR : CONFIG.MOTOR
    const distNum = parseInt(distance) || 0
    if (distNum <= cfg.baseKm) return cfg.baseFare
    return cfg.baseFare + ((distNum - cfg.baseKm) * cfg.extraPerKm)
  }

  const handleGetLocation = () => {
    setIsLoadingGps(true)
    setTimeout(() => {
      setOrderData(prev => ({ ...prev, pickup: `📍 Area ${selectedDistrict?.name} (GPS Aktif)` }))
      setIsLoadingGps(false)
    }, 1000)
  }

  const handleOrder = () => {
    if (!orderData.pickup || !orderData.destination) return alert("Lengkapi Alamat Jemput & Antar!")
    const fare = calculateTotalFare(selectedService?.id, mockDistance)
    alert(`Order berhasil! Total: Rp ${fare.toLocaleString()}`)
  }

  if (!selectedDistrict) return (
    <div className="min-h-screen bg-white p-8 flex flex-col justify-center animate-in zoom-in duration-500">
      <div className="bg-[#069494] text-white w-20 h-20 rounded-[2.5rem] flex items-center justify-center font-black text-3xl mx-auto mb-6 shadow-xl shadow-teal-100 italic">ST</div>
      <h1 className="font-black text-3xl tracking-tighter text-[#069494]">SENDTUH</h1>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-10 text-center">Kecamatan Operasional</p>
      <div className="space-y-4 max-w-xs mx-auto w-full">
        {AVAILABLE_DISTRICTS.map((dist) => (
          <button key={dist.id} disabled={dist.status === 'Segera Hadir'} onClick={() => setSelectedDistrict(dist)} className={`w-full p-5 rounded-[2.5rem] border-2 flex items-center justify-between transition-all ${dist.status === 'Segera Hadir' ? 'opacity-40 bg-slate-50 border-slate-100 text-slate-400' : 'bg-white border-slate-100 hover:border-[#069494] shadow-sm active:scale-95 text-slate-800 shadow-teal-50'}`}>
            <div className="text-left text-slate-800"><p className="font-black text-sm uppercase">{dist.name}</p><p className="text-[9px] font-bold uppercase text-slate-400">Lampung Tengah</p></div>
            {dist.status !== 'Segera Hadir' && <ChevronRight size={18} className="text-[#069494]"/>}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen pb-24 text-left">
      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:flex-row lg:min-h-screen">
        {/* Left Sidebar - District Selection */}
        <div className="lg:w-80 bg-gradient-to-b from-[#069494] to-[#047474] p-6 flex flex-col">
          <div className="text-white text-center mb-8">
            <div className="bg-white text-[#069494] w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl mx-auto mb-4 shadow-xl italic">ST</div>
            <h1 className="font-black text-3xl tracking-tighter">SENDTUH</h1>
            <p className="text-[10px] font-bold text-teal-100 uppercase tracking-[0.3em] mb-8">Kecamatan Operasional</p>
          </div>
          <div className="space-y-4 flex-1">
            {AVAILABLE_DISTRICTS.map((dist) => (
              <button key={dist.id} disabled={dist.status === 'Segera Hadir'} onClick={() => setSelectedDistrict(dist)} className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${dist.status === 'Segera Hadir' ? 'opacity-40 bg-white/10 border-white/10 text-white/50' : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30 active:scale-95 text-white'}`}>
                <div className="text-left"><p className="font-black text-sm uppercase">{dist.name}</p><p className="text-[9px] font-bold text-teal-100 uppercase">Lampung Tengah</p></div>
                {dist.status !== 'Segera Hadir' && <ChevronRight size={18} className="text-white"/>}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
          {/* Header */}
          <header className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-[#069494] text-white rounded-lg p-1.5 font-black text-xs italic shadow-inner">ST</div>
              <div>
                <h1 className="font-bold text-lg uppercase italic">Sendtuh</h1>
                <button onClick={() => setSelectedDistrict(null)} className="text-[8px] font-black text-slate-400 flex items-center gap-1">
                  <MapPin size={8}/> {selectedDistrict?.name} <ChevronDown size={8} />
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => router.push('/auth/signin?role=driver')} className="bg-white/20 px-3 py-1.5 rounded-full text-[10px] flex items-center gap-1 font-bold border border-white/20 active:scale-95">Driver</button>
              <button onClick={() => router.push('/auth/signin?role=mitra')} className="bg-white/20 px-3 py-1.5 rounded-full text-[10px] flex items-center gap-1 font-bold border border-white/20 active:scale-95">Mitra</button>
            </div>
          </header>

          {/* Promo Banner */}
          <div className="bg-gradient-to-r from-[#047474] to-[#069494] rounded-2xl overflow-hidden relative h-48 shadow-lg mb-6">
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center"></div>
            <div className="relative p-6 flex flex-col justify-center h-full text-white">
              <h2 className="text-2xl font-bold uppercase leading-tight italic mb-2">Promo Makanan!</h2>
              <p className="text-lg opacity-90 mb-4">Diskon hingga <span className="text-yellow-400 font-black text-3xl">50%</span></p>
              <p className="text-[10px] font-bold text-teal-200 uppercase tracking-widest">{selectedDistrict?.name}</p>
              <button className="bg-orange-500 text-white text-[12px] px-6 py-3 rounded-full font-bold shadow-md active:scale-95 transition-all">Pesan Sekarang</button>
            </div>
          </div>

          {/* Services Grid */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-8 bg-[#069494] rounded-full"></div>
              <h4 className="text-[12px] font-black uppercase tracking-[0.2em]">Pilih Layanan</h4>
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { id: 'motor', name: 'Ojek Motor', icon: <Bike size={32} />, color: 'bg-[#069494]' },
                { id: 'mobil', name: 'Ojek Mobil', icon: <Car size={32} />, color: 'bg-teal-500' },
                { id: 'food', name: 'Food', icon: <Pizza size={32} />, color: 'bg-cyan-500' },
                { id: 'belanja', name: 'Belanja', icon: <ShoppingBag size={32} />, color: 'bg-emerald-600' }
              ].map(s => (
                <button key={s.id} onClick={() => { setSelectedService(s); setCurrentPage('order') }} className="flex flex-col items-center group">
                  <div className={`${s.color} text-white p-6 rounded-2xl shadow-lg border-b-4 border-black/10 active:translate-y-1 transition-all`}>{s.icon}</div>
                  <span className="text-[10px] font-black mt-3 text-slate-700 uppercase leading-tight text-center">{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Two Column Layout for Restaurants and Reviews */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Restaurants */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-8 bg-[#069494] rounded-full"></div>
                <h4 className="text-[12px] font-black uppercase tracking-[0.2em]">Resto Terpopuler</h4>
              </div>
              <div className="space-y-3">
                {restaurants.map(r => (
                  <div key={r.id} className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:border-teal-200 transition-all">
                    <img src={r.image} className="w-20 h-20 rounded-xl object-cover shadow-sm" alt={r.name} />
                    <div className="flex-1">
                      <h4 className="font-bold text-base text-left">{r.name}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold mt-2">
                        <Star size={12} className="text-yellow-400" fill="currentColor" /> {r.rating} • {r.distance}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-8 bg-[#069494] rounded-full"></div>
                <h4 className="text-[12px] font-black uppercase tracking-[0.2em]">Ulasan Warga</h4>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-teal-50 shadow-sm">
                <div className="flex gap-4 items-center mb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-[#069494] border border-white text-[10px]">FZ</div>
                  <div>
                    <h5 className="text-[12px] font-black uppercase leading-none">Fatia El Zahra</h5>
                    <p className="text-[10px] text-slate-400 italic mt-1">Pengguna Setia</p>
                  </div>
                  <div className="ml-auto flex text-yellow-400 gap-0.5">
                    <Star size={10} fill="currentColor"/>
                    <Star size={10} fill="currentColor"/>
                    <Star size={10} fill="currentColor"/>
                  </div>
                </div>
                <p className="text-[12px] text-slate-600 italic border-t border-slate-50 pt-4 leading-relaxed">
                  "Layanan Sendtuh membantu mobilitas saya di Seputih Surabaya tanpa harus install aplikasi berat. Driver ramah-ramah banget!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <header className="bg-[#069494] text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-2">
            <div className="bg-white text-[#069494] rounded-lg p-1 font-black text-xs italic shadow-inner">ST</div>
            <div className="flex flex-col">
              <h1 className="font-bold text-sm leading-none uppercase italic">Sendtuh</h1>
              <button onClick={() => setSelectedDistrict(null)} className="text-[8px] font-black flex items-center gap-1 mt-0.5 text-teal-100">
                <MapPin size={8}/> {selectedDistrict?.name} <ChevronDown size={8} />
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => router.push('/auth/signin?role=driver')} className="bg-white/20 px-3 py-1 rounded-full text-[10px] flex items-center gap-1 font-bold border border-white/10 active:scale-95 text-white"><Bike size={12} strokeWidth={3} /> Driver</button>
            <button onClick={() => router.push('/auth/signin?role=mitra')} className="bg-white/20 px-3 py-1 rounded-full text-[10px] flex items-center gap-1 font-bold border border-white/10 active:scale-95 text-white"><Store size={12} strokeWidth={3} /> Mitra</button>
          </div>
        </header>

        {/* Mobile Content */}
        <div className="p-4">
          {/* Mobile Promo */}
          <div className="bg-[#047474] rounded-[2.5rem] overflow-hidden relative h-44 shadow-lg border border-white/10 mb-6">
            <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=500')] bg-cover bg-center"></div>
            <div className="relative p-6 flex flex-col justify-center h-full text-white text-left">
              <h2 className="text-xl font-bold uppercase leading-tight italic text-white">Promo Makanan!</h2>
              <p className="text-sm opacity-90 text-white">Diskon hingga <span className="text-yellow-400 font-black text-2xl">50%</span></p>
              <p className="text-[10px] mt-1 font-bold text-teal-200 uppercase tracking-widest">{selectedDistrict?.name}</p>
              <button className="bg-orange-500 text-white text-[10px] px-5 py-2 rounded-full mt-3 w-fit font-bold shadow-md active:scale-95">Pesan Sekarang</button>
            </div>
          </div>

          {/* Mobile Services */}
          <div className="px-4 py-4 text-left">
            <div className="flex items-center gap-2 mb-4 text-slate-800 text-left">
               <div className="h-[2px] w-6 bg-[#069494] rounded-full"></div>
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Pilih Layanan</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'motor', name: 'Ojek Motor', icon: <Bike size={28} />, color: 'bg-[#069494]' },
                { id: 'mobil', name: 'Ojek Mobil', icon: <Car size={28} />, color: 'bg-teal-500' },
                { id: 'food', name: 'Food', icon: <Pizza size={28} />, color: 'bg-cyan-500' },
                { id: 'belanja', name: 'Belanja', icon: <ShoppingBag size={28} />, color: 'bg-emerald-600' }
              ].map(s => (
                <button key={s.id} onClick={() => { setSelectedService(s); setCurrentPage('order') }} className="flex flex-col items-center group">
                  <div className={`${s.color} text-white p-4 rounded-2xl shadow-md border-b-4 border-black/10 active:translate-y-1 transition-all`}>{s.icon}</div>
                  <span className="text-[9px] font-black mt-3 text-slate-700 uppercase leading-tight text-center">{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Restaurants */}
          <div className="p-4 text-left">
            <div className="flex items-center gap-2 mb-4 text-slate-800 text-left">
               <div className="h-[2px] w-6 bg-[#069494] rounded-full"></div>
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Resto Terpopuler</h4>
            </div>
            {restaurants.map(r => (
              <div key={r.id} className="flex gap-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-100 mb-3 cursor-pointer hover:border-teal-200 transition-all">
                <img src={r.image} className="w-16 h-16 rounded-xl object-cover shadow-sm" alt={r.name} />
                <div className="flex-1 text-slate-800">
                  <h4 className="font-bold text-sm text-left">{r.name}</h4>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold mt-1">
                    <Star size={10} className="text-yellow-400" fill="currentColor" /> {r.rating} • {r.distance}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Reviews */}
          <div className="p-4 pb-12 text-left">
            <div className="flex items-center gap-2 mb-4 text-slate-800 text-left">
               <div className="h-[2px] w-6 bg-[#069494] rounded-full"></div>
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Ulasan Warga</h4>
            </div>
            <div className="bg-white p-5 rounded-[2.5rem] border border-teal-50 shadow-sm relative text-slate-800 text-left">
               <div className="flex gap-3 items-center mb-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-[#069494] border border-white text-[10px]">FZ</div>
                  <div className="text-left">
                     <h5 className="text-[11px] font-black uppercase leading-none">Fatia El Zahra</h5>
                     <p className="text-[9px] text-slate-400 italic mt-1">Pengguna Setia</p>
                  </div>
                  <div className="ml-auto flex text-yellow-400 gap-0.5"><Star size={8} fill="currentColor"/><Star size={8} fill="currentColor"/><Star size={8} fill="currentColor"/></div>
               </div>
               <p className="text-[11px] text-slate-600 italic border-t border-slate-50 pt-3 leading-relaxed">
                 "Layanan Sendtuh membantu mobilitas saya di Seputih Surabaya tanpa harus install aplikasi berat. Driver ramah-ramah banget!"
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Footer */}
      <footer className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#069494] text-white flex justify-between items-center rounded-t-[2.5rem] shadow-2xl z-50">
        <div className="flex items-center gap-2 text-white text-left">
          <div className="bg-white text-[#069494] rounded-lg p-1.5 font-black text-[9px] italic shadow-inner">ST</div>
          <span className="text-[10px] font-bold tracking-tighter uppercase leading-none">Sendtuh | {selectedDistrict?.name}</span>
        </div>
        <Button onClick={() => router.push('/auth/signin')} className="bg-white/10 text-white px-5 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 border border-white/20 active:scale-95 transition-all shadow-sm">
          <ShieldCheck size={14}/> Masuk
        </Button>
      </footer>

      {/* Desktop Footer */}
      <div className="hidden lg:flex fixed bottom-6 right-6 z-50">
        <Button onClick={() => router.push('/auth/signin')} className="bg-[#069494] text-white px-6 py-3 rounded-xl text-[12px] font-black shadow-lg active:scale-95 transition-all">
          <ShieldCheck size={16}/> Masuk
        </Button>
      </div>
    </div>
  )
}
