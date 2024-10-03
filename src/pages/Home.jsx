import React, { useState, useEffect, lazy, Suspense } from 'react';
import { getAllDeals, generateDummyData } from '../utils/api';
import DealCardSkeleton from '../components/DealCardSkeleton';
import Header from '../components/Header';
import FAB from '../components/FAB';
import SortingTabs from '../components/SortingTabs';
import PullToRefresh from 'react-pull-to-refresh';
import InfiniteScroll from 'react-infinite-scroll-component';
import { sortDeals } from '../utils/dealUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const DealCard = lazy(() => import('../components/DealCard'));

const Home = () => {
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState('newest');
  const { translations } = useLanguage();
  const queryClient = useQueryClient();

  const { data: deals, isLoading, error } = useQuery({
    queryKey: ['deals'],
    queryFn: getAllDeals,
    onError: () => {
      generateDummyData();
    },
  });

  useEffect(() => {
    if (deals) {
      const sorted = sortDeals(deals, sortOption);
      setFilteredDeals(sorted);
      setHasMore(false); // Since we're getting all deals at once
    }
  }, [deals, sortOption]);

  const handleDealUpdate = (updatedDeal) => {
    queryClient.setQueryData(['deals'], old => 
      old.map(deal => deal.id === updatedDeal.id ? updatedDeal : deal)
    );
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const handleRefresh = async () => {
    await queryClient.invalidateQueries(['deals']);
    return null;
  };

  if (error) {
    return <div>Error loading deals. Please try again later.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-14 pb-20 relative overflow-hidden">
      <Header />
      <div className="container mx-auto px-4 py-2">
        <SortingTabs activeSort={sortOption} onSortChange={handleSortChange} />
      </div>
      <PullToRefresh onRefresh={handleRefresh}>
        <InfiniteScroll
          dataLength={filteredDeals.length}
          next={() => {}}
          hasMore={hasMore}
          loader={<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <DealCardSkeleton key={index} />
            ))}
          </div>}
          endMessage={<p className="text-center mt-4 text-gray-600 dark:text-gray-400">{translations.noMoreDeals}</p>}
        >
          <div className="container mx-auto px-4 py-4 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {isLoading ? (
                [...Array(8)].map((_, index) => (
                  <DealCardSkeleton key={index} />
                ))
              ) : (
                filteredDeals.map((deal) => (
                  <Suspense key={deal.id} fallback={<DealCardSkeleton />}>
                    <DealCard deal={deal} onUpdate={handleDealUpdate} />
                  </Suspense>
                ))
              )}
            </div>
          </div>
        </InfiniteScroll>
      </PullToRefresh>
      <FAB />
    </div>
  );
};

export default Home;