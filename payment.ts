import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Define test card information for payment testing
export const TEST_CARDS = [
  {
    name: 'Valid Card (Approved)',
    number: '4242 4242 4242 4242',
    expiry: '12/25',
    cvc: '123',
    description: 'This test card will always be approved',
    result: 'success'
  },
  {
    name: 'Declined Card',
    number: '4000 0000 0000 0002',
    expiry: '12/25',
    cvc: '123',
    description: 'This test card will always be declined',
    result: 'declined'
  },
  {
    name: 'Insufficient Funds Card',
    number: '4000 0000 0000 9995',
    expiry: '12/25',
    cvc: '123',
    description: 'This test card will be declined due to insufficient funds',
    result: 'insufficient_funds'
  },
  {
    name: 'Expired Card',
    number: '4000 0000 0000 0069',
    expiry: '12/20',
    cvc: '123',
    description: 'This test card has expired',
    result: 'expired_card'
  }
];

// Define subscription tiers
export const SUBSCRIPTION_TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Access to basic sports data',
      'Limited to 5 searches per day',
      'View live scores for major leagues',
      'Basic statistics'
    ]
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    features: [
      'All Free features',
      'Unlimited searches',
      'Live scores for all leagues',
      'Detailed match statistics',
      'Team and player profiles'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    features: [
      'All Basic features',
      'Historical data access',
      'Advanced statistics and analytics',
      'Personalized notifications',
      'No advertisements',
      'Priority customer support'
    ]
  }
];

// Payment form hook
export function usePaymentForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
    subscriptionTier: 'basic'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean;
    message: string;
    transactionId?: number;
  } | null>(null);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Use a test card
  const useTestCard = (cardIndex: number) => {
    const card = TEST_CARDS[cardIndex];
    setFormData(prev => ({
      ...prev,
      cardNumber: card.number,
      cardExpiry: card.expiry,
      cardCvc: card.cvc,
      cardName: 'Test User'
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{4}(\s?\d{4}){3}$/.test(formData.cardNumber)) {
      newErrors.cardNumber = 'Invalid card number format';
    }
    
    if (!formData.cardExpiry.trim()) {
      newErrors.cardExpiry = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
      newErrors.cardExpiry = 'Invalid expiry date format (MM/YY)';
    }
    
    if (!formData.cardCvc.trim()) {
      newErrors.cardCvc = 'CVC is required';
    } else if (!/^\d{3,4}$/.test(formData.cardCvc)) {
      newErrors.cardCvc = 'Invalid CVC format';
    }
    
    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Determine payment method based on card number
      let paymentMethod = 'test_card_visa';
      
      if (formData.cardNumber.includes('0000 0000 0002')) {
        paymentMethod = 'test_card_declined';
      } else if (formData.cardNumber.includes('0000 0000 9995')) {
        paymentMethod = 'test_card_insufficient_funds';
      } else if (formData.cardNumber.includes('0000 0000 0069')) {
        paymentMethod = 'test_card_expired';
      }
      
      // Get subscription tier price
      const tier = SUBSCRIPTION_TIERS.find(t => t.id === formData.subscriptionTier);
      const amount = tier ? tier.price : 0;
      
      // Call API to process payment
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod,
          amount,
          subscriptionTier: formData.subscriptionTier
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setPaymentResult({
          success: true,
          message: 'Payment processed successfully!',
          transactionId: result.transaction_id
        });
        
        // Redirect to success page after a delay
        setTimeout(() => {
          router.push('/payment/success?transaction_id=' + result.transaction_id);
        }, 2000);
      } else {
        setPaymentResult({
          success: false,
          message: result.error || 'Payment failed. Please try again.'
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentResult({
        success: false,
        message: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    paymentResult,
    handleChange,
    handleSubmit,
    useTestCard
  };
}
