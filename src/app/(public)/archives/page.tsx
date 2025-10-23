"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  BookOpen,
  FileText,
  Search,
  Download,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Issue {
  volume: number;
  issue: number;
  year: number;
  publishDate: string;
  articleCount: number;
  coverImage: string;
  doi: string;
  featured: boolean;
}

export default function ArchivesPage() {
  const [expandedYear, setExpandedYear] = useState<number | null>(2025);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterYear, setFilterYear] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const issues: Issue[] = [
    {
      volume: 1,
      issue: 1,
      year: 2025,
      publishDate: "March 2025",
      articleCount: 8,
      coverImage: "/issue-cover.png",
      doi: "10.1234/ubjh.v1i1",
      featured: true,
    },
  ];

  const issuesByYear = issues.reduce((acc, issue) => {
    if (!acc[issue.year]) {
      acc[issue.year] = [];
    }
    acc[issue.year].push(issue);
    return acc;
  }, {} as Record<number, Issue[]>);

  const years = Object.keys(issuesByYear)
    .map(Number)
    .sort((a, b) => b - a);

  const toggleYear = (year: number) => {
    setExpandedYear(expandedYear === year ? null : year);
  };

  const articleTypes = ["all", "Research Article", "Review Article", "Book Review"];

  return (
    <div className="min-h-screen bg-white">
      <Header/>

      <section className="bg-gradient-to-br from-[#7A0019] to-[#5A0A1A] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <BookOpen className="h-4 w-4" />
              <span className="text-sm font-semibold">Browse All Issues</span>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight font-serif">
              Journal Archives
            </h1>
            <p className="text-xl text-[#FFE9EE] leading-relaxed">
              Explore our complete collection of published research in the
              humanities
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#FAF7F8] border-b-2 border-[#EAD3D9] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search articles by title, author, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 border-2 border-[#EAD3D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A0019]"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            <div className="flex gap-3">
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="px-4 py-3 border-2 border-[#EAD3D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A0019] font-medium"
              >
                <option value="all">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border-2 border-[#EAD3D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A0019] font-medium"
              >
                {articleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "all" ? "All Types" : type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {years.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                No Issues Published Yet
              </h3>
              <p className="text-gray-600">
                Volume 1, Issue 1 will be published soon. Check back later!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {years.map((year) => (
                <div
                  key={year}
                  className="bg-white border-2 border-[#EAD3D9] rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleYear(year)}
                    className="w-full flex items-center justify-between p-6 hover:bg-[#FAF7F8] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#7A0019] rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {issuesByYear[year].length}
                      </div>
                      <div className="text-left">
                        <h2 className="text-2xl font-bold text-[#212121]">
                          {year}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {issuesByYear[year].length} issue
                          {issuesByYear[year].length !== 1 ? "s" : ""} published
                        </p>
                      </div>
                    </div>
                    {expandedYear === year ? (
                      <ChevronUp className="h-6 w-6 text-gray-600" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-gray-600" />
                    )}
                  </button>

                  {expandedYear === year && (
                    <div className="border-t-2 border-[#EAD3D9] p-4 sm:p-6">
                    <div className="space-y-4">
                      {issuesByYear[year].map((issue) => (
                        <Link
                          key={`${issue.volume}-${issue.issue}`}
                          href={`/current-issue`}
                          className="group flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white border-2 border-[#EAD3D9] rounded-xl overflow-hidden hover:shadow-xl hover:border-[#7A0019] transition-all p-4"
                        >
                          <div className="relative w-full sm:w-32 h-56 sm:h-48 flex-shrink-0">
                            <Image
                              src={issue.coverImage}
                              alt={`Volume ${issue.volume}, Issue ${issue.issue}`}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                              <h3 className="text-lg sm:text-xl font-bold text-[#212121] group-hover:text-[#7A0019] transition-colors">
                                Volume {issue.volume}, Issue {issue.issue} ({issue.year})
                              </h3>
                              {issue.featured && (
                                <span className="inline-flex items-center px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
                                  CURRENT
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 mb-3 text-sm sm:text-base">
                              Published: {issue.publishDate}
                            </p>
                            <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-gray-600 mb-3">
                              <span className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                {issue.articleCount} articles
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {issue.publishDate}
                              </span>
                            </div>
                            <div className="text-xs font-mono text-gray-500 mb-4">
                              DOI: {issue.doi}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <span className="inline-flex items-center justify-center gap-2 bg-[#7A0019] text-white px-4 py-2 rounded-lg font-semibold text-sm">
                                <BookOpen className="h-4 w-4" />
                                View Issue
                              </span>
                              <span className="inline-flex items-center justify-center gap-2 border-2 border-[#7A0019] text-[#7A0019] px-4 py-2 rounded-lg font-semibold text-sm">
                                <Download className="h-4 w-4" />
                                Download PDF
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 grid md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-[#7A0019] to-[#5A0A1A] text-white rounded-xl p-6 text-center">
              <div className="text-4xl font-bold mb-2">{issues.length}</div>
              <div className="text-sm text-[#FFE9EE]">
                Total Issues Published
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#7A0019] to-[#5A0A1A] text-white rounded-xl p-6 text-center">
              <div className="text-4xl font-bold mb-2">
                {issues.reduce((sum, issue) => sum + issue.articleCount, 0)}
              </div>
              <div className="text-sm text-[#FFE9EE]">Total Articles</div>
            </div>
            <div className="bg-gradient-to-br from-[#7A0019] to-[#5A0A1A] text-white rounded-xl p-6 text-center">
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-sm text-[#FFE9EE]">Open Access</div>
            </div>
            <div className="bg-gradient-to-br from-[#7A0019] to-[#5A0A1A] text-white rounded-xl p-6 text-center">
              <div className="text-4xl font-bold mb-2">{years.length}</div>
              <div className="text-sm text-[#FFE9EE]">Years Active</div>
            </div>
          </div>

          <div className="mt-12 bg-[#FAF7F8] border-2 border-[#EAD3D9] rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-[#7A0019] mb-4">
              Can&apos;t Find What You&apos;re Looking For?
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Use our advanced search to filter articles by author, keyword,
              publication date, or article type across all issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 bg-[#7A0019] text-white px-8 py-3 rounded-lg hover:bg-[#5A0A1A] transition-colors font-semibold"
              >
                <Search className="h-5 w-5" />
                Advanced Search
              </Link>
              <Link
                href="/for-authors"
                className="inline-flex items-center gap-2 border-2 border-[#7A0019] text-[#7A0019] px-8 py-3 rounded-lg hover:bg-[#FFE9EE] transition-colors font-semibold"
              >
                <FileText className="h-5 w-5" />
                Submit Your Research
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}
