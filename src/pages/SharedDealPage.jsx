import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDealById } from '../utils/api';
import DealCard from '../components/DealCard';
import { useLanguage } from '../contexts/LanguageContext';

const SharedDealPage = () => {
  const { id } = useParams();
  const { translations } = useLanguage();
  
  const { data: deal, isLoading, error } = useQuery({
    queryKey: ['deal', id],
    queryFn: () => getDealById(id),
  });

  if (isLoading) return <div>{translations.loading}</div>;
  if (error) return <div>{translations.errorLoadingDeal}</div>;
  if (!deal) return <div>{translations.dealNotFound}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">{translations.sharedDeal}</h1>
      <DealCard deal={deal} onUpdate={() => {}} />
    </div>
  );
};

export default SharedDealPage;