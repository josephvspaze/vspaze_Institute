import React, { useState, useEffect } from 'react';
import { Award, Briefcase, GraduationCap, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const response = await api.get('/admin/faculty/public');
      setFaculty(response.data.faculty || []);
    } catch (error) {
      console.error('Error fetching faculty:', error);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Meet Our Expert Faculty</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Learn online from industry professionals with years of real-world experience
          </p>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {faculty.map((member) => (
              <Link
                key={member._id}
                to={`/faculty/${member._id}`}
                className="block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 overflow-hidden cursor-pointer"
              >
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-8 text-center">
                  <div className="w-32 h-32 rounded-full mx-auto mb-4 shadow-xl border-4 border-white bg-white flex items-center justify-center">
                    <span className="text-4xl font-bold text-blue-600">
                      {member.name?.split(' ').map(n => n[0]).join('') || 'F'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-white/90 font-semibold">{member.specialization}</p>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4 italic">"{member.bio}"</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-700">
                      <GraduationCap className="w-5 h-5 mr-3 text-blue-600" />
                      <span className="text-sm">{member.qualification}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Briefcase className="w-5 h-5 mr-3 text-green-600" />
                      <span className="text-sm">{member.experience} Experience</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-yellow-500" />
                      Teaches:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(member.assignedCourses || []).map((course, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                        >
                          {typeof course === 'string' ? course : course.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Want to Join Our Faculty Team?</h2>
          <p className="text-xl mb-8 opacity-90">We're always looking for passionate online educators</p>
          <a
            href="/teacher-registration"
            className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:shadow-2xl transition-all"
          >
            <span>Apply Now</span>
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Faculty;
