import { validate } from 'class-validator';
import { RegisterRequestDto } from './register.dto';

describe('RegisterRequestDto', () => {
  let dto: RegisterRequestDto;

  beforeEach(() => {
    dto = new RegisterRequestDto();
  });

  describe('email validation', () => {
    it('should validate valid email addresses', async () => {
      dto.email = 'test@example.com';
      dto.password = 'TestPassword123!';
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should reject invalid email addresses', async () => {
      dto.email = 'invalid-email';
      dto.password = 'TestPassword123!';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should reject empty email', async () => {
      dto.email = '';
      dto.password = 'TestPassword123!';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should reject missing email', async () => {
      dto.email = undefined as any;
      dto.password = 'TestPassword123!';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should reject email without @ symbol', async () => {
      dto.email = 'testexample.com';
      dto.password = 'TestPassword123!';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should reject email without domain', async () => {
      dto.email = 'test@';
      dto.password = 'TestPassword123!';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });
  });

  describe('password validation', () => {
    it('should validate valid passwords', async () => {
      dto.email = 'test@example.com';
      dto.password = 'TestPassword123!';
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should reject empty password', async () => {
      dto.email = 'test@example.com';
      dto.password = '';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
    });

    it('should reject missing password', async () => {
      dto.email = 'test@example.com';
      dto.password = undefined as any;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
    });

    it('should validate password is string', async () => {
      dto.email = 'test@example.com';
      dto.password = 'TestPassword123!' as any;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('name validation', () => {
    it('should validate name max length (200 characters)', async () => {
      dto.email = 'test@example.com';
      dto.password = 'TestPassword123!';
      dto.name = 'a'.repeat(200);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should reject name exceeding max length (201 characters)', async () => {
      dto.email = 'test@example.com';
      dto.password = 'TestPassword123!';
      dto.name = 'a'.repeat(201);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
    });

    it('should allow name to be undefined (optional)', async () => {
      dto.email = 'test@example.com';
      dto.password = 'TestPassword123!';
      dto.name = undefined;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should allow name to be empty string', async () => {
      dto.email = 'test@example.com';
      dto.password = 'TestPassword123!';
      dto.name = '';
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate name is string', async () => {
      dto.email = 'test@example.com';
      dto.password = 'TestPassword123!';
      dto.name = 'Valid Name' as any;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('phone validation', () => {
    it('should validate phone max length (50 characters)', async () => {
      dto.email = 'test@example.com';
      dto.password = 'TestPassword123!';
      dto.phone = '1'.repeat(50);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should reject phone exceeding max length (51 characters)', async () => {
      dto.email = 'test@example.com';
      dto.password = 'TestPassword123!';
      dto.phone = '1'.repeat(51);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('phone');
    });

    it('should allow phone to be undefined (optional)', async () => {
      dto.email = 'test@example.com';
      dto.password = 'TestPassword123!';
      dto.phone = undefined;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should allow phone to be empty string', async () => {
      dto.email = 'test@example.com';
      dto.password = 'TestPassword123!';
      dto.phone = '';
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate phone is string', async () => {
      dto.email = 'test@example.com';
      dto.password = 'TestPassword123!';
      dto.phone = '1234567890' as any;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('combined validation', () => {
    it('should validate all required fields together', async () => {
      dto.email = 'test@example.com';
      dto.password = 'TestPassword123!';
      dto.name = 'Test User';
      dto.phone = '1234567890';
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with optional fields omitted', async () => {
      dto.email = 'test@example.com';
      dto.password = 'TestPassword123!';
      dto.name = undefined;
      dto.phone = undefined;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation if any required field is missing', async () => {
      dto.email = undefined as any;
      dto.password = undefined as any;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation if email is invalid', async () => {
      dto.email = 'invalid-email';
      dto.password = 'TestPassword123!';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should fail validation if password is missing', async () => {
      dto.email = 'test@example.com';
      dto.password = undefined as any;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
    });

    it('should fail validation if any optional field exceeds max length', async () => {
      dto.email = 'test@example.com';
      dto.password = 'TestPassword123!';
      dto.name = 'a'.repeat(201);
      dto.phone = '1'.repeat(51);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});

