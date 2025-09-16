import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
    const projects = [
        {
            id: 1,
            name: "E-commerce Platform",
            description: "Modern online shopping platform with React and Node.js",
            status: "active",
            progress: 75,
            team: 5,
            dueDate: "2024-12-15"
        },
        {
            id: 2,
            name: "Mobile App Redesign",
            description: "Complete UI/UX overhaul for iOS and Android applications",
            status: "planning",
            progress: 25,
            team: 3,
            dueDate: "2024-11-30"
        },
        {
            id: 3,
            name: "Analytics Dashboard",
            description: "Real-time data visualization and reporting system",
            status: "active",
            progress: 60,
            team: 4,
            dueDate: "2024-10-20"
        },
        {
            id: 4,
            name: "API Integration",
            description: "Third-party service integration and data synchronization",
            status: "completed",
            progress: 100,
            team: 2,
            dueDate: "2024-09-15"
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-500';
            case 'planning': return 'bg-yellow-500';
            case 'completed': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                <p className="text-muted-foreground">
                    Manage and track your project progress
                </p>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <Badge variant="secondary">Active: 2</Badge>
                    <Badge variant="secondary">Planning: 1</Badge>
                    <Badge variant="secondary">Completed: 1</Badge>
                </div>
                <Button>New Project</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {projects.map((project) => (
                    <Card key={project.id} className="w-full">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg">{project.name}</CardTitle>
                                    <CardDescription>{project.description}</CardDescription>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className={`${getStatusColor(project.status)} text-white`}
                                >
                                    {project.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Progress</span>
                                    <span>{project.progress}%</span>
                                </div>
                                <div className="w-full bg-secondary rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${project.progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4"
                                    >
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                    {project.team} team members
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4"
                                    >
                                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                    Due {project.dueDate}
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" size="sm" className="flex-1">
                                    View Details
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                    Edit
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}