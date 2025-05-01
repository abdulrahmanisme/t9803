import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Textarea } from '../../../../components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../../components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, Pencil, Plus, Trash } from 'lucide-react';

// Define Course type based on our database schema
interface Course {
  id: string;
  course_name: string;
  university_name: string;
  location: string;
  tuition_fee: string;
  duration: string;
  degree_type: string;
  description: string;
}

export function CourseManagement() {
  // State management
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<Omit<Course, 'id'>>({
    course_name: '',
    university_name: '',
    location: '',
    tuition_fee: '',
    duration: '',
    degree_type: '',
    description: '',
  });

  // Load courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch courses from Supabase
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('university_courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      toast.error('Error loading courses: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open dialog for creating new course
  const openAddDialog = () => {
    setEditingCourse(null);
    setFormData({
      course_name: '',
      university_name: '',
      location: '',
      tuition_fee: '',
      duration: '',
      degree_type: '',
      description: '',
    });
    setShowDialog(true);
  };

  // Open dialog for editing existing course
  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      course_name: course.course_name,
      university_name: course.university_name,
      location: course.location,
      tuition_fee: course.tuition_fee,
      duration: course.duration,
      degree_type: course.degree_type,
      description: course.description,
    });
    setShowDialog(true);
  };

  // Save course (create or update)
  const saveCourse = async () => {
    try {
      // Validate required fields
      const requiredFields = ['course_name', 'university_name', 'degree_type', 'description'];
      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          toast.error(`${field.replace('_', ' ')} is required`);
          return;
        }
      }

      if (editingCourse) {
        // Update existing course
        const { error } = await supabase
          .from('university_courses')
          .update(formData)
          .eq('id', editingCourse.id);

        if (error) throw error;
        toast.success('Course updated successfully');
      } else {
        // Create new course
        const { error } = await supabase
          .from('university_courses')
          .insert(formData);

        if (error) throw error;
        toast.success('Course added successfully');
      }

      setShowDialog(false);
      fetchCourses();
    } catch (error: any) {
      toast.error('Error saving course: ' + error.message);
    }
  };

  // Delete course
  const deleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const { error } = await supabase
        .from('university_courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Course deleted successfully');
      fetchCourses();
    } catch (error: any) {
      toast.error('Error deleting course: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">University Course Management</h2>
        <Button onClick={openAddDialog} className="flex items-center gap-2">
          <Plus size={16} /> Add New Course
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-10 border rounded-md bg-slate-50">
          <p className="text-gray-500">No courses found. Add your first course to get started.</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Name</TableHead>
                <TableHead>University</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Degree Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Tuition Fee</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.course_name}</TableCell>
                  <TableCell>{course.university_name}</TableCell>
                  <TableCell>{course.location}</TableCell>
                  <TableCell>{course.degree_type}</TableCell>
                  <TableCell>{course.duration}</TableCell>
                  <TableCell>{course.tuition_fee}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(course)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteCourse(course.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Course Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCourse ? 'Edit Course' : 'Add New Course'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="course_name" className="font-medium">
                Course Name*
              </label>
              <Input
                id="course_name"
                name="course_name"
                value={formData.course_name}
                onChange={handleChange}
                placeholder="e.g., Computer Science"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="university_name" className="font-medium">
                University Name*
              </label>
              <Input
                id="university_name"
                name="university_name"
                value={formData.university_name}
                onChange={handleChange}
                placeholder="e.g., Harvard University"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="location" className="font-medium">
                Location
              </label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Cambridge, MA, USA"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="degree_type" className="font-medium">
                  Degree Type*
                </label>
                <Select
                  value={formData.degree_type}
                  onValueChange={(value) => handleSelectChange('degree_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select degree type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bachelor">Bachelor</SelectItem>
                    <SelectItem value="Master">Master</SelectItem>
                    <SelectItem value="Doctorate">Doctorate</SelectItem>
                    <SelectItem value="Certificate">Certificate</SelectItem>
                    <SelectItem value="Diploma">Diploma</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="duration" className="font-medium">
                  Duration
                </label>
                <Input
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 4 years"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="tuition_fee" className="font-medium">
                Tuition Fee
              </label>
              <Input
                id="tuition_fee"
                name="tuition_fee"
                value={formData.tuition_fee}
                onChange={handleChange}
                placeholder="e.g., $50,000 per year"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="font-medium">
                Description*
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Provide a detailed description of the course..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={saveCourse}>
              {editingCourse ? 'Update Course' : 'Add Course'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 