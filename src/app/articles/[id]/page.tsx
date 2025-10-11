"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Download,
  Share2,
  Mail,
  Quote,
  FileText,
  Calendar,
  Eye,
  BookOpen,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
  Globe,
  Printer,
} from "lucide-react";

export default function ArticleDetailPage() {
  const [activeSection, setActiveSection] = useState("abstract");
  const [copiedDOI, setCopiedDOI] = useState(false);
  const [citationFormat, setCitationFormat] = useState("APA");

  // Mock article data
  const article = {
    id: "001",
    title:
      "Decolonizing Legal Education in West Africa: A Critical Analysis of Pedagogical Approaches",
    authors: [
      {
        name: "Afolabi O. Johnson",
        affiliation: "Department of Law, University of Benin, Nigeria",
        email: "afolabi.johnson@uniben.edu",
        orcid: "0000-0001-2345-6789",
        corresponding: true,
      },
      {
        name: "Chinwe M. Okeke",
        affiliation: "Faculty of Law, University of Lagos, Nigeria",
        orcid: "0000-0002-3456-7890",
      },
    ],
    abstract:
      "This study examines the persistence of colonial frameworks in contemporary legal education across West African universities and proposes context-driven pedagogical reforms that center African jurisprudence, customary law, and indigenous legal systems. Through comparative analysis of curricula in Nigeria, Ghana, and Senegal, we demonstrate how Eurocentric approaches continue to marginalize local legal traditions. Drawing on decolonial theory and interviews with law educators, we identify key barriers to curriculum reform and propose actionable strategies for integrating African legal philosophies into mainstream legal education. Our findings suggest that decolonizing legal pedagogy requires not only curriculum revision but also institutional transformation, including the recruitment of diverse faculty, development of local case law databases, and partnerships with traditional legal institutions.",
    keywords: [
      "decolonization",
      "legal education",
      "West Africa",
      "pedagogy",
      "jurisprudence",
      "customary law",
      "curriculum reform",
    ],
    doi: "10.1234/ubjh.2025.0001",
    volume: 1,
    issue: 1,
    year: 2025,
    pages: "1-18",
    articleType: "Research Article",
    received: "2024-12-15",
    accepted: "2025-02-10",
    published: "2025-03-15",
    views: 342,
    downloads: 89,
    citations: 0,
    license: "CC BY 4.0",
    funding:
      "This research was supported by the TETFund National Research Fund (Grant No. NRF/2024/LAW/001).",
    conflictOfInterest:
      "The authors declare no conflicts of interest.",
    dataAvailability:
      "Interview transcripts and curriculum documents are available upon reasonable request to the corresponding author, subject to ethical approval and institutional permissions.",
  };

  const citations = {
    APA: `Johnson, A. O., & Okeke, C. M. (2025). Decolonizing Legal Education in West Africa: A Critical Analysis of Pedagogical Approaches. UNIBEN Journal of Humanities, 1(1), 1-18. https://doi.org/${article.doi}`,
    MLA: `Johnson, Afolabi O., and Chinwe M. Okeke. "Decolonizing Legal Education in West Africa: A Critical Analysis of Pedagogical Approaches." UNIBEN Journal of Humanities, vol. 1, no. 1, 2025, pp. 1-18.`,
    Chicago: `Johnson, Afolabi O., and Chinwe M. Okeke. "Decolonizing Legal Education in West Africa: A Critical Analysis of Pedagogical Approaches." UNIBEN Journal of Humanities 1, no. 1 (2025): 1-18. https://doi.org/${article.doi}.`,
    Harvard: `Johnson, A.O. and Okeke, C.M., 2025. Decolonizing Legal Education in West Africa: A Critical Analysis of Pedagogical Approaches. UNIBEN Journal of Humanities, 1(1), pp.1-18.`,
  };

  const relatedArticles = [
    {
      id: "002",
      title:
        "Environmental Humanities and Climate Justice: Perspectives from the Niger Delta",
      authors: ["Ngozi F. Adekunle", "Emmanuel I. Okonkwo"],
    },
    {
      id: "004",
      title:
        "Language Politics and Identity Construction in Postcolonial Nigeria",
      authors: ["Amaka C. Nwankwo", "Ibrahim K. Suleiman"],
    },
  ];

  const copyDOI = () => {
    navigator.clipboard.writeText(`https://doi.org/${article.doi}`);
    setCopiedDOI(true);
    setTimeout(() => setCopiedDOI(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
                <p className="text-sm text-[#FFE9EE] font-medium">
                  Article View
                </p>
              </div>
            </div>
            <Link
              href="/current-issue"
              className="text-white hover:text-[#FFE9EE] font-semibold"
            >
              ← Back to Issue
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="bg-[#FAF7F8] border-b border-[#EAD3D9] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link
              href="/"
              className="hover:text-[#7A0019]"
            >
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href="/current-issue"
              className="hover:text-[#7A0019]"
            >
              Volume {article.volume}, Issue {article.issue} ({article.year})
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">Article</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Article Content */}
          <div className="lg:col-span-2">
            {/* Article Header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-flex items-center px-3 py-1 bg-[#FFE9EE] border border-[#E6B6C2] text-[#5A0A1A] rounded-full text-xs font-bold uppercase">
                  {article.articleType}
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                  OPEN ACCESS
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                  PEER REVIEWED
                </span>
              </div>

              <h1 className="text-4xl font-bold text-[#212121] mb-6 leading-tight font-serif">
                {article.title}
              </h1>

              {/* Authors */}
              <div className="mb-6">
                {article.authors.map((author, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 mb-3 flex-wrap"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#212121]">
                          {author.name}
                          {author.corresponding && (
                            <sup className="text-[#7A0019]">*</sup>
                          )}
                        </span>
                        {author.orcid && (
                          <a
                            href={`https://orcid.org/${author.orcid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#7A0019] hover:text-[#5A0A1A]"
                            aria-label="ORCID"
                          >
                            <Globe className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{author.affiliation}</p>
                      {author.corresponding && author.email && (
                        <p className="text-sm text-gray-600">
                          <sup className="text-[#7A0019]">*</sup> Corresponding
                          author:{" "}
                          <a
                            href={`mailto:${author.email}`}
                            className="text-[#7A0019] hover:underline"
                          >
                            {author.email}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Publication Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b-2 border-[#EAD3D9]">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    <strong>Received:</strong> {article.received}
                  </span>
                </div>
                <span>|</span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    <strong>Accepted:</strong> {article.accepted}
                  </span>
                </div>
                <span>|</span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    <strong>Published:</strong> {article.published}
                  </span>
                </div>
              </div>

              {/* DOI */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm font-semibold text-gray-700">
                  DOI:
                </span>
                <code className="px-3 py-1 bg-gray-100 rounded font-mono text-sm">
                  {article.doi}
                </code>
                <button
                  onClick={copyDOI}
                  className="inline-flex items-center gap-1 text-[#7A0019] hover:text-[#5A0A1A] text-sm font-semibold"
                  aria-label="Copy DOI"
                >
                  {copiedDOI ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-8">
                <button className="inline-flex items-center gap-2 bg-[#7A0019] text-white px-6 py-3 rounded-lg hover:bg-[#5A0A1A] transition-colors font-semibold">
                  <Download className="h-5 w-5" />
                  Download PDF
                </button>
                <button className="inline-flex items-center gap-2 border-2 border-[#7A0019] text-[#7A0019] px-6 py-3 rounded-lg hover:bg-[#FFE9EE] transition-colors font-semibold">
                  <Quote className="h-5 w-5" />
                  Cite Article
                </button>
                <button className="inline-flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                  <Share2 className="h-5 w-5" />
                  Share
                </button>
                <button className="inline-flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                  <Mail className="h-5 w-5" />
                  Email
                </button>
                <button className="inline-flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                  <Printer className="h-5 w-5" />
                  Print
                </button>
              </div>
            </div>

            {/* Abstract */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#7A0019] mb-4 font-serif">
                Abstract
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {article.abstract}
              </p>
              <div className="bg-[#FAF7F8] rounded-lg p-4">
                <h3 className="font-semibold text-[#212121] mb-2">Keywords:</h3>
                <div className="flex flex-wrap gap-2">
                  {article.keywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white border border-[#EAD3D9] text-gray-700 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Article Sections Navigation */}
            <section className="mb-8">
              <div className="bg-white border-2 border-[#EAD3D9] rounded-xl p-6">
                <h2 className="text-xl font-bold text-[#7A0019] mb-4">
                  Article Sections
                </h2>
                <nav className="space-y-2">
                  {[
                    "Introduction",
                    "Literature Review",
                    "Methodology",
                    "Findings",
                    "Discussion",
                    "Conclusion",
                    "References",
                  ].map((section, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left px-4 py-2 rounded-lg hover:bg-[#FAF7F8] text-gray-700 hover:text-[#7A0019] transition-colors flex items-center justify-between group"
                    >
                      <span>{section}</span>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </nav>
                <div className="mt-6 pt-6 border-t border-[#EAD3D9]">
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Full article available in PDF format</strong>
                  </p>
                  <button className="inline-flex items-center gap-2 bg-[#7A0019] text-white px-6 py-2 rounded-lg hover:bg-[#5A0A1A] transition-colors font-semibold text-sm">
                    <FileText className="h-4 w-4" />
                    View Full Text PDF
                  </button>
                </div>
              </div>
            </section>

            {/* How to Cite */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#7A0019] mb-4 font-serif">
                How to Cite This Article
              </h2>
              <div className="bg-white border-2 border-[#EAD3D9] rounded-xl p-6">
                <div className="flex gap-2 mb-4">
                  {["APA", "MLA", "Chicago", "Harvard"].map((format) => (
                    <button
                      key={format}
                      onClick={() => setCitationFormat(format)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                        citationFormat === format
                          ? "bg-[#7A0019] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
                <div className="bg-[#FAF7F8] rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700 font-mono leading-relaxed">
                    {citations[citationFormat as keyof typeof citations]}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="inline-flex items-center gap-2 bg-[#7A0019] text-white px-4 py-2 rounded-lg hover:bg-[#5A0A1A] transition-colors font-semibold text-sm">
                    <Copy className="h-4 w-4" />
                    Copy Citation
                  </button>
                  <button className="inline-flex items-center gap-2 border-2 border-[#7A0019] text-[#7A0019] px-4 py-2 rounded-lg hover:bg-[#FFE9EE] transition-colors font-semibold text-sm">
                    <Download className="h-4 w-4" />
                    Export BibTeX
                  </button>
                  <button className="inline-flex items-center gap-2 border-2 border-[#7A0019] text-[#7A0019] px-4 py-2 rounded-lg hover:bg-[#FFE9EE] transition-colors font-semibold text-sm">
                    <Download className="h-4 w-4" />
                    Export RIS
                  </button>
                </div>
              </div>
            </section>

            {/* Declarations */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#7A0019] mb-4 font-serif">
                Declarations
              </h2>
              <div className="space-y-4">
                <div className="bg-white border-2 border-[#EAD3D9] rounded-xl p-6">
                  <h3 className="font-semibold text-[#212121] mb-2">
                    Funding
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {article.funding}
                  </p>
                </div>
                <div className="bg-white border-2 border-[#EAD3D9] rounded-xl p-6">
                  <h3 className="font-semibold text-[#212121] mb-2">
                    Conflict of Interest
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {article.conflictOfInterest}
                  </p>
                </div>
                <div className="bg-white border-2 border-[#EAD3D9] rounded-xl p-6">
                  <h3 className="font-semibold text-[#212121] mb-2">
                    Data Availability
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {article.dataAvailability}
                  </p>
                </div>
              </div>
            </section>

            {/* Copyright Notice */}
            <section className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <BookOpen className="h-8 w-8 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-green-900 mb-2">
                    Open Access License
                  </h3>
                  <p className="text-sm text-gray-700 mb-3">
                    This is an open access article distributed under the terms
                    of the <strong>Creative Commons Attribution License (CC BY
                    4.0)</strong>, which permits unrestricted use, distribution,
                    and reproduction in any medium, provided the original work
                    is properly cited.
                  </p>
                  <a
                    href="https://creativecommons.org/licenses/by/4.0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-green-700 hover:text-green-900 font-semibold text-sm"
                  >
                    Learn more about CC BY 4.0
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">

              {/* Related Articles */}
              <div className="bg-[#FAF7F8] border-2 border-[#EAD3D9] rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#7A0019] mb-4">
                  Related Articles
                </h3>
                <div className="space-y-4">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.id}
                      href={`/articles/${related.id}`}
                      className="block group"
                    >
                      <h4 className="text-sm font-semibold text-[#212121] group-hover:text-[#7A0019] transition-colors mb-1 leading-tight">
                        {related.title}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {related.authors.join(", ")}
                      </p>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/current-issue"
                  className="inline-flex items-center gap-1 text-[#7A0019] hover:text-[#5A0A1A] font-semibold text-sm mt-4"
                >
                  View all articles
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Issue Info */}
              <div className="bg-white border-2 border-[#EAD3D9] rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#7A0019] mb-4">
                  Published In
                </h3>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Journal:</strong> UNIBEN Journal of Humanities
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Volume/Issue:</strong> {article.volume}(
                    {article.issue})
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Year:</strong> {article.year}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Pages:</strong> {article.pages}
                  </p>
                </div>
                <Link
                  href="/current-issue"
                  className="inline-flex items-center gap-2 bg-[#7A0019] text-white px-4 py-2 rounded-lg hover:bg-[#5A0A1A] transition-colors font-semibold text-sm w-full justify-center"
                >
                  <BookOpen className="h-4 w-4" />
                  View Full Issue
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#FAF7F8] border-t border-[#EAD3D9] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>
              © {new Date().getFullYear()} University of Benin — UNIBEN Journal
              of Humanities
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link
                href="/about"
                className="hover:text-[#7A0019]"
              >
                About
              </Link>
              <Link
                href="/policies"
                className="hover:text-[#7A0019]"
              >
                Policies
              </Link>
              <Link
                href="/contact"
                className="hover:text-[#7A0019]"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}