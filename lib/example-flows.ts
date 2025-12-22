import { Feature } from '@/types';

/**
 * Example flows for guest users to try out the product
 * These are pre-configured flows that demonstrate the tool's capabilities
 */

export const EXAMPLE_FLOWS: Feature[] = [
  {
    id: 'example-ecommerce-checkout',
    name: 'E-commerce Checkout',
    description: 'Complete checkout flow from cart to order confirmation',
    priority: 'high',
    flow: {
      nodes: [
        {
          id: 'ex1-1',
          type: 'besoin',
          label: 'Complete purchase',
        },
        {
          id: 'ex1-2',
          type: 'action',
          label: 'Review cart items',
        },
        {
          id: 'ex1-3',
          type: 'information',
          label: 'Cart page displayed',
        },
        {
          id: 'ex1-4',
          type: 'action',
          label: 'Click checkout button',
        },
        {
          id: 'ex1-5',
          type: 'information',
          label: 'Shipping information form',
        },
        {
          id: 'ex1-6',
          type: 'description',
          label: 'Enter shipping details',
          details: ['Full name', 'Address', 'City', 'Postal code', 'Phone number'],
        },
        {
          id: 'ex1-7',
          type: 'action',
          label: 'Select payment method',
        },
        {
          id: 'ex1-8',
          type: 'information',
          label: 'Payment page',
        },
        {
          id: 'ex1-9',
          type: 'action',
          label: 'Enter payment details',
        },
        {
          id: 'ex1-10',
          type: 'action',
          label: 'Confirm order',
        },
        {
          id: 'ex1-11',
          type: 'besoin-valide',
          label: 'Order confirmed',
        },
      ],
    },
  },
  {
    id: 'example-user-signup',
    name: 'User Sign Up',
    description: 'New user registration and account creation process',
    priority: 'high',
    flow: {
      nodes: [
        {
          id: 'ex2-1',
          type: 'besoin',
          label: 'Create account',
        },
        {
          id: 'ex2-2',
          type: 'action',
          label: 'Click sign up button',
        },
        {
          id: 'ex2-3',
          type: 'information',
          label: 'Registration form displayed',
        },
        {
          id: 'ex2-4',
          type: 'description',
          label: 'Fill registration form',
          details: ['Email address', 'Password', 'Full name', 'Accept terms'],
        },
        {
          id: 'ex2-5',
          type: 'action',
          label: 'Submit form',
        },
        {
          id: 'ex2-6',
          type: 'question',
          label: 'Email verification required?',
        },
        {
          id: 'ex2-7',
          type: 'information',
          label: 'Verification email sent',
        },
        {
          id: 'ex2-8',
          type: 'action',
          label: 'Click verification link',
        },
        {
          id: 'ex2-9',
          type: 'besoin-valide',
          label: 'Account created successfully',
        },
      ],
    },
  },
  {
    id: 'example-password-reset',
    name: 'Password Reset',
    description: 'User password recovery flow',
    priority: 'medium',
    flow: {
      nodes: [
        {
          id: 'ex3-1',
          type: 'besoin',
          label: 'Reset forgotten password',
        },
        {
          id: 'ex3-2',
          type: 'action',
          label: 'Click forgot password',
        },
        {
          id: 'ex3-3',
          type: 'information',
          label: 'Password reset page',
        },
        {
          id: 'ex3-4',
          type: 'action',
          label: 'Enter email address',
        },
        {
          id: 'ex3-5',
          type: 'action',
          label: 'Submit reset request',
        },
        {
          id: 'ex3-6',
          type: 'information',
          label: 'Reset email sent',
        },
        {
          id: 'ex3-7',
          type: 'action',
          label: 'Open email and click reset link',
        },
        {
          id: 'ex3-8',
          type: 'information',
          label: 'New password form',
        },
        {
          id: 'ex3-9',
          type: 'description',
          label: 'Enter new password',
          details: ['New password', 'Confirm password'],
        },
        {
          id: 'ex3-10',
          type: 'action',
          label: 'Save new password',
        },
        {
          id: 'ex3-11',
          type: 'besoin-valide',
          label: 'Password reset complete',
        },
      ],
    },
  },
];

