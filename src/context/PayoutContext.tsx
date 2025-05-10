
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { NewsArticle } from './NewsContext';

interface PayoutRate {
  newsRate: number;
  blogRate: number;
}

interface PayoutContextType {
  payoutRates: PayoutRate;
  updateRates: (rates: PayoutRate) => void;
  calculatePayouts: (articles: NewsArticle[], dateRange?: DateRange) => PayoutData[];
  exportPayouts: (format: 'pdf' | 'csv') => void;
  dateRange: DateRange | null;
  setDateRange: (range: DateRange | null) => void;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface PayoutData {
  author: string;
  newsCount: number;
  blogCount: number;
  totalAmount: number;
}

const PayoutContext = createContext<PayoutContextType>({} as PayoutContextType);

export const usePayout = () => useContext(PayoutContext);

interface PayoutProviderProps {
  children: ReactNode;
}

export const PayoutProvider: React.FC<PayoutProviderProps> = ({ children }) => {
  const [payoutRates, setPayoutRates] = useState<PayoutRate>({ newsRate: 10, blogRate: 15 });
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  
  useEffect(() => {
    // Load saved rates from localStorage if available
    const savedRates = localStorage.getItem('paypulse_payout_rates');
    if (savedRates) {
      try {
        setPayoutRates(JSON.parse(savedRates));
      } catch (e) {
        localStorage.removeItem('paypulse_payout_rates');
      }
    }
  }, []);
  
  const updateRates = (rates: PayoutRate) => {
    // Validate rates to ensure they're valid numbers
    if (typeof rates.newsRate !== 'number' || typeof rates.blogRate !== 'number' || 
        isNaN(rates.newsRate) || isNaN(rates.blogRate)) {
      toast.error('Invalid payout rates provided');
      return;
    }
    
    // Ensure rates are positive
    const validRates = {
      newsRate: Math.max(0, rates.newsRate),
      blogRate: Math.max(0, rates.blogRate)
    };
    
    setPayoutRates(validRates);
    localStorage.setItem('paypulse_payout_rates', JSON.stringify(validRates));
    toast.success('Payout rates updated successfully');
  };
  
  const calculatePayouts = (articles: NewsArticle[], range?: DateRange): PayoutData[] => {
    // Filter articles by date range if provided
    let filteredArticles = articles;
    
    if (range) {
      const fromDate = new Date(range.from);
      fromDate.setHours(0, 0, 0, 0);
      
      const toDate = new Date(range.to);
      toDate.setHours(23, 59, 59, 999);
      
      filteredArticles = articles.filter(article => {
        const articleDate = new Date(article.date);
        return articleDate >= fromDate && articleDate <= toDate;
      });
    }
    
    const authorMap = new Map<string, { newsCount: number; blogCount: number }>();
    
    // Count articles by author and type
    filteredArticles.forEach(article => {
      const authorData = authorMap.get(article.author) || { newsCount: 0, blogCount: 0 };
      
      if (article.type === 'news') {
        authorData.newsCount += 1;
      } else {
        authorData.blogCount += 1;
      }
      
      authorMap.set(article.author, authorData);
    });
    
    // Calculate payouts for each author
    return Array.from(authorMap.entries()).map(([author, data]) => {
      const newsPayout = data.newsCount * payoutRates.newsRate;
      const blogPayout = data.blogCount * payoutRates.blogRate;
      
      return {
        author,
        newsCount: data.newsCount,
        blogCount: data.blogCount,
        totalAmount: newsPayout + blogPayout
      };
    });
  };
  
  const exportPayouts = (format: 'pdf' | 'csv') => {
    try {
      if (format === 'csv') {
        toast.success('Payout data exported as CSV');
        // In a real app, this would generate and download a CSV file
      } else {
        toast.success('Payout data exported as PDF');
        // In a real app, this would generate and download a PDF file
      }
    } catch (err) {
      toast.error('Failed to export data');
    }
  };
  
  return (
    <PayoutContext.Provider value={{ 
      payoutRates, 
      updateRates,
      calculatePayouts,
      exportPayouts,
      dateRange,
      setDateRange
    }}>
      {children}
    </PayoutContext.Provider>
  );
};
