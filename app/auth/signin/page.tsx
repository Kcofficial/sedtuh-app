'use client'

import { useState, useEffect, Suspense } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bike, Car, Pizza, ShoppingBag, User, ShieldCheck, Store, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

function SignInContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState('USER')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const role = searchParams.get('role')
    if (role) {
      setSelectedRole(role.toUpperCase())
    }

    // Show pending approval notification
    const pending = searchParams.get('pending')
    if (pending === 'true') {
      setTimeout(() => {
        toast('Akun Anda sedang menunggu persetujuan admin. Silakan cek email untuk konfirmasi.', {
          duration: 5000,
          icon: '⏳'
        })
      }, 1000)
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
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        toast.error('Email atau password salah!')
      } else {
        const session = await getSession()
        if (session) {
          // Check if user is approved
          if (!session.user.isActive || session.user.status === 'PENDING') {
            toast.error('Akun Anda belum disetujui oleh admin. Silakan tunggu konfirmasi.', {
              duration: 5000,
              icon: '⏳'
            })
            // Sign out the user
            await fetch('/api/auth/signout', { method: 'POST' })
            return
          }

          toast.success(`Login berhasil sebagai ${session.user.role}!`)
          
          switch (session.user.role) {
            case 'USER':
              router.push('/')
              break
            case 'DRIVER':
              router.push('/driver')
              break
            case 'MITRA':
              router.push('/mitra')
              break
            case 'ADMIN':
              router.push('/admin')
              break
            default:
              router.push('/')
          }
        }
      }
    } catch (error) {
      toast.error('Login gagal, coba lagi!')
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
          <p className="text-[12px] font-bold text-teal-200 uppercase tracking-widest">Login ke Akun Anda</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Role Selection */}
          <div className="bg-white/10 backdrop-blur-md rounded-[2.5rem] p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6 text-center">Pilih Peran Anda</h2>
            <div className="space-y-3">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                    selectedRole === role.id
                      ? `${role.color} text-white border-white`
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedRole === role.id ? 'bg-white/20' : 'bg-white/10'
                  }`}>
                    {role.icon}
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-bold text-lg">{role.name}</h3>
                    <p className="text-sm opacity-80">{role.description}</p>
                  </div>
                  {selectedRole === role.id && (
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-current rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl">
            <CardHeader className="text-center p-0 mb-6">
              <CardTitle className="text-2xl text-slate-800">
                Masuk sebagai <span className="text-[#069494] font-black italic">{selectedRole}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#069494] focus:border-transparent font-bold text-slate-700"
                    placeholder="••••••••"
                    required
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
                      Masuk sebagai {selectedRole}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                  Belum punya akun?{' '}
                  <button 
                    onClick={() => router.push('/auth/signup')}
                    className="text-[#069494] hover:text-[#047474] font-bold"
                  >
                    Daftar Sekarang
                  </button>
                </p>
              </div>

              {/* Demo Accounts */}
              <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Akun Demo</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">User:</span>
                    <span className="font-mono text-slate-800">user@demo.com / 123456</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Driver:</span>
                    <span className="font-mono text-slate-800">driver@demo.com / 123456</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Mitra:</span>
                    <span className="font-mono text-slate-800">mitra@demo.com / 123456</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  )
}
