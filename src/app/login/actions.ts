"use server";

// For demo purposes, we'll use a simple in-memory store
// In a real app, you would use a database
const verificationCodes: Record<string, { code: string; expires: number }> = {};

// Function to clean up expired codes (would be handled by a database in production)
function cleanupExpiredCodes() {
  const now = Date.now();
  Object.keys(verificationCodes).forEach((email) => {
    if (verificationCodes[email].expires < now) {
      delete verificationCodes[email];
    }
  });
}

export async function sendVerificationCode(email: string) {
  try {
    // Clean up expired codes
    cleanupExpiredCodes();

    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the code with a 10-minute expiration
    verificationCodes[email] = {
      code,
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    // Log the code for demo purposes
    console.log(`DEMO MODE: Verification code for ${email} is ${code}`);

    return {
      success: true,
      code: process.env.NODE_ENV === "development" ? code : undefined,
    };
  } catch (error) {
    console.error("Error sending verification code:", error);
    throw new Error("Failed to send verification code. Please try again.");
  }
}

export async function verifyCode(email: string, code: string) {
  try {
    // Clean up expired codes
    cleanupExpiredCodes();

    // Get the stored code
    const storedData = verificationCodes[email];

    if (!storedData) {
      console.log(`No verification code found for ${email}`);
      throw new Error(
        "Verification code expired or not found. Please request a new one."
      );
    }

    if (storedData.expires < Date.now()) {
      console.log(`Verification code for ${email} has expired`);
      delete verificationCodes[email];
      throw new Error(
        "Verification code has expired. Please request a new one."
      );
    }

    if (storedData.code !== code) {
      console.log(
        `Invalid verification code for ${email}. Expected ${storedData.code}, got ${code}`
      );
      throw new Error("Invalid verification code. Please try again.");
    }

    // Clear the code after successful verification
    delete verificationCodes[email];

    return { success: true };
  } catch (error) {
    console.error("Error verifying code:", error);
    throw error;
  }
}

// For demo purposes, expose a function to get all active codes
export async function getActiveCodesForDemo() {
  if (process.env.NODE_ENV !== "development") {
    return { codes: [] };
  }

  cleanupExpiredCodes();
  return {
    codes: Object.entries(verificationCodes).map(([email, data]) => ({
      email,
      code: data.code,
      expires: new Date(data.expires).toISOString(),
    })),
  };
}
