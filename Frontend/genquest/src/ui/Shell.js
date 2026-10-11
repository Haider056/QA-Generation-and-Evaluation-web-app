import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiChevronDown, FiLogOut } from 'react-icons/fi';
import Brand from './Brand';
import { getUser, signOut } from './api';

const initials = (name, email) =>
  (name || email || '?').split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((s) => s[0].toUpperCase()).join('');

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative flex h-14 items-center px-1 text-sm font-medium transition-colors ${
          isActive ? 'text-ink after:absolute after:inset-x-0 after:bottom-[-1px] after:h-[2px] after:bg-ink' : 'text-muted hover:text-ink'
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function UserMenu() {
  const user = getUser() || { name: 'Guest', email: '' };
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-md py-1 pl-1 pr-2 text-sm text-ink-2 hover:bg-sunken"
        data-testid="user-menu"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-sunken text-2xs font-semibold text-ink-2">
          {initials(user.name, user.email)}
        </span>
        <span className="font-medium">{user.name || user.email}</span>
        <FiChevronDown size={14} className="text-faint" />
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-40 w-60 rounded-lg border border-line bg-surface p-1 text-sm">
          <div className="px-3 py-2">
            <div className="font-medium text-ink">{user.name}</div>
            <div className="truncate text-xs text-muted">{user.email}</div>
          </div>
          <div className="my-1 h-px bg-line" />
          <button
            onClick={() => { signOut(); navigate('/'); }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-ink-2 hover:bg-sunken"
          >
            <FiLogOut size={14} /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Shell({ children, actions }) {
  return (
    <div className="flex h-full flex-col bg-canvas">
      <header className="z-30 flex h-14 shrink-0 items-center border-b border-line bg-surface px-4">
        <div className="flex w-[264px] items-center"><Brand /></div>
        <nav className="flex items-center gap-6">
          <NavItem to="/Home">Workspace</NavItem>
          <NavItem to="/SavedQuestion">Saved questions</NavItem>
        </nav>
        <div className="ml-auto flex items-center gap-3">{actions}<UserMenu /></div>
      </header>
      <main className="min-h-0 flex-1">{children}</main>
    </div>
  );
}
