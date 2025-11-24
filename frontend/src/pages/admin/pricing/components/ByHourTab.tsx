import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '../../../../../../frontend/src/components/my-card/components/ui/card';

export default function ByHourTab() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>By Hour</CardTitle>
                <CardDescription>
                    Configure hourly pricing and special time windows
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-sm text-gray-600">
                    Hourly pricing editor - coming soon.
                </div>
            </CardContent>
        </Card>
    );
}
