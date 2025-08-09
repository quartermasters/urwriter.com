import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { OrgsModule } from './modules/orgs/orgs.module';
import { BrandGuidesModule } from './modules/brand-guides/brand-guides.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { ProposalsModule } from './modules/proposals/proposals.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { MilestonesModule } from './modules/milestones/milestones.module';
import { EscrowModule } from './modules/escrow/escrow.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { DeliveriesModule } from './modules/deliveries/deliveries.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { SearchModule } from './modules/search/search.module';
import { AdminModule } from './modules/admin/admin.module';
import { LabelingModule } from './modules/labeling/labeling.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { KycModule } from './modules/kyc/kyc.module';
import { RiskModule } from './modules/risk/risk.module';
import { QaModule } from './modules/qa/qa.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
    OrgsModule,
    BrandGuidesModule,
    JobsModule,
    ProposalsModule,
    ContractsModule,
    MilestonesModule,
    EscrowModule,
    MessagingModule,
    DeliveriesModule,
    ReviewsModule,
    SearchModule,
    AdminModule,
    LabelingModule,
    PaymentsModule,
    KycModule,
    RiskModule,
    QaModule,
  ],
})
export class AppModule {}
