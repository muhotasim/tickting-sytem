import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../models/user.model';
import { hashPassword } from '../../../utils/common.functions';
import { Repository } from 'typeorm';
import { Role } from '../../../models/role.model';
import { Permission } from '../../../models/permissions.model';
import { Seeder } from 'nestjs-seeder';
import slugify from 'slugify';

@Injectable()
export class SeederService implements Seeder {
  constructor(
    @InjectRepository(User)
    private readonly _m_User: Repository<User>,
    @InjectRepository(Role)
    private readonly _m_Role: Repository<Role>,
    @InjectRepository(Permission)
    private readonly _m_Permission: Repository<Permission>
  ) { }
  drop(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async seed(): Promise<void> {
    console.log('seeding permissions')
    await this.seedPermissions();
    console.log('permissions seeded')
    console.log('seeding roles')
    await this.seedRole();
    console.log('roles seeded')
    console.log('seeding users')
    await this.seedUser();
    console.log('users seeded')
  }

  private async seedPermissions(): Promise<void> {
    let permission = [
      { name: 'Can Get Permission With Count', permission_key: '', is_active: true },
      { name: 'Can Get All Permissions', permission_key: '', is_active: true },
      { name: 'Can Create Permission', permission_key: '', is_active: true },
      { name: 'Can Update Permission', permission_key: '', is_active: true },
      { name: 'Can Get Single Permission', permission_key: '', is_active: true },
      { name: 'Can Delete Permission', permission_key: '', is_active: true },

      { name: 'Can Get Roles With Count', permission_key: '', is_active: true },
      { name: 'Can Get All Roles', permission_key: '', is_active: true },
      { name: 'Can Create Role', permission_key: '', is_active: true },
      { name: 'Can Update Role', permission_key: '', is_active: true },
      { name: 'Can Get Single Role', permission_key: '', is_active: true },
      { name: 'Can Delete Role', permission_key: '', is_active: true },

      { name: 'Can Get Users With Count', permission_key: '', is_active: true },
      { name: 'Can Create User', permission_key: '', is_active: true },
      { name: 'Can Update User', permission_key: '', is_active: true },
      { name: 'Can Get Single User', permission_key: '', is_active: true },
      { name: 'Can Delete User', permission_key: '', is_active: true },
      { name: 'Can Control Access', permission_key: '', is_active: true },
      { name: 'Can See Dashboard', permission_key: '', is_active: true },
    ].map(d => {
      d.permission_key = slugify(d.name.toLowerCase(), { lower: true, trim: true })
      return d;
    })
    await this._m_Permission.save(permission);

  }

  private async seedRole(): Promise<void> {
    let roles = [
      { id: 1, name: 'Superadmin', is_active: true }
    ]
    await this._m_Role.save(roles);
  }

  private async seedUser(): Promise<void> {
    const roles = await this._m_Role.find({ where: { id: 1 } })
    let users = [
      { name: 'superadmin', email: 'admin@gmail.com', is_active: true, is_superadmin: true, password: await hashPassword('123456'), roles: roles }
    ]
    await this._m_User.save(users);

  }

}
