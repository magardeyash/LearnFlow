import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, FileText, UploadCloud, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { S3FileUploader } from '../../components/common/S3FileUploader';

export const InstructorRegister: React.FC = () => {
  const navigate = useNavigate();
  const [resumeUrl, setResumeUrl] = useState('');
  const [idProofUrl, setIdProofUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeUrl) {
      toast.error('Please upload your resume');
      return;
    }
    if (!idProofUrl) {
      toast.error('Please upload your ID proof');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/auth/instructor-apply', {
        resumeUrl,
        idProofUrl,
      });
      toast.success('Your instructor application has been submitted successfully and is under review!');
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || 'Failed to submit application. You may have already applied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Card glass={true} className="p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3 bg-brand-900/30 border border-brand-500/20 rounded-2xl mb-4">
            <Award className="h-10 w-10 text-brand-500" />
          </div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Become an Instructor</h1>
          <p className="text-slate-400 text-sm mt-2 max-w-md">
            Share your knowledge with thousands of students on LearnFlow. Submit your teaching credentials to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resume Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-brand-500" />
                Resume / Curriculum Vitae (PDF)
              </label>
              <S3FileUploader
                folder="resumes"
                accept="application/pdf"
                onUploadSuccess={setResumeUrl}
                label=""
              />
            </div>

            {/* ID Proof Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-brand-500" />
                Government Issued ID Proof (PDF/Image)
              </label>
              <S3FileUploader
                folder="id_proofs"
                accept="application/pdf,image/*"
                onUploadSuccess={setIdProofUrl}
                label=""
              />
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate('/dashboard')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={loading}
              disabled={!resumeUrl || !idProofUrl}
            >
              Submit Application
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
export default InstructorRegister;
