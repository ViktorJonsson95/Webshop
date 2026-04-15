import express from "express";
import cors from "cors";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./serviceAccountKey.json" with {type: "json"};

initializeApp ({
    credential: cert(serviceAccount),
});

const db = getFirestore();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;


app.post("/api/addProduct", async (req, res) => {
    try {
        const productData = req.body;

        if(!productData.name || !productData.price) {
            return res.status(400).json ({
                error: "Namn och pris på produkt är obligatoriskt!"
            });
        }

        const docref = await db.collection("products").add(productData);

        res.status(201).json ({
            message: "produkt skapad!",
            id: docref.id,
            product: productData,
        });

    } catch (error) {
        res.status(500).json({ error: "serverfel uppstod vid tillägg av produkt." });
    }
});

app.post("/api/products/bulk", async (req, res) => {
    try {
        const productsArray = req.body;

        if(!Array.isArray(productsArray)) {
            return res.status(400).json ({
                error: "Body måste vara en JSON-array.",
            });
        }

        const batch = db.batch();

        productsArray.forEach(product => {
            const docref = db.collection("products").doc();
            batch.set(docref, product);
        });

        await batch.commit();

        res.status(201).json ({
            message: `${productsArray.length} produkter tillagda!`
        });

    } catch (error) {
        res.status(500).json({ error: "serverfel uppstod vid batch" });
    }
});

app.get("/api/products", async (req, res) => {
    try {
        const snapshot = await db.collection("products").get();

        const products = snapshot.docs.map((productDoc) => ({
            id: productDoc.id,
            ...productDoc.data()
        }));

        res.json(products);

    } catch (error) {
        res.status(500).json ({ error: "serverfel uppstod vid hämtning av produkter" });
    }
});

app.get("/api/products/:id", async (req, res) => {
    try {
        const doc = await db
        .collection("products")
        .doc(req.params.id)
        .get();

        if (!doc.exists) {
            return res.status(404).json ({
                error: "produkten hittades inte."
            });
        }

        res.json ({
            id: doc.id,
            ...doc.data(),
        });

    } catch (error) {
        res.status(500).json ({ error: "serverfel vid hämtning av specifik produkt." })
    }
});

app.listen(3000, () => {
    console.log("server körs på http://localhost:3000")
});