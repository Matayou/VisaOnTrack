'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, LogOut, Sparkles, User as UserIcon } from 'lucide-react';
import { api, type Request, type RequestStatus, type User } from '@visaontrack/client';
import { logout } from '@/lib/auth';

const statusLabels: Partial<Record<RequestStatus, string>> = {
  DRAFT: 'Draft',
  OPEN: 'Active',
  CLOSED: 'Closed',
  HIRED: 'Hired',
};

const statusClasses: Partial<Record<RequestStatus, string>> = {
  DRAFT: 'bg-amber-50 text-amber-800 border-amber-200',
  OPEN: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  CLOSED: 'bg-gray-100 text-gray-700 border-gray-200',
  HIRED: 'bg-blue-50 text-blue-800 border-blue-200',
};

export function SeekerHeader() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [latestRequest, setLatestRequest] = useState<Request | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const currentUser = await api.users.getCurrentUser();
        if (currentUser.role !== 'SEEKER') {
          return;
        }
        setUser(currentUser);
        const list = await api.requests.listRequests({ page: 1, limit: 1, seekerId: currentUser.id });
        setLatestRequest(list.items?.[0] ?? null);
      } catch (err: unknown) {
        console.error('[SeekerHeader] Unable to load user/request', err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!user || user.role !== 'SEEKER') {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-border-light shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </span>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-text-primary">VisaOnTrack</p>
            </div>
          </Link>
          {latestRequest && (
            <Link
              href={`/requests/${latestRequest.id}`}
              className="hidden md:inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary px-3 py-2 rounded-base transition"
            >
              My request
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                  statusClasses[latestRequest.status] ?? 'bg-bg-secondary text-text-secondary border-border-light'
                }`}
              >
                {statusLabels[latestRequest.status] ?? latestRequest.status}
              </span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-border-light px-3 py-1.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-border transition"
            >
              <UserIcon className="w-4 h-4" aria-hidden="true" />
              <ChevronDown className="w-4 h-4 text-text-tertiary" aria-hidden="true" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-base border border-border-light bg-white shadow-lg">
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary/60"
                >
                  Home
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary/60"
                >
                  Settings
                </Link>
                <form
                  action={() => logout(router)}
                  className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary/60 flex items-center gap-2"
                >
                  <button type="submit" className="flex items-center gap-2 w-full text-left">
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    Logout
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
