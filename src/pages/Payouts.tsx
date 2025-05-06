
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePayout, PayoutData } from '../context/PayoutContext';
import { useNews } from '../context/NewsContext';
import { ChartPie, Download, FileX } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Payouts: React.FC = () => {
  const { payoutRates, updateRates, calculatePayouts, exportPayouts } = usePayout();
  const { filteredArticles } = useNews();
  
  const [newsRate, setNewsRate] = useState<number>(payoutRates.newsRate);
  const [blogRate, setBlogRate] = useState<number>(payoutRates.blogRate);
  
  const payoutData = calculatePayouts(filteredArticles);
  const totalPayout = payoutData.reduce((sum, item) => sum + item.totalAmount, 0);
  
  const handleSaveRates = () => {
    updateRates({ newsRate, blogRate });
  };
  
  const handleExport = (format: 'pdf' | 'csv') => {
    exportPayouts(format);
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
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Payout Summary</CardTitle>
                <CardDescription>
                  Total Payout: ${totalPayout.toFixed(2)} for {filteredArticles.length} articles
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
