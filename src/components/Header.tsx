"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-[#7A0019] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
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
              <h1 className="text-xl font-bold tracking-tight">
                UNIBEN Journal of Humanities
              </h1>
              <p className="text-sm text-[#FFE9EE] font-medium">Archives</p>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-6">
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
        </div>
      </div>
    </header>
  );
}
