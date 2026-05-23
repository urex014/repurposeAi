import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { Users, Gift, TrendingUp } from 'lucide-react';
import AffiliateLinkClient from '../AffliliateLinkClient.tsx/page';

export default async function AffiliatePage() {
  // 1. Authenticate and fetch user data
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  
  if (!token) return null;
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

  await connectToDatabase();
  const user = await User.findById(decoded.userId).lean();
  if (!user) return null;

  // 2. Count how many people signed up using their code
  const totalReferrals = await User.countDocuments({ referredBy: user._id });

  // Fallback if older users don't have a code yet
  const referralCode = user.referralCode || 'PENDING';
  
  // In production, use your actual domain
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const referralLink = `${baseUrl}/register?ref=${referralCode}`;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">Affiliate Program</h1>
        <p className="text-slate-400">Share Repurpose AI and earn free credits every time your friends upgrade.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Users className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Total Signups</p>
            <p className="text-2xl font-bold text-white">{totalReferrals}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Gift className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Credits Earned</p>
            <p className="text-2xl font-bold text-white">{(user.referralCreditsEarned || 0).toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
            <TrendingUp className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Commission Rate</p>
            <p className="text-2xl font-bold text-white">20%</p>
          </div>
        </div>
      </div>

      {/* Share Link Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-3xl">
        <h2 className="text-xl font-bold text-white mb-4">Your Unique Referral Link</h2>
        <p className="text-slate-400 mb-6 text-sm leading-relaxed">
          When someone creates an account using your link, they are permanently tracked as your referral. 
          Every time they purchase a credit package, you automatically receive <strong>20% of their credits</strong> added to your balance instantly.
        </p>

        {/* Client component to handle the clipboard copy action */}
        <AffiliateLinkClient link={referralLink} />
      </div>
    </div>
  );
}