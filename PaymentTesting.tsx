import { useState } from 'react';
import { TEST_CARDS, SUBSCRIPTION_TIERS, usePaymentForm } from '../lib/payment';

export default function PaymentTestingComponent() {
  const {
    formData,
    errors,
    isSubmitting,
    paymentResult,
    handleChange,
    handleSubmit,
    useTestCard
  } = usePaymentForm();
  
  const [showTestCards, setShowTestCards] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Payment Testing</h2>
      
      <div className="mb-6">
        <button
          onClick={() => setShowTestCards(!showTestCards)}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          {showTestCards ? 'Hide Test Cards' : 'Show Test Cards'}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ml-1 transform ${showTestCards ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {showTestCards && (
        <div className="mb-8 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Test Credit Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TEST_CARDS.map((card, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white">
                <div className="font-medium text-gray-800">{card.name}</div>
                <div className="text-sm text-gray-600 mb-2">{card.description}</div>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <span className="text-gray-500">Number:</span> {card.number}
                  </div>
                  <div>
                    <span className="text-gray-500">Expiry:</span> {card.expiry}
                  </div>
                  <div>
                    <span className="text-gray-500">CVC:</span> {card.cvc}
                  </div>
                  <div>
                    <span className="text-gray-500">Result:</span>{' '}
                    <span className={card.result === 'success' ? 'text-green-600' : 'text-red-600'}>
                      {card.result}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => useTestCard(index)}
                  className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 py-1 px-3 rounded text-sm"
                >
                  Use this card
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {SUBSCRIPTION_TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`border rounded-lg p-6 ${
              formData.subscriptionTier === tier.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-xl font-bold mb-2">{tier.name}</div>
            <div className="text-2xl font-bold mb-4">
              {tier.price === 0 ? 'Free' : `$${tier.price.toFixed(2)}`}
              {tier.price > 0 && <span className="text-sm font-normal text-gray-600">/month</span>}
            </div>
            <ul className="space-y-2 mb-6">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <label className="flex items-center">
              <input
                type="radio"
                name="subscriptionTier"
                value={tier.id}
                checked={formData.subscriptionTier === tier.id}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Select {tier.name}</span>
            </label>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                errors.cardNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
            <input
              type="text"
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                errors.cardName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.cardName && <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input
              type="text"
              name="cardExpiry"
              value={formData.cardExpiry}
              onChange={handleChange}
              placeholder="MM/YY"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                errors.cardExpiry ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.cardExpiry && <p className="mt-1 text-sm text-red-600">{errors.cardExpiry}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
            <input
              type="text"
              name="cardCvc"
              value={formData.cardCvc}
              onChange={handleChange}
              placeholder="123"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                errors.cardCvc ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.cardCvc && <p className="mt-1 text-sm text-red-600">{errors.cardCvc}</p>}
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
        
        {paymentResult && (
          <div
            className={`p-4 rounded-lg ${
              paymentResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            <div className="font-medium">{paymentResult.message}</div>
            {paymentResult.transactionId && (
              <div className="text-sm mt-1">Transaction ID: {paymentResult.transactionId}</div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
