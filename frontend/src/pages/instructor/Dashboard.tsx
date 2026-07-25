import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, DollarSign, Plus, Eye, Edit, Trash, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useInstructorCourses } from '../../hooks/queries';
import api from '../../api/axios';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { S3FileUploader } from '../../components/common/S3FileUploader';
import { Level } from '../../types';

export const InstructorDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: courses, isLoading, error } = useInstructorCourses();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState<Level>('BEGINNER');
  const [price, setPrice] = useState('0');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  // Stats calculation
  const totalCourses = courses?.length || 0;
  const totalStudents = courses?.reduce((acc, c) => acc + c.totalEnrolledStudents, 0) || 0;
  const totalIncome = courses?.reduce((acc, c) => acc + (c.totalEnrolledStudents * c.price), 0) || 0;

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const skillsList = skills.split(',').map((s) => s.trim()).filter((s) => s !== '');
      await api.post('/api/courses', {
        title,
        category,
        level,
        price: parseFloat(price) || 0,
        description,
        skills: skillsList,
        thumbnail,
        published: false,
      });

      toast.success('Course created successfully!');
      setModalOpen(false);
      // Reset form
      setTitle('');
      setCategory('');
      setLevel('BEGINNER');
      setPrice('0');
      setDescription('');
      setSkills('');
      setThumbnail('');
      
      queryClient.invalidateQueries({ queryKey: ['instructor-courses'] });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course? This action is irreversible.')) {
      return;
    }

    try {
      await api.delete(`/api/courses/${courseId}`);
      toast.success('Course deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['instructor-courses'] });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || 'Failed to delete course');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Instructor Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and author your online courses</p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          Create Course
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card glass={true} className="flex items-center gap-5">
          <div className="p-4 bg-brand-900/30 border border-brand-500/20 rounded-2xl text-brand-500">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Courses</p>
            <h3 className="text-2xl font-black text-slate-100 mt-1">{totalCourses}</h3>
          </div>
        </Card>
        
        <Card glass={true} className="flex items-center gap-5">
          <div className="p-4 bg-sky-900/30 border border-sky-500/20 rounded-2xl text-sky-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Enrolled</p>
            <h3 className="text-2xl font-black text-slate-100 mt-1">{totalStudents}</h3>
          </div>
        </Card>

        <Card glass={true} className="flex items-center gap-5">
          <div className="p-4 bg-emerald-900/30 border border-emerald-500/20 rounded-2xl text-emerald-400">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-2xl font-black text-slate-100 mt-1">${totalIncome.toFixed(2)}</h3>
          </div>
        </Card>
      </div>

      {/* Courses List */}
      <h2 className="text-xl font-bold text-slate-200 mb-6">My Courses</h2>

      {isLoading ? (
        <Spinner size="lg" className="my-12" />
      ) : error ? (
        <div className="flex items-center justify-center gap-2 text-rose-400 py-12">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to load courses</span>
        </div>
      ) : courses?.length === 0 ? (
        <Card glass={true} className="text-center py-16 flex flex-col items-center">
          <BookOpen className="h-12 w-12 text-slate-600 mb-4" />
          <h3 className="text-lg font-bold text-slate-300">No courses created yet</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-xs mb-6">
            Get started by creating your very first course to share with the community.
          </p>
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            Create Course
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => (
            <Card key={course.id} glass={true} className="flex flex-col h-full overflow-hidden p-0 border-slate-800">
              <div className="h-44 w-full bg-slate-950 relative overflow-hidden">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-600">
                    <BookOpen className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge variant={course.isPublished ? 'success' : 'secondary'}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="brand" className="text-[10px]">{course.category}</Badge>
                    <span className="text-xs font-bold text-brand-500">${course.price}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 line-clamp-1">{course.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{course.description}</p>
                </div>

                <div className="border-t border-slate-850 pt-4 mt-6 flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {course.totalEnrolledStudents} students
                  </span>
                  
                  <div className="flex gap-2">
                    <Link to={`/instructor/course/${course.id}`}>
                      <Button variant="secondary" size="sm" className="px-2.5">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="px-2.5 text-rose-400 hover:bg-rose-950/20 hover:text-rose-400" onClick={() => handleDeleteCourse(course.id)}>
                      <Trash className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Course Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Course"
      >
        <form onSubmit={handleCreateCourse} className="flex flex-col gap-4">
          <Input
            label="Course Title *"
            placeholder="e.g. Master Spring Boot 3.x"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Category *"
              placeholder="e.g. Software Development"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Level *</label>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (USD) *"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <Input
              label="Skills Required (comma separated)"
              placeholder="Java, Spring, MongoDB"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Description *</label>
            <textarea
              className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              rows={3}
              placeholder="Explain what students will learn..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <S3FileUploader
            folder="course_thumbnails"
            accept="image/*"
            onUploadSuccess={setThumbnail}
            label="Course Thumbnail Image"
          />

          <div className="flex justify-end gap-3 mt-4 border-t border-slate-800 pt-4">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={loading}>
              Create Course
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default InstructorDashboard;
