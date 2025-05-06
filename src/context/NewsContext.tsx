
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

export interface NewsArticle {
  id: string;
  title: string;
  author: string;
  date: string;
  type: 'news' | 'blog';
  content: string;
  source: string;
  url: string;
  imageUrl?: string;
}

interface NewsContextType {
  articles: NewsArticle[];
  isLoading: boolean;
  error: string | null;
  filterArticles: (params: FilterParams) => void;
  clearFilters: () => void;
  filteredArticles: NewsArticle[];
  fetchArticles: () => Promise<void>;
}

export interface FilterParams {
  author?: string;
  startDate?: string;
  endDate?: string;
  type?: 'news' | 'blog' | '';
  searchTerm?: string;
}

const NewsContext = createContext<NewsContextType>({} as NewsContextType);

export const useNews = () => useContext(NewsContext);

interface NewsProviderProps {
  children: ReactNode;
}

export const NewsProvider: React.FC<NewsProviderProps> = ({ children }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchArticles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Mock API fetch - in a real app, this would call an actual news API
      const response = await fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=1a2b3c4d5e6f7g8h9i0j');
      
      // Since we don't have a real API key, we'll use mock data
      const mockData = getMockNewsData();
      
      setArticles(mockData);
      setFilteredArticles(mockData);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to fetch news articles. Please try again later.');
      setIsLoading(false);
      toast.error('Failed to fetch news articles');
    }
  };
  
  useEffect(() => {
    fetchArticles();
  }, []);
  
  const filterArticles = (params: FilterParams) => {
    let filtered = [...articles];
    
    if (params.author) {
      filtered = filtered.filter(article => 
        article.author.toLowerCase().includes(params.author?.toLowerCase() || '')
      );
    }
    
    if (params.type) {
      filtered = filtered.filter(article => article.type === params.type);
    }
    
    if (params.startDate) {
      filtered = filtered.filter(article => 
        new Date(article.date) >= new Date(params.startDate || '')
      );
    }
    
    if (params.endDate) {
      filtered = filtered.filter(article => 
        new Date(article.date) <= new Date(params.endDate || '')
      );
    }
    
    if (params.searchTerm) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(params.searchTerm?.toLowerCase() || '') ||
        article.content.toLowerCase().includes(params.searchTerm?.toLowerCase() || '')
      );
    }
    
    setFilteredArticles(filtered);
  };
  
  const clearFilters = () => {
    setFilteredArticles(articles);
  };
  
  // Mock data generator
  const getMockNewsData = (): NewsArticle[] => {
    const authors = ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson'];
    const types: ('news' | 'blog')[] = ['news', 'blog'];
    const sources = ['The Guardian', 'Tech Daily', 'News Portal', 'Digital Times', 'Future Today'];
    
    return Array(30).fill(null).map((_, index) => {
      const type = types[Math.floor(Math.random() * types.length)];
      const author = authors[Math.floor(Math.random() * authors.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      const imageNumber = Math.floor(Math.random() * 1000) + 1;
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      return {
        id: `article-${index + 1}`,
        title: `${type === 'news' ? 'Breaking News' : 'Latest Blog'}: Article ${index + 1}`,
        author,
        date: date.toISOString().split('T')[0],
        type,
        content: `This is a sample ${type} article content about various topics. It discusses important matters in detail.`,
        source,
        url: `https://example.com/articles/${index + 1}`,
        imageUrl: `https://picsum.photos/id/${imageNumber}/300/200`
      };
    });
  };
  
  return (
    <NewsContext.Provider value={{ 
      articles, 
      isLoading, 
      error,
      filterArticles,
      clearFilters,
      filteredArticles,
      fetchArticles
    }}>
      {children}
    </NewsContext.Provider>
  );
};
