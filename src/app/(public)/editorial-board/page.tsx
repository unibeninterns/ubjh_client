"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Award,
  Users,
  Globe,
} from "lucide-react";

interface EditorProfile {
  name: string;
  role: string;
  affiliation: string;
  department: string;
  bio: string;
  photo: string;
  orcid?: string;
  email?: string;
  specialization: string[];
}

export default function EditorialBoardPage() {
  const editorInChief: EditorProfile = {
    name: "Prof. Adebayo M. Ogunleye",
    role: "Editor-in-Chief",
    affiliation: "University of Benin",
    department: "Department of History & International Studies",
    bio: "Professor Ogunleye is a leading scholar in African political history and decolonization studies. His research focuses on nationalist movements, Pan-Africanism, and post-independence governance in West Africa. He has published extensively on Nigerian political development and serves as a consultant to several African governments on historical memory and reconciliation projects.",
    photo: "/editor-chief.png",
    orcid: "0000-0001-2345-6789",
    email: "adebayo.ogunleye@uniben.edu",
    specialization: [
      "African Political History",
      "Decolonization Studies",
      "Pan-Africanism",
    ],
  };

  const managingEditor: EditorProfile = {
    name: "Dr. Folake A. Williams",
    role: "Managing Editor",
    affiliation: "University of Benin",
    department: "Directorate of Research, Innovation & Development",
    bio: "Dr. Williams oversees the editorial operations of UNIBEN journals and coordinates between authors, reviewers, and the editorial team. With expertise in scholarly publishing and research administration, she ensures the journal maintains high standards of academic integrity and efficient workflow management.",
    photo: "/managing-editor.png",
    email: "folake.williams@uniben.edu",
    specialization: ["Scholarly Publishing", "Research Administration"],
  };

  const associateEditors: EditorProfile[] = [
    {
      name: "Dr. Chiamaka N. Eze",
      role: "Associate Editor",
      affiliation: "University of Benin",
      department: "Department of English & Literature",
      bio: "Specializes in postcolonial African literature, feminist literary criticism, and contemporary Nigerian fiction.",
      photo: "/editor-2.png",
      orcid: "0000-0002-3456-7890",
      email: "chiamaka.eze@uniben.edu",
      specialization: [
        "African Literature",
        "Feminist Criticism",
        "Postcolonial Studies",
      ],
    },
    {
      name: "Prof. Ibrahim K. Suleiman",
      role: "Associate Editor",
      affiliation: "University of Benin",
      department: "Faculty of Law",
      bio: "Expert in constitutional law, human rights, and customary legal systems in Nigeria with over 20 years of academic and legal practice experience.",
      photo: "/editor-3.png",
      orcid: "0000-0003-4567-8901",
      email: "ibrahim.suleiman@uniben.edu",
      specialization: [
        "Constitutional Law",
        "Human Rights",
        "Customary Law",
      ],
    },
    {
      name: "Dr. Ngozi F. Adekunle",
      role: "Associate Editor",
      affiliation: "University of Benin",
      department: "Department of Philosophy",
      bio: "Her research interests include African philosophy, environmental ethics, and indigenous knowledge systems.",
      photo: "/editor-4.png",
      email: "ngozi.adekunle@uniben.edu",
      specialization: [
        "African Philosophy",
        "Environmental Ethics",
        "Indigenous Knowledge",
      ],
    },
  ];

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
                  Editorial Board
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="text-white hover:text-[#FFE9EE] font-semibold"
            >
              ← Back to Journal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#7A0019] to-[#5A0A1A] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Users className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Leadership & Expertise
              </span>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight font-serif">
              Editorial Board
            </h1>
            <p className="text-xl text-[#FFE9EE] leading-relaxed">
              Distinguished scholars committed to advancing excellence in
              humanities research
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Editor-in-Chief */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#7A0019] mb-8 font-serif flex items-center gap-3">
              <Award className="h-8 w-8" />
              Editor-in-Chief
            </h2>
            <div className="bg-white border-4 border-[#7A0019] rounded-2xl p-8 shadow-xl">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <div className="relative w-48 h-48 mx-auto mb-4">
                    <Image
                      src={editorInChief.photo}
                      alt={editorInChief.name}
                      fill
                      className="rounded-full object-cover border-4 border-[#7A0019]"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-[#212121] mb-2">
                      {editorInChief.name}
                    </h3>
                    <p className="text-[#7A0019] font-semibold mb-2">
                      {editorInChief.role}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      {editorInChief.department}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      {editorInChief.affiliation}
                    </p>
                    <div className="flex justify-center gap-3">
                      {editorInChief.orcid && (
                        <a
                          href={`https://orcid.org/${editorInChief.orcid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#7A0019] hover:text-[#5A0A1A]"
                          aria-label="ORCID"
                        >
                          <Globe className="h-4 w-4" />
                          <span className="text-sm font-medium">ORCID</span>
                        </a>
                      )}
                      {editorInChief.email && (
                        <a
                          href={`mailto:${editorInChief.email}`}
                          className="inline-flex items-center gap-1 text-[#7A0019] hover:text-[#5A0A1A]"
                          aria-label="Email"
                        >
                          <Mail className="h-4 w-4" />
                          <span className="text-sm font-medium">Email</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-lg font-bold text-[#212121] mb-3">
                    Biography
                  </h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {editorInChief.bio}
                  </p>
                  <h4 className="text-lg font-bold text-[#212121] mb-3">
                    Areas of Specialization
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {editorInChief.specialization.map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-[#FFE9EE] border border-[#E6B6C2] text-[#5A0A1A] rounded-full text-sm font-semibold"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Managing Editor */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#7A0019] mb-8 font-serif">
              Managing Editor
            </h2>
            <div className="bg-white border-2 border-[#EAD3D9] rounded-xl p-6 hover:shadow-xl transition-all">
              <div className="grid md:grid-cols-4 gap-6 items-center">
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-3">
                    <Image
                      src={managingEditor.photo}
                      alt={managingEditor.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-[#212121] mb-1">
                    {managingEditor.name}
                  </h3>
                  <p className="text-sm text-[#7A0019] font-semibold mb-2">
                    {managingEditor.role}
                  </p>
                  {managingEditor.email && (
                    <a
                      href={`mailto:${managingEditor.email}`}
                      className="inline-flex items-center gap-1 text-[#7A0019] hover:text-[#5A0A1A] text-sm"
                    >
                      <Mail className="h-3 w-3" />
                      Email
                    </a>
                  )}
                </div>
                <div className="md:col-span-3">
                  <p className="text-sm text-gray-600 mb-1">
                    {managingEditor.department}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    {managingEditor.affiliation}
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    {managingEditor.bio}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {managingEditor.specialization.map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Associate Editors */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#7A0019] mb-8 font-serif">
              Associate Editors
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {associateEditors.map((editor, idx) => (
                <div
                  key={idx}
                  className="bg-white border-2 border-[#EAD3D9] rounded-xl p-6 hover:shadow-xl hover:border-[#7A0019] transition-all"
                >
                  <div className="text-center mb-4">
                    <div className="relative w-24 h-24 mx-auto mb-3">
                      <Image
                        src={editor.photo}
                        alt={editor.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-[#212121] mb-1">
                      {editor.name}
                    </h3>
                    <p className="text-sm text-[#7A0019] font-semibold mb-2">
                      {editor.role}
                    </p>
                    <p className="text-xs text-gray-600 mb-1">
                      {editor.department}
                    </p>
                    <p className="text-xs text-gray-600 mb-3">
                      {editor.affiliation}
                    </p>
                    <div className="flex justify-center gap-3">
                      {editor.orcid && (
                        <a
                          href={`https://orcid.org/${editor.orcid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#7A0019] hover:text-[#5A0A1A]"
                          aria-label="ORCID"
                        >
                          <Globe className="h-4 w-4" />
                        </a>
                      )}
                      {editor.email && (
                        <a
                          href={`mailto:${editor.email}`}
                          className="text-[#7A0019] hover:text-[#5A0A1A]"
                          aria-label="Email"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    {editor.bio}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {editor.specialization.map((spec, specIdx) => (
                      <span
                        key={specIdx}
                        className="px-2 py-1 bg-[#FAF7F8] text-gray-700 rounded-full text-xs"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
                href="/for-authors"
                className="hover:text-[#7A0019]"
              >
                For Authors
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