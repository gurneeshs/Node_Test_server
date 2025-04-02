const express = require("express");
const bodyParser = require("body-parser");
const { Signature } = require("liboqs-node");

const app = express();
app.use(bodyParser.json());

// Generate a Dilithium3 key pair
const signer = new Signature("Dilithium3");
const keypair = signer.generateKeypair();

console.log("🔑 Public Key:", keypair.publicKey.toString("hex"));

app.post("/sign_vote", (req, res) => {
    const { vote } = req.body;
    if (!vote) return res.status(400).json({ error: "No vote provided" });

    // Sign the vote
    const signature = signer.sign(Buffer.from(vote));

    res.json({
        vote,
        signature: signature.toString("hex"),
        public_key: keypair.publicKey.toString("hex")
    });
});

app.post("/verify_vote", (req, res) => {
    const { vote, signature, public_key } = req.body;
    if (!vote || !signature || !public_key) {
        return res.status(400).json({ error: "Missing vote, signature, or public key" });
    }

    try {
        // Verify the vote
        const isValid = signer.verify(Buffer.from(vote), Buffer.from(signature, "hex"), Buffer.from(public_key, "hex"));
        res.json({ vote, signature_valid: isValid });
    } catch (error) {
        res.status(500).json({ error: "Verification failed", details: error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
