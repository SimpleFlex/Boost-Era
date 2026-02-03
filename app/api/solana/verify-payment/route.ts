import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { PLANS, type PlanId } from "../../../lib/plans";

type Body = {
  signature: string;
  payer: string;
  plan: PlanId;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    const rpc = process.env.SOLANA_RPC_URL;
    const merchant = process.env.MERCHANT_WALLET;

    if (!rpc)
      return new NextResponse("Missing SOLANA_RPC_URL", { status: 500 });
    if (!merchant)
      return new NextResponse("Missing MERCHANT_WALLET", { status: 500 });

    const config = PLANS[body.plan];
    if (!config) return new NextResponse("Unknown plan", { status: 400 });

    const connection = new Connection(rpc, "confirmed");

    const sig = body.signature?.trim();
    if (!sig) return new NextResponse("Missing signature", { status: 400 });

    // Confirm transaction exists
    const tx = await connection.getParsedTransaction(sig, {
      maxSupportedTransactionVersion: 0,
      commitment: "confirmed",
    });

    if (!tx)
      return new NextResponse("Transaction not found/confirmed yet", {
        status: 400,
      });

    const merchantPk = new PublicKey(merchant).toBase58();
    const payerPk = new PublicKey(body.payer).toBase58();

    // Check instructions for a SystemProgram transfer to merchant
    const requiredLamports = Math.round(config.lamports);

    let paidLamports = 0;

    const ixs = tx.transaction.message.instructions;
    for (const ix of ixs) {
      // Parsed transfer from SystemProgram
      // structure: { program: 'system', parsed: { type: 'transfer', info: { source, destination, lamports } } }
      const anyIx = ix as unknown as {
        program?: string;
        parsed?: {
          type?: string;
          info?: { source?: string; destination?: string; lamports?: number };
        };
      };

      if (
        anyIx.program === "system" &&
        anyIx.parsed?.type === "transfer" &&
        anyIx.parsed.info?.destination === merchantPk &&
        anyIx.parsed.info?.source === payerPk
      ) {
        paidLamports += Number(anyIx.parsed.info.lamports ?? 0);
      }
    }

    if (paidLamports < requiredLamports) {
      return new NextResponse(
        `Underpaid. Paid ${paidLamports}, need ${requiredLamports}`,
        {
          status: 400,
        }
      );
    }

    // ✅ Payment verified (store to DB here if you want)
    return NextResponse.json({
      ok: true,
      paidLamports,
      requiredLamports,
      signature: sig,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return new NextResponse(msg, { status: 500 });
  }
}
