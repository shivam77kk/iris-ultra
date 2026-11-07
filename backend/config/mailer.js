import dotenv from 'dotenv';
dotenv.config();

/**
 * Mock email service for development and hackathon testing.
 * Avoids SMTP auth failures when EMAIL_USER/EMAIL_PASS are not provided.
 */
export async function sendOTPEmail(email, name, otp) {
  console.log('\n======================================================');
  console.log(`📧 [MOCK EMAIL SERVICE] Verification Email for ${name}`);
  console.log(`📨 To: ${email}`);
  console.log(`🔑 OTP Code: ${otp} (Valid for 10 minutes)`);
  console.log('======================================================\n');
  return { messageId: `mock-${Date.now()}` };
}
