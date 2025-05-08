
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CardSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
}

const CardSection = ({
  title,
  children,
  className,
  titleClassName,
  contentClassName,
}: CardSectionProps) => {
  return (
    <Card className={cn("border-[#2A3348] bg-[#1A1E2C] shadow-md", className)}>
      <CardHeader className="pb-2">
        <CardTitle className={cn("text-lg font-medium text-white", titleClassName)}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={cn("pt-2", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
};

export default CardSection;
