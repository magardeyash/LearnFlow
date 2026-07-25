import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Play, CheckCircle, FileText, HelpCircle, MessageSquare, Send, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import ReactPlayer from 'react-player';
import { useCourseDetail, useLessons, useProgress, useDiscussion } from '../../hooks/queries';
import { useCourseViewerStore } from '../../store/courseViewerStore';
import { useAuthStore } from '../../store/authStore';
import api from '../../api/axios';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { Input } from '../../components/ui/Input';
import { Quiz, Mcq, TheoryQuestion } from '../../types';

export const CourseViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: course, isLoading: loadingCourse } = useCourseDetail(id);
  const { data: lessons, isLoading: loadingLessons } = useLessons(id);
  const { data: serverProgress, isLoading: loadingProgress } = useProgress(id);

  const {
    currentLessonIndex,
    progress,
    setCurrentLessonIndex,
    setProgress,
    updateProgressLocally,
  } = useCourseViewerStore();

  const [activeTab, setActiveTab] = useState<'info' | 'quiz' | 'discussion'>('info');

  // Quiz State
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [theoryAnswers, setTheoryAnswers] = useState<string[]>([]);
  const [showTheoryAnswers, setShowTheoryAnswers] = useState(false);

  // Discussion Forum State
  const { data: messages, refetch: refetchDiscussion } = useDiscussion(id);
  const [newMessage, setNewMessage] = useState('');
  const [postingMessage, setPostingMessage] = useState(false);

  const currentLesson = lessons?.[currentLessonIndex];
  
  // Sync progress from server
  useEffect(() => {
    if (serverProgress) {
      setProgress(serverProgress.progress || []);
    }
  }, [serverProgress, setProgress]);

  // Load Quiz for active lesson
  useEffect(() => {
    if (currentLesson) {
      setQuiz(null);
      setQuizResult(null);
      setSelectedAnswers([]);
      setTheoryAnswers([]);
      setShowTheoryAnswers(false);

      if (currentLesson.quizId) {
        setLoadingQuiz(true);
        api.get(`/api/quiz/lesson/${currentLesson.id}`)
          .then((res) => {
            setQuiz(res.data);
            setSelectedAnswers(new Array(res.data.mcqs?.length || 0).fill(-1));
            setTheoryAnswers(new Array(res.data.theoryQuestions?.length || 0).fill(''));
          })
          .catch((err) => {
            console.error('Quiz fetch failed', err);
          })
          .finally(() => {
            setLoadingQuiz(false);
          });
      }
    }
  }, [currentLesson]);

  // Handle Video Completion
  const handleVideoEnded = async () => {
    if (!currentLesson || !id) return;
    
    // Check if already watched to avoid duplicate calls
    const isWatched = progress.some(p => p.lessonId === currentLesson.id && p.videoWatched);
    if (isWatched) return;

    try {
      updateProgressLocally(currentLesson.id, { videoWatched: true });
      const res = await api.patch('/api/progress/update', {
        courseId: id,
        lessonId: currentLesson.id,
        videoWatched: true,
        notesDownloaded: progress.some(p => p.lessonId === currentLesson.id && p.notesDownloaded),
      });

      toast.success('Lecture completed!');
      queryClient.invalidateQueries({ queryKey: ['progress', id] });
    } catch (e) {
      console.error('Failed to update progress', e);
    }
  };

  // Handle Notes Download
  const handleDownloadNotes = async () => {
    if (!currentLesson || !id) return;

    window.open(currentLesson.notesUrl, '_blank');

    const isDownloaded = progress.some(p => p.lessonId === currentLesson.id && p.notesDownloaded);
    if (isDownloaded) return;

    try {
      updateProgressLocally(currentLesson.id, { notesDownloaded: true });
      await api.patch('/api/progress/update', {
        courseId: id,
        lessonId: currentLesson.id,
        videoWatched: progress.some(p => p.lessonId === currentLesson.id && p.videoWatched),
        notesDownloaded: true,
      });

      queryClient.invalidateQueries({ queryKey: ['progress', id] });
    } catch (e) {
      console.error('Failed to record notes download', e);
    }
  };

  // Handle MCQ Choice Click
  const handleMcqSelect = (qIdx: number, oIdx: number) => {
    const updated = [...selectedAnswers];
    updated[qIdx] = oIdx;
    setSelectedAnswers(updated);
  };

  // Handle Quiz Submission
  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLesson || !quiz) return;

    if (selectedAnswers.some((ans) => ans === -1)) {
      toast.error('Please answer all multiple-choice questions');
      return;
    }

    setSubmittingQuiz(true);
    try {
      const res = await api.post('/api/quiz/submit', {
        lessonId: currentLesson.id,
        mcqAnswers: selectedAnswers,
      });
      setQuizResult(res.data);
      updateProgressLocally(currentLesson.id, { quizScore: res.data.score });
      
      toast.success(`Quiz graded: ${res.data.percentage.toFixed(0)}% score!`);
      queryClient.invalidateQueries({ queryKey: ['progress', id] });
    } catch (err: any) {
      toast.error('Failed to submit quiz');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  // Handle Forum Message Posting
  const handlePostMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !id) return;

    setPostingMessage(true);
    try {
      await api.post(`/api/discussions/${id}`, { message: newMessage.trim() });
      setNewMessage('');
      refetchDiscussion();
    } catch (err: any) {
      toast.error('Failed to post message');
    } finally {
      setPostingMessage(false);
    }
  };

  if (loadingCourse || loadingLessons || loadingProgress) {
    return <Spinner size="lg" className="my-24" />;
  }

  const getLessonWatched = (lessonId: string) => {
    return progress.some(p => p.lessonId === lessonId && p.videoWatched);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row">
      {/* Sidebar: Lectures Navigation */}
      <div className="w-full lg:w-80 bg-slate-900 border-r border-slate-800 flex flex-col overflow-y-auto max-h-[40vh] lg:max-h-screen lg:h-screen lg:sticky lg:top-0">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-base font-black text-slate-100 truncate">{course?.title}</h3>
          <p className="text-xs text-slate-400 mt-1">Course Syllabus</p>
        </div>

        <div className="flex-1 py-4">
          {lessons?.map((lesson, idx) => {
            const watched = getLessonWatched(lesson.id);
            const active = idx === currentLessonIndex;

            return (
              <button
                key={lesson.id}
                onClick={() => setCurrentLessonIndex(idx)}
                className={`w-full flex items-start gap-3 px-6 py-3.5 text-left border-l-2 transition-all duration-150 ${
                  active 
                    ? 'border-brand-500 bg-slate-850/60 text-brand-500 font-bold' 
                    : 'border-transparent text-slate-450 hover:bg-slate-850/30 text-slate-300 hover:text-slate-100'
                }`}
              >
                <div className="mt-0.5">
                  {watched ? (
                    <CheckCircle className="h-4.5 w-4.5 text-brand-500 fill-current" />
                  ) : (
                    <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center text-[9px] ${
                      active ? 'border-brand-500 bg-brand-500 text-slate-950 font-bold' : 'border-slate-650'
                    }`}>
                      {idx + 1}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold truncate max-w-[200px]">{lesson.title}</h4>
                  <span className="text-[10px] text-slate-500 font-medium">{lesson.duration} mins</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col max-w-full">
        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black border-b border-slate-900 shadow-2xl">
          {currentLesson ? (
            <ReactPlayer
              url={currentLesson.videoUrl}
              controls={true}
              width="100%"
              height="100%"
              playing={false}
              onEnded={handleVideoEnded}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-600">
              Select a lecture to play
            </div>
          )}
        </div>

        {/* Tab Controls */}
        <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 md:px-8 flex gap-4 h-12 items-center">
          <button
            onClick={() => setActiveTab('info')}
            className={`text-sm font-bold h-full px-2 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'info' ? 'border-brand-500 text-brand-500' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="h-4 w-4" />
            Lecture Notes
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`text-sm font-bold h-full px-2 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'quiz' ? 'border-brand-500 text-brand-500' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            Lecture Quiz
          </button>
          <button
            onClick={() => setActiveTab('discussion')}
            className={`text-sm font-bold h-full px-2 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'discussion' ? 'border-brand-500 text-brand-500' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Discussions
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="p-6 md:p-8 flex-1 max-w-5xl mx-auto w-full">
          
          {/* Info Tab */}
          {activeTab === 'info' && currentLesson && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-100">{currentLesson.title}</h2>
                <p className="text-xs text-slate-500 mt-1">Lecture Description</p>
                <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                  {currentLesson.description || 'No description available for this lecture.'}
                </p>
              </div>

              {currentLesson.notesUrl && (
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-200">
                    <FileText className="h-6 w-6 text-brand-500" />
                    <div>
                      <h4 className="text-sm font-bold">Lecture Notes (PDF)</h4>
                      <p className="text-xs text-slate-500">Read additional theory materials</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleDownloadNotes}>
                    Download
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === 'quiz' && currentLesson && (
            <div className="space-y-6">
              {!currentLesson.quizId ? (
                <div className="text-slate-500 text-sm flex items-center gap-2 py-6">
                  <AlertCircle className="h-5 w-5" />
                  <span>No quiz is configured for this lecture. Feel free to skip to the next lecture.</span>
                </div>
              ) : loadingQuiz ? (
                <Spinner size="md" className="my-10" />
              ) : quiz ? (
                <div className="space-y-8">
                  {/* MCQ section */}
                  {quiz.mcqs && quiz.mcqs.length > 0 && (
                    <form onSubmit={handleQuizSubmit} className="space-y-6">
                      <h3 className="text-base font-bold text-slate-200 pb-2 border-b border-slate-850">
                        Part 1: Multiple Choice Questions
                      </h3>

                      {quiz.mcqs.map((q, qIdx) => (
                        <Card key={qIdx} className="border-slate-850 p-6 flex flex-col gap-4 bg-slate-950/20" glass={false}>
                          <h4 className="text-sm font-bold text-slate-200">
                            {qIdx + 1}. {q.question}
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {q.options.map((opt, oIdx) => {
                              const checked = selectedAnswers[qIdx] === oIdx;
                              return (
                                <button
                                  key={oIdx}
                                  type="button"
                                  onClick={() => handleMcqSelect(qIdx, oIdx)}
                                  disabled={!!quizResult}
                                  className={`flex items-center gap-3 p-3 rounded-lg border text-left text-xs font-medium transition-all duration-200 ${
                                    checked 
                                      ? 'border-brand-500 bg-brand-500/5 text-brand-500' 
                                      : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700'
                                  }`}
                                >
                                  <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                                    checked ? 'border-brand-500' : 'border-slate-650'
                                  }`}>
                                    {checked && <div className="h-2 w-2 rounded-full bg-brand-500" />}
                                  </div>
                                  <span>{opt}</span>
                                </button>
                              );
                            })}
                          </div>
                        </Card>
                      ))}

                      {quizResult ? (
                        <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl flex items-center justify-between text-slate-200">
                          <div>
                            <span className="text-xs text-slate-500">Grading Output</span>
                            <h4 className="text-base font-black mt-1">
                              Your Score: <span className="text-brand-500">{quizResult.score} / {quizResult.total}</span> ({quizResult.percentage.toFixed(0)}%)
                            </h4>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-end pt-4">
                          <Button variant="primary" type="submit" isLoading={submittingQuiz}>
                            Submit Quiz Answers
                          </Button>
                        </div>
                      )}
                    </form>
                  )}

                  {/* Theory section */}
                  {quiz.theoryQuestions && quiz.theoryQuestions.length > 0 && (
                    <div className="space-y-6 pt-6 border-t border-slate-800">
                      <h3 className="text-base font-bold text-slate-200 pb-2 border-b border-slate-855 border-slate-800">
                        Part 2: Theory Questions (Self Evaluation)
                      </h3>

                      {quiz.theoryQuestions.map((q, idx) => (
                        <Card key={idx} className="border-slate-850 bg-slate-950/20" glass={false}>
                          <h4 className="text-sm font-bold text-slate-200">
                            {idx + 1}. {q.question}
                          </h4>

                          <textarea
                            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-105 text-slate-100 focus:outline-none focus:border-brand-500 text-xs mt-3"
                            rows={3}
                            placeholder="Write your answer here to evaluate..."
                            value={theoryAnswers[idx] || ''}
                            onChange={(e) => {
                              const updated = [...theoryAnswers];
                              updated[idx] = e.target.value;
                              setTheoryAnswers(updated);
                            }}
                            disabled={showTheoryAnswers}
                          />

                          {showTheoryAnswers && (
                            <div className="mt-4 p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                              <span className="text-[10px] font-black uppercase tracking-wider text-brand-500">Model Answer</span>
                              <p className="text-xs text-slate-400 mt-1">{q.answer}</p>
                            </div>
                          )}
                        </Card>
                      ))}

                      <div className="flex justify-end pt-4">
                        <Button variant="secondary" onClick={() => setShowTheoryAnswers(!showTheoryAnswers)}>
                          {showTheoryAnswers ? 'Hide Answers' : 'Reveal Model Answers'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {/* Discussion Tab */}
          {activeTab === 'discussion' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-100">Discussion Forum</h2>
              
              {/* Message input */}
              <form onSubmit={handlePostMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question or share ideas..."
                  className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button variant="primary" type="submit" className="px-4 py-2.5 rounded-xl" isLoading={postingMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>

              {/* Messages list */}
              <div className="flex flex-col gap-4 max-h-[50vh] overflow-y-auto mt-6">
                {!messages || messages.length === 0 ? (
                  <div className="text-slate-500 text-sm py-6 text-center">
                    No discussions yet. Be the first to post a message!
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div key={idx} className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">{msg.username}</span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{msg.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CourseViewer;
