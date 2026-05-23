import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/login');
  }

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    userId = decoded.userId;
  } catch (error) {
    // Token is expired or invalid
    redirect('/login');
  }

  await connectToDatabase();
  // Use .lean() for faster queries when you only need standard JS objects, not full Mongoose documents
  const user = await User.findById(userId).select('name email credits role').lean();

  if (!user) {
    redirect('/login');
  }

  // Serialize the MongoDB document to pass safely to Client Components
  const serializedUser = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    credits: user.credits,
    role: user.role,
  };
  // console.log('Authenticated user:', serializedUser);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar user={serializedUser} />
      </div>

      <div className="flex flex-col flex-1 w-full">
        {/* Top Navbar handles mobile sidebar toggle & credit display */}
        <Navbar user={serializedUser} />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}