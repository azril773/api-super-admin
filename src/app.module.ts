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
import { AuthModule } from './auth/auth.module';
import { ImageModule } from './image/image.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JobActivity } from './jobs/entities/job_activity.entity';
import { JobAccessesModule } from './jobs/job_accesses/job_accesses.module';
import { JobActivitiesModule } from './jobs/job_activities/job_activities.module';
import { SubmenuModule } from './menus/submenu/submenu.module';
import { TestModule } from './test.module';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/entities/task.entity';
import { AnswersModule } from './answers/answers.module';
import { Answer } from './answers/entities/answer.entity';
import { MongoClient } from 'mongodb';
import { PgModule } from './tasks/pg/pg.module';
import { DatabaseModule } from './database.module';
import { AbsentModule } from './absent/absent.module';
import { ScheduleModule } from '@nestjs/schedule';
import { Absent } from './absent/entities/absent.entity';
import { PeriodeModule } from './periode/periode.module';
import { ClassModule } from './student/class/class.module';
import { MasterClassModule } from './student/master-class/master-class.module';
import { StudentClassModule } from './student/student-class/student-class.module';
import { StudentModule } from './student/student/student.module';
import { Class } from './student/class/entities/class.entity';
import { MasterClass } from './student/master-class/entities/master-class.entity';
import { Periode } from './periode/entities/periode.entity';
import { StudentClass } from './student/student-class/entities/student-class.entity';
import { Student } from './student/student/entities/student.entity';
import { MapelModule } from './mapel/mapel.module';
import { Mapel } from './mapel/entity/mapel.entity';
import { Pg } from './tasks/pg/entities/pg.entity';

@Module({
  imports: [ServeStaticModule.forRoot({ 
    rootPath: join(__dirname, '../..', 'public'),
  }),MulterModule.register(),ScheduleModule.forRoot(),RolesModule,TypeOrmModule.forRoot({
    type: 'mysql',
      host: 'localhost',  
      port: 3306,
      username: 'root',
      password: '',
      database: 'super_admin',
      entities: [Class,Periode,StudentClass,Role,Menu,SubMenu,Job,JobAccess,User,JobActivity,Task,Answer,Absent,MasterClass,Student,Mapel,Pg], 
      synchronize: true
  }), MenusModule,SubmenuModule, JobsModule, UsersModule, JwtModule, JobAccessesModule,JobActivitiesModule,AuthModule,ImageModule,TestModule, TasksModule, AnswersModule, PgModule,DatabaseModule, AbsentModule, PeriodeModule, ClassModule, MasterClassModule, StudentClassModule, StudentModule,MapelModule],
  controllers: [],
  providers: [],
  exports:[]
})
export class AppModule {}
