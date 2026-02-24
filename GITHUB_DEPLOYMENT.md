# 🚀 GitHub Deployment Guide

## 📋 Step-by-Step Upload ke GitHub

### **🔧 Prerequisites:**
1. Install [Git](https://git-scm.com/download/win)
2. Buat akun [GitHub](https://github.com)
3. Install [GitHub Desktop](https://desktop.github.com/) (Recommended)

---

## **🎯 Option 1: GitHub Desktop (Paling Mudah)**

### **Step 1: Install GitHub Desktop**
1. Download: https://desktop.github.com/
2. Install dan login ke GitHub

### **Step 2: Add Local Repository**
1. Buka GitHub Desktop
2. **File → Add Local Repository**
3. Pilih folder: `C:\xampp\htdocs\sedtuh-App`
4. Klik **Add Repository**

### **Step 3: Commit Changes**
1. Di "Summary" ketik: `Initial commit - Sedtuh App Complete`
2. Di "Description" ketik: `Ojek & Food Delivery App with Next.js`
3. Klik **Commit to main**

### **Step 4: Publish to GitHub**
1. Klik **Publish repository**
2. Repository name: `sedtuh-app`
3. Description: `Ojek & Food Delivery App`
4. Klik **Publish repository**

### **Step 5: Selesai!**
✅ Repository sudah online di: `https://github.com/username/sedtuh-app`

---

## **🎯 Option 2: Manual Upload**

### **Step 1: Buat Repository di GitHub**
1. Login ke GitHub
2. Klik **+ → New repository**
3. Repository name: `sedtuh-app`
4. Description: `Ojek & Food Delivery App`
5. Pilih **Public**
6. Klik **Create repository**

### **Step 2: Upload Files**
1. Klik **uploading an existing file**
2. Drag & drop semua file dari folder `sedtuh-App`
3. Kecuali: `.next`, `node_modules`
4. Commit changes: `Initial commit`
5. Klik **Commit changes**

---

## **🌐 Deployment ke Production**

### **🎯 Vercel (Recommended - Free & Auto-Deploy)**

#### **Step 1: Connect ke Vercel**
1. Buka [vercel.com](https://vercel.com)
2. Login dengan GitHub
3. Klik **New Project**
4. Pilih repository `sedtuh-app`

#### **Step 2: Configure**
1. Framework: **Next.js** (auto-detect)
2. Build Command: `npm run build`
3. Output Directory: `.next`
4. Install Command: `npm install`

#### **Step 3: Environment Variables**
```env
DATABASE_URL="mysql://user:pass@host:3306/db"
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-secret-key"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-maps-key"
```

#### **Step 4: Deploy**
1. Klik **Deploy**
2. Tunggu deployment selesai
3. App akan live di: `https://sedtuh-app.vercel.app`

---

### **🎯 Netlify (Alternative - Free)**

#### **Step 1: Connect ke Netlify**
1. Buka [netlify.com](https://netlify.com)
2. Login dengan GitHub
3. Klik **New site from Git**
4. Pilih repository `sedtuh-app`

#### **Step 2: Configure**
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Environment variables: Same as Vercel

#### **Step 3: Deploy**
1. Klik **Deploy site**
2. App akan live di: `https://random-name.netlify.app`

---

### **🎯 Railway (Backend + Database)**

#### **Step 1: Setup Database**
1. Buka [railway.app](https://railway.app)
2. Login dengan GitHub
3. Klik **+ New Project → Deploy from GitHub repo**
4. Pilih repository `sedtuh-app`

#### **Step 2: Add MySQL Service**
1. Klik **+ New Service**
2. Pilih **MySQL**
3. Copy connection string

#### **Step 3: Environment Variables**
```env
DATABASE_URL="mysql://railway-user:password@containers.railway.app:3306/railway"
NEXTAUTH_URL="https://sedtuh-app.up.railway.app"
NEXTAUTH_SECRET="your-secret-key"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-maps-key"
```

#### **Step 4: Deploy**
1. Auto-deploy saat push ke GitHub
2. App live di Railway domain

---

## **🔧 Production Setup**

### **Database Production**
```bash
# Create production database
CREATE DATABASE sedtuh_production;

# Run migrations
npx prisma db push
npx prisma generate
```

### **Create Admin Account**
```bash
# Run admin creation script
npx ts-node scripts/create-admin.ts
```

### **Environment Variables Checklist**
- ✅ `DATABASE_URL` - Production database
- ✅ `NEXTAUTH_URL` - Production domain
- ✅ `NEXTAUTH_SECRET` - Random secret
- ✅ `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Maps API key

---

## **🎉 Setelah Deployment**

### **✅ Testing Checklist**
1. **Homepage** - Load dengan benar?
2. **Registrasi** - User bisa daftar?
3. **Login** - Semua role bisa login?
4. **Dashboard** - Redirect ke halaman benar?
5. **Admin Approval** - Driver/Mitra butuh approval?

### **🔧 Common Issues**
- **ChunkLoadError** - Clear browser cache
- **Database Error** - Check connection string
- **Maps Not Loading** - Check API key
- **Auth Error** - Check NEXTAUTH_URL

### **📱 Mobile Testing**
- Test di Chrome mobile view
- Test PWA install
- Test push notifications

---

## **🎯 Next Steps**

### **🚀 Production Features**
- [ ] Payment gateway integration
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Multi-language support

### **📈 Scaling**
- [ ] Load balancing
- [ ] CDN setup
- [ ] Database optimization
- [ ] Caching strategy

---

## **📞 Support**

Jika ada masalah:
1. **GitHub Issues**: Create issue di repository
2. **Documentation**: Baca README.md
3. **Community**: Join Discord/Telegram group

---

**🎉 Selamat! Aplikasi Sedtuh App sudah siap production!**
