import { deleteExpiredDeals } from './indexedDB';

export const setupDailyCleanup = () => {
  const runCleanup = async () => {
    const deletedCount = await deleteExpiredDeals();
    console.log(`Daily cleanup completed. Deleted ${deletedCount} expired deals.`);
  };

  // Run cleanup immediately when the app starts
  runCleanup();

  // Set up daily cleanup at midnight
  const now = new Date();
  const night = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // tomorrow
    0, 0, 0 // at 00:00:00 hours
  );
  const msToMidnight = night.getTime() - now.getTime();

  // Run once at next midnight, then every 24 hours
  setTimeout(() => {
    runCleanup();
    setInterval(runCleanup, 24 * 60 * 60 * 1000);
  }, msToMidnight);
};