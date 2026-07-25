import { create } from 'zustand';
import { LessonProgress } from '../types';

interface CourseViewerState {
  currentLessonIndex: number;
  progress: LessonProgress[];
  setCurrentLessonIndex: (index: number) => void;
  setProgress: (progress: LessonProgress[]) => void;
  updateProgressLocally: (lessonId: string, updates: Partial<LessonProgress>) => void;
}

export const useCourseViewerStore = create<CourseViewerState>((set) => ({
  currentLessonIndex: 0,
  progress: [],
  setCurrentLessonIndex: (index) => set({ currentLessonIndex: index }),
  setProgress: (progress) => set({ progress }),
  updateProgressLocally: (lessonId, updates) => set((state) => {
    const exists = state.progress.some(p => p.lessonId === lessonId);
    let newProgress: LessonProgress[];
    if (exists) {
      newProgress = state.progress.map(p => 
        p.lessonId === lessonId ? { ...p, ...updates } : p
      );
    } else {
      newProgress = [...state.progress, {
        lessonId,
        videoWatched: false,
        quizScore: -1,
        notesDownloaded: false,
        ...updates
      }];
    }
    return { progress: newProgress };
  })
}));
