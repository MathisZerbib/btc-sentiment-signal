import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface DCARecommendationProps {
  shouldDCA: boolean;
  reason: string;
}

export const DCARecommendation = ({ shouldDCA, reason }: DCARecommendationProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-mono">DCA Recommendation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            {shouldDCA ? (
              <Badge className="bg-success text-white flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                Recommended
              </Badge>
            ) : (
              <Badge className="bg-warning text-white flex items-center gap-2">
                <ThumbsDown className="w-4 h-4" />
                Not Recommended
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground text-center">{reason || "No recommendation available."}</p>  
        </div>
      </CardContent>
    </Card>
  );
};