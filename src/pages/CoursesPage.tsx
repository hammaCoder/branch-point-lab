
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

// Mock course data - will be replaced with API calls
const mockCourses = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Learn the fundamentals of React including hooks, state management, and more.',
    thumbnail: 'https://placekitten.com/300/200',
    instructor: 'Jane Smith',
    isPublished: true
  },
  {
    id: '2',
    title: 'Advanced TypeScript',
    description: 'Deep dive into TypeScript\'s powerful type system and advanced features.',
    thumbnail: 'https://placekitten.com/301/200',
    instructor: 'John Doe',
    isPublished: true
  },
];

const CoursesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState(mockCourses);
  const isInstructor = user?.role === 'instructor';

  // Navigate to course creation page
  const handleCreateCourse = () => {
    navigate('/instructor/courses/create');
  };

  // Navigate to course details/lesson page
  const handleViewCourse = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Courses</h1>
        {isInstructor && (
          <Button onClick={handleCreateCourse}>
            Create Course
          </Button>
        )}
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:ring-1 hover:ring-primary transition-all cursor-pointer">
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>By {course.instructor}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{course.description}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleViewCourse(course.id)}
                >
                  View Course
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No courses available yet.</p>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
