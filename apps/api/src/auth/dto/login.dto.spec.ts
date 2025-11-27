import { validate } from 'class-validator';
import { LoginRequestDto } from './login.dto';

describe('LoginRequestDto', () => {
  let dto: LoginRequestDto;

  beforeEach(() => {
    dto = new LoginRequestDto();
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

  describe('rememberMe validation', () => {
    it('should validate rememberMe when true', async () => {
      dto.email = 'test@example.com';
      dto.password = 'TestPassword123!';
      dto.rememberMe = true;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate rememberMe when false', async () => {
      dto.email = 'test@example.com';
      dto.password = 'TestPassword123!';
      dto.rememberMe = false;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should allow rememberMe to be undefined (optional)', async () => {
      dto.email = 'test@example.com';
      dto.password = 'TestPassword123!';
      dto.rememberMe = undefined;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should reject rememberMe when not boolean', async () => {
      dto.email = 'test@example.com';
      dto.password = 'TestPassword123!';
      dto.rememberMe = 'true' as any;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('rememberMe');
    });
  });

  describe('combined validation', () => {
    it('should validate all required fields together', async () => {
      dto.email = 'test@example.com';
      dto.password = 'TestPassword123!';
      dto.rememberMe = false;
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
  });
});

