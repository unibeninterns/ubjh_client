"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
  <footer className="bg-[#FAF7F8] border-t border-[#EAD3D9] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-[#7A0019] mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href=""
                    className="text-gray-600 hover:text-[#7A0019]"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/current-issue"
                    className="text-gray-600 hover:text-[#7A0019]"
                  >
                    Current Issue
                  </Link>
                </li>
                <li>
                  <Link
                    href="/archives"
                    className="text-gray-600 hover:text-[#7A0019]"
                  >
                    Archives
                  </Link>
                </li>
                <li>
                  <Link
                    href="/for-authors"
                    className="text-gray-600 hover:text-[#7A0019]"
                  >
                    For Authors
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[#7A0019] mb-4">About</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-[#7A0019]"
                  >
                    Journal Overview
                  </Link>
                </li>
                <li>
                  <Link
                    href="/editorial-board"
                    className="text-gray-600 hover:text-[#7A0019]"
                  >
                    Editorial Board
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies"
                    className="text-gray-600 hover:text-[#7A0019]"
                  >
                    Policies
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[#7A0019] mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/for-authors"
                    className="text-gray-600 hover:text-[#7A0019]"
                  >
                    Author Guidelines
                  </Link>
                </li>
                <li>
                  <Link
                    href="/peer-review"
                    className="text-gray-600 hover:text-[#7A0019]"
                  >
                    Peer Review Process
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ethics"
                    className="text-gray-600 hover:text-[#7A0019]"
                  >
                    Publication Ethics
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[#7A0019] mb-4">Contact</h3>
              <p className="text-gray-600 text-sm mb-2">
                <strong>Email:</strong>
                <br />
                <a
                  href="mailto:journalhumanities@uniben.edu"
                  className="hover:text-[#7A0019]"
                >
                  journalhumanities@uniben.edu
                </a>
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Address:</strong>
                <br />
                University of Benin
                <br />
                Benin City, Nigeria
              </p>
            </div>
          </div>
          <div className="border-t border-[#EAD3D9] pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>
              © {new Date().getFullYear()} University of Benin — UNIBEN Journal
              of Humanities
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="hover:text-[#7A0019]">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-[#7A0019]">
                Terms of Use
              </Link>
              <Link href="#" className="hover:text-[#7A0019]">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </footer>
      );
    }