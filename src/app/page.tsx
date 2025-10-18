"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Download,
  FileText,
  CheckCircle,
  Clock,
  Shield,
  Globe,
  Mail,
  ExternalLink,
  ChevronRight,
  Award,
  Search,
} from "lucide-react";

export default function HumanitiesJournalHome() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="bg-[#7A0019] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center">
                {/* Placeholder for UNIBEN logo */}
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
                <p className="text-sm text-[#FFE9EE] font-medium">
                  Diamond Open Access
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link
                href=""
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

        {/* Secondary Navigation */}
        <div className="bg-[#F2E9EC] border-b border-[#EAD3D9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-6 text-sm">
                <Link
                  href="/editorial-board"
                  className="text-[#7A0019] hover:text-[#5A0A1A] font-medium transition-colors"
                >
                  Editorial Board
                </Link>
                <Link
                  href="/policies"
                  className="text-[#7A0019] hover:text-[#5A0A1A] font-medium transition-colors"
                >
                  Policies
                </Link>
                <Link
                  href="/contact"
                  className="text-[#7A0019] hover:text-[#5A0A1A] font-medium transition-colors"
                >
                  Contact
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 px-4 py-2 pl-10 rounded-full border border-[#5A0A1A] focus:outline-none focus:ring-2 focus:ring-[#7A0019] text-black text-sm"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#7A0019] to-[#5A0A1A] text-white py-20">
        <div className="absolute inset-0 opacity-10">
          {/* Placeholder for subtle pattern/texture */}
          <Image
            src="/academic-pattern.png"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Award className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Volume 1, Issue 1 (2025) — Now Open for Submissions
              </span>
            </div>
            <h2 className="text-5xl font-bold mb-6 leading-tight font-serif">
              Advancing African and Global Perspectives in the Humanities
            </h2>
            <p className="text-xl mb-8 text-[#FFE9EE] leading-relaxed">
              Publishing peer-reviewed scholarship in law & society, history,
              languages, culture, philosophy, arts, and environmental
              humanities.
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span className="font-semibold">Diamond Open Access</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Clock className="h-5 w-5 text-blue-300" />
                <span className="font-semibold">3–6 Week Review</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Shield className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">Crossref DOIs</span>
              </div>
            </div>
            <div className="flex gap-4">
              <Link
                href="/submission"
                className="inline-flex items-center gap-2 bg-white text-[#7A0019] px-8 py-4 rounded-full font-bold hover:bg-[#FFE9EE] transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <FileText className="h-5 w-5" />
                Submit Your Manuscript
              </Link>
              <Link
                href="/current-issue"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-[#7A0019] transition-all"
              >
                <BookOpen className="h-5 w-5" />
                Browse Current Issue
              </Link>
            </div>
          </div>
        </div>
      </section>

     

      {/* Current Issue Highlight */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-[#7A0019] mb-2 font-serif">
                Current Issue
              </h2>
              <p className="text-gray-600">Volume 1, Issue 1 (2025)</p>
            </div>
            <Link
              href="/current-issue"
              className="text-[#7A0019] font-semibold hover:text-[#5A0A1A] flex items-center gap-2"
            >
              View Full Issue
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Article Card 1 */}
            <article className="bg-white border-2 border-[#EAD3D9] rounded-xl p-6 hover:shadow-xl hover:border-[#7A0019] transition-all group">
              <div className="flex gap-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 bg-[#FFE9EE] border border-[#E6B6C2] text-[#5A0A1A] rounded-full text-xs font-bold">
                  RESEARCH ARTICLE
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-3 group-hover:text-[#7A0019] transition-colors font-serif">
                Decolonizing Legal Education in West Africa: A Critical
                Analysis of Pedagogical Approaches
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                Afolabi O. Johnson, Chinwe M. Okeke
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                This study examines the persistence of colonial frameworks in
                contemporary legal education across West African universities
                and proposes context-driven pedagogical reforms...
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>DOI: 10.1234/ubjh.2025.0001</span>
                <span>Vol 1 • 2025</span>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#7A0019] text-white rounded-lg hover:bg-[#5A0A1A] transition-colors text-sm font-semibold">
                  <FileText className="h-4 w-4" />
                  PDF
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold">
                  <Download className="h-4 w-4" />
                  Cite
                </button>
              </div>
            </article>

            {/* Article Card 2 */}
            <article className="bg-white border-2 border-[#EAD3D9] rounded-xl p-6 hover:shadow-xl hover:border-[#7A0019] transition-all group">
              <div className="flex gap-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 bg-[#FFE9EE] border border-[#E6B6C2] text-[#5A0A1A] rounded-full text-xs font-bold">
                  REVIEW ARTICLE
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-3 group-hover:text-[#7A0019] transition-colors font-serif">
                Environmental Humanities and Climate Justice: Perspectives from
                the Niger Delta
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                Ngozi F. Adekunle, Emmanuel I. Okonkwo, Sarah T. Benson
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Drawing on interdisciplinary scholarship, this review explores
                the intersection of environmental degradation, cultural memory,
                and climate justice advocacy in Nigeria&apos;s Niger Delta...
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>DOI: 10.1234/ubjh.2025.0002</span>
                <span>Vol 1 • 2025</span>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#7A0019] text-white rounded-lg hover:bg-[#5A0A1A] transition-colors text-sm font-semibold">
                  <FileText className="h-4 w-4" />
                  PDF
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold">
                  <Download className="h-4 w-4" />
                  Cite
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-[#FAF7F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#7A0019] mb-6 font-serif">
                About the Journal
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The <strong>UNIBEN Journal of Humanities</strong> publishes
                peer-reviewed scholarship with African and global perspectives
                in law & society, history, languages, culture, philosophy, arts,
                and environmental humanities.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                We welcome empirical, doctrinal, and decolonial approaches with
                policy relevance, committed to advancing knowledge that serves
                society and promotes justice, equity, and sustainable
                development.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-[#7A0019] font-semibold hover:text-[#5A0A1A] text-lg"
              >
                Learn More About Our Mission
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              {/* Placeholder for journal mission image */}
              <Image
                src="/humanities-research.png"
                alt="Humanities research and scholarship"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Publish With Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#7A0019] mb-4 font-serif">
              Why Publish With Us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join a growing community of scholars committed to rigorous,
              impactful, and accessible research
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#FFE9EE] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-[#7A0019]" />
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-2">
                No APCs
              </h3>
              <p className="text-gray-600">
                Diamond Open Access — completely free for authors and readers
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#FFE9EE] rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-10 w-10 text-[#7A0019]" />
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-2">
                Fast Review
              </h3>
              <p className="text-gray-600">
                Rigorous peer review with 3–6 week turnaround to first decision
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#FFE9EE] rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-10 w-10 text-[#7A0019]" />
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-2">
                Global Reach
              </h3>
              <p className="text-gray-600">
                Crossref DOIs, Google Scholar indexing, and wide distribution
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#FFE9EE] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-10 w-10 text-[#7A0019]" />
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-2">
                Preserved Forever
              </h3>
              <p className="text-gray-600">
                Long-term archiving via PKP PN ensures permanent accessibility
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Board Preview */}
      <section className="py-16 bg-[#FAF7F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-[#7A0019] mb-2 font-serif">
                Editorial Leadership
              </h2>
              <p className="text-gray-600">
                Distinguished scholars committed to excellence
              </p>
            </div>
            <Link
              href="/editorial-board"
              className="text-[#7A0019] font-semibold hover:text-[#5A0A1A] flex items-center gap-2"
            >
              View Full Board
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Editor-in-Chief Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-[#7A0019]">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4">
                {/* Placeholder for editor photo */}
                <Image
                  src="/editor-1.png"
                  alt="Editor in Chief"
                  width={96}
                  height={96}
                  className="rounded-full"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-[#7A0019] font-bold mb-1">
                  EDITOR-IN-CHIEF
                </p>
                <h3 className="text-lg font-bold text-[#212121] mb-1">
                  Prof. Adebayo M. Ogunleye
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Department of History & International Studies
                  <br />
                  University of Benin
                </p>
                <div className="flex justify-center gap-2">
                  <a
                    href="#"
                    className="text-[#7A0019] hover:text-[#5A0A1A]"
                    aria-label="ORCID"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="text-[#7A0019] hover:text-[#5A0A1A]"
                    aria-label="Email"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Associate Editor 1 */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-[#EAD3D9] hover:border-[#7A0019] transition-colors">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4">
                <Image
                  src="/editor-2.png"
                  alt="Associate Editor"
                  width={96}
                  height={96}
                  className="rounded-full"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-[#7A0019] font-bold mb-1">
                  ASSOCIATE EDITOR
                </p>
                <h3 className="text-lg font-bold text-[#212121] mb-1">
                  Dr. Chiamaka N. Eze
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Department of English & Literature
                  <br />
                  University of Benin
                </p>
                <div className="flex justify-center gap-2">
                  <a
                    href="#"
                    className="text-[#7A0019] hover:text-[#5A0A1A]"
                    aria-label="ORCID"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="text-[#7A0019] hover:text-[#5A0A1A]"
                    aria-label="Email"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Associate Editor 2 */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-[#EAD3D9] hover:border-[#7A0019] transition-colors">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4">
                <Image
                  src="/editor-3.png"
                  alt="Associate Editor"
                  width={96}
                  height={96}
                  className="rounded-full"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-[#7A0019] font-bold mb-1">
                  ASSOCIATE EDITOR
                </p>
                <h3 className="text-lg font-bold text-[#212121] mb-1">
                  Prof. Ibrahim K. Suleiman
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Faculty of Law
                  <br />
                  University of Benin
                </p>
                <div className="flex justify-center gap-2">
                  <a
                    href="#"
                    className="text-[#7A0019] hover:text-[#5A0A1A]"
                    aria-label="ORCID"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="text-[#7A0019] hover:text-[#5A0A1A]"
                    aria-label="Email"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Indexing & Trust Indicators */}
      <section className="py-12 bg-white border-t-2 border-[#EAD3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center text-sm text-gray-600 font-semibold mb-6">
            INDEXED & PRESERVED BY
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="h-16 w-32 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-gray-500 font-semibold">Google Scholar</span>
            </div>
            <div className="h-16 w-32 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-gray-500 font-semibold">Crossref</span>
            </div>
            <div className="h-16 w-32 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-gray-500 font-semibold">PKP PN</span>
            </div>
            <div className="h-16 w-32 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-gray-500 font-semibold">DOAJ (pending)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
    </div>
  );
}