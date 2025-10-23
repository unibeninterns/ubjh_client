"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // icons for the burger and close button

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-[#7A0019] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo + Title */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center">
              <Image
                src="/uniben-logo.png"
                alt="UNIBEN Logo"
                width={48}
                height={48}
                className="rounded"
              />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight">
                UNIBEN Journal of Humanities
              </h1>
              <p className="text-sm text-[#FFE9EE] font-medium">Archives</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:text-sm lg:flex items-center gap-6">
            <Link
              href="/"
              className="text-white hover:text-[#FFE9EE] font-semibold transition-colors"
            >
              Home
            </Link>
            <Link
              href="/current-issue"
              className="text-white hover:text-[#FFE9EE] font-medium transition-colors"
            >
              Current Issue
            </Link>
            <Link
              href="/archives"
              className="text-white hover:text-[#FFE9EE] font-medium transition-colors"
            >
              Archives
            </Link>
            <Link
              href="/for-authors"
              className="text-white hover:text-[#FFE9EE] font-medium transition-colors"
            >
              For Authors
            </Link>
            <Link
              href="/about"
              className="text-white hover:text-[#FFE9EE] font-medium transition-colors"
            >
              About
            </Link>
            <Link
              href="/submission"
              className="bg-white text-[#7A0019] px-6 py-2 rounded-full font-semibold hover:bg-[#FFE9EE] transition-all shadow-lg hover:shadow-xl"
            >
              Submit Manuscript
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden flex items-center justify-center p-2 text-white hover:text-[#FFE9EE] focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#7A0019] border-t border-[#FFE9EE]/20 absolute right-0 top-20 w-3/4 sm:w-1/2 rounded-bl-xl shadow-lg animate-slide-down">
          <nav className="flex flex-col p-6 space-y-4">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-[#FFE9EE] font-semibold transition-colors"
            >
              Home
            </Link>
            <Link
              href="/current-issue"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-[#FFE9EE] font-medium transition-colors"
            >
              Current Issue
            </Link>
            <Link
              href="/archives"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-[#FFE9EE] font-medium transition-colors"
            >
              Archives
            </Link>
            <Link
              href="/for-authors"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-[#FFE9EE] font-medium transition-colors"
            >
              For Authors
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-[#FFE9EE] font-medium transition-colors"
            >
              About
            </Link>
            <Link
              href="/submission"
              onClick={() => setIsOpen(false)}
              className="bg-white text-[#7A0019] px-6 py-2 rounded-full font-semibold hover:bg-[#FFE9EE] transition-all shadow-lg hover:shadow-xl text-center"
            >
              Submit Manuscript
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
