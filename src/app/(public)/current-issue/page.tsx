// src/app/current-issue/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  Download,
  BookOpen,
  Share2,
  Mail,
  Calendar,
  Users,
  Filter,
  ExternalLink,
  Eye,
  Quote,
} from "lucide-react";
import Header from "@/components/Header";

interface Article {
  id: string;
  title: string;
  authors: string[];
  affiliations: string[];
  abstract: string;
  keywords: string[];
  doi: string;
  pages: string;
  publishDate: string;
  articleType: string;
  views: number;
  downloads: number;
  coverPhoto?: string;
}

export default function CurrentIssuePage() {
  const [filterType, setFilterType] = useState<string>("all");
  // Mock data for current issue
  const issueData = {
    volume: 1,
    issue: 1,
    year: 2025,
    publishDate: "March 2025",
    doi: "10.1234/ubjh.v1i1",
    coverImage: "/issue-cover.png",
    totalArticles: 8,
    totalPages: 156,
  };

  const articles: Article[] = [
    {
      id: "001",
      title:
        "Decolonizing Legal Education in West Africa: A Critical Analysis of Pedagogical Approaches",
      authors: ["Afolabi O. Johnson", "Chinwe M. Okeke"],
      affiliations: [
        "University of Benin",
        "University of Lagos"
      ],
      abstract:
        "This study examines the persistence of colonial frameworks in contemporary legal education across West African universities and proposes context-driven pedagogical reforms that center African jurisprudence, customary law, and indigenous legal systems. Through comparative analysis of curricula in Nigeria, Ghana, and Senegal, we demonstrate how Eurocentric approaches continue to marginalize local legal traditions.",
      keywords: [
        "decolonization",
        "legal education",
        "West Africa",
        "pedagogy",
        "jurisprudence",
      ],
      doi: "10.1234/ubjh.2025.0001",
      pages: "1-18",
      publishDate: "2025-03-15",
      articleType: "Research Article",
      views: 342,
      downloads: 89,
    },
    {
      id: "002",
      title:
        "Environmental Humanities and Climate Justice: Perspectives from the Niger Delta",
      authors: ["Ngozi F. Adekunle", "Emmanuel I. Okonkwo", "Sarah T. Benson"],
      affiliations: [
        "University of Benin",
        "University of Port Harcourt",
        "Delta State University"
      ],
      abstract:
        "Drawing on interdisciplinary scholarship, this review explores the intersection of environmental degradation, cultural memory, and climate justice advocacy in Nigeria's Niger Delta region. We analyze how local communities employ storytelling, visual arts, and cultural practices to document ecological harm and demand accountability from extractive industries.",
      keywords: [
        "environmental humanities",
        "climate justice",
        "Niger Delta",
        "cultural memory",
        "extractive industries",
      ],
      doi: "10.1234/ubjh.2025.0002",
      pages: "19-41",
      publishDate: "2025-03-15",
      articleType: "Review Article",
      views: 428,
      downloads: 112,
    },
    {
      id: "003",
      title:
        "Oral Traditions and Historical Memory in Edo Kingdom: Reassessing the Benin Expedition of 1897",
      authors: ["Osazuwa E. Omoregie"],
      affiliations: ["University of Benin"],
      abstract:
        "This article revisits the 1897 British punitive expedition against Benin Kingdom through the lens of oral traditions and indigenous historical narratives. By privileging Edo perspectives often marginalized in colonial historiography, we offer a counter-narrative that centers African agency, resistance, and cultural resilience in the face of imperial violence.",
      keywords: [
        "oral traditions",
        "Benin Kingdom",
        "colonial history",
        "memory studies",
        "decolonial history",
      ],
      doi: "10.1234/ubjh.2025.0003",
      pages: "42-63",
      publishDate: "2025-03-15",
      articleType: "Research Article",
      views: 567,
      downloads: 145,
      coverPhoto: "/benin-history.png",
    },
    {
      id: "004",
      title:
        "Language Politics and Identity Construction in Postcolonial Nigeria",
      authors: ["Amaka C. Nwankwo", "Ibrahim K. Suleiman"],
      affiliations: ["University of Benin", "Ahmadu Bello University"],
      abstract:
        "This study investigates how language policies in postcolonial Nigeria shape ethnic identity, political participation, and social inclusion. Through sociolinguistic analysis and ethnographic fieldwork, we examine tensions between English as lingua franca and indigenous language preservation efforts, proposing a multilingual framework for inclusive national development.",
      keywords: [
        "language politics",
        "postcolonial Nigeria",
        "identity",
        "multilingualism",
        "language policy",
      ],
      doi: "10.1234/ubjh.2025.0004",
      pages: "64-85",
      publishDate: "2025-03-15",
      articleType: "Research Article",
      views: 289,
      downloads: 76,
    },
    {
      id: "005",
      title:
        "Ubuntu Philosophy and Contemporary African Ethics: A Reconstructive Approach",
      authors: ["Chukwudi A. Mbah"],
      affiliations: ["University of Benin"],
      abstract:
        "This philosophical essay reconstructs Ubuntu philosophy as a foundation for contemporary African ethics. Moving beyond romanticized interpretations, we engage critically with Ubuntu's communitarian principles to address modern ethical dilemmas including human rights, environmental sustainability, and digital ethics in African contexts.",
      keywords: [
        "Ubuntu philosophy",
        "African ethics",
        "communitarianism",
        "moral philosophy",
        "African philosophy",
      ],
      doi: "10.1234/ubjh.2025.0005",
      pages: "86-104",
      publishDate: "2025-03-15",
      articleType: "Research Article",
      views: 412,
      downloads: 98,
    },
    {
      id: "006",
      title:
        "Performance Art and Social Protest in Contemporary Lagos",
      authors: ["Funmilayo R. Adeyemi"],
      affiliations: ["University of Lagos"],
      abstract:
        "This article examines how performance artists in Lagos deploy their craft as tools of social commentary and political protest. Through ethnographic observation and artist interviews conducted during the #EndSARS movement, we analyze how performance art creates counter-public spaces for youth activism and democratic expression.",
      keywords: [
        "performance art",
        "social protest",
        "Lagos",
        "EndSARS",
        "youth activism",
      ],
      doi: "10.1234/ubjh.2025.0006",
      pages: "105-126",
      publishDate: "2025-03-15",
      articleType: "Research Article",
      views: 623,
      downloads: 187,
    },
    {
      id: "007",
      title:
        "Gender and Land Rights in Customary Law: A Case Study of Edo State",
      authors: ["Blessing O. Igbinovia", "Grace N. Ekhator"],
      affiliations: ["University of Benin", "University of Benin"],
      abstract:
        "This study investigates how customary land tenure systems in Edo State, Nigeria, perpetuate gender inequalities in land ownership and inheritance. Through legal analysis and qualitative interviews with women farmers and traditional leaders, we document discriminatory practices and propose reform pathways that harmonize customary law with constitutional gender equality provisions.",
      keywords: [
        "gender",
        "land rights",
        "customary law",
        "Edo State",
        "women's rights",
      ],
      doi: "10.1234/ubjh.2025.0007",
      pages: "127-145",
      publishDate: "2025-03-15",
      articleType: "Research Article",
      views: 298,
      downloads: 84,
    },
    {
      id: "008",
      title:
        "Book Review: 'African Literatures and the CIA' by Caroline Davis",
      authors: ["Obinna J. Okechukwu"],
      affiliations: ["University of Ibadan"],
      abstract:
        "A critical review of Caroline Davis's groundbreaking study on Cold War cultural politics and African literary production. This review assesses Davis's archival research on covert U.S. influence in African publishing and discusses implications for understanding postcolonial African literary history.",
      keywords: [
        "book review",
        "African literature",
        "Cold War",
        "cultural politics",
        "publishing history",
      ],
      doi: "10.1234/ubjh.2025.0008",
      pages: "146-156",
      publishDate: "2025-03-15",
      articleType: "Book Review",
      views: 178,
      downloads: 42,
    },
  ];

  const filteredArticles =
    filterType === "all"
      ? articles
      : articles.filter((article) => article.articleType === filterType);

  const articleTypes = [
    "all",
    "Research Article",
    "Review Article",
    "Book Review",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
     <Header/>
      {/* Issue Header */}
      <section className="bg-gradient-to-br from-[#7A0019] to-[#5A0A1A] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Issue Cover */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                <Image
                  src={issueData.coverImage}
                  alt="Volume 1, Issue 1 Cover"
                  width={400}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Issue Information */}
            <div className="md:col-span-2">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <BookOpen className="h-4 w-4" />
                <span className="text-sm font-semibold">Current Issue</span>
              </div>
              <h1 className="text-4xl font-bold mb-4 font-serif">
                Volume {issueData.volume}, Issue {issueData.issue} ({issueData.year})
              </h1>
              <p className="text-xl text-[#FFE9EE] mb-6">
                Published: {issueData.publishDate}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">
                    {issueData.totalArticles}
                  </div>
                  <div className="text-sm text-[#FFE9EE]">Articles</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">
                    {issueData.totalPages}
                  </div>
                  <div className="text-sm text-[#FFE9EE]">Pages</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">100%</div>
                  <div className="text-sm text-[#FFE9EE]">Open Access</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">
                    {articles.reduce((sum, a) => sum + a.views, 0)}
                  </div>
                  <div className="text-sm text-[#FFE9EE]">Total Views</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#7A0019] transition-all">
                  <Share2 className="h-5 w-5" />
                  Share Issue
                </button>
                <button className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#7A0019] transition-all">
                  <Quote className="h-5 w-5" />
                  Cite Issue
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm text-[#FFE9EE] mb-2">
                  <strong>Issue DOI:</strong> {issueData.doi}
                </p>
                <p className="text-sm text-[#FFE9EE]">
                  <strong>ISSN:</strong> eISSN: 2XXX-XXXX (Online)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-[#FAF7F8] border-b-2 border-[#EAD3D9] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#212121] mb-1">
                Table of Contents
              </h2>
              <p className="text-sm text-gray-600">
                Showing {filteredArticles.length} of {articles.length} articles
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-gray-600" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border-2 border-[#EAD3D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A0019] font-medium"
              >
                {articleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "all" ? "All Article Types" : type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Articles List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {filteredArticles.map((article, index) => (
              <article
                key={article.id}
                className="bg-white border-2 border-[#EAD3D9] rounded-xl overflow-hidden hover:shadow-xl hover:border-[#7A0019] transition-all group"
              >
                <div className="p-8">
                  {/* Article Header */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="inline-flex items-center px-3 py-1 bg-[#FFE9EE] border border-[#E6B6C2] text-[#5A0A1A] rounded-full text-xs font-bold uppercase">
                      {article.articleType}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                      OPEN ACCESS
                    </span>
                    <span className="text-sm text-gray-500">
                      Pages {article.pages}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-[#212121] mb-4 group-hover:text-[#7A0019] transition-colors font-serif leading-tight">
                    {index + 1}. {article.title}
                  </h3>

                  {/* Authors */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-gray-700 mb-2">
                      <Users className="h-4 w-4" />
                      <span className="font-semibold">
                        {article.authors.join(", ")}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 ml-6">
                      {article.affiliations.join(" • ")}
                    </div>
                  </div>

                  {/* Abstract */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-[#212121] mb-2">
                      Abstract
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {article.abstract}
                    </p>
                  </div>

                  {/* Keywords */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-[#212121] mb-2 text-sm">
                      Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {article.keywords.map((keyword, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#EAD3D9]">
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Published: {article.publishDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>{article.views} views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        <span>{article.downloads} downloads</span>
                      </div>
                    </div>
                    <div className="text-sm font-mono text-gray-600">
                      DOI: {article.doi}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-6">
                    <Link
                      href={`/articles/${article.id}`}
                      className="inline-flex items-center gap-2 bg-[#7A0019] text-white px-6 py-2 rounded-lg hover:bg-[#5A0A1A] transition-colors font-semibold"
                    >
                      <BookOpen className="h-4 w-4" />
                      Read Full Article
                    </Link>
                    <button className="inline-flex items-center gap-2 border-2 border-[#7A0019] text-[#7A0019] px-6 py-2 rounded-lg hover:bg-[#FFE9EE] transition-colors font-semibold">
                      <FileText className="h-4 w-4" />
                      PDF
                    </button>
                    <button className="inline-flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                      <Quote className="h-4 w-4" />
                      Cite
                    </button>
                    <button className="inline-flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                      <Share2 className="h-4 w-4" />
                      Share
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Issue Information Section */}
      <section className="bg-[#FAF7F8] py-12 border-t-2 border-[#EAD3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border-2 border-[#EAD3D9] rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#7A0019] mb-4 flex items-center gap-2">
                <Mail className="h-6 w-6" />
                Subscribe to Alerts
              </h3>
              <p className="text-gray-700 mb-4">
                Get notified when new issues are published
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border-2 border-[#EAD3D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A0019]"
                />
                <button className="bg-[#7A0019] text-white px-6 py-2 rounded-lg hover:bg-[#5A0A1A] transition-colors font-semibold">
                  Subscribe
                </button>
              </div>
            </div>

            <div className="bg-white border-2 border-[#EAD3D9] rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#7A0019] mb-4">
                Citation Information
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Journal Title:</strong> UNIBEN Journal of Humanities
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Volume/Issue:</strong> {issueData.volume}(
                {issueData.issue})
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Year:</strong> {issueData.year}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Publisher:</strong> University of Benin
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/archives"
              className="inline-flex items-center gap-2 text-[#7A0019] hover:text-[#5A0A1A] font-semibold text-lg"
            >
              View All Past Issues
              <ExternalLink className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

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