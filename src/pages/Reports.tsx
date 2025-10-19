import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { therapists } from '../lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, Users, Award, Calendar, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

export function Reports() {
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month'>('today');

  const totalRevenue = therapists.reduce((sum, t) => sum + (t.todayCommission / (t.commissionRate / 100)), 0);
  const totalCommissions = therapists.reduce((sum, t) => sum + t.todayCommission, 0);
  const totalServes = therapists.reduce((sum, t) => sum + t.todayServes, 0);
  const avgCommissionRate = therapists.reduce((sum, t) => sum + t.commissionRate, 0) / therapists.length;

  const therapistData = therapists
    .map(t => ({
      name: t.name.split(' ')[0],
      serves: t.todayServes,
      revenue: (t.todayCommission / (t.commissionRate / 100)),
      commission: t.todayCommission,
      rate: t.commissionRate,
      rating: t.rating,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const serviceDistribution = [
    { name: 'Massage', value: 18, color: '#0FA3B1' },
    { name: 'Facial', value: 5, color: '#6FCF97' },
    { name: 'Body Treatment', value: 2, color: '#FFB020' },
  ];

  const weeklyData = [
    { day: 'Mon', revenue: 1200, serves: 15 },
    { day: 'Tue', revenue: 1450, serves: 18 },
    { day: 'Wed', revenue: 1100, serves: 14 },
    { day: 'Thu', revenue: 1650, serves: 21 },
    { day: 'Fri', revenue: 1850, serves: 23 },
    { day: 'Sat', revenue: 2100, serves: 28 },
    { day: 'Sun', revenue: 1900, serves: 25 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="text-muted-foreground">Daily commissions and service statistics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <div className="flex gap-1">
            <Button
              variant={dateRange === 'today' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange('today')}
            >
              Today
            </Button>
            <Button
              variant={dateRange === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange('week')}
            >
              Week
            </Button>
            <Button
              variant={dateRange === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange('month')}
            >
              Month
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-minatoh hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-secondary mt-1">
              +12.5% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="transition-minatoh hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Commissions</CardTitle>
            <TrendingUp className="w-5 h-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">${totalCommissions.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg rate: {avgCommissionRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card className="transition-minatoh hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Services Completed</CardTitle>
            <Users className="w-5 h-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg: ${(totalRevenue / totalServes).toFixed(2)} per service
            </p>
          </CardContent>
        </Card>

        <Card className="transition-minatoh hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Performer</CardTitle>
            <Award className="w-5 h-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{therapistData[0]?.name}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {therapistData[0]?.serves} serves today
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="therapists">Therapist Details</TabsTrigger>
          <TabsTrigger value="services">Service Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Therapist</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={therapistData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="#0FA3B1" name="Revenue ($)" />
                    <Bar dataKey="commission" fill="#6FCF97" name="Commission ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={serviceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {serviceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#0FA3B1" name="Revenue ($)" />
                  <Bar dataKey="serves" fill="#FFB020" name="Services" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="therapists" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Therapist Performance Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Therapist</TableHead>
                    <TableHead>Serves</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {therapists.map((therapist, index) => (
                    <TableRow 
                      key={therapist.id}
                      className="animate-stagger"
                      style={{ '--stagger-delay': index } as React.CSSProperties}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {therapist.name}
                          {therapist.isBestPerformer && (
                            <Badge variant="default" className="bg-accent text-accent-foreground text-xs">
                              Best
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{therapist.todayServes}</TableCell>
                      <TableCell>${((therapist.todayCommission / therapist.commissionRate) * 100).toFixed(2)}</TableCell>
                      <TableCell className="text-secondary">${therapist.todayCommission.toFixed(2)}</TableCell>
                      <TableCell>{therapist.commissionRate}%</TableCell>
                      <TableCell>{therapist.rating} ⭐</TableCell>
                      <TableCell>
                        <Badge
                          variant={therapist.status === 'available' ? 'secondary' : 'outline'}
                          className={therapist.status === 'available' ? 'bg-secondary' : ''}
                        >
                          {therapist.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rationale: Therapist Details View</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This tabular view provides a comprehensive breakdown of each therapist's performance metrics. 
                It enables fair, transparent comparison across all staff members. Managers can identify top performers 
                (marked with "Best" badges) and those who may need additional support. The rating column helps correlate 
                client satisfaction with revenue generation.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {serviceDistribution.map((service, index) => (
              <Card 
                key={service.name}
                className="animate-stagger"
                style={{ '--stagger-delay': index } as React.CSSProperties}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {service.name}
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: service.color }}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Booked</span>
                      <span className="font-medium">{service.value}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Revenue</span>
                      <span className="font-medium">${(service.value * 85).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg Duration</span>
                      <span className="font-medium">60 min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rationale: Service Breakdown View</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This view segments performance by service type, helping identify which services drive the most revenue 
                and popularity. Managers can use this data to adjust pricing, staff allocation, and marketing efforts. 
                The color-coded cards match the pie chart for visual consistency and quick pattern recognition.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
