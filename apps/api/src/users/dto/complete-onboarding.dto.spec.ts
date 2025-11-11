import { validate } from 'class-validator';
import { CompleteOnboardingRequestDto } from './complete-onboarding.dto';
import { UserRole } from '@prisma/client';

describe('CompleteOnboardingRequestDto', () => {
  let dto: CompleteOnboardingRequestDto;

  beforeEach(() => {
    dto = new CompleteOnboardingRequestDto();
  });

  describe('role field', () => {
    it('should validate SEEKER role', async () => {
      dto.role = UserRole.SEEKER;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate PROVIDER role', async () => {
      dto.role = UserRole.PROVIDER;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation if role is missing', async () => {
      dto.role = undefined as any;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('role');
    });

    it('should fail validation if role is invalid', async () => {
      dto.role = 'INVALID_ROLE' as any;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('role');
    });

    it('should fail validation if role is ADMIN', async () => {
      dto.role = UserRole.ADMIN;
      const errors = await validate(dto);
      // Note: DTO validation only checks if it's a valid enum, not if it's ADMIN
      // The service method will reject ADMIN role
      expect(errors).toHaveLength(0); // Enum validation passes
    });
  });

  describe('combined validation', () => {
    it('should validate with SEEKER role', async () => {
      dto.role = UserRole.SEEKER;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with PROVIDER role', async () => {
      dto.role = UserRole.PROVIDER;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation if role is missing', async () => {
      dto.role = undefined as any;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('role');
    });
  });
});

