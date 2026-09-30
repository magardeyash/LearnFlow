import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, DollarSign, Award, CheckCircle, XCircle, FileText, Shield, HelpCircle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [stats, setStats] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Rejection Dialog State
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejecting, setRejecting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      navigate('/unauthorized');
      return;
    }
    fetchData();
  }, [isAuthenticated, user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, reqsRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/pending-requests'),
      ]);
      setStats(statsRes.data);
      setRequests(reqsRes.data || []);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (instructorId: string) => {
    if (!window.confirm('Are you sure you want to approve this applicant as an instructor?')) {
      return;
    }

    try {
      await api.post('/api/admin/verify-instructor', { instructorId });
      toast.success('Applicant approved successfully!');
      fetchData();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to approve request');
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReqId || !rejectReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setRejecting(true);
    try {
      await api.post('/api/admin/reject-instructor', {
        instructorId: selectedReqId,
        reason: rejectReason.trim(),
      });
      toast.success('Applicant rejected and notified successfully');
      setSelectedReqId(null);
      setRejectReason('');
      fetchData();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to reject request');
    } finally {
      setRejecting(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" className="my-24" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2.5 mb-8">
        <Shield className="h-8 w-8 text-brand-500" />
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Admin Console</h1>
          <p className="text-slate-400 text-sm mt-1">Global platform metrics and onboarding approvals</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card glass={true} className="flex items-center gap-4">
          <div className="p-3 bg-brand-900/30 border border-brand-500/20 rounded-xl text-brand-500">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Students</p>
            <h3 className="text-xl font-black text-slate-100 mt-0.5">{stats?.totalStudents || 0}</h3>
          </div>
        </Card>

        <Card glass={true} className="flex items-center gap-4">
          <div className="p-3 bg-sky-900/30 border border-sky-500/20 rounded-xl text-sky-400">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Instructors</p>
            <h3 className="text-xl font-black text-slate-100 mt-0.5">{stats?.totalInstructors || 0}</h3>
          </div>
        </Card>

        <Card glass={true} className="flex items-center gap-4">
          <div className="p-3 bg-indigo-900/30 border border-indigo-500/20 rounded-xl text-indigo-455 text-indigo-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Courses</p>
            <h3 className="text-xl font-black text-slate-100 mt-0.5">{stats?.totalCourses || 0}</h3>
          </div>
        </Card>

        <Card glass={true} className="flex items-center gap-4">
          <div className="p-3 bg-emerald-900/30 border border-emerald-500/20 rounded-xl text-emerald-400">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-xl font-black text-slate-100 mt-0.5">₹{stats?.totalRevenue ? stats.totalRevenue.toFixed(0) : '0'}</h3>
          </div>
        </Card>
      </div>

      {/* Requests Section */}
      <h2 className="text-xl font-bold text-slate-200 mb-6">Instructor Onboarding Applications</h2>

      {requests.length === 0 ? (
        <Card className="text-center py-16 text-slate-550 text-slate-500" glass={true}>
          <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto mb-3" />
          <p className="font-bold">All caught up!</p>
          <p className="text-xs mt-1">No pending onboarding verification requests currently require action.</p>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-md">
          <table className="min-w-full divide-y divide-slate-850 divide-slate-800 text-left text-xs font-semibold text-slate-300">
            <thead className="bg-slate-950/60 uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-4">Applicant Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Credentials</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-900/20">
                  <td className="px-6 py-4 font-bold text-slate-100">{req.instructorName || 'Unknown'}</td>
                  <td className="px-6 py-4 text-slate-450 text-slate-400">{req.instructorEmail}</td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <a
                      href={req.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-brand-500 hover:underline"
                    >
                      <FileText className="h-4 w-4" />
                      Resume
                    </a>
                    <a
                      href={req.idProofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-brand-500 hover:underline"
                    >
                      <Eye className="h-4 w-4" />
                      ID Proof
                    </a>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="primary"
                        size="sm"
                        className="py-1 px-3 text-xs"
                        onClick={() => handleApprove(req.instructorId)}
                      >
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="py-1 px-3 text-xs"
                        onClick={() => setSelectedReqId(req.instructorId)}
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Reason Modal */}
      <Modal
        isOpen={!!selectedReqId}
        onClose={() => setSelectedReqId(null)}
        title="Reject Instructor Application"
      >
        <form onSubmit={handleRejectSubmit} className="flex flex-col gap-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Please explain why this application is being rejected. This explanation will be formatted and emailed automatically to the applicant.
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Rejection Reason *</label>
            <textarea
              className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              rows={4}
              placeholder="e.g. The ID proof uploaded was blurry and could not be verified. Please upload a clear color scan of your passport or driver's license."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-4 border-t border-slate-800 pt-4">
            <Button variant="ghost" type="button" onClick={() => setSelectedReqId(null)}>
              Cancel
            </Button>
            <Button variant="danger" type="submit" isLoading={rejecting}>
              Send Rejection
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default AdminDashboard;
