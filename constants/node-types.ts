import { NodeType, NodeConfig } from '@/types';

export const NODE_TYPES: Record<NodeType, NodeConfig> = {
  besoin: {
    label: 'Besoin',
    color: '#8B5CF6',
    bgColor: '#F3E8FF',
    textColor: '#6B21A8',
    shape: 'cylinder',
  },
  'besoin-valide': {
    label: 'Besoin Validé',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    textColor: '#1E40AF',
    shape: 'cylinder',
  },
  action: {
    label: 'Action',
    color: '#22C55E',
    bgColor: '#D1FAE5',
    textColor: '#166534',
    shape: 'rect',
  },
  information: {
    label: 'Information',
    color: '#EAB308',
    bgColor: '#FEF3C7',
    textColor: '#713F12',
    shape: 'rect',
  },
  description: {
    label: 'Description',
    color: '#FCD34D',
    bgColor: '#FEF9C3',
    textColor: '#78350F',
    shape: 'rect',
  },
  'pain-point': {
    label: 'Point de Friction',
    color: '#EC4899',
    bgColor: '#FCE7F3',
    textColor: '#9F1239',
    shape: 'rect',
  },
  question: {
    label: 'Question',
    color: '#6366F1',
    bgColor: '#E0E7FF',
    textColor: '#312E81',
    shape: 'icon',
  },
};

export const SAMPLE_INPUT = `Feature: User Registration
- User clicks "Sign Up" button
- Form appears with email and password fields
- User enters credentials
- System validates email format
- If valid, check if email exists
- If new email, create account and send verification
- If email exists, show error message

Feature: Password Reset
- User clicks "Forgot Password"
- Enter email address
- System checks if email exists
- Send reset link to email
- User clicks link and enters new password
- Password updated successfully

Feature: User Login
- User enters credentials
- System validates
- If correct, redirect to dashboard
- If incorrect, show error with retry option`;
