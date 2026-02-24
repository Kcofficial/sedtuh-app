'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bike, Car, Pizza, ShoppingBag, User, ShieldCheck, Store, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

function SignUpContent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const role = searchParams.get('role')
    if (role && ['USER', 'DRIVER', 'MITRA', 'ADMIN'].includes(role.toUpperCase())) {
      setFormData(prev => ({ ...prev, role: role.toUpperCase() }))
    }
  }, [searchParams])

  const roles = [
    {
      id: 'USER',
      name: 'User',
      description: 'Pesan layanan ojek & makanan',
      icon: <User className="w-6 h-6" />,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      borderColor: 'border-blue-500'
    },
    {
      id: 'DRIVER',
      name: 'Driver',
      description: 'Terima order dan antar',
      icon: <Bike className="w-6 h-6" />,
      color: 'bg-[#069494]',
      hoverColor: 'hover:bg-[#047474]',
      borderColor: 'border-[#069494]'
    },
    {
      id: 'MITRA',
      name: 'Mitra',
      description: 'Kelola restoran & menu',
      icon: <Store className="w-6 h-6" />,
      color: 'bg-emerald-500',
      hoverColor: 'hover:bg-emerald-600',
      borderColor: 'border-emerald-500'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Password tidak sama!')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password minimal 6 karakter!')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      })

      const data = await response.json()

      if (response.ok) {
        const data = await response.json()
        
        if (data.requiresApproval) {
          toast.success(data.message)
          // Redirect to signin but show info about pending approval
          setTimeout(() => {
            router.push('/auth/signin?pending=true')
          }, 2000)
        } else {
          toast.success(data.message)
          router.push('/auth/signin')
        }
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Registrasi gagal!')
      }
    } catch (error) {
      toast.error('Registrasi gagal, coba lagi!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#069494] to-[#047474] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white text-[#069494] w-20 h-20 rounded-[2rem] flex items-center justify-center font-black text-3xl mx-auto mb-4 shadow-xl italic">ST</div>
          <h1 className="font-black text-4xl tracking-tighter text-white mb-2">SENDTUH</h1>
          <p className="text-[12px] font-bold text-teal-200 uppercase tracking-widest">Buat Akun Baru</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Role Selection */}
          <div className="bg-white/10 backdrop-blur-md rounded-[2.5rem] p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6 text-center">Pilih Peran Anda</h2>
            <div className="space-y-3">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setFormData(prev => ({ ...prev, role: role.id }))}
                  className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                    formData.role === role.id
                      ? `${role.color} text-white border-white`
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    formData.role === role.id ? 'bg-white/20' : 'bg-white/10'
                  }`}>
                    {role.icon}
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-bold text-lg">{role.name}</h3>
                    <p className="text-sm opacity-80">{role.description}</p>
                  </div>
                  {formData.role === role.id && (
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-current rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl">
            <CardHeader className="text-center p-0 mb-6">
              <CardTitle className="text-2xl text-slate-800">
                Daftar sebagai <span className="text-[#069494] font-black italic">{formData.role}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">
                    Nama Lengkap
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#069494] focus:border-transparent font-bold text-slate-700"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#069494] focus:border-transparent font-bold text-slate-700"
                    placeholder="email@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#069494] focus:border-transparent font-bold text-slate-700"
                    placeholder="Minimal 6 karakter"
                    required
                    minLength={6}
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">
                    Konfirmasi Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#069494] focus:border-transparent font-bold text-slate-700"
                    placeholder="Ulangi password"
                    required
                    minLength={6}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#069494] hover:bg-[#047474] text-white py-4 rounded-2xl font-black text-lg shadow-lg transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    'Loading...'
                  ) : (
                    <>
                      Daftar sebagai {formData.role}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                  Sudah punya akun?{' '}
                  <button 
                    onClick={() => router.push('/auth/signin')}
                    className="text-[#069494] hover:text-[#047474] font-bold"
                  >
                    Masuk Sekarang
                  </button>
                </p>
              </div>
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpContent />
    </Suspense>
  )
}
