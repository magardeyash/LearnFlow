// All shared TypeScript types for LearnFlow

export type Role = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
export type Level = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type PaymentStatus = 'CREATED' | 'PAID' | 'FAILED';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  isVerified: boolean;
  enrolledCourses: string[];
};

export type Course = {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  instructorId: string;
  description: string;
  skills: string[];
  lessonIds: string[];
  price: number;
  totalEnrolledStudents: number;
  category: string;
  level: Level;
  isPublished: boolean;
  rating: number;
  createdAt: string;
  updatedAt: string;
};

export type Lesson = {
  id: string;
  courseId: string;
  title: string;
  videoUrl: string;
  notesUrl: string;
  quizId?: string;
  description: string;
  duration: number;
  order: number;
  isFree: boolean;
  createdAt: string;
};

export type Mcq = {
  question: string;
  options: string[];
  correctIndex: number;
};

export type TheoryQuestion = {
  question: string;
  answer: string;
};

export type Quiz = {
  id: string;
  lessonId: string;
  mcqs: Mcq[];
  theoryQuestions: TheoryQuestion[];
  createdAt: string;
};

export type Cart = {
  id: string;
  userId: string;
  courseIds: string[];
  updatedAt: string;
};

export type LessonProgress = {
  lessonId: string;
  videoWatched: boolean;
  quizScore: number;
  notesDownloaded: boolean;
};

export type UserProgress = {
  id: string;
  courseId: string;
  userId: string;
  progress: LessonProgress[];
  completedAt?: string;
  createdAt: string;
};

export type Message = {
  userId: string;
  username: string;
  message: string;
  createdAt: string;
};

export type Discussion = {
  id: string;
  courseId: string;
  messages: Message[];
};

export type PendingRequest = {
  id: string;
  instructorId: string;
  instructorName?: string;
  instructorEmail?: string;
  resumeUrl: string;
  idProofUrl: string;
  status: RequestStatus;
  createdAt: string;
};
