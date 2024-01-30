import { Module } from '@nestjs/common';
import { RolesModule } from './roles/roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './roles/entities/role.entity';
import { MenusModule } from './menus/menus.module';
import { Menu } from './menus/entities/menu.entity';
import { SubMenu } from './menus/entities/submenu.entity';
import { JobsModule } from './jobs/jobs.module';
import { UsersModule } from './users/users.module';
import { Job } from './jobs/entities/job.entity';
import { JobAccess } from './jobs/entities/job_access.entity';
// import { JobActivity } from './jobs/entities/job_activity.entity';
import { User } from './users/entities/user.entity';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [RolesModule,TypeOrmModule.forRoot({
    type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'super_admin',
      entities: [Role,Menu,SubMenu,Menu,Job,JobAccess,User  ],
      synchronize: true
  }), MenusModule, JobsModule, UsersModule, JwtModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
