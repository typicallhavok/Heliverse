import { CreateDietChartDto } from './create-diet-chart.dto';

export class CreatePatientDto {
    name: string;
    room: number;
    bed: number;
    floor: number;
    age: number;
    diseases: string[];
    allergies: string[];
    contact: string;
    emergencyContact: string;
    dietChart: CreateDietChartDto;
} 