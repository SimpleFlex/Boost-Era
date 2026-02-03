// lib/wallet-utils.ts

interface SolanaProvider {
  signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }>;
}

/**
 * Sign a message using the connected Solana wallet
 */
export async function signMessage(
  walletAddress: string,
  message: string
): Promise<string> {
  try {
    // Check if wallet is available (browser environment)
    if (typeof window === "undefined") {
      throw new Error("Wallet signing not available on server");
    }

    const provider = (window as unknown as { solana?: SolanaProvider }).solana;

    if (!provider) {
      throw new Error(
        "Solana wallet not found. Please install Phantom or Solflare."
      );
    }

    // Encode message to bytes
    const encodedMessage = new TextEncoder().encode(message);

    // Request signature from wallet
    const result = await provider.signMessage(encodedMessage);

    if (!result || !result.signature) {
      throw new Error("Failed to sign message");
    }

    console.log("✓ Message signed successfully");

    // Convert Uint8Array to string
    const signatureArray = new Uint8Array(result.signature);
    const signatureString = Array.from(signatureArray)
      .map((byte) => String.fromCharCode(byte))
      .join("");

    return btoa(signatureString); // Base64 encode
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("Sign message error:", errorMsg);
    throw new Error(`Failed to sign message: ${errorMsg}`);
  }
}

/**
 * Verify a signed message (for backend use)
 */
export async function verifySignedMessage(
  walletAddress: string,
  message: string,
  signature: string
): Promise<boolean> {
  try {
    const response = await fetch("/api/verify-signature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress, message, signature }),
    });

    const data = await response.json();
    return data.valid === true;
  } catch (error) {
    console.error("Verification error:", error);
    return false;
  }
}
