import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, CodeBracketIcon, SparklesIcon, CreditCardIcon, Cog6ToothIcon, DocumentTextIcon, GlobeAltIcon, ArrowTopRightOnSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';

const navLinks = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: HomeIcon,
    external: false,
  },
  {
    name: 'API Playground',
    href: '/dashboard/playground',
    icon: CodeBracketIcon,
    external: false,
  },
  {
    name: 'Use Cases',
    href: '/dashboard/use-cases',
    icon: SparklesIcon,
    external: false,
  },
  {
    name: 'Billing',
    href: '/dashboard/billing',
    icon: CreditCardIcon,
    external: false,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Cog6ToothIcon,
    external: false,
  },
  {
    name: 'Documentation',
    href: 'https://docs.tavily.com',
    icon: DocumentTextIcon,
    external: true,
  },
  {
    name: 'Tavily MCP',
    href: 'https://mcp.tavily.com',
    icon: GlobeAltIcon,
    external: true,
  },
];

export default function Sidebar({ showSidebar, setShowSidebar }) {
  const pathname = usePathname();

  // Sidebar classes for collapsible sidebar
  const sidebarBase =
    'h-[calc(100vh-2rem)] w-64 bg-white border border-gray-100 shadow-xl rounded-2xl flex flex-col z-40 transition-all duration-200 fixed top-4';
  const sidebarPosition = showSidebar ? 'left-4' : '-left-80';

  return (
    <>
      {/* Overlay only on mobile/tablet */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-30 block lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
      {/* Sidebar: overlay on mobile, fixed on desktop */}
      <aside
        className={`${sidebarBase} bg-white dark:bg-[#181C2A] ${sidebarPosition}`}
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
      >
        {/* Close button only when sidebar is visible */}
        {showSidebar && (
          <button
            className="absolute top-3 right-3 p-1 rounded-full bg-purple-200 hover:bg-purple-300 text-purple-700 shadow-lg"
            onClick={() => setShowSidebar(false)}
            aria-label="Hide sidebar"
          >
            <XMarkIcon className="h-7 w-7" />
          </button>
        )}
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 pt-7 pb-4">
          <span className="inline-block">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M8 24L24 8" stroke="#2563eb" strokeWidth="3" strokeLinecap="round"/>
              <path d="M8 8L24 24" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"/>
              <path d="M16 4V28" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="font-extrabold text-2xl tracking-tight text-gray-800">Dandi</span>
        </div>
        {/* Workspace/User dropdown */}
        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-1">
          {navLinks.map((link) => {
            const isActive = !link.external && pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition
                  ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}
                `}
              >
                <link.icon className={`h-5 w-5 ${isActive ? 'text-blue-500' : 'text-gray-300'}`} />
                <span className="flex-1">{link.name}</span>
                {link.external && <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-300 ml-1" />}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
} 