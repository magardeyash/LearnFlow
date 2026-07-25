import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Award, PlayCircle, Star, Compass, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCourses } from '../../hooks/queries';
import api from '../../api/axios';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Progress } from '../../components/ui/Progress';
import { Spinner } from '../../components/ui/Spinner';
import { Course } from '../../types';

// Sub-component to fetch and render progress details for each course card
const CourseProgressCard: React.FC<{ course: Course }> = ({ course }) => {
  const [progressVal, setProgressVal] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get(`/api/progress/${course.id}`);
        const progressList = res.data.progress || [];
        const totalLessons = course.lessonIds.length;
        
        const watchedCount = progressList.filter((p: any) => p.videoWatched).length;
        const percentage = totalLessons > 0 ? Math.round((watchedCount / totalLessons) * 100) : 0;
        
        setProgressVal(percentage);
        setCompleted(!!res.data.completedAt);
      } catch (err) {
        console.error('Error fetching progress for course ' + course.id, err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [course]);

  return (
    <Card glass={true} className="flex flex-col h-full overflow-hidden p-0 border-slate-800 hover:-translate-y-1 transform transition-all duration-300">
      <div className="h-40 w-full bg-slate-950 relative overflow-hidden">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-700">
            <BookOpen className="h-10 w-10" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <Badge variant={completed ? 'success' : 'brand'}>
            {completed ? 'Completed' : 'In Progress'}
          </Badge>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-semibold text-slate-500 uppercase">{course.category}</span>
          <h3 className="text-base font-bold text-slate-100 mt-1 line-clamp-1">{course.title}</h3>
          
          {loading ? (
            <div className="mt-4 h-6 w-full animate-pulse bg-slate-800 rounded" />
          ) : (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span>Course progress</span>
                <span className="font-bold text-brand-500">{progressVal}%</span>
              </div>
              <Progress value={progressVal} size="sm" />
            </div>
          )}
        </div>

        <div className="border-t border-slate-850 pt-4 mt-6">
          <Link to={`/course/${course.id}/learn`} className="w-full">
            <Button variant={completed ? 'secondary' : 'primary'} size="sm" className="w-full justify-center">
              <PlayCircle className="h-4 w-4 mr-1.5" />
              {completed ? 'Review Content' : 'Continue Learning'}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export const StudentDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch all courses to match user's enrolled list
  const { data: allCourses, isLoading } = useCourses();
  
  const enrolledCourses = allCourses?.filter((c) => 
    user?.enrolledCourses.includes(c.id)
  ) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Banner */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-brand-500/5 blur-[80px]" />
        
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
            Welcome back, <span className="text-brand-500">{user?.name}</span>!
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-md">
            Ready to continue your learning journey? Dive back in and pick up where you left off.
          </p>
        </div>
        
        <Link to="/browse">
          <Button variant="outline" className="flex items-center gap-1">
            Browse Courses
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-200">Enrolled Courses</h2>
        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
          {enrolledCourses.length} Courses Total
        </span>
      </div>

      {isLoading ? (
        <Spinner size="lg" className="my-16" />
      ) : enrolledCourses.length === 0 ? (
        <Card glass={true} className="text-center py-20 flex flex-col items-center">
          <BookOpen className="h-12 w-12 text-slate-700 mb-4 animate-bounce" />
          <h3 className="text-lg font-bold text-slate-350 text-slate-300">You aren't enrolled in any courses</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mb-6">
            Jump in, browse our catalog, and pick a course to start learning today.
          </p>
          <Link to="/browse">
            <Button variant="primary">
              <Compass className="h-4 w-4 mr-1.5" />
              Explore Courses
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <CourseProgressCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};
export default StudentDashboard;
