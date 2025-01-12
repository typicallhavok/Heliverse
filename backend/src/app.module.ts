import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { PatientsModule } from './patients/patients.module';
import { AlertsModule } from './alerts/alerts.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PantryModule } from './pantry/pantry.module';
import { DeliveryModule } from './delivery/delivery.module';

@Module({
  imports: [
    AuthModule, 
    PrismaModule, 
    DeliveriesModule, 
    PatientsModule, 
    AlertsModule,
    DashboardModule,
    PantryModule,
    DeliveryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
