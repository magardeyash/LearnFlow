import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen, Users, Compass, DollarSign, Star } from 'lucide-react';
import { useCourses } from '../../hooks/queries';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Level } from '../../types';

export const Browse: React.FC = () => {
  // Filters State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(100);

  const { data: courses, isLoading } = useCourses({
    search: search || undefined,
    category: category || undefined,
    level: level ? (level as Level) : undefined,
    maxPrice: maxPrice || undefined,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight flex items-center gap-2">
            <Compass className="h-8 w-8 text-brand-500 animate-spin" style={{ animationDuration: '10s' }} />
            Browse Courses
          </h1>
          <p className="text-slate-400 text-sm mt-1">Explore top courses designed by global experts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card glass={true} className="sticky top-20 flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-slate-200">
              <Filter className="h-5 w-5 text-brand-500" />
              <h2 className="font-bold">Filters</h2>
            </div>

            {/* Category Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-350 text-slate-300">Category</label>
              <select
                className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-brand-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Software Development">Software Development</option>
                <option value="Business">Business</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            {/* Level Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-300">Difficulty Level</label>
              <select
                className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-brand-500"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="">All Levels</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>

            {/* Price Filter */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-sm font-semibold text-slate-355 text-slate-300">
                <span>Max Price</span>
                <span className="text-brand-500">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="0"
                max="250"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-brand-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                <span>$0</span>
                <span>$250</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Courses Listing */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search courses, skills, topic..."
              className="w-full pl-12 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all duration-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="flex flex-col gap-4 p-0 overflow-hidden border-slate-800">
                  <Skeleton className="h-44 w-full" />
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-12" />
                    </div>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="flex justify-between pt-4 border-t border-slate-800 mt-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : courses?.length === 0 ? (
            <Card className="text-center py-20 text-slate-500">
              <BookOpen className="h-12 w-12 text-slate-700 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-350 text-slate-300">No courses found</h3>
              <p className="text-xs max-w-xs mx-auto mt-1">
                We couldn't find any courses matching your search query. Try adjusting your filter parameters.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses?.map((course) => (
                <Link key={course.id} to={`/course/${course.id}`}>
                  <Card glass={true} className="flex flex-col h-full overflow-hidden p-0 border-slate-800 hover:-translate-y-1 transform transition-all duration-300">
                    <div className="h-44 w-full bg-slate-950 relative overflow-hidden">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-700">
                          <BookOpen className="h-12 w-12" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <Badge variant="brand">{course.level}</Badge>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-500 uppercase">{course.category}</span>
                          <span className="text-sm font-black text-brand-500">
                            {course.price === 0 ? 'FREE' : `$${course.price.toFixed(2)}`}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-100 line-clamp-1">{course.title}</h3>
                        <p className="text-xs text-slate-400 mt-2 line-clamp-2">{course.description}</p>
                      </div>

                      <div className="border-t border-slate-850 pt-4 mt-6 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {course.totalEnrolledStudents} Enrolled
                        </span>
                        
                        <span className="flex items-center gap-0.5 text-amber-500">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          {course.rating > 0 ? course.rating.toFixed(1) : 'New'}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Browse;
