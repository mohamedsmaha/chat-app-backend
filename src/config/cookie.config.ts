import { registerAs } from '@nestjs/config';

export default registerAs('cookie', () => {
  const mode = process.env.SERVER_MODE;

  switch (mode) {
    case 'local':
      return {
        secure: false,
        sameSite: 'lax' as const,
      };

    case 'same-server':
      return {
        secure: true,
        sameSite: 'lax' as const,
      };

    case 'separate':
      return {
        secure: true,
        sameSite: 'none' as const,
      };

    default:
      throw new Error(
        `Invalid SERVER_MODE: ${mode}`,
      );
  }
});