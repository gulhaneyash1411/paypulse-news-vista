
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { usePayout, PayoutData, DateRange } from '../context/PayoutContext';
import { useNews } from '../context/NewsContext';
import { CalendarIcon, ChartPie, Download, FileX } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Payouts: React.FC = () => {
  const { payoutRates, updateRates, calculatePayouts, exportPayouts, dateRange, setDateRange } = usePayout();
  const { filteredArticles } = useNews();
  
  const [newsRate, setNewsRate] = useState<number>(payoutRates.newsRate);
  const [blogRate, setBlogRate] = useState<number>(payoutRates.blogRate);
  const [date, setDate] = useState<DateRange | undefined>(dateRange || undefined);
  
  // Update local state when context rates change
  useEffect(() => {
    setNewsRate(payoutRates.newsRate);
    setBlogRate(payoutRates.blogRate);
  }, [payoutRates]);
  
  // Apply date filter to payouts calculation
  const payoutData = calculatePayouts(filteredArticles, date || undefined);
  const totalPayout = payoutData.reduce((sum, item) => sum + item.totalAmount, 0);
  
  const handleSaveRates = () => {
    // Convert to numbers to ensure proper typing
    const newNewsRate = Number(newsRate);
    const newBlogRate = Number(blogRate);
    
    updateRates({ 
      newsRate: newNewsRate, 
      blogRate: newBlogRate 
    });
  };
  
  const handleExport = (format: 'pdf' | 'csv') => {
    exportPayouts(format);
  };
  
  // Update both local state and context when date changes
  const handleDateChange = (newDateRange: DateRange | undefined) => {
    setDate(newDateRange);
    setDateRange(newDateRange || null);
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Payout Management</h1>
        <p className="text-gray-500">Configure payment rates and manage payouts</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center">
                <ChartPie className="mr-2" size={20} />
                Payout Settings
              </div>
            </CardTitle>
            <CardDescription>Configure payout rates for different content types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">News Rate ($)</label>
                <Input 
                  type="number"
                  value={newsRate}
                  onChange={(e) => setNewsRate(Number(e.target.value))}
                  min={0}
                  step={0.1}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Blog Rate ($)</label>
                <Input 
                  type="number"
                  value={blogRate}
                  onChange={(e) => setBlogRate(Number(e.target.value))}
                  min={0}
                  step={0.1}
                />
              </div>
              
              <Button onClick={handleSaveRates} className="w-full">
                Save Rates
              </Button>

              <div>
                <label className="block text-sm font-medium mb-2">Payment Period</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>All time</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="range"
                      selected={date}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                    <div className="p-3 border-t border-border">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDateChange(undefined)}
                        className="w-full"
                      >
                        Clear Range
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Payout Summary</CardTitle>
                <CardDescription>
                  {date ? (
                    <>
                      Period: {format(date.from, "LLL dd, y")} - {format(date.to || date.from, "LLL dd, y")}
                      <br />
                    </>
                  ) : null}
                  Total Payout: ${totalPayout.toFixed(2)} for {payoutData.reduce((sum, item) => sum + item.newsCount + item.blogCount, 0)} articles
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2" size={16} />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('csv')}>
                    Export as CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            {payoutData.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Author</TableHead>
                    <TableHead className="text-right">News</TableHead>
                    <TableHead className="text-right">Blogs</TableHead>
                    <TableHead className="text-right">Total Articles</TableHead>
                    <TableHead className="text-right">Amount ($)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payoutData.map((item) => (
                    <TableRow key={item.author}>
                      <TableCell className="font-medium">{item.author}</TableCell>
                      <TableCell className="text-right">{item.newsCount}</TableCell>
                      <TableCell className="text-right">{item.blogCount}</TableCell>
                      <TableCell className="text-right">{item.newsCount + item.blogCount}</TableCell>
                      <TableCell className="text-right">${item.totalAmount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <FileX size={48} className="text-gray-300 mb-2" />
                <p className="text-gray-500">No payout data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payouts;
