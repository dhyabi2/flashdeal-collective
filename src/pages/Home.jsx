import React, { useState, useEffect } from 'react';
import { getAllDeals, generateDummyData } from '../utils/indexedDB';
import DealCard from '../components/DealCard';
import DealCardSkeleton from '../components/DealCardSkeleton';
import Header from '../components/Header';
import FAB from '../components/FAB';
import CategoryFilter from '../components/CategoryFilter';
import PullToRefresh from 'react-pull-to-refresh';
import InfiniteScroll from 'react-infinite-scroll-component';

const Home = () => {
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchDeals = async (pageNum = 1) => {
    setIsLoading(true);
    try {
      const fetchedDeals = await getAllDeals(pageNum);
      if (pageNum === 1) {
        setDeals(fetchedDeals);
        setFilteredDeals(fetchedDeals);
      } else {
        setDeals(prevDeals => [...prevDeals, ...fetchedDeals]);
        setFilteredDeals(prevDeals => [...prevDeals, ...fetchedDeals]);
      }
      setHasMore(fetchedDeals.length > 0);
    } catch (error) {
      console.error('Error fetching deals:', error);
      if (pageNum === 1) {
        const dummyData = generateDummyData();
        setDeals(dummyData);
        setFilteredDeals(dummyData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleDealUpdate = (updatedDeal) => {
    setDeals(prevDeals => prevDeals.map(deal => 
      deal.id === updatedDeal.id ? updatedDeal : deal
    ));
    setFilteredDeals(prevDeals => prevDeals.map(deal => 
      deal.id === updatedDeal.id ? updatedDeal : deal
    ));
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const filtered = deals.filter(deal => 
      category === 'All' || deal.category === category
    );
    setFilteredDeals(filtered);
  };

  const handleRefresh = async () => {
    setPage(1);
    await fetchDeals(1);
    return null;
  };

  const loadMoreDeals = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchDeals(nextPage);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-16 pb-20">
      <Header />
      <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={handleCategorySelect} />
      <PullToRefresh onRefresh={handleRefresh}>
        <InfiniteScroll
          dataLength={filteredDeals.length}
          next={loadMoreDeals}
          hasMore={hasMore}
          loader={<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <DealCardSkeleton key={index} />
            ))}
          </div>}
          endMessage={<p className="text-center mt-4 text-gray-600 dark:text-gray-400">No more deals to show</p>}
        >
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {isLoading ? (
                [...Array(8)].map((_, index) => (
                  <DealCardSkeleton key={index} />
                ))
              ) : (
                filteredDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} onUpdate={handleDealUpdate} />
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