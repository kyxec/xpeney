import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AnalyticsPage() {
    const analyticsData = {
        overview: {
            totalVisitors: 24567,
            pageViews: 89234,
            bounceRate: 34.2,
            avgSessionDuration: "2m 34s"
        },
        topPages: [
            { page: "/dashboard", views: 12450, percentage: 32.1 },
            { page: "/projects", views: 8930, percentage: 23.0 },
            { page: "/analytics", views: 6780, percentage: 17.5 },
            { page: "/settings", views: 4560, percentage: 11.7 },
            { page: "/", views: 6050, percentage: 15.7 }
        ],
        trafficSources: [
            { source: "Direct", visitors: 8900, percentage: 36.2 },
            { source: "Google Search", visitors: 7234, percentage: 29.4 },
            { source: "Social Media", visitors: 4567, percentage: 18.6 },
            { source: "Email", visitors: 2345, percentage: 9.5 },
            { source: "Referrals", visitors: 1521, percentage: 6.2 }
        ]
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">
                    Track your website performance and user engagement
                </p>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analyticsData.overview.totalVisitors.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">+12.5% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analyticsData.overview.pageViews.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">+8.2% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analyticsData.overview.bounceRate}%</div>
                        <p className="text-xs text-muted-foreground">-2.1% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12,6 12,12 16,14" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analyticsData.overview.avgSessionDuration}</div>
                        <p className="text-xs text-muted-foreground">+0.3% from last month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Analytics */}
            <Tabs defaultValue="pages" className="w-full">
                <TabsList>
                    <TabsTrigger value="pages">Top Pages</TabsTrigger>
                    <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
                </TabsList>

                <TabsContent value="pages" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Most Visited Pages</CardTitle>
                            <CardDescription>
                                Your top performing pages this month
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analyticsData.topPages.map((page, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium">{page.page}</p>
                                                <p className="text-sm text-muted-foreground">{page.views.toLocaleString()} views</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{page.percentage}%</p>
                                            <div className="w-20 h-2 bg-secondary rounded-full">
                                                <div
                                                    className="h-2 bg-primary rounded-full"
                                                    style={{ width: `${page.percentage * 2}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="sources" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Traffic Sources</CardTitle>
                            <CardDescription>
                                Where your visitors are coming from
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analyticsData.trafficSources.map((source, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium">{source.source}</p>
                                                <p className="text-sm text-muted-foreground">{source.visitors.toLocaleString()} visitors</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{source.percentage}%</p>
                                            <div className="w-20 h-2 bg-secondary rounded-full">
                                                <div
                                                    className="h-2 bg-primary rounded-full"
                                                    style={{ width: `${source.percentage * 2}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}