
import React from 'react';
import { useNews } from '../context/NewsContext';
import { usePayout } from '../context/PayoutContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartBar, ChartPie, Filter } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { articles, isLoading, error } = useNews();
  const { payoutRates, calculatePayouts } = usePayout();
  
  // Calculate statistics
  const totalArticles = articles.length;
  const totalNews = articles.filter(article => article.type === 'news').length;
  const totalBlogs = articles.filter(article => article.type === 'blog').length;
  
  // Calculate total payout
  const payoutData = calculatePayouts(articles);
  const totalPayout = payoutData.reduce((sum, item) => sum + item.totalAmount, 0);
  
  // Prepare data for charts
  const getAuthorCounts = () => {
    const authorMap: Record<string, { news: number, blogs: number }> = {};
    
    articles.forEach(article => {
      if (!authorMap[article.author]) {
        authorMap[article.author] = { news: 0, blogs: 0 };
      }
      
      if (article.type === 'news') {
        authorMap[article.author].news += 1;
      } else {
        authorMap[article.author].blogs += 1;
      }
    });
    
    return Object.entries(authorMap).map(([author, counts]) => ({
      author,
      news: counts.news,
      blogs: counts.blogs
    }));
  };
  
  const authorData = getAuthorCounts();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading dashboard data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome to your PayPulse News Vista dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{totalArticles}</div>
              <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                <Filter size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              News Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{totalNews}</div>
              <div className="p-2 bg-green-100 rounded-full text-green-600">
                <ChartBar size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Blog Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{totalBlogs}</div>
              <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                <ChartPie size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Payout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">${totalPayout.toFixed(2)}</div>
              <div className="text-sm text-gray-500">
                ${payoutRates.newsRate}/news · ${payoutRates.blogRate}/blog
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Content by Author</CardTitle>
            <CardDescription>Distribution of news and blogs by author</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={authorData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="author" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="news" fill="#1976d2" name="News" />
                <Bar dataKey="blogs" fill="#9c27b0" name="Blogs" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest articles added to the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {articles.slice(0, 5).map((article) => (
                <div key={article.id} className="flex items-start border-b border-gray-100 pb-3 last:border-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                    {article.type === 'news' ? <ChartBar size={16} /> : <ChartPie size={16} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{article.title}</h4>
                    <div className="flex text-xs text-gray-500 mt-1">
                      <span>{article.author}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(article.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <Link to="/news">
                <Button variant="outline" className="w-full">View All Articles</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
