import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Agency } from '../types';

interface VerificationStatusProps {
  agency: Agency;
}

export function VerificationStatus({ agency }: VerificationStatusProps) {
  if (agency.is_verified) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="h-4 w-4 mr-1" />
        Verified
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
      Pending Verification
    </span>
  );
}
