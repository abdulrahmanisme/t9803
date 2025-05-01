import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { PencilIcon, TrashIcon, PlusIcon, X, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

interface Course {
  id: string;
  course_name: string;
  university_name: string;
  location: string;
  tuition_fee: string;
  duration: string;
  degree_type: string;
  description: string;
  created_at: string;
}

export function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('university_courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Failed to load university courses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = () => {
    setCurrentCourse({
      course_name: '',
      university_name: '',
      location: '',
      tuition_fee: '',
      duration: '',
      degree_type: 'Bachelor',
      description: ''
    });
    setShowModal(true);
  };

  const handleEditCourse = (course: Course) => {
    setCurrentCourse(course);
    setShowModal(true);
  };

  const handleDeleteCourse = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('university_courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Course deleted successfully');
      loadCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCourse) return;

    try {
      const isEditing = !!currentCourse.id;
      
      const courseData = {
        course_name: currentCourse.course_name || '',
        university_name: currentCourse.university_name || '',
        location: currentCourse.location || '',
        tuition_fee: currentCourse.tuition_fee || '',
        duration: currentCourse.duration || '',
        degree_type: currentCourse.degree_type || 'Bachelor',
        description: currentCourse.description || ''
      };

      if (isEditing) {
        const { error } = await supabase
          .from('university_courses')
          .update(courseData)
          .eq('id', currentCourse.id);

        if (error) throw error;
        toast.success('Course updated successfully');
      } else {
        const { error } = await supabase
          .from('university_courses')
          .insert([courseData]);

        if (error) throw error;
        toast.success('Course added successfully');
      }

      setShowModal(false);
      loadCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error('Failed to save course');
    }
  };

  // Filter courses based on search query
  const filteredCourses = courses.filter(course => 
    course.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.university_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.degree_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">University Courses Management</h1>
        <button 
          onClick={handleAddCourse}
          className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <PlusIcon size={16} />
          Add New Course
        </button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pr-10 border rounded-md"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Course Name</th>
                <th className="py-3 px-4 text-left">University</th>
                <th className="py-3 px-4 text-left">Location</th>
                <th className="py-3 px-4 text-left">Degree</th>
                <th className="py-3 px-4 text-left">Duration</th>
                <th className="py-3 px-4 text-left">Tuition Fee</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="border-b border-gray-200">
                    <td className="py-3 px-4">{course.course_name}</td>
                    <td className="py-3 px-4">{course.university_name}</td>
                    <td className="py-3 px-4">{course.location}</td>
                    <td className="py-3 px-4">{course.degree_type}</td>
                    <td className="py-3 px-4">{course.duration}</td>
                    <td className="py-3 px-4">{course.tuition_fee}</td>
                    <td className="py-3 px-4 flex gap-2">
                      <button
                        onClick={() => handleEditCourse(course)}
                        className="p-1 bg-blue-100 text-blue-600 rounded"
                        title="Edit course"
                      >
                        <PencilIcon size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-1 bg-red-100 text-red-600 rounded"
                        title="Delete course"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    {searchQuery
                      ? 'No courses found matching your search criteria.'
                      : 'No courses available. Click "Add New Course" to create one.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {currentCourse?.id ? 'Edit Course' : 'Add New Course'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium mb-1">Course Name</label>
                <input
                  type="text"
                  value={currentCourse?.course_name || ''}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, course_name: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Computer Science, Business Administration"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">University Name</label>
                <input
                  type="text"
                  value={currentCourse?.university_name || ''}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, university_name: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Harvard University, MIT"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={currentCourse?.location || ''}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, location: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Boston, MA, USA"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tuition Fee</label>
                <input
                  type="text"
                  value={currentCourse?.tuition_fee || ''}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, tuition_fee: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., $45,000 per year"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Duration</label>
                <input
                  type="text"
                  value={currentCourse?.duration || ''}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, duration: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., 4 years, 2 years"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Degree Type</label>
                <select
                  value={currentCourse?.degree_type || ''}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, degree_type: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="Bachelor">Bachelor's</option>
                  <option value="Master">Master's</option>
                  <option value="PhD">PhD</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Associate">Associate</option>
                </select>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={currentCourse?.description || ''}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, description: e.target.value })}
                  className="w-full p-2 border rounded h-40"
                  placeholder="Provide details about the course, curriculum, career opportunities, etc."
                  required
                />
              </div>

              <div className="col-span-1 md:col-span-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md"
                >
                  {currentCourse?.id ? 'Update' : 'Create'} Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 