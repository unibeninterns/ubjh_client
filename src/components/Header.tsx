"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/current-issue", label: "Current Issue" },
    { href: "/archives", label: "Archives" },
    { href: "/for-authors", label: "For Authors" },
    { href: "/about", label: "About" },
  ];

  const linkClass = (path: string) =>
    `relative font-medium pb-1 border-b-2 transition-colors ${
      pathname === path
        ? "font-bold border-[#FFE9EE] text-[#FFE9EE]"
        : "border-transparent text-white hover:text-[#FFE9EE] hover:border-[#FFE9EE]"
    }`;

  return (
    <header className="bg-[#7A0019] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row */}
        <div className="flex items-center justify-between h-20">
          {/* Logo + Title */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <Image
                src="/uniben-logo.png"
                alt="UNIBEN Logo"
                width={48}
                height={48}
                className="rounded"
              />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight transition-colors group-hover:text-[#FFE9EE]">
                UNIBEN Journal of Science, Technology and Innovation
              </h1>
              <p className="text-sm text-[#FFE9EE] font-medium">
                Open Access • Peer Reviewed
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                {link.label}
              </Link>
            ))}

            {/* Search Toggle */}
            {!isHomePage && (
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            )}

            {/* Submit Button */}
            <Link
              href="/submission"
              className="bg-white text-[#7A0019] px-6 py-2 rounded-full font-semibold hover:bg-[#FFE9EE] transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Submit Manuscript
            </Link>
          </nav>

          {/* Mobile Menu + Search */}
          <div className="lg:hidden flex items-center gap-2">
            {!isHomePage && (
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Search"
              >
                <Search className="h-6 w-6" />
              </button>
            )}
            <button
              className="flex items-center justify-center p-2 hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {!isHomePage && isSearchOpen && (
          <div className="pb-4 animate-fade-in">
            <div className="relative">
              <input
                type="search"
                placeholder="Search articles, authors, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-6 py-3 pl-12 rounded-full border-2 border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:border-white focus:bg-white/20 transition-all"
                autoFocus
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-[#7A0019] px-6 py-2 rounded-full font-semibold hover:bg-[#FFE9EE] transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#5A0A1A] border-t border-white/10 animate-slide-down">
          <nav className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={linkClass(link.href)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Search */}
            <Link
              href="/search"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-2 pb-1 border-b-2 ${
                pathname === "/search"
                  ? "font-bold border-[#FFE9EE] text-[#FFE9EE]"
                  : "border-transparent text-white hover:text-[#FFE9EE] hover:border-[#FFE9EE]"
              }`}
            >
              <Search size={20} /> Advanced Search
            </Link>

            <Link
              href="/submission"
              onClick={() => setIsMenuOpen(false)}
              className="bg-white text-[#7A0019] px-6 py-3 rounded-full font-semibold hover:bg-[#FFE9EE] transition-all text-center shadow-lg hover:shadow-xl"
            >
              Submit Manuscript
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
