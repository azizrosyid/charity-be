import express from "express";
import logger from "morgan";
import * as path from "path";

import { errorHandler, errorNotFoundHandler } from "./middlewares/errorHandler";

// Routes
import Reclaim, {
    transformForOnchain,
    verifyProof,
} from "@reclaimprotocol/js-sdk";
import { ReclaimClient } from "@reclaimprotocol/zk-fetch";
// Create Express server
export const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/verify", async (req, res) => {
    return res.send("true");
});
app.post("/proof", async (req, res) => {
    console.log("invoice", req.body);
    const invoice = req.body.invoice;

    if (!invoice) {
        return res.status(400).send("No invoice provided.");
    }

    const client = new ReclaimClient(
        "0x350B82F6E71f20f205B9E250ec46231dFF9f1F72",
        "0xc5f363598e409e8bd81b24b393c0815ecf2c780ae00ce4cf3e485185870662f3",
    );

    const publicOptions = {
        method: "GET",
        headers: {
            accept: "application/json, text/plain, */*",
        },
    };
    // baseurl from this express server
    const proof = await client.zkFetch(
        "http://localhost:3000/verify",
        publicOptions,
        {
            responseMatches: [
                {
                    type: "regex",
                    value: "true",
                },
            ],
        },
    );

    const isProofVerified = await verifyProof(proof);

    const proofData = transformForOnchain(proof);

    return res.json({
        proofData,
        isProofVerified,
    });
});

app.use(errorNotFoundHandler);
app.use(errorHandler);
