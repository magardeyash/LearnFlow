import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <ShieldAlert className="h-20 w-20 text-rose-500 mb-6 animate-pulse" />
      <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight mb-2">Access Denied</h1>
      <p className="text-lg text-slate-400 max-w-md mb-8">
        You do not have the required permissions to access this page. Please log in with a different account or return to safety.
      </p>
      <div className="flex gap-4">
        <Link to="/">
          <Button variant="primary">Go Home</Button>
        </Link>
        <Link to="/login">
          <Button variant="outline">Sign In</Button>
        </Link>
      </div>
    </div>
  );
};
export default Unauthorized;
