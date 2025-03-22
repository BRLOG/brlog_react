import { ReactNode } from 'react';

export interface ExperimentType {
    id: string;
    name: string;
    icon: ReactNode;
    description: string;
}