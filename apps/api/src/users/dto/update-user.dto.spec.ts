import { validate } from 'class-validator';
import { UpdateUserRequestDto } from './update-user.dto';
import { UserRole } from '@prisma/client';

describe('UpdateUserRequestDto', () => {
  let dto: UpdateUserRequestDto;

  beforeEach(() => {
    dto = new UpdateUserRequestDto();
  });

  describe('role validation', () => {
    it('should validate role enum (SEEKER)', async () => {
      dto.role = UserRole.SEEKER;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate role enum (PROVIDER)', async () => {
      dto.role = UserRole.PROVIDER;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate role enum (ADMIN)', async () => {
      dto.role = UserRole.ADMIN;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should reject invalid role values', async () => {
      dto.role = 'INVALID_ROLE' as UserRole;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('role');
    });

    it('should allow role to be undefined (optional)', async () => {
      dto.role = undefined;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('name validation', () => {
    it('should validate name max length (200 characters)', async () => {
      dto.name = 'a'.repeat(200);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should reject name exceeding max length (201 characters)', async () => {
      dto.name = 'a'.repeat(201);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
    });

    it('should allow name to be undefined (optional)', async () => {
      dto.name = undefined;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should allow name to be empty string', async () => {
      dto.name = '';
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate name is string', async () => {
      dto.name = 'Valid Name' as any;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('phone validation', () => {
    it('should validate phone max length (50 characters)', async () => {
      dto.phone = '1'.repeat(50);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should reject phone exceeding max length (51 characters)', async () => {
      dto.phone = '1'.repeat(51);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('phone');
    });

    it('should allow phone to be undefined (optional)', async () => {
      dto.phone = undefined;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should allow phone to be empty string', async () => {
      dto.phone = '';
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate phone is string', async () => {
      dto.phone = '1234567890' as any;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('locale validation', () => {
    it('should validate locale max length (10 characters)', async () => {
      dto.locale = 'a'.repeat(10);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should reject locale exceeding max length (11 characters)', async () => {
      dto.locale = 'a'.repeat(11);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('locale');
    });

    it('should allow locale to be undefined (optional)', async () => {
      dto.locale = undefined;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should allow locale to be empty string', async () => {
      dto.locale = '';
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate locale is string', async () => {
      dto.locale = 'en' as any;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('partial updates', () => {
    it('should allow all fields to be optional', async () => {
      dto.role = undefined;
      dto.name = undefined;
      dto.phone = undefined;
      dto.locale = undefined;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should allow single field updates', async () => {
      dto.role = UserRole.PROVIDER;
      dto.name = undefined;
      dto.phone = undefined;
      dto.locale = undefined;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should allow multiple field updates', async () => {
      dto.role = UserRole.PROVIDER;
      dto.name = 'Test User';
      dto.phone = '1234567890';
      dto.locale = 'en';
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('combined validation', () => {
    it('should validate all fields together', async () => {
      dto.role = UserRole.SEEKER;
      dto.name = 'Test User';
      dto.phone = '1234567890';
      dto.locale = 'en';
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation if any field is invalid', async () => {
      dto.role = 'INVALID' as UserRole;
      dto.name = 'a'.repeat(201);
      dto.phone = '1'.repeat(51);
      dto.locale = 'a'.repeat(11);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});

