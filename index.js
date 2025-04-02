require("dotenv").config();
const express = require("express");
const oqs = require("liboqs-node");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

// Generate a Dilithium3 key pair
const keypair = oqs.Signature.generateKeypair("Dilithium3");
const publicKey = keypair.publicKey;
const privateKey = keypair.secretKey;

// Route to sign a vote
app.post("/sign_vote", (req, res) => {
    const { vote } = req.body;

    if (!vote) {
        return res.status(400).json({ error: "No vote provided" });
    }

    const signature = oqs.Signature.sign("Dilithium3", vote, privateKey);
    res.json({
        vote,
        signature: Buffer.from(signature).toString("hex"),
        public_key: Buffer.from(publicKey).toString("hex"),
    });
});

// Route to verify a vote signature
app.post("/verify_vote", (req, res) => {
    const { vote, signature, public_key } = req.body;

    if (!vote || !signature || !public_key) {
        return res.status(400).json({ error: "Missing vote, signature, or public key" });
    }

    const isValid = oqs.Signature.verify(
        "Dilithium3",
        vote,
        Buffer.from(signature, "hex"),
        Buffer.from(public_key, "hex")
    );

    res.json({ vote, signature_valid: isValid });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
