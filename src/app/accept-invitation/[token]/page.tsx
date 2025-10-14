"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { completeReviewerProfile, getFaculties, getDepartmentsByFaculty } from '@/services/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";
import axios from "axios";

// Validation schema
const reviewerProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  facultyId: z.string().min(1, "Faculty selection is required"),
  departmentId: z.string().min(1, "Department selection is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  academicTitle: z.string().optional(),
  alternativeEmail: z.string().email("Invalid email format").optional().or(z.literal("")),
});

// Email validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

interface Faculty {
  _id: string;
  code: string;
  title: string;
}

interface Department {
  _id: string;
  code: string;
  title: string;
  faculty: string;
}

interface ReviewerRegisterPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default function ReviewerRegisterPage({ params }: ReviewerRegisterPageProps) {
  const { token } = use(params);
  const [name, setName] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [academicTitle, setAcademicTitle] = useState("");
  const [alternativeEmail, setAlternativeEmail] = useState("");
  
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Load faculties on component mount
  useEffect(() => {
    const loadFaculties = async () => {
      try {
        const facultiesData = await getFaculties();
        setFaculties(facultiesData);
      } catch (error) {
        console.error("Failed to load faculties:", error);
        setError("Failed to load faculties");
      }
    };
    loadFaculties();
  }, []);

  // Load departments when faculty changes
  useEffect(() => {
    const loadDepartments = async () => {
      if (!facultyId) {
        setDepartments([]);
        setDepartmentId("");
        return;
      }

      setLoadingDepartments(true);
      try {
        const selectedFaculty = faculties.find(f => f._id === facultyId);
        if (selectedFaculty) {
          const departmentsData = await getDepartmentsByFaculty(selectedFaculty.code);
          setDepartments(departmentsData);
        }
      } catch (error) {
        console.error("Failed to load departments:", error);
        setError("Failed to load departments");
      } finally {
        setLoadingDepartments(false);
      }
    };
    loadDepartments();
  }, [facultyId, faculties]);

  const validateForm = (): boolean => {
    try {
      // Validate alternative email if provided
      if (alternativeEmail && !validateEmail(alternativeEmail)) {
        setValidationErrors({ alternativeEmail: "Must be a valid email address" });
        return false;
      }

      reviewerProfileSchema.parse({ 
        name, 
        facultyId, 
        departmentId, 
        phoneNumber, 
        academicTitle, 
        alternativeEmail 
      });
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0] as string] = err.message;
          }
        });
        setValidationErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const profileData = {
        name,
        facultyId,
        departmentId,
        phoneNumber,
        academicTitle: academicTitle || undefined,
        alternativeEmail: alternativeEmail || undefined,
      };

      await completeReviewerProfile(token, profileData);
      setSuccess(true);

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push("/reviewers/login");
      }, 3000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
    setError(error.response?.data?.message || error.message || "Failed to complete registration");
  } else if (error instanceof Error) {
    setError(error.message || "Failed to complete registration");
  } else {
    setError("An unknown error occurred");
  }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-purple-800">
              Registration Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <p className="mb-4">
              Your reviewer profile has been successfully created. Your login credentials
              have been sent to your email.
            </p>
            <p>You will be redirected to the login page shortly...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-purple-800">
            Complete Reviewer Profile
          </CardTitle>
          <CardDescription className="text-center">
            Please provide your information to complete your reviewer registration
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name *
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={validationErrors.name ? "border-red-500" : ""}
                required
              />
              {validationErrors.name && (
                <p className="text-sm text-red-500">{validationErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
  <label htmlFor="faculty" className="text-sm font-medium">
    Faculty *
  </label>
  <Select value={facultyId} onValueChange={setFacultyId}>
    <SelectTrigger className={validationErrors.facultyId ? "border-red-500" : ""}>
      <SelectValue placeholder="Select Faculty" />
    </SelectTrigger>
    <SelectContent className="max-h-60 overflow-y-auto">
      {faculties.map((faculty) => (
        <SelectItem key={faculty._id} value={faculty._id}>
          {faculty.title} ({faculty.code})
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  {validationErrors.facultyId && (
    <p className="text-sm text-red-500">{validationErrors.facultyId}</p>
  )}
</div>

<div className="space-y-2">
  <label htmlFor="department" className="text-sm font-medium">
    Department *
  </label>
  <Select 
    value={departmentId} 
    onValueChange={setDepartmentId}
    disabled={!facultyId || loadingDepartments}
  >
    <SelectTrigger className={validationErrors.departmentId ? "border-red-500" : ""}>
      <SelectValue placeholder={
        loadingDepartments ? "Loading departments..." : "Select Department"
      } />
    </SelectTrigger>
    <SelectContent className="max-h-60 overflow-y-auto">
      {departments.map((department) => (
        <SelectItem key={department._id} value={department._id}>
          {department.title} ({department.code})
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  {validationErrors.departmentId && (
    <p className="text-sm text-red-500">{validationErrors.departmentId}</p>
  )}
</div>

            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="text-sm font-medium">
                Phone Number *
              </label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={validationErrors.phoneNumber ? "border-red-500" : ""}
                placeholder="+234XXXXXXXXXX"
                required
              />
              {validationErrors.phoneNumber && (
                <p className="text-sm text-red-500">{validationErrors.phoneNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="academicTitle" className="text-sm font-medium">
                Academic Title (Optional)
              </label>
              <Input
                id="academicTitle"
                value={academicTitle}
                onChange={(e) => setAcademicTitle(e.target.value)}
                placeholder="e.g., Professor, Dr., Lecturer"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="alternativeEmail" className="text-sm font-medium">
                Alternative Email (Optional)
              </label>
              <Input
                id="alternativeEmail"
                type="email"
                value={alternativeEmail}
                onChange={(e) => setAlternativeEmail(e.target.value)}
                className={validationErrors.alternativeEmail ? "border-red-500" : ""}
                placeholder="alternative@gmail.com"
              />
              {validationErrors.alternativeEmail && (
                <p className="text-sm text-red-500">{validationErrors.alternativeEmail}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-purple-800 hover:bg-purple-900" 
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Complete Registration"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            After registration, you&apos;ll receive your login credentials via email
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
