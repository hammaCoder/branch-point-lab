
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Mock data - will be replaced with API calls
const mockLesson = {
  id: '1',
  title: 'Introduction to React Hooks',
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  description: 'Learn how to use React hooks to manage state and side effects in functional components.',
  branchPoints: [
    { id: '1', timestamp: 120, title: 'Basic useState Hook', branchName: 'lesson1-basic-usestate' },
    { id: '2', timestamp: 360, title: 'useEffect for API Calls', branchName: 'lesson1-useeffect-api' },
    { id: '3', timestamp: 600, title: 'Custom Hooks', branchName: 'lesson1-custom-hooks' },
  ]
};

// Simple mock code for the playground
const mockCode = `
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default Counter;
`;

const LessonPage: React.FC = () => {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(mockLesson);
  const [showPlayground, setShowPlayground] = useState(false);
  const [currentBranchPoint, setCurrentBranchPoint] = useState<typeof mockLesson.branchPoints[0] | null>(null);
  const [code, setCode] = useState(mockCode);
  
  const handleBranchPointClick = (branchPoint: typeof mockLesson.branchPoints[0]) => {
    setCurrentBranchPoint(branchPoint);
    setShowPlayground(true);
    // In a real app, you would fetch the code from the API based on the branch point
  };

  const handleClosePlayground = () => {
    setShowPlayground(false);
    setCurrentBranchPoint(null);
  };

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
        <p className="text-muted-foreground">{lesson.description}</p>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden">
            <iframe 
              src={lesson.videoUrl}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={lesson.title}
            ></iframe>
            
            {/* Branch point markers - in a real app these would be positioned based on timestamp */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {lesson.branchPoints.map((point) => (
                <button
                  key={point.id}
                  className="branch-point w-4 h-4"
                  onClick={() => handleBranchPointClick(point)}
                  title={`${point.title} (${Math.floor(point.timestamp / 60)}:${point.timestamp % 60})`}
                ></button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="xl:col-span-1">
          <div className="bg-card p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Branch Points</h2>
            <div className="space-y-3">
              {lesson.branchPoints.map((point) => (
                <div 
                  key={point.id} 
                  className="p-3 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors"
                  onClick={() => handleBranchPointClick(point)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-medium">{point.title}</h3>
                    <span className="text-sm text-muted-foreground">
                      {Math.floor(point.timestamp / 60)}:{(point.timestamp % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Branch: {point.branchName}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Code Playground Modal */}
      {showPlayground && currentBranchPoint && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-card w-full max-w-6xl max-h-[90vh] rounded-lg overflow-hidden shadow-xl">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h2 className="text-xl font-semibold">{currentBranchPoint.title}</h2>
              <Button variant="ghost" onClick={handleClosePlayground}>Close</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 h-[80vh]">
              <div className="overflow-auto border-r border-border">
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-2">Files</h3>
                  <div className="bg-secondary p-2 rounded cursor-pointer hover:bg-secondary/80">
                    Counter.jsx
                  </div>
                </div>
              </div>
              <div className="overflow-auto">
                <pre className="code-editor h-full">
                  <code>{code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonPage;
