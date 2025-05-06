
import React, { useState } from 'react';
import { useNews, FilterParams } from '../context/NewsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, ChartBar, ChartPie } from "lucide-react";

const News: React.FC = () => {
  const { articles, isLoading, error, filterArticles, clearFilters, filteredArticles } = useNews();
  const [filterParams, setFilterParams] = useState<FilterParams>({
    author: '',
    startDate: '',
    endDate: '',
    type: '',
    searchTerm: ''
  });
  
  const handleFilterChange = (key: keyof FilterParams, value: string) => {
    setFilterParams(prev => ({ ...prev, [key]: value }));
  };
  
  const handleApplyFilters = () => {
    filterArticles(filterParams);
  };
  
  const handleClearFilters = () => {
    setFilterParams({
      author: '',
      startDate: '',
      endDate: '',
      type: '',
      searchTerm: ''
    });
    clearFilters();
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">News Management</h1>
        <p className="text-gray-500">Browse and filter all news and blog articles</p>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <Filter className="mr-2" size={20} />
              Filter Articles
            </div>
          </CardTitle>
          <CardDescription>Use the filters below to find specific articles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <Input 
                placeholder="Search by author" 
                value={filterParams.author}
                onChange={(e) => handleFilterChange('author', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <Input 
                type="date" 
                value={filterParams.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <Input 
                type="date" 
                value={filterParams.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <Select 
                value={filterParams.type} 
                onValueChange={(value) => handleFilterChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                <Input 
                  className="pl-8"
                  placeholder="Search content" 
                  value={filterParams.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4 space-x-2">
            <Button variant="outline" onClick={handleClearFilters}>Clear</Button>
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Articles ({filteredArticles.length})</CardTitle>
          <CardDescription>
            {filteredArticles.length === articles.length 
              ? 'Showing all articles' 
              : `Filtered results: ${filteredArticles.length} of ${articles.length} articles`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">Loading articles...</div>
          ) : error ? (
            <div className="text-red-500 py-4">{error}</div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">No articles found matching your filters</p>
              <Button variant="outline" onClick={handleClearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="overflow-hidden">
                  <div className="h-40 bg-gray-100 relative">
                    {article.imageUrl ? (
                      <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-200">No image</div>
                    )}
                    <div className="absolute top-2 right-2">
                      <div className={`
                        px-2 py-1 rounded-md text-xs font-medium
                        ${article.type === 'news' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}
                      `}>
                        {article.type === 'news' ? (
                          <div className="flex items-center">
                            <ChartBar size={12} className="mr-1" />
                            News
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <ChartPie size={12} className="mr-1" />
                            Blog
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-1 line-clamp-1">{article.title}</h3>
                    <div className="text-sm text-gray-500 mb-2">
                      <div className="flex items-center justify-between">
                        <span>{article.author}</span>
                        <span>{new Date(article.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{article.content}</p>
                    <div className="text-xs text-gray-400">Source: {article.source}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default News;
