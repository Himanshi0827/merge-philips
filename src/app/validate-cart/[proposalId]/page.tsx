'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { validateCart } from '@/lib/api';
import ValidateCartHeader from '@/components/validate-cart/validate-cart-header';
import ValidationErrors from '@/components/validate-cart/validation-errors';
import ValidationWarnings from '@/components/validate-cart/validation-warnings';
import ValidationResultsHeader from '@/components/validate-cart/validation-results-header';
import ValidateCartLoading from '@/components/validate-cart/validate-cart-loading';
import ValidationSuccess from '@/components/validate-cart/validation-success';

export default function ValidateCartPage() {
  const params = useParams();
  

  const proposalId = params.proposalId as string;

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const goToCart = () => {
    window.location.href =
      `/cpq/quotes/${proposalId}/configure`;
  };
  
  const goToQuote = () => {
    window.location.href =
      `/cpq/quotes/${proposalId}`;
  };

  useEffect(() => {
    if (!proposalId) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        console.log(
          'Calling ValidateCart API...',
          proposalId
        );

        const response = await validateCart(
          proposalId
        );

        console.log(
          'ValidateCart Response',
          response
        );

        setResult(response);
      } catch (err) {
        console.error(
          'ValidateCart Error',
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : 'Unknown Error'
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [proposalId]);

  if (loading) {
    return (
      <ValidateCartLoading />
    );
  }

  if (error) {
    return (
      <div>
        Error: {error}
      </div>
    );
  }
  console.log(
    'Current Result',
    result
  );
  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
      }}
    >
      {/* Header */}

      <ValidateCartHeader
        quoteName={result?.QuoteName}
        onBack={goToQuote}
        onClose={goToQuote}
        />

  
      {/* Page Title */}
  
      <ValidationResultsHeader
        onReturn={goToCart}
       />
  
      {/* Errors */}
  
      <ValidationErrors
        errors={result?.Errors}
       />
  
      {/* Warnings */}
  
      <ValidationWarnings
        warnings={result?.Warnings}
       />
  
      {/* Success */}
  
       <ValidationSuccess
            show={
                result?.Errors?.length === 0 &&
                result?.Warnings?.length === 0
            }
        />
    </div>
  );
}