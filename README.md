# 🛵 Sedtuh App - Ojek & Food Delivery

Aplikasi ojek online dan food delivery dengan Next.js 14, Prisma, dan MySQL.

## 🚀 Features

### 👤 User Features
- **Registrasi & Login** - Multi-role authentication
- **Order Services** - Ojek & makanan
- **Real-time Tracking** - Live order status
- **Payment Integration** - Multiple payment methods
- **Order History** - Complete transaction records

### 🏍️ Driver Features
- **Online/Offline Toggle** - Flexible working hours
- **Order Management** - Accept/reject orders
- **Navigation** - Google Maps integration
- **Earnings Tracking** - Real-time income monitoring
- **Rating System** - Customer feedback

### 🏪 Mitra Features
- **Restaurant Management** - Menu & pricing
- **Order Processing** - Real-time order updates
- **Inventory Management** - Stock tracking
- **Analytics Dashboard** - Sales insights

### 👨‍💼 Admin Features
- **User Management** - Approval system for drivers/mitra
- **Order Monitoring** - Complete order oversight
- **Financial Reports** - Revenue analytics
- **System Settings** - Platform configuration

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MySQL
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Maps**: Google Maps API
- **Real-time**: Socket.io
- **Notifications**: Push notifications

## 📋 Requirements

- Node.js 18+
- MySQL 8+
- Google Maps API Key

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/sedtuh-app.git
cd sedtuh-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env.local`:
```env
DATABASE_URL="mysql://username:password@localhost:3306/sedtuh_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-maps-api-key"
```

### 4. Database Setup
```bash
npx prisma db push
npx prisma generate
```

### 5. Create Admin Account
```bash
npx ts-node scripts/create-admin.ts
```

### 6. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📱 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| User | user@demo.com | 123456 |
| Driver | driver@demo.com | 123456 |
| Mitra | mitra@demo.com | 123456 |
| Admin | admin@sedtuh.com | admin123 |

## 🏗️ Project Structure

```
sedtuh-app/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── auth/              # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── driver/            # Driver dashboard
│   ├── mitra/             # Mitra dashboard
│   └── page.tsx           # Homepage
├── components/            # Reusable components
├── lib/                  # Utilities & configurations
├── prisma/               # Database schema & migrations
├── scripts/              # Database scripts
└── public/               # Static assets
```

## 🔐 Authentication Flow

### User Registration
- **User Role**: Auto-approved → Direct login
- **Driver Role**: Pending approval → Admin approval required
- **Mitra Role**: Pending approval → Admin approval required
- **Admin Role**: Manual creation (no registration)

### Login Process
1. User selects role during login
2. System validates credentials
3. Check approval status
4. Redirect to appropriate dashboard

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`

### Railway
1. Connect GitHub repository
2. Setup MySQL database
3. Configure environment variables

## 📊 Database Schema

Key models:
- **User** - Authentication & profile
- **DriverProfile** - Driver-specific data
- **MitraProfile** - Restaurant data
- **Order** - Order management
- **Product** - Menu items
- **Notification** - Push notifications

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Email: support@sedtuh.com
- GitHub Issues: [Create Issue](https://github.com/yourusername/sedtuh-app/issues)

---

**Built with ❤️ in Indonesia**
