import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Film, FileText, Trash, HelpCircle, Check, Play, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useCourseDetail, useLessons } from '../../hooks/queries';
import api from '../../api/axios';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { S3FileUploader } from '../../components/common/S3FileUploader';
import { Level } from '../../types';

export const CourseManagement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: course, isLoading: loadingCourse } = useCourseDetail(id);
  const { data: lessons, isLoading: loadingLessons } = useLessons(id);

  const [savingCourse, setSavingCourse] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [addingLesson, setAddingLesson] = useState(false);

  // Course Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState<Level>('BEGINNER');
  const [price, setPrice] = useState('0');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [published, setPublished] = useState(false);

  // Lesson Form State
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [lessonDuration, setLessonDuration] = useState('10');
  const [lessonOrder, setLessonOrder] = useState('1');
  const [lessonIsFree, setLessonIsFree] = useState(false);
  const [lessonVideoUrl, setLessonVideoUrl] = useState('');
  const [lessonNotesUrl, setLessonNotesUrl] = useState('');

  // Populate course state when loaded
  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setCategory(course.category);
      setLevel(course.level);
      setPrice(course.price.toString());
      setDescription(course.description);
      setSkills(course.skills.join(', '));
      setThumbnail(course.thumbnail);
      setPublished(course.isPublished);
    }
  }, [course]);

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCourse(true);
    try {
      const skillsList = skills.split(',').map((s) => s.trim()).filter((s) => s !== '');
      await api.put(`/api/courses/${id}`, {
        title,
        category,
        level,
        price: parseFloat(price) || 0,
        description,
        skills: skillsList,
        thumbnail,
        published,
      });
      toast.success('Course updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['course', id] });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || 'Failed to update course');
    } finally {
      setSavingCourse(false);
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle || !lessonVideoUrl) {
      toast.error('Lesson title and video file are required');
      return;
    }

    setAddingLesson(true);
    try {
      await api.post('/api/lessons', {
        courseId: id,
        title: lessonTitle,
        description: lessonDescription,
        duration: parseInt(lessonDuration) || 10,
        order: parseInt(lessonOrder) || 1,
        isFree: lessonIsFree,
        videoUrl: lessonVideoUrl,
        notesUrl: lessonNotesUrl,
      });

      toast.success('Lesson added successfully!');
      setModalOpen(false);
      // Reset form
      setLessonTitle('');
      setLessonDescription('');
      setLessonDuration('10');
      setLessonOrder((lessons ? lessons.length + 2 : 1).toString());
      setLessonIsFree(false);
      setLessonVideoUrl('');
      setLessonNotesUrl('');

      queryClient.invalidateQueries({ queryKey: ['lessons', id] });
      queryClient.invalidateQueries({ queryKey: ['course', id] });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || 'Failed to add lesson');
    } finally {
      setAddingLesson(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) {
      return;
    }

    try {
      await api.delete(`/api/lessons/${lessonId}`);
      toast.success('Lesson deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['lessons', id] });
      queryClient.invalidateQueries({ queryKey: ['course', id] });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || 'Failed to delete lesson');
    }
  };

  if (loadingCourse) {
    return <Spinner size="lg" className="my-24" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/instructor/dashboard')}
          className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 text-sm font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-2">
          <Badge variant={course?.isPublished ? 'success' : 'secondary'}>
            {course?.isPublished ? 'Published' : 'Draft'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Edit Course Form */}
        <div className="lg:col-span-1">
          <Card glass={true} className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-slate-100 pb-3 border-b border-slate-800">
              Course Settings
            </h2>

            <form onSubmit={handleUpdateCourse} className="flex flex-col gap-4">
              <Input
                label="Course Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <Input
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-300">Level</label>
                <select
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-brand-500"
                  value={level}
                  onChange={(e) => setLevel(e.target.value as Level)}
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>

              <Input
                label="Price (USD)"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />

              <Input
                label="Skills (comma separated)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-300">Description</label>
                <textarea
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-brand-500"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-200">Publish Course</span>
                  <span className="text-xs text-slate-500">Make it visible in directory</span>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-brand-500 cursor-pointer"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />
              </div>

              <S3FileUploader
                folder="course_thumbnails"
                accept="image/*"
                onUploadSuccess={setThumbnail}
                label="Change Thumbnail Image"
              />

              {thumbnail && (
                <div className="mt-1 h-32 w-full rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                  <img src={thumbnail} alt="Thumbnail preview" className="h-full w-full object-cover" />
                </div>
              )}

              <Button variant="primary" type="submit" className="w-full py-2.5 mt-2" isLoading={savingCourse}>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Column: Manage Lessons list */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card glass={true} className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-6">
                <h2 className="text-xl font-bold text-slate-100">
                  Course Lectures / Lessons
                </h2>
                <Button variant="outline" size="sm" onClick={() => setModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Lecture
                </Button>
              </div>

              {loadingLessons ? (
                <Spinner size="md" className="my-12" />
              ) : lessons?.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <Film className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                  <p className="font-bold">No lectures added yet</p>
                  <p className="text-xs max-w-xs mx-auto mt-1">
                    Upload your video lectures and notes, then configure quizzes for each lesson.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {lessons?.map((lesson, idx) => (
                    <div
                      key={lesson.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-950 transition-all duration-200 gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center font-bold text-sm text-slate-300">
                          {lesson.order}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-200">{lesson.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-slate-500">{lesson.duration} mins</span>
                            {lesson.isFree && (
                              <span className="inline-block text-[8px] bg-emerald-950 text-emerald-400 px-1 py-0.2 rounded border border-emerald-850">
                                FREE PREVIEW
                              </span>
                            )}
                            {lesson.notesUrl && (
                              <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                                <FileText className="h-3 w-3 text-brand-500" /> Notes
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Link to={`/instructor/quiz/${lesson.id}`}>
                          <Button variant="secondary" size="sm" className="text-xs">
                            <HelpCircle className="h-3.5 w-3.5 mr-1" />
                            {lesson.quizId ? 'Edit Quiz' : 'Add Quiz'}
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-rose-400 hover:bg-rose-950/20 hover:text-rose-400"
                          onClick={() => handleDeleteLesson(lesson.id)}
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Add Lesson Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Course Lecture"
        size="lg"
      >
        <form onSubmit={handleAddLesson} className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Input
                label="Lecture Title *"
                placeholder="e.g. Introduction to REST APIs"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                required
              />
            </div>
            <Input
              label="Order *"
              type="number"
              min="1"
              value={lessonOrder}
              onChange={(e) => setLessonOrder(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duration (minutes) *"
              type="number"
              min="1"
              value={lessonDuration}
              onChange={(e) => setLessonDuration(e.target.value)}
              required
            />
            <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg h-[46px] mt-[26px]">
              <span className="text-xs font-semibold text-slate-300">Free Preview</span>
              <input
                type="checkbox"
                className="h-4 w-4 accent-brand-500 cursor-pointer"
                checked={lessonIsFree}
                onChange={(e) => setLessonIsFree(e.target.checked)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Lecture Description</label>
            <textarea
              className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-brand-500"
              rows={2}
              placeholder="What will students learn in this video?"
              value={lessonDescription}
              onChange={(e) => setLessonDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <S3FileUploader
              folder="course_videos"
              accept="video/*"
              onUploadSuccess={setLessonVideoUrl}
              label="Lecture Video File (MP4) *"
            />
            <S3FileUploader
              folder="course_notes"
              accept="application/pdf"
              onUploadSuccess={setLessonNotesUrl}
              label="Lecture Lecture Notes (PDF)"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4 border-t border-slate-800 pt-4">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={addingLesson} disabled={!lessonVideoUrl}>
              Add Lecture
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default CourseManagement;
