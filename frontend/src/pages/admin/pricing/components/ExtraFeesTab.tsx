import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '../../../../../../frontend/src/components/my-card/components/ui/card';

export default function ExtraFeesTab() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Extra Fees</CardTitle>
                <CardDescription>
                    Configure additional fees (cleaning, services, etc.)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-sm text-gray-600">
                    Extra fees editor - coming soon.
                </div>
            </CardContent>
        </Card>
    );
}
