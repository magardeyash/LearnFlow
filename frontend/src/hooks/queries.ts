import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { Course, Lesson, Message, UserProgress } from '../types';

export const useCourses = (filters: { search?: string; category?: string; level?: string; maxPrice?: number } = {}) => {
  return useQuery<Course[]>({
    queryKey: ['courses', filters],
    queryFn: async () => {
      const res = await api.get('/api/courses', { params: filters });
      return res.data;
    },
  });
};

export const useCourseDetail = (id: string | undefined) => {
  return useQuery<Course>({
    queryKey: ['course', id],
    queryFn: async () => {
      const res = await api.get(`/api/courses/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useLessons = (courseId: string | undefined) => {
  return useQuery<Lesson[]>({
    queryKey: ['lessons', courseId],
    queryFn: async () => {
      const res = await api.get(`/api/lessons/course/${courseId}`);
      return res.data;
    },
    enabled: !!courseId,
  });
};

export const useProgress = (courseId: string | undefined) => {
  return useQuery<UserProgress>({
    queryKey: ['progress', courseId],
    queryFn: async () => {
      const res = await api.get(`/api/progress/${courseId}`);
      return res.data;
    },
    enabled: !!courseId,
  });
};

export const useDiscussion = (courseId: string | undefined) => {
  return useQuery<Message[]>({
    queryKey: ['discussion', courseId],
    queryFn: async () => {
      const res = await api.get(`/api/discussions/${courseId}`);
      return res.data;
    },
    enabled: !!courseId,
  });
};

export const useInstructorCourses = () => {
  return useQuery<Course[]>({
    queryKey: ['instructor-courses'],
    queryFn: async () => {
      const res = await api.get('/api/courses/my');
      return res.data;
    },
  });
};
